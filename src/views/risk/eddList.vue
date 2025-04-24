<style>
.filter-item {
  margin-left: 5px;
}
</style>
<template>
  <div class="app-container">
    <h1>風控 EDD 名單</h1>
    <el-alert
      title="4 種搜尋條件只能擇一"
      type="info"
      show-icon
    />
    <br>
    <div class="filter-container">
      <el-input
        v-model="listQuery.customer_id"
        placeholder="Customer ID"
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
      <el-input
        v-model="listQuery.name"
        placeholder="Name"
        style="width: 280px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <br>

      <el-date-picker
        v-model="listQuery.edd_date_range"
        type="datetimerange"
        style="margin-left: 5px; padding-top: 7px; width: 400px;"
        range-separator="至"
        start-placeholder="EDD 命中開始日期"
        end-placeholder="EDD 命中結束日期"
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
      <el-button
        v-waves
        class="filter-item"
        type="danger"
        icon="el-icon-minus"
        @click="resetEdd"
      >
        Remove
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
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="Edd Time" prop="edd_at" align="center">
        <template slot-scope="{row}">
          <span>{{ utc8Time(row.edd_at) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Customer ID" prop="ID" align="center">
        <template slot-scope="{row}">
          <span>{{ row.customer_id }}</span>
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
      <el-table-column label="門檻" prop="edd_type" align="center">
        <template slot-scope="{row}">
          <span>{{ eddTypeReason(row.edd_type) }}</span>
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
import { fetchEddList } from '@/api/customers'
import { resetRiskControlRoleBatch } from '@/api/riskControl'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  name: 'EDDList',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        customer_id: '',
        name: '',
        phone: '',
        edd_date_range: null
      },
      selectionCustomerIds: []
    }
  },
  created() {
    const { query } = this.$route
    this.listQuery.query = query.customerID
    this.getList()
  },
  methods: {
    resetEdd() {
      this.$alert('確定要重置 EDD 嗎?', '重置 EDD 命中', {
        type: 'warning',
        confirmButtonText: '确定',
        callback: action => {
          if (this.selectionCustomerIds.length === 0) {
            this.$message({
              type: 'error',
              message: '沒有選擇要重置的客戶'
            })
            return
          }

          if (action === 'confirm') {
            console.log('this.selectionCustomerIds', this.selectionCustomerIds)
            resetRiskControlRoleBatch(this.selectionCustomerIds, this.$store.getters.token)
              .then(response => {
                this.$message({
                  type: 'success',
                  message: '更新成功'
                })

                setTimeout(() => {
                  location.reload()
                }, 500)
              })
          }
        }
      })
    },
    getList() {
      this.listLoading = true
      fetchEddList(this.listQuery, this.$store.getters.token).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
      })
    },
    handleSelectionChange(val) {
      this.selectionCustomerIds = val.map(item => item.customer_id)
    },
    handleClearFilter() {
      this.listQuery = {
        page: 1,
        limit: 10,
        query: '',
        name: '',
        phone: '',
        customer_id: '',
        edd_date_range: null
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

      fetchEddList(this.listQuery, this.$store.getters.token).then(response => {
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
        status: 'published',
        type: ''
      }
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
