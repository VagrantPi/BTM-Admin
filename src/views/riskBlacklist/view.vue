<template>
  <risk-control-view
    type="black"
    :phone="phone"
    :customer-id="customer_id"
  />
</template>

<script>
import RiskControlView from '@/components/RiskControl/RiskControlView.vue'

export default {
  name: 'RiskBlacklistView',
  components: {
    RiskControlView
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
