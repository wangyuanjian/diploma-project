<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Index</el-breadcrumb-item>
      <el-breadcrumb-item>User</el-breadcrumb-item>
      <el-breadcrumb-item>Users</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input placeholder="Input username for query"
          v-model="queryInfo.info" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showAddDialog" plain icon="el-icon-circle-plus-outline">Add User</el-button>
        </el-col>
        <el-col :span="4" :offset="7">
          <el-button type="success" @click="exportUserExcel" plain icon="el-icon-download">Export Excel</el-button>
        </el-col>
      </el-row>
      <!-- user tables -->
       <el-table
        :data="userList" border :stripe="true"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="left" label-width="130px" inline class="demo-table-expand">
              <el-form-item label="username">
                <span>{{ scope.row.username }}</span>
              </el-form-item>
              <el-form-item label="nickname">
                <span>{{ scope.row.nickname }}</span>
              </el-form-item>
              <el-form-item label="gender">
                <span>{{ scope.row.gender }}</span>
              </el-form-item>
              <el-form-item label="email">
                <span>{{ scope.row.email }}</span>
              </el-form-item>
              <el-form-item label="age">
                <span>{{ scope.row.age }}</span>
              </el-form-item>
              <el-form-item label="create-time">
                <span>{{ scope.row.createTime }}</span>
              </el-form-item>
              <el-form-item label="update-time">
                <span>{{ scope.row.updateTime }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="index" label="index" width="80"></el-table-column>
        <el-table-column prop="username" label="username"></el-table-column>
        <el-table-column prop="age" label="age"></el-table-column>
        <el-table-column prop="enabled" label="enabled">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.enabled" :active-value="1" :inactive-value="0"
            @change="userEnabledChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="create time" width="200px"></el-table-column>
        <el-table-column label="operation" width="250">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="edit info" placement="top">
              <el-button type="primary" size="small" plain @click="showEditDialog(scope.row)" icon="el-icon-edit"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="update password" placement="top">
              <el-button type="success" size="small" plain @click="showPwdDialog(scope.row)" icon="el-icon-setting"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="assign role" placement="top">
              <el-button type="warning" size="small" plain @click="showRoleDialog(scope.row)"
              icon="el-icon-edit-outline"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="delete user" placement="top">
              <el-button type="danger" size="small" plain @click="deleteUser(scope.row)"
              :disabled="scope.row.enabled !== 1" icon="el-icon-delete"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- pagination -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[10]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- Add User -->
    <el-dialog
      title="Add User"
      :visible.sync="addDialogVisible"
      width="50%" @close="addDialogClose">

      <el-form :model="addForm" :rules="addFormRules"
      ref="addFormRef" label-width="160px" size="medium">
        <el-form-item label="username" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="nickname" prop="nickname">
          <el-input v-model="addForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="password" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="confirmPassword" prop="confirmPassword">
          <el-input v-model="addForm.confirmPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item label="email" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="age" prop="age">
          <el-input v-model="addForm.age" type="number" min="1" max="100"></el-input>
        </el-form-item>
        <el-form-item label="Select Role" >
          <el-select v-model="addForm.roleId" size="medium"
            :multiple="false" placeholder="select Role">
            <el-option
              v-for="item in roleList"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false" size="medium">Cancel</el-button>
        <el-button type="primary" @click="addUser" size="medium">Add</el-button>
      </span>
    </el-dialog>

    <!-- edit User -->
    <el-dialog
      title="Edit User"
      :visible.sync="editDialogVisible"
      width="50%" @close="editDialogClose">

      <el-form :model="editForm" :rules="editFormRules"
      ref="editFormRef" label-width="100px" size="medium">
        <el-form-item label="username" prop="username">
          <el-input v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="nickname" prop="nickname">
          <el-input v-model="editForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="email" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="age" prop="age">
          <el-input v-model="editForm.age" type="number" min="1" max="100"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false" size="medium">Cancel</el-button>
        <el-button type="primary" @click="editUser" size="medium">Edit</el-button>
      </span>
    </el-dialog>

    <!-- password update -->
    <el-dialog
      title="update password"
      :visible.sync="pwdDialogVisible"
      width="50%"
      @close="pwdDialogClose">
      <el-form :model="pwdForm" :rules="pwdFormRules"
      ref="pwdFormRef" label-width="120px" size="medium">
        <el-form-item label="password" prop="password">
          <el-input v-model="pwdForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="newPassword1" prop="newPassword1">
          <el-input v-model="pwdForm.newPassword1" type="password"></el-input>
        </el-form-item>
        <el-form-item label="newPassword2" prop="newPassword2">
          <el-input v-model="pwdForm.newPassword2" type="password"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="pwdDialogVisible = false" size="medium">Cancel</el-button>
        <el-button type="primary" @click="updatePassword" size="medium">Continue</el-button>
      </span>
    </el-dialog>

    <!-- assign user's role-->
    <el-dialog
      title="Assign Role"
      :visible.sync="assignDialogVisible"
      width="30%">
      <el-form label-width="100px" size="medium">
        <el-form-item label="Username">
          <el-input v-model="assigForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Select Role" >
          <el-select v-model="assigForm.assignedRoleId" size="medium"
            :multiple="false" placeholder="select Role">
            <el-option
              v-for="item in roleList"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    var checkNewPassword2 = (rule, value, callback) => {
      if (value === this.pwdForm.newPassword1) {
        return callback()
      }
      callback(new Error('two passwords have to be same'))
    }
    var checkComfirmPassword = (rule, value, callback) => {
      if (value === this.addForm.password) {
        return callback()
      }
      callback(new Error('two passwords have to be same'))
    }
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('wrong email pattern'))
    }
    return {
      queryInfo: {
        info: '',
        pageNum: 1,
        pageSize: 10
      },
      userList: [],
      // 查询记录的总条数
      total: 0,
      addDialogVisible: false,
      addForm: {
        username: '',
        nickname: '',
        age: '',
        password: '',
        confirmPassword: '',
        email: '',
        roleId: 0
      },
      addFormRules: {
        username: [
          { required: true, message: 'username is necessary', trigger: 'blur' },
          { min: 2, max: 30, trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'password is necessary', trigger: 'blur' },
          { min: 6, max: 20, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: 'please re-input password', trigger: 'blur' },
          { validator: checkComfirmPassword, trigger: 'blur' }
        ],
        email: [
          { required: true, message: 'email is only used for contact', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editForm: {
        userId: 0,
        username: '',
        nickname: '',
        age: '',
        email: ''
      },
      editFormRules: {
        username: [
          { required: true, message: 'username is necessary', trigger: 'blur' },
          { min: 2, max: 30, trigger: 'blur' }
        ],
        email: [
          { required: true, message: 'email is only used for contact', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      },
      pwdDialogVisible: false,
      pwdForm: {
        userId: 0,
        password: '',
        newPassword1: '',
        newPassword2: ''
      },
      pwdFormRules: {
        password: [
          { required: true, message: 'invalid password', trigger: 'blur' },
          { min: 8, max: 20, message: 'password length error', trigger: 'blur' }
        ],
        newPassword1: [
          { required: true, message: 'invalid password', trigger: 'blur' },
          { min: 8, max: 20, message: 'password length error', trigger: 'blur' }
        ],
        newPassword2: [
          { required: true, message: 'invalid password', trigger: 'blur' },
          { validator: checkNewPassword2, trigger: 'blur' }
        ]
      },
      assignDialogVisible: false,
      roleList: [],
      assigForm: {
        userId: '',
        username: '',
        roleName: '',
        assignedRoleId: 0
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const result = await this.$http.post('/getUserList', {
        info: this.queryInfo.info,
        pageNum: this.queryInfo.pageNum,
        pageSize: this.queryInfo.pageSize
      })
      if (result.status !== 200) {
        return this.$message.error('failed to load user info')
      }
      if (result.data.success === false) {
        return this.$message.error(result.data.errorMessage)
      }
      // console.log(result)
      this.userList = result.data.result.list
      this.total = result.data.result.total
    },
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.getUserList()
    },
    handleCurrentChange (newNum) {
      this.queryInfo.pageNum = newNum
      this.getUserList()
    },
    userEnabledChange (userData) {
      // console.log(userData)
      this.$confirm(userData.username + '\'s status will be changed, Continue?', 'Tips', {
        confirmButtonText: 'Continue',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async what => {
        const result = await this.$http.post('/updateUser', {
          userId: userData.userId,
          enabled: userData.enabled
        })
        if (result.status !== 200) {
          return this.$message.error('failed to change user\'s status')
        } else if (!result.data.success) {
          return this.$message.error(result.data.errorMessage)
        } else {
          this.$message.success('user\'s status changed')
          // console.log(result.data)
        }
      }).catch(() => {
        // 下面的代码使得如果点击Cancel，那么switch的值并不会更改
        userData.enabled = 1 - userData.enabled
        this.$message({
          type: 'info',
          message: 'change user\'s status cancelled'
        })
      })
    },
    addDialogClose () {
      this.$refs.addFormRef.resetFields()
    },
    showAddDialog () {
      this.addDialogVisible = true
      this.getRoleList()
    },
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('invalid user info')
        }
        const role = {
          roleId: this.addForm.roleId
        }
        const result = await this.$http.post('/insertUser', {
          username: this.addForm.username,
          password: this.addForm.password,
          nickname: this.addForm.nickname,
          age: this.addForm.age,
          email: this.addForm.email,
          role: role
        })
        if (result.status !== 200) {
          return this.$message.error('failed to add user ' + this.addForm.username)
        }
        if (result.data.success === false) {
          return this.$message.error(result.data.errorMessage)
        }
        this.addDialogVisible = false
        this.$message.success('add user successfully')
        this.getUserList()
      })
    },
    showEditDialog (userData) {
      // console.log(userData)
      this.editDialogVisible = true
      this.editForm.userId = userData.userId
      this.editForm.username = userData.username
      this.editForm.nickname = userData.nickname
      this.editForm.email = userData.email
      this.editForm.age = userData.age
    },
    editDialogClose () {
      this.$refs.editFormRef.resetFields()
    },
    editUser () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('invalid user info')
        }
        const result = await this.$http.post('/updateUser', {
          userId: this.editForm.userId,
          username: this.editForm.username,
          nickname: this.editForm.nickname,
          age: this.editForm.age,
          email: this.editForm.email
        })
        if (result.status !== 200) {
          return this.$message.error('failed to update user ' + this.editForm.username)
        }
        if (result.data.success === false) {
          return this.$message.error(result.data.errorMessage)
        }
        this.editDialogVisible = false
        this.$message.success('edit user successfully')
        this.getUserList()
      })
    },
    deleteUser (userData) {
      this.$confirm(userData.username + '\'s will be deleted, Continue?', 'Tips', {
        confirmButtonText: 'Continue',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async what => {
        const result = await this.$http.post('/updateUser', {
          userId: userData.userId,
          enabled: userData.enabled
        })
        if (result.status !== 200) {
          return this.$message.error('failed to change user\'s status')
        } else if (!result.data.success) {
          return this.$message.error(result.data.errorMessage)
        } else {
          this.$message.success('user deleted')
          this.getUserList()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'delete user cancelled'
        })
      })
    },
    showPwdDialog (userData) {
      this.pwdDialogVisible = true
      this.pwdForm.userId = userData.userId
    },
    updatePassword () {
      this.$refs.pwdFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('invalid password spell')
        }
        const result = await this.$http.post('/verifyAndUpdatePassword', {
          userId: this.pwdForm.userId,
          password: this.pwdForm.password,
          newPassword: this.pwdForm.newPassword1
        })
        if (result.status !== 200) {
          return this.$message.error('failed to update password')
        }
        if (result.data.success === false) {
          return this.$message.error(result.data.errorMessage)
        }
        this.pwdDialogVisible = false
        this.$message.success('update user password successfully')
      })
    },
    pwdDialogClose () {
      this.$refs.pwdFormRef.resetFields()
    },
    async exportUserExcel () {
      const result = await this.$http.get('/exportUserExcel', {
        responseType: 'blob'
      })
      if (result.status !== 200) {
        return this.$message.error('failed to export user excel')
      }
      if (result.data.success === false) {
        return this.$message.error(result.data.errorMessage)
      }
      const blob = new Blob([result.data], {
        type: 'application/vnd.ms-excel'
      })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'users-information.xls'
      a.click()
      window.URL.revokeObjectURL(url)
    },
    showRoleDialog (userData) {
      // console.log(userData)
      this.assigForm.userId = userData.userId
      this.assigForm.username = userData.username
      this.assigForm.assignedRoleId = 0
      if (userData.role && userData.role.roleId) {
        this.assigForm.assignedRoleId = userData.role.roleId
      }
      this.assignDialogVisible = true
      this.getRoleList()
    },
    async getRoleList () {
      const result = await this.$http.get('/getRoleList')
      if (result.status !== 200) {
        return this.$message.error('failed to load role info')
      }
      if (result.data.success === false) {
        return this.$message.error(result.data.errorMessage)
      }
      this.roleList = result.data.result
    },
    async assignRole () {
      var role = {
        roleId: this.assigForm.assignedRoleId
      }
      const result = await this.$http.post('/updateRoleForUser', {
        userId: this.assigForm.userId,
        role: role
      })
      if (result.status !== 200) {
        return this.$message.error('failed to update role for user')
      }
      if (result.data.success === false) {
        return this.$message.error(result.data.errorMessage)
      }
      this.assignDialogVisible = false
      this.$message.success('update role for user successfully')
      this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped>
.demo-table-expand {
  font-size: 15px;
}
/deep/ .demo-table-expand label {
  width: 90px;
  color: #99a9bf;
  font-size: 15px;
  font-weight: bold;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
  font-size: 20px !important;
}
/deep/ .el-form-item__content {
  font-size: 15px;
}
/deep/ .el-breadcrumb__item {
  font-size: 17px;
}
.el-select {
  width: 100%;
}
</style>
