<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Index</el-breadcrumb-item>
      <el-breadcrumb-item>Finance</el-breadcrumb-item>
      <el-breadcrumb-item>Income && Expenditure</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div class="header-box">
        <div class="inlint-div">
          <el-input placeholder="Input key words" v-model="queryInfo.info" clearable style="width: 30%"></el-input>
          <el-date-picker v-model="dateRange" type="daterange" range-separator="to"
          start-placeholder="Start Date" end-placeholder="End Date"
          format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"
          style="margin-left: 15px;">
          </el-date-picker>
          <el-button type="primary" @click="searchInouts" plain
          icon="el-icon-search" style="margin-left: 15px;">search</el-button>
        </div>
        <div class="inlint-div">
          <el-button type="primary" @click="showAddDialog" plain
          icon="el-icon-circle-plus-outline">Add New In&Out</el-button>
          <el-button type="success" @click="exportUserExcel" plain icon="el-icon-download">Export Excel</el-button>
        </div>
      </div>
      <el-table :data="inOutList" border stripe empty-text="no data">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="left" label-width="130px" inline class="demo-table-expand">
              <el-form-item label="Registrant">
                <span>{{ scope.row.username }}</span>
              </el-form-item>
              <el-form-item label="Description">
                <span>{{ scope.row.name }}</span>
              </el-form-item>
              <el-form-item label="Type">
                <span v-if="scope.row.direction === 0">Income</span>
                <span v-else>Expense</span>
              </el-form-item>
              <el-form-item label="Moeny($)">
                <span>{{ scope.row.money }}</span>
              </el-form-item>
              <el-form-item label="Date">
                <span>{{ scope.row.date }}</span>
              </el-form-item>
              <el-form-item label="Balance($)">
                <span>{{ scope.row.balance }}</span>
              </el-form-item>
              <el-form-item label="Remark">
                <span>{{ scope.row.remark }}</span>
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
        <el-table-column label="Index" type="index" width="70" align="center"></el-table-column>
        <el-table-column label="About" prop="name" align="center"></el-table-column>
        <el-table-column label="Money($)" prop="money" width="90px" align="center"></el-table-column>
        <el-table-column label="Direction" prop="direction" width="100px" align="center">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.direction === 0">Income</el-tag>
            <el-tag type="warning" v-else>Expense</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Registrant" prop="username" align="center" width="100"></el-table-column>
        <el-table-column label="Date" prop="date" align="center" width="120"></el-table-column>
        <el-table-column label="Balance($)" prop="balance" width="100px" align="center"></el-table-column>
        <el-table-column label="Operation" align="center" width="150">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="edit Income/Expense" placement="top">
              <el-button type="primary" size="small" plain @click="showEditDialog(scope.row)" icon="el-icon-edit"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="delete Income/Expense" placement="top">
              <el-button type="danger" size="small" plain @click="showDeleteDialog(scope.row)" icon="el-icon-delete"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[10]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <p>
        <span class="display-title">Data Statistics</span>
      </p>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="Last Week" name="first">Last Week</el-tab-pane>
        <el-tab-pane label="Last Month" name="second">Last Month</el-tab-pane>
        <el-tab-pane label="Customed Time Span" name="third">Customed Time Span</el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- Add User -->
    <el-dialog
      title="Add Income/Expense"
      :visible.sync="addDialogVisible"
      width="40%" @close="addDialogClose">

      <el-form :model="addForm" :rules="addFormRules"
      ref="addFormRef" label-width="100px" size="medium">
        <el-form-item label="Username" prop="username">
          <el-select v-model="addForm.userId" size="medium"
            :multiple="false" placeholder="select user"
            no-data-text="no data">
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.username"
              :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Money" prop="money">
          <el-input v-model="addForm.money" type="number"></el-input>
        </el-form-item>
        <el-form-item label="Description" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="Direction" prop="direction">
          <el-select v-model="addForm.direction" size="medium"
            :multiple="false" placeholder="select cost type"
            no-data-text="no data">
            <el-option
              v-for="item in directionList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Date" prop="date">
          <el-date-picker v-model="addForm.date" type="date" placeholder="select date"
          class="add-date-picker" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="Remark">
          <el-input v-model="addForm.remark"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false" size="medium">Cancel</el-button>
        <el-button type="primary" @click="addInOut" size="medium">Add</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      inOutList: [],
      userList: [],
      queryInfo: {
        info: '',
        pageNum: 1,
        pageSize: 10,
        startTime: '',
        endTime: ''
      },
      total: 1,
      dateRange: [],
      addDialogVisible: false,
      directionList: [{
        label: 'income',
        value: 0
      }, {
        label: 'expense',
        value: 1
      }],
      addForm: {
        userId: '',
        name: '',
        direction: '',
        money: 0,
        remark: '',
        date: ''
      },
      addFormRules: {
        username: [
          { required: true, message: 'username is necessary', trigger: 'blur' }
        ],
        name: [
          { required: true, message: 'description is necessary', trigger: 'blur' }
        ],
        money: [
          { required: true, message: 'moeny is necessary', trigger: 'blur' }
        ],
        direction: [
          { required: true, message: 'type is necessary', trigger: 'blur' }
        ],
        date: [
          { required: true, message: 'date is necessary', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getIncomeExpenseList()
  },
  methods: {
    async getIncomeExpenseList () {
      const result = await this.$http.post('/getIncomeExpenseList', {
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
      this.inOutList = result.data.result
      this.total = this.inOutList.length
    },
    async showAddDialog () {
      this.addDialogVisible = true
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
    },
    addInOut () {
      this.$refs.addFormRef.validate(async valid => {
        for (var i = 0; i < this.userList.length; i++) {
          if (this.userList[i].userId === this.addForm.userId) {
            this.addForm.username = this.userList[i].username
          }
        }
        const result = await this.$http.post('/addIncomeExpense', {
          userId: this.addForm.userId,
          name: this.addForm.name,
          address: this.addForm.address,
          direction: this.addForm.direction,
          money: this.addForm.money,
          remark: this.addForm.remark,
          username: this.addForm.username,
          date: this.addForm.date
        })
        if (result.status !== 200) {
          return this.$message.error('failed to add Income/Expense')
        }
        if (result.data.success === false) {
          return this.$message.error(result.data.errorMessage)
        }
        this.$message.success('add new Income/Expense successfully')
        this.getIncomeExpenseList()
        this.addDialogVisible = false
      })
    },
    addDialogClose () {
      this.$refs.addFormRef.resetFields()
      this.addForm.userId = ''
      this.addForm.remark = ''
    },
    showEditDialog (inOutData) {},
    showDeleteDialog (inOutData) {},
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
    },
    handleCurrentChange (newNum) {
      this.queryInfo.newNum = newNum
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .el-breadcrumb__item {
  font-size: 17px;
}
.add-btn {
  position: absolute;
  right: 45px;
}
.inlint-div {
  display: inline-block;
}
.header-box {
  display: flex;
  justify-content: space-between;
}
.display-title {
  font-size: 35px;
  font-weight: bold;
}
.el-pagination {
  margin-bottom: 100px;
}
/deep/ .el-tabs__item{
  font-size: 17px;
}
.el-select{
  width: 100%;
}
.add-date-picker {
  width: 100%;
}
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
</style>
