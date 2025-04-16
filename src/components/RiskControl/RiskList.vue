<style>
.filter-item {
  margin-left: 5px;
}
</style>
<template>
  <div class="app-container">
    <h1>{{ title }}</h1>
    <el-alert
      title="3 種搜尋條件只能擇一"
      type="info"
      show-icon
      description="電話前面虛加上 886，e.g. 886976xxxxxx"
    />
    <br>
    <div class="filter-container">
      <el-input
        v-model="listQuery.query"
        placeholder="Customer ID"
        style="width: 280px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.name"
        placeholder="姓名"
        style="width: 280px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.phone"
        placeholder="Phone"
        style="width: 280px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
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
      <el-table-column label="Customer Name" prop="name" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Phone" prop="Phone" align="center">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showReason" label="reason" align="center">
        <template slot-scope="{row}">
          <span>{{ row.is_cib_block ? "告誡名單" : row.edd_type ? eddTypeReason(row.edd_type) : row.change_role_reason }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改紀錄" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleLink(row)">
            詳細資訊
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="風控管理" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleRisk(row)">
            編輯
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
      default: ''
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
        name: '',
        phone: '',
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
        name: '',
        phone: '',
        customer_type: this.customerType
      }

      this.getList()
      setTimeout(() => {
        this.listLoading = false
      }, 1 * 1000)
    },
    handleFilter() {
      if (!!this.listQuery && !!this.listQuery.query) {
        this.listQuery.query = this.listQuery.query.trim()
      }
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
    handleLink(row) {
      this.$router.push({ path: '/risk_control/history', query: { customerID: row.id, phone: row.phone }})
    },
    handleRisk(row) {
      this.$router.push({ path: '/user/view', query: { customerID: row.id, phone: row.phone }})
    },
    utc8Time(t) {
      if (!t) return ''
      const utcDate = new Date(t)
      return utcDate.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
    },
    eddTypeReason(eddType) {
      switch (eddType) {
        case '1_level1':
          return 'EDD 白名單 level1'
        case '1_level2':
          return 'EDD 白名單 level2'
        case '2_level1':
          return 'EDD 灰名單 level1'
        case '2_level2':
          return 'EDD 灰名單 level2'
        default:
          return ''
      }
    }
  }
}
</script>
