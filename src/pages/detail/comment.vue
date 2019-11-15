<template>
  <div>
    <div class="oneComment">
      <div class="commentUp" v-if='from === "COMMENT"'>
        <div class="avatar" @click='toProfile'><img :src="commentInfo.author && commentInfo.author.avatar"></div>
        <div class="contentBox">
          <div class="name" @click='toProfile'>{{commentInfo.author && commentInfo.author.nickname}}</div>
          <div class="stars"><CustomRate :stars = 'commentInfo.rating'></CustomRate></div>
          <div class="comment"><CustomCollapase :text='commentInfo.content'></CustomCollapase></div>
          <div class="bottom">
            <span class="date">{{commentInfo.createTime | formatDate}}</span>
            <span class='likes iconBox' :class='{"likesClick":commentInfo && commentInfo.likeStatus}' @click='changeLikeState(commentInfo)'><i class="icon iconfont icon-Like" ></i> <span style="color: #8590A6">{{commentInfo.likeCount || 0}}</span></span>
            <span class="message iconBox" @click='changeReplyListFoldState(commentInfo)'><i class="icon iconfont icon-News"></i> <span>{{(replyListFold && commentInfo.replyCount > 0) ? $t('lang.collapse') : commentInfo.replyCount}}</span></span>
            <span class="reply iconBox" @click='changeReplyFoldState'><i class="icon iconfont icon-Reply"></i> {{$t('lang.Reply')}}</span>
          </div>
        </div>
      </div>
      <div class="commentUp" v-else>
        <div class="stars starsOther"><CustomRate :stars = 'commentInfo.rating'></CustomRate></div>
        <p class="source" @mouseover='mouseover' @mouseout='mouseout'>{{$t('lang.from')}} <span @click='showDetail(commentInfo)'>{{commentInfo.dapp && commentInfo.dapp.name}}</span></p>
        <div class="comment commenOther"><CustomCollapase :text='commentInfo.content'></CustomCollapase></div>
        <p class="dateOther">{{$t('lang.Released')}} {{commentInfo.createTime | formatDate}}</p>
        <div class="bottom">
            <span class="avatar avatarOther" @click='toProfile' v-show = 'from !== "StudioProfile"'>
              <img :src="commentInfo.author && commentInfo.author.avatar">
            </span>
            <span class="nameOther" v-show = 'from !== "StudioProfile"' @click='toProfile'>{{commentInfo.author && commentInfo.author.nickname}}</span>
            <span class='likes' :class= "commentInfo.likeStatus ? 'likesClick' : 'likesCancel'" @click='changeLikeState(commentInfo)'><i class="icon iconfont icon-Like"></i> <span>{{commentInfo.likeCount || 0}}</span></span>
            <span class="message iconBox" @click='changeReplyListFoldState(commentInfo)'><i class="icon iconfont icon-News"></i> <span>{{(replyListFold && commentInfo.replyCount > 0) ? $t('lang.collapse') : commentInfo.replyCount}}</span></span>
            <span class="reply iconBox" @click='changeReplyFoldState'><span class="icon iconfont icon-Reply"></span> {{$t('lang.Reply')}}</span>
        </div>
      </div>
      <div class="replyInput"><ReplyInput v-show='replyFold' :avatar = 'user.avatar' v-model='replyContent' :placeholder = "replyAuthor" @send='addReply' @cancel='cancelReply'></ReplyInput></div>
      <ReplyList :comment='commentInfo' type='COMMENT' v-if='replyListFold' v-on:removeSucced='removeReply' v-on:checkUserStatus='checkType'></ReplyList>
    </div>
    <LoginAlert v-if='showLogin' v-on:hide='hideAlert' :toast='tips'></LoginAlert>
  </div>
</template>
<script>
import CustomRate from '../../components/CustomRate.vue'
import {like, reply} from '../../util/axios.js'
import CustomCollapase from '../../components/CustomCollapse.vue'
import ReplyInput from '../../components/ReplyInput.vue'
import ReplyList from '../../components/ReplyList.vue'
import {mapState, mapGetters, mapMutations} from 'vuex'
import LoginAlert from '../../components/LoginAlert.vue'
import {COMMENT} from '../../common/Contants.js'
export default {
  name: 'Comment',
  data () {
    return {
      replyAuthor: '',
      replyListFold: false,
      replyFold: false,
      replyContent: '',
      showLogin: false,
      tips: ''
    }
  },
  props: {
    comment: {
      default: {}
    },
    from: {
      type: String,
      default: COMMENT
    }
  },
  components: {
    CustomRate,
    CustomCollapase,
    ReplyInput,
    ReplyList,
    LoginAlert
  },
  computed: {
    ...mapState({
      user: state => state.userInfo.user
    }),
    ...mapGetters('userInfo', ['isLogined']),
    commentInfo () {
      return this.comment
    }
  },
  methods: {
    ...mapMutations('vc', ['changeReplyCount']),
    toProfile () {
      let userId = this.comment.author.userId
      if (userId && this.user && userId.toString() === this.user.userId.toString()) {
        this.$router.push({name: 'Info', params: {userId: userId}})
      } else {
        if (this.comment.author.level === 0) {
          this.$router.push({name: 'Comment', params: {userId: userId}})
          return
        }
        this.$router.push({name: 'Info', params: {userId: userId}})
      }
    },
    mouseover (event) {
      this.$emit('mouseover', event)
    },
    mouseout () {
      this.$emit('mouseout', event)
    },
    checkType (params) {
      let type = params[0]
      let callback = params[1]
      let that = this
      if (!that.isLogined) {
        switch (type) {
          case 'like':
            that.tips = 'lang.login_like'
            break
          case 'reply':
            that.tips = 'lang.login_reply'
            break
          default:
            break
        }
        that.showLogin = true
      } else {
        callback()
      }
    },
    hideAlert () {
      this.showLogin = false
    },
    showDetail (commentInfo) {
      let dappId = commentInfo.dapp.dappId
      this.$router.push({name: 'Comments', params: {dappId: dappId}})
    },
    getLikes (commentID, callback) {
      this.checkType(['like', () => {
        like(commentID)
          .then((response) => {
            if (response && response.status === 201) {
              callback(response.data)
            }
          })
      }])
    },
    changeReplyListFoldState (commentInfo) {
      if (this.commentInfo && this.commentInfo.replyCount > 0) {
        this.replyListFold = !this.replyListFold
      }
    },
    changeReplyFoldState () {
      let that = this
      this.checkType(['reply', () => {
        that.replyAuthor = this.$t('lang.reply') + ' ' + that.commentInfo.author.nickname
        that.replyFold = !that.replyFold
      }])
    },
    removeReply () {
      this.commentInfo.replyCount > 0 && this.commentInfo.replyCount--
      this.changeReplyCount(this.commentInfo.replyCount)
      if (this.commentInfo.replyCount === 0) {
        this.replyListFold = false
      }
    },
    addReply () {
      reply(this.commentInfo.commentId, {content: this.replyContent}).then((res) => {
        if (res && res.status === 201) {
          this.replyContent = ''
          this.$toast.show({
            toast: this.$t('lang.replySuccess'),
            type: 'success'
          })
          this.commentInfo.replyCount++
          this.changeReplyCount(this.commentInfo.replyCount)
        }
      })
      this.replyFold = false
    },
    cancelReply () {
      this.replyContent = ''
      this.replyFold = false
    },
    changeLikeState (commentInfo) {
      this.getLikes(commentInfo.commentId, (data) => {
        this.commentInfo.likeCount = data.like
        this.commentInfo.likeStatus = !this.commentInfo.likeStatus
      })
    }
  }
}
</script>

<style type="text/css" scoped>
.iconBox:hover {
  color: #6D64FB;
}
.oneComment {
  margin-top: 10px;
  padding: 15px 0;
  background: inherit;
  overflow: hidden;
  width: 652px;
}
.commentUp {
  overflow: hidden;
  padding-left: 15px;
}
.commentUp:hover .reply {
  display: block;
}
.source {
  text-align: left;
  color: #999999;
  font-size: 12px;
  margin-top: 5px;
}
.source span {
  color: #92C6E3;
  margin-left: 5px;
}
.source span:hover {
  cursor: pointer;
  text-decoration: underline;
}
.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #ccc;
  float: left;
}
.avatarOther {
  width: 24px;
  height: 24px;
  margin-right: 10px;
  cursor: pointer;
}
.avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  cursor: pointer;
}
.contentBox {
  width: 550px;
  height: auto;
  float: left;
}
.comment {
  margin-bottom: 20px;
  margin-top: 10px;
  margin-left: 15px;
}
.commenOther {
  margin-left: 0;
}
.name {
  font-size: 14px;
  font-weight: bold;
  text-align: left;
  margin-left: 15px;
  cursor: pointer;
}

.dateOther {
  color: #666666;
  text-align: left;
  font-size: 14px;
  margin-top: 20px;
}
.nameOther {
  float: left;
  margin-right: 20px;
  color: #8590A6;
  cursor: pointer;
}
.nameOther:hover {
  text-decoration: underline;
}
.stars {
  text-align: left;
  line-height: 14px;
  margin-left: 15px;
  margin-top: 5px;
}
.starsOther {
  margin-left: 0;
}
.bottom {
  margin-top: 10px;
  line-height: 24px;
  overflow: hidden;
}
.bottom span {
  color: #8590A6;
  font-size: 14px;
}
.date {
  float: left;
  color: #999;
  margin-left: 15px;
}
.reply {
  float: right;
  margin-right: 35px;
  display: none;
  color: #8590A6;
  cursor: pointer;
}
.message {
  float: right;
  margin-right: 35px;
  color: #8590A6;
  cursor: pointer;
}
.likes {
  float: right;
  margin-right: 15px;
  color: #8590A6;
  cursor: pointer;
}
.likesClick {
  color: #F5726C !important;
}
.replyInput {
  padding-left: 38px;
  padding-right: 37px;
}
.icon {
  margin-right: 5px;
}
</style>
