<template>
  <div>
    <div class="add-note">
      <div class="add-note-icon">
        <img src="../assets/email.svg" alt="">
      </div>
      <div class="add-note-input">
        <el-input type="textarea" :rows="2"
        placeholder="add n new note......" v-model="addNote">
        </el-input>
        <el-button type="primary" plain class="add-button" size="medium">Add</el-button>
      </div>
    </div>
    <div class="note-box">
      <div class="unread-note">
        <div class="add-note-icon icon-center">
          <img src="../assets/unread.svg" alt="">
        </div>
        <div class="status-tip">unread</div>
      </div>
      <div class="history-note">
        <div class="add-note-icon icon-center">
          <img src="../assets/read.svg" alt="">
        </div>
        <div class="status-tip">History</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      addNote: ''
    }
  },
  created () {},
  methods: {}
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
