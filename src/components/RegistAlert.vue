<template>
  <div class="cover">
    <div class='contain'>
      <div class='alertView'>
        <img class='icon' :class='{"noInstall":!isBindedMetaMask}' src='../assets/img/metamask.png' width="59px" height="59px" />
        <p class='tit'>{{txt}}</p>
        <div class='typeOne'>
          <CustomButton class='refreshBtn'  @click = 'refresh' :kind='isBindedMetaMask?"normal":"active"'>{{$t('lang.refresh')}}</CustomButton>
          <button class="login" v-if='isBindedMetaMask === true' @click='quick'>{{$t('lang.login')}}</button>
          <p class='logged' v-else>{{$t('lang.hasLogin_me')}}</p>
        </div>
         <p class='install' @click='toWallet' v-if='!isBindedMetaMask'>{{$t('lang.howInstall')}}</p>
      </div>
      <div><img src="../assets/img/close2.png" class='close2' @click='hideLoginMetaMask'></div>
    </div>
  </div>
</template>
<script type="text/javascript">
import {mapMutations, mapState} from 'vuex'
import CustomButton from './CustomButton'
export default {
  name: 'RegistAlert',
  data () {
    return {
      txt: this.$t('lang.signUp'),
      txtList: [this.$t('lang.signUp'), this.$t('lang.hasBind')]
    }
  },
  mounted () {
    let that = this
    that.registerWeb3Instance(() => {
      if (that.web3.coinbase) {
        that.checkIsBinded(function () {
          if (that.isBindedMetaMask) {
            that.txt = that.txtList[1]
          } else {
            that.txt = that.txtList[0]
          }
        })
      }
    })
  },
  components: {
    CustomButton
  },
  computed: {
    ...mapState({
      web3: state => state.web3Instance.web3,
      isBindedMetaMask: state => state.web3Instance.isBindedMetaMask
    })
  },
  methods: {
    ...mapMutations('vc', ['hideLoginMetaMask', 'showLoginMetaMask']),
    ...mapMutations('web3Instance', ['registerWeb3Instance', 'checkIsBinded']),
    ...mapMutations('userInfo', ['setUserInfo']),
    refresh () {
      let that = this
      that.registerWeb3Instance(() => {
        if (that.web3.coinbase) {
          that.checkIsBinded(function () {
            if (that.isBindedMetaMask) {
              that.showLoginMetaMask()
              that.txt = that.txtList[1]
            } else {
              that.hideLoginMetaMask()
              that.$router.push({path: '/registType'})
            }
          })
        } else {
          that.txt = that.txtList[0]
        }
      })
    },
    toWallet () {
      this.hideLoginMetaMask()
      this.$router.push('/wallet')
    },
    quick () {
      this.hideLoginMetaMask()
      this.$router.push('/login')
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
  width: 528px;
  height: 259px;
  opacity: 0.98;
  background: rgba(255,255,255,1);
  border-radius: 10px;
  margin-left: 50px;
  margin-right: 10px;
}
.icon {
  margin-top: 45px;
}
.noInstall {
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
  position: relative;
 }
.close2 {
  width: 16px;
  height: 16px;
  margin-bottom: 235px;
  border-radius: 10px;
  cursor: pointer;
 }
.typeOne {
  position: relative;
  margin-top: 35px;
  width: 100%;
  height: 38px;
  overflow: hidden;
 }

.refreshBtn {
  min-width: 96px;
  padding: 0 10px;
  height: 36px;
  margin: auto  0;
  position: relative;
  border-radius: 10px;
  font-size: 14px;
  color: #333333;
  background: rgba(245, 247, 246, 0.5);
  letter-spacing: 0.5px;
  border: 1px solid #dedede;
}

.login {
  min-width: 96px;
  padding: 0 10px;
  height: 36px;
  margin: auto  0;
  position: relative;
  border-radius: 10px;
  font-size: 14px;
  margin-left: 20px;
  color: #FFFFFF;
  background: #6156FF;
}
.login:hover {
  background-color: #6159E1;
}
.logged {
  width: 140px;
  height: 28px;
  line-height: 28px;
  display: inline-block;
  position: absolute;
  font-size: 12px;
  font-family: Lato-Regular;
  color: #666666;
  margin-top: 5px;
  margin-left: 5px;
  background: url('../assets/img/leftToast.png');
  background-size: 100% 100%;
}
.install {
  width: 155px;
  height: 17px;
  line-height: 17px;
  color: #5BC7CB;
  font-size: 12px;
  font-family: Lato-Regular;
  margin-top: 23px;
  margin-right: 10px;
  float: right;
  cursor: pointer;
  text-decoration: underline;
}
</style>
