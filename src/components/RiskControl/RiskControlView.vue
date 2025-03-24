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
    <h1>{{ title }} {{ phone }}</h1>

    <el-tabs v-model="activeName" type="border-card" class="demo-tabs">
      <el-tab-pane label="角色權限" name="role">
        <el-form ref="form" :rules="rules" :model="form" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
          <el-form-item label="目前角色權限" prop="role">
            <el-select v-model="role" placeholder="目前角色權限">
              <el-option
                v-for="item in roles"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                :class="{'highlight-option': item.id !== user_role}"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <el-button type="warning" @click="updateRole()">
          Update
        </el-button>
      </el-tab-pane>
      <el-tab-pane label="限額" name="limit">
        <el-form ref="form" :rules="rules" :model="form" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
          <el-form-item label="日限額" prop="daily_limit" :min="0">
            <el-input v-model.number="form.daily_limit" :disabled="!isLimitEditable" />
          </el-form-item>
          <el-form-item label="月限額" prop="monthly_limit" :min="0">
            <el-input v-model.number="form.monthly_limit" :disabled="!isLimitEditable" />
          </el-form-item>
        </el-form>
        <el-button type="warning" :disabled="!isLimitEditable" @click="updateLimit()">
          Update
        </el-button>
      </el-tab-pane>
      <el-tab-pane label="修改紀錄" name="log">
        <br>
        <div class="filter-container">
          <el-date-picker
            v-model="listQuery.date_range"
            type="datetimerange"
            style="margin-left: 5px; padding-top: 7px; width: 400px;"
            range-separator="至"
            start-placeholder="限額修改開始日期"
            end-placeholder="限額修改結束日期"
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
        </div>

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
          <el-table-column label="操作類型" prop="operation_type" align="center">
            <template slot-scope="{row}">
              <span>{{ operationType2String(row.operation_type) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="修改前角色權限" prop="before_role" align="center">
            <template slot-scope="{row}">
              <span>{{ row.before_value ? role2String(row.before_value.role) : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="修改前日限額" prop="before_daily_limit" align="center">
            <template slot-scope="{row}">
              <span>{{ row.before_value ? row.before_value.daily_limit : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="修改前月限額" prop="before_monthly_limit" align="center">
            <template slot-scope="{row}">
              <span>{{ row.before_value ? row.before_value.monthly_limit : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="修改後角色權限" prop="after_role" align="center">
            <template slot-scope="{row}">
              <span>{{ row.after_value ? role2String(row.after_value.role) : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="修改後日限額" prop="after_daily_limit" align="center">
            <template slot-scope="{row}">
              <span>{{ row.after_value ? row.after_value.daily_limit : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="修改後月限額" prop="after_monthly_limit" align="center">
            <template slot-scope="{row}">
              <span>{{ row.after_value ? row.after_value.monthly_limit : '' }}</span>
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

import { fetchRiskControlRoleList, fetchRiskControlRole, updateRiskControlRole, updateRiskControlLimit } from '@/api/riskControl'
import { getChangeLogs } from '@/api/btm'

export default {
  name: 'RiskControlView',
  components: { Pagination },
  directives: { waves },
  props: {
    type: {
      type: String,
      required: true,
      validator: value => ['white', 'gray', 'black'].includes(value)
    },
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
      form: {
        daily_limit: 0,
        monthly_limit: 0
      },
      activeName: 'role',
      role: 0,
      user_role: 0
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
    this.getRoleList()
    this.fetchRole()
    this.getList()
  },
  methods: {
    updateLimit() {
      this.$alert('確定要更新角色限額嗎?', '更新角色限額', {
        type: 'warning',
        confirmButtonText: '确定',
        callback: action => {
          updateRiskControlLimit(this.customer_id, this.form.daily_limit, this.form.monthly_limit, this.$store.getters.token)
            .then(response => {
              this.$message({
                type: 'success',
                message: '更新成功'
              })
              if (this.type === 'gray') {
                this.getRoleList()
                this.fetchRole()
                this.getList()
              } else {
                this.$router.push({ path: '/risk_control/graylist', query: { customerID: this.customer_id }})
              }
            })
            .catch(err => {
              if (err && err.msg && err.msg.includes('customer is black')) {
                this.$message({
                  type: 'error',
                  message: '用戶已是黑名單，無法更新限額'
                })
              }
              if (err && err.msg && err.msg.includes('no limit update')) {
                this.$message({
                  type: 'error',
                  message: '限額數量跟舊的一致'
                })
              }
            })
        }
      })
    },
    updateRole() {
      if (this.role === this.user_role) {
        this.$message({
          message: '未更動角色權限',
          type: 'warning'
        })
        return
      }
      this.$alert('確定要更新角色權限嗎?', '更新角色權限', {
        type: 'warning',
        confirmButtonText: '确定',
        callback: action => {
          updateRiskControlRole(this.customer_id, this.role, this.$store.getters.token)
            .then(response => {
              switch (this.type) {
                case 'black':
                  switch (this.role) {
                    case 2:
                      this.$router.push({ path: '/risk_control/graylist', query: { customerID: this.customer_id }})
                      break
                    case 1:
                      this.$router.push({ path: '/risk_control/whitelist', query: { customerID: this.customer_id }})
                      break
                  }
                  break
                case 'gray':
                  switch (this.role) {
                    case 1:
                      this.$router.push({ path: '/risk_control/whitelist', query: { customerID: this.customer_id }})
                      break
                    case 3:
                      this.$router.push({ path: '/risk_control/blacklist', query: { customerID: this.customer_id }})
                      break
                  }
                  break
                case 'white':
                  switch (this.role) {
                    case 2:
                      this.$router.push({ path: '/risk_control/graylist', query: { customerID: this.customer_id }})
                      break
                    case 3:
                      this.$router.push({ path: '/risk_control/blacklist', query: { customerID: this.customer_id }})
                      break
                  }
                  break
              }
            })
        }
      })
    },
    fetchRole() {
      fetchRiskControlRole(this.customer_id, this.$store.getters.token).then(response => {
        this.role = response.data.role_id
        this.user_role = response.data.role_id
        this.form.daily_limit = parseInt(response.data.daily_limit)
        this.form.monthly_limit = parseInt(response.data.monthly_limit)
      })
    },
    getRoleList() {
      this.listLoading = true
      fetchRiskControlRoleList(this.$store.getters.token).then(response => {
        this.roles = response.data
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
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
    handleClearFilter() {
      this.listQuery.date_range = ''

      this.getRoleList()
      this.fetchRole()
      this.getList()
      setTimeout(() => {
        this.listLoading = false
      }, 1 * 1000)
    },
    handleFilter() {
      this.listQuery.page = 1

      getChangeLogs(this.listQuery, this.$store.getters.token).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
      })
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
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
    },
    operationType2String(operation_type) {
      switch (operation_type) {
        case 1:
          // '新增'
          return '初始化'
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
