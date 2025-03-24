<style>
.filter-item {
  margin-left: 5px;
}
</style>
<template>
  <div class="app-container">
    <h1>{{ title }}</h1>
    <el-alert
      title="4 種搜尋條件只能擇一"
      type="info"
      show-icon
      :description="description"
    />
    <br>
    <div class="filter-container">
      <el-input
        v-model="listQuery.query"
        placeholder="Customer ID/Phone"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.address"
        placeholder="Customers Address(必須完全相同)"
        style="width: 280px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-date-picker
        v-model="listQuery.customer_date_range"
        type="datetimerange"
        style="margin-left: 5px; padding-top: 7px; width: 400px;"
        range-separator="至"
        start-placeholder="客戶建立開始日期"
        end-placeholder="客戶建立結束日期"
        clearable
      />
      <el-date-picker
        v-model="listQuery.date_range"
        type="datetimerange"
        style="margin-left: 5px; padding-top: 7px; width: 400px;"
        range-separator="至"
        start-placeholder="白名單建立開始日期"
        end-placeholder="白名單建立結束日期"
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
      <el-table-column
        label="Customer ID"
        prop="ID"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Phone" prop="Phone" align="center">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Customers Created Time" width="350" align="center">
        <template slot-scope="{row}">
          <span>{{ utc8Time(row.created_at) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="First Bind Whitelist Time" width="350" align="center">
        <template slot-scope="{row}">
          <span>{{ utc8Time(row.first_white_list_created) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showReason" label="reason" align="center">
        <template slot-scope="{row}">
          <span>{{ reason(row.is_admin_block, row.is_cib_block, row.is_lamassu_block) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Limit" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Limit
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
import { fetchList } from '@/api/customers'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  name: 'RiskList',
  components: { Pagination },
  directives: { waves },
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    customerType: {
      type: Number,
      required: true
    },
    showReason: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        query: '',
        address: '',
        date_range: '',
        customer_date_range: '',
        customer_type: this.customerType
      }
    }
  },
  created() {
    const { query } = this.$route
    this.listQuery.query = query.customerID
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery, this.$store.getters.token).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
      })
    },
    handleClearFilter() {
      this.listQuery = {
        page: 1,
        limit: 10,
        query: '',
        address: '',
        date_range: '',
        customer_date_range: '',
        customer_type: this.customerType
      }

      this.getList()
      setTimeout(() => {
        this.listLoading = false
      }, 1 * 1000)
    },
    handleFilter() {
      this.listQuery.query = this.listQuery.query.trim()
      this.listQuery.page = 1

      fetchList(this.listQuery, this.$store.getters.token).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
      })
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
    handleUpdate(row) {
      this.$emit('update', row)
    },
    utc8Time(t) {
      if (!t) return ''
      const utcDate = new Date(t)
      return utcDate.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
    },
    reason(is_admin_block, is_cib_block, is_lamassu_block) {
      const reasons = []
      if (is_admin_block) reasons.push('後台角色權限調整')
      if (is_cib_block) reasons.push('告誡名單')
      if (is_lamassu_block) reasons.push('Lamassu 系統後台封鎖')
      return reasons.join(', ')
    }
  }
}
</script>
