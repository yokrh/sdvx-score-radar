/**
 * Get normalized name.
 * It's based on the function in fetch_fumen_site_track_data.js
 */
function getNormalizedName(name) {
  if (!name) return ''
  return name
    .replace(/ /g, '')
    .replace(/"/g, '')
    .replace(/'/g, '')
    .replace(/#/g, '')
    .replace(/=/g, '')
    .replace(/\(/g, '')
    .replace(/\)/g, '')
    .replace(/:/g, '')
    .replace(/_/g, '')
    .replace(/”/g, '')
    .replace(/’/g, '')
    .replace(/♯/g, '')
    .replace(/＝/g, '')
    .replace(/（/g, '')
    .replace(/）/g, '')
    .replace(/：/g, '')
}

class TrackDataUtil {
  /**
   * Merge the track data from fumensite
   * and the track data from scorerader.
   */
  static getMergedTrackData(scoreRaderTracks, fumenSiteTrackList) {
    const tracks = scoreRaderTracks
    const trackList = fumenSiteTrackList

    const mergedTrackData = tracks.map((trackWithChartData) => {
      const trackWithFumenSiteData = trackList.find((t) => {
        const a = getNormalizedName(t.name)
        const b = getNormalizedName(trackWithChartData.name)
        return a === b
      })
      return Object.assign(trackWithChartData, trackWithFumenSiteData)
    })
    .filter(t => t.id !== undefined) // Deleted from Fumen site

    return mergedTrackData
  }
}

module.exports = TrackDataUtil
