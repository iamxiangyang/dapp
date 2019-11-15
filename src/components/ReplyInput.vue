<template>
  <div class='othersReply'>
    <div class="othersReplyContent">
      <img class="replyAvatar" :src="avatar">
      <input type="text" :placeholder = "placeholder" :value='currentValue' @input="handleInput"  @change="handleChange">
    </div>
    <div class="btns">
      <button class="send" @click="send" :class='{activeBtn:active}'>{{$t('lang.send')}}</button>
      <button class="cancel" @click="cancel">{{$t('lang.cancel')}}</button>
    </div>
  </div>
</template>
<script type="text/javascript">
export default {
  data () {
    return {
      currentValue: this.value,
      active: false
    }
  },
  props: {
    placeholder: {
      default: '',
      type: String
    },
    value: {
      default: '',
      type: String
    },
    avatar: {
      default: '',
      type: String
    }
  },
  watch: {
    value (val) {
      this.setCurrentValue(val)
    }
  },
  methods: {
    send () {
      if (this.active) {
        this.$emit('send')
      }
    },
    cancel () {
      this.$emit('cancel')
    },
    setCurrentValue (value) {
      if (value === this.currentValue) return
      if (value.length > 0) {
        this.active = true
      } else {
        this.active = false
      }
      this.currentValue = value
    },
    handleInput (event) {
      let value = event.target.value
      this.$emit('input', value)
      this.setCurrentValue(value)
      this.$emit('on-change', event)
    },
    handleChange (event) {
      let value = event.target.value
      this.setCurrentValue(value)
      this.$emit('on-input-change', event)
    }
  }
}
</script>
<style type="text/css" scoped>
.othersReply {
  width: inherit;
  height: auto;
  margin: 10px auto 0;
  background: #F9F9F9;
  overflow: hidden;
}
.othersReplyContent {
  height: 35px;
  display: flex;
  justify-content: space-between;
}
.replyAvatar {
  width: 30px;
  height: 30px;
  border-radius: 30px;
  background: #ccc;
}
.othersReplyContent input {
  width: 532px;
  height: 32px;
  outline: none;
  padding-left: 10px;
  padding-right: 10px;
  border: 1px solid #EBEBEB;
}
.btns button {
  float: right;
  font-size: 14px;
  border-radius: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
}
.cancel {
  min-width: 73px;
  padding: 0 10px;
  height: 36px;
  color: #333333;
  border: 1px solid #EBEBEB;
  margin-right: 10px;
  background: rgba(245, 247, 246, 0.5);
}
.send {
  min-width: 73px;
  padding: 0 10px;
  height: 36px;
  color: #fff;
  background: rgba(109, 100, 251, 0.5);
}
.activeBtn {
  background: rgba(109, 100, 251, 1);
}
</style>
