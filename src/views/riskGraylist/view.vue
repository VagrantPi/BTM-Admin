<template>
  <!-- eslint-disable -->
  <risk-control-view
    type="gray"
    :phone="phone"
    :customerId="customer_id"
  />
</template>

<script>
import RiskControlView from '@/components/RiskControl/RiskControlView.vue'

export default {
  name: 'RiskGraylistView',
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
