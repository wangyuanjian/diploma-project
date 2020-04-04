<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Index</el-breadcrumb-item>
      <el-breadcrumb-item>Finance</el-breadcrumb-item>
      <el-breadcrumb-item>Order</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div class="header-box">
        <div class="inline-div">
          <el-input placeholder="Input name for query" v-model="queryInfo.info" clearable style="width: 20%"></el-input>
          <el-date-picker v-model="dateRange" type="daterange" range-separator="to"
          start-placeholder="Start Date" end-placeholder="End Date"
          format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"
          @change="datePickerChanged" style="margin-left: 15px;">
          </el-date-picker>
          <el-button type="primary" @click="searchOrders" plain
          icon="el-icon-search" style="margin-left: 15px;">search</el-button>
        </div>
        <div class="inline-div">
          <el-button type="success" @click="showAddDialog" plain
        icon="el-icon-circle-plus-outline" class="add-btn">Add New Order</el-button>
        </div>
      </div>
      <div class="order-box">
        <div class="order-item" v-for="item in orderList" :key="item.orderId">
          <div class="order-header">
            <span class="header-text">Order Id : {{item.orderId}}</span>
            <span class="header-text">Total Money($) : {{item.orderValue}}</span>
            <span class="header-text">Create Time : {{item.createTime}}</span>
          </div>
          <div class="order-detail">
            <div class="detail-item">
              <span class="header-text">Order Status : </span>
              <el-tag class="status-tag" >{{item.isPaid === 1 ? 'Paid' : 'Not Paid'}}</el-tag>
              <el-tag class="status-tag" type="success">{{item.isDelivered === 1 ? 'Delivered' : 'Delivering'}}</el-tag>
              <el-tag class="status-tag" type="warning">{{item.isAccepted === 1 ? 'Signed' : 'Not Signed'}}</el-tag>
            </div>
            <div class="detail-item">
              <span class="header-text label-width">Order Custum(UserId) : </span>
              <span>{{item.username}}({{item.userId}})</span>
            </div>
            <div class="detail-item">
              <span class="header-text label-width">Delivery Address : </span>
              <span>{{item.address}}</span>
              <!-- <el-button>{{item.address}}</el-button> -->
            </div>
            <div class="detail-item">
              <span class="header-text">Delivery Remarks : </span>
              <span>{{item.remark}}</span>
            </div>
            <div>
              <span class="header-text">Order Goods</span>
              <div v-for="goods in item.goodsList" :key="goods.id" class="goods-li">
                <el-popover placement="top-start"
                  title="Goods Detail"
                  width="500"
                  trigger="hover">
                  <div>
                    <p>
                      <span class="header-text">GoodsId : </span>
                      <span>{{goods.goodsId}}</span>
                    </p>
                    <p>
                      <span class="header-text">GoodsName : </span>
                      <span>{{goods.goodsName}}</span>
                    </p>
                    <p>
                      <span class="header-text">GoodsPrice($) : </span>
                      <span>{{goods.goodsPrice}}</span>
                    </p>
                  </div>
                  <el-button slot="reference">{{goods.goodsName|sub-goods-name(20)}}</el-button>
                </el-popover>
              </div>
            </div>
            <div class="detail-item">
              <span class="header-text">Last Update : </span>
              <span>{{item.updateTime}}</span>
            </div>
          </div>
          <div class="order-tail">
            <el-button type="primary" plain size="small" @click="showEditDialog(item)">Edit</el-button>
            <el-button type="danger" plain size="small" @click="showDeleteDialog(item)">Delete</el-button>
          </div>
        </div>
      </div>
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

    <!-- add new order -->
    <el-dialog
      title="Add Order"
      :visible.sync="addDialogVisible"
      width="40%" @close="addDialogClose">

      <el-form :model="addForm" :rules="addFormRules"
      ref="addFormRef" label-width="120px" size="medium">
        <el-form-item label="Username" prop="username">
          <el-select v-model="addForm.userId" size="medium"
            :multiple="false" placeholder="select user" class="select-option">
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.username"
              :value="item.userId">
              <span style="float: left">{{ item.username }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.userId }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Address" prop="address">
          <el-input v-model="addForm.address"></el-input>
        </el-form-item>
        <el-form-item label="Paid" prop="isPaid">
          <el-select v-model="addForm.isPaid" size="medium"
            :multiple="false" placeholder="Paid Or Not" class="select-option">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Delivered" prop="isDelivered">
          <el-select v-model="addForm.isDelivered" size="medium"
            :multiple="false" placeholder="Delivered Or Not" class="select-option">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Signed" prop="isAccepted">
          <el-select v-model="addForm.isAccepted" size="medium"
            :multiple="false" placeholder="Signed Or Not" class="select-option">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Select Goods" prop="goodsIds">
          <el-select v-model="addForm.goodsIds" size="medium"
            :multiple="true" placeholder="select goods" class="select-option"
            @change="selectedGoodsChanged">
            <el-option
              v-for="item in goodsList"
              :key="item.goodsId"
              :label="item.goodsName | sub-goods-name(40)"
              :value="item.goodsId"
              :disabled="item.goodsNumber <= 0 ? true : false">
              <span style="float: left">{{ item.goodsName|sub-goods-name(40)}}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">stock: {{ item.goodsNumber }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Order Value" prop="orderValue">
          <el-input v-model="addForm.orderValue" type="number"></el-input>
        </el-form-item>
        <el-form-item label="Remark">
          <el-input v-model="addForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false" size="medium">Cancel</el-button>
        <el-button type="primary" @click="addOrder" size="medium">Add</el-button>
      </span>
    </el-dialog>

    <!-- Edit Order -->
    <el-dialog
      title="Edit Order"
      :visible.sync="editDialogVisible"
      width="40%" @close="editDialogClose">

      <el-form :model="editForm" :rules="editFormRules"
      ref="editFormRef" label-width="120px" size="medium">
        <el-form-item label="Username" prop="username">
          <el-input v-model="editForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Address" prop="address">
          <el-input v-model="editForm.address"></el-input>
        </el-form-item>
        <el-form-item label="Paid" prop="isPaid">
          <el-select v-model="editForm.isPaid" size="medium"
            :multiple="false" placeholder="Paid Or Not" class="select-option">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Delivered" prop="isDelivered">
          <el-select v-model="editForm.isDelivered" size="medium"
            :multiple="false" placeholder="Delivered Or Not" class="select-option">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Signed" prop="isAccepted">
          <el-select v-model="editForm.isAccepted" size="medium"
            :multiple="false" placeholder="Signed Or Not" class="select-option">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Select Goods" prop="goodsIds">
          <el-select v-model="editForm.goodsIds" size="medium"
            :multiple="true" placeholder="select goods" class="select-option"
            @change="selectedGoodsChanged2">
            <el-option
              v-for="item in goodsList"
              :key="item.goodsId"
              :label="item.goodsName | sub-goods-name(50)"
              :value="item.goodsId">
              <span style="float: left">{{ item.goodsName|sub-goods-name(50)}}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.goodsId }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Order Value" prop="orderValue">
          <el-input v-model="editForm.orderValue" type="number"></el-input>
        </el-form-item>
        <el-form-item label="Remark">
          <el-input v-model="editForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false" size="medium">Cancel</el-button>
        <el-button type="primary" @click="editOrder" size="medium">Edit</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      orderList: [],
      userList: [],
      goodsList: [],
      queryInfo: {
        info: '',
        pageNum: 1,
        pageSize: 10,
        startTime: '',
        endTime: ''
      },
      dateRange: '',
      total: 1,
      addDialogVisible: false,
      addForm: {
        userId: 0,
        goodsIds: [],
        address: '',
        remark: '',
        isPaid: 0,
        isDelivered: 0,
        isAccepted: 0,
        orderValue: 0
      },
      addFormRules: {
        username: [
          { required: true, message: 'username is necessary', trigger: 'blur' }
        ],
        address: [
          { required: true, message: 'address is necessary', trigger: 'blur' }
        ],
        isPaid: [
          { required: true, message: 'paid or not is necessary', trigger: 'blur' }
        ],
        isDelivered: [
          { required: true, message: 'delivered or not is necessary', trigger: 'blur' }
        ],
        isAccepted: [
          { required: true, message: 'signed or not is necessary', trigger: 'blur' }
        ],
        goodsIds: [
          { required: true, message: 'goods is necessary', trigger: 'blur' }
        ],
        orderValue: [
          { required: true, message: 'order value is necessary', trigger: 'blur' }
        ]
      },
      options: [{
        value: 1,
        label: 'Yes'
      }, {
        value: 0,
        label: 'No'
      }],
      editDialogVisible: false,
      editForm: {
        orderId: 0,
        username: '',
        goodsIds: [],
        address: '',
        remark: '',
        isPaid: 0,
        isDelivered: 0,
        isAccepted: 0,
        orderValue: 0
      },
      editFormRules: {
        username: [
          { required: true, message: 'username is necessary', trigger: 'blur' }
        ],
        address: [
          { required: true, message: 'address is necessary', trigger: 'blur' }
        ],
        isPaid: [
          { required: true, message: 'paid or not is necessary', trigger: 'blur' }
        ],
        isDelivered: [
          { required: true, message: 'delivered or not is necessary', trigger: 'blur' }
        ],
        isAccepted: [
          { required: true, message: 'signed or not is necessary', trigger: 'blur' }
        ],
        goodsIds: [
          { required: true, message: 'goods is necessary', trigger: 'blur' }
        ],
        orderValue: [
          { required: true, message: 'order value is necessary', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    async getOrderList () {
      const result = await this.$http.post('/getOrderList', {
        info: this.queryInfo.info,
        pageNum: this.queryInfo.pageNum,
        pageSize: this.queryInfo.pageSize,
        startTime: this.queryInfo.startTime,
        endTime: this.queryInfo.endTime
      })
      if (result.status !== 200) {
        return this.$message.error('failed to load order')
      }
      if (result.data.success === false) {
        return this.$message.error(result.data.errorMessage)
      }
      this.orderList = result.data.result.list
      this.total = result.data.result.total
      // console.log(this.orderList)
    },
    // dataRange 是一个二元数组，第一个值是startDate, 第二个值是endDate
    // datePicker双向绑定的值也是该二元数组
    datePickerChanged (dataRange) {
      // console.log(dataRange)
      // console.log(maxValue)
      // console.log(this.dateRange)
      // console.log(dataRange)
    },
    searchOrders () {
      // console.log(this.queryInfo.info)
      // console.log(this.dateRange)
      if (this.dateRange !== null && this.dateRange.length === 2) {
        this.queryInfo.startTime = this.dateRange[0]
        this.queryInfo.endTime = this.dateRange[1]
      } else {
        this.queryInfo.startTime = ''
        this.queryInfo.endTime = ''
      }
      this.getOrderList()
    },
    // 在点击添加按钮时，加载用户名单和商品名单
    async preQueryUserAndGoods () {
      if (!this.userList || this.userList.length === 0) {
        const result = await this.$http.get('/getUserListForOrder')
        if (result.status !== 200) {
          return this.$message.error('failed to load user')
        }
        if (result.data.success === false) {
          return this.$message.error(result.data.errorMessage)
        }
        this.userList = result.data.result
      }
      if (!this.goodsList || this.goodsList.length === 0) {
        const result = await this.$http.get('/getGoodsListForOrder')
        if (result.status !== 200) {
          return this.$message.error('failed to load goods')
        }
        if (result.data.success === false) {
          return this.$message.error(result.data.errorMessage)
        }
        this.goodsList = result.data.result
      }
    },
    showAddDialog () {
      this.addDialogVisible = true
      this.preQueryUserAndGoods()
    },
    addDialogClose () {
      this.addDialogVisible = false
      this.$refs.addFormRef.resetFields()
    },
    async addOrder () {
      const result = await this.$http.post('/addOrder', {
        userId: this.addForm.userId,
        goodsIds: this.addForm.goodsIds.join(','),
        address: this.addForm.address,
        remark: this.addForm.remark,
        isPaid: this.addForm.isPaid,
        isDelivered: this.addForm.isDelivered,
        isAccepted: this.addForm.isAccepted,
        orderValue: this.addForm.orderValue
      })
      if (result.status !== 200) {
        return this.$message.error('failed to load goods')
      }
      if (result.data.success === false) {
        return this.$message.error(result.data.errorMessage)
      }
      this.$message.success('add new order successfully')
      this.getOrderList()
      this.addDialogVisible = false
    },
    showEditDialog (orderData) {
      this.preQueryUserAndGoods()
      this.editDialogVisible = true
      this.editForm.orderId = orderData.orderId
      this.editForm.username = orderData.username
      this.editForm.address = orderData.address
      this.editForm.remark = orderData.remark
      this.editForm.isPaid = orderData.isPaid
      this.editForm.isDelivered = orderData.isDelivered
      this.editForm.isAccepted = orderData.isAccepted
      this.editForm.orderValue = orderData.orderValue
      // 直接分割出来的结果的数字时字符串数字，如['6', '14', '2']
      // 故需要将其转化为数字 [6, 14, 2]
      const strIds = orderData.goodsIds.split(',')
      var intIds = []
      for (var i = 0; i < strIds.length; i++) {
        intIds.push(parseInt(strIds[i]))
      }
      this.editForm.goodsIds = intIds
    },
    async editOrder () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('invalid order info')
        }
        const result = await this.$http.post('/updateOrder', {
          orderId: this.editForm.orderId,
          address: this.editForm.address,
          remark: this.editForm.remark,
          isPaid: this.editForm.isPaid,
          isDelivered: this.editForm.isDelivered,
          isAccepted: this.editForm.isAccepted,
          goodsIds: this.editForm.goodsIds.join(','),
          orderValue: this.editForm.orderValue
        })
        if (result.status !== 200) {
          return this.$message.error('failed to update category')
        }
        if (result.data.success === false) {
          return this.$message.error(result.data.errorMessage)
        }
        this.$message.success('update category sucessfully')
        this.getOrderList()
        this.editDialogVisible = false
      })
    },
    editDialogClose () {
      this.$refs.editFormRef.resetFields()
    },
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
    },
    handleCurrentChange (newNum) {
      this.queryInfo.pageNum = newNum
    },
    calculateOrderValue (selectedGoods) {
      var orderValue = 0
      for (var i = 0; i < selectedGoods.length; i++) {
        for (var j = 0; j < this.goodsList.length; j++) {
          if (this.goodsList[j].goodsId === selectedGoods[i]) {
            orderValue += this.goodsList[j].goodsPrice
          }
        }
      }
      return orderValue
    },
    selectedGoodsChanged (selectedGoods) {
      // 当选中值发生变化时，对应订单金额也需要改变
      const orderValue = this.calculateOrderValue(selectedGoods)
      this.addForm.orderValue = orderValue
    },
    selectedGoodsChanged2 (selectedGoods) {
      // 当选中值发生变化时，对应订单金额也需要改变
      const orderValue = this.calculateOrderValue(selectedGoods)
      this.editForm.orderValue = orderValue
    },
    showDeleteDialog (orderData) {
      const deleteMsg = 'order [' + orderData.orderId + '] by user ' +
        orderData.username + ' will be deleted, Continue?'
      this.$confirm(deleteMsg, 'Delete Category', {
        confirmButtonText: 'Continue',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async what => {
        const result = await this.$http.post('/deleteOrder', {
          orderId: orderData.orderId
        })
        if (result.status !== 200) {
          return this.$message.error('failed to delete category')
        }
        if (result.data.success === false) {
          return this.$message.error(result.data.errorMessage)
        }
        this.$message.success('delete order sucessfully')
        this.getOrderList()
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
.inlint-div {
  display: inline-block;
}
.header-box {
  display: flex;
  justify-content: space-between;
}
.order-box {
  margin-top: 30px;
  margin-bottom: 20px;
}
.order-item {
  border: solid 3px #eee;
  box-shadow: 3px 3px 5px #eee;
  border-radius: 6px;
  padding: 10px 15px;
  margin-top: 30px;
}
.order-header {
  display: flex;
  justify-content: space-between;
  background-color:blanchedalmond;
  padding: 3px 5px;
  border-radius: 3px;
  // padding-bottom: 3px;
}
.order-detail {
  margin-left: 50px;
}
.header-text {
  color: #99a9bf;
  font-size: 15px;
  font-weight: bold;
}
.status-tag {
  margin-left: 20px;
}
.goods-li {
  margin-top: 10px;
  display: inline-block;
  margin-left: 15px;
}
.detail-item {
  margin-top: 15px;
  display: inline-block;
  width: 50%;
}
.order-tail {
  display: flex;
  justify-content: flex-end;
}
.select-option {
  width: 100%;
}
</style>
