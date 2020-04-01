<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Index</el-breadcrumb-item>
      <el-breadcrumb-item>Prayer</el-breadcrumb-item>
      <el-breadcrumb-item>Prayers</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div class="header-box">
        <div class="inline-div">
          <el-input placeholder="Input name for query" v-model="queryInfo.info" clearable style="width: 50%"></el-input>
          <el-button type="primary" @click="searchPrayers" plain
          icon="el-icon-search" style="margin-left: 15px;">search</el-button>
        </div>
        <div class="inline-div">
          <el-button type="warning" @click="exportPrayerToWord" plain
          icon="el-icon-download" class="add-btn">Export Word</el-button>
          <el-button type="danger" @click="showTransferDialog" plain
          icon="el-icon-sort" class="add-btn">Transfer Prayer</el-button>
          <el-button type="success" @click="showAddDialog" plain
          icon="el-icon-circle-plus-outline" class="add-btn">Add New Prayer</el-button>
        </div>
      </div>
      <div class="enabled-prayers prayers">
        <div>
          <span class="display-title">Prayers Of Week</span>
        </div>
        <el-table border stripe :data="enabledPrayerList" empty-text="no data"
        @select="enabledPrayerSelected">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="Index" type="index" width="70" align="center"></el-table-column>
          <el-table-column label="Content" prop="prayerContent" align="center"></el-table-column>
          <el-table-column label="Date" prop="prayerDate" width="90px" align="center"></el-table-column>
          <el-table-column label="Create Time" prop="createTime" width="120px" align="center"></el-table-column>
          <el-table-column label="Operation" align="center" width="150">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="edit prayer" placement="top">
              <el-button type="primary" size="small" plain @click="showEditDialog(scope.row)" icon="el-icon-edit"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="delete prayer" placement="top">
              <el-button type="danger" size="small" plain @click="showDeleteDialog(scope.row, scope.$index)" icon="el-icon-delete"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        </el-table>
      </div>
      <div class="enabled-prayers prayers">
        <div>
          <span class="display-title">History Prayers</span>
        </div>
        <el-table border stripe :data="notEnabledPrayerList" empty-text="no data">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="Index" type="index" width="70" align="center"></el-table-column>
          <el-table-column label="Content" prop="prayerContent" align="center"></el-table-column>
          <el-table-column label="Date" prop="prayerDate" width="90px" align="center"></el-table-column>
          <el-table-column label="Create Time" prop="createTime" width="120px" align="center"></el-table-column>
          <el-table-column label="Update Time" prop="updateTime" width="120px" align="center"></el-table-column>
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
      title="Add Prayer"
      :visible.sync="addDialogVisible"
      width="40%" @close="addDialogClose">

      <el-form :model="addForm" :rules="addFormRules"
      ref="addFormRef" label-width="140px" size="medium">
        <el-form-item label="Prayer Content" prop="prayerContent">
          <el-input v-model="addForm.prayerContent" type="textarea" :rows="2"></el-input>
        </el-form-item>
        <el-form-item label="Prayer Date" prop="prayerDate">
          <el-date-picker v-model="addForm.prayerDate" type="date" placeholder="select date"
          class="add-date-picker" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false" size="medium">Cancel</el-button>
        <el-button type="primary" @click="addPrayer" size="medium">Add</el-button>
      </span>
    </el-dialog>
    <!-- edit User -->
    <el-dialog
      title="Edit Prayer"
      :visible.sync="editDialogVisible"
      width="40%" @close="editDialogClose">

      <el-form :model="editForm" :rules="editFormRules"
      ref="editFormRef" label-width="140px" size="medium">
        <el-form-item label="Prayer Id">
          <el-input v-model="editForm.prayerId" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Prayer Content" prop="prayerContent">
          <el-input v-model="editForm.prayerContent" type="textarea" :rows="2"></el-input>
        </el-form-item>
        <el-form-item label="Prayer Date" prop="prayerDate">
          <el-date-picker v-model="editForm.prayerDate" type="date" placeholder="select date"
          class="add-date-picker" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false" size="medium">Cancel</el-button>
        <el-button type="primary" @click="editPrayer" size="medium">Edit</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="Transfer Prayer"
      :visible.sync="transferDialogVisible"
      width="40%">
      <!-- data 是左右两遍的集合,而v-model绑定的是右边的集合 -->
      <el-transfer v-model="transferNotEnabledList" :data="transferList"
      :titles="['Week Prayers', 'History Prayers']" empty-text="no data"></el-transfer>

      <span slot="footer" class="dialog-footer">
        <el-button @click="transferDialogVisible = false" size="medium">Cancel</el-button>
        <el-button type="primary" @click="transferPrayer" size="medium">Transfer</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      enabledPrayerList: [],
      notEnabledPrayerList: [],
      queryInfo: {
        info: '',
        pageNum: 1,
        pageSize: 10,
        enabled: 1
      },
      total: 0,
      addDialogVisible: false,
      addForm: {
        prayerContent: '',
        prayerDate: '',
        enabled: 1
      },
      addFormRules: {
        prayerContent: [
          { required: true, message: 'content is necessary', trigger: 'blur' }
        ],
        prayerDate: [
          { required: true, message: 'date is necessary', trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editForm: {
        prayerId: 0,
        prayerContent: '',
        prayerDate: ''
      },
      editFormRules: {
        prayerContent: [
          { required: true, message: 'content is necessary', trigger: 'blur' }
        ],
        prayerDate: [
          { required: true, message: 'date is necessary', trigger: 'blur' }
        ]
      },
      transferDialogVisible: false,
      // transferList 是有效和无效prayer的list
      transferList: [],
      // transferNotEnabledList 是无效的，里面保存的是prayer 的prayerId
      transferNotEnabledList: []
    }
  },
  created () {
    this.getPrayerList(1)
    this.getPrayerList(0)
  },
  methods: {
    async getPrayerList (enabled) {
      if (enabled === 1) {
        this.queryInfo.pageSize = 100
      } else {
        this.queryInfo.enabled = 0
      }
      const result = await this.$http.post('/getPrayerList', {
        info: this.queryInfo.info,
        pageNum: this.queryInfo.pageNum,
        pageSize: this.queryInfo.pageSize,
        enabled: this.queryInfo.enabled
      })
      if (result.status !== 200) {
        return this.$message.error('failed to load prayers')
      }
      if (result.data.success === false) {
        return this.$message.error(result.data.errorMessage)
      }
      if (enabled === 1) {
        this.enabledPrayerList = result.data.result.list
      } else if (enabled === 0) {
        this.notEnabledPrayerList = result.data.result.list
        this.total = result.data.result.total
      }
    },
    showAddDialog () {
      this.addDialogVisible = true
    },
    addPrayer () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('invalid prayer info')
        }
        const result = await this.$http.post('/addPrayer', {
          prayerContent: this.addForm.prayerContent,
          prayerDate: this.addForm.prayerDate,
          enabled: this.addForm.enabled
        })
        if (result.status !== 200) {
          return this.$message.error('failed to add prayer')
        }
        if (result.data.success === false) {
          return this.$message.error(result.data.errorMessage)
        }
        this.addDialogVisible = false
        this.$message.success('add prayer successfully')
        this.enabledPrayerList.unshift(result.data.result)
      })
    },
    addDialogClose () {
      this.$refs.addFormRef.resetFields()
    },
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.getPrayerList(0)
    },
    handleCurrentChange (newNum) {
      this.queryInfo.pageNum = newNum
      this.getPrayerList(0)
    },
    showEditDialog (prayerData) {
      this.editDialogVisible = true
      this.editForm.prayerId = prayerData.prayerId
      this.editForm.prayerContent = prayerData.prayerContent
      this.editForm.prayerDate = prayerData.prayerDate
    },
    editPrayer () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('invalid prayer info')
        }
        const result = await this.$http.post('/editPrayer', {
          prayerContent: this.editForm.prayerContent,
          prayerDate: this.editForm.prayerDate,
          prayerId: this.editForm.prayerId
        })
        if (result.status !== 200) {
          return this.$message.error('failed to update prayer')
        }
        if (result.data.success === false) {
          return this.$message.error(result.data.errorMessage)
        }
        this.editDialogVisible = false
        this.$message.success('edit prayer successfully')
        // Update list
        // for (var i = 0; i < this.enabledPrayerList.length; i++) {
        //   if (this.enabledPrayerList[i].prayerId === result.data.result.prayerId) {
        //     this.enabledPrayerList[i] = result.data.result
        //     break
        //   }
        // }
        this.getPrayerList(1)
      })
    },
    editDialogClose () {
      this.$refs.editFormRef.resetFields()
    },
    showDeleteDialog (prayerData, index) {
      this.$confirm('[' + prayerData.prayerContent + '] will be deleted, Continue?', 'Tips', {
        confirmButtonText: 'Continue',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async what => {
        const result = await this.$http.post('/disenablePrayer', {
          prayerId: prayerData.prayerId,
          prayerContent: prayerData.prayerContent,
          prayerDate: prayerData.prayerDate,
          enabled: 0,
          createTime: prayerData.createTime,
          updateTime: prayerData.updateTime
        })
        if (result.status !== 200) {
          return this.$message.error('failed to pop prayer of week list')
        } else if (!result.data.success) {
          return this.$message.error(result.data.errorMessage)
        } else {
          this.$message.success('prayer popped')
          this.enabledPrayerList.splice(index, 1)
          this.notEnabledPrayerList.unshift(result.data.result)
          this.getPrayerList(0)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'pop prayer cancelled'
        })
      })
    },
    enabledPrayerSelected (selection, row) {
      console.log(selection)
      console.log(row)
    },
    exportPrayerToWord () {},
    showTransferDialog () {
      this.transferList = []
      this.transferNotEnabledList = []
      this.transferDialogVisible = true
      // 在打开dialog的时候就要构造数据
      for (var i = 0; i < this.enabledPrayerList.length; i++) {
        this.transferList.push({
          key: this.enabledPrayerList[i].prayerId,
          label: this.enabledPrayerList[i].prayerContent
        })
      }
      for (i = 0; i < this.notEnabledPrayerList.length; i++) {
        this.transferList.push({
          key: this.notEnabledPrayerList[i].prayerId,
          label: this.notEnabledPrayerList[i].prayerContent
        })
        this.transferNotEnabledList.push(this.notEnabledPrayerList[i].prayerId)
      }
    },
    transferPrayer () {
      console.log(this.transferNotEnabledList)
    },
    searchPrayers () {}
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
.display-title {
  font-size: 35px;
  font-weight: bold;
  margin-bottom: 15px;
}
.prayers {
  margin-top: 30px;
  margin-bottom: 30px;
}
</style>
