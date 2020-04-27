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
    <div class="unread-note-box">
      <div class="unread-icon">
        <img src="../assets/real_unread.svg" alt="">
        <div class="status-tip">Unread</div>
      </div>
      <div v-for="note in unreadNoteList" :key="note.noteId" class="unread-note-item">
        <div class="note-content"> {{ note.content }}</div>
        <div class="note-not-content">
          <div class="note-others">{{ note.createTime }} | By {{ note.username }}</div>
          <span class="to-mark-read">Mark Read</span>
        </div>
      </div>
    </div>
    <div class="note-box">
      <div class="history-note">
        <div class="add-note-icon icon-center">
          <img src="../assets/read.svg" alt="">
        </div>
        <div class="status-tip">By Me</div>
        <div>
          <div class="note-item" v-for="note in mePublishedNoteList" :key="note.noteId">
            <div class="note-content"> {{ note.content }}</div>
            <div class="note-not-content">
              <div class="note-others">{{ note.createTime }} </div>
              <span class="to-delete">Delete</span>
            </div>
          </div>
        </div>
      </div>
      <div class="byme-note">
        <div class="add-note-icon icon-center">
          <img src="../assets/unread.svg" alt="">
        </div>
        <div class="status-tip">History</div>
        <div class="byme-list">
          <div class="note-item" v-for="note in historyNoteList" :key="note.noteId">
            <div class="note-content"> {{ note.content }}</div>
            <div class="note-not-content">
              <div class="note-others">{{ note.createTime }} | By {{ note.username }}</div>
            </div>
          </div>
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
      this.getNotePublishedByUser()
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
.unread-note-box {
  border: 4px solid #992a8e;
  font-family: 'Roboto';
}
.unread-note-item {
  padding: 0 10px 10px 10px;
  border-bottom: 1px solid #888888;
}
.unread-icon {
  height: 100px;
  width: 100%;
  > img {
    height: 100%;
    width: 100%;
  }
  background: url(../assets/real_unread.svg) repeat-x;
}
.inline-div {
  display: inline-block;
  text-align: center;
}
.text-center {
  padding: auto 0px;
}
.note-box {
  width: 100%;
  font-family: 'Roboto';
  display: flex;
  justify-content: space-between;
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
.byme-note {
  display: inline-block;
  border: 3px solid salmon;
  width: 50%;
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
.note-item {
  border-bottom: 1px solid #888888;
  padding: 0 10px 10px 10px;
  margin-top: 30px;
}
.note-content {
  margin: 10px 0px;
  font-size: 18px;
}
.note-others {
  color: #888888;
}
.note-not-content {
  display: flex;
  justify-content: space-between;
}
.to-delete {
  color: #fe346e;
  cursor: pointer;
  font-weight: bolder;
}
.to-mark-read {
  color: #4f81c7;
  cursor: pointer;
  font-weight: bolder;
}
</style>
