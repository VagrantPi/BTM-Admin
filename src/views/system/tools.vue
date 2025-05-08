<template>

  <div class="app-container">
    <h1>RD工具組</h1>

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
    <h2 style="margin-bottom: 0px;">同步特定 Sumsub 用戶</h2><br>
    <el-input
      v-model="customer_id"
      placeholder="Customer ID"
      style="width: 500px; margin-right: 10px;"
      class="filter-item"
    />
    <el-button
      v-waves
      class="filter-item"
      type="primary"
      icon="el-icon-thumb"
      @click="syncSumsubInfo"
    />
    <br>
    <br>
    <br>
    <h2 style="margin-bottom: 0px">同步所有 Sumsub 用戶</h2><br>
    <el-switch
      v-model="forceSync"
      size="large"
      active-text="Force Sync"
      inactive-text="Normal Sync"
      style="margin-right: 10px;"
    />
    <el-button
      v-waves
      class="filter-item"
      type="primary"
      icon="el-icon-thumb"
      @click="syncAllSumsubData"
    />
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { fetchSumsubInfo, syncAllSumsubData } from '@/api/tools'

export default {
  name: 'Tools',
  directives: { waves },
  data() {
    return {
      customer_id: '',
      pwd: '',
      forceSync: false
    }
  },
  methods: {
    syncSumsubInfo() {
      this.checkAlert(() => {
        if (this.customer_id === '') {
          this.$message({
            type: 'error',
            message: '請輸入 Customer ID'
          })
          return
        }
        fetchSumsubInfo(this.customer_id, this.pwd).then(response => {
          this.$message({
            type: 'success',
            message: response.msg
          })
        })
      })
    },
    syncAllSumsubData() {
      this.checkAlert(() => {
        syncAllSumsubData(this.forceSync, this.pwd).then(response => {
          this.$message({
            type: 'success',
            message: response.msg
          })
        })
      })
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
<style scoped>
.editor-container{
  position: relative;
  height: 100%;
}
</style>
