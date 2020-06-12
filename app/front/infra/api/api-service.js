import { API, HTTP_RESPONSE_STATUS_OK } from './API'

export default class ApiService {
  constructor(vueContext) {
    this.axios = vueContext.$axios || null
    this.message = vueContext.$message || null
  }

  /**
   * Common get method.
   *
   * @param {String} url
   * @param {Object} params
   */
  get(url, params) {
    if (!this.axios) {
      throw new Error('No axios')
    }

    return this.axios.get(url, params)
      .then(res => res.data)
      .then((res) => {
        if (res.code !== HTTP_RESPONSE_STATUS_OK) {
          throw res.msg
        }
        return res.data
      })
      .catch((msg) => {
        if (this.message) {
          this.message.error(msg)
        }
        throw msg
      })
  }

  /**
   * Get track list.
   *
   * @param {Object} params
   */
  fetchTracks(params) {
    const path = API.TRACK_LIST

    const { version, level } = params
    const reqParams = { version, level }
    return this.get(path, reqParams).catch((msg) => { throw msg })
  }
}
