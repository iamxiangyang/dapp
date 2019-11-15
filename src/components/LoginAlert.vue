<template>
  <div class="cover">
    <div class="contain one" v-if = "types === 'one'">
      <div class="alertView">
        <div class="leftView">
          <div>
            <img src="../assets/img/alertCard.png">
            <p>{{$t(toast)}}</p>
          </div>
        </div>
        <div class='rightView'>
         <div class='rightBox'>
           <CustomLogin v-on:hide='closeAlert'></CustomLogin>
             <h2 class='quick' @click='quick'>{{$t('lang.quick')}}</h2>
             <p class="regist" @click='toRegist'>{{$t('lang.noAccount')}}<span>{{$t('lang.nowRegist')}}</span></p>
         </div>
        </div>
      </div>
      <img src="../assets/img/close2.png" class="closeImg" @click='closeAlert'>
    </div>
    <div class="contain three" v-else-if = "types === 'two'">
      <div class='alertView' >
        <div class="leftView">
          <div>
            <img src="../assets/img/alertCard.png">
            <p>{{$t(toast)}}</p>
          </div>
        </div>
         <div class='rightView'>
          <div class="rightBox">
            <h2 class="quickTitle">{{$t('lang.quick')}}</h2>
            <img src='../assets/img/alertMetaLogo.png' width="61px" height="61px" style="display: block;margin:10px auto 0;">
            <p class="topTxt">{{$t('lang.hasLogin')}}</p>
            <p class="underTxt">{{$t('lang.hasLogin_addr')}}{{address}}</p>
            <input type="password" name="pass" :placeholder="$t('lang.password_place')" class="pass" v-model='pass'>
            <button class="loginBtn" @click='metaMaskLogin'>{{$t('lang.login')}}</button>
            <h2 class="account" @click='loginWithAccount'>{{$t('lang.accountLogin')}}</h2>
            <p class="regist" @click='toRegist'>{{$t('lang.noAccount')}} <span>{{$t('lang.nowRegist')}}</span></p>
          </div>
         </div>
      </div>
      <img src="../assets/img/close2.png" class="closeImg" @click='closeAlert'>
    </div>
    <div class="contain two" v-else-if = "types === 'three'">
      <div class='alertView'>
        <div class="leftView">
          <div>
            <img src="../assets/img/alertCard.png">
            <p>{{$t(toast)}}</p>
          </div>
        </div>
        <div class='rightView'>
          <div class="rightBox">
            <div class="rightTop">
                 <p>{{$t('lang.notDetected')}}</p>
                 <p @click='install'><a>{{$t('lang.howInstall')}}</a></p>
            </div>
            <CustomLogin v-on:hide='closeAlert'></CustomLogin>
            <p class="regist" @click='toRegist'>{{$t('lang.noAccount')}} <span>{{$t('lang.nowRegist')}}</span></p>
          </div>
        </div>
      </div>
      <img src="../assets/img/close2.png" class="closeImg" @click='closeAlert'>
    </div>
    <div class="contain four" v-else-if = "types === 'four'">
      <div class='alertView'>
        <div class="leftView">
          <div>
            <img src="../assets/img/alertCard.png">
            <p>{{$t(toast)}}</p>
          </div>
        </div>
        <div class='rightView selfWidth'>
          <div class='rightBoxTwo'>
            <h1>{{$t('lang.registNew')}}</h1>
            <div class="btnBox">
              <button @click='registDevloper'>{{$t('lang.regist_dev')}}</button>
              <button @click='registCommen'>{{$t('lang.regist_reg')}}</button>
            </div>
            <p class='toast'>{{$t('lang.canUpload')}}</p>
            <div class="textBox">
              <p>{{$t('lang.metamask_use')}}{{address}}</p>
              <p>{{$t('lang.metamask_login')}}</p>
            </div>
            <div class="loginBox" @click='loginWithAccount'><a>{{$t('lang.hasAccount')}}</a></div>
          </div>
        </div>
      </div>
      <img src="../assets/img/close2.png" class="closeImg" @click='closeAlert'>
    </div>
  </div>
</template>
<script type="text/javascript">
import CustomLogin from './CustomLogin.vue'
import {mapState, mapMutations} from 'vuex'
import {quickLogin} from '../util/axios.js'
export default {
  data () {
    return {
      pass: '',
      address: '',
      types: '',
      isLoginMetaMask: false
    }
  },
  props: {
    toast: {
      type: String
    }
  },
  components: {
    CustomLogin
  },
  mounted () {
    let that = this
    that.registerWeb3Instance(() => {
      that.isLoginMetaMask = !!that.web3 && !!that.web3.coinbase
      if (that.isLoginMetaMask) {
        that.address = that.web3.coinbase
        that.checkIsBinded(() => {
          if (that.isBindedMetaMask) {
            that.types = 'two'
          } else {
            that.types = 'four'
          }
        })
      } else {
        that.types = 'three'
      }
    })
  },
  computed: {
    ...mapState({
      web3: state => state.web3Instance.web3,
      isBindedMetaMask: state => state.web3Instance.isBindedMetaMask
    })
  },
  methods: {
    ...mapMutations('web3Instance', ['registerWeb3Instance', 'checkIsBinded']),
    ...mapMutations('vc', ['developerRegist', 'userRegist', 'showLoginMetaMask', 'hideLoginMetaMask']),
    ...mapMutations('userInfo', ['setUserInfo']),
    toRegist () {
      let that = this
      that.registerWeb3Instance(() => {
        if (that.web3.coinbase) {
          that.checkIsBinded(() => {
            if (that.isBindedMetaMask) {
              this.$emit('hide')
              that.showLoginMetaMask()
            } else {
              that.hideLoginMetaMask()
              that.$router.push({path: '/registType'})
            }
          })
        } else {
          this.$emit('hide')
          that.showLoginMetaMask()
        }
      })
    },
    loginWithAccount () {
      this.types = 'one'
    },
    quick () {
      this.types = 'two'
    },
    metaMaskLogin () {
      let that = this
      let data = {metamask: that.web3.coinbase, passwd: that.pass}
      quickLogin(data).then((res) => {
        if (res && res.status === 201) {
          that.setUserInfo(res.data)
          this.$emit('hide')
        }
      }).catch(err => {
        if (err && err.response.status === 400) {
          that.$toast.show({
            toast: that.$t('lang.passwordErr_four')
          })
        }
      })
    },
    closeAlert () {
      this.$emit('hide')
    },
    install () {
      this.$emit('hide')
      this.$router.push('/wallet')
    },
    registDevloper () {
      this.$emit('hide')
      this.developerRegist()
      this.$router.push('/regist')
    },
    registCommen () {
      this.$emit('hide')
      this.userRegist()
      this.$router.push('/regist')
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
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}
.contain {
  margin: auto;
  display: flex;
}
.alertView {
  opacity: 0.98;
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,1);
  border-radius: 10px;
  margin-left: 20px;
  margin-right: 10px;
  border-radius: 10px;
  display: flex;
}
.leftView {
  width: 274px;
  height: auto;
  background-color: #F5F7F6;
  border-radius: 10px 0 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}
.leftView p {
  color: #333333;
  font-size: 14px;
  font-family: Lato-Regular;
  text-align: center;
  width: 100%;
  height: 17px;
  line-height: 17px;
}
.leftView img {
  width: 139px;
  height: 139px;
  border-radius: 50%;
}
.rightView {
  width: 459px;
  display: flex;
  justify-content: center;
}
.selfWidth {
  width: 609px;
}
.rightBox {
  width: 342px;
}
.quick {
  width: 100px;
  color: #5BC7CB;
  font-size: 14px;
  text-decoration: underline;
  cursor: pointer;
  margin: 10px auto 0;
}
.topTxt {
  color: #333333;
  font-size: 14px;
  line-height: 17px;
  margin-top: 15px;
  text-align: center;
}
.underTxt {
  color: #999999;
  font-size: 12px;
  line-height: 14px;
  margin-top: 5px;
  text-align: center;
}
.pass {
  width: 342px;
  height: 42px;
  border-radius: 5px;
  margin-top: 20px;
  padding-left: 10px;
  border: 1px solid #EBEBEB;
}
.pass:focus {
  outline: none;
}
.regist {
  color: #333333;
  font-size: 14px;
  line-height: 17px;
  margin-top: 40px;
  margin-bottom: 20px;
  text-align: center;
  cursor: pointer;
}
.regist span {
  color: #8590A6;
}
.rightTop {
  margin: 40px;
  font-family: Lato-Regular;
}
.rightTop p{
  color: #333333;
  font-size: 16px;
  text-align: center;
}
.rightTop a {
  color: #5BC7CB;
  font-size: 14px;
  text-decoration: underline;
}
h2 {
  font-size: 16px;
  font-family: Lato-Bold;
  color: #333333;
  letter-spacing: 0.5px;
  text-align: center;
}
.quickTitle {
  margin-top: 28px;
}
.one {
  width: 734px;
  /*height: 408px;*/
}
.two {
  width: 816px;
  /*height: 444px;*/
}
.three {
  width: 776px;
  /*height: 408px;*/
}
.four {
  width: 883px;
  /*height: 408px;*/
}
.rightBoxTwo {
  width: 100%;
}
.rightBoxTwo h1 {
  width: 100%;
  text-align: center;
  height: 34px;
  line-height: 34px;
  margin-top: 48px;
  font-size: 28px;
  color: #000000;
  letter-spacing: 0.5px;
}
.toast {
  text-align: left;
  height: 32px;
  line-height: 32px;
  margin-top: 6px;
  margin-left: 81px;
  color: #999;
  font-size: 14px;
}
.btnBox {
  width: 446px;
  height: 55px;
  margin: 30px auto 0;
  display: flex;
  justify-content: space-between;
}
.btnBox button {
  min-width: 212px;
  padding: 0 10px;
  height: 55px;
  border: 1px solid #EBEBEB;
  font-size: 18px;
  letter-spacing: 0.5px;
  border-radius: 15px;
}
.btnBox button:hover {
  color: #6531E9;
  border: 1px solid #6531E9;
  cursor: pointer;
}
.textBox {
  width: 549px;
  height: 52px;
  margin: 67px auto 0;
}
.textBox p {
  width: 100%;
  color: #666666;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0.5px;
  text-align: left;
}
.loginBox {
  margin: 39px auto 30px;
  text-align: center;
}
.loginBox a {
  color: #5BC7CB;
  text-decoration: underline;
}
.loginBtn {
  min-width: 96px;
  display: block;
  text-align: center;
  padding: 0 10px;
  height: 38px;
  border-radius: 10px;
  background: #6D64FB;
  color: #FFFFFF;
  font-size: 14px;
  letter-spacing: 0.5px;
  margin: 30px auto;
}
.account {
  color: #5BC7CB;
  font-size: 14px;
  line-height: 17px;
  text-decoration: underline;
  margin-top: 8px;
  cursor: pointer;
}
.closeImg {
  width: 16px;
  height: 16px;
  cursor: pointer;
}
</style>
