<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from '../admin/components/mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    },
    devices: {
      type: Map,
      required: true
    },
    selectDate: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    selectDate: {
      handler(val) {
        this.setOptions(this.chartData)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },

    parseData(data) {
      // 將日期轉為 Date 物件方便比較
      const now = new Date()
      const todayStr = now.toISOString().slice(0, 10)
      let todayTotal = 0

      // 計算前 7 天與 30 天的日期字串
      const sevenDaysAgo = new Date(now)
      sevenDaysAgo.setDate(now.getDate() - 6) // 包含今天
      const sevenStr = sevenDaysAgo.toISOString().slice(0, 10)
      let seveDayTotal = 0

      const thirtyDaysAgo = new Date(now)
      thirtyDaysAgo.setDate(now.getDate() - 29) // 包含今天
      const thirtyStr = thirtyDaysAgo.toISOString().slice(0, 10)
      let thirtyDayTotal = 0

      // 建立初始統計表
      const stats = {
        today: {},
        seveDay: {},
        thirtyDay: {}
      }

      data.forEach(item => {
        const date = item.stat_date.slice(0, 10)
        const device = item.device_id
        const value = parseFloat(item.total_fiat)

        if (date === todayStr) {
          stats.today[device] = (stats.today[device] || 0) + value
          todayTotal += value
        }

        if (date >= sevenStr && date <= todayStr) {
          stats.seveDay[device] = (stats.seveDay[device] || 0) + value
          seveDayTotal += value
        }

        if (date >= thirtyStr && date <= todayStr) {
          stats.thirtyDay[device] = (stats.thirtyDay[device] || 0) + value
          thirtyDayTotal += value
        }
      })

      // 將物件轉換為陣列格式
      const formatStats = (statObj) =>
        Object.entries(statObj).map(([name, value]) => ({ name: this.devices.get(name) || name, value }))

      const result = {
        today: formatStats(stats.today),
        todayTotal,
        seveDay: formatStats(stats.seveDay),
        seveDayTotal,
        thirtyDay: formatStats(stats.thirtyDay),
        thirtyDayTotal
      }

      return result
    },
    setOptions({ txVolumnsList }) {
      const {
        today,
        todayTotal,
        seveDay,
        seveDayTotal,
        thirtyDay,
        thirtyDayTotal
      } = this.parseData(txVolumnsList)
      this.chart.setOption({
        title: {
          text: `${this.selectDate === 'today' ? '1d' : this.selectDate === 'seveDay' ? '7d' : '30d'} 佔比`,
          subtext: `Total ${this.selectDate === 'today' ? this.formatNumber(todayTotal) : this.selectDate === 'seveDay' ? this.formatNumber(seveDayTotal) : this.formatNumber(thirtyDayTotal)}`,
          left: 'right',
          textStyle: {
            fontSize: 27
          },
          subtextStyle: {
            fontSize: 21
          }
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: `${this.selectDate === 'today' ? '1d' : this.selectDate === 'seveDay' ? '7d' : '30d'} 佔比`,
            type: 'pie',
            radius: '80%',
            data: this.selectDate === 'today' ? today : this.selectDate === 'seveDay' ? seveDay : thirtyDay,
            animationDuration: 1000,
            animationDurationUpdate: 1000,
            animationEasing: 'cubicInOut'
          }
        ]
      })
    },
    formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  }
}
</script>
