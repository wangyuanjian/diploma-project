<template>
  <div>
    <div class="add-note">
      <div class="add-note-icon">
        <img src="../assets/email.svg" alt="">
      </div>
      <div class="add-note-input">
        <div class="add-note-date">{{today}}</div>
        <el-input type="textarea" :rows="3"
        placeholder="add n new note and other administrators will be notified....." v-model="note">
        </el-input>
        <el-button type="primary" plain class="add-button"
        @click="addNote"  size="medium">Add</el-button>
      </div>
    </div>
    <div class="note-box">
      <div class="unread-note">
        <div class="add-note-icon icon-center">
          <img src="../assets/unread.svg" alt="">
        </div>
        <div class="status-tip">Unread</div>
        <div>
          <pre>{{ this.unreadNoteList }}</pre>
        </div>
      </div>
      <div class="history-note">
        <div class="add-note-icon icon-center">
          <img src="../assets/read.svg" alt="">
        </div>
        <div class="status-tip">History</div>
        <div>
          <pre>{{ this.historyNoteList }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      historyNoteList: [],
      unreadNoteList: [],
      mePublishedNoteList: [],
      note: '',
      userId: 0,
      unreadQueryInfo: {
        info: '',
        pageNum: 1,
        pageSize: 5
      },
      unreadTotal: 0,
      historyQueryInfo: {
        info: '',
        pageNum: 1,
        pageSize: 5
      },
      historyTotal: 0,
      mePublishedQueryInfo: {
        info: '',
        pageNum: 1,
        pageSize: 5
      },
      mePublishedTotal: 0
    }
  },
  created () {
    this.userId = window.sessionStorage.getItem('userId')
    this.getHistoryNote()
    this.getUnreadNote()
    this.getNotePublishedByUser()
  },
  computed: {
    today () {
      const date = new Date()
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, 0)
      const day = date.getDate().toString().padStart(2, 0)
      console.log(`${year}-${month}-${day}`)
      return `${year}-${month}-${day}`
    }
  },
  methods: {
    async getHistoryNote () {
      const result = await this.$http.post('/getHistoryNoteForUser?pageNum=' +
      this.historyQueryInfo.pageNum + '&pageSize=' + this.historyQueryInfo.pageSize, {
        userId: this.userId
      })
      if (result.status !== 200) {
        return this.$message.error('failed to load history note')
      }
      if (result.data.success === false) {
        return this.$message.error(result.data.errorMessage)
      }
      // console.log(result)
      this.historyNoteList = result.data.result.list
      this.historyTotal = result.data.result.total
    },
    async getUnreadNote () {
      const result = await this.$http.post('/getUnreadNoteForUser?pageNum=' +
      this.unreadQueryInfo.pageNum + '&pageSize=' + this.unreadQueryInfo.pageSize, {
        userId: this.userId
      })
      if (result.status !== 200) {
        return this.$message.error('failed to load unread note')
      }
      if (result.data.success === false) {
        return this.$message.error(result.data.errorMessage)
      }
      // console.log(result)
      this.unreadNoteList = result.data.result.list
      this.unreadTotal = result.data.result.total
    },
    async getNotePublishedByUser () {
      const result = await this.$http.post('/getNotePublishedByUser?pageNum=' +
      this.mePublishedQueryInfo.pageNum + '&pageSize=' + this.mePublishedQueryInfo.pageSize, {
        userId: this.userId
      })
      if (result.status !== 200) {
        return this.$message.error('failed to load self published note')
      }
      if (result.data.success === false) {
        return this.$message.error(result.data.errorMessage)
      }
      // console.log(result)
      this.mePublishedNoteList = result.data.result.list
      this.mePublishedTotal = result.data.result.total
    },
    async addNote () {
      if (!this.note || this.note.length === 0) {
        return this.$message.error('note not empty')
      }
      const result = await this.$http.post('/addNote?pageSize=10', {
        content: this.note,
        userId: window.sessionStorage.getItem('userId')
      })
      if (result.status !== 200) {
        return this.$message.error('failed to add new note')
      }
      if (result.data.success === false) {
        return this.$message.error(result.data.errorMessage)
      }
      console.log(result.data.result)
    }
  }
}
</script>

<style lang="less" scoped>
.add-note {
  padding: 10px 20px;
}
.add-button {
  float: right;
  margin-top: 10px;
}
/deep/ .el-textarea__inner {
  font-family: 'Roboto';
  font-size: 17px;
  border: 3px solid skyblue;
  border-radius: 10px;
}
.add-note-icon {
  display: inline-block;
  height: 100px;
  width: 100px;
  > img {
    height: 100%;
    width: 100%;
  }
}
.note-box {
  width: 100%;
}
.add-note-input {
  display: inline-block;
  margin-left: 30px;
  width: 85%;
}
.add-note-date {
  float: right;
  font-size: 13px;
  color: #999999;
  margin-bottom: 2px;
}
.unread-note {
  display: inline-block;
  border: 3px solid salmon;
  width: 47%;
  height: 100%;
}
.history-note {
  display: inline-block;
  border: 3px solid blueviolet;
  width: 47%;
}
.icon-center {
  clear: both;
  display: block;
  margin: auto;
}
.status-tip {
  text-align: center;
  font-family: 'Roboto';
  font-size: 20px;
  font-weight: bold;
  margin-top: -30px;
  color: #381460;
}
</style>
