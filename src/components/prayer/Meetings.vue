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
          <el-input placeholder="Input name for query" v-model="queryInfo.info" clearable style="width: 30%"></el-input>
          <el-date-picker v-model="dateRange" type="daterange" range-separator="to"
          start-placeholder="Start Date" end-placeholder="End Date"
          format="yyyy - MM - dd" value-format="yyyy-MM-dd"
          style="margin-left: 15px;">
          </el-date-picker>
          <el-button type="primary" @click="searchMeetings" plain
          icon="el-icon-search" style="margin-left: 15px;">search</el-button>
        </div>
        <div class="inline-div">
          <el-button type="success" @click="showAddDialog" plain
          icon="el-icon-circle-plus-outline" class="add-btn">Add Meeting</el-button>
        </div>
      </div>
      <transition mode="out-in" name="fade">
        <div v-if="searchVisible" key="search">
          <i class="el-icon-back" @click="backTo"></i>
          <el-table border stripe :data="meetingListWithCondition" empty-text="no data">
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
                  <el-form-item label="Users">
                    <span v-for="item in scope.row.users" :key="item.userId" class="button-border">{{ item.username }}</span>
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
            <el-table-column label="Type" prop="type" align="center" width="130"></el-table-column>
            <el-table-column label="Operaion" align="center" width="120">
              <template slot-scope="scope" align="center">
                <el-tooltip effect="dark" content="edit meeting" placement="top">
                  <el-button type="primary" size="small" plain @click="showEditDialog(scope.row)" icon="el-icon-edit"></el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="delete meeting" placement="top">
                  <el-button type="danger" size="small" plain @click="showDeleteDialog(scope.row, scope.$index, 0)" icon="el-icon-delete"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-else key="normal">
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
                    <el-form-item label="Users">
                      <span v-for="item in scope.row.users" :key="item.userId" class="button-border">{{ item.username }}</span>
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
              <el-table-column label="Type" prop="type" align="center" width="130"></el-table-column>
              <el-table-column label="Operaion" align="center" width="120">
                <template slot-scope="scope" align="center">
                  <el-tooltip effect="dark" content="edit meeting" placement="top">
                    <el-button type="primary" size="small" plain @click="showEditDialog(scope.row)" icon="el-icon-edit"></el-button>
                  </el-tooltip>
                  <el-tooltip effect="dark" content="delete meeting" placement="top">
                    <el-button type="danger" size="small" plain @click="showDeleteDialog(scope.row, scope.$index, 0)" icon="el-icon-delete"></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pageNum"
              :page-sizes="[3, 5, 10]"
              :page-size="queryInfo.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </div>
          <div class="type-box">
            <el-collapse v-model="collapseActiveName" accordion>
              <el-collapse-item title="Meeting Types" name="types">
                <div class="table-button-box">
                  <div class="inline-div">
                    <el-table border stripe :data="meetingTypes" empty-text="no data" class="type-table">
                      <el-table-column label="Index" type="index" width="70" align="center"></el-table-column>
                      <el-table-column label="Type" prop="type" align="center"></el-table-column>
                      <el-table-column label="Operaion" align="center" width="120">
                        <template slot-scope="scope" align="center">
                          <el-tooltip effect="dark" content="delete meeting type" placement="top">
                            <el-button type="danger" size="small" plain @click="showDeleteTypeDialog(scope.row)" icon="el-icon-delete"></el-button>
                          </el-tooltip>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                  <div class="inline-div">
                    <el-button type="success" @click="showAddMeetingTypeDialog" plain
                    icon="el-icon-circle-plus-outline" class="add-btn">Add Type</el-button>
                  </div>
                </div>
              </el-collapse-item>
              <el-collapse-item title="Meeting Locations" name="locations">
                <div class="table-button-box">
                  <div class="inline-div">
                    <el-table border stripe :data="meetingLocations" empty-text="no data" class="type-table">
                      <el-table-column label="Index" type="index" width="70" align="center"></el-table-column>
                      <el-table-column label="Location" prop="location" align="center"></el-table-column>
                      <el-table-column label="Operaion" align="center" width="120">
                        <template slot-scope="scope" align="center">
                          <el-tooltip effect="dark" content="delete meeting location" placement="top">
                            <el-button type="danger" size="small" plain @click="showDeleteLocationDialog(scope.row, scope.$index, 0)" icon="el-icon-delete"></el-button>
                          </el-tooltip>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                  <div class="inline-div">
                    <el-button type="success" @click="showAddMeetingLocationDialog" plain
                    icon="el-icon-circle-plus-outline" class="add-btn">Add Location</el-button>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
          <div class="data-box">
            <p>
              <span class="display-title">Data Statistics</span>
            </p>
            <el-tabs @tab-click="handleTabClick">
              <el-tab-pane label="Last Week" name="first">
                <div>
                  <div id="form-data" class="block-display">
                    <p>
                      <span class="form-title">Meeting Number: </span>
                      <span class="form-content">{{meetingList7Days.meetingNumber}}</span>
                    </p>
                    <p>
                      <span class="form-title">Total AA Number: </span>
                      <span class="form-content">{{meetingList7Days.totalNumber}}</span>
                    </p>
                    <p>
                      <span class="form-title">Average Number: </span>
                      <span class="form-content">{{meetingList7Days.avgNumber}}</span>
                    </p>
                    <p>
                      <span class="form-title">Total Time: </span>
                      <span class="form-content">{{meetingList7Days.totalTime}}(min)</span>
                    </p>
                    <p>
                      <span class="form-title">Average Time: </span>
                      <span class="form-content">{{meetingList7Days.avgTime}}(min)</span>
                    </p>
                  </div>
                  <div id="last-week-users" class="echarts-div"></div>
                  <div id="last-week-locations" class="echarts-div"></div>
                  <div id="last-week-types" class="echarts-div"></div>
                  <div id="last-week-meetings" class="echarts-div"></div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="Last Month" name="second">
                <div>
                  <div id="form-data" class="block-display">
                    <p>
                      <span class="form-title">Meeting Number: </span>
                      <span class="form-content">{{meetingList1Month.meetingNumber}}</span>
                    </p>
                    <p>
                      <span class="form-title">Total AA Number: </span>
                      <span class="form-content">{{meetingList1Month.totalNumber}}</span>
                    </p>
                    <p>
                      <span class="form-title">Average Number: </span>
                      <span class="form-content">{{meetingList1Month.avgNumber}}</span>
                    </p>
                    <p>
                      <span class="form-title">Total Time: </span>
                      <span class="form-content">{{meetingList1Month.totalTime}}(min)</span>
                    </p>
                    <p>
                      <span class="form-title">Average Time: </span>
                      <span class="form-content">{{meetingList1Month.avgTime}}(min)</span>
                    </p>
                  </div>
                  <div id="last-month-users" class="echarts-div"></div>
                  <div id="last-month-locations" class="echarts-div"></div>
                  <div id="last-month-types" class="echarts-div"></div>
                  <div id="last-month-meetings" class="echarts-div"></div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="Last Quarter" name="third">
                <div>
                  <div id="form-data" class="block-display">
                    <p>
                      <span class="form-title">Meeting Number: </span>
                      <span class="form-content">{{meetingList1Quarter.meetingNumber}}</span>
                    </p>
                    <p>
                      <span class="form-title">Total AA Number: </span>
                      <span class="form-content">{{meetingList1Quarter.totalNumber}}</span>
                    </p>
                    <p>
                      <span class="form-title">Average Number: </span>
                      <span class="form-content">{{meetingList1Quarter.avgNumber}}</span>
                    </p>
                    <p>
                      <span class="form-title">Total Time: </span>
                      <span class="form-content">{{meetingList1Quarter.totalTime}}(min)</span>
                    </p>
                    <p>
                      <span class="form-title">Average Time: </span>
                      <span class="form-content">{{meetingList1Quarter.avgTime}}(min)</span>
                    </p>
                  </div>
                  <div id="last-quarter-users" class="echarts-div"></div>
                  <div id="last-quarter-locations" class="echarts-div"></div>
                  <div id="last-quarter-types" class="echarts-div"></div>
                  <div id="last-quarter-meetings" class="echarts-div"></div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="Customed Time Span" name="fourth">
                <div>
                <div class="search-for-analysis-bar">
                    <el-date-picker v-model="dateRangeForAnalysis" type="daterange" range-separator="to"
                    start-placeholder="Start Date" end-placeholder="End Date"
                    format="yyyy - MM - dd" value-format="yyyy-MM-dd"
                    style="margin-left: 15px;"></el-date-picker>
                    <el-button type="primary" @click="getMeetingListInDateSpan" plain
                    icon="el-icon-search" style="margin-left: 15px;">search</el-button>
                  </div>
                  <div id="form-data" class="block-display">
                    <p>
                      <span class="form-title">Meeting Number: </span>
                      <span class="form-content">{{meetingListInDateSpan.meetingNumber}}</span>
                    </p>
                    <p>
                      <span class="form-title">Total AA Number: </span>
                      <span class="form-content">{{meetingListInDateSpan.totalNumber}}</span>
                    </p>
                    <p>
                      <span class="form-title">Average Number: </span>
                      <span class="form-content">{{meetingListInDateSpan.avgNumber}}</span>
                    </p>
                    <p>
                      <span class="form-title">Total Time: </span>
                      <span class="form-content">{{meetingListInDateSpan.totalTime}}(min)</span>
                    </p>
                    <p>
                      <span class="form-title">Average Time: </span>
                      <span class="form-content">{{meetingListInDateSpan.avgTime}}(min)</span>
                    </p>
                  </div>
                  <div id="customed-users" class="echarts-div"></div>
                  <div id="customed-locations" class="echarts-div"></div>
                  <div id="customed-types" class="echarts-div"></div>
                  <div id="cusotmed-meetings" class="echarts-div"></div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </transition>
    </el-card>
    <!-- Add Meeting -->
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
          <el-select v-model="addForm.location" size="medium"
            :multiple="false" placeholder="select location" class="select-option">
            <el-option
              v-for="item in meetingLocations"
              :key="item.location"
              :label="item.location"
              :value="item.location">
            </el-option>
          </el-select>
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
              :key="item.type"
              :label="item.type"
              :value="item.type">
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
    <!-- Edit Prayer -->
    <el-dialog
      title="Edit Meeing"
      :visible.sync="editDialogVisible"
      width="40%" @close="editDialogClose">

      <el-form :model="editForm" :rules="editFormRules"
      ref="editFormRef" label-width="110px" size="medium">
        <el-form-item label="Theme" prop="theme">
          <el-input v-model="editForm.theme"></el-input>
        </el-form-item>
        <el-form-item label="Location" prop="location">
          <el-select v-model="editForm.location" size="medium"
            :multiple="false" placeholder="select location" class="select-option">
            <el-option
              v-for="item in meetingLocations"
              :key="item.location"
              :label="item.location"
              :value="item.location">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Participants" prop="people">
          <el-select v-model="editForm.people" size="medium"
            :multiple="true" placeholder="select participants" class="select-option"
            @change="selectedUserChangedforEdit">
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
          <el-input v-model="editForm.total" type="number" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Types" prop="type">
          <el-select v-model="editForm.type" size="medium"
            :multiple="false" placeholder="select meeting types" class="select-option">
            <el-option
              v-for="item in meetingTypes"
              :key="item.type"
              :label="item.type"
              :value="item.type">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Begin Time" prop="beginTime">
          <el-date-picker v-model="editForm.beginTime" type="datetime" placeholder="select begin time"
          class="add-date-picker" value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="End Time" prop="endTime">
          <el-date-picker v-model="editForm.endTime" type="datetime" placeholder="select end time"
          class="add-date-picker" value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="Remark">
          <el-input v-model="editForm.remark"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false" size="medium">Cancel</el-button>
        <el-button type="primary" @click="editMeeting" size="medium">Edit</el-button>
      </span>
    </el-dialog>
    <!-- Add Meeting Type -->
    <el-dialog
      title="Add Meeing"
      :visible.sync="addTypeDialogVisible"
      width="40%" @close="addTypeDialogClose">

      <el-form :model="addTypeForm" :rules="addTypeFormRules"
      ref="addTypeFormRef" label-width="70px" size="medium">
        <el-form-item label="Type" prop="type">
          <el-input v-model="addTypeForm.type"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addTypeDialogVisible = false" size="medium">Cancel</el-button>
        <el-button type="primary" @click="addMeetingType" size="medium">Add</el-button>
      </span>
    </el-dialog>
    <!-- Add Meeting Location -->
    <el-dialog
      title="Add Meeing Location"
      :visible.sync="addLocationDialogVisible"
      width="40%" @close="addLocationDialogClose">

      <el-form :model="addLocationForm" :rules="addLocationFormRules"
      ref="addLocationFormRef" label-width="70px" size="medium">
        <el-form-item label="Location" prop="location">
          <el-input v-model="addLocationForm.location"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addLocationDialogVisible = false" size="medium">Cancel</el-button>
        <el-button type="primary" @click="addMeetingLocation" size="medium">Add</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  data () {
    return {
      meetingList: [],
      meetingListWithCondition: [],
      meetingList7Days: '',
      meetingList1Month: '',
      meetingList1Quarter: '',
      // 下面的数组数据是自定义时间范围的
      meetingListInDateSpan: '',
      userList: [],
      meetingTypes: [],
      meetingLocations: [],
      queryInfo: {
        info: '',
        pageNum: 1,
        pageSize: 3
      },
      total: 0,
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
      },
      editDialogVisible: false,
      editForm: {
        meetingId: 0,
        theme: '',
        total: 0,
        people: [],
        type: '',
        location: '',
        beginTime: '',
        endTime: '',
        remark: ''
      },
      editFormRules: {
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
      },
      collapseActiveName: '',
      addTypeDialogVisible: false,
      addTypeForm: {
        type: ''
      },
      addTypeFormRules: {
        type: [
          { required: true, message: 'type is necessary', trigger: 'blur' }
        ]
      },
      addLocationDialogVisible: false,
      addLocationForm: {
        location: ''
      },
      addLocationFormRules: {
        location: [
          { required: true, message: 'location is necessary', trigger: 'blur' }
        ]
      },
      // 这是自定义时间段数据分析的开始和结束时间
      dateRangeForAnalysis: [],
      searchVisible: false,
      // 这个是上面搜索的开始和结束时间
      dateRange: []
    }
  },
  created () {
    this.getMeetingList()
    this.getUserList()
    this.getMeetingTypeList()
    this.getMeetingLocationList()
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
    async getMeetingTypeList () {
      if (!this.meetingTypes || this.meetingTypes.length === 0) {
        const result = await this.$http.get('/getMeetingTypeList')
        if (result.status !== 200) {
          return this.$message.error('failed to load meeting types')
        }
        if (result.data.success === false) {
          return this.$message.error(result.data.errorMessage)
        }
        this.meetingTypes = result.data.result
      }
    },
    async getMeetingLocationList () {
      if (!this.meetingLocations || this.meetingLocations.length === 0) {
        const result = await this.$http.get('/getMeetingLocationList')
        if (result.status !== 200) {
          return this.$message.error('failed to load meeting locations')
        }
        if (result.data.success === false) {
          return this.$message.error(result.data.errorMessage)
        }
        this.meetingLocations = result.data.result
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
      this.addForm.remark = ''
      this.$refs.addFormRef.resetFields()
    },
    showAddMeetingTypeDialog () {
      this.addTypeDialogVisible = true
    },
    addMeetingType () {
      this.$refs.addTypeFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('invalid meeting type info')
        }
        const result = await this.$http.post('/addMeetingType', {
          type: this.addTypeForm.type
        })
        if (result.status !== 200) {
          return this.$message.error('failed to add meeting type')
        }
        if (result.data.success === false) {
          return this.$message.error(result.data.errorMessage)
        }
        this.addTypeDialogVisible = false
        this.$message.success('add meeting type successfully')
        this.meetingTypes = result.data.result
      })
    },
    addTypeDialogClose () {
      this.$refs.addTypeFormRef.resetFields()
    },
    showAddMeetingLocationDialog () {
      this.addLocationDialogVisible = true
    },
    addMeetingLocation () {
      this.$refs.addLocationFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('invalid meeting location info')
        }
        const result = await this.$http.post('/addMeetingLocation', {
          location: this.addLocationForm.location
        })
        if (result.status !== 200) {
          return this.$message.error('failed to add meeting location')
        }
        if (result.data.success === false) {
          return this.$message.error(result.data.errorMessage)
        }
        this.addLocationDialogVisible = false
        this.$message.success('add meeting location successfully')
        this.meetingLocations = result.data.result
      })
    },
    addLocationDialogClose () {
      this.$refs.addLocationFormRef.resetFields()
    },
    // 数组
    selectedUserChanged (changedUser) {
      // console.log(changedUser)
      this.addForm.total = changedUser.length
    },
    showEditDialog (meetingData) {
      this.editDialogVisible = true
      this.editForm.meetingId = meetingData.meetingId
      this.editForm.theme = meetingData.theme
      this.editForm.total = meetingData.total
      this.editForm.type = meetingData.type
      this.editForm.location = meetingData.location
      this.editForm.beginTime = meetingData.beginTime
      this.editForm.endTime = meetingData.endTime
      this.editForm.remark = meetingData.remark
      var ids = []
      for (var i = 0; i < meetingData.users.length; i++) {
        ids.push(meetingData.users[i].userId)
      }
      this.editForm.people = ids
    },
    editMeeting () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('invalid meeting info')
        }
        const result = await this.$http.post('/updateMeeting', {
          meetingId: this.editForm.meetingId,
          theme: this.editForm.theme,
          total: this.editForm.total,
          type: this.editForm.type,
          location: this.editForm.location,
          beginTime: this.editForm.beginTime,
          endTime: this.editForm.endTime,
          remark: this.editForm.remark,
          people: this.editForm.people.join(',')
        })
        if (result.status !== 200) {
          return this.$message.error('failed to update meeting info')
        }
        if (result.data.success === false) {
          return this.$message.error(result.data.errorMessage)
        }
        this.editDialogVisible = false
        this.$message.success('edit meeting successfully')
        this.getMeetingList()
      })
    },
    editDialogClose () {
      this.$refs.editFormRef.resetFields()
    },
    showDeleteDialog (meetingData) {
      const deleteMsg = 'meeting about [' + meetingData.theme + '] ' + ' will be deleted, Continue?'
      this.$confirm(deleteMsg, 'Delete Meeting', {
        confirmButtonText: 'Continue',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async what => {
        const result = await this.$http.post('/deleteMeeting', {
          meetingId: meetingData.meetingId
        })
        if (result.status !== 200) {
          return this.$message.error('failed to delete meeting')
        }
        if (result.data.success === false) {
          return this.$message.error(result.data.errorMessage)
        }
        this.$message.success('delete meeting sucessfully')
        this.getMeetingList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'delete meeting cancelled'
        })
      })
    },
    showDeleteTypeDialog (typeData) {
      const deleteMsg = 'meeting type [' + typeData.type + '] ' + ' will be deleted, Continue?'
      this.$confirm(deleteMsg, 'Delete Meeting Type', {
        confirmButtonText: 'Continue',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async what => {
        const result = await this.$http.post('/deleteMeetingType', {
          type: typeData.type
        })
        if (result.status !== 200) {
          return this.$message.error('failed to delete meeting type')
        }
        if (result.data.success === false) {
          return this.$message.error(result.data.errorMessage)
        }
        this.$message.success('delete meeting type sucessfully')
        this.meetingTypes = result.data.result
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'delete meeting type cancelled'
        })
      })
    },
    showDeleteLocationDialog (locationData) {
      const deleteMsg = 'meeting location [' + locationData.location + '] ' + ' will be deleted, Continue?'
      this.$confirm(deleteMsg, 'Delete Meeting Location', {
        confirmButtonText: 'Continue',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async what => {
        const result = await this.$http.post('/deleteMeetingLocation', {
          location: locationData.location
        })
        if (result.status !== 200) {
          return this.$message.error('failed to delete meeting location')
        }
        if (result.data.success === false) {
          return this.$message.error(result.data.errorMessage)
        }
        this.$message.success('delete meeting location sucessfully')
        this.meetingLocations = result.data.result
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'delete meeting location cancelled'
        })
      })
    },
    async searchMeetings () {
      this.searchVisible = true
      const result = await this.$http.post('/getMeetingListWithCondition', {
        info: this.queryInfo.info,
        startTime: this.dateRange[0],
        endTime: this.dateRange[1]
      })
      if (result.status !== 200) {
        return this.$message.error('failed to load meetings')
      }
      if (result.data.success === false) {
        return this.$message.error(result.data.errorMessage)
      }
      this.queryInfo.info = ''
      this.dateRange = []
      this.meetingListWithCondition = result.data.result
    },
    backTo () {
      this.searchVisible = false
    },
    selectedUserChangedforEdit (changedUser) {
      this.editForm.total = changedUser.length
    },
    // tabComponent 是VueComponent实例，可通过index或者name
    // 判断具体点击的Tab
    handleTabClick (tabComponent) {
      if (tabComponent.name === 'first') {
        this.queryMeetingListBefore(7)
      } else if (tabComponent.name === 'second') {
        this.queryMeetingListBefore(30)
      } else if (tabComponent.name === 'third') {
        this.queryMeetingListBefore(90)
      }
    },
    async queryMeetingListBefore (nDays) {
      if (((!this.meetingList7Days || this.meetingList7Days.length === 0) && nDays === 7) ||
      ((!this.meetingList1Month || this.meetingList1Month.length === 0) && nDays === 30) ||
      ((!this.meetingList1Quarter || this.meetingList1Quarter.length === 0) && nDays === 90) ||
      nDays === -1) {
        const result = await this.$http.get('/getMeetingDateBefore?nDays=' + nDays)
        if (result.status !== 200) {
          return this.$message.error('failed to load recent Days')
        }
        if (result.data.success === false) {
          return this.$message.error(result.data.errorMessage)
        }
        if (nDays === 7) {
          this.meetingList7Days = result.data.result
          // console.log(this.meetingList7Days.meetingNumber)
          this.processMeetingUsersOrLocations(this.meetingList7Days.users, 'last-week-users',
            'AA Attendence in Last Week', 'SubText Title', 'AA')
          this.processMeetingTypes(this.meetingList7Days.types, 'last-week-types',
            'AA Meeting Types in Last Week', 'SubText Title', 'Types')
          this.processMeetingUsersOrLocations(this.meetingList7Days.locations, 'last-week-locations',
            'AA Meeting Locations in Last Week', 'SubText Title', 'Locations')
          this.processMeeting(this.meetingList7Days.meetings, 'last-week-meetings',
            'AA Meetings in Last Week')
        } else if (nDays === 30) {
          this.meetingList1Month = result.data.result
          this.processMeetingUsersOrLocations(this.meetingList1Month.users, 'last-month-users',
            'AA Attendence in Last Month', 'SubText Title', 'AA')
          this.processMeetingTypes(this.meetingList1Month.types, 'last-month-types',
            'AA Meeting Types in Last Month', 'SubText Title', 'Types')
          this.processMeetingUsersOrLocations(this.meetingList1Month.locations, 'last-month-locations',
            'AA Meeting Locations in Last Month', 'SubText Title', 'Locations')
          this.processMeeting(this.meetingList1Month.meetings, 'last-month-meetings',
            'AA Meetings in Last Month')
        } else if (nDays === 90) {
          this.meetingList1Quarter = result.data.result
          this.processMeetingUsersOrLocations(this.meetingList1Quarter.users, 'last-quarter-users',
            'AA Attendence in Last Quarter', 'SubText Title', 'AA')
          this.processMeetingTypes(this.meetingList1Quarter.types, 'last-quarter-types',
            'AA Meeting Types in Last Quarter', 'SubText Title', 'Types')
          this.processMeetingUsersOrLocations(this.meetingList1Quarter.locations, 'last-quarter-locations',
            'AA Meeting Locations in Last Quarter', 'SubText Title', 'Locations')
          this.processMeeting(this.meetingList1Quarter.meetings, 'last-quarter-meetings',
            'AA Meetings in Last Quarter')
        }
        this.$message.success('query meeting list successfully')
      }
    },
    processMeetingTypes (list, divName, title, subText, legend) {
      // meeting users name list, system user excluded
      var xs = []
      var ys = []
      for (var i = 0; i < list.length; i++) {
        if (list[i].value !== 'system') {
          xs.push(list[i].value)
          ys.push(list[i].number)
        }
      }
      var myBarChart = echarts.init(document.getElementById(divName))
      var option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'// 默认为直线，可选为：'line' | 'shadow'
          }
        },
        title: {
          text: title,
          subText: subText,
          left: 'center',
          textStyle: {
            fontSize: 20
          }
        },
        legend: {
          data: [legend],
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
        grid: {
          left: '5%',
          bottom: '38%',
          right: '5%'
          // width: 'auto'
        },
        xAxis: {
          data: xs,
          axisLabel: {
            interval: 0,
            rotate: 30
          }
        },
        yAxis: {
          splitNumber: 1
        },
        series: [{
          name: legend,
          data: ys,
          type: 'bar',
          itemStyle: {
            normal: {
              // 这里是重点
              color: function (params) {
                // 注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
                var colorList = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622']
                return colorList[params.dataIndex]
              }
            }
          }
        }]
      }
      myBarChart.setOption(option)
    },
    processMeetingUsersOrLocations (list, divName, title, subText, legend) {
      var xs = []
      var ys = []
      for (var i = 0; i < list.length; i++) {
        if (list[i].value !== 'system') {
          xs.push(list[i].value)
          ys.push(list[i].number)
        }
      }
      var myBarChart = echarts.init(document.getElementById(divName))
      var option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'// 默认为直线，可选为：'line' | 'shadow'
          }
        },
        title: {
          text: title,
          subText: subText,
          left: 'center',
          textStyle: {
            fontSize: 20
          }
        },
        legend: {
          data: [legend],
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
          data: xs,
          axisLabel: {
            interval: 0,
            rotate: 30
          },
          axisTick: {
            length: 1
          }
        },
        yAxis: {
          splitNumber: 1
        },
        series: [{
          name: legend,
          data: ys,
          type: 'bar',
          itemStyle: {
            normal: {
              // 这里是重点
              color: function (params) {
                // 注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
                var colorList = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622']
                return colorList[params.dataIndex]
              }
            }
          }
        }]
      }
      myBarChart.setOption(option)
    },
    processMeeting (list, divName, title) {
      var myBarChart = echarts.init(document.getElementById(divName))
      // 聚会时长
      var time = []
      var timeSpan = []
      var number = []
      for (var i = 0; i < list.length; i++) {
        time.push(list[i].beginTime.substr(0, 10))
        timeSpan.push(list[i].timeSpan)
        number.push(list[i].total)
      }
      var option = {
        title: {
          text: title,
          left: 'center',
          textStyle: {
            fontSize: 20
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'// 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['time span', 'number'],
          right: 10,
          top: 10,
          orient: 'vertical'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: time,
          axisLabel: {
            rotate: 30
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: 'time span',
          type: 'bar',
          data: timeSpan,
          stack: '总量',
          label: {
            show: true,
            position: 'insideRight'
          }
        }, {
          name: 'number',
          type: 'bar',
          data: number,
          stack: '总量',
          label: {
            show: true,
            position: 'insideRight'
          }
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
    async getMeetingListInDateSpan () {
      const result = await this.$http.post('/getMeetingListInDateSpan', {
        startTime: this.dateRangeForAnalysis[0],
        endTime: this.dateRangeForAnalysis[1]
      })
      if (result.status !== 200) {
        return this.$message.error('failed to load order')
      }
      if (result.data.success === false) {
        return this.$message.error(result.data.errorMessage)
      }
      this.meetingListInDateSpan = result.data.result
      this.processMeetingUsersOrLocations(this.meetingListInDateSpan.users, 'customed-users',
        'AA Attendence in Customed Time Range', 'SubText Title', 'AA')
      this.processMeetingTypes(this.meetingListInDateSpan.types, 'customed-types',
        'AA Meeting Types in Customed Time Range', 'SubText Title', 'Types')
      this.processMeetingUsersOrLocations(this.meetingListInDateSpan.locations, 'customed-locations',
        'AA Meeting Locations in Customed Time Range', 'SubText Title', 'Locations')
      this.processMeeting(this.meetingListInDateSpan.meetings, 'cusotmed-meetings',
        'AA Meetings in Customed Time Range')
    }
  }
}
</script>

<style lang="less" scoped>
.inline-div {
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
  font-family: 'Roboto';
}
.el-card {
  border-radius: 15px;
}
.button-border {
  border: solid 1px #dcdfe6;
  border-radius: 4px;
  padding: 5px 5px;
  font-size: 14px;
  line-height: 1;
  margin-right: 5px;
}
.el-select {
  width: 100%;
}
.echarts-div {
  width: 100%;
  height: 500px;
  // border: 3px dashed tomato;
  overflow: scroll;
}
.display-title {
  font-size: 35px;
  font-weight: bold;
}
.data-box {
  margin-top: 70px;
}
.block-display {
  display: inline-block;
}
.form-title {
  color: #99a9bf;
  font-size: 15px;
  font-weight: bold;
}
.temp-border {
  border: 3px dashed tomato;
}
.type-box {
  margin-top: 70px;
}
/deep/ .el-collapse-item__header {
  font-size: 20px;
}
.table-button-box {
  display: flex;
  justify-content: space-around;
}
.type-table {
  width: 500px;
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
