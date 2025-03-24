<template>
  <risk-list
    :title="'風控黑名單'"
    :description="'目前黑名單原因有 3 種：後台角色權限調整、告誡名單、Lamassu 系統後台封鎖'"
    :customer-type="4"
    :show-reason="true"
    @update="handleUpdate"
  />
</template>

<script>
import RiskList from '@/components/RiskControl/RiskList'

export default {
  name: 'RiskBlacklist',
  components: { RiskList },
  methods: {
    handleUpdate(row) {
      this.$router.push({ path: '/risk_control/blacklist/view', query: { customerID: row.id, phone: row.phone }})
    }
  }
}
</script>
