<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Index</el-breadcrumb-item>
      <el-breadcrumb-item>Routine</el-breadcrumb-item>
      <el-breadcrumb-item>Meetings</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div class="header-box">
        <div class="inline-div">
          <el-input placeholder="Input name for query" v-model="queryInfo.info" clearable style="width: 50%"></el-input>
          <el-button type="primary" @click="searchMeetings" plain
          icon="el-icon-search" style="margin-left: 15px;">search</el-button>
        </div>
        <div class="inline-div">
          <el-button type="success" @click="showAddDialog" plain
          icon="el-icon-circle-plus-outline" class="add-btn">Add Meeting</el-button>
        </div>
      </div>
      <div>
        <el-table border stripe :data="meetingList" empty-text="no data">
          <el-table-column type="expand" width="55">
            <template slot-scope="scope">
              <el-form label-position="left" label-width="130px" inline class="demo-table-expand">
                <el-form-item label="Theme">
                  <span>{{ scope.row.theme }}</span>
                </el-form-item>
                <el-form-item label="Total">
                  <span>{{ scope.row.total }}</span>
                </el-form-item>
                <el-form-item label="Type">
                  <span>{{ scope.row.type }}</span>
                </el-form-item>
                <el-form-item label="Location">
                  <span>{{ scope.row.location }}</span>
                </el-form-item>
                <el-form-item label="Begin Time">
                  <span>{{ scope.row.beginTime }}</span>
                </el-form-item>
                <el-form-item label="End Time">
                  <span>{{ scope.row.endTime }}</span>
                </el-form-item>
                <el-form-item label="Create Time">
                  <span>{{ scope.row.createTime }}</span>
                </el-form-item>
                <el-form-item label="Update Time">
                  <span>{{ scope.row.updateTime }}</span>
                </el-form-item>
                <el-form-item label="Remark">
                  <span>{{ scope.row.remark }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="Index" type="index" width="70" align="center"></el-table-column>
          <el-table-column label="Theme" prop="theme" align="center"></el-table-column>
          <el-table-column label="Total" prop="total" width="60px" align="center"></el-table-column>
          <el-table-column label="Begin Time" prop="beginTime" width="110px" align="center"></el-table-column>
          <el-table-column label="End Time" prop="endTime" align="center" width="110px"></el-table-column>
          <el-table-column label="Location" prop="location" align="center" width="100"></el-table-column>
          <el-table-column label="Type" prop="type" align="center"></el-table-column>
          <el-table-column label="Operaion">
            <template slot-scope="scope" align="center">
              <el-tooltip effect="dark" content="edit meeting" placement="top">
                <el-button type="primary" size="small" plain @click="showEditDialog(scope.row)" icon="el-icon-edit"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="delete meeting" placement="top">
                <el-button type="danger" size="small" plain @click="showDeleteDialog(scope.row, scope.$index, 0)" icon="el-icon-caret-bottom"></el-button>
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
      </div>
    </el-card>
    <!-- Add Prayer -->
    <el-dialog
      title="Add Meeing"
      :visible.sync="addDialogVisible"
      width="40%" @close="addDialogClose">

      <el-form :model="addForm" :rules="addFormRules"
      ref="addFormRef" label-width="110px" size="medium">
        <el-form-item label="Theme" prop="theme">
          <el-input v-model="addForm.theme"></el-input>
        </el-form-item>
        <el-form-item label="Location" prop="location">
          <el-input v-model="addForm.location"></el-input>
        </el-form-item>
        <el-form-item label="Participants" prop="people">
          <el-select v-model="addForm.people" size="medium"
            :multiple="true" placeholder="select participants" class="select-option"
            @change="selectedUserChanged">
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.username"
              :value="item.userId">
              <span style="float: left">{{ item.username }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">id : {{ item.userId }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Total" prop="total">
          <el-input v-model="addForm.total" type="number" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Types" prop="type">
          <el-select v-model="addForm.type" size="medium"
            :multiple="false" placeholder="select meeting types" class="select-option">
            <el-option
              v-for="item in meetingTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Begin Time" prop="beginTime">
          <el-date-picker v-model="addForm.beginTime" type="datetime" placeholder="select begin time"
          class="add-date-picker" value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="End Time" prop="endTime">
          <el-date-picker v-model="addForm.endTime" type="datetime" placeholder="select end time"
          class="add-date-picker" value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="Remark">
          <el-input v-model="addForm.remark"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false" size="medium">Cancel</el-button>
        <el-button type="primary" @click="addMeeting" size="medium">Add</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      meetingList: [],
      userList: [],
      queryInfo: {
        info: '',
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      meetingTypes: [{
        value: 'type1',
        label: 'on-site meeting'
      }, {
        value: 'type2',
        label: 'network meeting'
      }, {
        value: 'type3',
        label: 'phone meeting'
      }, {
        value: 'type4',
        label: 'annual meeting'
      }, {
        value: 'type5',
        label: 'other meeting'
      }],
      addDialogVisible: false,
      addForm: {
        theme: '',
        total: 0,
        people: [],
        type: '',
        location: '',
        beginTime: '',
        endTime: '',
        remark: ''
      },
      addFormRules: {
        theme: [
          { required: true, message: 'theme is necessary', trigger: 'blur' }
        ],
        beginTime: [
          { required: true, message: 'begin time is necessary', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: 'end time is necessary', trigger: 'blur' }
        ],
        people: [
          { required: true, message: 'people is necessary', trigger: 'blur' }
        ],
        type: [
          { required: true, message: 'type is necessary', trigger: 'blur' }
        ],
        location: [
          { required: true, message: 'location is necessary', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getMeetingList()
  },
  methods: {
    async getMeetingList () {
      const result = await this.$http.post('/getMeetingList', {
        info: this.queryInfo.info,
        pageNum: this.queryInfo.pageNum,
        pageSize: this.queryInfo.pageSize
      })
      if (result.status !== 200) {
        return this.$message.error('failed to load meetings')
      }
      if (result.data.success === false) {
        return this.$message.error(result.data.errorMessage)
      }
      this.meetingList = result.data.result.list
      this.total = result.data.result.total
    },
    async getUserList () {
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
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
    },
    handleCurrentChange (newNum) {
      this.queryInfo.pageNum = newNum
    },
    showAddDialog () {
      this.addDialogVisible = true
      this.getUserList()
    },
    addMeeting () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('invalid meeting info')
        }
        const result = await this.$http.post('/addMeeting', {
          theme: this.addForm.theme,
          total: this.addForm.total,
          people: this.addForm.people.join(','),
          type: this.addForm.type,
          location: this.addForm.location,
          beginTime: this.addForm.beginTime,
          endTime: this.addForm.endTime,
          remark: this.addForm.remark
        })
        if (result.status !== 200) {
          return this.$message.error('failed to add meeting')
        }
        if (result.data.success === false) {
          return this.$message.error(result.data.errorMessage)
        }
        this.addDialogVisible = false
        this.$message.success('add meeting successfully')
        this.getMeetingList()
      })
    },
    addDialogClose () {
      this.$refs.addFormRef.resetFields()
    },
    // 数组
    selectedUserChanged (changedUser) {
      // console.log(changedUser)
      this.addForm.total = changedUser.length
    },
    showEditDialog () {},
    showDeleteDialog () {},
    searchMeetings () {}
  }
}
</script>

<style lang="less" scoped>
.inlint-div {
  display: inline-block;
}
.header-box {
  display: flex;
  justify-content: space-between;
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
/deep/ .el-breadcrumb__item {
  font-size: 17px;
}
</style>
