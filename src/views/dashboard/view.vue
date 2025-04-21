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
      <line-chart v-if="isFatch && devices.size > 0" :chart-data="lineChartData" :devices="devices" :select-date="selectDate" />
    </el-row>
  </div>
</template>

<script>
import LineChart from './components/PieChart'

const lineChartData = {
  txVolumnsList: {}
}

import { getTxVolumnsList } from '@/api/view'
import { getDeviceList } from '@/api/device'

export default {
  name: 'DashboardAdmin',
  components: {
    LineChart
  },
  data() {
    return {
      isFatch: false,
      lineChartData: lineChartData.txVolumnsList,
      devices: new Map(),
      selectDate: 'today',
      dates: [{
        id: 'today',
        name: '1d'
      }, {
        id: 'seveDay',
        name: '7d'
      }, {
        id: 'thirtyDay',
        name: '30d'
      }]
    }
  },
  mounted() {
    this.fetTxList()
    this.fetDeviceList()
  },
  methods: {
    fetTxList() {
      var date = new Date()
      var endDate = date.toISOString().split('T')[0]
      date.setDate(date.getDate() - 30)
      var startDate = date.toISOString().split('T')[0]
      getTxVolumnsList({ start_date: startDate, end_date: endDate }, this.$store.getters.token).then(response => {
        this.lineChartData.txVolumnsList = response.data.items
        this.isFatch = true
      })
    },
    fetDeviceList() {
      getDeviceList(this.$store.getters.token).then(response => {
        response.data.items.forEach(device => {
          this.devices.set(device.device_id, device.name)
        })
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
