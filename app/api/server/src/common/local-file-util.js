const fs = require('fs')
const glob = require('glob')

class LocalFileUtil {
  /**
   * Get file paths from path pattern.
   */
  static getPathsFromPathPattern(pattern) {
    const paths = glob.sync(pattern)
    if (!paths || !Array.isArray(paths)) return []
    return paths
  }

  /**
   * Read json file and get json object.
   */
  static readJson(path) {
    try {
      const jsonString = fs.readFileSync(path).toString()
      const json = JSON.parse(jsonString)
      return json
    } catch(e) {
      console.log('readJson error:', e)
    }
  }
}

module.exports = LocalFileUtil
