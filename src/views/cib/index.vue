<template>

  <div class="app-container">
    <h1>告誡名單</h1>
    <div class="filter-container">
      <el-input
        v-model="listQuery.id"
        placeholder="身份證"
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
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-upload"
        @click="handleUpload"
      >
        Upload
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
        label="身分證號"
        prop="ID"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.pid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="告誡日期" align="center">
        <template slot-scope="{row}">
          <span>{{ row.warningdate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="告誡期限" align="center">
        <template slot-scope="{row}">
          <span>{{ row.expiredate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="告誡分局" align="center">
        <template slot-scope="{row}">
          <span>{{ row.issuer }}</span>
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
import { fetchCibList } from '@/api/cib'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'CibList',
  components: { Pagination },
  directives: { waves },
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
        id: ''
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
    getList() {
      this.listLoading = true
      fetchCibList(this.listQuery, this.$store.getters.token)
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
      this.listQuery.id = ''

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
    handleUpload() {
      this.$router.push({
        path: '/review/cibs/upload'
      })
    }
  }
}
</script>
