<template>

  <div class="app-container">
    <h1>Customer {{ phone }} Whitelist</h1>
    <div class="filter-container">
      <el-input
        v-model="listQuery.address"
        placeholder="Address"
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
        class="filter-item"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate"
      >
        Add
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
        width="100"
      >
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Crypto" width="150" align="center">
        <template slot-scope="{row}">
          <span>{{ row.crypto_code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Address" align="center">
        <template slot-scope="{row}">
          <span>{{ row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Created" width="350" align="center">
        <template slot-scope="{row}">
          <span>{{ utc8Time(row.created_at) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Remove" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button
            type="danger"
            icon="el-icon-minus"
            size="mini"
            @click="handleDelete(row)"
          >
            Remove
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="Crypto" prop="crypto_code">
          <el-select v-model="temp.crypto_code" placeholder="please select a crypto">
            <el-option
              v-for="item in coinList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Address" prop="address">
          <el-input v-model="temp.address" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchWhiteList, createWhiteList, deleteWhiteList, searchWhiteList } from '@/api/customers'
import { getConfig } from '@/api/config'
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
      coinList: [],
      customer_id: '',
      phone: '',
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        address: '',
        page: 1,
        limit: 20,
        customer_id: ''
      },
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        customer_id: '',
        crypto_code: 'BTC',
        address: ''
      },
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
    this.fetchConfig()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchWhiteList(this.listQuery, this.$store.getters.token)
        .then(response => {
          this.list = response.data.items
          this.total = response.data.total

          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    fetchConfig() {
      getConfig(this.$store.getters.token)
        .then(response => {
          if (response.data && response.data.config && response.data.config.locale_cryptoCurrencies) {
            this.coinList = response.data.config.locale_cryptoCurrencies
          } else {
            console.error('Invalid response structure', response)
          }
        })
        .catch((e) => {
          console.error('Error fetching config:', e)
        })
    },
    handleFilter() {
      this.listLoading = true

      this.listQuery.customer_id = this.customer_id
      this.listQuery.page = 1

      if (this.listQuery.address === '') {
        this.getList()
      } else {
        searchWhiteList(this.listQuery, this.$store.getters.token)
          .then(response => {
            this.list = response.data.items
            this.total = response.data.total

            // Just to simulate the time of the request
            setTimeout(() => {
              this.listLoading = false
            }, 1.5 * 1000)
          })
          .catch(() => {
            this.listLoading = false
          })
      }
    },
    resetTemp() {
      this.temp = {
        customer_id: this.customer_id,
        crypto_code: 'BTC',
        address: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          if (this.temp.address) {
            this.temp.address = this.temp.address.trim()
          }
          createWhiteList(this.temp, this.$store.getters.token)
            .then(() => {
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: 'Created Successfully',
                type: 'success',
                duration: 2000
              })

              this.getList()
            })
            .catch((e) => {
              if (e.response && e.response.data && e.response.data.reason && e.response.data.reason === 'ErrWhitelistDuplicate') {
                this.$notify({
                  title: 'Failed',
                  message: 'Address is already exist',
                  type: 'error',
                  duration: 3000
                })
              }
              this.listLoading = false
            })
        }
      })
    },
    handleDelete(row) {
      this.listLoading = true

      deleteWhiteList(row.id, this.$store.getters.token)
        .then(() => {
          this.getList()
          this.$notify({
            title: 'Success',
            message: 'Delete Successfully',
            type: 'success',
            duration: 2000
          })
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    utc8Time(t) {
      const utcDate = new Date(t)
      return utcDate.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
    }
  }
}
</script>
