require('dotenv').config()

const GCS = require('../../../common/gcs')
const LocalFileUtil = require('../../../common/local-file-util')
const TrackDataUtil = require('../../../common/track-data-util')

const DATA_BUCKET_NAME = process.env.DATA_BUCKET_NAME
const TRACK_LIST_BUCKET_FOLDER_NAME = process.env.TRACK_LIST_BUCKET_FOLDER_NAME
const TRACK_BUCKET_FOLDER_NAME = process.env.TRACK_BUCKET_FOLDER_NAME


/**
 * Connector class for track.
 */
class TrackConnector {
  /**
   * Get a track list.
   */
  static async fetchTracks(input, first, offset) {
    if (!input || !input.level) {
      return []
    }

    return this.fetchTracksByLevel(input.level, first, offset)
  }

  /**
   * Get a track list by level.
   */
  static async fetchTracksByLevel(level, first = 100, offset = 0) {
    if (!level) return []
    if (first <= 0) return []

    // Fumensite track list
    const trackListFileObjPath = `${TRACK_LIST_BUCKET_FOLDER_NAME}/${level}.json`
    const trackListFilePath = await GCS.downloadFile(DATA_BUCKET_NAME, trackListFileObjPath)
      .catch(() => [])
    const trackList = Object.values(LocalFileUtil.readJson(trackListFilePath))

    // Scorerader tracks
    const trackFileObjPaths = await GCS.getFileObjPathsbyFolder(DATA_BUCKET_NAME, TRACK_BUCKET_FOLDER_NAME)
      .then(paths => paths.filter(path => path.includes(`/${level}_`)))
      .catch(() => [])
    const trackFilePaths = await GCS.downloadFiles(DATA_BUCKET_NAME, trackFileObjPaths)
      .catch(() => [])
    const tracks = trackFilePaths.map(path => LocalFileUtil.readJson(path))

    return TrackDataUtil.getMergedTrackData(tracks, trackList)
  }

  /**
   * Get a track.
   * @deprecated
   */
  static async fetchTrack(id) {
    return null
  }

  /**
   * Reference of Track data property: sdvx-score-rader-app/pages/track/TrackData.js
   * @deprecated
   */
  static async updateTrack(args) {
    return null
  }
}

/**
 * Connector class to simplify local development.
 */
class LocalTrackConnector extends TrackConnector {
  /**
   * Fetch a track by id.
   * Assuming it's async function in real case.
   * @override
   */
  static fetchTrack(id) {
    const res = LocalTrackConnector.fetchTracksByLevel({ level: 18 })
    return res[0]
  }

  /**
   * Fetch tracks by level.
   * Assuming it's async function in real case.
   * @override
   */
  static fetchTracksByLevel(level, first = 100, offset = 0) {
    if (!level) return []

    const trackList = LocalTrackConnector.fetchTrackList(level)

    const pathPattern = `data/track/${level}_*.json`
    const paths = LocalFileUtil.getPathsFromPathPattern(pathPattern)
    const tracks = paths.map(path => LocalFileUtil.readJson(path))

    const mergedTrackData = TrackDataUtil.getMergedTrackData(tracks, trackList)

    return mergedTrackData.splice(offset, first)
  }

  /**
   * Fetch a track list by level.
   * Assuming it's async function in real case.
   */
  static fetchTrackList(level) {
    if (!level) return []

    const path = `data/track_list/${level}.json`
    const trackList = Object.values(LocalFileUtil.readJson(path))
    return trackList
  }
}

const connector = process.env.ENV === process.env.ENV_DEV ? LocalTrackConnector : TrackConnector
module.exports = connector
