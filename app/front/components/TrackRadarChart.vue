<i18n src="./i18n.json"></i18n>

<script>
// IMPORTANT: Don't add <template>! (ref: https://vue-chartjs.org/guide/#vue-single-file-components)
import { Radar } from 'vue-chartjs'

// NOTE: This component only assume one data in dataset currently.
export default {
  extends: Radar,
  props: {
    // 背景色
    backgroundColor: {
      type: String,
      default: '#de5080',
    },
    // グラフの各パラメータのラベルのキー
    labelKeys: {
      type: Array,
      default: () => [
        'btLong',
        'douji',
        'niju',
        'tateren',
        'trill',
      ],
    },
    // 楽曲
    track: {
      type: Object,
      default: null,
    },
  },
  computed: {
    // グラフのlabels
    labels() {
      if (!this.track) {
        return []
      }
      return this.labelKeys.map(label => this.$t(label))
    },
    // グラフのdata
    data() {
      if (!this.track) {
        return []
      }
      return this.labelKeys.map(label => this.track[label])
    },
    // グラフのtext
    text() {
      if (!this.track) {
        return ''
      }
      return this.track.name
    },
  },
  mounted() {
    const data = {
      labels: this.labels,
      datasets: [
        {
          // label: this.label,
          backgroundColor: this.backgroundColor,
          data: this.data,
        },
      ],
    }
    const options = {
      title: {
        display: true,
        text: this.text,
        fontSize: 20,
      },
      scale: {
        ticks: {
          min: 0,
          max: 60,
          // suggestedMax: 50,
          stepSize: 10,
        },
      },
      legend: {
        display: false,
      },
    }

    this.renderChart(data, options)
  },
}
</script>
