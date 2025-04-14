<template>
  <div>
    <risk-control-view
      v-if="phone && customer_id"
      :phone="phone"
      :customer-id="customer_id"
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
