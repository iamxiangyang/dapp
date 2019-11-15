<template>
  <div class="cover" v-show='isClose'>
    <div class="wrap">
      <div class="container">
        <img src= "../assets/img/exclaimed.png"/>
        <p>{{$t(toast)}}</p>
        <div class="btnGroup">
          <CallMeButton  @click='cancel'>{{$t('lang.cancel')}}</CallMeButton>
          <CallMeButton  @click='save'>{{$t('lang.confirm')}}</CallMeButton>
        </div>
      </div>
        <img src="../assets/img/close2.png" class="closeImg" @click='close'>
    </div>
  </div>
</template>
<script type="text/javascript">
import {mapMutations, mapState} from 'vuex'
import CallMeButton from '../components/CustomButton.vue'
export default {
  data () {
    return {
      type: ''
    }
  },
  props: {
    toast: {
      type: String
    }
  },
  components: {
    CallMeButton
  },
  methods: {
    ...mapMutations('vc', ['hideEditAlert']),
    save () {
      this.type = 'save'
      this.hideEditAlert()
      this.$emit('confirm')
    },
    cancel () {
      this.type = 'cancel'
      this.hideEditAlert()
      this.$emit('cancel')
    },
    close () {
      this.hideEditAlert()
    }
  },
  computed: {
    ...mapState({
      isClose: state => state.vc.isShowEditAlert
    })
  }
}
</script>
<style type="text/css" scoped>
.cover {
  position: fixed;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Lato-Regular;
  letter-spacing: 0.5px;
}
.wrap {
  display: flex;
}
.container {
  width: 409px;
  /*height: 226px;*/
  background: #ffffff;
  border-radius: 10px;
  padding: 0 32px 20px;
}
.container>img {
  width: 37px;
  height: 41px;
  margin: 32px auto 0;
  display: block;
}
.container p {
  font-size: 16px;
  line-height: 26px;
  color: #333333;
  text-align: center;
  margin: 15px auto 0;
}
.closeImg {
  width: 16px;
  height: 16px;
  margin-left: 10px;
  cursor: pointer;
}
.btnGroup {
  width: 202px;
  height: 36px;
  margin: 45px auto 0;
  display: flex;
  justify-content: space-between;
}
.btnGroup button {
  width: 96px;
  height: 36px;
  border-radius: 8px;
  color: #666666;
  outline: none;
  border: 1px solid #EBEBEB;
}
.selected {
  background: #6D64FB;
  color: #ffffff !important;
}
.selfMargin {
  margin-top: 65px !important;
}
</style>
