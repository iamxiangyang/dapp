<template>
  <div>
    <div class="userComment">
      <p class="commentIcon" @click='checkVisible'><span><i class="icon iconfont icon-Write"></i><span style="margin-left: 10px">{{$t('lang.writeComment')}}</span></span></p>
      <span class="commentSort">
        <MySelect v-on:valueChanged='sortChanged'></MySelect>
      </span>
    </div>
    <div class="commentWrap" v-if = 'hasComment'>
      <div class="commentList" v-show = 'topComment && topComment.author'>
        <Comment :comment='topComment'></Comment>
        <p class="breakline">—— {{$t('lang.allComments')}} ——</p>
      </div>
      <div class = 'commentList' v-for='item in comments' :key='item.commentId'>
        <Comment  :comment ='item'></Comment>
      </div>
    </div>
    <div class="empty" v-else>
      <img src="../../assets/img/comments_none.png">
      <p>{{$t('lang.firstComment')}}</p>
    </div>
    <div class='popContainer' v-show = "commentShow">
      <div class="writeComment">
        <div class="commentClose" @click='commentClose'>
          <img src="../../assets/img/close2.png" class="closeImg" @click='canelComment'>
        </div>
        <h2>{{$t('lang.comments')}}</h2>
        <p class="writeScore">{{$t('lang.tapRate')}}: <b> <CustomeRate  :stars = "writeScore" disabled = 'false' isAllowHalf ='false' @on-change='starChanged'></CustomeRate></b><span class="grade" v-text='grade(writeScore)' ></span></p>
        <p class="writeText">{{$t('lang.comments')}}:</p>
        <textarea name="text" id="textComment" maxlength="500" :placeholder="$t('lang.comment_place')" @input="descInput" v-model="desc"></textarea>
        <p class="textRemain"><span>{{remain}}</span>/500</p>
        <div class="commentSubmit">
          <CustomButton @click='canelComment'>{{$t('lang.cancel')}}</CustomButton>
          <CustomButton @click='addComment' kind='active' class="submitBtn">{{$t('lang.submit')}}</CustomButton>
        </div>
      </div>
    </div>
    <LoginAlert v-if='showLogin' v-on:hide='hideAlert' :toast='tips'></LoginAlert>
    <MetaMaskAlert v-if='noMatch' v-on:hide='hideMetaAlert' v-on:switch='switchAddress' :metamask='user && user.metamask'></MetaMaskAlert>
  </div>
</template>
<script type="text/javascript">
import Comment from './comment.vue'
import MySelect from '../../components/MySelect.vue'
import {dappComments, comment, getCommentWithID} from '../../util/axios.js'
import {mapGetters, mapState, mapMutations} from 'vuex'
import CustomeRate from '../../components/CustomRate.vue'
import LoginAlert from '../../components/LoginAlert.vue'
import MetaMaskAlert from '../../components/MetaMaskAlert.vue'
import CustomButton from '../../components/CustomButton.vue'
export default {
  data () {
    return {
      hasComment: false,
      comments: [],
      topComment: {},
      remain: 0,
      desc: '',
      writeScore: 5,
      commentShow: false,
      showLogin: false,
      noMatch: false,
      tips: '',
      sort: 'recent',
      start: 0
    }
  },
  computed: {
    ...mapGetters('userInfo', ['isLogined']),
    ...mapState({
      web3: state => state.web3Instance.web3,
      user: state => state.userInfo.user,
      dappAuthorId: state => state.vc.dappAuthorId
    })
  },
  components: {
    Comment,
    MySelect,
    CustomeRate,
    LoginAlert,
    MetaMaskAlert,
    CustomButton
  },
  mounted () {
    if (this.$route.query && this.$route.query.comment_id) {
      this.firstCommentId = this.$route.query.comment_id
      getCommentWithID(this.firstCommentId).then(res => {
        if (res && res.status === 200) {
          location.href = '#comment'
          this.topComment = res.data
        }
      })
    }
    window.eventBus.$on('refresh', this.refresh, true)
    window.eventBus.$on('checkVisible', this.checkVisible)
    this.getComments()
  },
  beforeDestroy () {
    window.eventBus.$off('refresh')
  },
  methods: {
    ...mapMutations('web3Instance', ['registerWeb3Instance', 'getBalance']),
    addComment () {
      let appId = this.$route.params.dappId
      let data = {
        content: this.desc,
        rating: this.writeScore
      }
      comment(appId, data)
        .then(res => {
          if (res.status && res.status === 201) {
            this.$toast.show({
              toast: this.$t('lang.commentSuccess'),
              type: 'success'
            })
            this.getComments()
          }
        }).catch(err => {
          if (err.response && err.response.status === 400) {
            this.$toast.show({
              toast: err.response.data.errmsg
            })
          }
        })
      this.desc = ''
      this.commentShow = false
    },
    getComments ({load = false} = {}) {
      let appId = this.$route.params.dappId
      if (!load) {
        this.start = 0
      }
      dappComments(appId, this.sort, this.start)
        .then((response) => {
          if (response && response.status === 200) {
            if (load) {
              this.comments = this.comments.concat(response.data.comments)
            } else {
              this.comments = response.data.comments
            }
            if (this.comments.length > 0) {
              this.hasComment = true
            }
            if (this.comments.length < 15) {
              this.endLoad()
            }
          }
        })
    },
    endLoad () {
      this.$emit('endLoad')
    },
    sortChanged (value) {
      this.start = 0
      if (value === 'lang.recent') {
        this.sort = 'recent'
        this.getComments()
      } else {
        this.sort = 'hot'
        this.getComments()
      }
    },
    commentClose () {
      this.commentShow = false
    },
    starChanged (val) {
      this.writeScore = val
    },
    grade (writeScore) {
      switch (writeScore) {
        case 0:
          return ''
        case 1:
          return this.$t('lang.oneStar')
        case 2:
          return this.$t('lang.twoStar')
        case 3:
          return this.$t('lang.threeStar')
        case 4:
          return this.$t('lang.fourStar')
        case 5:
          return this.$t('lang.fiveStar')
      }
    },
    canelComment () {
      this.$emit('canel')
      this.desc = ''
      this.commentShow = false
    },
    descInput () {
      var txtVal = this.desc.length
      this.remain = txtVal
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
    hideAlert () {
      this.showLogin = false
    },
    hideMetaAlert () {
      this.noMatch = false
    },
    refresh () {
      if (this.comments) {
        this.start += 10
        this.getComments({load: true})
      }
    },
    checkVisible () {
      let that = this
      if (!that.isLogined) {
        that.tips = 'lang.login_comment'
        that.showLogin = true
      } else {
        // x是否评论过
        // x是否是自己的dapp
        if (that.user.userId.toString() === that.dappAuthorId.toString()) {
          that.$toast.show({
            toast: this.$t('lang.commentErr_one')
          })
          return
        }
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
                  toast: that.$t('lang.commentErr_two')
                })
              } else {
                that.commentShow = true
              }
            })
          } else {
            // 未登录metamask
            that.noMatch = true
          }
        })
      }
    }
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
.commentSort option {
width: 92px;
height: 25px;
position: absolute;
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
.popContainer{
position: fixed;
top: 0;
left: 0;
right: 0;
bottom: 0;
background: rgba(0,0,0,0.4);
}
.writeComment {
width: 655px;
height: 385px;
border: 1px solid #979797;
border-radius: 10px;
background: #fff;
margin: auto;
position: fixed;
top: 0;
left: 0;
right: 0;
bottom: 0;
}
.writeComment h2 {
height: 30px;
font-family: lato;
font-size: 24px;
margin-top: 30px;
margin-bottom: 12px;
}
.writeScore {
height: 20px;
margin-left: 50px;
text-align: left;
font-size: 16px;
line-height: 20px;
}
.writeScore >>> .ivu-rate-star {
margin-right: 0px !important;
}
.writeScore >>> .ivu-rate-star-full:before {
color: #FFDB73 !important;
}
.writeText {
width: 80px;
height: 20px;
margin-left: 50px;
text-align: left;
font-size: 16px;
line-height: 20px;
margin-top: 15px;
margin-bottom: 10px;
}
.writeComment .ivu-icon {
font-size: 55px;
color: #fff;
line-height: 25px;
}
.commentClose {
width: 25px;
height: 25px;
position: absolute;
top: 0;
left: 662px;
}
.textRemain {
height: 20px;
text-align: right;
margin-right: 50px;
margin-bottom: 15px;
}
.commentSubmit {
height: 40px;
}
.commentSubmit .submitBtn {
  margin-left: 10px;
}
.grade {
margin-left: 10px;
}
#textComment {
display: block;
width: 560px;
height: 145px;
margin: 0 auto;
border-radius: 5px;
resize: none;
overflow: auto;
outline: none;
padding: 10px;
border: 1px solid #ebebeb;
}
#textComment:focus {
border: 1px solid #3C99FC;
}
#textComment::-webkit-scrollbar {
display: none
}
.commentWrap {
text-align: left;
height: auto;
overflow: hidden;
}
.commentList {
  background: #f9f9f9;
}
.breakline {
font-size: 14px;
margin-top: 20px;
margin-bottom: 20px;
color: #333333;
text-align: center;
letter-spacing: 0.5px;
}
.closeImg {
  width: 16px;
  height: 16px;
  cursor: pointer;
}
</style>
