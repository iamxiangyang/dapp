<template>
 <button
 class = 'btn'
 :class = 'classes'
 :disabled="disabled"
 @click="handleClick"
 @hover='handleHover'
 ref='btn'>
  <span v-if="showSlot" ref="slot"><slot></slot></span>
</button>
</template>
<script type="text/javascript">
const prefixCls = 'callme-btn'
const validList = ['small', 'large', 'normal']
const validkinds = ['normal', 'active']
export default {
  data () {
    return {
      showSlot: true,
      icon: ''
    }
  },
  props: {
    disabled: Boolean,
    size: {
      validator (value) {
        for (let i = 0; i < validList.length; i++) {
          if (value === validList[i]) {
            return true
          }
        }
        return false
      }
    },
    kind: {
      validator (value) {
        for (let i = 0; i < validkinds.length; i++) {
          if (value === validkinds[i]) {
            return true
          }
        }
        return false
      }
    }
  },
  computed: {
    classes () {
      return [
        {
          [`${prefixCls}-${this.size}`]: !!this.size
        },
        {
          [`${prefixCls}-${this.kind}`]: !!this.kind
        }
      ]
    }
  },

  methods: {
    handleClick (event) {
      this.$emit('click', event)
    },
    handleHover () {
      if (this.highlight) {
        this.icon = this.highlight
      }
    }
  }
}
</script>
<style type="text/css" scoped>
  .btn {
  min-width: 73px;
  padding-left: 10px;
  padding-right: 10px;
  height: 36px;
  border: 1px solid #EBEBEB;
  background-color: rgba(245, 247, 246, 0.5);
  font-family: Lato-Regular;
  font-size: 14px;
  color: #333333;
  letter-spacing: 0.5px;
  border-radius: 10px;
  }
  .btn:hover {
    color: #6531E9;
    border: 1px solid #6531E9;
  }
  .callme-btn-small {
    width: 73px;
    height: 36px;
  }
  .callme-btn-normal {
    width: 96px;
    height: 36px;
  }
  .callme-btn-large {
    width: 110px;
    height: 36px;
  }
  .leftImg {
    width: 16px;
    height: 16px;
    margin-right: 10px;
  }
  .callme-btn-active {
    background-color: #6D64FB;
    color: #FFFFFF;
    border: none;
  }
  .callme-btn-active:hover {
    background: #5b54d4;
    color: #FFFFFF;
    border: none;
  }
</style>
