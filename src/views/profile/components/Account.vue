<template>
  <el-form>
    <el-form-item label="Name">
      <el-input v-model.trim="user.name" />
    </el-form-item>
    <el-form-item label="Role">
      <el-input v-model.trim="user.role" disabled="true" />
    </el-form-item>
    <el-form-item label="Role">
      <el-input v-model.trim="user.role" disabled="true" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" disabled @click="submit">Update</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          role: ''
        }
      }
    }
  },
  methods: {
    submit() {
      // TODO: update user profile
      this.$message({
        message: 'User information has been updated successfully',
        type: 'success',
        duration: 5 * 1000
      })
    }
  }
}
</script>
