<template>
  <risk-list
    :title="'風控灰名單'"
    :customer-type="3"
    @update="handleUpdate"
  />
</template>

<script>
import RiskList from '@/components/RiskControl/RiskList'

export default {
  name: 'RiskGraylist',
  components: { RiskList },
  methods: {
    handleUpdate(row) {
      this.$router.push({ path: '/risk_control/graylist/view', query: { customerID: row.id, phone: row.phone }})
    }
  }
}
</script>
