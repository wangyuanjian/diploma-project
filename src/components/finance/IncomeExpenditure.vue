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
          format="yyyy - MM - dd" value-format="yyyy-MM-dd"
          style="margin-left: 15px;">
          </el-date-picker>
          <el-button type="primary" @click="searchIncomExpense" plain
          icon="el-icon-search" style="margin-left: 15px;">search</el-button>
        </div>
        <div class="inlint-div">
          <el-button type="primary" @click="showAddDialog" plain
          icon="el-icon-circle-plus-outline">Add New In&Out</el-button>
          <el-button type="success" @click="exportIncomeExpenseExcel" plain icon="el-icon-download">Export Excel</el-button>
        </div>
      </div>
      <transition mode="out-in" name="fade">
        <div v-if="searchVisible" key="search">
          <i class="el-icon-back" @click="backTo"></i>
          <el-table :data="inOutListWithCondition" border stripe empty-text="no data">
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
                  <el-form-item label="Create time">
                    <span>{{ scope.row.createTime }}</span>
                  </el-form-item>
                  <el-form-item label="Update time">
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
                <el-tooltip effect="dark" content="edit Income/Expense; If you want to modify money, delete this record and add a new one" placement="top">
                  <el-button type="primary" size="small" plain @click="showEditDialog(scope.row)" icon="el-icon-edit"></el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="delete Income/Expense" placement="top">
                  <el-button type="danger" size="small" plain @click="showDeleteDialog(scope.row)" icon="el-icon-delete"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-else key="normal">
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
                  <el-form-item label="Create time">
                    <span>{{ scope.row.createTime }}</span>
                  </el-form-item>
                  <el-form-item label="Update time">
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
                <el-tooltip effect="dark" content="edit Income/Expense; If you want to modify money, delete this record and add a new one" placement="top">
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
          <el-tabs @tab-click="handleClick">
            <el-tab-pane label="Last Week" name="first">
              <div>
                <div id="left-7days" class="left-data"></div>
                <div id="right-7days" class="right-data"></div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="Last Month" name="second">
              <div>
                <div id="left-1month" class="left-data"></div>
                <div id="right-1month" class="right-data"></div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="Customed Time Span" name="third">
              <div>
                <div class="search-for-analysis-bar">
                  <el-date-picker v-model="dateRangeForAnalysis" type="daterange" range-separator="to"
                  start-placeholder="Start Date" end-placeholder="End Date"
                  format="yyyy - MM - dd" value-format="yyyy-MM-dd"
                  style="margin-left: 15px;"></el-date-picker>
                  <el-button type="primary" @click="getInOutListForAnalysis" plain
                  icon="el-icon-search" style="margin-left: 15px;">search</el-button>
                </div>
                <div>
                  <div id="left-custom" class="left-data"></div>
                  <div id="right-custom" class="right-data"></div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="All Time" name="fourth">
              <div>
                <div id="left-all" class="left-data"></div>
                <div id="right-all" class="right-data"></div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </transition>
    </el-card>
    <!-- edit income/expense -->
    <el-dialog
    title="Edit User"
    :visible.sync="editDialogVisible"
    width="40%" @close="editDialogClose">

      <el-form :model="editForm" :rules="editFormRules"
      ref="editFormRef" label-width="100px" size="medium">
        <el-form-item label="About" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="Remark">
          <el-input v-model="editForm.remark"></el-input>
        </el-form-item>
        <el-form-item label="Date" prop="date">
          <el-date-picker v-model="editForm.date" type="date" placeholder="select date"
          class="add-date-picker" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="Direction">
          <el-input v-model="editForm.direction" disabled></el-input>
        </el-form-item>
        <el-form-item label="Money($)">
          <el-input v-model="editForm.money" disabled></el-input>
        </el-form-item>
        <el-form-item label="Balance($)">
          <el-input v-model="editForm.balance" disabled></el-input>
        </el-form-item>
        <el-form-item label="Username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false" size="medium">Cancel</el-button>
        <el-button type="primary" @click="editIncomeExpense" size="medium">Edit</el-button>
      </span>
    </el-dialog>
    <!-- Add Income/Expense -->
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
import echarts from 'echarts'
export default {
  data () {
    return {
      inOutList: [],
      inOutListWithCondition: [],
      inOutListAllDays: [],
      inOutList7Days: [],
      inOutList1Month: [],
      userList: [],
      queryInfo: {
        info: '',
        pageNum: 1,
        pageSize: 10,
        startTime: '',
        endTime: ''
      },
      total: 1,
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
      },
      editDialogVisible: false,
      editForm: {
        id: 0,
        name: '',
        remark: '',
        money: 0,
        balance: 0,
        date: '',
        username: '',
        direction: ''
      },
      editFormRules: {
        name: [
          { required: true, message: 'description is necessary', trigger: 'blur' }
        ],
        date: [
          { required: true, message: 'date is necessary', trigger: 'blur' }
        ]
      },
      // 这个是全局搜索的开始和结束时间
      dateRange: [],
      // 这个是指定时间范围的数据分析的开始和结束时间
      dateRangeForAnalysis: [],
      inOutListForAnalysis: [],
      searchVisible: false
    }
  },
  created () {
    this.getIncomeExpenseList()
  },
  methods: {
    // 返回的Result<PageInfo<IncomeExpenseDTO>>
    async getIncomeExpenseList () {
      const result = await this.$http.post('/getIncomeExpenseList', {
        info: this.queryInfo.info,
        pageNum: this.queryInfo.pageNum,
        pageSize: this.queryInfo.pageSize,
        startTime: this.queryInfo.startTime,
        endTime: this.queryInfo.endTime
      })
      if (result.status !== 200) {
        return this.$message.error('failed to load income and expense list')
      }
      if (result.data.success === false) {
        return this.$message.error(result.data.errorMessage)
      }
      this.inOutList = result.data.result.list
      this.total = result.data.result.total
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
    showDeleteDialog (inOutData) {
      const deleteMsg = '[ ' + inOutData.name + ' ] with value($) [ ' + inOutData.money + ' ] will be deleted, Continue?'
      this.$confirm(deleteMsg, 'Delete Param', {
        confirmButtonText: 'Continue',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async what => {
        const result = await this.$http.post('/deleteIncomeExpense', {
          id: inOutData.id,
          createTime: inOutData.createTime
        })
        if (result.status !== 200) {
          return this.$message.error('failed to delete Income/Expense')
        }
        if (result.data.success === false) {
          return this.$message.error(result.data.errorMessage)
        }
        this.$message.success('delete param Income/Expense')
        this.selectedIds = []
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'delete Income/Expense cancelled'
        })
      })
    },
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.getIncomeExpenseList()
    },
    handleCurrentChange (newNum) {
      this.queryInfo.pageNum = newNum
      this.getIncomeExpenseList()
    },
    showEditDialog (inOutData) {
      this.editDialogVisible = true
      this.editForm.id = inOutData.id
      this.editForm.name = inOutData.name
      this.editForm.remark = inOutData.remark
      this.editForm.money = inOutData.money
      this.editForm.balance = inOutData.balance
      this.editForm.date = inOutData.date
      this.editForm.username = inOutData.username
      this.editForm.direction = inOutData.direction === 1 ? 'expense' : 'income'
    },
    editDialogClose () {
      this.$refs.editFormRef.resetFields()
    },
    editIncomeExpense () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('invalid Income/Expense info')
        }
        const result = await this.$http.post('/updateIncomeExpense', {
          id: this.editForm.id,
          name: this.editForm.name,
          remark: this.editForm.remark,
          date: this.editForm.date
        })
        if (result.status !== 200) {
          return this.$message.error('failed to update Income/Expense ')
        }
        if (result.data.success === false) {
          return this.$message.error(result.data.errorMessage)
        }
        this.editDialogVisible = false
        this.$message.success('edit Income/Expense successfully')
        this.getIncomeExpenseList()
      })
    },
    // tabComponent 是VueComponent实例，可通过index或者name
    // 判断具体点击的Tab
    handleClick (tabComponent) {
      if (tabComponent.name === 'first') {
        this.queryInOutListBefore(7)
      } else if (tabComponent.name === 'second') {
        this.queryInOutListBefore(30)
      } else if (tabComponent.name === 'third') {
        console.log()
      } else if (tabComponent.name === 'fourth') {
        this.queryInOutListBefore(-1)
      }
    },
    async queryInOutListBefore (nDays) {
      if (((!this.inOutList7Days || this.inOutList7Days.length === 0) && nDays === 7) ||
      (((!this.inOutList1Month || this.inOutList1Month.length === 0) && nDays === 30)) ||
      nDays === -1) {
        const result = await this.$http.get('/getIncomeExpenseDateBefore?nDays=' + nDays)
        if (result.status !== 200) {
          return this.$message.error('failed to load recent Days')
        }
        if (result.data.success === false) {
          return this.$message.error(result.data.errorMessage)
        }
        if (nDays === 7) {
          this.inOutList7Days = result.data.result
        } else if (nDays === 30) {
          this.inOutList1Month = result.data.result
        } else if (nDays === -1) {
          this.inOutListAllDays = result.data.result
        }
        this.$message.success('query Income/Expense list successfully')
      }
      if (nDays === 7) {
        this.processDataAnalysisLeft(this.inOutList7Days, 'left-7days')
        this.processDataAnalysisRight(this.inOutList7Days, 'right-7days')
      } else if (nDays === 30) {
        this.processDataAnalysisLeft(this.inOutList1Month, 'left-1month')
        this.processDataAnalysisRight(this.inOutList1Month, 'right-1month')
      } else if (nDays === -1) {
        this.processDataAnalysisLeft(this.inOutListAllDays, 'left-all')
        this.processDataAnalysisRight(this.inOutListAllDays, 'right-all')
      }
    },
    processDataAnalysisLeft (inOutList, divName) {
      var incomeTotal = 0
      var expenseTotal = 0
      for (var i = 0; i < inOutList.length; i++) {
        incomeTotal = incomeTotal + inOutList[i].income
        expenseTotal = expenseTotal + inOutList[i].expense
      }
      var myPieChart = echarts.init(document.getElementById(divName))
      var option = {
        title: {
          text: 'Statistic of Income and Expense in Last Week',
          subText: 'updated every 0 o\'clock in the midnght',
          left: 'center',
          textStyle: {
            fontSize: 20
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        toolbox: {
          y: 'bottom',
          feature: {
            saveAsImage: {
              pixelRatio: 2
            }
          }
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 20,
          data: ['Income', 'Expense']
        },
        series: [{
          name: '访问来源',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '30',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: incomeTotal, name: 'Income' },
            { value: expenseTotal, name: 'Expense' }
          ]
        }]
      }
      myPieChart.setOption(option)
    },
    processDataAnalysisRight (inOutList, divName) {
      var dateList = []
      var incomeList = []
      var expenseList = []
      var diffList = []
      for (var i = 0; i < inOutList.length; i++) {
        dateList.push(inOutList[i].date.substr(0, 10))
        incomeList.push(inOutList[i].income)
        expenseList.push(inOutList[i].expense * -1)
        diffList.push(inOutList[i].income - inOutList[i].expense)
      }
      var myBarChart = echarts.init(document.getElementById(divName))
      var option = {
        title: {
          text: 'Bar of Income and Expense in Last Week',
          subText: 'updated every 0 o\'clock in the midnght',
          left: 'center',
          textStyle: {
            fontSize: 20
          }
        },
        legend: {
          data: ['Income', 'Expense', 'Diff'],
          right: 10,
          top: 10,
          orient: 'vertical'
        },
        toolbox: {
          y: 'bottom',
          feature: {
            saveAsImage: {
              pixelRatio: 2
            }
          }
        },
        xAxis: {
          type: 'category',
          data: dateList,
          axisLabel: {
            interval: 0,
            rotate: 45
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: 'Income',
          data: incomeList,
          type: 'bar',
          animationDelay: function (idx) {
            return idx * 10
          }
        }, {
          name: 'Expense',
          data: expenseList,
          type: 'bar'
        }, {
          name: 'Diff',
          data: diffList,
          type: 'line'
        }],
        dataZoom: [{
          type: 'slider',
          show: true,
          start: 0,
          end: 30,
          xAxisIndex: [0],
          bottom: -10
        }]
      }
      myBarChart.setOption(option)
    },
    async exportIncomeExpenseExcel () {
      const result = await this.$http.get('/exportIncomeExpenseExcel', {
        responseType: 'blob'
      })
      if (result.status !== 200) {
        return this.$message.error('failed to export income/expense excel')
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
      a.download = 'income-expense-information.xls'
      a.click()
      window.URL.revokeObjectURL(url)
    },
    async getInOutListForAnalysis () {
      const result = await this.$http.post('/getIncomeExpenseListInDateSpan', {
        startTime: this.dateRangeForAnalysis[0],
        endTime: this.dateRangeForAnalysis[1]
      })
      if (result.status !== 200) {
        return this.$message.error('failed to load order')
      }
      if (result.data.success === false) {
        return this.$message.error(result.data.errorMessage)
      }
      this.inOutListForAnalysis = result.data.result
      this.processDataAnalysisLeft(this.inOutListForAnalysis, 'left-custom')
      this.processDataAnalysisRight(this.inOutListForAnalysis, 'right-custom')
    },
    async searchIncomExpense () {
      console.log()
      this.searchVisible = true
      const result = await this.$http.post('/getIncomeExpenseListWithCondition', {
        info: this.queryInfo.info,
        startTime: this.queryInfo.startTime,
        endTime: this.queryInfo.endTime
      })
      if (result.status !== 200) {
        return this.$message.error('failed to load income and expense list')
      }
      if (result.data.success === false) {
        return this.$message.error(result.data.errorMessage)
      }
      this.inOutListWithCondition = result.data.result
    },
    backTo () {
      this.searchVisible = false
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
.left-data {
  width: 100%;
  height: 400px;
  // display: inline-block;
  border: 2px solid orangered;
  margin: 0 auto;
}
.right-data {
  width: 100%;
  height: 600px;
  // display: inline-block;
  border: 2px solid palevioletred;
  margin: 0 auto;
}
.search-for-analysis-bar {
  margin-top: 10px;
  margin-bottom: 25px;
}
.fade-enter-active,
.fade-leave-active {
  //all:过渡的属性名称, 0.2s:过渡的时长,
  // ease:速率,ease表示开始慢然后快最后慢
  transition: all 0.1s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);   // 表示进入点的位置, X轴,正向100px处进入
}
.el-icon-back {
  font-size: 25px;
  margin-top: 15px;
}
</style>
