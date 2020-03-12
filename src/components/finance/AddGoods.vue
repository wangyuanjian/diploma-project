<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Index</el-breadcrumb-item>
      <el-breadcrumb-item>Finance</el-breadcrumb-item>
      <el-breadcrumb-item>Add Goods Item</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert class="add-upload-alert" title="Upload Image First" type="warning" center show-icon></el-alert>
      <el-form :model="addForm" :rules="addFormRules"
      ref="addFormRef" label-width="160px" size="medium">
        <el-form-item label="goods Image">
          <!-- to be finished -->
          <el-upload
            ref="uploadBeforeAdd"
            action="http://127.0.0.1:8080/uploadGoodsImageBeforeAddingGoods"
            :auto-upload="false"
            :multiple="false"
            :on-success="uploadImageBeforeAdd"
            :limit="1" :headers="headerObj">
            <el-button slot="trigger" plain size="small" type="primary">Select Image</el-button>
            <el-button style="margin-left: 30px;" plain size="small" type="success" @click="submitUploadBeforeAdd">Submit It</el-button>
            <div slot="tip" class="el-upload__tip">only jpg/png and image size no more than 500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="goods Category">
          <el-cascader class="add-cascader"
            expand-trigger="hover"
            :options="categoryList" :props="cascaderProps"
            v-model="addForm.addSelectedIds" clearable
            placeholder="please select goods category" :disabled="!addForm.imgUrl">
          </el-cascader>
        </el-form-item>
        <el-form-item label="goods Name" prop="goodsName">
          <el-input v-model="addForm.goodsName" :disabled="!addForm.imgUrl"></el-input>
        </el-form-item>
        <el-form-item label="goods Price($)" prop="goodsPrice">
          <el-input v-model="addForm.goodsPrice" type="number" :disabled="!addForm.imgUrl"></el-input>
        </el-form-item>
        <el-form-item label="goods Number" prop="goodsNumber">
          <el-input v-model="addForm.goodsNumber" type="number" :disabled="!addForm.imgUrl"></el-input>
        </el-form-item>
        <el-form-item label="goods Weight(oz)" prop="goodsWeight">
          <el-input v-model="addForm.goodsWeight" type="number" :disabled="!addForm.imgUrl"></el-input>
        </el-form-item>
        <el-form-item label="goods State" >
          <el-input v-model="addForm.goodsState" :disabled="!addForm.imgUrl"></el-input>
        </el-form-item>
        <el-form-item label="goods Description" >
          <!-- <el-input v-model="addForm.goodsDescription" :disabled="!addForm.imgUrl"></el-input> -->
          <quill-editor class="rich-text" v-model="addForm.goodsDescription"></quill-editor>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain size="medium" @click="addGoods">Add</el-button>
          <el-button type="info" plain size="medium" @click="resetFormFilds">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-card>
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
      categoryList: [],
      cascaderProps: {
        value: 'categoryId',
        label: 'categoryName',
        children: 'children'
      },
      addForm: {
        goodsName: '',
        addSelectedIds: [],
        goodsPrice: 0,
        goodsNumber: 0,
        goodsWeight: 0,
        goodsState: '',
        goodsDescription: '',
        imgUrl: null
      },
      addFormRules: {
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
      imgUrl: '',
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
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
      // console.log(this.categoryList)
    },
    addGoods () {
      // 第一次我担心如果字符串里有单引号(')，那插入数据库的时候
      // 会有问题,结果就不用，什么都不用处理
      // console.log(this.addForm.goodsName.replace(/'/, '\\\''))
      if (this.addForm.addSelectedIds.length === 3) {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) {
            return this.$message.error('invalid goods info')
          }
          const result = await this.$http.post('/addGoods', {
            goodsName: this.addForm.goodsName,
            goodsPrice: this.addForm.goodsPrice,
            goodsNumber: this.addForm.goodsNumber,
            goodsWeight: this.addForm.goodsWeight,
            goodsState: this.addForm.goodsState,
            goodsDescription: this.addForm.goodsDescription,
            categoryId: this.addForm.addSelectedIds[2],
            imgUrl: this.addForm.imgUrl
          })
          if (result.status !== 200) {
            return this.$message.error('failed to add goods')
          }
          if (result.data.success === false) {
            return this.$message.error(result.data.errorMessage)
          }
          this.selectedIds = this.addForm.addSelectedIds
          this.addDialogVisible = false
          this.$message.success('add goods successfully')
        })
      }
    },
    resetFormFilds () {
      this.$refs.addFormRef.resetFields()
    },
    // 在添加商品前上传图片，如果上传成功那么返回的是
    // 图片在服务器上的地址
    uploadImageBeforeAdd (response, file, fileList) {
      if (response.success === true) {
        this.addForm.imgUrl = response.result
        this.imgUrl = response.result
        console.log(this.imgUrl)
        this.$message.success('upload image successfully')
        this.$router.push('/goods')
      } else {
        this.$message.error('failed to upload image')
      }
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
}
.el-card {
  height: 100%;
  padding: 20px 50px;
}

.el-alert {
  margin-bottom: 35px;
}
/deep/ .el-alert__title{
  font-size: 17px;
  font-weight: bold;
}
</style>
