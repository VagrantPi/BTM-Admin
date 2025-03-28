<template>
  <div class="app-container">
    <h1>交易紀錄</h1>
    <TxsTable />
  </div>
</template>

<script>
import TxsTable from '@/components/Users/txs/index.vue'

export default {
  name: 'WhitelistView',
  components: { TxsTable }
}
</script>
