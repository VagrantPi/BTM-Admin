<template>

  <div class="app-container">
    <h1>會員風控管理</h1>
    <el-tabs type="border-card">
      <el-tab-pane label="白名單">
        <risk-list
          :customer-type="2"
          @link="handleLinkWhitelist"
        />
      </el-tab-pane>
      <el-tab-pane label="灰名單">
        <risk-list
          :customer-type="3"
          @link="handleLinkGraylist"
        />
      </el-tab-pane>
      <el-tab-pane label="黑名單">
        <risk-list
          :description="'目前黑名單原因有 3 種：後台角色權限調整、告誡名單、Lamassu 系統後台封鎖'"
          :customer-type="4"
          :show-reason="true"
          @link="handleLinkBlacklist"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import RiskList from '@/components/RiskControl/RiskList'

export default {
  name: 'RiskMemberList',
  components: { RiskList },
  methods: {
    handleLinkWhitelist(row) {
      this.$router.push({ path: '/risk_control/whitelist/view', query: { customerID: row.id, phone: row.phone }})
    },
    handleLinkGraylist(row) {
      this.$router.push({ path: '/risk_control/graylist/view', query: { customerID: row.id, phone: row.phone }})
    },
    handleLinkBlacklist(row) {
      this.$router.push({ path: '/risk_control/blacklist/view', query: { customerID: row.id, phone: row.phone }})
    }
  }
}
</script>
