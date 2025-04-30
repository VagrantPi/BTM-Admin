<template>

  <div class="app-container">
    <h1>Lamassu日誌(3天內)</h1>

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
      <el-table-column label="Date" prop="ID" align="center" width="200">
        <template slot-scope="{row}">
          <span>{{ utc8Time(row.timestamp) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Level" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.log_level }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Message">
        <template slot-scope="{row}">
          <span>{{ row.message }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page-sizes="[100, 200, 300, 400]"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { fetchLamassuLogList } from '@/api/system'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'LamassuLog',
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
        limit: 100,
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
      fetchLamassuLogList(this.listQuery, this.$store.getters.token)
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
    }
  }
}
</script>
