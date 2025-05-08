<template>

  <div class="app-container">
    <h1>SMS工具組</h1>

    <el-input
      v-model="pwd"
      placeholder="password"
      type="password"
      style="width: 500px"
      class="filter-item"
    />
    <br>
    <br>
    <br>

    <h2>重新發送收據</h2>
    <el-input
      v-model="session_id"
      placeholder="Session ID"
      style="width: 500px; margin-right: 10px;"
      class="filter-item"
    />
    <el-button
      v-waves
      class="filter-item"
      type="primary"
      icon="el-icon-thumb"
      @click="resendReceipt"
    />
    <br>
    <br>
    <br>
    <h2>查詢發送簡訊紀錄</h2>
    <span>起始時間:</span>
    <el-date-picker
      v-model="date_at"
      type="date"
      placeholder="Pick a day"
      style="margin: 0 10px;"
    />
    <span>比數:</span><el-input
      v-model="limit"
      placeholder="limit"
      type="number"
      style="width: 200px; margin: 0 10px;"
    />
    <el-button type="primary" @click="fetchHistory">查詢</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="Date">
        <template slot-scope="{row}">
          {{ utc8Time(row.date_sent) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="Status" />
      <el-table-column prop="body" label="Body">
        <template slot-scope="{row}">
          <pre>{{ row.body }}</pre>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { getSmsHistory, resendReceipt } from '@/api/tools'

export default {
  name: 'SmsTools',
  directives: { waves },
  data() {
    return {
      pwd: '',
      date_at: '',
      limit: 50,
      tableData: [],
      session_id: ''
    }
  },
  created() {
  },
  methods: {
    resendReceipt() {
      this.checkAlert(() => {
        if (this.session_id === '') {
          this.$message({
            type: 'error',
            message: '請輸入 Session ID'
          })
          return
        }
        resendReceipt(this.session_id, this.pwd).then(response => {
          this.$message({
            type: 'success',
            message: response.msg
          })
        })
      })
    },
    fetchHistory() {
      getSmsHistory(this.date_at, this.limit, this.pwd).then(response => {
        this.tableData = response.data.items
      })
    },
    utc8Time(t) {
      if (t === '0001-01-01T00:00:00Z') {
        return ''
      }
      const utcDate = new Date(t)
      return utcDate.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
    },
    checkAlert(fn) {
      this.$alert('確定嗎?', '確定嗎?', {
        type: 'warning',
        confirmButtonText: '确定',
        callback: action => {
          if (action === 'confirm') {
            fn().then(() => {
              this.$message({
                type: 'success',
                message: '呼叫成功'
              })
            })
          }
        }
      })
    }
  }
}
</script>
