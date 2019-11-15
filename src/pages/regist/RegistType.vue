<template>
<div class='wrap'>
  <header class="head">
  <img src="../../assets/img/logo.png" @click='toHome'>
  </header>
  <div class = 'registBox'>
    <p class='tit'>{{$t('lang.registNew')}}</p>
    <div class='btnList'>
      <button class='developBtn' v-bind:class='{selected:isDev}' @mouseover='isDev = true' @mouseout='isDev = false' @click='toDev'>{{$t('lang.regist_dev')}}</button>
      <button class='userBtn' v-bind:class='{selected:isUser}' @mouseover='isUser = true' @mouseout='isUser = false' @click='toUser'>{{$t('lang.regist_reg')}}</button>
    </div>
    <div class='warning'>{{$t('lang.canUpload')}}</div>
    <div class='info'>
      <p>{{$t('lang.metamask_use')}} {{coinbase}}</p>
      <p>{{$t('lang.metamask_login')}}</p>
    </div>
    <div class='login' @click='loginAccount'>
      {{$t('lang.hasAccount')}}
    </div>
  </div>
</div>
</template>
<script type="text/javascript">
import {mapMutations, mapState} from 'vuex'
export default {
  name: 'RegistType',
  data () {
    return {
      isDev: false,
      isUser: false
    }
  },
  computed: {
    ...mapState({
      coinbase: state => state.web3Instance.web3.coinbase
    })
  },
  created () {
    this.headHide()
  },
  methods: {
    ...mapMutations('vc', ['headHide', 'headShow', 'developerRegist', 'userRegist']),
    toDev () {
      this.developerRegist()
      this.$router.push({path: '/regist'})
    },
    toUser () {
      this.userRegist()
      this.$router.push({path: '/regist'})
    },
    loginAccount () {
      this.$router.push('/login')
    },
    toHome () {
      this.$router.push({path: '/'})
    }
  },
  beforeRouteLeave (to, from, next) {
    this.headShow()
    next()
  }
}
</script>

<style type="text/css" scoped>
.wrap {
  width: 100%;
  height: 100%;
  background: #F5F7F6;
  position: fixed;
}
.head {
  width: 100%;
  height: 74px;
  line-height: 74px;
  background-color: #5A3EE0;
  font-size: 35px;
  color: #ffffff;
  text-align: center;
}
.head a {
  vertical-align: middle;
}
.head img{
  width: 90px;
}
.head img:hover {
  cursor: pointer;
}
.registBox {
  width: 615px;
  height: auto;
  background-color: #ffffff;
  margin: 30px auto;
  padding:30px 0 40px;
}
.tit {
  position: relative;
  font-family: Lato-Regular;
  font-size: 28px;
  color: #000000;
  height: 34px;
  line-height: 34px;
}
.btnList {
  width: 100%;
  height: 55px;
  margin-top: 30px;
}
.btnList button {
  width: 212px;
  height: 55px;
  font-family: Lato-Regular;
  font-size: 18px;
  letter-spacing: 0.5px;
  border-radius: 15px;
}
.developBtn {
  margin-right: 10px;
  border: 1px solid #EBEBEB;
  color: #333333;
}
.userBtn {
  margin-left: 10px;
  border: 1px solid #EBEBEB;
  color: #333333;
}
.warning {
  margin-top: 8px;
  margin-left: 93px;
  text-align: left;
  font-size: 14px;
  font-family: Lato-Regular;
  color: #999;
  letter-spacing: 0.33px;
}

.info {
  width: 549px;
  margin: 65px auto;
  text-align: left;
  word-break: break-word;
}
.info p {
  font-family: Lato-Regular;
  font-size: 14px;
  color: #666666;
  letter-spacing: 0.5px;
  line-height: 25px;
}

.login {
  width: 184px;
  height: 17px;
  margin: 45px auto 0;
  font-family: Lato-Regular;
  font-size: 14px;
  color: #5BC7CB;
  letter-spacing: 0.5px;
  cursor: pointer;
  text-decoration: underline;
}
.login:hover {
  color: #4FAEB1;
}
.selected {
  border: 1px solid #6531E9;
  color: #6531E9;
}
</style>
