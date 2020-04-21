<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <!-- <img src="" alt=""> -->
        <span class="title-text" @click="toWelcome">Alcoholics Anonymous</span>
      </div>
      <div>
        <el-dropdown @command="handleDropdownCommand">
          <span class="el-dropdown-link">
            <i class="iconfont icon-user"></i>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="message">Messages</el-dropdown-item>
            <el-dropdown-item divided command="logout">Log out</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
         <el-menu
          background-color="#3f72af"
          text-color="#fff"
          active-text-color="#151965"
          :unique-opened="true"
          :router="true"
          :default-active="activePath">
          <!-- 一级菜单 -->
          <el-submenu :index="item.menuId + ''" v-for="item in menuList" :key="item.menuId">
            <!-- 一级菜单模板 -->
            <template slot="title">
              <!-- 一级菜单图标 -->
              <!-- <i class="el-icon-location"></i> -->
              <!-- 一级菜单模板 -->
              <span class="menu-name">{{ item.menuName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="subItem.path"
            v-for="subItem in item.children" :key="subItem.menuId"
            @click="saveNavState(subItem.path)">
              <template slot="title">
                <!-- 一级菜单图标 -->
                <!-- <i class="el-icon-menu"></i> -->
                <!-- 一级菜单模板 -->
                <span class="menu-name">{{ subItem.menuName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menuList: [],
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const result = await this.$http.get('/queryMenuList')
      if (result.status !== 200) {
        return this.$message.error('failed to load menus')
      }
      if (result.data.success === false) {
        return this.$message.error(result.data.errorMessage)
      }
      // console.log(result.data.result)
      this.menuList = result.data.result
    },
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    },
    toWelcome () {
      this.$router.push('/home')
    },
    handleDropdownCommand (command) {
      if (command === 'message') {
        console.log('hello')
      } else if (command === 'logout') {
        this.logout()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.home-container{
  height: 100%;
}
.el-header{
  // https://colorhunt.co/palette/22272
  background-color: #dbe2ef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title-text{
  font-family: 'Times New Roman', Times, serif;
  font-size: 35px;
  margin: 40px auto;
  text-align: center;
  font-weight: 500;
  cursor: pointer;
}
.el-aside{
  background-color: #3f72af;
  .el-menu{
    border-right: none;
  }
  width: 230px !important;
}
.el-main{
  background-color: #f9f7f7;
}
.menu-name {
  font-size: 18px;
  font-weight: bold;
}
.icon-user {
  font-size: 25px;
}
.el-icon-arrow-down {
  font-size: 20px;
}
</style>
