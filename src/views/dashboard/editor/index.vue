<template>
  <div class="dashboard-editor-container">
    <div class=" clearfix">
      <div class="info-container">
        <h1>Welcome {{ name }}</h1>
        <span style="font-size:20px;padding-top:20px;display:inline-block;">Editor's Dashboard</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'DashboardEditor',
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  }
}
</script>

<style lang="scss" scoped>
  .dashboard-editor-container {
    background-color: #e3e3e3;
    min-height: 100vh;
    padding: 50px 60px 0px;
    // .info-container {
    //   position: relative;
    //   margin-left: 190px;
    //   height: 150px;
    //   line-height: 200px;
    // }
  }
</style>
