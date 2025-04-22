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
        this.setOptions(this.chartData.txVolumns)
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
      this.setOptions(this.chartData.txVolumns)
    },

    setOptions({ today, today_total, seven_days, seven_days_total, thirty_days, thirty_days_total }) {
      this.chart.setOption({
        title: {
          text: `${this.selectDate === 'today' ? '1d' : this.selectDate === 'seven_days' ? '7d' : '30d'} 佔比`,
          subtext: `Total ${this.selectDate === 'today' ? this.formatNumber(today_total) : this.selectDate === 'seven_days' ? this.formatNumber(seven_days_total) : this.formatNumber(thirty_days_total)}`,
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
            name: `${this.selectDate === 'today' ? '1d' : this.selectDate === 'seven_days' ? '7d' : '30d'} 佔比`,
            type: 'pie',
            radius: '80%',
            data: this.selectDate === 'today' ? today : this.selectDate === 'seven_days' ? seven_days : thirty_days,
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
