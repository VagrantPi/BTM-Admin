<style>
.filter-item {
  margin-left: 5px
}
.highlight-option {
  background: #ffba0073
}
</style>

<template>
  <div class="app-container">
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="提交時間" prop="submissionTime" align="center">
        <template slot-scope="{row}">
          <span>{{ convertUTCtoUTC8(row.submissionTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="審核完成時間" prop="reviewTime" align="center">
        <template slot-scope="{row}">
          <span>{{ convertUTCtoUTC8(row.reviewTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="審核狀態" prop="status" align="center">
        <template slot-scope="{row}">
          <span>{{ row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column label="拒絕原因" align="center">
        <template slot-scope="{row}">
          <ul>
            <li v-for="(item, index) in row.reason" :key="index" align="left">{{ item }}</li>
          </ul>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive

import { getReviewHistory } from '@/api/sumsub'

export default {
  name: 'ReviewHistory',
  directives: { waves },
  props: {
    applicantId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      customer_id: '',
      tableKey: 0,
      list: null,
      listLoading: true,
      activeName: 'role',
      role: 0,
      user_role: 0
    }
  },
  created() {
    const { query } = this.$route
    this.customer_id = query.customerID

    this.getHistory()
  },
  methods: {
    getHistory() {
      this.listLoading = true
      getReviewHistory(this.$store.getters.token, this.applicantId).then(response => {
        this.list = response.data

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
      })
    },
    convertUTCtoUTC8(utcString) {
      if (!utcString) return '' // 如果日期字串為空，直接返回空字串
      try {
        // 移除可能存在的空格並標準化格式
        const cleanedString = utcString.trim().replace(/\s+/g, 'T')
        // 檢查是否已經有 Z
        const formattedString = cleanedString.endsWith('Z')
          ? cleanedString
          : cleanedString + 'Z'

        const date = new Date(formattedString)
        if (isNaN(date.getTime())) {
          // 如果日期無效，返回原始字串
          return utcString
        }

        // 設定時區
        date.setHours(date.getHours() + 8)
        return date.toISOString().slice(0, 19).replace('T', ' ')
      } catch (error) {
        console.error('Date conversion error:', error)
        return utcString // 如果轉換失敗，返回原始字串
      }
    }
  }
}
</script>
