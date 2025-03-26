<template>
  <div class="app-container">
    <h1>後台用戶管理</h1>
    <el-button type="primary" @click="handleAddUser">建立後台用戶</el-button>
    <el-alert
      title="需要刪除後台用戶請聯繫工程師"
      description="admin 用戶不得做修改"
      type="info"
      show-icon
      style="margin-top: 20px"
    />
    <br>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="Account" prop="account" align="center">
        <template slot-scope="{row}">
          <span>{{ row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Role" prop="role" align="center">
        <template slot-scope="{row}">
          <span>{{ row.role_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Update" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdateUser(row)">
            Update
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

    <el-dialog :visible.sync="dialogVisible" :before-close="handleClose" :title="dialogType==='edit'?'Edit User':'New User'">
      <el-form :model="user" :rules="rules" label-width="100px" label-position="left">
        <el-form-item label="Account" prop="account">
          <el-input v-model="user.account" placeholder="Account" />
        </el-form-item>
        <el-form-item v-if="dialogType==='new'" label="Password" prop="password">
          <el-input v-model="user.password" placeholder="Password 需要包含大小寫字母、數字和特殊字符" show-password />
        </el-form-item>
        <el-form-item label="角色權限" prop="role">
          <el-select v-model="user.role" placeholder="權限">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.role_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align:right">
        <el-button type="danger" @click="dialogVisible=false">Cancel</el-button>
        <el-button type="primary" @click="confirmRole">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

import path from 'path'
import { getRoles } from '@/api/role'
import { userCreate, userList, userUpdate } from '@/api/user'

export default {
  components: { Pagination },
  data() {
    return {
      backendUsedRoute: '',
      dialogVisible: false,
      dialogType: 'new',
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      rules: {
        account: [{ required: true, message: 'name is required', trigger: 'blur' }],
        password: [
          { required: true, message: 'password is required', trigger: 'blur' },
          { min: 10, message: '密碼長度至少 10 位', trigger: 'blur' },
          { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{10,}$/, message: 'password 需要包含大小寫字母、數字和特殊字符', trigger: 'blur' }
        ]
      },
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      rolesList: [],
      user: {
        account: '',
        password: '',
        role: 0
      }
    }
  },
  created() {
    this.getList()
    this.getRoles()
  },
  methods: {
    handleClose(done) {
      setTimeout(() => {
        this.user.account = ''
        this.user.password = ''
        this.setDefaultRole()
      }, 200)
      done()
    },
    setDefaultRole() {
      this.rolesList.forEach(item => {
        if (item.role_name === 'no_role') {
          this.user.role = item.id
        }
      })
    },
    async getRoles() {
      const res = await getRoles(this.$store.getters.token, { only_name: true })
      this.rolesList = res.data

      this.setDefaultRole()
    },
    handleUpdateUser(row) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.user.id = row.id
      this.user.account = row.account
      this.user.role = row.role_id
    },
    handleAddUser() {
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'

      try {
        if (isEdit) {
          // update
          await userUpdate(this.$store.getters.token, this.user)
        } else {
          // create
          if (!this.user.password || !this.user.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{10,}$/)) {
            this.$message({
              message: 'password 為必填，且需要包含大小寫字母、數字和特殊字符',
              type: 'error'
            })
            return
          }

          await userCreate(this.$store.getters.token, this.user)
        }
      } catch (error) {
        console.log('error', error.response.data.msg)
        let msg = error.message
        if (!!error && !!error.response && !!error.response.data && !!error.response.data.msg) {
          msg = error.response.data.msg
        }
        this.dialogVisible = false
        this.$notify({
          title: 'Error',
          message: msg,
          type: 'error'
        })
        return
      }

      this.user = {}

      this.dialogVisible = false
      this.getList()
      this.setDefaultRole()
      this.$notify({
        title: 'Success',
        type: 'success'
      })
      setTimeout(() => {
        this.$router.go(0)
      }, 500)
    },
    getList() {
      this.listLoading = true
      userList(this.listQuery, this.$store.getters.token).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      })
    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    },
    utc8Time(t) {
      if (t === '0001-01-01T00:00:00Z') {
        return ''
      }
      const utcDate = new Date(t)
      return utcDate.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px
  }
  .permission-tree {
    margin-bottom: 30px
  }
}
</style>
