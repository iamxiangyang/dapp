<template>
<div class="cover">
  <div class="container">
    <div class="preBox">
      <div class="head"><h3>Preview</h3></div>
      <div class="preContent">
        <h3>{{title}}</h3>
        <div class="ql-editor ql-snow htmlCont"><div v-html='htmlText'></div></div>
      </div>
    </div>
    <img src="../../assets/img/close2.png" class="close" @click='close'>
  </div>
</div>
</template>
<script type="text/javascript">
import 'quill/dist/quill.snow.css'
export default {
  data () {
    return {
    }
  },
  props: {
    htmlText: {
      type: String
    },
    title: {
      type: String
    }
  },
  methods: {
    close () {
      this.$emit('close')
    }
  }
}
</script>
<style type="text/css" scoped>
.cover {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.75);
  z-index: 400;
}
.container {
  margin: 160px auto 0;
  height: 695px;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
}
.preBox {
  width: 675px;
  background: #F5F7F6;
  border-radius: 10px;
}
.head {
  width: 100%;
  height: 50px;
  padding-left: 15px;
  background: #fff;
  line-height: 50px;
}
.preBox h3 {
  color: #333333;
  font-size: 16px;
  line-height: inherit;
  font-weight: bold;
  text-align: left;
}
.preContent {
  width: 100%;
  height: 635px;
  background: #fff;
  margin-top: 10px;
  padding: 15px;
}
.htmlCont {
  margin-top: 10px;
  padding: 0;
}
.close {
  width: 24px;
  height: 24px;
  margin-left: 10px;
  top: 5px;
}
</style>
