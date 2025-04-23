<template>

  <div class="app-container">
    <h1>設定內容</h1>
    <el-tabs v-if="whiteLimitConfig && grayLimitConfig" type="border-card">
      <el-tab-pane label="白名單">
        <setting
          :customer-type="1"
          :limit-config="whiteLimitConfig"
        />
      </el-tab-pane>
      <el-tab-pane label="灰名單">
        <setting
          :customer-type="2"
          :limit-config="grayLimitConfig"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Setting from '@/components/SystemSetting/Setting'
import { getConfigLimit } from '@/api/config'

export default {
  name: 'SettingView',
  components: { Setting },
  data() {
    return {
      whiteLimitConfig: null,
      grayLimitConfig: null
    }
  },
  created() {
    this.fetchDefaultLimit()
  },
  methods: {
    fetchDefaultLimit() {
      getConfigLimit(this.$store.getters.token).then(response => {
        this.whiteLimitConfig = response.data.item_maps['white']
        this.grayLimitConfig = response.data.item_maps['gray']
      })
    }
  }
}
</script>
