// For creating a temporary directory which stores download file from GCP
const fs = require('fs')
const DEFAULT_DEST_DIR = process.env.TMP_DIR

// Imports the Google Cloud client library
const { Storage } = require('@google-cloud/storage')
// Creates a client from a Google service account key.
const keyFile = process.env.ENV_DEV
  ? process.env.SA_DATA_CREDENTIALS_PATH_DEV
  : process.env.SA_DATA_CREDENTIALS_PATH_PRD
const storage = new Storage({ keyFilename: keyFile })

/**
 * Google Cloud Storage service.
 */
class GCS {
  /**
   * Download a file.
   * Example: downloadFile('data/track_list/16.json').catch(console.error)
   */
  static async downloadFile(bucketName, bucketObjPath, destDir = DEFAULT_DEST_DIR) {
    const srcFilename = bucketObjPath
    const destFilename = `${destDir}/${srcFilename}`

    const destFileDirectoryPath = destFilename.match(/(.*)\//)[1]
    if (!fs.existsSync(destFileDirectoryPath)) {
      console.log('create the dest dir', destFileDirectoryPath)
      await fs.mkdirSync(destFileDirectoryPath, { recursive: true })
    }

    const options = { destination: destFilename }
    await storage.bucket(bucketName).file(srcFilename).download(options)
      .catch((err) => {
        console.error('downloadFile error:', srcFilename)
        console.error(err)
        throw new Error('downloadFile error')
      })

    return destFilename
  }

  /**
   * Download files.
   */
  static async downloadFiles(bucketName, bucketObjPaths, destDir = DEFAULT_DEST_DIR) {
    const promises = bucketObjPaths.map((path) => {
      return this.downloadFile(bucketName, path, destDir)
    })
    const destFilenames = await Promise.all(promises)
      .catch((err) => {
        throw new Error('downloadFiles error')
      })

    return destFilenames
  }

  /**
   * List files in a folder.
   */
  static async getFileObjPathsbyFolder(bucketName, folder = '/') {
    if (!bucketName) return []
    if (!folder) return []

    const prefix = `${folder}${folder[folder.length - 1] === '/' ? '' : '/'}`
    const options = { prefix }
    const filesResponse = await storage.bucket(bucketName).getFiles(options)
      .catch((err) => {
        console.error('getFileObjPathsbyFolder error:', bucketName, prefix)
        throw new Error('getFileObjPathsbyFolder error')
      })

    const files = filesResponse[0]

    return files.map(f => f.name)
  }
}

module.exports = GCS
