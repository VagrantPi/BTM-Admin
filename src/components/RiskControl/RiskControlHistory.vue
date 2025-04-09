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
          <el-table-column label="角色" prop="after_role" align="center">
            <template slot-scope="{row}">
              <span>{{ row.after_value ? role2String(row.after_value.role) : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="角色變更原因" prop="reason" align="center">
            <template slot-scope="{row}">
              <span>{{ !row.before_value ? '初始化' : row.before_value.role !== row.after_value.role ? row.after_value.change_role_reason : 'X' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="限額" prop="after_daily_limit" align="center">
            <template slot-scope="{row}">
              <span>{{ row.after_value ? row.after_value.daily_limit : '' }}</span><br>
              <span>{{ row.after_value ? row.after_value.monthly_limit : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="權限變更原因" prop="reason" align="center">
            <template slot-scope="{row}">
              <span>{{ !row.before_value ? '初始化' : row.before_value.role === row.after_value.role && ((row.before_value.daily_limit !== row.after_value.daily_limit) || (row.before_value.monthly_limit !== row.after_value.monthly_limit)) ? row.after_value.change_limit_reason : 'X' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作人員" prop="operation_user_id" align="center">
            <template slot-scope="{row}">
              <span>{{ operatorMap.get(row.operation_user_id) || '初始化' }}</span>
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
        table_name: 'btm_risk_control_customer_limit_settings',
        customer_id: '',
        date_range: ''
      },
      roles: [],
      rules: {
        daily_limit: [
          { required: true, message: '不能為空' },
          { type: 'number', message: '限額必須為數字', trigger: 'blur' }
        ],
        monthly_limit: [
          { required: true, message: '不能為空' },
          { type: 'number', message: '限額必須為數字', trigger: 'blur' }
        ]
      },
      form1: {
        role: 0,
        reason: ''
      },
      form2: {
        daily_limit: 0,
        monthly_limit: 0
      },
      activeName: 'log',
      user_role: 0,
      reasons: [
        { name: '高風險職業' },
        { name: '關懷客戶' },
        { name: '大額兌換客戶' },
        { name: '曾綁定非本人地址' },
        { name: '曾為告誡名單' },
        { name: '經評估須設為灰名單' },
        { name: 'STR' },
        { name: '告誡名單' },
        { name: '經評估須設為黑名單' },
        { name: '客戶申請關閉帳戶' }
      ],
      reason: '',
      operatorMap: new Map()
    }
  },
  computed: {
    title() {
      const titles = {
        white: '風控白名單',
        gray: '風控灰名單',
        black: '風控黑名單'
      }
      return titles[this.type]
    },
    isLimitEditable() {
      return this.type !== 'black'
    }
  },
  created() {
    this.customer_id = this.customerId
    this.listQuery.customer_id = this.customerId
    this.getList()
    this.getUserList()
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
