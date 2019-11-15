<template>
<Scroll :on-reach-bottom="handleReachBottom" height=900 :loading-text ='$t(loadingText)' class="wrap" :showLoading='isShowLoad' @wheel='handelScroll'>
  <header>
      <div class="headBox"><img :src="headImg"><p>{{nick}}</p></div>
  </header>
  <div class="whiteArea">
    <!-- 开发者 -->
    <div class="itemBox" v-if='isDeveloper'>
      <div class='optionItem infoItem' :class= '{selected:selected === "published" || selected === 0}' @click='showPublishedDapp'><p>{{$t('lang.published')}}</p><div v-show='selected === "published" || selected === 0'></div></div>
      <div class='optionItem commentItem' :class= '{selected:selected === "info"}' @click='showDeveloper'><p>{{$t('lang.userinfo')}}</p><div v-show='selected === "info"'></div></div>
      <div class='optionItem commentItem' :class= '{selected:selected === "comment"}' @click='showDeveloperComment'><p>{{$t('lang.myComments')}}</p><div v-show='selected === "comment"'></div></div>
      <div class='optionItem commentItem' :class= '{selected:selected === "topic"}' @click='showTopics'><p>{{$t('lang.topics')}}</p><div v-show='selected === "topic"'></div></div>
    </div>
    <!-- 普通用户 -->
    <div class="itemBox" v-else>
      <div v-show='isOwner' class='optionItem infoItem' :class= '{selected:selected === "info" || selected === 0}' @click='showInfo' ><p>{{$t('lang.userinfo')}}</p><div v-show='selected === "info" || selected === 0'></div></div>
      <div class='optionItem commentItem' :class= '{selected:selected === "comment"}' @click='showComment'><p>{{$t('lang.myComments')}}</p><div v-show='selected === "comment"'></div></div>
      <div class='optionItem commentItem' :class= '{selected:selected === "topic"}' @click='showTopics'><p>{{$t('lang.topics')}}</p><div v-show='selected === "topic"'></div></div>
    </div>
  </div>
  <router-view></router-view>

</Scroll>
</template>
<script type="text/javascript">
import {mapState, mapMutations} from 'vuex'
import {getUser} from '../../util/axios.js'
import Scroll from '../../common/scroll/scroll.vue'
export default {
  data () {
    return {
      nick: '',
      selected: 0,
      headImg: require('../../assets/img/head.png'),
      hasChange: false,
      userId: '',
      isDeveloper: false,
      isOwner: false
    }
  },
  components: {
    Scroll
  },
  computed: {
    ...mapState({
      user: state => state.userInfo.user,
      loadingText: state => state.vc.loadingText || 'lang.loadmore',
      isShowLoad: state => state.vc.isShowLoad
    })
  },
  mounted () {
    this.setSelected()
    this.userId = this.$route.params['userId']
    this.getUserInfo()
  },
  watch: {
    '$route': function (newv, old) {
      this.userId = newv.params['userId']
      this.getUserInfo()
      this.setSelected()
    }
  },
  methods: {
    ...mapMutations('vc', ['setLoadText', 'showLoad']),
    ...mapMutations('userInfo', ['setUserInfo']),
    handelScroll () {
      window.eventBus.$emit('scroll', event)
    },
    getUserInfo () {
      if (!this.userId && !this.user) {
        return
      }
      if (this.user && this.userId && this.userId.toString() === this.user.userId.toString()) {
        this.isOwner = true
      }
      let userID = this.userId || this.user.userId
      getUser(userID).then(res => {
        if (res && res.status === 200) {
          this.nick = res.data.nickname
          this.headImg = res.data.avatar
          this.isDeveloper = res.data.level === 1
        }
      })
    },
    setSelected () {
      switch (this.$route.name) {
        case 'Info':
          this.selected = 'info'
          break
        case 'Comment':
          this.selected = 'comment'
          break
        case 'Published':
          this.selected = 'published'
          break
        case 'Topic':
          this.selected = 'topic'
          break
        default:
          this.selected = this.isDeveloper ? 'published' : 'comment'
          break
      }
    },
    handleReachBottom () {
      if (this.$route.name === 'Comment' || this.$route.name === 'Published') {
        return new Promise(resolve => {
          this.setLoadText('lang.loadmore')
          setTimeout(() => {
            window.eventBus.$emit('loadMore')
            resolve()
          }, 500)
        })
      }
    },
    showInfo () {
      this.$router.push({name: 'Info', params: {userId: this.userId || this.user.userId}})
    },
    showComment () {
      this.$router.push({name: 'Comment', params: {userId: this.userId || this.user.userId}})
    },
    showPublishedDapp () {
      this.$router.push({name: 'Published', params: {userId: this.userId || this.user.userId}})
    },
    showDeveloper () {
      this.$router.push({name: 'Info', params: {userId: this.userId || this.user.userId}})
    },
    showDeveloperComment () {
      this.$router.push({name: 'Comment', params: {userId: this.userId || this.user.userId}})
    },
    showTopics () {
      this.$router.push({name: 'Topic', params: {userId: this.userId || this.user.userId}})
    }
  }
}
</script>
<style type="text/css" scoped>
.wrap {
  font-family: Lato-Regular;
  letter-spacing: 0.5px;
  text-align: left;
  background: rgba(245, 247, 246, 1);
  width: 100%;
  top: 74px;
  left: 0;
  right: 0;
  margin: 0;
  padding-bottom: 40px;
  min-width: 705px;
  position: absolute;
  overflow-x: hidden;
}
header {
  width: 100%;
  height: 168px;
  background-image: url('../../assets/img/userBackground.png');
  background-size: contain;
  margin: 0;
  padding-top: 123px;
}
.headBox {
  margin: 0 auto;
  min-width: 88px;
}
.headBox img {
  width: 88px;
  height: 88px;
  margin: 0 auto;
  display: block;
  border-radius: 50%;
}
.headBox p {
  font-size: 22px;
  font-weight: bold;
  color: #333333;
  margin-top: 10px;
  text-align: center;
  height: 27px;
  line-height: 27px;
}
.contentBox {
  width: 100%;
  height: auto;
  overflow: auto;
}
.whiteArea {
  width: 100%;
  height: 150px;
  background: #ffffff;
  padding-top: 120px;
}
.itemBox {
  height: auto;
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
}
.optionItem {
  font-size: 16px;
  color: #8590A6;
  height: 30px;
  min-width: 100px;
  text-overflow: ellipsis;
  white-space:nowrap;
  text-align: center;
  cursor: default;
}
.selected {
  color: #6D64FB;
}
.optionItem:hover {
  color: #6D64FB;
  cursor: pointer;
}
.optionItem div {
  width: 21px;
  height: 4px;
  margin: 0 auto;
  background: #6D64FB;
  border-radius: 2px;
}
.commentItem {
  padding-left: 50px;
  padding-right: 50px;
  min-width: 100px;
}
</style>
<style type="text/css">
.wrap .ivu-scroll-loader {
  height: 0;
}
</style>
