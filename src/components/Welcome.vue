<template>
  <div>
    <div class="carousel-box">
      <!-- 注意看下面的类， -->
      <el-carousel height="250px" arrow="always" type="card">
        <el-carousel-item v-for="item in 4" :key="item">
          <h3>{{ item }}</h3>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.carousel-box {
  margin: 0 auto;
}
/deep/ .el-carousel__item{
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
  background-color: #fab95b;
}
.is-animating {
  background-color: #fab95b;
}
.is-in-stage {
  background-color: #fab95b;
}
.is-active {
  background-color: #f5564e;
}

</style>
