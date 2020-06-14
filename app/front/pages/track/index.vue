<i18n src="./i18n.json"></i18n>

<template>
  <div class="track-page">
    <!-- パンくず -->
    <div class="breadcrumb">
      <div class="item">
        <nuxt-link :to="localePath('/')">
          Home
        </nuxt-link>
      </div>
      <div class="item">
        <nuxt-link :to="localePath('track')">
          Track
        </nuxt-link>
      </div>
    </div>

    <!-- 設定 -->
    <el-dropdown
      class="settings"
      trigger="click"
    >
      <i class="el-icon-s-tools" />
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-delete">
          <span @click="clearCache">
            {{ $t('cache-clear') }}
          </span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <!-- レベル選択 -->
    <el-radio-group
      class="level-list"
      v-model="selectedLevel"
      @change="onSelectLevel"
    >
      <el-radio
        class="level"
        v-for="level in LEVEL"
        :key="level"
        :label="level"
      >
        Lv{{ level }}
      </el-radio>
    </el-radio-group>

    <!-- データなし -->
    <div
      v-if="!tracks || tracks.length <= 0"
      class="no-data"
    >
      {{ isLoading ? 'LOADING...' : 'NO DATA' }}
    </div>

    <!-- データ -->
    <div
      v-else
      class="data-container animated fadeInUp faster"
    >
      <div class="track-table-container">
        <!-- ワード絞り込み -->
        <el-input
          class="word-search"
          v-model="searchName"
          :placeholder="$t('word-search-placeholder')"
          clearable
        />

        <!-- 楽曲リストのテーブル -->
        <TrackTable
          class="track-table"
          :trackTableData="trackTableData"
          @row-click="onRowClick"
        />
      </div>

      <div class="chart-container">
        <!-- レーダーチャート -->
        <TrackRadarChart
          class="track-rader-chart"
          :class="{'not-ready': !selectedTrack}"
          :track="selectedTrack"
          :key="selectedTrack.name"
        />

        <!-- 譜面サイトへ -->
        <el-link
          v-if="selectedTrack"
          type="primary"
          :underline="false"
          class="go-to-fumen-site"
          :href="`https://www.sdvx.in${selectedTrack.path}.htm`"
          target="_blank"
          noopener
        >
          {{ $t('fumen-site') }}
        </el-link>
      </div>
    </div>
  </div>
</template>

<script>
import TrackRadarChart from '../../components/TrackRadarChart.vue'
import TrackTable from '../../components/TrackTable.vue'
import Apollo from '../../infra/api/apollo'
import GQL from './gql/gql'
import TrackData from './TrackData'
import LEVEL from './Level'

export default {
  components: {
    TrackRadarChart,
    TrackTable,
  },
  head() {
    return {
      // Title
      title: this.$t('title'),
      // Description
      meta: [
        { hid: 'description', name: 'description', content: this.$t('description') },
      ],
      // Structured data
      __dangerouslyDisableSanitizers: ['script'],
      script: [{
        innerHTML: JSON.stringify(this.structuredData),
        type: 'application/ld+json',
      }],
    }
  },
  data() {
    return {
      // Apollo service
      apollo: null,
      // ローディング中か
      isLoading: false,

      // 選択できる楽曲レベル
      LEVEL,
      // 選択中のレベル
      selectedLevel: 17,
      // 検索ワード（楽曲名）
      searchName: '',
      // 楽曲リスト
      tracks: [],
      // 選択中の楽曲
      selectedTrack: null,
    }
  },
  computed: {
    // 楽曲テーブルのデータ
    trackTableData() {
      if (!this.searchName) {
        return this.tracks
      }
      return this.tracks.filter(t => t.name.includes(this.searchName))
    },

    // 構造化データ
    structuredData() {
      return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'item': {
              '@id': process.env.baseUrl,
              'name': 'Home',
            },
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'item': {
              '@id': `${process.env.baseUrl}/track/`,
              'name': 'Track',
            },
          },
        ],
      }
    },
  },
  mounted() {
    this.apollo = new Apollo(this)
    this.initTracks()
  },
  methods: {
    /**
     * テーブルの行クリック時イベント。選択した楽曲を処理。
     */
    onRowClick(row) {
      this.selectedTrack = row
      document.querySelector('.chart-container').scrollIntoView(false)
    },

    /**
     * レベル選択時の更新処理。
     */
    onSelectLevel(level) {
      this.selectedLevel = level
      this.initTracks()
    },

    /**
     * 初期化。
     */
    async initTracks() {
      this.tracks = await this.fetchTracks(this.selectedLevel)
        .catch(() => { this.tracks = [] })
      this.selectedTrack = this.tracks && this.tracks.length > 0 ? this.tracks[0] : null
    },

    /**
     * 楽曲データの取得。
     */
    async fetchTracks(level, first = 100, offset = 0) {
      const loading = this.$loading()
      this.isLoading = true

      const query = GQL.GET_TRACKS
      const variables = {
        tracksInput: { level },
        first,
        offset,
      }
      const tracks = await this.apollo.query(query, variables)
        .then(res => res.data)
        .then((res) => {
          if (
            !res ||
            !res.tracks ||
            !res.tracks.edges ||
            res.tracks.totalCount === 0
          ) {
            return []
          }
          return res.tracks.edges
            .filter(e => e.hasOwnProperty('node'))
            .map(e => new TrackData(e.node))
        })
        .catch((msg) => {
          loading.close()
          this.isLoading = false
          console.error(msg) // eslint-disable-line no-console
          throw msg
        })

      loading.close()
      this.isLoading = false
      return tracks
    },

    /**
     * IndexedDB内の譜面キャッシュデータを削除。
     *
     * IndexedDBの処理はcustom-sw.jsにまとめたかったので、
     * 擬似的なPOSTリクエストでトリガーを起こしている。
     */
    async clearCache() {
      const CACHE_CLEAR_URL_PATH = '/cache-clear'
      await fetch(CACHE_CLEAR_URL_PATH, { method: 'POST' })
      this.$message(this.$t('cache-clear-complete'))
    },
  },
}
</script>

<style scoped>
.track-page {
  padding: 0 4% 28px 4%; /* be careful of footer */
  width: 92%;
  overflow: hidden;
}
.breadcrumb {
  padding: 20px 0;
  display: flex;
  font-size: 16px;
  color: #666;
}
.breadcrumb .item:nth-child(n+2)::before {
  content: '>';
  padding: 0 8px 0 16px;
}
.breadcrumb a {
  text-decoration: none;
}
.settings {
  position: absolute;
  top: 20px;
  right: 20px;
}
.level-list {
  display: flex;
  flex-wrap: wrap;
  margin: 36px 0;
}
.level {
  margin-right: 16px;
}
.level >>> .el-radio__input {
  display: none;
}
.level >>> .el-radio__label {
  font-size: 18px;
  padding-left: 0;
}
.no-data {
  margin-top: 80px;
  font-size: 16px;
}
.data-container {
  display: flex;
  margin-bottom: 40px;
}
.word-search {
  margin-top: 12px;
  width: 60%;
}
.track-table-container {
  padding-right: 5%;
  width: 60%;
}
.chart-container {
  width: 30%;
  max-width: 480px;
}
.track-rader-chart {
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
  padding-bottom: 10%;
}
.track-rader-chart:before {
  content: "";
  z-index: -1;
  position: absolute;
  left: 10%;
  bottom: -45%;
  width: 80%;
  height: 100%;
  background-color: rgba(0,0,0,0.05);
  border-radius: 50%;
  transform: rotateX(87deg);
}
.track-rader-chart.not-ready {
  opacity: 0;
  height: 0;
}
.go-to-fumen-site {
  padding: 12px;
  font-size: 14px;
}

@media screen and (max-width: 640px) {
  .data-container {
    display: block;
  }
  .track-table-container {
    padding-right: 0;
    padding-bottom: 20px;
    width: 100%;
  }
  .chart-container {
    margin-left: 5%;
    width: 90%;
    max-width: unset;
  }
  .track-rader-chart {
    width: 100%;
  }

}
</style>
