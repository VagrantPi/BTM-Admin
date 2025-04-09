<template>
  <risk-control-history
    :phone="phone"
    :customer-id="customer_id"
  />
</template>

<script>
import RiskControlHistory from '@/components/RiskControl/RiskControlHistory.vue'

export default {
  name: 'RiskControlHistoryView',
  components: {
    RiskControlHistory
  },
  data() {
    return {
      phone: '',
      customer_id: ''
    }
  },
  created() {
    const { query } = this.$route
    this.phone = query.phone
    this.customer_id = query.customerID
  }
}
</script>
