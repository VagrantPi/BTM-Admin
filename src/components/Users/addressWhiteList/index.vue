<style>
.filter-item {
  margin-left: 5px;
}
.highlight-option {
  background: #ffba0073;
}
</style>

<template>
  <div class="app-container">
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="Time" prop="created_at" align="center">
        <template slot-scope="{row}">
          <span>{{ utc8Time(row.created_at) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Address" prop="address" align="center">
        <template slot-scope="{row}">
          <span>{{ changeAddress(row.before_value, row.after_value, row.operation_type) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="狀態" prop="before_role" align="center">
        <template slot-scope="{row}">
          <span>{{ row.operation_type ? operationType2String(row.operation_type) : '' }}</span>
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
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

import { getChangeLogs } from '@/api/btm'

export default {
  name: 'AddressWhiteList',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      customer_id: '',
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        table_name: 'btm_whitelists',
        customer_id: '',
        date_range: ''
      },
      activeName: 'role',
      role: 0,
      user_role: 0
    }
  },
  created() {
    const { query } = this.$route
    this.listQuery.customer_id = query.customerID
    this.customer_id = query.customerID
    this.getList()
  },
  methods: {
    changeAddress(before_value, after_value, operation_type) {
      if (operation_type === 1) {
        return after_value.address
      } else if (operation_type === 3) {
        return before_value.address
      }
      return ''
    },
    getList() {
      this.listLoading = true
      getChangeLogs(this.listQuery, this.$store.getters.token).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
      })
    },
    utc8Time(t) {
      if (t === '0001-01-01T00:00:00Z') {
        return ''
      }
      const utcDate = new Date(t)
      return utcDate.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
    },
    operationType2String(operation_type) {
      switch (operation_type) {
        case 1:
          return '新增'
        case 2:
          return '修改'
        case 3:
          return '刪除'
        default:
          return '未知操作'
      }
    }
  }
}
</script>
