<template>
  <div class="alertBox" v-if = 'show'>
    <div class="containerBox">
     <img :src='toastIcon' class="icon"> <span>{{toast}}</span>
    </div>
  </div>
</template>
<script type="text/javascript">
export default {
  props: {
    toast: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'normal'
    },
    show: {
      default: false
    },
    isShowMask: {
      default: false
    },
    time: {
      default: 500
    },
    transition: {
      default: true
    }
  },
  computed: {
    toastIcon: function () {
      if (this.type === 'success') {
        return require('../../assets/img/success.png')
      } else if (this.type === 'error') {
        return require('../../assets/img/toast.png')
      } else {
        return require('../../assets/img/exclaimed.png')
      }
    }
  }
}
</script>
<style type="text/css" scoped>
  .alertBox {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 74px;
    left: 0;
    bottom: 0;
    right: 0;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    z-index: 999;
  }
  .alertMask {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.75);
    z-index: 9999;
  }
  .containerBox {
    border-radius: 0 0 10px 10px;
    background: #000000;
    line-height: 45px;
    height: 45px;
    padding: 0 20px;
    display: flex;
    align-items: center;
  }
  .containerBox span {
    color: #FFFFFF;
    font-size: 14px;
    line-height: 17px;
    height: 17px;
    margin-left: 10px;
  }
  .icon {
    width: 14px;
    height: 14px;
  }
</style>
