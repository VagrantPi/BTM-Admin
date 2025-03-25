<template>
  <div class="app-container">
    <h4>工程是使用 Debug 字串</h4>
    <el-input v-model="backendUsedRoute" placeholder="Backend Used Routes" />
    <br>
    <br>
    <br>
    <el-button type="primary" @click="handleAddRole">建立權限</el-button>
    <el-alert
      title="需要刪除權限請聯繫工程師"
      type="info"
      show-icon
      style="margin-top: 20px"
    />
    <el-table :data="rolesList" style="width: 100; margin-top: 5px" border>
      <el-table-column align="center" label="權限名稱" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="Description">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Operations" width="220">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">編輯</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'Edit Role':'New Role'">
      <el-form :model="role" :rules="rules" label-width="100px" label-position="left">
        <el-form-item label="Name" prop="name">
          <el-input v-model="role.name" placeholder="Name" />
        </el-form-item>
        <!-- <el-form-item v-if="dialogType === 'new'" label="Password" prop="password">
          <el-input v-model="role.password" placeholder="Password 需要包含大小寫字母、數字和特殊字符" show-password />
        </el-form-item> -->
        <el-form-item label="Desc" prop="description">
          <el-input
            v-model="role.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="Role Description"
          />
        </el-form-item>
        <el-form-item label="Menus">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            show-checkbox
            node-key="path"
            class="permission-tree"
          />
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
import path from 'path'
import { deepClone } from '@/utils'
import { getRoutes, getRoles, updateRole, addRole } from '@/api/role'

const defaultRole = {
  key: '',
  name: '',
  description: '',
  routes: []
}

export default {
  data() {
    return {
      backendUsedRoute: '',
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      rules: {
        name: [{ required: true, message: 'name is required', trigger: 'blur' }],
        // password: [
        //   { required: true, message: 'password is required', trigger: 'blur' },
        //   { min: 10, message: 'password must be at least 10 characters', trigger: 'blur' },
        //   { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{10,}$/, message: 'password 需要包含大小寫字母、數字和特殊字符', trigger: 'blur' }
        // ],
        description: [{ required: true, message: 'description is required', trigger: 'blur' }]
      },
      serviceRoutes: []
    }
  },
  computed: {
    routesData() {
      // 權限頁面不能由前端控制
      return this.addDisableProperty(this.routes)
    }
  },
  created() {
    this.getRoutes()
    this.getRoles()
    this.backendUsedRoute = JSON.stringify(this.$store.state.permission.backendUsedRoutes)
    console.log('this.backendUsedRoute', this.backendUsedRoute)
  },
  methods: {
    addDisableProperty(routes, disableAll = false) {
      return routes.map(route => {
        let _disableAll = disableAll
        const newRoute = { ...route }

        if (newRoute.path === '/permission/index') {
          _disableAll = true
        }

        if (_disableAll) {
          newRoute.disabled = true
        }

        if (newRoute.children && Array.isArray(newRoute.children)) {
          newRoute.children = this.addDisableProperty(newRoute.children, _disableAll)
        }

        return newRoute
      })
    },
    async getRoutes() {
      const res = await getRoutes(this.$store.getters.token)
      this.serviceRoutes = JSON.parse(res.data)
      this.routes = this.generateRoutes(this.serviceRoutes)
    },
    async getRoles() {
      const res = await getRoles(this.$store.getters.token)
      this.rolesList = res.data.map(role => {
        return {
          key: role.role_name,
          name: role.role_name,
          description: role.role_desc,
          routes: JSON.parse(role.role_raw)
        }
      })
    },

    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes(routes, basePath = '/') {
      const res = []

      for (let route of routes) {
        // skip some route
        if (route.hidden) { continue }

        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)

        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }

        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title

        }

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },
    generateArr(routes) {
      let data = []
      routes.forEach(route => {
        data.push(route)
        if (route.children) {
          const temp = this.generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },
    handleAddRole() {
      this.role = Object.assign({}, defaultRole)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.role = deepClone(scope.row)
      this.$nextTick(() => {
        const routes = this.generateRoutes(this.role.routes)
        this.$refs.tree.setCheckedNodes(this.generateArr(routes))
        // set checked state of a node not affects its father and child nodes
        this.checkStrictly = false
      })
    },
    generateTree(routes, basePath = '/', checkedKeys) {
      const res = []

      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)

        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(route.children, routePath, checkedKeys)
        }

        if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
          res.push(route)
        }
      }
      return res
    },
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'

      const checkedKeys = this.$refs.tree.getCheckedKeys()
      this.role.routes = this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys)

      try {
        if (isEdit) {
          await updateRole(this.$store.getters.token, {
            role_name: this.role.name,
            role_desc: this.role.description,
            role_raw: JSON.stringify(this.role.routes)
          })
        } else {
          // if (!this.role.password || !this.role.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{10,}$/)) {
          //   this.$message({
          //     message: 'password 為必填，且需要包含大小寫字母、數字和特殊字符',
          //     type: 'error'
          //   })
          //   return
          // }

          if (!this.role.name || !this.role.description) {
            this.$message({
              message: 'name 與 description 都是必填',
              type: 'error'
            })
            return
          }
          await addRole(this.$store.getters.token, {
            role_name: this.role.name,
            role_desc: this.role.description,
            role_raw: JSON.stringify(this.role.routes)
          })
        }
        this.dialogVisible = false

        this.$notify({
          title: 'Success',
          type: 'success'
        })

        this.getRoutes()
        this.getRoles()
      } catch (error) {
        this.dialogVisible = false
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error'
        })
      }
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
