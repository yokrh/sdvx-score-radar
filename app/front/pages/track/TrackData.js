/* eslint-disable camelcase */

export default class TrackData {
  constructor(params) {
    const {
      id,
      name,
      path,
      youtube,
      ver,
      level,
      difficulty,
      bt_long,
      douji,
      niju,
      tateren,
      trill,
    } = params

    this.id = id || ''
    this.name = name || ''
    this.path = path || ''
    this.youtube = youtube || ''
    this.ver = parseInt(ver) || ''
    this.level = level || ''
    this.difficulty = difficulty || ''
    this.btLong = Math.floor(10 * Math.log2(1 + parseInt(bt_long) / 2)) || 0
    this.douji = Math.floor(10 * Math.log2(1 + parseInt(douji) / 2)) || 0
    this.niju = Math.floor(10 * Math.log2(1 + niju)) || 0
    this.tateren = Math.floor(10 * Math.log2(1 + tateren)) || 0
    this.trill = Math.floor(10 * Math.log2(1 + trill)) || 0
  }
}
