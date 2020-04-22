<template>
  <div class="login_container">
    <div class="color_block block1"></div>
    <div class="color_block block2"></div>
    <div class="color_block block3"></div>
    <div class="color_block block4"></div>
    <div class="color_block block5"></div>
    <div class="login_box">
      <!-- 头部区域 -->
      <div class="title_box">
        Alcoholics Anonymous
      </div>
      <!-- 表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <!-- 按钮区 -->
        <el-form-item class="form-btns">
          <el-button type="primary" size="medium" @click="login">SIGN IN</el-button>
          <el-button type="info" size="medium" @click="resetLoginForm">Reset</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginFormRules: {
        username: [
          { required: true, message: 'invalid username', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'invalid password', trigger: 'blur' },
          { min: 8, max: 20, message: 'password length error', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('invalid user info')
        }
        const result = await this.$http.post('/login', {
          username: this.loginForm.username,
          password: this.loginForm.password
        })
        if (result.status !== 200) {
          return this.$message.error('login failed')
        }
        if (result.data.success === false) {
          return this.$message.error(result.data.errorMessage)
        }
        // console.log(result.data)
        window.sessionStorage.setItem('token', result.data.result.nickname)
        window.sessionStorage.setItem('username', result.data.result.username)
        window.sessionStorage.setItem('userId', result.data.result.userId)
        this.$message.success('login successfully')
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container{
  height: 100%;
}
.login_box{
  background-color: #fff;
  width: 450px;
  height: 300px;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.title_box{
  font-family: 'Times New Roman', Times, serif;
  font-size: 35px;
  margin: 40px auto;
  text-align: center;
  font-weight: 500;
}

.login_form{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.color_block{
  height: 100%;
  width: 20%;
  float: left;
}

.block1{
  background-color: #F2F5A6;
}
.block2{
  background-color: #FCD781;
}
.block3{
  background-color: #FFB35C;
}
.block4{
  background-color: #FF9447;
}
.block5{
  background-color: #FF7530;
}
.form-btns{
  display: flex;
  justify-content: flex-end;
}
</style>
