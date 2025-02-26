<style>
.filter-item {
  margin-left: 5px;
}
</style>

<template>
  <div class="app-container">
    <h1>All Customers</h1>
    <div class="filter-container">
      <el-input
        v-model="listQuery.query"
        placeholder="ID/Phone"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.address"
        placeholder="Address(必須完全相同)"
        style="width: 200px;"
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
      <el-table-column label="Created" width="350" align="center">
        <template slot-scope="{row}">
          <span>{{ utc8Time(row.Created) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="ID"
        prop="ID"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.ID }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Phone" prop="Phone" align="center">
        <template slot-scope="{row}">
          <span>{{ row.Phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Transactions" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" icon="el-icon-tickets" @click="showTxList(row)">
            View
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
import { fetchList, searchList, searchListByAddress } from '@/api/customers'
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
  name: 'ComplexTable',
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
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        query: '',
        address: ''
      },
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      dialogFormVisible: false,
      dialogStatus: '',
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      }
    }
  },
  created() {
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
      this.listQuery.query = ''
      this.listQuery.address = ''
      this.getList()

      // Just to simulate the time of the request
      setTimeout(() => {
        this.listLoading = false
      }, 1 * 1000)
    },
    handleFilter() {
      this.listQuery.query = this.listQuery.query.trim()
      this.listQuery.page = 1

      if (this.listQuery.query === '' && this.listQuery.address === '') {
        this.getList()
      } else {
        if (this.listQuery.address !== '') {
          searchListByAddress(this.listQuery, this.$store.getters.token).then(response => {
            this.list = response.data.items
            this.total = response.data.total

            // Just to simulate the time of the request
            setTimeout(() => {
              this.listLoading = false
            }, 1 * 1000)
          })
        } else {
          searchList(this.listQuery, this.$store.getters.token).then(response => {
            this.list = response.data.items
            this.total = response.data.total

            // Just to simulate the time of the request
            setTimeout(() => {
              this.listLoading = false
            }, 1 * 1000)
          })
        }
      }
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
    showTxList(row) {
      this.$router.push({ path: '/transaction/view', query: { customerID: row.ID, phone: row.Phone }})
    },
    utc8Time(t) {
      const utcDate = new Date(t)
      return utcDate.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
    }
  }
}
</script>
