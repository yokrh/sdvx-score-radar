/**
 * Crawl the fumen site and output track data.
 *
 * ```sh
 * node fetch_fumen_site_track_data.js
 * ```
 */

const fs = require('fs')
const puppeteer = require('puppeteer')

const LEVEL = [
  // '01','02','03','04','05',
  // '06','07','08','09','10',
  // '11','12','13','14',

  '15','16','17','18','19',
  '20'
]
const DIFFICULTY_MAP = {
  'n': 'NOV',
  'a': 'ADV',
  'e': 'EXH',
  'i': 'INF',
  'g': 'GRV',
  'h': 'HVN',
  'm': 'MXM',
  'v': 'VVD',
};

function getTrackJsonDataFromTrackList(list) {
  const data = {}
  list.forEach(d => data[d.id] = {
    id: d.id,
    name: d.name,
    path: d.path,
    youtube: d.youtube,
    ver: d.ver,
    level: d.level,
    difficulty: d.difficulty
  })
  return data
}

(async() => {
  console.log('--- fetch begin ---')

  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']})
  const page = await browser.newPage()

  for (const level of LEVEL) {
    // crawling page
    const url = `http://www.sdvx.in/sort/sort_${level}.htm`
    console.log('url : ', url)
    await page.goto(url)
    //await page.screenshot({path: 'hoge.png', fullPage: true})
    //await page.content().then( content => console.log("content : ", content) )
    const domDatas = await page.evaluate(() => {
      const res = []
      const es = document.querySelectorAll('.f1')
      for (const e of es) {
        const title = e.innerHTML.replace('<div class="b2">', '').replace('</div>', '')
        if (!title) continue  // noise

        const td = e.parentNode
        const tr = td.parentNode
        if (!tr.children || tr.children.length < 2) continue // noise

        const pathInnerHtml = tr.children[1].innerHTML
        if (!pathInnerHtml.match('href="(.*).htm"')) continue  // noise
        const path = pathInnerHtml.match('href="(.*).htm"')[1]

        const youtubeInnerHtml = tr.children[0].innerHTML
        if (!youtubeInnerHtml.match('href="(.*?)"')) continue  // noise
        if (!youtubeInnerHtml.match('href="(.*?)"')[1].includes('https://www.youtube.com')) continue  // noise
        const youtube = youtubeInnerHtml.match('href="(.*?)"')[1]

        res.push({ title, path, youtube })
      }
      return res
    })

    // create track data
    const trackList = domDatas.map((d) => {
      const name = d.title.replace(/&amp;/g, '&')
      const path = d.path
      const youtube = d.youtube
      const ver = path.split('/')[1]
      const id = path.split('/')[2]
      const difficulty = DIFFICULTY_MAP[id[id.length-1]]
      console.log(name, path)

      return { ver, name, level, difficulty, path, youtube, id }
    })
    const trackData = getTrackJsonDataFromTrackList(trackList)

    // output track data
    const trackJson = `./output/${level}.json`
    const trackDiffJson = `./output/${level}_diff.json`
    const jsonString = fs.readFileSync(trackJson).toString()
    const previousTrackData = JSON.parse(jsonString)
    const newTrackList = Object.values(trackData).filter(t => !Object.values(previousTrackData).some(p => p.id === t.id))
    const newTrackData = getTrackJsonDataFromTrackList(newTrackList)
    fs.writeFile(trackJson, JSON.stringify(trackData), () => {})
    fs.writeFile(trackDiffJson, JSON.stringify(newTrackData), () => {})
    console.log(`${trackList.length} (+${newTrackList.length})`)

    // output shell script for rader chart in later process
    let chartScriptString = '#!/usr/bin/env bash\n'
    trackList.forEach((d) => {
      // Considering exception for file name
      const filename = d.name
        .replace(/ /g, '_')
        .replace(/"/g, '”')
        .replace(/'/g, '’')
        .replace(/#/g, '♯')
        .replace(/=/g, '＝')
        .replace(/\(/g, '（')
        .replace(/\)/g, '）')
        .replace(/:/g, '：')
        .replace(/&/g, '＆')
      // The version arg of the chart data script should be
      // the title version in the game movie (not same as d.ver)
      const ver = 5
      chartScriptString += `python all.py ${d.youtube} ${ver} ${d.level} ${d.difficulty} "${filename}"\n`
    })
    const raderChartScript = `./output/${level}_script.sh`
    fs.writeFile(raderChartScript, chartScriptString, () => {})
  }

  await page.close()
  await browser.close()

  console.log('--- fetch end ---')
})().catch((e) => console.error('error', e))
