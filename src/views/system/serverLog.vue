<template>

  <div class="app-container">
    <h1>伺服器日誌</h1>
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
      <el-table-column label="Log Name">
        <template slot-scope="{row}">
          <span>{{ row }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Download" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleDownload(row)">
            Download
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { fetchServerLogList, downloadServerLog } from '@/api/system'
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
        limit: 10,
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
      fetchServerLogList(this.listQuery, this.$store.getters.token)
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
    handleDownload(row) {
      downloadServerLog(row, this.$store.getters.token).then(response => {
        const url = window.URL.createObjectURL(new Blob([response], { type: 'arraybuffer' }))
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', row)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>
