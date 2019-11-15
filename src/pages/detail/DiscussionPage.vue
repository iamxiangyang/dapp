<template>
  <div>
    <div class="userComment">
      <p class="commentIcon" @click='topicsVisible'>
      <span><i class="icon iconfont icon-Write"></i><span style="margin-left: 10px;">{{$t('lang.writeTopic')}}</span></span>
      </p>
      <span class="commentSort">
        <mySelect v-on:valueChanged='sortChanged'></mySelect>
      </span>
    </div>
    <div v-for='disc in tops' :key='disc.articleId' v-if = 'tops.length > 0' class='row'>
      <Discussion :info='disc' type = 'top' v-on:refreshList = 'refreshList'></Discussion>
    </div>
    <div v-for='(disc, index) in datas' :key='index' v-if = 'datas.length > 0' class='row'>
      <Discussion :info='disc' v-on:refreshList = 'refreshList'></Discussion>
    </div>
    <div class="empty" v-if = 'tops.length === 0 && datas.length === 0'>
      <img src="../../assets/img/comments_none.png">
      <p>{{$t('lang.firstWriteTopic')}}</p>
    </div>
    <LoginAlert v-if='showLogin' v-on:hide='hideAlert' :toast='tips'></LoginAlert>
    <MetaMaskAlert v-if='noMatch' v-on:hide='hideMetaAlert' v-on:switch='switchAddress' :metamask='user && user.metamask'></MetaMaskAlert>
  </div>
</template>
<script type="text/javascript">
import Discussion from './discussion.vue'
import mySelect from '../../components/MySelect.vue'
import CustomCollapse from '../../components/CustomCollapse.vue'
import {dappArticles, getStiky} from '../../util/axios.js'
import LoginAlert from '../../components/LoginAlert.vue'
import MetaMaskAlert from '../../components/MetaMaskAlert.vue'
import {mapGetters, mapState, mapMutations} from 'vuex'
export default {
  data () {
    return {
      tips: '',
      datas: [],
      tops: [],
      hasArticles: false,
      noMatch: false,
      showLogin: false,
      dappId: '',
      sort: 'recent'
    }
  },
  mounted () {
    this.dappId = this.$route.params.dappId
    this.getArticles()
    this.getStikys()
  },
  computed: {
    ...mapGetters('userInfo', ['isLogined']),
    ...mapState({
      web3: state => state.web3Instance.web3,
      user: state => state.userInfo.user
    })
  },
  methods: {
    ...mapMutations('web3Instance', ['registerWeb3Instance', 'getBalance']),
    refreshList () {
      this.getStikys()
      this.getArticles()
    },
    getStikys () {
      getStiky(this.dappId).then(res => {
        if (res && res.status === 200) {
          this.tops = res.data.articles
        }
      })
    },
    getArticles () {
      let that = this
      dappArticles(that.dappId, this.sort).then(res => {
        if (res && res.status === 200) {
          this.datas = res.data.articles
          if (res.data.articles.length > 0) {
            that.hasArticles = true
          }
          if (this.datas.length < 15) {
            that.endLoad()
          }
        }
      })
    },
    hideAlert () {
      this.showLogin = false
    },
    hideMetaAlert () {
      this.noMatch = false
    },
    switchAddress () {
      let that = this
      that.registerWeb3Instance(() => {
        if (that.web3.coinbase) {
          if (that.web3.coinbase === that.user.metamask) {
            that.noMatch = false
          }
        }
      })
    },
    topicsVisible () {
      let that = this
      if (!that.isLogined) {
        that.tips = 'lang.login_writeTopic'
        that.showLogin = true
      } else {
        that.registerWeb3Instance(() => {
          // 登录metamask
          if (that.web3.coinbase) {
            // metamask 地址是否与绑定的一致
            if (that.web3.coinbase !== that.user.metamask) {
              that.noMatch = true
              return
            }
            that.getBalance((balance) => {
              if (balance <= 0) {
                that.$toast.show({
                  toast: that.$t('lang.topicErr')
                })
              } else {
                this.$router.push({name: 'WriteTopic', params: {dappId: this.dappId}})
              }
            })
          } else {
            // 未登录metamask
            that.noMatch = true
          }
        })
      }
    },
    sortChanged (value) {
      this.start = 0
      if (value === 'lang.recent') {
        this.sort = 'recent'
        this.getArticles()
      } else {
        this.sort = 'hot'
        this.getArticles()
      }
    },
    endLoad () {
      this.$emit('endLoad')
    }
  },
  components: {
    Discussion,
    mySelect,
    CustomCollapse,
    LoginAlert,
    MetaMaskAlert
  }
}
</script>
<style type="text/css" scoped>
.userComment {
width: 652px;
height: 25px;
margin-bottom: 10px;
margin-top: 20px;
}
.commentIcon {
height: 25px;
float: left;
font-size: 16px;
line-height: 25px;
cursor: pointer;
}
.commentIcon span {
  margin-left: 5px;
}
.commentIcon:hover {
  color: #6D64FB;
}
.commentSort {
width: 92px;
height: 25px;
display: inline-block;
float: right;
}

.empty {
 width: 144px;
 height: 103px;
 margin: 40px auto;
}
.empty img {
  width: 88px;
  height: 80px;
  margin: 0 auto;
  display: block;
}
.empty p {
  font-size: 14px;
  color: #64442C;
  line-height: 17px;
  text-align: center;
  margin: 5px auto 0;
}
.row {
  background: #F9F9F9;
  width: 652px;
}
</style>
