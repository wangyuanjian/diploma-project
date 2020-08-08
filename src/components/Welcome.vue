<template>
  <div>
    <div class="carousel-box">
      <!-- 注意看下面的类，加入有跑马灯有四个页面，1/2/3能看见，4看不见
      其中2在正中间，1和3在旁边。那么这些页面有不同的类
      页面2 : is-active |
      页面1/2/3 : is-in-stage
      页面1/4 : is-animating
      所以要给1/3设置一样的样式，给2设置一样的样式，需要注意这些类样式的书写先后顺序 -->
      <el-carousel height="320px" arrow="always" type="card">
        <el-carousel-item>
          <img src="../assets/prayer.jpg" alt="" class="carouse-img">
        </el-carousel-item>
        <el-carousel-item v-for="item in carouselList" :key="item.id">
          <div class="carousel-item-box">
            <div class="carousel-center">
              {{ item.content }}
            </div>
            <div class="carousel-title">
              {{ item.title }}
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="quick-box">
      <el-card shadow="always" class="quick-div">
        <div slot="header" class="clearfix">
          <span>Recent Meetings</span>
          <div style="float: right;">
            <i class="el-icon-more-outline"></i>
          </div>
        </div>
        <div>
          <div>
            <span class="meeting-value">Meeting Times</span>
            <div style="float: right;">{{ this.meetingListStatistics.meetingNumber }}</div>
          </div>
          <div>
            <span class="meeting-value">Total Number</span>
            <div style="float: right;">{{ this.meetingListStatistics.totalNumber }}</div>
          </div>
          <div>
            <span class="meeting-value">Average Number</span>
            <div style="float: right;">{{ this.meetingListStatistics.avgNumber }}</div>
          </div>
          <div>
            <span class="meeting-value">Total Time (min)</span>
            <div style="float: right;">{{ this.meetingListStatistics.totalTime }}</div>
          </div>
          <div>
            <span class="meeting-value">Average Time (min)</span>
            <div style="float: right;">{{ this.meetingListStatistics.avgTime }}</div>
          </div>
        </div>
      </el-card>
      <el-card shadow="always" class="quick-div">
        <div slot="header" class="clearfix">
          <span>AA Meeting Attendance</span>
          <div style="float: right;">
            <i class="el-icon-more-outline"></i>
          </div>
        </div>
        <div>
          <div class="max-meeting-user">
            <span class="user-title">Max </span>
            <span>✌</span>
            <div v-for="item in maxUsers" :key="item.value">
              <span class="user-name">{{ item.value }}</span>
              <span style="float: right;">{{ item.number }}</span>
            </div>
            <br>
            <span class="user-title">Min </span>
            <span>💪</span>
            <div v-for="item in minUsers" :key="item.value">
              <span class="user-name">{{ item.value }}</span>
              <span style="float: right;">{{ item.number }}</span>
            </div>
          </div>
        </div>
      </el-card>
      <el-card shadow="always" class="quick-div">
        <div slot="header" class="clearfix">
          <span>Unread Notes</span>
          <div style="float: right;">
            <i class="el-icon-more-outline"></i>
          </div>
        </div>
        <div>
          <div v-for="(note, index) in unreadNoteList" :key="note.noteId" class="meeting-value">
            <span>{{ index+1 }}. {{ note.content | sub-goods-name(20) }}</span>
            <span style="float: right;">{{ note.username }}</span>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      unreadNoteList: [],
      carouselList: [{
        id: '0001',
        title: 'First Step Prayer',
        content: `Dear Lord,\n
        I admit that I am powerless over my addiction.
        I admit that my life is unmanageable when I try to control it.
        Help me this day to understand
        The true meaning of powerlessness.
        Remove from me all denial of my addiction.`
      }, {
        id: '0002',
        title: 'Second Step Prayer',
        content: `Heavenly Father,
        I know in my heart that only you can restore me to sanity.
        I humbly ask that you remove all twisted thought &
        Addictive behavior from me this day.
        Heal my spirit & restore in me a clear mind.`
      }, {
        id: '0003',
        title: 'Third Step Prayer',
        content: `God,
        I offer myself to Thee
        To build with me & to do with me as Thou wilt.
        Relieve me of the bondage of self, that I may better do Thy will.
        Take away my difficulties,
        That victory over them may bear witness
        To those I would help of Thy Power,
        Thy love & Thy way of life,
        May I do Thy will always!`
      }, {
        id: '0004',
        title: 'Fourth Step Prayer',
        content: `Dear God,
        It is I who has made my life a mess.
        I have done it, but I cannot undo it.
        My mistakes are mine &
        I will begin a searching & fearless moral inventory.
        I will write down my wrongs
        But I will also include that which is good.
        I pray for the strength to complete the task.`
      }, {
        id: '0005',
        title: 'Fifth Step Prayer',
        content: `Higher Power,
        My inventory has shown me who I am,
        Yet I ask for Your help
        In admitting my wrongs to another person & to You.
        Assure me, & be with me, in this Step,
        For without this Step I cannot progress in my recovery.
        With Your help, I can do this, & I do it.`
      }, {
        id: '0006',
        title: 'Sixth Step Prayer',
        content: `Dear God,
        I am ready for Your help
        In removing from me the defects of character
        Which I now realize are an obstacle to my recovery.
        Help me to continue being honest with myself &
        Guide me toward spiritual & mental health.`
      }, {
        id: '0007',
        title: 'Seventh Step Prayer',
        content: `My Creator,
        I am now willing that you should have all of me, good & bad.
        I pray that you now remove from me every single defect of character
        Which stands in the way of my usefulness to you & my fellows.
        Grant me strength, as I go out from here to do your bidding.`
      }, {
        id: '0008',
        title: 'Eighth Step Prayer',
        content: `Higher Power,
        I ask Your help in making my list of all those I have harmed.
        I will take responsibility for my mistakes &
        Be forgiving to others as You are forgiving to me.
        Grant me the willingness to begin my restitution.
        This I pray.`
      }, {
        id: '0009',
        title: 'Ninth Step Prayer',
        content: `Higher Power,
        I pray for the right attitude to make my amends,
        Being ever mindful not to harm others in the process.
        I ask for Your guidance in making indirect amends.
        Most important, I will continue to make amends
        By staying abstinent, helping others &
        Growing in spiritual progress.`
      }, {
        id: '00010',
        title: 'Tenth Step Prayer',
        content: `I pray I may continue:
        To grow in understanding & effectiveness;
        To take daily spot check inventories of myself;
        To correct mistakes when I make them;
        To take responsibility for my actions;
        To be ever aware of my negative &
        Self-defeating attitudes & behaviors;
        To keep my willfulness in check;
        To always remember I need Your help;
        To keep love & tolerance of others as my code; &
        To continue in daily prayer how I can best serve You,
        My Higher Power.`
      }, {
        id: '0011',
        title: 'Eleventh Step Prayer',
        content: `Higher Power, as I understand You,
        I pray to keep my connection with You
        Open & clear from the confusion of daily life.
        Through my prayers & meditation I ask especially for
        Freedom from self-will, rationalization, & wishful thinking.
        I pray for the guidance of correct thought & positive action.
        Your will Higher Power, not mine, be done.`
      }, {
        id: '0012',
        title: 'Twelfth Step Prayer',
        content: `Dear God,
        My spiritual awakening continues to unfold.
        The help I have received I shall pass on & give to others,
        Both in & out of the Fellowship.
        For this opportunity I am grateful.
        I pray most humbly to continue walking day by day
        On the road of spiritual progress.
        I pray for the inner strength & wisdom
        To practice the principles of this way of life in all I do & say.
        I need You, my friends, & the program every hour of every day.
        This is a better way to live.`
      }],
      meetingListStatistics: [],
      meetingUsers: [],
      maxUsers: [],
      minUsers: [],
      meetings: [],
      userId: 0
    }
  },
  created () {
    this.queryMeetingListBefore(30)
    this.userId = window.sessionStorage.getItem('userId')
    this.getUnreadNote()
  },
  methods: {
    async queryMeetingListBefore (nDays) {
      if (!this.meetingListStatistics) {
        const result = await this.$http.get('/getMeetingDateBefore?nDays=' + nDays)
        if (result.status !== 200) {
          return this.$message.error('failed to load recent Days')
        }
        if (result.data.success === false) {
          return this.$message.error(result.data.errorMessage)
        }
        this.meetingListStatistics = result.data.result
        this.meetingUsers = result.data.result.users
        // 注意这里的比较有返回值，即sort值有返回值 any[]
        if (this.meetingUsers.length > 0) {
          this.meetingUsers = this.meetingUsers.sort(this.compareNumber)
          this.meetings = result.data.result.meetings
          for (var i = 0; i < this.meetingUsers.length; i++) {
            if (this.meetingUsers[i].value === 'system') {
              this.meetingUsers.splice(i, 1)
              break
            }
          }
          this.assignMaxMinUsers()
        }
      }
    },
    compareNumber (pair1, pair2) {
      return pair1.number - pair2.number
    },
    assignMaxMinUsers () {
      for (var i = 0; i < 2; i++) {
        this.minUsers.push(this.meetingUsers[i])
      }
      for (i = this.meetingUsers.length - 1; i >= this.meetingUsers.length - 2; i--) {
        this.maxUsers.push(this.meetingUsers[i])
      }
    },
    async getUnreadNote () {
      const result = await this.$http.post('/getUnreadNoteForUser?pageNum=' +
      1 + '&pageSize=' + 100, {
        userId: this.userId
      })
      if (result.status !== 200) {
        return this.$message.error('failed to load unread note')
      }
      if (result.data.success === false) {
        return this.$message.error(result.data.errorMessage)
      }
      this.unreadNoteList = result.data.result.list
    }
  }
}
</script>

<style lang="less" scoped>
.carousel-box {
  margin: 0 auto;
  width: 90%;
}
/deep/ .el-carousel__item{
  font-size: 14px;
  line-height: 150px;
  margin: 0;
  background-color: #f3d4d4;
  border-radius: 30px;
}
.is-animating {
  background-color: #f3d4d4;
}
.is-in-stage {
  background-color: #f3d4d4;
}
.is-active {
  background-color: #e58a8a;
  // box-shadow: 10px 10px 5px #888888;
}
.carousel-center {
  display: block;
  line-height: 1.5em;
  font-size: 17px;
  padding: 30px 20px 0 20px;
  font-family: "Roboto";
}
.carouse-img {
  width: 100%;
  height: 100%;
}
.carousel-item-box {
  position: relative;
}
.carousel-title {
  height: 30px;
  position: absolute;
  bottom: 0;
  right: 10px;
  font-size: 20px;
  font-weight: bold;
}
.quick-box {
  display: flex;
  justify-content: space-around;
  margin-top: 50px;
}
.quick-div {
  display: inline-block;
  width: 300px;
  border-radius: 10px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
.el-icon-more-outline {
  font-size: 16px;
}
.user-title {
  font-weight: bold;
  font-size: 20px;
  font-family: 'Fira Code';
}
.user-name {
  margin-left: 20px;
  font-family: 'Roboto';
}
.meeting-value {
  font-family: 'Roboto';
  line-height: 2em;
}
/deep/ .el-card__header {
  padding: 10px 20px;
  background-color: #a4d7e1;
}
/deep/ .el-card__body {
  padding: 10px 20px;
  background-color: #fcf8e8;
  height: 100%;
}
</style>
