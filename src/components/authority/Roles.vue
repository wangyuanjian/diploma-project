<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Index</el-breadcrumb-item>
      <el-breadcrumb-item>Authority</el-breadcrumb-item>
      <el-breadcrumb-item>Roles</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- add authority button -->
      <el-row type="flex" justify="end">
        <el-col :span="3">
          <el-button type="primary"  plain @click="addDialogVisible = true" icon="el-icon-circle-plus-outline">Add Role</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="roleList" border :stripe="true"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1, i1) in scope.row.authorities" :key="item1.authorityId"
            :class="['vcenter', 'tag-bdbottom', i1 === 0 ? 'tag-bdtop' :'']">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag type="primary" closable
                @close="removeRightById(scope.row, item1.authorityId)">{{ item1.authorityName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限和其他 -->
              <el-col :span="19">
                <el-row v-for="(item2, i2) in item1.children" :key="item2.authorityId"
                :class="[i2 !== 0 ? 'tag-bdtop' :'']">
                  <el-col :span="7">
                    <el-tag type="success" closable
                    @close="removeRightById(scope.row, item2.authorityId)">{{ item2.authorityName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="17">
                    <el-tag type="warning">LEVEL III : )</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="index" width="80"></el-table-column>
        <el-table-column prop="roleName" label="Role Name"></el-table-column>
        <el-table-column prop="roleDesc" label="Role Descript"></el-table-column>
        <el-table-column label="Operation">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="edit info" placement="top">
              <el-button type="primary" size="small" plain @click="showEditDialog(scope.row)" icon="el-icon-edit"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="delete role" placement="top">
              <el-button type="danger" size="small" plain @click="showDeleteDialog(scope.row)" icon="el-icon-delete"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="assign authority" placement="top">
              <el-button type="warning" size="small" plain @click="showAssignAuthorityDialog(scope.row)" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- edit -->
    <el-dialog
      title="Edit Role" :visible.sync="editDialogVisible"
      width="30%" @close="editDialogClose">

      <el-form :model="editForm" :rules="editFormRules"
      ref="editFormRef" label-width="15x0px" size="medium">
        <el-form-item label="roleId">
          <el-input v-model="editForm.roleId" disabled></el-input>
        </el-form-item>
        <el-form-item label="roleName" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false" size="medium">Cancel</el-button>
        <el-button type="primary" @click="editRole" size="medium">Edit</el-button>
      </span>
    </el-dialog>

    <!-- add role -->
    <el-dialog
      title="Add Authority"
      :visible.sync="addDialogVisible"
      width="50%" @close="addDialogClose">

      <el-form :model="addForm" :rules="addFormRules"
      ref="addFormRef" label-width="160px" size="medium">
        <el-form-item label="Role Name" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="Role Describe">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false" size="medium">Cancel</el-button>
        <el-button type="primary" @click="addRole" size="medium">Add</el-button>
      </span>
    </el-dialog>

    <!-- asign authority -->
    <el-dialog
      title="Assign Authority" :visible.sync="assignDialogVisible"
      width="30%" >
      <el-tree :data="authorityList" :show-checkbox="true"
      :props="treeProps" ref="assignAuthorityTreeRef"
      node-key="authorityId" :default-expand-all="true"
      :default-checked-keys="defaultCheckedKeys">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false" size="medium">Cancel</el-button>
        <el-button type="primary" @click="assignAuthority" size="medium">Edit</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleList: [],
      editDialogVisible: false,
      editForm: {
        roleId: 0,
        roleName: '',
        roleDesc: ''
      },
      editFormRules: {
        roleName: [
          { required: true, message: 'must not empty', trigger: 'blur' }
        ]
      },
      addDialogVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      addFormRules: {
        roleName: [
          { required: true, message: 'must not empty', trigger: 'blur' }
        ]
      },
      assignDialogVisible: false,
      authorityList: [],
      treeProps: {
        // 树形结构展示的名称的属性
        label: 'authorityName',
        // 树形结构中父子嵌套的树形
        children: 'children'
      },
      // 树形控件默认勾选的节点
      defaultCheckedKeys: [],
      // 要分配权限的节点
      toAssignAuthorityRoleId: 0
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
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
    showEditDialog (roleData) {
      // console.log(roleData)
      this.editDialogVisible = true
      this.editForm.roleId = roleData.roleId
      this.editForm.roleName = roleData.roleName
      this.editForm.roleDesc = roleData.roleDesc
    },
    editRole () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('invalid role info')
        }
        const result = await this.$http.post('/updateRole', {
          roleId: this.editForm.roleId,
          roleName: this.editForm.roleName,
          roleDesc: this.editForm.roleDesc
        })
        if (result.status !== 200) {
          return this.$message.error('failed to update role')
        }
        if (result.data.success === false) {
          return this.$message.error(result.data.errorMessage)
        }
        this.$message.success('update role sucessfully')
        this.getRoleList()
        this.editDialogVisible = false
      })
    },
    editDialogClose () {
      this.$refs.editFormRef.resetFields()
      this.editDialogVisible = false
    },
    showDeleteDialog (roleData) {
      this.$confirm(roleData.roleName + ' will be deleted, continue?', 'Delete Role', {
        confirmButtonText: 'Continue',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async what => {
        const result = await this.$http.post('/deleteRole', {
          roleId: roleData.roleId
        })
        if (result.status !== 200) {
          return this.$message.error('failed to delete role')
        } else if (!result.data.success) {
          return this.$message.error(result.data.errorMessage)
        } else {
          this.$message.success('role deleted')
          this.getRoleList()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'delete role cancelled'
        })
      })
    },
    addRole () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('invalid role info')
        }
        const result = await this.$http.post('/addRole', {
          roleName: this.addForm.roleName,
          roleDesc: this.addForm.roleDesc
        })
        if (result.status !== 200) {
          return this.$message.error('failed to add role')
        }
        if (result.data.success === false) {
          return this.$message.error(result.data.errorMessage)
        }
        this.$message.success('add role sucessfully')
        this.getRoleList()
        this.addDialogVisible = false
        this.addForm.roleName = ''
        this.addForm.roleDesc = ''
      })
    },
    addDialogClose () {
      this.$refs.addFormRef.resetFields()
    },
    removeRightById (roleData, authorityId) {
      const deleteMsg = 'this authority will be deleted, continue?'
      this.$confirm(deleteMsg, 'Delete Authority', {
        confirmButtonText: 'Continue',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async what => {
        const result = await this.$http.post('/deleteAuthoritiesForRole', {
          roleId: roleData.roleId,
          authorityId: authorityId
        })
        if (result.status !== 200) {
          return this.$message.error('failed to delete authority')
        } else if (!result.data.success) {
          return this.$message.error(result.data.errorMessage)
        } else {
          this.$message.success('authority deleted')
          roleData.authorities = result.data.result
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'delete authority of role cancelled'
        })
      })
    },
    showAssignAuthorityDialog (roleData) {
      // console.log(roleData)
      this.defaultCheckedKeys = []
      this.getAuthorityList()
      if (roleData.authorities) {
        this.getLeafKeys(roleData.authorities, this.defaultCheckedKeys)
      }
      this.assignDialogVisible = true
      this.toAssignAuthorityRoleId = roleData.roleId
    },
    async getAuthorityList () {
      const result = await this.$http.get('/getAuthorityList')
      if (result.status !== 200) {
        return this.$message.error('failed to load authority info')
      }
      if (result.data.success === false) {
        return this.$message.error(result.data.errorMessage)
      }
      this.authorityList = result.data.result
    },
    // 通过递归的形式，获取角色下所有权限id
    getLeafKeys (node, arr) {
      node.forEach(auth => {
        if (auth.authorityLevel === 2) {
          return arr.push(auth.authorityId)
        }
        this.getLeafKeys(auth.children, arr)
      })
    },
    async assignAuthority () {
      const keys = [
        ...this.$refs.assignAuthorityTreeRef.getCheckedKeys(),
        ...this.$refs.assignAuthorityTreeRef.getHalfCheckedKeys()
      ]
      var authorities = []
      for (var i = 0; i < keys.length; i++) {
        var authority = {
          authorityId: 0
        }
        authority.authorityId = keys[i]
        authorities.push(authority)
      }
      const result = await this.$http.post('/insertAuthorityOfRole', {
        roleId: this.toAssignAuthorityRoleId,
        authorities: authorities
      })
      if (result.status !== 200) {
        return this.$message.error('failed to assign authorities, try later')
      }
      if (result.data.success === false) {
        return this.$message.error(result.data.errorMessage)
      }
      this.assignDialogVisible = false
      this.getRoleList()
      this.$message.success('assign authorities successfully')
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .el-breadcrumb__item {
  font-size: 17px;
}
.el-tag{
  margin: 7px;
}
.tag-bdtop{
  border-top: 1px solid #eee;
}
.tag-bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
