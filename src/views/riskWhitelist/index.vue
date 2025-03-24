<template>
  <risk-list
    :title="'風控白名單'"
    :customer-type="2"
    @update="handleUpdate"
  />
</template>

<script>
import RiskList from '@/components/RiskControl/RiskList'

export default {
  name: 'RiskWhitelist',
  components: { RiskList },
  methods: {
    handleUpdate(row) {
      this.$router.push({ path: '/risk_control/whitelist/view', query: { customerID: row.id, phone: row.phone }})
    }
  }
}
</script>
