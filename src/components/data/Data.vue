<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Index</el-breadcrumb-item>
      <el-breadcrumb-item>Data</el-breadcrumb-item>
      <el-breadcrumb-item>Report</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      div
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  created () {},
  methods: {}
}
</script>

<style lang="less" scoped>
/deep/ .el-breadcrumb__item {
  font-size: 17px;
}
</style>
