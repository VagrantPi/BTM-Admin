<template>
  <div class="app-container">
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="備註" prop="note">
          <el-input v-model="temp.note" :rows="3" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button v-if="dialogStatus==='create'" type="primary" @click="createData()">
          Create
        </el-button>
        <el-button v-else type="primary" @click="updateData()">
          Update
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
      <el-table-column label="操作" align="center">
        <template slot-scope="{row}">
          <el-button type="primary" @click="handleEdit(row)">
            編輯
          </el-button>
          <el-button type="danger" @click="handleDelete(row)">
            刪除
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
import { getCustomerNotes, addCustomerNote, updateCustomerNote, deleteCustomerNote } from '@/api/customers'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'NoteTable',
  components: { Pagination },
  directives: { waves },
  props: {
    customerId: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    noteType: {
      type: Number,
      required: true
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
        customer_id: '',
        note_type: 0
      },
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      dialogFormVisible: false,
      temp: {
        note: '',
        note_type: 0
      },
      textMap: {
        update: '編輯備註',
        create: '新增備註'
      },
      dialogStatus: '',
      dialogRowId: 0
    }
  },
  created() {
    this.listQuery.customer_id = this.customerId
    this.listQuery.note_type = this.noteType
    this.temp.note_type = this.noteType
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getCustomerNotes(this.listQuery, this.customerId, this.$store.getters.token)
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
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleEdit(row) {
      this.dialogStatus = 'update'
      this.temp.note = row.note
      this.dialogRowId = row.id
      this.dialogFormVisible = true
    },
    createData() {
      addCustomerNote(this.customerId, this.temp, this.$store.getters.token)
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
    },
    updateData() {
      updateCustomerNote(this.customerId, this.dialogRowId, this.temp.note, this.$store.getters.token)
        .then(() => {
          this.dialogFormVisible = false
          this.$notify({
            title: 'Success',
            message: 'Update Successfully',
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
    },
    handleDelete(row) {
      this.$alert('確定要刪除嗎?', '真的確定要刪除嗎?', {
        type: 'danger',
        confirmButtonText: '確定',
        callback: action => {
          if (action === 'confirm') {
            deleteCustomerNote(this.customerId, row.id, this.$store.getters.token)
              .then(() => {
                this.$notify({
                  title: 'Success',
                  message: 'Delete Successfully',
                  type: 'success',
                  duration: 2000
                })
                this.getList()
              })
              .catch(() => {
                this.getList()
              })
          }
        }
      })
    }
  }
}
</script>
