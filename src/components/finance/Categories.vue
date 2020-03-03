<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Index</el-breadcrumb-item>
      <el-breadcrumb-item>Finance</el-breadcrumb-item>
      <el-breadcrumb-item>Goods Categories</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row type="flex" justify="end">
        <el-col :span="3">
          <el-button type="primary" @click="showAddDialog" plain icon="el-icon-circle-plus-outline">Add Category</el-button>
        </el-col>
      </el-row>
      <tree-table :data="categoryList" :columns="columns" :selection-type="false"
        :expand-type="false" :show-index="true" index-text="#" border stripe
        :show-row-hover="false" class="tree-table">
        <template slot="enabled" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.enabled === 1"></i>
          <i class="el-icon-error" v-else></i>
        </template>
        <template slot="level" slot-scope="scope">
          <el-tag v-if="scope.row.categoryLevel === 1">LEVEL I</el-tag>
          <el-tag type="success" v-else-if="scope.row.categoryLevel === 2">LEVEL II</el-tag>
          <el-tag type="warning" v-else>LEVEL III</el-tag>
        </template>
        <template slot="operation" slot-scope="scope">
          <el-tooltip effect="dark" content="edit category" placement="top">
            <el-button type="primary" size="small" plain @click="showEditDialog(scope.row)" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="delete category" placement="top">
            <el-button type="danger" size="small" plain @click="showDeleteDialog(scope.row)" icon="el-icon-delete"></el-button>
          </el-tooltip>
        </template>
      </tree-table>
    </el-card>

    <!-- add category -->
    <el-dialog
      title="Add Category"
      :visible.sync="addDialogVisible"
      width="40%" @close="addDialogClose">

      <el-form :model="addForm" :rules="addFormRules"
      ref="addFormRef" label-width="160px" size="medium">
        <el-form-item label="category Name" prop="categoryName">
          <el-input v-model="addForm.categoryName"></el-input>
        </el-form-item>
        <el-form-item label="upper Category">
          <el-cascader
            expand-trigger="hover"
            :options="parentCatgoryList" :props="cascaderProps"
            v-model="addForm.selectedIds" clearable
            :change-on-select="true" placeholder="please select upper category"
            @change="parentCategoryChanged">
          </el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false" size="medium">Cancel</el-button>
        <el-button type="primary" @click="addCategory" size="medium">Add</el-button>
      </span>
    </el-dialog>

    <!-- edit -->
    <el-dialog
      title="Edit Category"
      :visible.sync="editDialogVisible"
      width="30%" @close="editDialogClose">

      <el-form :model="editForm" :rules="editFormRules"
      ref="editFormRef" label-width="120px" size="medium">
        <el-form-item label="category Name">
          <el-input v-model="editForm.categoryName"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false" size="medium">Cancel</el-button>
        <el-button type="primary" @click="editCategory" size="medium">Edit</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      categoryList: [],
      columns: [{
        label: 'Category Name',
        prop: 'categoryName'
      }, {
        label: 'Enabled',
        prop: 'enabled',
        type: 'template',
        template: 'enabled'
      }, {
        label: 'Category Level',
        prop: 'categoryLevel',
        type: 'template',
        template: 'level'
      }, {
        label: 'Operation',
        type: 'template',
        template: 'operation'
      }],
      addDialogVisible: false,
      addForm: {
        categoryName: '',
        // 选中的分类id数组
        selectedIds: [],
        categoryLevel: 1,
        pid: 0
      },
      addFormRules: {
        categoryName: [
          { required: true, message: 'must not empty', trigger: 'blur' }
        ]
      },
      parentCatgoryList: [],
      cascaderProps: {
        value: 'categoryId',
        label: 'categoryName',
        children: 'children'
      },
      editDialogVisible: false,
      editForm: {
        categoryId: 0,
        categoryName: ''
      },
      editFormRules: {
        categoryName: [
          { required: true, message: 'must not empty', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCategoryList()
  },
  methods: {
    async getCategoryList () {
      const result = await this.$http.get('/getCategoryList')
      if (result.status !== 200) {
        return this.$message.error('failed to load category info')
      }
      if (result.data.success === false) {
        return this.$message.error(result.data.errorMessage)
      }
      this.categoryList = result.data.result
      console.log(this.categoryList)
    },
    // 在打开该添加dialog时将分类列表数据重新赋值
    showAddDialog () {
      this.addDialogVisible = true
      this.parentCatgoryList = this.categoryList
      for (var i = 0; i < this.parentCatgoryList.length; i++) {
        // temp1是一级权限
        const temp1 = this.parentCatgoryList[i]
        if (!temp1.children) {
          continue
        }
        // temp2是一级权限的二级权限列表
        const temp2 = temp1.children
        for (var j = 0; j < temp2.length; j++) {
          if (!temp2[j].children) {
            continue
          }
          this.parentCatgoryList[i].children[j].children = null
        }
      }
    },
    addDialogClose () {
      this.$refs.addFormRef.resetFields()
      this.addForm.selectedIds = []
      this.addForm.pid = 0
      this.addForm.categoryLevel = 1
    },
    addCategory () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('invalid category info')
        }
        const result = await this.$http.post('/addCategory', {
          categoryName: this.addForm.categoryName,
          pid: this.addForm.pid,
          categoryLevel: this.addForm.categoryLevel
        })
        if (result.status !== 200) {
          return this.$message.error('failed to add category')
        }
        if (result.data.success === false) {
          return this.$message.error(result.data.errorMessage)
        }
        this.getCategoryList()
        this.addDialogVisible = false
        this.$message.success('add category successfully')
      })
    },
    // 级联选择器的选择的之发生变化
    parentCategoryChanged () {
      const len = this.addForm.selectedIds.length
      if (len > 0) {
        this.addForm.pid = this.addForm.selectedIds[len - 1]
        this.addForm.categoryLevel = len + 1
      } else {
        this.addForm.pid = 0
        this.addForm.categoryLevel = 1
      }
    },
    showEditDialog (categoryData) {
      this.editDialogVisible = true
      this.editForm.categoryId = categoryData.categoryId
      this.editForm.categoryName = categoryData.categoryName
    },
    editDialogClose () {
      this.$refs.editFormRef.resetFields()
    },
    editCategory () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('invalid category info')
        }
        const result = await this.$http.post('/updateCategory', {
          categoryId: this.editForm.categoryId,
          categoryName: this.editForm.categoryName
        })
        if (result.status !== 200) {
          return this.$message.error('failed to update category')
        }
        if (result.data.success === false) {
          return this.$message.error(result.data.errorMessage)
        }
        this.$message.success('update category sucessfully')
        this.getCategoryList()
        this.editDialogVisible = false
      })
    },
    showDeleteDialog (categoryData) {
      let deleteMsg = ''
      if (categoryData.categoryLevel === 1) {
        deleteMsg = categoryData.categoryName + ' and all its sub categories will be deleted, Continue?'
      } else {
        deleteMsg = categoryData.categoryName + ' will be deleted, Continue?'
      }
      this.$confirm(deleteMsg, 'Delete Category', {
        confirmButtonText: 'Continue',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async what => {
        const result = await this.$http.post('/updateCategory', {
          categoryId: categoryData.categoryId,
          enabled: 0
        })
        if (result.status !== 200) {
          return this.$message.error('failed to delete category')
        }
        if (result.data.success === false) {
          return this.$message.error(result.data.errorMessage)
        }
        this.$message.success('delete category sucessfully')
        this.getCategoryList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'delete category cancelled'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .el-breadcrumb__item {
  font-size: 17px;
}
.tree-table {
  margin-top: 15px;
}
.el-icon-success {
  color: lightgreen;
}

.el-icon-error {
  color: red;
}
.el-cascader{
  width: 100%;
}
</style>
