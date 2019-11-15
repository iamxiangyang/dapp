 <template>
  <div class="wrap">
    <h1 class="tit2">{{$t('lang.accountLogin')}}</h1>
    <div class="formContent">
      <p class='errorTost' v-show='isErrorToast'>{{$t('lang.opps')}}</p>
      <CustomInput  :placeholder="$t('lang.account_place')" v-model='account' :focus='accountFocus' :blur='accountBlur'  autofocus :isTit = false :toast='$t("lang.account_place")' :isError='isAccountError'></CustomInput>
      <CustomInput  type='password' :placeholder="$t('lang.password_place')" v-model='password' :focus='passFocus' :blur='passBlur' :isTit = false :toast='$t("lang.password_place")' :isError='isPassError'></CustomInput>
      <div class='row'>
        <div class='box'>
          <input class='normal' type='text' v-model='inputCaptcha' id='codeInp' :placeholder='$t("lang.codeplace")' @focus='captchaFocus' @blur='captchaBlur'>
          <img class='codeImg' :src="captchaSrc" @click='changeCode'>
        </div>
        <span class='toast' v-show='isCaptchaError'>{{$t(captchaToast)}}</span>
      </div>
      <button class='loginBtn' @click='loginWithAcccount'>{{$t('lang.login')}}</button>
    </div>
  </div>
</template>
<script type="text/javascript">
import {login, checkCaptcha, captchaSrc} from '../util/axios.js'
import CustomInput from './CustomInput.vue'
import {mapMutations} from 'vuex'
export default {
  data () {
    return {
      captchaToast: '',
      captchaSrc: captchaSrc,
      codeSrc: captchaSrc,
      captchaToastList: ['lang.codeplace', 'lang.codeErr'],
      isAccountError: false,
      isPassError: false,
      isErrorToast: false,
      isCaptchaError: false,
      inputCaptcha: '',
      account: '',
      password: ''
    }
  },
  mounted () {
    let src = this.codeSrc
    let now = new Date()
    this.captchaSrc = src + '?time=' + now
  },
  components: {
    CustomInput
  },
  methods: {
    ...mapMutations('userInfo', ['setUserInfo']),
    loginWithAcccount () {
      let that = this
      if (that.account.length === 0) {
        that.isAccountError = true
        return
      }
      if (that.password.length === 0) {
        this.isPassError = true
        return
      }
      if (that.inputCaptcha.length === 0) {
        that.isCaptchaError = true
        that.captchaToast = this.captchaToastList[0]
        return
      }
      if (!that.isAccountError && !that.isPassError && !that.isCaptchaError) {
        let data = {username: that.account, passwd: that.password}
        login(data).then((res) => {
          if (res && res.status === 201) {
            that.setUserInfo(res.data)
            that.isErrorToast = false
            that.$emit('hide')
          }
        }).catch((err) => {
          if (err.response && err.response.status === 400) {
            let src = that.codeSrc
            let now = new Date()
            that.isErrorToast = true
            that.captchaSrc = src + '?time=' + now
          }
        })
      }
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
      } else {
        this.refreshCaptcha()
      }
    },
    refreshCaptcha () {
      let that = this
      checkCaptcha(this.inputCaptcha).then(function (res) {
        if (res && res.status === 200) {
          that.isCaptchaError = false
        }
      }).catch(err => {
        if (err.response && err.response.status === 400) {
          that.isCaptchaError = true
          that.captchaToast = that.captchaToastList[1]
          let src = that.codeSrc
          let now = new Date()
          that.captchaSrc = src + '?time=' + now
        }
      })
    }
  }
}
</script>

<style type="text/css" scoped="">
.wrap {
  width: inherit;
  height: inherit;
  position: inherit;
}
h1 {
  font-size: 18px;
  font-family: Lato-Bold;
  color: #333333;
  text-align: center;
  letter-spacing: 0.5px;
}
.error {
 border: 1px solid #F55452;
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
.formContent {
  position: relative;
  width: 100%;
  margin-top: 20px;
}

.tit2 {
  margin-top: 45px;
  width: 100%;
}
.loginBtn {
 min-width: 96px;
 padding: 0 10px;
 display: block;
 height: 38px;
 border-radius: 10px;
 background-color: #6D64FB;
 color: #ffffff;
 font-size: 14px;
 font-family: Lato-Regular;
 letter-spacing: 0.5px;
 line-height: 38px;
 margin: 20px auto 0;
 cursor: pointer;
}
.errorTost {
  color: #F55452;
  font-size: 14px;
  letter-spacing: 0.5px;
  font-family: Lato-Regular;
  line-height: 17px;
  margin-top: 20px;
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
.row {
  width: 100%;
  margin: 10px auto !important;
  position: relative;
  font-size: 14px;
}
</style>
