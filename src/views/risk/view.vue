<template>
  <div>
    <risk-control-view
      v-if="phone && customer_id && risk_type"
      :phone="phone"
      :customer-id="customer_id"
      :type="risk_type"
    />
  </div>
</template>

<script>
import RiskControlView from '@/components/RiskControl/RiskControlView.vue'

export default {
  name: 'RiskWhitelistView',
  components: {
    RiskControlView
  },
  data() {
    return {
      phone: '',
      customer_id: '',
      risk_type: ''
    }
  },
  created() {
    const { query } = this.$route
    this.phone = query.phone
    this.customer_id = query.customerID
    this.risk_type = query.risk_type
  }
}
</script>
