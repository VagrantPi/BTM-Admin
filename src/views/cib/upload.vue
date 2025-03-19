<template>

  <div class="app-container">
    <h1>上傳告誡名單</h1>
    <div class="filter-container">
      <el-upload
        ref="upload"
        v-loading="loading"
        class="upload-demo"
        :action="uploadAction()"
        :show-file-list="false"
        :limit="1"
        :auto-upload="true"
        :headers="{ token: this.$store.getters.token }"
        :on-progress="handleProgress"
        :on-success="handleSuccess"
        :on-error="handleError"
      >
        <template #trigger>
          <el-button type="primary">選擇文件</el-button>
        </template>
      </el-upload>
    </div>
  </div>
</template>

<script>
import { uploadCibUrl } from '@/api/cib'

export default {
  name: 'CibUpload',
  data() {
    return {
      loading: false
    }
  },
  created() {},
  methods: {
    uploadAction() {
      return uploadCibUrl()
    },
    handleProgress() {
      this.loading = true
    },
    handleSuccess() {
      this.loading = false
      this.$notify({
        title: '上傳成功',
        message: '上傳成功',
        type: 'success',
        duration: 2000
      })

      this.$router.go(0)
    },
    handleError() {
      this.loading = false
      this.$notify({
        title: '上傳失敗',
        message: '上傳失敗',
        type: 'error',
        duration: 2000
      })
    }
  }
}
</script>
