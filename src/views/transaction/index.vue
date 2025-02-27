<template>

  <div class="app-container">
    <h1>Customer {{ phone }} Transactions</h1>
    <div class="filter-container">
      <el-input
        v-model="listQuery.customer_id"
        placeholder="Customer ID"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-date-picker
        v-model="listQuery.date_range"
        type="datetimerange"
        style="margin-left: 5px; padding-top: 7px; width: 400px;"
        range-separator="至"
        start-placeholder="交易開始日期"
        end-placeholder="交易結束日期"
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
        label="ID"
        prop="ID"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Customer ID" align="center">
        <template slot-scope="{row}">
          <span>{{ row.customerId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Success" width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sendConfirmed }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Cash" align="center">
        <template slot-scope="{row}">
          <span>{{ row.fiat }} {{ row.fiatCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Crypto" align="center">
        <template slot-scope="{row}">
          <span>{{ caculateCrypto(row.cryptoAtoms, row.cryptoCode) }} {{ row.cryptoCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Rate" align="center">
        <template slot-scope="{row}">
          <span>1 {{ row.cryptoCode }} = {{ Number.parseFloat((Number(row.fiat) - Number(row.cashInFee)) / caculateCrypto(row.cryptoAtoms, row.cryptoCode)).toFixed(2) }} {{ row.fiatCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="ToAddress" align="center">
        <template slot-scope="{row}">
          <span>{{ row.toAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column label="TxHash" align="center">
        <template slot-scope="{row}">
          <span>{{ row.txHash }}</span>
        </template>
      </el-table-column>
      <el-table-column label="CreatedAt" align="center">
        <template slot-scope="{row}">
          <span>{{ utc8Time(row.created) }}</span>
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
import { fetchTxList } from '@/api/tx'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'WhitelistView',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
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
        customer_id: '',
        date_range: ''
      },
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        address: [{ required: true, message: 'address is required', trigger: 'blur' }],
        crypto_code: [{ required: true, message: 'crypto is required', trigger: 'blur' }]
      }
    }
  },
  created() {
    const { query } = this.$route
    this.listQuery.customer_id = query.customerID
    this.customer_id = query.customerID
    this.phone = query.phone
    this.getList()
  },
  methods: {
    caculateCrypto: (amount, crypto) => {
      switch (crypto) {
        case 'BTC':
          return amount / 10 ** 8
        case 'ETH':
          return amount / 10 ** 18
      }
      return amount
    },
    getList() {
      this.listLoading = true
      fetchTxList(this.listQuery, this.$store.getters.token)
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
    handleClearFilter() {
      this.listQuery.customer_id = ''
      this.listQuery.date_range = ''

      this.getList()
      setTimeout(() => {
        this.listLoading = false
      }, 1 * 1000)
    },
    handleFilter() {
      this.listQuery.page = 1

      this.getList()
      setTimeout(() => {
        this.listLoading = false
      }, 1 * 1000)
    },
    utc8Time(t) {
      const utcDate = new Date(t)
      return utcDate.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
    }
  }
}
</script>
