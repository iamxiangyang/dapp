<template>
 <div class='wrap'>
   <div class="rightMenu">
     <header class='head'>
       <span class='language' @click='langChanged(true)'>
         <img :src="country" width="18px" height="18px">
       </span>
       <p class='rightHead'>
       <a @click='upload' class="profile upload"><img src="../assets/img/upload.png" alt="upload" width="30px" height="30px"></a>
       <a><img src="../assets/img/close.png" width="16px" height="16px" @touchstart='menuHide' @click='menuHide'/></a>
       </p>
     </header>
    <ul class="navMenu">
      <li @click='login' v-show='!isLogined' class="profile"><span>{{$t('lang.login_regist')}}</span></li>
      <li class="dropdown profile" v-show='isLogined' @click='showUserList'>
        <a><span :class='{active: isUp}'>{{isLogined ? user.nickname : 'unknown'}}</span>
        <Icon type="ios-arrow-down" class='arrow' size='20' :class='userArrow'></Icon></a>
        <div class="dropdownContent" v-show='isUp'>
          <p class="Content"><a @click='toUserInfo'>{{$t('lang.userinfo')}}</a></p>
          <p class="Content" v-if='isDeveloper'><a @click='myPublished'>{{$t('lang.published')}}</a></p>
          <p class="Content"><a @click='myComment'>{{$t('lang.comments')}}</a></p>
          <p class="Content"><a @click='topic'>{{$t('lang.topics')}}</a></p>
          <p class="Content"><a @click='changePassWord'>{{$t('lang.changePwd')}}</a></p>
          <p class="Content"><a @click='news'><Badge status="error" v-show='hasDots'/>{{$t('lang.news')}}</a></p>
          <p class="Content"><a @click='logOut'>{{$t('lang.logout')}}</a></p>
        </div>
      </li>
      <li class="dropdown" @touchstart='showContent' @click = 'showContent'>
      <router-link class="apply" to = '/' >
        <span :class='{active: isShowContent}'>Dapp</span>
        <Icon type="ios-arrow-down" class='arrow' size='20' :class='dappArrow'></Icon>
      </router-link>
      <div class="dropdownContent" v-show = 'isShowContent'>
        <p class="Content"><router-link :to = '{ name: "Application"}'>{{$t('lang.all')}}</router-link></p>
        <p class="Content"><router-link :to = '{ name: "Games", params: {path: "catagory/1"} }'>{{$t('lang.games')}}</router-link></p>
        <p class="Content"><router-link :to = '{ name: "Exchanges", params: {path: "catagory/2"} }'>{{$t('lang.exchanges')}}</router-link></p>
        <p class="Content"><router-link :to = '{ name: "Luckydraw", params: {path: "catagory/3"} }'>{{$t('lang.luckydraw')}}</router-link></p>
        <p class="Content"><router-link :to = '{ name: "Others", params: {path: "catagory/4"} }'>{{$t('lang.others')}}</router-link></p>
      </div>
      </li>
      <li><router-link to = '/data'><span>{{$t('lang.data')}}</span></router-link></li>
      <li><router-link to = '/community'><span>{{$t('lang.community')}}</span></router-link></li>
      <li><router-link to = '/recharge'><span>{{$t('lang.recharge')}}</span></router-link></li>
      <li><router-link to = '/wallet'><span>{{$t('lang.wallet')}}</span></router-link></li>
    </ul>
    </div>
    <div class='cover'></div>
  </div>
</template>
<script type="text/javascript">
import {mapMutations, mapState, mapGetters} from 'vuex'
import {Icon, Badge} from 'iview'
const UP = 'rotateUp'
const DOWN = 'rotateDown'
const COUNTRIES = {'EN': require('../assets/img/countries/EN.png'), 'CN': require('../assets/img/countries/CN.png'), 'JA': require('../assets/img/countries/JA.png'), 'KO': require('../assets/img/countries/KO.png'), 'RU': require('../assets/img/countries/RU.png')}
export default {
  name: 'CustomRightMenu',
  data () {
    return {
      isShowContent: false,
      isRegisted: false,
      isUp: false,
      userArrow: '',
      dappArrow: '',
      country: ''
    }
  },
  props: {
    hasDots: {
      type: Boolean
    }
  },
  components: {
    Icon,
    Badge
  },
  computed: {
    ...mapState({
      web3: state => state.web3Instance.web3,
      user: state => state.userInfo.user,
      isDeveloper: state => state.userInfo.user && state.userInfo.user.level === 1,
      language: state => state.vc.language
    }),
    ...mapGetters('userInfo', ['isLogined'])
  },
  watch: {
    language: function (val) {
      this.country = COUNTRIES[val]
    }
  },
  mounted () {
    this.country = COUNTRIES[this.language]
  },
  methods: {
    ...mapMutations('vc', ['menuHide', 'showLoginMetaMask', 'setLanguage']),
    ...mapMutations('web3Instance', ['registerWeb3Instance']),
    showContent () {
      this.isShowContent = !this.isShowContent
      this.dappArrow = this.isShowContent ? UP : DOWN
    },
    showUserList () {
      this.isUp = !this.isUp
      this.userArrow = this.isUp ? UP : DOWN
    },
    upload () {
      this.$emit('upload')
    },
    login () {
      this.$emit('login')
    },
    toUserInfo () {
      this.$emit('toUserInfo')
    },
    myComment () {
      this.$emit('myComment')
    },
    topic () {
      this.$emit('topic')
    },
    myPublished () {
      this.$emit('myPublished')
    },
    changePassWord () {
      this.$emit('changePassWord')
    },
    news () {
      this.$emit('news')
    },
    logOut () {
      this.$emit('logOut')
    },
    langChanged (e) {
      let value = this.language
      switch (value) {
        case 'CN':
          this.country = COUNTRIES['EN']
          this.setLanguage('EN')
          this.$i18n.locale = 'en-US'
          break
        case 'EN':
          this.country = COUNTRIES['JA']
          this.setLanguage('JA')
          this.$i18n.locale = 'ja-JA'
          break
        case 'JA':
          this.country = COUNTRIES['KO']
          this.setLanguage('KO')
          this.$i18n.locale = 'ko-KO'
          break
        case 'KO':
          this.country = COUNTRIES['RU']
          this.setLanguage('RU')
          this.$i18n.locale = 'ru-RU'
          break
        case 'RU':
          this.country = COUNTRIES['CN']
          this.setLanguage('CN')
          this.$i18n.locale = 'zh-CN'
          break
        default:
          this.country = COUNTRIES['EN']
          this.setLanguage('EN')
          this.$i18n.locale = 'en-US'
          break
      }
    }
  }
}
</script>
<style type="text/css" scoped>
.cover {
  position: fixed;
  background-color: rgba(0,0,0,0.75);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 300;
}
.rightMenu {
  width: 283px;
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  background-color: #5A3EE0;
  z-index: 400;
}
.head {
  width: 100%;
  margin-top: 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  cursor: pointer;
}
.head>span{
  font-size: 14px;
  font-family: Lato-Regular;
  color: #ffffff;
  text-decoration: underline;
}
.head .rightHead a{
  margin-left: 30px;
}
.navMenu {
  margin-top: 50px;
  margin-left: 60px;
  height: auto;
}
.navMenu li {
  text-align: left;
  min-width: 134px;
  margin-bottom: 40px;
  cursor: pointer;
}
.navMenu li span{
  font-size: 16px;
  font-family: Lato-Regular;
  color: #ffffff;
  text-decoration: none;
}
.dropdown {
  position: relative;
  cursor: pointer;
}
.dropdownContent {
  position: relative;
  left: 20px;
}
.dropdownContent p {
  margin-top: 20px;
}
.dropdownContent p a{
  height: 14px;
  line-height: 14px;
  text-align: left;
  font-family: Lato-Regular;
  font-size: 14px;
  color: #FFFFFF;
  letter-spacing: 0.5px;
}
.active {
  color: #5BC7CB !important;
}
.navMenu li:hover span {
  color: #5BC7CB;
}
.navMenu li:hover .arrow {
  color: #5BC7CB;
}
.dropdownContent .Content a:hover {
  color: #5BC7CB;
}
.down {
  width: 12px;
  height: 12px;
  margin-left: 5px;
}
.up {
  transform: rotateX(180deg);
}
.login {
  width: 169px;
  height: 40px;
  line-height: 40px;
  font-family: Lato-Regular;
  font-size: 12px;
  color: #ffffff;
  letter-spacing: 0.5px;
  margin: 24px auto;
  cursor: pointer;
}
.regist {
  width: 96px;
  height: 36px;
  line-height: 36px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  font-family: Lato-Regular;
  font-size: 12px;
  color: #ffffff;
  border-radius: 8px;
  letter-spacing: 0.5px;
  margin:100px auto 0;
  cursor: pointer;
}
.arrow {
  width: 20px;
  color: #ffffff;
  text-align: center;
}
.rotateUp {
  color: #5BC7CB;
  animation: myrotates 0.3s;
  animation-fill-mode: forwards;
}
.rotateDown {
  animation: myDownRotates 0.3s;
  animation-fill-mode: forwards;
}
@keyframes myrotates {
  from {transform: rotate(0deg)}
  to {transform: rotate(180deg)}
}
@keyframes myDownRotates {
  from {transform: rotate(180deg)}
  to {transform: rotate(0deg)}
}
@media screen and (max-width: 1080px) {
  .upload {
    display: none;
  }
}
@media screen and (max-width: 650px) {
  .upload {
    display: inline-block;
  }
}
</style>
