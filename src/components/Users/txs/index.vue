<template>
  <div class="app-container">
    <div v-if="!isDetail" class="filter-container">
      <el-input
        v-model="listQuery.customer_id"
        placeholder="Customer ID"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.phone"
        placeholder="Phone"
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
      <el-table-column v-if="!isDetail" type="expand">
        <template #default="props">
          <div m="4">
            <p m="t-0 b-2">Customer: {{ props.row.phone }}</p>
          </div>
          <div m="4">
            <p m="t-0 b-2">Customer ID: {{ props.row.customerId }}</p>
          </div>
          <div m="4">
            <p m="t-0 b-2">發票: {{ props.row.invoiceNo }}</p>
          </div>
          <div m="4">
            <p m="t-0 b-2">Txh: {{ props.row.txHash }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Time" align="center">
        <template slot-scope="{row}">
          <span>{{ utc8Time(row.created) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Success" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.sendConfirmed }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Location" align="center">
        <template slot-scope="{row}">
          <span>{{ row.deviceName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Cash" align="center">
        <template slot-scope="{row}">
          <span>{{ formatNumber(row.fiat) }} {{ row.fiatCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Crypto" align="center">
        <template slot-scope="{row}">
          <span>{{ caculateCrypto(row.cryptoAtoms, row.cryptoCode) }} {{ row.cryptoCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Rate" align="center">
        <template slot-scope="{row}">
          <span>1 {{ row.cryptoCode }} = {{ formatNumber(Number.parseFloat((Number(row.fiat) - Number(row.cashInFee)) / caculateCrypto(row.cryptoAtoms, row.cryptoCode)).toFixed(2)) }} {{ row.fiatCode }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="isDetail" label="發票" align="center">
        <template slot-scope="{row}">
          <span>{{ row.invoiceNo }}</span>
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

export default {
  name: 'TxsTable',
  components: { Pagination },
  directives: { waves },
  props: {
    isDetail: {
      type: Boolean,
      default: false
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
        date_range: '',
        phone: ''
      },
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
    if (this.isDetail) {
      const { query } = this.$route
      this.listQuery.customer_id = query.customerID
      this.customer_id = query.customerID
      this.phone = query.phone
    }
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
      this.listQuery.phone = ''
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
    },
    formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  }
}
</script>
