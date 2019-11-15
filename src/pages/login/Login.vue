<template>
  <div>
    <header class="head">
    <router-link to='/'><img src="../../assets/img/logo.png"></router-link>
    </header>
    <div class='container'>
      <!-- 登录metamask -->
      <div class="top" v-if = 'isLoginMeta'>
        <!-- 已绑定 -->
        <div class="quick" v-show='types === "quick"'>
          <h1>{{$t('lang.quick')}}</h1>
          <div class="quickBox">
            <img src="../../assets/img/metamask.png" alt="metaMask" width="26" height="24px" style="margin-top: 35px" />
            <p class="topTxt">{{$t('lang.hasLogin')}}</p>
            <p class="underTxt">{{$t('lang.hasLogin_addr')}}{{web3.coinbase}}</p>
            <div style="width: 468px; margin: 0 auto">
              <CustomInput type='password' :tit='$t("lang.password")' :placeholder='$t("lang.password_place")' :toast='$t("lang.password_place")' v-model='passwd'></CustomInput>
            </div>
            <CustomButton class="loginBtn" @click='quickLogin' kind='active'>{{$t('lang.login')}}</CustomButton>
            <h2 class="exchange" @click='loginWithAccount'>{{$t('lang.accountLogin')}}</h2>
          </div>
        </div>
        <!-- 未绑定 -->
        <div class="accountLogin" v-show='types === "account"'>
          <h1 class="tit2">{{$t('lang.accountLogin')}}</h1>
          <div class="formContent">
            <div style="width: 468px; margin: 0 auto">
              <p class='errorTost' v-show='isErrorToast'>{{$t('lang.opps')}}</p>
              <CustomInput :tit='$t("lang.account")'  :placeholder='$t("lang.registPlace_one")' v-model='account' :focus='accountFocus' :blur='accountBlur' :isError='isAccountError' :toast='$t("lang.account_place")' autofocus></CustomInput>
              <CustomInput :tit='$t("lang.password")' type='password'  v-model='password' :focus='passFocus' :blur='passBlur' :isError='isPassError' :placeholder="$t('lang.password_place')" :toast='$t("lang.password_place")'></CustomInput>
              <div class='row'>
                <p>{{$t('lang.code')}}</p><div class='box'><input class='normal codeInp' type='text' v-model='inputCaptcha'  :placeholder="$t('lang.codeplace')" @focus='captchaFocus' @blur='captchaBlur'><img class='codeImg' :src="captchaSrc" @click='changeCode'></div><span class='toast' v-show='isCaptchaError'>{{$t(captchaToast)}}</span>
              </div>
              <CustomButton class='loginBtn' @click='login' kind='active'>{{$t('lang.login')}}</CustomButton>
              <h2 class="exchange" @click='loginWithQuick'>{{$t('lang.quick')}}</h2>
            </div>
          </div>
        </div>
        <p class="regist" @click='toRegist'>{{$t('lang.noAccount')}} <span>{{$t('lang.nowRegist')}}</span></p>
      </div>
      <!-- 未登录metamask -->
      <div v-else>
        <div class="top">
          <img src="../../assets/img/animal.png"  width="158px" height="120px">
          <h2 class="tit1">{{$t('lang.notDetected')}}</h2>
          <router-link class="install" to='/wallet'>{{$t('lang.howInstall')}}</router-link>
        </div>
        <div>
          <h1 class="tit2">{{$t('lang.accountLogin')}}</h1>
          <div class="formContent">
            <div style="width: 468px; margin: 0 auto">
            <p class='errorTost' v-show='isErrorToast'>{{$t('lang.opps')}}</p>
            <CustomInput :tit='$t("lang.account")'  :placeholder='$t("lang.registPlace_one")' v-model='account' :focus='accountFocus' :blur='accountBlur' :isError='isAccountError' :toast='$t("lang.account_place")' autofocus></CustomInput>
            <CustomInput :tit='$t("lang.password")' type='password'  v-model='password' :focus='passFocus' :blur='passBlur' :isError='isPassError' :placeholder="$t('lang.password_place')" :toast='$t("lang.password_place")'></CustomInput>
            <div class='row'>
              <p>{{$t('lang.code')}}</p><div class='box'><input class='normal codeInp' type='text' v-model='inputCaptcha'  :placeholder="$t('lang.codeplace')" @focus='captchaFocus' @blur='captchaBlur'><img class='codeImg' :src="captchaSrc" @click='changeCode'></div><span class='toast' v-show='isCaptchaError'>{{$t(captchaToast)}}</span>
            </div>
            <CustomButton class='loginBtn' @click='login' kind='active'>{{$t('lang.login')}}</CustomButton>
            </div>
          </div>
          <p class="regist" @click='toRegist'>{{$t('lang.noAccount')}} <span>{{$t('lang.nowRegist')}}</span></p>
        </div>
      </div>
    </div>
        <RegistAlert v-if='isShowRegistAlert'></RegistAlert>
  </div>
</template>

<script type="text/javascript">
import {mapMutations, mapState} from 'vuex'
import CustomInput from '../../components/CustomInput.vue'
import RegistAlert from '../../components/RegistAlert.vue'
import CustomButton from '../../components/CustomButton.vue'
import {login, quickLogin, checkCaptcha, captchaSrc} from '../../util/axios.js'
export default {
  data () {
    return {
      captchaToast: '',
      captchaSrc: captchaSrc,
      codeSrc: captchaSrc,
      captchaToastList: ['lang.codeplace', 'lang.codeErr'],
      isErrorToast: false,
      isCaptchaError: false,
      inputCaptcha: '',
      isAccountError: false,
      isPassError: false,
      account: '',
      password: '',
      passwd: '',
      types: ''
    }
  },
  components: {
    CustomInput,
    RegistAlert,
    CustomButton
  },
  computed: {
    ...mapState({
      isBindedMetaMask: state => state.web3Instance.isBindedMetaMask,
      web3: state => state.web3Instance.web3,
      user: state => state.userInfo.user,
      isLoginMeta: state => !!state.web3Instance.web3.coinbase,
      isShowRegistAlert: state => state.vc.isShowRegistAlert
    })
  },
  created () {
    this.checkIsBinded(() => {
      if (this.isBindedMetaMask) {
        this.types = 'quick'
      } else {
        this.types = 'account'
      }
    })
    this.changeCode()
    this.headHide()
  },
  methods: {
    ...mapMutations('vc', ['headHide', 'headShow', 'showLoginMetaMask', 'hideLoginMetaMask']),
    ...mapMutations('userInfo', ['setUserInfo']),
    ...mapMutations('web3Instance', ['registerWeb3Instance', 'checkIsBinded']),
    login () {
      let that = this
      that.isErrorToast = false
      if (this.account.length === 0) {
        this.isAccountError = true
      }
      if (this.password.length === 0) {
        this.isPassError = true
      }
      if (this.inputCaptcha.length === 0) {
        this.isCaptchaError = true
        this.captchaToast = this.captchaToastList[0]
      }
      this.refreshCaptcha(() => {
        if (!this.isAccountError && !this.isPassError && !this.isCaptchaError) {
          let data = {username: this.account, passwd: this.password}
          login(data).then((res) => {
            if (res && res.status === 201) {
              that.setUserInfo(res.data)
              that.isErrorToast = false
              that.$router.push('/')
            }
          }).catch((err) => {
            if (err && (err.response.status === 400 || err.response.status === 409)) {
              let src = that.codeSrc
              let now = new Date()
              that.isErrorToast = true
              that.captchaSrc = src + '?time=' + now
            }
          })
        }
      })
    },
    changeCode () {
      let src = this.codeSrc
      let now = new Date()
      this.captchaSrc = src + '?time=' + now
    },
    accountFocus (e) {
      this.isAccountError = false
    },
    accountBlur (e) {
      let val = this.account
      if (val.length === 0) {
        this.isAccountError = true
      }
    },
    passFocus () {
      this.isPassError = false
    },
    passBlur (e) {
      let val = this.password
      if (val.length === 0) {
        this.isPassError = true
      }
    },
    captchaFocus () {
      this.isCaptchaError = false
    },
    captchaBlur () {
      if (this.inputCaptcha.length === 0) {
        this.isCaptchaError = true
        this.captchaToast = this.captchaToastList[0]
      } else if (this.inputCaptcha.length !== 4) {
        this.isCaptchaError = true
        this.captchaToast = this.captchaToastList[1]
      }
    },
    refreshCaptcha (callback) {
      let that = this
      checkCaptcha(this.inputCaptcha).then(() => {
        callback()
      }).catch(err => {
        if (err && err.response.status === 400) {
          that.isCaptchaError = true
          that.captchaToast = that.captchaToastList[1]
          let src = that.codeSrc
          let now = new Date()
          that.captchaSrc = src + '?time=' + now
          callback()
        }
      })
    },
    quickLogin () {
      let that = this
      if (that.passwd.length < 6 || that.passwd.length > 12) {
        that.$toast.show({
          toast: this.$t('lang.passwordErr_two')
        })
        return
      }
      quickLogin({metamask: that.web3.coinbase, passwd: that.passwd}).then((res) => {
        if (res && res.status === 201) {
          that.setUserInfo(res.data)
          that.$router.push('/')
        }
      }).catch(err => {
        if (err.response && err.response.status === 400) {
          this.$toast.show({
            toast: err.response.data.errmsg
          })
        }
      })
    },
    toRegist () {
      let that = this
      that.registerWeb3Instance(() => {
        if (that.web3.coinbase) {
          that.checkIsBinded(() => {
            if (that.isBindedMetaMask) {
              that.showLoginMetaMask()
            } else {
              that.hideLoginMetaMask()
              that.$router.push({path: '/registType'})
            }
          })
        } else {
          that.showLoginMetaMask()
        }
      })
    },
    loginWithAccount () {
      this.types = 'account'
      this.clearInfo()
    },
    loginWithQuick () {
      this.types = 'quick'
      this.clearInfo()
    },
    clearInfo () {
      this.account = ''
      this.password = ''
      this.passwd = ''
      this.inputCaptcha = ''
    }
  },
  beforeRouteLeave (to, from, next) {
    this.headShow()
    next()
  }
}
</script>

<style type="text/css" scoped>
.head {
  width: 100%;
  height: 74px;
  line-height: 74px;
  background-color: #4E3DC2;
  font-size: 35px;
  color: #ffffff;
  text-align: center;
  cursor: pointer;
}
.head img {
  width: 90px;
}
.head a {
  vertical-align: middle;
}
.container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.top {
  width: 844px;
  margin-top: 45px;
}
.formContent {
  width: 100%;
  height: auto;
  padding-bottom: 40px;
  margin-top: 20px;
  border: 1px solid #EDEDED;
  border-radius: 10px;
}
.row {
  width: 468px;
  margin: 30px auto;
  position: relative;
  font-size: 14px;
}
.row p{
  height: 17px;
  width: 100%;
  font-family: Lato-Bold;
  color: #333333;
  text-align: left;
  line-height: 17px;
  margin-bottom: 10px;
  letter-spacing: 0.5px;
  display: flex;
  justify-content: space-between;
}
.normal {
  width: 100%;
  height: 42px;
  color: #333333;
  font-family: Lato-Regular;
  display: inline-block;
  line-height: 42px;
  border-radius: 5px;
  border: 1px solid #EBEBEB;
  padding-left: 12px;
  letter-spacing: 0.5px;
}

.codeInp {
  width: 245px;
}
.normal:focus {
  outline: none;
  border: 1px solid #3c99fc;
}
.box {
  width: 100%;
  display: flex;
}

.toast {
  height: 17px;
  font-family: Lato-Regular;
  color: #F55452;
  text-align: left;
  line-height: 17px;
  letter-spacing: 0.5px;
  margin-top: 10px;
  display: block;
}
.codeImg {
  display: inline-block;
  width: 113px;
  height: 42px;
  line-height: 42px;
  border-radius: 5px;
  background-color: #F5F7F6;
  font-size: 18px;
  font-family: Lato-Regular;
  color: #000000;
  margin-left: 15px;
}
.error {
 border: 1px solid #F55452;
}
.tit1 {
  margin-top: 30px;
  font-size: 16px;
  font-family: Lato-Regular;
  color: #333333;
  letter-spacing: 0.5px;
}
.install {
  margin-top: 10px;
  font-size: 14px;
  font-family: Lato-Regular;
  color: #5BC7CB;
  letter-spacing: 0.5px;
  text-decoration: underline;
}
.quickBox {
  width: 844px;
  height: 336px;
  border: 1px solid #EDEDED;
  border-radius: 10px;
  margin:20px auto;
}
.regist {
  color: #333333;
  font-size: 14px;
  line-height: 17px;
  margin: 20px auto 80px;
  cursor: pointer;
  width: 100%;
  text-align: right;
}
.regist span {
  color: #8590A6;
}
.regist span:hover {
  text-decoration: underline;
}
.topTxt {
  color: #333333;
  font-size: 14px;
  line-height: 17px;
  margin-top: 15px;
}
.underTxt {
  color: #999999;
  font-size: 12px;
  line-height: 14px;
  margin-top: 5px;
}
h1 {
  font-size: 18px;
  font-family: Lato-Bold;
  color: #333333;
  text-align: center;
  letter-spacing: 0.5px;
}

.exchange {
  font-size: 14px;
  color: #5BC7CB;
  line-height: 17px;
  margin-top: 10px;
  cursor: pointer;
  text-decoration: underline;
}
.exchange:hover {
  color: #4FA1B1;
}
.tit2 {
  margin-top: 40px;
  width: 100%;
}
.loginBtn {
 /*width: 185px;
 height: 38px;
 border-radius: 10px;
 background-color: #6D64FB;
 color: #ffffff;
 font-size: 14px;
 font-family: Lato-Regular;
 letter-spacing: 0.5px;
 line-height: 38px;*/
 margin: 0 auto;
}
.errorTost {
  color: #F55452;
  font-size: 14px;
  letter-spacing: 0.5px;
  font-family: Lato-Regular;
  height: 17px;
  line-height: 17px;
  margin-top: 40px;
}
</style>
