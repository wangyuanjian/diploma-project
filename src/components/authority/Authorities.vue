<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Index</el-breadcrumb-item>
      <el-breadcrumb-item>Authority</el-breadcrumb-item>
      <el-breadcrumb-item>Authorities</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- add authority button -->
      <div class="float-to-right">
        <el-button type="primary" @click="addDialogVisible = true" plain icon="el-icon-circle-plus-outline">Add Authority</el-button>
      </div>
      <!-- 外层的一级权限 -->
      <el-table
        :data="authorityList" border :stripe="true"
        style="width: 100%">
        <el-table-column type="expand">
          <!-- 内层的二级权限 -->
          <template slot-scope="scope">
            <el-table :data="scope.row.children">
              <el-table-column label="index" type="index" width="80"></el-table-column>
              <el-table-column prop="authorityName" label="Authority Name"></el-table-column>
              <el-table-column prop="authorityDesc" label="Authority Describe"></el-table-column>
              <el-table-column prop="authorityLevel" label="Authority Level">
                <el-tag type="success">LEVEL II</el-tag>
              </el-table-column>
              <el-table-column label="Operation">
                <template slot-scope="scope">
                  <el-tooltip effect="dark" content="edit info" placement="top">
                    <el-button type="primary" size="small" plain @click="showEditDialog(scope.row)" icon="el-icon-edit"></el-button>
                  </el-tooltip>
                  <el-tooltip effect="dark" content="delete authority" placement="top">
                    <el-button type="danger" size="small" plain @click="showDeleteDialog(scope.row)" icon="el-icon-delete"></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column type="index" label="index" width="80"></el-table-column>
        <el-table-column prop="authorityName" label="Authority Name"></el-table-column>
        <el-table-column prop="authorityDesc" label="Authority Describe"></el-table-column>
        <el-table-column prop="authorityLevel" label="Authority Level">
          <el-tag>LEVEL I</el-tag>
        </el-table-column>
        <el-table-column label="Operation">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="edit info" placement="top">
              <el-button type="primary" size="small" plain @click="showEditDialog(scope.row)" icon="el-icon-edit"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="delete authority" placement="top">
              <el-button type="danger" size="small" plain @click="showDeleteDialog(scope.row)" icon="el-icon-delete"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      title="Edit Authority"
      :visible.sync="editDialogVisible"
      width="30%" @close="editDialogClose">

      <el-form :model="editForm" :rules="editFormRules"
      ref="editFormRef" label-width="150px" size="medium">
        <el-form-item label="authorityId">
          <el-input v-model="editForm.authorityId" disabled></el-input>
        </el-form-item>
        <el-form-item label="authorityName" prop="authorityName">
          <el-input v-model="editForm.authorityName"></el-input>
        </el-form-item>
        <el-form-item label="authorityDesc">
          <el-input v-model="editForm.authorityDesc"></el-input>
        </el-form-item>
        <el-form-item label="authorityLevel" >
          <el-input v-model="editForm.authorityLevel" disabled></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false" size="medium">Cancel</el-button>
        <el-button type="primary" @click="editAuthority" size="medium">Edit</el-button>
      </span>
    </el-dialog>

    <!-- add -->
    <!-- Add User -->
    <el-dialog
      title="Add Authority"
      :visible.sync="addDialogVisible"
      width="50%" @close="addDialogClose">

      <el-form :model="addForm" :rules="addFormRules"
      ref="addFormRef" label-width="160px" size="medium">
        <el-form-item label="authority Level" prop="authorityLevel">
          <el-select v-model="addForm.authorityLevel" size="medium"
          :multiple="false" placeholder="please select"  @change="thisChange">
            <el-option
              v-for="item in levels"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="parent Authority" v-if="isLevelII === true" prop="pid">
          <el-select v-model="addForm.pid" size="medium"
          :multiple="false" placeholder="select Level I Authority">
            <el-option
              v-for="item in authorityList"
              :key="item.authorityId"
              :label="item.authorityName"
              :value="item.authorityId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="authority Name" prop="authorityName">
          <el-input v-model="addForm.authorityName"></el-input>
        </el-form-item>
        <el-form-item label="authority Describe">
          <el-input v-model="addForm.authorityDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false" size="medium">Cancel</el-button>
        <el-button type="primary" @click="addAuthority" size="medium">Add</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      authorityList: [],
      editDialogVisible: false,
      editForm: {
        authorityId: 0,
        authorityDesc: '',
        authorityName: '',
        authorityLevel: 0
      },
      editFormRules: {
        authorityName: [
          { required: true, message: 'must not empty', trigger: 'blur' }
        ]
      },
      addDialogVisible: false,
      addForm: {
        authorityDesc: '',
        authorityName: '',
        authorityLevel: '',
        pid: 0
      },
      addFormRules: {
        authorityName: [
          { required: true, message: 'must not empty', trigger: 'blur' }
        ],
        authorityLevel: [
          { required: true, message: 'must not empty', trigger: 'blur' }
        ],
        pid: [
          { required: true, message: 'must not empty', trigger: 'blur' }
        ]
      },
      levels: [{
        label: 'Level I',
        value: 1
      }, {
        label: 'Level II',
        value: 2
      }],
      isLevelII: false
    }
  },
  created () {
    this.getAuthorityList()
  },
  methods: {
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
    showEditDialog (authorityData) {
      this.editDialogVisible = true
      this.editForm.authorityId = authorityData.authorityId
      this.editForm.authorityName = authorityData.authorityName
      this.editForm.authorityDesc = authorityData.authorityDesc
      this.editForm.authorityLevel = authorityData.authorityLevel
    },
    editDialogClose () {
      this.$refs.editFormRef.resetFields()
    },
    editAuthority () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('invalid authority info')
        }
        const result = await this.$http.post('/updateAuthority', {
          authorityId: this.editForm.authorityId,
          authorityName: this.editForm.authorityName,
          authorityDesc: this.editForm.authorityDesc
        })
        if (result.status !== 200) {
          return this.$message.error('failed to update Authority')
        }
        if (result.data.success === false) {
          return this.$message.error(result.data.errorMessage)
        }
        this.$message.success('update authority sucessfully')
        this.getAuthorityList()
        this.editDialogVisible = false
      })
    },
    addDialogClose () {
      this.$refs.addFormRef.resetFields()
      this.isLevelII = false
    },
    addAuthority () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('invalid authority info')
        }
        if (this.addForm.authorityLevel === 1) {
          this.addForm.pid = null
        }
        const result = await this.$http.post('/addAuthority', {
          authorityName: this.addForm.authorityName,
          authorityDesc: this.addForm.authorityDesc,
          authorityLevel: this.addForm.authorityLevel,
          pid: this.addForm.pid
        })
        if (result.status !== 200) {
          return this.$message.error('failed to add Authority')
        }
        if (result.data.success === false) {
          return this.$message.error(result.data.errorMessage)
        }
        this.$message.success('add authority sucessfully')
        this.getAuthorityList()
        this.addDialogVisible = false
        this.addForm.authorityDesc = ''
        this.addForm.authorityName = ''
        this.addForm.pid = 0
        this.addForm.authorityLevel = 0
      })
    },
    thisChange (value) {
      if (value === 2) {
        this.isLevelII = true
      } else {
        this.isLevelII = false
      }
    },
    showDeleteDialog (authorityData) {
      let deleteMsg = ''
      if (authorityData.authorityLevel === 1) {
        deleteMsg = authorityData.authorityName + ' and all its sub authorities will be deleted, Continue?'
      } else {
        deleteMsg = authorityData.authorityName + ' will be deleted, Continue?'
      }
      this.$confirm(deleteMsg, 'Delete Authority', {
        confirmButtonText: 'Continue',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async what => {
        const result = await this.$http.post('/deleteAuthority', {
          authorityId: authorityData.authorityId
        })
        if (result.status !== 200) {
          return this.$message.error('failed to change user\'s status')
        } else if (!result.data.success) {
          return this.$message.error(result.data.errorMessage)
        } else {
          this.$message.success('authority deleted')
          this.getAuthorityList()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'delete authority cancelled'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .el-breadcrumb__item {
  font-size: 17px;
  font-family: 'Roboto';
}
.el-card {
  border-radius: 15px;
}
.el-table {
  margin-top: 15px;
}
.el-select {
  width: 100%;
}
.float-to-right {
  float: right;
  margin-bottom: 15px;
}
</style>
