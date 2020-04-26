<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Index</el-breadcrumb-item>
      <el-breadcrumb-item>Finance</el-breadcrumb-item>
      <el-breadcrumb-item>Goods List</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert title="Only Level III are allowed to selected"  type="warning" show-icon :closable="false"></el-alert>
      <div class="select-box">
        <div>
          <p class="select-title">Please Select Goods Category : </p>
          <el-cascader class="select-cascader"
            expand-trigger="hover"
            :options="categoryList" :props="cascaderProps"
            v-model="selectedIds" clearable
            placeholder="please select category Level III"
            @change="categoryChanged">
          </el-cascader>
        </div>
        <div class="float-to-right">
          <el-button type="primary" @click="toAddHtml" plain icon="el-icon-circle-plus-outline">Add Goods</el-button>
          <el-button type="success" @click="exportGoodsExcel" plain icon="el-icon-download">Export Excel</el-button>
        </div>
      </div>
      <!-- @expand-change 可展开行展开/折叠时触发的函数，有两个参数
        第一个是当前行数据，第二个已展开所有行的数据的数组 -->
      <el-table
        :data="goodsList" border :stripe="true"
        style="width: 100%" @expand-change="rowExpandChange">
        <el-table-column type="expand">
          <!-- 内层的二级权限 -->
          <template slot-scope="scope">
            <el-tabs tab-position="left" v-model="tabActiveName" >
              <el-tab-pane label="Goods Detail" name="detail" class="detail-panel">
                <div class="goods-img-box">
                  <img :src="scope.row.imgUrl" alt="Goods-Image" v-if="scope.row.imgUrl !== null">
                  <!-- 为了解决高度塌陷的问题 -->
                  <div class="class3" v-if="scope.row.imgUrl === null">
                    <span class="tip-text">you</span>
                    <span class="tip-text">can</span>
                    <span class="tip-text">upload</span>
                    <span class="tip-text">an image :)</span>
                  </div>
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    :action="'http://127.0.0.1:8080/updateGoodsImage?goodsId=' + scope.row.goodsId"
                    :auto-upload="false"
                    :multiple="false"
                    :on-success="(response, file, fileList) => uploadSuccess(response, file, fileList, scope.row)"
                    :limit="1" :headers="headerObj">
                    <el-button slot="trigger" plain size="small" type="primary">Select Image</el-button>
                    <el-button style="margin-left: 30px;" plain size="small" type="success" @click="submitUpload">Submit It</el-button>
                    <div slot="tip" class="el-upload__tip">only jpg/png and image size no more than 500kb</div>
                  </el-upload>
                </div>
                <el-form label-position="left" label-width="160px" class="demo-table-expand">
                  <el-form-item label="Goods Name">
                    <span>{{ scope.row.goodsName }}</span>
                  </el-form-item>
                  <el-form-item label="Goods Price($)">
                    <span>{{ scope.row.goodsPrice }}</span>
                  </el-form-item>
                  <el-form-item label="Goods Number">
                    <span>{{ scope.row.goodsNumber }}</span>
                  </el-form-item>
                  <el-form-item label="Goods Weight(oz)">
                    <span>{{ scope.row.goodsWeight }}</span>
                  </el-form-item>
                  <el-form-item label="Goods State">
                    <span>{{ scope.row.goodsState }}</span>
                  </el-form-item>
                  <el-form-item label="Goods Description">
                    <span>{{ scope.row.goodsDescription }}</span>
                  </el-form-item>
                  <el-form-item label="Create Time">
                    <span>{{ scope.row.addTime }}</span>
                  </el-form-item>
                  <el-form-item label="Update Time">
                    <span>{{ scope.row.updateTime }}</span>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="Goods Params" name="param">
                <!-- 添加参数按钮 -->
                <el-row type="flex" justify="end">
                  <el-col :span="3" :offset="1">
                    <el-button type="primary" @click="showAddFormDialog(scope.row)" plain icon="el-icon-circle-plus-outline">Add Param</el-button>
                  </el-col>
                </el-row>
                <el-table :data="goodsParamList" border :stripe="true" style="width: 95%" class="param-table">
                  <el-table-column type="index" label="index" width="80"></el-table-column>
                  <el-table-column prop="key" label="param"></el-table-column>
                  <el-table-column prop="value" label="param value"></el-table-column>
                  <el-table-column label="Operation" width="140px">
                    <template slot-scope="scope2">
                      <el-tooltip effect="dark" content="edit param" placement="top">
                        <el-button type="primary" size="small" plain @click="showEditParamDialog(scope2.row)" icon="el-icon-edit"></el-button>
                      </el-tooltip>
                      <el-tooltip effect="dark" content="delete param" placement="top">
                        <el-button type="danger" size="small" plain @click="showDeleteParamDialog(scope2.row)" icon="el-icon-delete"></el-button>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </template>
        </el-table-column>
        <el-table-column type="index" label="index" width="80"></el-table-column>
        <el-table-column prop="goodsName" label="Goods Name"></el-table-column>
        <el-table-column prop="goodsPrice" label="Goods Price($)" width="120px"></el-table-column>
        <el-table-column prop="goodsWeight" label="Goods Weight(oz)" width="130px"></el-table-column>
        <el-table-column prop="goodsState" label="Goods State" width="120px"></el-table-column>
        <el-table-column label="Operation" width="140px">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="edit goods" placement="top">
              <el-button type="primary" size="small" plain @click="showEditDialog(scope.row)" icon="el-icon-edit"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="delete goods" placement="top">
              <el-button type="danger" size="small" plain @click="showDeleteDialog(scope.row)" icon="el-icon-delete"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- edit goods -->
    <el-dialog
      title="Edit Goods"
      :visible.sync="editDialogVisible"
      width="40%" @close="editDialogClose">

      <el-form :model="editForm" :rules="editFormRules"
      ref="editFormRef" label-width="160px" size="medium">
        <el-form-item label="goods Name" prop="goodsName">
          <el-input v-model="editForm.goodsName"></el-input>
        </el-form-item>
        <el-form-item label="goods Price($)" prop="goodsPrice">
          <el-input v-model="editForm.goodsPrice" type="number"></el-input>
        </el-form-item>
        <el-form-item label="goods Number" prop="goodsNumber">
          <el-input v-model="editForm.goodsNumber" type="number"></el-input>
        </el-form-item>
        <el-form-item label="goods Weight(oz)" prop="goodsWeight">
          <el-input v-model="editForm.goodsWeight" type="number"></el-input>
        </el-form-item>
        <el-form-item label="goods State" >
          <el-input v-model="editForm.goodsState"></el-input>
        </el-form-item>
        <el-form-item label="goods Description" >
          <el-input v-model="editForm.goodsDescription"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false" size="medium">Cancel</el-button>
        <el-button type="primary" @click="editGoods" size="medium">Edit</el-button>
      </span>
    </el-dialog>

    <!-- edit param -->
    <el-dialog
      title="Edit Goods"
      :visible.sync="editParamDialogVisible"
      width="40%" @close="editParamDialogClose">

      <el-form :model="editParamForm" :rules="editParamFormRules"
      ref="editParamFormRef" label-width="120px" size="medium">
        <el-form-item label="param" prop="key">
          <el-input v-model="editParamForm.key"></el-input>
        </el-form-item>
        <el-form-item label="param Value" prop="value">
          <el-input v-model="editParamForm.value"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamDialogVisible = false" size="medium">Cancel</el-button>
        <el-button type="primary" @click="editParam" size="medium">Edit</el-button>
      </span>
    </el-dialog>

    <!-- add param -->
    <el-dialog
      title="Add Param"
      :visible.sync="addParamDialogVisible"
      width="40%" @close="addParamDialogClose">

      <el-form :model="addParamForm" :rules="addParamFormRules"
      ref="addParamFormRef" label-width="120px" size="medium">
        <el-form-item label="param" prop="key">
          <el-input v-model="addParamForm.key"></el-input>
        </el-form-item>
        <el-form-item label="param Value" prop="value">
          <el-input v-model="addParamForm.value"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamDialogVisible = false" size="medium">Cancel</el-button>
        <el-button type="primary" @click="addParam" size="medium">Add</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    var checkNumber = (rule, value, callback) => {
      if (value >= 0) {
        return callback()
      }
      callback(new Error('two passwords have to be same'))
    }
    return {
      goodsList: [],
      categoryList: [],
      cascaderProps: {
        value: 'categoryId',
        label: 'categoryName',
        children: 'children'
      },
      selectedIds: [],
      editDialogVisible: false,
      editForm: {
        goodsId: 0,
        goodsName: '',
        goodsPrice: 0,
        goodsNumber: 0,
        goodsWeight: 0,
        goodsState: '',
        goodsDescription: ''
      },
      editFormRules: {
        goodsName: [
          { required: true, message: 'must not empty', trigger: 'blur' }
        ],
        goodsPrice: [
          { validator: checkNumber, trigger: 'blur' }
        ],
        goodsNumber: [
          { validator: checkNumber, trigger: 'blur' }
        ],
        goodsWeight: [
          { validator: checkNumber, trigger: 'blur' }
        ]
      },
      tabActiveName: 'detail',
      goodsParamList: [],
      editParamDialogVisible: false,
      editParamForm: {
        paramId: 0,
        key: '',
        value: ''
      },
      editParamFormRules: {
        key: [
          { required: true, message: 'must not empty', trigger: 'blur' }
        ],
        value: [
          { required: true, message: 'must not empty', trigger: 'blur' }
        ]
      },
      addParamDialogVisible: false,
      addParamForm: {
        goodsId: 0,
        key: '',
        value: ''
      },
      addParamFormRules: {
        key: [
          { required: true, message: 'must not empty', trigger: 'blur' }
        ],
        value: [
          { required: true, message: 'must not empty', trigger: 'blur' }
        ]
      },
      // 上传图片时绑定的参数头
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      }
    }
  },
  created () {
    this.getCategoryList()
  },
  methods: {
    async getGoodsList () {
      if (this.selectedIds.length === 3) {
        const result = await this.$http.post('/getGoodsListByCategory', {
          categoryId: this.selectedIds[2]
        })
        if (result.status !== 200) {
          return this.$message.error('failed to load goods info')
        }
        if (result.data.success === false) {
          return this.$message.error(result.data.errorMessage)
        }
        this.goodsList = result.data.result
        // console.log('=========')
        // console.log(this.goodsList)
      } else {
        this.goodsList = []
      }
    },
    async getCategoryList () {
      const result = await this.$http.get('/getCategoryList')
      if (result.status !== 200) {
        return this.$message.error('failed to load category info')
      }
      if (result.data.success === false) {
        return this.$message.error(result.data.errorMessage)
      }
      this.categoryList = result.data.result
      // console.log(this.categoryList)
    },
    categoryChanged () {
      // console.log(this.selectedIds)
      this.getGoodsList()
    },
    async rowExpandChange (row, expandedRows) {
      // console.log(row)
      // console.log(expandedRows)
      this.tabActiveName = 'detail'
      var flag = false
      for (var i = 0; i < expandedRows.length; i++) {
        if (expandedRows[i].goodsId === row.goodsId) {
          flag = true
          break
        }
      }
      if (flag) {
        // 请求商品参数
        const result = await this.$http.post('/getGoodsParamsList', {
          goodsId: row.goodsId
        })
        if (result.status !== 200) {
          return this.$message.error('failed to load goods params')
        }
        if (result.data.success === false) {
          return this.$message.error(result.data.errorMessage)
        }
        this.goodsParamList = result.data.result
        // console.log(this.goodsParamList)
      }
    },
    toAddHtml () {
      this.$router.push('/goods/add')
    },
    showEditDialog (goodsData) {
      this.editDialogVisible = true
      this.editForm.goodsId = goodsData.goodsId
      this.editForm.goodsName = goodsData.goodsName
      this.editForm.goodsPrice = goodsData.goodsPrice
      this.editForm.goodsNumber = goodsData.goodsNumber
      this.editForm.goodsWeight = goodsData.goodsWeight
      this.editForm.goodsState = goodsData.goodsState
      this.editForm.goodsDescription = goodsData.goodsDescription
    },
    editDialogClose () {
      this.editDialogVisible = false
    },
    editGoods () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('invalid goods info')
        }
        const result = await this.$http.post('/updateGoods', {
          goodsId: this.editForm.goodsId,
          goodsName: this.editForm.goodsName,
          goodsPrice: this.editForm.goodsPrice,
          goodsNumber: this.editForm.goodsNumber,
          goodsWeight: this.editForm.goodsWeight,
          goodsState: this.editForm.goodsState,
          goodsDescription: this.editForm.goodsDescription
        })
        if (result.status !== 200) {
          return this.$message.error('failed to update goods')
        }
        if (result.data.success === false) {
          return this.$message.error(result.data.errorMessage)
        }
        this.editDialogVisible = false
        this.$message.success('update goods sucessfully')
        this.selectedIds = []
      })
    },
    showDeleteDialog (goodsData) {
      const deleteMsg = '[ ' + goodsData.goodsName + ' ]\n will be deleted, Continue?'
      this.$confirm(deleteMsg, 'Delete Goods', {
        confirmButtonText: 'Continue',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async what => {
        const result = await this.$http.post('/deleteGoods', {
          goodsId: goodsData.goodsId,
          enabled: 0
        })
        if (result.status !== 200) {
          return this.$message.error('failed to delete goods')
        }
        if (result.data.success === false) {
          return this.$message.error(result.data.errorMessage)
        }
        this.$message.success('delete goods sucessfully')
        this.selectedIds = []
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'delete goods item cancelled'
        })
      })
    },
    showAddFormDialog (goodsData) {
      this.addParamForm.goodsId = goodsData.goodsId
      this.addParamDialogVisible = true
    },
    addParamDialogClose (goodsData) {
      this.$refs.addParamFormRef.resetFields()
      this.addParamDialogVisible = false
    },
    addParam () {
      this.$refs.addParamFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('invalid param info')
        }
        const result = await this.$http.post('/addGoodsParam', {
          key: this.addParamForm.key,
          value: this.addParamForm.value,
          goodsId: this.addParamForm.goodsId
        })
        if (result.status !== 200) {
          return this.$message.error('failed to add param')
        }
        if (result.data.success === false) {
          return this.$message.error(result.data.errorMessage)
        }
        this.addParamDialogVisible = false
        this.$message.success('add param successfully')
      })
    },
    showEditParamDialog (paramData) {
      this.editParamDialogVisible = true
      this.editParamForm.paramId = paramData.paramId
      this.editParamForm.key = paramData.key
      this.editParamForm.value = paramData.value
    },
    editParamDialogClose () {
      this.$refs.editParamFormRef.resetFields()
    },
    editParam () {
      this.$refs.editParamFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('invalid param info')
        }
        const result = await this.$http.post('/updateGoodsParam', {
          paramId: this.editParamForm.paramId,
          key: this.editParamForm.key,
          value: this.editParamForm.value
        })
        if (result.status !== 200) {
          return this.$message.error('failed to update param')
        }
        if (result.data.success === false) {
          return this.$message.error(result.data.errorMessage)
        }
        this.editParamDialogVisible = false
        this.$message.success('update param sucessfully')
      })
    },
    showDeleteParamDialog (paramData) {
      const deleteMsg = '[ ' + paramData.key + ' ]\n will be deleted, Continue?'
      this.$confirm(deleteMsg, 'Delete Param', {
        confirmButtonText: 'Continue',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async what => {
        const result = await this.$http.post('/deleteGoodsParam', {
          paramId: paramData.paramId
        })
        if (result.status !== 200) {
          return this.$message.error('failed to delete param')
        }
        if (result.data.success === false) {
          return this.$message.error(result.data.errorMessage)
        }
        this.$message.success('delete param sucessfully')
        this.selectedIds = []
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'delete param cancelled'
        })
      })
    },
    async exportGoodsExcel () {
      const result = await this.$http.get('/exportGoodsExcel', {
        responseType: 'blob'
      })
      if (result.status !== 200) {
        return this.$message.error('failed to export email')
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
      a.download = 'goods-information.xls'
      a.click()
      window.URL.revokeObjectURL(url)
    },
    submitUpload () {
      this.$refs.upload.submit()
    },
    uploadSuccess (response, file, fileList, goodsData) {
      goodsData = response.result
    },
    submitUploadBeforeAdd () {
      this.$refs.uploadBeforeAdd.submit()
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
.float-to-right {
  float: right;
  margin-bottom: 15px;
}
/deep/ .el-alert__title{
  font-size: 17px;
  font-weight: bold;
}

.select-box {
  margin-top: 15px;
  margin-bottom: 50px;
  display: flex;
  justify-content: space-between;
}
.select-title {
  float: left;
  vertical-align: middle;
  margin-top: 10px;
  font-family: 'Roboto';
  font-size: 18px;
}
.select-cascader {
  float: left;
  margin-left: 15px;
}
.add-cascader {
  width: 100%;
}
.demo-table-expand {
  font-size: 15px;
  margin-left: 25px;
  width: 60%;
  height: 460px;
  // float: left;
  display: inline-block;
  vertical-align: top;
  overflow: auto;
  // border: 3px solid red;
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
  font-size: 20px !important;
}
/deep/ .el-table__expanded-cell {
  height: 550px;
  padding: 10px 20px;
}

/deep/ .el-tabs--left {
  height: 500px !important;
}

/deep/ .el-tabs__content {
  height: 500px !important;
  padding: 10px 15px;
}
.detail-panel {
  display: flex;
  justify-content: space-between;
}
.goods-img-box {
  height: 460px;
  width: 40%;
  padding: 10px;
  // float: left;
  display: inline-block;
  vertical-align: top;
  img {
    height: 300px;
    width: 264px;
    box-shadow: 0 0 5px;
  }
  overflow: auto;
  // border: 3px solid violet;
}
.class3 {
  height: 300px;
  width: 264px;
  box-shadow: 0 0 5px;
  padding: 50px 10px;
}
.tip-text {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  display: block;
}
.upload-demo {
  margin-top: 20px;
}

.param-table {
  padding: 0 10px;
}

.add-upload-alert {
  margin-bottom: 15px;
}
</style>
