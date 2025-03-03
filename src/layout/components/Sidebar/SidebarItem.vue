<style>
.kais-primary-1 {
  background-color: #48A6A7 !important;
}
/* .el-submenu{ */
.kais-primary-2{
  background-color: #9ACBD0 !important;
}
/* #app .sidebar-container .el-submenu .el-menu-item{ */
.kais-primary-3{
  background-color: #9ACBD0 !important;
  color: #48A6A7 !important;
}
/* .el-menu-item.is-active { */
.kais-primary-4{
  color: #48A6A7 !important;
  background-color: #9ACBD0 !important;
}
</style>
<template>
  <div v-if="!item.hidden">
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="onlyOneChild.meta.title" />
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {}
  },
  mounted() {
    console.log('process.env.VUE_APP_BACKEND_URL', process.env.VUE_APP_BACKEND_URL.includes('152'))
    const domain = location.host

    if (domain.includes('152.42.242.249')) {
      document.querySelectorAll('.el-button--primary').forEach((btn) => {
        btn.classList.add('kais-primary-1')
      })
      document.querySelectorAll('.el-submenu').forEach((btn) => {
        btn.classList.add('kais-primary-2')
      })
      document.querySelectorAll('#app .sidebar-container .el-submenu .el-menu-item').forEach((btn) => {
        btn.classList.add('kais-primary-3')
      })
      document.querySelectorAll('.el-menu-item.is-active').forEach((btn) => {
        btn.classList.add('kais-primary-4')
      })
    }
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>
