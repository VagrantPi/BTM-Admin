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
    <h1>Customer {{ phone }}</h1>

    <el-tabs v-model="activeName" type="border-card" class="demo-tabs">
      <el-tab-pane label="修改紀錄" name="log">
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
          <el-table-column label="時間" prop="created_at" align="center">
            <template slot-scope="{row}">
              <span>{{ utc8Time(row.created_at) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="公開固定限額" prop="reason" align="center">
            <template slot-scope="{row}">
              <span>日限額：{{ row.after_value.DailyLimit }}</span>
              <br>
              <span>月限額：{{ row.after_value.MonthlyLimit }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="交易次數限制" prop="reason" align="center">
            <template slot-scope="{row}">
              <span>天數：{{ 0 }}</span>
              <br>
              <span>次數：{{ 0 }}</span>
            </template>
          </el-table-column> -->
          <el-table-column label="EDD: Level 1" prop="reason" align="center">
            <template slot-scope="{row}">
              <span>交易限額：{{ row.after_value.Level1 }}</span>
              <br>
              <span>累積天數：{{ row.after_value.Level1Days }}</span>
            </template>
          </el-table-column>
          <el-table-column label="EDD: Level 2" prop="reason" align="center">
            <template slot-scope="{row}">
              <span>交易限額：{{ row.after_value.Level2 }}</span>
              <br>
              <span>累積天數：{{ row.after_value.Level2Days }}</span>
            </template>
          </el-table-column>
          <el-table-column label="變更事由" prop="reason" align="center">
            <template slot-scope="{row}">
              <span>{{ row.after_value.ChangeReason }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作人員" prop="operation_user_id" align="center">
            <template slot-scope="{row}">
              <span v-if="isOperatorMapLoaded">{{ operatorMap.get(row.operation_user_id) || '初始化' }}</span>
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
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

import { getChangeLogs } from '@/api/btm'
import { userListLite } from '@/api/user'

export default {
  name: 'RiskControlHistoryView',
  components: { Pagination },
  directives: { waves },
  props: {
    phone: {
      type: String,
      required: true
    },
    customerId: {
      type: String,
      required: true
    }
  },
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
        table_name: 'btm_risk_control_limit_settings',
        customer_id: '',
        date_range: ''
      },
      activeName: 'log',
      operatorMap: new Map(),
      isOperatorMapLoaded: false
    }
  },
  created() {
    this.customer_id = this.customerId
    this.listQuery.customer_id = this.customerId
    this.getList()
    this.getUserList()
    this.operatorMap.set(-1, '系統')
  },
  methods: {
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
    getUserList() {
      userListLite(this.$store.getters.token).then(response => {
        if (!!response.data && !!response.data.items) {
          response.data.items.forEach(user => {
            this.operatorMap.set(user.id, user.account)
          })
        }
        this.isOperatorMapLoaded = true
      })
    },
    utc8Time(t) {
      if (t === '0001-01-01T00:00:00Z') {
        return ''
      }
      const utcDate = new Date(t)
      return utcDate.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
    },
    role2String(role) {
      switch (role) {
        case 0:
          return '未設定'
        case 1:
          return '白名單'
        case 2:
          return '灰名單'
        case 3:
          return '黑名單'
        default:
          return '未知權限'
      }
    }
  }
}
</script>
