<template>
  <div class='wrap'>
    <div class="head">
      <router-link to='/'><img src="../../assets/img/logo.png"></router-link>
    </div>
    <div class='formContent'>
      <div style="width: 468px; margin: 0 auto">
      <input type="text" name="hide1" style="display: none;">
      <input type="password" name="hide2" style="display: none;">
      <CustomInput :tit='$t("lang.account")' v-model='account' :isError='isAccountError' :toast='$t(accountToast)' :placeholder='$t(placeList[0])' :focus='accountFocus' :blur='accountBlur' autofocus></CustomInput>
      <CustomInput :tit='$t(nameTitle)' v-model='nick' :isError='isNickError' :toast='$t(nickToast)' :placeholder="$t(placeList[1])" :blur='nickBlur' :focus="nickFocus"></CustomInput>
      <CustomInput :tit='$t("lang.password")' type='password' v-model='password' :isError='isPassError' :toast='$t(passToast)' :placeholder="$t(placeList[2])" :blur='passBlur' :focus="passFocus"></CustomInput>
      <CustomInput :tit='$t("lang.confirmPassword")' type='password' :placeholder="$t('lang.confirmPassword_place')" v-model='confirm' :isError='isConfirmPassError' :toast='$t("lang.passwordNotMatch")' :blur='confirmPassBlur' :focus="confirmPassFocus"></CustomInput>
      </div>
      <div class="row">
        <p>{{$t(avatarTitle)}}<span class='right'>{{$t('lang.recommen_icon_two')}}</span></p>
        <div class="load">
          <div class='loadImg'><img class='loadImg' :src='imgSrc' v-show='hasLogo'></div>
          <CustomButton class='loadBtn' @click='changeLogo'>{{$t('lang.upload')}}</CustomButton>
        </div>
        <span class='toast' v-show='isLogoError'>{{$t(logoToast)}}</span>
      </div>
      <div v-if='isDeveloper'>
        <div style="width: 468px; margin: 0 auto">
          <CustomInput :tit='$t("lang.websiteLink")' :placeholder='$t("lang.websitePlace")' v-model='link' :toast='$t(linkToast)' :focus='linkFocus' :blur='linkBlur' :isError='isLinkError'></CustomInput>
        </div>
        <div class="row"><p>{{$t('lang.studioIntroduction')}}<span class='right'>({{textNum}}/500)</span></p>
         <textarea @input="descArea" v-model='introduct'></textarea>
         <span class='toast' v-show='isIntroductError'>{{$t(introductToast)}}</span>
       </div>
     </div>
     <div class='row'>
      <p>{{$t('lang.code')}}</p>
      <div class='box'>
        <input class='normal' type='text' v-model='inputCaptcha' id='codeInp' @focus='isCaptchaError=false' @blur='captchaBlur' >
        <img class='codeImg' :src="captchaSrc" @click='changeCaptchaSrc'>
      </div>
      <span class='toast' v-show='isCaptchaError'>{{$t(captchaToast)}}</span>
    </div>
     <div class="row">
      <div class='agree'>
        <input type="checkbox" v-model='agreeVal' @change='agreeChange'>
        <p>
          <!-- {{$t('lang.aggree')}} -->
          <router-link tag="a" target="_blank" :to="{path:'/agreement'}">{{$t('lang.aggree')}}</router-link>
        </p>
      </div>
      <span class='toast' v-show='isAgreeError'>{{$t('lang.aggreeToast')}}</span>
    </div>
    <div class="row"><CustomButton @click='regist' kind='active' class='registBtn'>{{$t('lang.regist')}}</CustomButton></div>
  </div>
  <ImageCrop :crop='crop' :img = 'imgSrc' @close='crop = false' @save='saveAvatar'></ImageCrop>
</div>
</template>
<script>
import {mapMutations, mapState} from 'vuex'
import CustomButton from '../../components/CustomButton.vue'
import CustomInput from '../../components/CustomInput.vue'
import ImageCrop from '../../components/ImageCrop.vue'
import {checkCaptcha, checkAccount, checkNickname, registUser, registEnterprise, uploadImg, getQNToken, captchaSrc} from '../../util/axios.js'
export default {
  name: 'Regist',
  data () {
    return {
      nameTitle: 'lang.nick',
      avatarTitle: 'lang.icon',
      inputCaptcha: '',
      lastCode: '',
      captchaSrc: captchaSrc,
      codeSrc: captchaSrc,
      captcha: '',
      isAccountError: false,
      isNickError: false,
      isPassError: false,
      isConfirmPassError: false,
      isCaptchaError: false,
      isAgreeError: false,
      isLogoError: false,
      isLinkError: false,
      isIntroductError: false,
      accountToast: '',
      nickToast: '',
      passToast: '',
      captchaToast: '',
      logoToast: '',
      linkToast: '',
      introductToast: '',
      placeList: ['lang.registPlace_one', 'lang.registPlace_two', 'lang.registPlace_three'],
      accountToastList: ['lang.accountErr_one', 'lang.accountErr_two', 'lang.account_place', 'lang.accountErr_three', 'lang.accountErr_four'],
      nickToastList: ['lang.nickErr_one', 'lang.nickErr_two', 'lang.nickErr_three', 'lang.nickErr_four'],
      passToastList: ['lang.passwordErr_one', 'lang.passwordErr_two', 'lang.passwordErr_three'],
      logoToastList: ['lang.iconErr_one', 'lang.picErr', 'lang.studioLogoErr'],
      linkToastList: ['lang.websiteErr', 'lang.websitePlace'],
      captchaToastList: ['lang.codeplace', 'lang.codeErr'],
      introductList: ['lang.introductionErr_one', 'lang.introductionErr_two', 'lang.introductionErr_three'],
      account: '',
      nick: '',
      password: '',
      confirm: '',
      imgSrc: '',
      link: '',
      introduct: '',
      hasLogo: false,
      textNum: 0,
      agreeVal: false,
      postData: {
        token: '',
        file: '',
        key: ''
      },
      avatar: '',
      crop: false
    }
  },
  components: {
    CustomInput,
    ImageCrop,
    CustomButton
  },
  computed: {
    ...mapState({
      isDeveloper: state => state.vc.isDeveloper,
      coinbase: state => state.web3Instance.web3.coinbase
    })
  },
  methods: {
    ...mapMutations('vc', ['headHide', 'headShow']),
    ...mapMutations('userInfo', ['setUserInfo']),
    accountBlur: function (e) {
      let val = this.account
      let reg1 = /^\d/
      let reg2 = /^[a-zA-Z]+\d*$/
      switch (true) {
        case reg1.test(val):
          this.accountToast = this.accountToastList[0]
          this.isAccountError = true
          break
        case val.length === 0:
          this.accountToast = this.accountToastList[2]
          this.isAccountError = true
          break
        case !reg2.test(val):
          this.accountToast = this.accountToastList[1]
          this.isAccountError = true
          break
        case val.length < 6 || val.length > 18:
          this.accountToast = this.accountToastList[3]
          this.isAccountError = true
          break
        default:
          this.accountToast = ''
          this.isAccountError = false
          checkAccount(this.account).catch(err => {
            if (err.response && err.response.status === 409) {
              this.isAccountError = true
              this.accountToast = this.accountToastList[4]
            }
          })
          break
      }
    },
    accountFocus: function (e) {
      this.isAccountError = false
    },
    nickFocus: function (e) {
      this.isNickError = false
    },
    nickBlur: function (e) {
      let val = this.nick
      let reg1 = /^[a-zA-Z0-9\u4E00-\u9FA5]+$/
      switch (true) {
        case !reg1.test(val):
          this.nickToast = this.nickToastList[0]
          this.isNickError = true
          break
        case val.length < 2 || val.length > 20:
          this.nickToast = this.nickToastList[2]
          this.isNickError = true
          break
        default:
          this.nickToast = ''
          this.isNickError = false
          let that = this
          checkNickname(this.nick).then(res => {
            if (res && res.status === 409) {
              that.isNickError = true
              that.nickToast = that.nickToastList[3]
            }
          })
          break
      }
    },
    passFocus: function (e) {
      this.isPassError = false
    },
    passBlur: function (e) {
      let val = this.password
      let reg = /\s+/g
      switch (true) {
        case reg.test(val):
          this.passToast = this.passToastList[2]
          this.isPassError = true
          break
        case val.length < 6 || val.length > 12:
          this.passToast = this.passToastList[1]
          this.isPassError = true
          break
        default:
          if (this.confirm.length > 0 && this.password !== this.confirm) {
            this.isConfirmPassError = true
            break
          } else if (this.confirm.length > 0 && this.password === this.confirm) {
            this.isConfirmPassError = false
            break
          }
          this.passToast = ''
          this.isPassError = false
          break
      }
    },
    confirmPassBlur: function (e) {
      if (this.password !== this.confirm) {
        this.isConfirmPassError = true
      }
    },
    confirmPassFocus: function (e) {
      this.isConfirmPassError = false
    },
    captchaBlur: function () {
      let that = this
      if (that.captcha === that.inputCaptcha && that.captcha !== '') {
        return
      }
      if (this.inputCaptcha.length === 0) {
        that.isCaptchaError = true
        that.captchaToast = that.captchaToastList[0]
      } else if (this.inputCaptcha.length !== 4) {
        that.isCaptchaError = true
        that.captchaToast = that.captchaToastList[1]
      } else {
        that.refreshCaptcha()
      }
    },
    refreshCaptcha () {
      let that = this
      checkCaptcha(that.inputCaptcha)
        .then(() => {
          that.captcha = that.inputCaptcha
        })
        .catch((err) => {
          if (err && err.response.status === 400) {
            that.isCaptchaError = true
            that.captchaToast = that.captchaToastList[1]
            let now = new Date()
            that.captchaSrc = that.codeSrc + '?time=' + now
          }
        })
    },
    regist: function () {
      switch (true) {
        case this.account.length === 0:
          this.accountToast = this.accountToastList[2]
          this.isAccountError = true
          break
        case this.nick.length === 0:
          this.nickToast = this.nickToastList[1]
          this.isNickError = true
          break
        case this.password.length === 0:
          this.passToast = this.passToastList[0]
          this.isPassError = true
          break
        case this.confirm !== this.password:
          this.isConfirmPassError = true
          break
        case this.inputCaptcha.length === 0:
          this.isCaptchaError = true
          this.captchaToast = this.captchaToastList[0]
          break
        case !this.agreeVal:
          this.isAgreeError = true
          break
        default:
          if (this.isCaptchaError) {
            break
          }
          if (this.isDeveloper) {
            this.registDeveloper()
          } else {
            this.registCommonUser()
          }
      }
    },
    registCommonUser: function () {
      if (!this.isAccountError && !this.isNickError && !this.isPassError && !this.isConfirmPassError && !this.isCaptchaError && !this.isAgreeError) {
        let data = {
          metamask: this.coinbase,
          username: this.account,
          nickname: this.nick,
          passwd: this.password,
          passwdConfirm: this.confirm,
          avatar: this.avatar
        }
        let that = this
        registUser(data).then(res => {
          if (res.status && res.status === 201) {
            let userInfo = res.data
            that.setUserInfo(userInfo)
            that.$router.push('/')
          }
        }).catch(err => {
          if (err.response.status === 400) {
            let src = that.codeSrc
            let now = new Date()
            that.isErrorToast = true
            that.captchaSrc = src + '?time=' + now
          }
        })
      }
    },
    registDeveloper: function () {
      if (this.link.length === 0) {
        this.isLinkError = true
        this.linkToast = this.linkToastList[1]
      } else if (!this.hasLogo) {
        this.isLogoError = true
        this.logoToast = this.logoToastList[2]
      } else if (this.introduct.length === 0) {
        this.isIntroductError = true
        this.introductToast = this.introductList[2]
      } else if (this.introduct.length < 10) {
        this.isIntroductError = true
        this.introductToast = this.introductList[0]
      } else {
        if (!this.isAccountError && !this.isNickError && !this.isPassError && !this.isConfirmPassError && !this.isCaptchaError && !this.isAgreeError && !this.isLogoError && !this.isLinkError && !this.isIntroductError) {
          let data = {
            metamask: this.coinbase,
            username: this.account,
            name: this.nick,
            passwd: this.password,
            passwdConfirm: this.confirm,
            avatar: this.avatar,
            url: this.link,
            description: this.introduct
          }
          let that = this
          registEnterprise(data).then(res => {
            if (res.status && res.status === 201) {
              that.setUserInfo(res.data)
              that.$router.push('/')
            }
          }).catch(err => {
            if (err.response.status === 400) {
              let src = that.codeSrc
              let now = new Date()
              that.isErrorToast = true
              that.captchaSrc = src + '?time=' + now
            }
          })
        }
      }
    },
    descArea: function (e) {
      let val = e.target.value
      this.isIntroductError = false
      if (val.length > 500) {
        this.isIntroductError = true
        this.introductToast = this.introductList[1]
        e.target.value = val.substring(0, 500)
        return
      }
      this.textNum = val.length
    },
    agreeChange: function () {
      if (this.agreeVal) {
        this.isAgreeError = false
      }
    },
    changeCaptchaSrc: function () {
      let src = this.codeSrc
      let now = new Date()
      this.codeSrc = src + '?time=' + now
    },
    saveAvatar (data) {
      let file = data[0]
      let maxSize = 200
      let that = this
      if (!file || !window.FileReader) return
      if (file.size > maxSize * 1024) {
        that.isIconError = true
        that.iconToast = that.iconToastList[0]
        return
      }
      var reader = new FileReader()
      // 将图片将转成 base64 格式
      reader.readAsDataURL(file)
      // 读取成功后的回调
      reader.onloadend = function () {
        that.isLogoError = false
        that.logoToast = ''
        that.imgSrc = this.result
        that.hasLogo = true
        that.crop = false
      }
      getQNToken(1).then((res) => {
        if (!res) return
        let formData = new FormData()
        formData.append('token', res.data.token)
        formData.append('file', file)
        formData.append('key', res.data.key)
        uploadImg(formData).then((res) => {
          if (res && res.status === 200) {
            that.avatar = res.data.key
            that.$toast.show({
              toast: 'Success!'
            })
          }
        })
      })
    },
    changeLogo: function () {
      this.crop = true
    },
    linkFocus: function () {
      this.isLinkError = false
    },
    linkBlur: function () {
      if (this.link.length === 0) {
        this.isLinkError = true
        this.linkToast = this.linkToastList[1]
      } else if (!this.isURL(this.link)) {
        this.isLinkError = true
        this.linkToast = this.linkToastList[0]
      }
    },
    isURL: function (strUrl) {
      var strRegex = /^((https|http|ftp|rtsp|mms)?:\/\/)+[A-Za-z0-9]+.[A-Za-z0-9]+[/=?%\-&_~`@[\]':+!]*([^<>""])*$/
      var re = new RegExp(strRegex)
      return re.test(strUrl)
    }
  },
  created () {
    this.headHide()
  },
  mounted () {
    this.nameTitle = this.isDeveloper ? 'lang.studioName' : 'lang.nick'
    this.avatarTitle = this.isDeveloper ? 'lang.studioLogo' : 'lang.icon'
  },
  beforeRouteLeave (to, from, next) {
    this.headShow()
    next()
  }
}
</script>
<style type="text/css" scoped>
.wrap {
position: absolute;
margin: 0;
padding: 0;
top: 0;
left: 0;
width: 100%;
height: 100%;
}
.head {
position: fixed;
width: 100%;
height: 74px;
line-height: 74px;
background-color: #5A3EE0;
font-size: 35px;
color: #ffffff;
text-align: center;
cursor: pointer;
z-index: 999;
vertical-align: middle;
}
.head img {
width: 90px;
}
.formContent {
position: relative;
top: 74px;
width: 844px;
border: 1px solid #EDEDED;
margin: 30px auto;
}
.row {
width: 468px;
margin: 30px auto;
position: relative;
font-size: 14px;
}
.row p{
width: 100%;
font-family: Lato-Bold;
color: #333333;
text-align: left;
line-height: 17px;
margin-bottom: 10px;
letter-spacing: 0.5px;
justify-content: space-between;
}
.row textarea {
width: 100%;
height: 108px;
resize: none;
padding-left: 7px;
outline: none;
border: 1px solid #EBEBEB;
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
#codeInp {
width: 199px;
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
.agree {
 width: auto;
 line-height: 19px;
}
.agree input {
 width: 16px;
 height: 16px;
 line-height: 19px;
 vertical-align: middle;
 border-radius: 5px;
 position: absolute;
 left: 0;
 top: 3px;
}
.agree p {
 margin-left: 20px;
 font-family: Lato-Regular;
 font-size: 16px;
 line-height: 19px;
 letter-spacing: 0.67px;
 color: #666666;
 text-align: left;
}
.registBtn {
 position: relative;
 margin: 0 auto 30px;
 cursor: pointer;
}
.error {
 border: 1px solid #F55452;
}
.right {
 font-size: 12px;
 color: #999999;
 text-align: right;
 margin-left: 10px;
}
.load {
  width: 88px;
}
.loadImg {
  width: 88px;
  height: 88px;
  background-color: #F5F7F6;
  border-radius: 50%;
}
.loadBtn {
  margin-top: 10px;
}
</style>
<style type="text/css">
.alertBox {
  top: 0
}
</style>
