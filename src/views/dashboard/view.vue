<template>
  <div class="dashboard-editor-container">
    <el-row style="margin-bottom: 10px;">
      <h2>購買佔比</h2>
      <span style="margin-right: 10px">時間範圍</span>
      <el-select v-model="selectDate" placeholder="日期">
        <el-option
          v-for="item in dates"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </el-row>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart v-if="isFatch" :chart-data="lineChartData" :select-date="selectDate" />
    </el-row>
  </div>
</template>

<script>
import LineChart from './components/PieChart'

const lineChartData = {
  txVolumns: {}
}

import { getTxVolumns } from '@/api/view'

export default {
  name: 'DashboardAdmin',
  components: {
    LineChart
  },
  data() {
    return {
      isFatch: false,
      lineChartData: lineChartData.txVolumns,
      selectDate: 'today',
      dates: [{
        id: 'today',
        name: '1d'
      }, {
        id: 'seven_days',
        name: '7d'
      }, {
        id: 'thirty_days',
        name: '30d'
      }]
    }
  },
  mounted() {
    this.fetTxList()
  },
  methods: {
    fetTxList() {
      getTxVolumns(this.$store.getters.token).then(response => {
        this.lineChartData.txVolumns = response.data
        this.isFatch = true
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;
}
</style>
