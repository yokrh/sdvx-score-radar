<i18n src="./i18n.json"></i18n>

<template>
  <div class="track-table">
    <!-- 表示オプション -->
    <div class="display-option">
      <el-checkbox v-model="isShowVersion">{{ $t('ver') }}</el-checkbox>
      <el-checkbox v-model="isShowLevel">{{ $t('level') }}</el-checkbox>
      <el-checkbox v-model="isShowDifficulty">{{ $t('difficulty') }}</el-checkbox>
      <el-checkbox v-model="isShowBtLong">{{ $t('btLong') }}</el-checkbox>
      <el-checkbox v-model="isShowDouji">{{ $t('douji') }}</el-checkbox>
      <el-checkbox v-model="isShowNiju">{{ $t('niju') }}</el-checkbox>
      <el-checkbox v-model="isShowTateren">{{ $t('tateren') }}</el-checkbox>
      <el-checkbox v-model="isShowTrill">{{ $t('trill') }}</el-checkbox>
    </div>

    <!-- 楽曲リスト -->
    <el-table
      ref="trackTable"
      :data="trackTableData"
      height="480"
      width="100%"
      class="track-table"
      :row-class-name="tableRowClassName"
      @row-click="onRowClick"
    >
      <!-- 楽曲名 -->
      <el-table-column
        :label="$t('trackname')"
        prop="name"
        sortable
        width="180"
      />
      <!-- 楽曲名 -->
      <el-table-column
        v-if="isShowVersion"
        :label="$t('ver')"
        prop="ver"
        sortable
      />
      <!-- レベル -->
      <el-table-column
        v-if="isShowLevel"
        :label="$t('level')"
        prop="level"
        :filters="levelFilters"
        :filter-method="filterLevel"
      />
      <!-- 難易度 -->
      <el-table-column
        v-if="isShowDifficulty"
        :label="$t('difficulty')"
        prop="difficulty"
        :filters="difficultyFilters"
        :filter-method="filterDifficulty"
      />
      <!-- BTロング -->
      <el-table-column
        v-if="isShowBtLong"
        :label="$t('btLong')"
        prop="btLong"
        sortable
      />
      <!-- 同時押し -->
      <el-table-column
        v-if="isShowDouji"
        :label="$t('douji')"
        prop="douji"
        sortable
      />
      <!-- 二重 -->
      <el-table-column
        v-if="isShowNiju"
        :label="$t('niju')"
        prop="niju"
        sortable
      />
      <!-- 縦連 -->
      <el-table-column
        v-if="isShowTateren"
        :label="$t('tateren')"
        prop="tateren"
        sortable
      />
      <!-- トリル -->
      <el-table-column
        v-if="isShowTrill"
        :label="$t('trill')"
        prop="trill"
        sortable
      />
      <!-- その他アクション -->
      <!-- <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text">
            {{scope.row.hogehoge}}
          </el-button>
        </template>
      </el-table-column> -->
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    // 楽曲リスト
    trackTableData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      // 各列表示フラグ
      isShowVersion: false,
      isShowLevel: false,
      isShowDifficulty: false,
      isShowBtLong: true,
      isShowDouji: true,
      isShowNiju: true,
      isShowTateren: true,
      isShowTrill: true,

      // 直前に選択した行
      selectedRow: null,
    }
  },
  computed: {
    // レベルフィルタの選択肢
    levelFilters() {
      return this.trackTableData
        .map((t) => {
          const text = t.level
          const value = t.level
          return { text, value }
        })
        .filter((e, i, self) => self.findIndex(e2 => e2.value === e.value) === i)
    },

    // 難易度の選択肢
    difficultyFilters() {
      return this.trackTableData
        .map((t) => {
          const text = t.difficulty
          const value = t.difficulty
          return { text, value }
        })
        .filter((e, i, self) => self.findIndex(e2 => e2.value === e.value) === i)
    },
  },
  methods: {
    /**
     * 行のスタイル調整クラス付与。
     */
    tableRowClassName({ row, rowIndex }) {
      if (!this.selectedRow) {
        return ''
      }
      if (this.selectedRow.id === row.id) {
        return 'selected-row'
      }
      return ''
    },

    /**
     * レベルフィルタ。
     */
    filterLevel(value, row) {
      const track = row
      return value === track.level
    },

    /**
     * 難易度フィルタ。
     */
    filterDifficulty(value, row) {
      const track = row
      return value === track.difficulty
    },

    /**
     * 行クリック時イベント。
     */
    onRowClick(row, column, event) {
      this.$emit('row-click', row)
      this.selectedRow = row
    },
  },
}
</script>

<style scoped>
.display-option >>> .el-checkbox {
  margin-top: 8px;
}
.track-table {
  margin-top: 12px;
}
.track-table >>> .el-table__row {
  cursor: pointer;
}
.track-table >>> .el-table__header, .track-table >>> .el-table__body {
  table-layout: auto !important;
  width: auto !important;
}
.track-table >>> .selected-row td{
  background-color: #666 !important;
  color: #fff !important;
}
</style>
