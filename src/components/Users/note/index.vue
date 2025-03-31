<template>
  <div class="app-container">
    <el-dialog title="新增備註" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="備註" prop="note">
          <el-input v-model="temp.note" :rows="3" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="createData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <el-button type="primary" @click="handleCreate()">
      新增備註
    </el-button>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="Time" align="center">
        <template slot-scope="{row}">
          <span>{{ utc8Time(row.created_at) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="備註" align="center">
        <template slot-scope="{row}">
          <span>{{ row.note }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作者" align="center">
        <template slot-scope="{row}">
          <span>{{ row.operation_user_name }}</span>
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
import { getCustomerNotes, addCustomerNote } from '@/api/customers'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'NoteTable',
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
        limit: 20
      },
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      dialogFormVisible: false,
      temp: {
        note: ''
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
    getList() {
      this.listLoading = true
      getCustomerNotes(this.listQuery, this.customer_id, this.$store.getters.token)
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
    utc8Time(t) {
      const utcDate = new Date(t)
      return utcDate.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
    },
    handleCreate() {
      this.dialogFormVisible = true
    },
    createData() {
      addCustomerNote(this.customer_id, this.temp, this.$store.getters.token)
        .then(() => {
          this.dialogFormVisible = false
          this.$notify({
            title: 'Success',
            message: 'Add Successfully',
            type: 'success',
            duration: 2000
          })
          this.temp.note = ''
          this.getList()
        })
        .catch(() => {
          this.temp.note = ''
          this.dialogFormVisible = false
        })
    }
  }
}
</script>
