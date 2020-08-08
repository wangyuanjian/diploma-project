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
            <!-- hidden 是否隐藏 -->
            <el-badge v-if="unreadNoteCount > 0" :value="unreadNoteCount" :hidden="hiddenBadge">
              <!-- <i class="iconfont icon-user"></i> -->
              <span class="badge-name">{{ username }}</span>
            </el-badge>
            <el-badge v-else :hidden="hiddenBadge">
              <!-- <i class="iconfont icon-user"></i> -->
              <span class="badge-name">{{ username }}</span>
            </el-badge>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="message">
              <el-badge v-if="unreadNoteCount > 0" :value="unreadNoteCount" :hidden="hiddenBadge">
                Notes
              </el-badge>
              <el-badge v-else :hidden="hiddenBadge">
                Notes
              </el-badge>
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">Log Out</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
         <el-menu
          background-color="#5c94bd"
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
      activePath: '',
      username: '',
      userId: 0,
      unreadNoteCount: 0,
      hiddenBadge: false
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
    this.username = window.sessionStorage.getItem('username').toString().toUpperCase()
    this.userId = window.sessionStorage.getItem('userId')
    this.getUnreadNote()
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
        this.$router.push('/notes')
        this.unreadNoteCount = 0
        this.hiddenBadge = true
      } else if (command === 'logout') {
        this.logout()
      }
    },
    async getUnreadNote () {
      const result = await this.$http.post('/getUnreadNoteForUser?pageNum=' +
      1 + '&pageSize=' + 100, {
        userId: this.userId
      })
      if (result.status !== 200) {
        return this.$message.error('failed to load unread note')
      }
      if (result.data.success === false) {
        return this.$message.error(result.data.errorMessage)
      }
      this.unreadNoteCount = result.data.result.total
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
  border-radius: 15px;
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
  background-color: #5c94bd;
  .el-menu{
    border-right: none;
  }
  width: 230px !important;
  border-radius: 15px;
}
.el-main{
  background-color: #f4f4f4;
  border-radius: 15px;
}
.menu-name {
  font-size: 18px;
  font-weight: bold;
}
.icon-user {
  font-size: 25px;
}
.badge-name {
  font-size: 20px;
  font-family: 'Roboto';
}
/deep/ .el-submenu__title i {
  color: whitesmoke;
}
/deep/ .el-badge__content {
  background-color: #e89da2;
}
/deep/ .el-icon-arrow-down {
  margin-left: 0;
  font-size: 20px;
}
/deep/ .el-dropdown-menu__item {
  font-family: 'Roboto';
  font-size: 16px;
}
</style>
