<template>
   <div class="infoArea" v-if = 'info && info.level === 1'>
    <button @click='modify' class="modify" v-if = 'isOwner'>{{$t('lang.change')}}</button>
    <div class="infoRow"  v-show = 'isOwner'><span class="tit">{{$t('lang.account')}}</span><p class="info">{{info.username}}</p></div>
    <div class="infoRow"><span class="tit">{{$t('lang.studioName')}}</span><p class="info">{{info.nickname}}</p></div>
    <div class="infoRow"><span class="tit">{{$t('lang.websiteLink')}}</span><p class="info">{{info.url}}</p></div>
    <div class="infoRow" v-show='isOwner'><span class="tit">{{$t('lang.address')}}</span><p class="info">{{info.metamask}}</p></div>
    <div class="infoRow"><span class="tit">{{$t('lang.studioIntroduction')}}</span><p class="info introduct">{{info.description}}</p></div>
  </div>
   <div class="infoArea" v-else-if ='info && info.level === 0'>
    <button @click='modify' class="modify" v-show = 'isOwner'>{{$t('lang.change')}}</button>
    <div class="infoRow"><span class="tit">{{$t('lang.account')}}</span><p class="info">{{info.username}}</p></div>
    <div class="infoRow"><span class="tit">{{$t('lang.nick')}}</span><p class="info">{{info.nickname}}</p></div>
    <div class="infoRow"><span class="tit">{{$t('lang.address')}}</span><p class="info">{{info.metamask}}</p></div>
  </div>
</template>
<script type="text/javascript">
import {mapState, mapMutations} from 'vuex'
import {getUser} from '../../util/axios.js'
export default {
  data () {
    return {
      info: {},
      userId: '',
      isOwner: false
    }
  },
  computed: {
    ...mapState({
      user: state => state.userInfo.user
    })
  },
  mounted () {
    this.getUser()
  },
  methods: {
    ...mapMutations('userInfo', ['setUserInfo']),
    modify () {
      this.$router.push({name: 'UserInfoEdit', params: {userId: this.userId}})
    },
    getUser () {
      this.userId = this.$route.params['userId']
      if (this.user && this.userId && this.userId.toString() === this.user.userId.toString()) {
        this.isOwner = true
      }
      getUser(this.userId).then(res => {
        if (res && res.status === 200) {
          this.info = res.data
        }
      })
    }
  },
  watch: {
    '$route': function () {
      this.getUser()
    }
  }
}
</script>
<style type="text/css" scoped>
.infoArea {
  max-width: 984px;
  height: auto;
  background: #ffffff;
  margin: 20px auto 0;
  padding: 30px;
}
.infoRow {
  margin-top: 20px;
}
.tit {
  font-family: Lato-Bold;
  font-size: 14px;
  color: #999999;
  height: 17px;
  line-height: 17px;
}
.introduct {
  height: auto;
}
.info {
  height: 17px;
  line-height: 17px;
  color: #333333;
  font-size: 14px;
  margin-top: 10px;
}
.modify {
  width: auto;
  padding: 0 10px;
  height: 36px;
  font-size: 14px;
  letter-spacing: 0.5px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background-color: #6D64FB;
}
.modify:hover {
  background: #5b54d4;
}
</style>
