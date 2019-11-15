<template>
  <div class="cover">
    <div class='contain'>
      <div class='alertView selfBox' v-show='status === "notLogin"'>
        <img class='icon' src='../assets/img/metamask.png' width="59px" height="59px" />
        <p class='tit'>{{$t('lang.signMetamask')}}</p>
        <div class='typeOne'>
          <button class='refresh' @click = 'refresh'>{{$t('lang.refresh')}}</button>
          <div class='logged'>{{$t('lang.hasLogin_me')}}</div>
        </div>
      </div>
      <div class='alertView selfBox' v-show='status === "notMatch"'>
        <p class='tit' style="margin-top: 45px;">{{$t('lang.revise_addr')}}</p>
        <p class="detail">
          {{$t('lang.notMatch')}}{{user.metamask}}{{$t('lang.notMatch_last')}}
        </p>
        <div class='typeOne'>
          <button class='refresh' @click = 'refresh'>{{$t('lang.refresh')}}</button>
          <div class="logged">{{$t('lang.switched')}}</div>
        </div>
      </div>
      <div><img src="../assets/img/close2.png" class='close2' @click='hide'></div>
    </div>
  </div>
</template>
<script type="text/javascript">
import {mapState, mapMutations} from 'vuex'
export default {
  data () {
    return {
      status: ''
    }
  },
  computed: {
    ...mapState({
      user: state => state.userInfo.user,
      web3: state => state.web3Instance.web3
    })
  },
  created () {
    this.registerWeb3Instance(() => {
      if (this.web3.coinbase) {
        this.status = 'notMatch'
      } else {
        this.status = 'notLogin'
      }
    })
  },
  methods: {
    ...mapMutations('web3Instance', ['registerWeb3Instance']),
    refresh () {
      this.$emit('switch')
    },
    hide () {
      this.$emit('hide')
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
  font-family: Lato-Regular;
}
.contain {
  position: fixed;
  width: 100%;
  height: 100%;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
.alertView {
  width: 474px;
  /*height: 246px;*/
  opacity: 0.98;
  background: rgba(255,255,255,1);
  border-radius: 10px;
  margin-left: 50px;
  margin-right: 10px;
  position: relative;
}
.icon {
  margin-top: 25px;
}
.tit {
  font-family: Lato-Regular;
  font-size: 16px;
  color: #333333;
  margin: 0 auto;
  text-align: center;
  line-height: 19px;
  height: 19px;
  margin-top: 25px;
 }
.close2 {
  width: 16px;
  height: 16px;
  margin-bottom: 235px;
  border-radius: 10px;
  cursor: pointer;
 }
.typeOne {
  margin-top: 35px;
  width: 100%;
  height: 38px;
  display: flex;
  align-items: center;
  overflow: hidden;
 }
.refresh {
  min-width: 96px;
  padding: 0 10px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid #DEDEDE;
  font-size: 14px;
  letter-spacing: 0.5px;
  margin-left: 145px;
  background-color: #6D64FB;
  color: #FFFFFF;
}
.selfBox {
  padding: 0 50px 30px;
}
.detail {
  color: #999999;
  font-size: 14px;
  text-align: left;
  margin: 15px auto 0;
  line-height: 23px;
}
.logged {
  width: auto;
  min-width: 75px;
  padding: 0 10px;
  height: 28px;
  line-height: 28px;
  font-size: 12px;
  color: #666666;
  margin-left: 5px;
  background: url('../assets/img/leftToast.png');
  background-size: 100% 100%;
}
</style>
