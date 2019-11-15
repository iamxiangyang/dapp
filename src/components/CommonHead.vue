<template>
  <div id='commonHead'>
    <div class="header">
      <div class="logo">
        <router-link  to = '/'><img src="../assets/img/logo.png" alt="logo"></router-link>
      </div>
      <ul class="navMenu">
        <li class="dropdown" >
          <router-link  to = '/' @click='select = "dapp"'><span :class='{"selected": select === "dapp"}'>DAPP</span></router-link>
        </li>
        <li>
          <router-link  to = '/data' @click='select = "data"'><span :class='{"selected": select === "data"}'>{{$t('lang.data')}}</span></router-link>
        </li>
        <li ><router-link to = '/community' @click='select = "community"'><span :class='{"selected": select === "community"}'>{{$t('lang.community')}}</span></router-link></li>
        <li @click='select = "recharge"'><router-link to = '/recharge' @click='select = "recharge"'><span :class='{"selected": select === "recharge"}'>{{$t('lang.recharge')}}</span></router-link></li>
        <li ><router-link to = '/wallet' @click='select = "wallet"'><span :class='{"selected": select === "wallet"}'>{{$t('lang.wallet')}}</span></router-link></li>
<!--         <li ><router-link to = '/about' @click='select = "about"'><span :class='{"selected": select === "about"}'>{{$t('lang.about')}}</span></router-link></li>
 -->  </ul>
      <div class='rightBox'>
      <ul class="navTool">
        <li v-show='!isLogined' class="btnBox"><a class="login" @click='login'>{{$t('lang.login')}}</a><a class="regist" @click='regist'>{{$t('lang.regist')}}</a></li>
        <li v-show='isLogined'  @mouseenter='isUp = true' @mouseleave='isUp = false' class="dropdown">
          <p class="nick"><span>{{isLogined ? userInfo.nickname || userInfo.name : ''}}</span><Icon type="ios-arrow-down" class='arrow' size='15' :class= 'isUp === true ? "rotateUp" : "rotateDown"'></Icon></p>
          <div class="dropdownContent" :class = {others:isHeadshow}  v-show='isUp'>
            <p class="Content"><a @click='toUserInfo'>{{$t('lang.userinfo')}}</a></p>
            <p class="Content" v-if='isDeveloper'><a @click='myPublished'>{{$t('lang.published')}}</a></p>
            <p class="Content"><a @click='myComment'>{{$t('lang.comments')}}</a></p>
            <p class="Content"><a @click='topic'>{{$t('lang.topics')}}</a></p>
            <p class="Content"><a @click='changePassWord'>{{$t('lang.changePwd')}}</a></p>
            <p class="Content"><a @click='notification'>{{$t('lang.news')}}&nbsp;&nbsp;<Badge status="error" v-show='hasDots'/></a></p>
            <p class="Content"><a @click='logOut'>{{$t('lang.logout')}}</a></p>
          </div>
        </li>
        <li @click='upload'><img src="../assets/img/upload.png" alt="upload" width="30px" height="30px"></li>
      </ul>
      <Select class='languageChoice' :options='options' :default='language' @valueChanged='langChanged' type='language' :lang='lang'>
      </Select>
      <div class='navicon' @touchstart='menuShow' @click='menuShow'>
        <Icon type="ios-menu-outline" size='20' color='#FFFFFF' style='margin-right: 5px'></Icon>
        {{$t('lang.menu')}}
      </div>
     </div>
    </div>
    <div class='cover' v-show='isHeadshow'></div>
    <CustomRightMenu v-show = 'isPhone' :hasDots='hasDots' v-on:login='login' v-on:toUserInfo='toUserInfo' v-on:myComment='myComment' v-on:topic='myTopic' v-on:myPublished='myPublished' v-on:news='notification' v-on:changePassWord='changePassWord' v-on:logOut='logOut' v-on:upload='upload'></CustomRightMenu>
    <RegistAlert v-if='isShowRegistAlert'></RegistAlert>
    <LoginAlert v-if='showLogin' v-on:hide='hideAlert' toast='lang.login_upload'></LoginAlert>
    <MetaMaskAlert v-if='noMatch' v-on:hide='hidePassAlert' v-on:switch='switchAddress' :metamask='userInfo && userInfo.metamask'></MetaMaskAlert>
  </div>
</template>
<script>
import {Option, Icon, Badge} from 'iview'
import Select from './MySelect.vue'
import CustomRightMenu from './CustomRightMenu.vue'
import {mapState, mapMutations, mapGetters} from 'vuex'
import RegistAlert from './RegistAlert.vue'
import LoginAlert from './LoginAlert.vue'
import MetaMaskAlert from './MetaMaskAlert.vue'
import {logout, notificationsNum} from '../util/axios.js'
export default {
  name: 'CommonHead',
  data () {
    return {
      showLogin: false,
      isUp: false,
      noMatch: false,
      hasDots: false,
      select: 'dapp',
      options: [{value: 'EN'}, {value: 'CN'}, {value: 'JA'}, {value: 'KO'}, {value: 'RU'}, {value: 'IR'}, {value: 'AR'}],
      lang: 'EN'
    }
  },
  computed: {
    ...mapState({
      isHeadshow: state => state.vc.isHeadShow,
      isPhone: state => state.vc.isMenuShow,
      web3: state => state.web3Instance.web3,
      isShowRegistAlert: state => state.vc.isShowRegistAlert,
      isBindedMetaMask: state => state.web3Instance.isBindedMetaMask,
      isDeveloper: state => state.userInfo.user && state.userInfo.user.level === 1,
      userInfo: state => state.userInfo.user,
      language: state => state.vc.language

    }),
    ...mapGetters('userInfo', ['isLogined'])
  },
  methods: {
    ...mapMutations('vc', ['menuHide', 'menuShow', 'hideLoginMetaMask', 'showLoginMetaMask', 'setLanguage', 'changeDappType']),
    ...mapMutations('web3Instance', ['registerWeb3Instance', 'checkIsBinded']),
    ...mapMutations('userInfo', ['cleanUserInfo']),
    regist () {
      let that = this
      that.registerWeb3Instance((web3) => {
        if (!web3) {
          that.$toast.show({
            toast: that.$t('lang.installToast'),
            time: 2000
          })
          that.$router.push('/wallet')
          return
        }
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
    login () {
      let that = this
      that.registerWeb3Instance((web3) => {
        if (!web3) {
          that.$toast.show({
            toast: that.$t('lang.installToast'),
            time: 2000
          })
          that.$router.push('/wallet')
          return
        }
        if (that.web3.coinbase) {
          that.checkIsBinded(() => {
            if (that.isBindedMetaMask) {
              that.$router.push({path: '/login'})
            } else {
              that.$router.push({path: '/registType'})
            }
          })
        } else {
          that.$router.push({path: '/login'})
        }
      })
    },
    notification () {
      this.hasDots = false
      this.$router.push('/news')
    },
    logOut () {
      let that = this
      logout().then(function (res) {
        if (res && res.status === 201) {
          that.cleanUserInfo()
          that.$router.push('/')
        }
      })
    },
    upload () {
      let that = this
      if (that.userInfo) {
        if (that.isDeveloper) {
          that.registerWeb3Instance((web3) => {
            if (!web3) {
              that.$toast.show({
                toast: that.$t('lang.installToast'),
                time: 2000
              })
              that.$router.push('/wallet')
              return
            }
            // metamask 地址是否与绑定的一致
            if (that.web3.coinbase !== that.userInfo.metamask) {
              that.noMatch = true
            } else {
              that.$router.push({name: 'Upload'})
            }
          })
        } else {
          that.$toast.show({
            toast: that.$t('lang.canUpload')
          })
        }
      } else {
        that.showLogin = true
      }
    },
    hideAlert () {
      this.showLogin = false
    },
    changePassWord () {
      let that = this
      that.registerWeb3Instance(() => {
        if (that.web3.coinbase !== that.userInfo.metamask) {
          that.noMatch = true
        } else {
          that.$router.push('/passwordChanged')
        }
      })
    },
    switchAddress () {
      let that = this
      that.registerWeb3Instance(() => {
        if (that.web3.coinbase === that.userInfo.metamask) {
          that.$router.push('/passwordChanged')
        }
      })
    },
    hidePassAlert () {
      this.noMatch = false
    },
    toUserInfo () {
      this.$router.push({name: 'Info', params: {userId: this.userInfo.userId}})
    },
    myComment () {
      this.$router.push({name: 'Comment', params: {userId: this.userInfo.userId}})
    },
    myTopic () {
      this.$router.push({name: 'Topic', params: {userId: this.userInfo.userId}})
    },
    myPublished () {
      this.$router.push({name: 'Published', params: {userId: this.userInfo.userId}})
    },
    topic () {
      this.$router.push({name: 'Topic', params: {userId: this.userInfo.userId}})
    },
    langChanged (value) {
      this.lang = value
      this.setLanguage(value)
      switch (value) {
        case 'CN':
          this.$i18n.locale = 'zh-CN'
          break
        case 'EN':
          this.$i18n.locale = 'en-US'
          break
        case 'JA':
          this.$i18n.locale = 'ja-JA'
          break
        case 'KO':
          this.$i18n.locale = 'ko-KO'
          break
        case 'RU':
          this.$i18n.locale = 'ru-RU'
          break
        case 'IR':
          this.$i18n.locale = 'ir-IR'
          break
        case 'AR':
          this.$i18n.locale = 'ar-AR'
          break
        default:
          this.$i18n.locale = 'en-US'
          break
      }
    },
    toDapp () {
      this.select = 'dapp'
    },
    getNotifications () {
      if (this.userInfo) {
        notificationsNum().then(res => {
          if (res && res.status === 200) {
            let allDots = res.data['total']
            if (allDots > 0) {
              this.hasDots = true
            }
          }
        })
      }
    }
  },
  mounted () {
    let that = this
    that.langChanged(that.language)
    window.eventBus.$on('resize', function (w) {
      if (w > 1080) {
        that.menuHide()
      }
    })
    that.getNotifications()
  },
  watch: {
    $route: function (to, from) {
      switch (to.name) {
        case 'Home':
          this.select = 'dapp'
          break
        case 'Data':
          this.select = 'data'
          break
        case 'Community':
          this.select = 'community'
          break
        case 'Recharge':
          this.select = 'recharge'
          break
        case 'Wallet':
          this.select = 'wallet'
          break
        case 'AboutUs':
          this.select = 'about'
          break
        default:
          this.select = from
          break
      }
      this.getNotifications()
    },
    language: function (val) {
      this.langChanged(val)
    }
  },
  components: {
    Select,
    Option,
    Icon,
    Badge,
    CustomRightMenu,
    RegistAlert,
    LoginAlert,
    MetaMaskAlert
  }
}
</script>

<style scoped>
.header {
  width: 100%;
  height: 74px;
  color: #a7a7a7;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 200;
  display: flex;
  justify-content: space-between;
  align-items:center;
}
.cover {
  width: 100%;
  height: 74px;
  position: fixed;
  margin: 0;
  top: 0;
  left: 0;
  z-index: 100;
  background-color: #5A3EE0;
 }
.logo {
  position: relative;
  width: 90px;
  margin-left: 50px;
}
.logo img {
  width: 90px;
}
.navMenu {
  position: relative;
  min-width: 556px;
  display: flex;
  justify-content: center;
  font-size: 16px;
  text-align: center;
}
.dropdown {
  position: relative;
}
.dropdownContent {
  padding: 15px 0;
  width: 100%;
  position: absolute;
  top: 54px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  left: 0;
  z-index: 300;
  background-color: #5A3EE0;
}
.catagory {
  margin-left: 30px;
}
.others {
  background-color: #5A3EE0;
}
.dropdownContent p {
  height: 36px;
  line-height: 36px;
  text-align: left;
  padding-left: 20px;
  font-family: Lato-Regular;
  font-size: 14px;
  color: #FFFFFF;
  letter-spacing: 0.5px;
}
.dropdownContent p:hover {
  background: rgba(255,255,255,0.1);
}

.selected {
  color: #5BC7CB;
}
.navMenu li {
  padding: 0 20px;
  color: #fff;
  line-height: 82px;
  float: left;
}
.rightBox {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.languageChoice {
  width: 100px;
  height: 30px;
  border-radius: 8px;
  margin-right: 60px;
  background-color: rgba(0,0,0,0);
}
.navTool {
  min-width: 230px;
  height: 100%;
}
.navTool li {
  float: right;
  margin-right: 15px;
  text-align: center;
  line-height: 74px;
  font-family: MicrosoftYaHeiUI;
  font-size: 14px;
  color: #FFFFFF;
  letter-spacing: 0.5px;
  cursor: pointer;
}
.navTool .dropdownContent {
  width: 170px;
  float: left;
  left: -80px;
}
.nick {
  max-width: 170px;
  float: right;
}
.nick span {
  width: 80px;
  text-align: right;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.navTool li img {
  margin-top: 24px;
}
a {
  color: #fff;
  text-decoration: none;
  display: block;
  word-break: keep-all;
  white-space: nowrap;
}
.login {
  min-width: 53px;
  margin-right: 10px;
  height: 15px;
  display: inline-block;
}
.regist {
  min-width: 53px;
  height: 15px;
  display: inline-block;
}
.login:hover,.regist:hover {
  color: #5BC7CB;
}
.btnBox {
  float: right;
}
.navMenu li a:hover span {
  color: #5BC7CB;
}
.Content a {
  color: #ffffff;
  border-bottom: none;
}
.navicon {
  justify-content: center;
  align-items: center;
  width: 65px;
  color: #ffffff;
  display: none;
  cursor: pointer;
}
.arrow {
  width: 20px;
  color: #ffffff;
}
.rotateUp {
  animation: myrotate 0.3s;
  animation-fill-mode: forwards;
}
.rotateDown {
  animation: myDownRotate 0.3s;
  animation-fill-mode: forwards;
}
@keyframes myrotate {
  from {transform: rotate(0deg)}
  to {transform: rotate(180deg)}
}
@keyframes myDownRotate {
  from {transform: rotate(180deg)}
  to {transform: rotate(0deg)}
}
@media screen and (min-width: 1080px)  and (max-width: 1300px) {
  .header {
    min-width: 1300px;
  }
}
@media screen and (max-width: 1080px) {
  .rightBox {
    margin-right: 20px;
  }
  .navMenu {
    display: none;
  }
  .navicon {
    display: flex;
  }
   .languageChoice {
    display: none;
  }
}

@media screen and (max-width: 650px) {
  .navTool {
    display: none;
  }
  .rightBox {
    margin-right:30px;
    min-width:65px;
    width: 65px;
  }
.navMenu li a:hover span {
  color: #5BC7CB;
}
.Content a {
  color: #fff;
  border-bottom: none;
}
.navMenu .active {
  color: #fff;
}
.navMenu li a .active {
  color: #fff;
}
}
</style>
<style type="text/css">
.languageChoice .inputWrapper {
  border: none !important;
  background: rgba(255,255,255,0.1);
}
.languageChoice .inputWrapper input {
  color: #fff !important;
}
.languageChoice .options {
  background: #5A3EE0 !important;
  border: none !important;
}
.languageChoice .options li {
  color: #FFFFFF !important;
}
.languageChoice .options li:hover {
  background-color: rgba(255,255,255,0.1) !important;
}
</style>
