console.log('custom-sw.js loaded')

/**
 * Configuration variables about the api.
 */
const API_URL_PATTERN = /https?:\/\/(.*)graphql/
const DB_NAME = 'score-rader-chart-api'
const DB_VERSION = 1
const DB_STORE_NAME = 'track'
const DB_STORE_KEY = 'key'
const DB_STORE_VALUE = 'value'
const CACHE_CLEAR_URL_PATTERN = /https?:\/\/(.*)cache-clear/

/**
 * Return the data of POST request.
 */
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'POST') return

  if (!event.request.url) {
    event.respondWith(() => new Response('Bad request', { 'status' : 400 }))
    return
  }

  // Clear the data in IndexedDB
  if (event.request.url.match(CACHE_CLEAR_URL_PATTERN)) {
    event.respondWith(async function() {
      const idb = new IndexedDB(DB_NAME, DB_VERSION)
      await idb.deleteDatabase()
      return new Response('DB deleted', { 'status': 200 })
    }())
    return
  }

  // Get track data with storing to IndexedDB
  if (event.request.url.match(API_URL_PATTERN)) {
    event.respondWith(async function() {
      // Get a data key of IndexedDB
      const requestBody = await event.request.clone().json()
      const key = getKey(JSON.stringify(requestBody))

      // Setup IndexedDB
      const idb = new IndexedDB(DB_NAME, DB_VERSION)
      await idb.createObjectStore(DB_STORE_NAME, DB_STORE_KEY, [], [DB_STORE_VALUE])

      // Get data from IndexedDB (Cache-first)
      const idbData = await idb.getData(DB_STORE_NAME, key)
      if (idbData) {
        const data = idbData.value
        // console.log('IndexedDB data used', data)
        return new Response(JSON.stringify(data))
      }

      // Fetch data from the api server if data isn't in IndexedDB (Cache-first)
      const data = await fetch(event.request.clone())
        .then(async (response) => {
          if (!response.ok) {
            console.error('response is not ok')
            return {}
          }

          // Put data to IndexedDB
          const value = await response.json()
          const data = { [DB_STORE_KEY]:key, [DB_STORE_VALUE]: value }
          await idb.putData(DB_STORE_NAME, data)

          return value
        })
        .catch(() => {
          // app is offline
          console.error('fetch error')
          Promise.reject('ServiceWorker:: App is offline or connection is unstable. Some functions are restricted.');
          return {}
        })

      // console.log('Fetch response data used', data)
      return new Response(JSON.stringify(data))
    }())
  }
})


/**
 * Get uniq key of IndexedDB from POST request body.
 *
 * Thanks: https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript/34842797#34842797
 */
function getKey(s) {
  return s.split('').reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
}


/**
 * IndexedDB class.
 *
 * ref: https://developer.mozilla.org/ja/docs/Web/API/IndexedDB_API/Using_IndexedDB
 */
class IndexedDB {
  constructor(databaseName, databaseVersion) {
    if (!indexedDB) {
      console.error('IndexedDB unsupported.')
      return;
    }

    // Database name
    this.databaseName = databaseName
    // Database version
    this.databaseVersion = databaseVersion
  }

  /**
   * Create a object store.
   * A database will be created if not exists.
   *
   * Object store can be created when the database needs update.
   * The database needs update when its version has changed.
   */
  async createObjectStore(objectStoreName, keyPath, uniqIndexes = [], nonUniqIndexes = []) {
    if (
      !this.databaseName ||
      !this.databaseVersion ||
      !objectStoreName ||
      !keyPath
    ) {
      return false
    }

    const dbPromise = new Promise((resolve, reject) => {
      const dbReq = indexedDB.open(this.databaseName, this.databaseVersion)

      dbReq.onupgradeneeded = function(event) {
        console.log('db upgrade')
        const db = event.target.result
        const objectStore = db.createObjectStore(objectStoreName, { keyPath })
        uniqIndexes.forEach(i => objectStore.createIndex(i, i, { unique: true }))
        nonUniqIndexes.forEach(i => objectStore.createIndex(i, i, { unique: false }))
      }
      dbReq.onsuccess = function(event) {
        console.log('db open success')
        const db = event.target.result
        db.close()
        resolve()
      }
      dbReq.onerror = function(event) {
        console.error('db open error')
        const db = event.target.result
        db.close()
        reject()
      }
    })

    return dbPromise
      .then(() => true)
      .catch(() => false)
  }

  /**
   * Delete a database.
   */
  async deleteDatabase() {
    if (!this.databaseName) return false

    const dbPromise = new Promise((resolve, reject) => {
      const dbReq = indexedDB.deleteDatabase(this.databaseName);

      dbReq.onsuccess = function(event) { // no need to db.close()
        console.log('db delete success');
        resolve()
      }
      dbReq.onerror = function(event) {
        console.error('db delete error');
        const db = event.target.result
        db.close()
        reject()
      }
    })

    return dbPromise
      .then(() => true)
      .catch(() => false)
  }

  /**
   * Put a data.
   */
  async putData(objectStoreName, data) {
    if (!this.databaseName) return false
    if (!objectStoreName) return false

    const dbPromise = new Promise((resolve, reject) => {
      const dbReq = indexedDB.open(this.databaseName);

      dbReq.onsuccess = function(event) {
        console.log('db open success')

        const db = event.target.result
        const transaction = db.transaction([objectStoreName], 'readwrite')
        const store = transaction.objectStore(objectStoreName)
        const putReq = store.put(data)

        putReq.onsuccess = function(event) {
          console.log('put data success')
        }
        transaction.oncomplete = function(event) {
          console.log('transaction complete')
          db.close()
          resolve()
        }
        transaction.onerror = function(event) {
          console.error('transaction error')
          db.close()
          resolve()
        }
      }

      dbReq.onerror = function(event) {
        console.log('db open error')
        const db = event.target.result
        db.close()
        reject()
      }
    })

    return dbPromise
      .then(() => true)
      .catch(() => false)
  }

  /**
   * Get a data.
   */
  async getData(objectStoreName, key) {
    if (!this.databaseName) return null
    if (!objectStoreName) return null

    const dbPromise = new Promise((resolve, reject) => {
      const dbReq = indexedDB.open(this.databaseName);

      dbReq.onsuccess = function(event) {
        const db = event.target.result
        const transaction = db.transaction([objectStoreName], 'readonly')
        const objectStore = transaction.objectStore(objectStoreName);
        const getReq = objectStore.get(key);

        getReq.onsuccess = function(event) {
          console.log('get data success')
          db.close()
          resolve(event.target.result)
        }
        getReq.onerror = function(event) {
          console.error('get data error')
          db.close()
          reject()
        }
      }

      dbReq.onerror = function(event) {
        console.error('get data error')
        const db = event.target.result
        db.close()
        reject()
      }
    })

    return dbPromise
      .then((res) => res)
      .catch(() => null)
  }
}