<template>

  <div class="app-container">
    <h1>限額塞入假交易紀錄</h1>

    <el-date-picker
      v-model="listQuery.date_range"
      type="datetimerange"
      style="margin-left: 5px; padding-top: 7px; width: 400px;"
      range-separator="至"
      start-placeholder="開始日期"
      end-placeholder="結束日期"
      clearable
    />
    <el-button
      v-waves
      class="filter-item"
      type="primary"
      icon="el-icon-search"
      @click="handleFilter"
    >
      Search
    </el-button>
    <el-button
      v-waves
      class="filter-item"
      type="primary"
      icon="el-icon-refresh"
      @click="handleClearFilter"
    >
      Clear
    </el-button>
    <br>
    <br>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="date" prop="ID" align="center">
        <template slot-scope="{row}">
          <span>{{ utc8Time(row.created_at) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="交易撈取起始時間" prop="start_at" align="center">
        <template slot-scope="{row}">
          <span>{{ utc8Time(row.start_at) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="customer_id" prop="customer_id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.customer_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="預設日限額" prop="default_daily_limit" align="center">
        <template slot-scope="{row}">
          <span>{{ formatNumber(row.default_daily_limit) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="預設月限額" prop="default_monthly_limit" align="center">
        <template slot-scope="{row}">
          <span>{{ formatNumber(row.default_monthly_limit) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客制日限額" prop="limit_daily_limit" align="center">
        <template slot-scope="{row}">
          <span>{{ formatNumber(row.limit_daily_limit) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客制月限額" prop="limit_monthly_limit" align="center">
        <template slot-scope="{row}">
          <span>{{ formatNumber(row.limit_monthly_limit) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="塞入日限額假交易" prop="day_limit" align="center">
        <template slot-scope="{row}">
          <span>{{ formatNumber(row.day_limit) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客制月限額假交易" prop="month_limit" align="center">
        <template slot-scope="{row}">
          <span>{{ formatNumber(row.month_limit) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="suspend 時間" prop="ban_expire_date" align="center">
        <template slot-scope="{row}">
          <span>{{ row.ban_expire_date ? utc8Time(row.ban_expire_date) : '' }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page-sizes="[20, 50, 100, 200]"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { fetchMockTxLimitLogs } from '@/api/system'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'MockLimitLogs',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      customer_id: '',
      phone: '',
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        date_range: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchMockTxLimitLogs(this.listQuery, this.$store.getters.token)
        .then(response => {
          this.list = response.data.items
          this.total = response.data.total

          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1 * 1000)
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    utc8Time(t) {
      if (t === '0001-01-01T00:00:00Z') {
        return ''
      }
      const utcDate = new Date(t)
      return utcDate.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleClearFilter() {
      this.listQuery = {
        page: 1,
        limit: 100,
        date_range: ''
      }
      this.getList()
    },
    formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  }
}
</script>
