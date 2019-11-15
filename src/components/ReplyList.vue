<template>
  <div class="replyDetail">
    <p class="replyMount">{{$t('lang.total')}} <span>{{replyCount}}</span></p>
    <ul class="replies">
      <li class="replyItem" v-for = '(reply, index) in replyComments' :key='index'>
        <div class="commentAvatar"><img :src="reply.author && reply.author.avatar" @click='toProfile(reply.author)'></div>
        <div class="replyContent">
          <div class="name">
            <span class='replyUser' @click='toProfile(reply.author)'>{{reply.author.nickname}}</span>
            <span v-show='reply.replyAuthor'>
              <span style="margin: 0 5px; color: #666;font-size: 14px;">{{$t('lang.reply')}}</span>
              <span class="replyUser" @click='toProfile(reply.replyAuthor)'>{{reply.replyAuthor && reply.replyAuthor.nickname}}</span>
          </span>
          </div>
          <p class="replyText">{{reply.content}}</p>
        </div>
        <div class="replyBottom">
          <p class="replyTime">{{reply.createTime | formatDate}}</p>
          <span class="replyLikes" :class= "reply.likeStatus ? 'likesClick' : 'likesCancel'" @click='changeReplyLikeStatus(reply)'><i class="icon iconfont icon-Like"></i>
            <span style="color: #8590A6">{{reply.likeCount}}</span></span>
          <span class="replyReply iconBox" @click='changeReplyReplyFoldState(reply, index)'><i class="icon iconfont icon-Reply"></i>{{$t('lang.Reply')}}</span>
          <span  class="replyReply iconBox" @click='removeComment(reply.commentId, index)' v-if='reply.author && user && reply.author.userId == user.userId'><i class="icon iconfont icon-Delete" ></i> {{$t('lang.Delete')}}</span>
        </div>
        <div v-show='replyReplyFold[index]' class="replyChildren">
          <ReplyInput  :placeholder="replyName" v-model='childrenReplyContents[index]' @send="addReplyReply(reply, index)" @cancel="cancelReplyReply(index)"></ReplyInput>
        </div>
      </li>
    </ul>
    <div class="Pagination">
      <Page :total='replyCount' size="small" class='selfStyle' @on-change = 'pageChange'></Page>
    </div>
  </div>
</template>
<script type="text/javascript">
import ReplyInput from './ReplyInput.vue'
import {like, reply, deleteComment, deleteArticleComment, articleComments, commentReply, replyArticle, articleCommentLike} from '../util/axios.js'
import {Page} from 'iview'
import {mapState} from 'vuex'
import {COMMENT} from '../common/Contants.js'
export default {
  data () {
    return {
      replyReplyFold: [],
      childrenReplyContents: [],
      replyName: '',
      replyComments: [],
      replyCount: 0
    }
  },
  props: {
    comment: {
      type: Object
    },
    type: {
      default: COMMENT,
      type: String
    }
  },
  components: {
    Page,
    ReplyInput
  },
  computed: {
    ...mapState({
      user: state => state.userInfo.user,
      newCount: state => state.vc.replyCount
    })
  },
  watch: {
    newCount () {
      this.getReplys()
    }
  },
  mounted () {
    this.getReplys()
  },
  methods: {
    toProfile (author) {
      let userId = author.userId
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
    getReplys (start = 0) {
      if (this.type === COMMENT) {
        this.replyCount = this.comment.replyCount
        this.getCommentReply(this.comment.commentId, start)
      } else {
        this.replyCount = this.comment.commentCount
        this.getArticleReply(this.comment.articleId, start)
      }
    },
    getCommentReply (commentID, start = 0, limit = 10, callback) {
      commentReply(commentID, start, limit).then((res) => {
        if (res && res.status === 200) {
          this.replyComments = res.data.comments
        }
      })
    },
    getArticleReply (articleId, start = 0, limit = 10) {
      articleComments(articleId, start, limit).then(res => {
        if (res && res.status === 200) {
          this.replyComments = res.data.comments
        }
      })
    },
    cancelReplyReply (index) {
      this.childrenReplyContents.splice(index, 1, '')
      this.replyReplyFold.splice(index, 1, false)
    },
    addReplyReply (replyInfo, index) {
      let callback = (res) => {
        if (res && res.status === 201) {
          this.$set(this.childrenReplyContents, index, '')
          this.$set(this.replyReplyFold, index, false)
          this.$toast.show({
            toast: this.$t('lang.replySuccess'),
            type: 'success'
          })
          this.comment.replyCount++
          this.getReplys()
        }
      }
      if (this.type === COMMENT) {
        reply(replyInfo.commentId, {content: this.childrenReplyContents[index]}).then(res => callback(res))
        return
      }
      replyArticle(replyInfo.commentId, {content: this.childrenReplyContents[index]}).then(res => callback(res))
    },
    changeReplyReplyFoldState (reply, index) {
      let that = this
      that.$emit('checkUserStatus', ['reply', () => {
        that.replyName = this.$t('lang.reply') + reply.author.nickname
        let curStatus = !that.replyReplyFold[index]
        this.$set(that.replyReplyFold, index, curStatus)
      }])
    },
    removeComment (commentId, index) {
      if (this.type === COMMENT) {
        deleteComment(commentId).then(res => callback(res)).catch(err => errHandel(err))
      } else {
        deleteArticleComment(commentId).then(res => callback(res)).catch(err => errHandel(err))
      }
      let callback = (res) => {
        if (res && res.status === 201) {
          this.$toast.show({
            toast: this.$t('lang.deleteSuccess'),
            type: 'success'
          })
          this.replyComments.splice(index, 1)
          this.$emit('removeSucced')
          this.getReplys(0)
        }
      }
      let errHandel = (err) => {
        if (err.response && err.response.status === 420) {
          this.$toast.show({
            toast: err.response.data.errmsg
          })
        }
      }
    },
    getLikes (commentID, callback) {
      this.$emit('checkUserStatus', ['like', () => {
        if (this.type === COMMENT) {
          like(commentID)
            .then((response) => {
              if (response && response.status === 201) {
                callback(response.data)
              }
            })
        } else {
          articleCommentLike(commentID)
            .then(response => {
              if (response && response.status === 201) {
                callback(response.data)
              }
            })
        }
      }])
    },
    // 1 点赞验证
    changeReplyLikeStatus (replyInfo) {
      this.getLikes(replyInfo.commentId, (data) => {
        replyInfo.likeCount = data.like
        replyInfo.likeStatus = !replyInfo.likeStatus
      })
    },
    // 2
    pageChange (page) {
      this.getReplys((page - 1) * 10)
    }
  }
}
</script>
<style type="text/css" scoped>
.replyDetail {
  margin-top: 15px;
  margin-left: 15px;
  width: 620px;
  background: #fff;
  border: 1px solid #ebebeb;
  position:relative;
}
.replyMount {
  font-size: 14px;
  font-family: lato;
  font-weight: 600;
  height: 17px;
  text-align: left;
  line-height: 17px;
  margin-left: 15px;
  margin-top: 10px;
  margin-bottom: 5px;
}
.replies li {
  width: 590px;
  padding-top: 15px;
  overflow: hidden;
  margin: 0 auto;
  border-top: 1px dashed #ebebeb;
}
.replies li:first-child {
  border-top: none;
}
.commentAvatar {
  width: 30px;
  height: 30px;
  border-radius: 30px;
  background: #ccc;
  margin-right: 15px;
  float: left;
}
.commentAvatar img {
  width: 30px;
  height: 30px;
  border-radius: 30px;
}
.name {
  font-size: 14px;
  color: #8590A6;
  text-align: left;
}
.replyContent {
  width: 540px;
  float: left;
}
.replyText {
  width: 540px;
  font-size: 14px;
  color: #666;
  text-align: left;
  margin-top: 5px;
  word-break: normal;
  white-space: pre-warp;
  word-wrap: break-word;
}
.replyBottom {
  width: 530px;
  float: right;
  margin-right: 10px;
  margin-top: 20px;
  margin-bottom: 20px 10px 10px 0;
  color: #8590A6;
  font-size: 14px;
}
.replyBottom span {
  font-size: 14px;
}
.iconBox:hover {
  color: #6D64FB;
}
.replyTime {
  float: left;
  font-size: 14px;
  color: #999;
}
.replyLikes {
  float: right;
  cursor: pointer;
}
.replyItem:hover .replyReply {
  display: block;
}
.replyReply {
  float: right;
  margin-right: 25px;
  display: none;
  cursor: pointer;
}
.Pagination {
  height: 30px;
  margin: 0 auto;
  text-align: center;
}
.icon {
  margin-right: 5px;
}
.selfStyle {
  width: auto;
  text-align: center;
  font-size: 12px;
}
.selfStyle >>> li {
  background: rgb(0, 0, 0, 0);
}
.likesClick {
  color: #F5726C;
}
.likesCancel {
  color: #8590A6;
}
.replyChildren {
  width: 100%;
  padding-left: 15px;
}
.replyUser {
  color: #8590A6;
}
.replyUser:hover {
  cursor: pointer;
  text-decoration: underline;
}
</style>
<style type="text/css">
.selfStyle a {
  color: #8590A6;
}
.selfStyle .ivu-page-item-active a{
  color: #6D64FB !important;
}
.selfStyle .ivu-page-item:hover a {
  color: #6D64FB !important;
}
.ivu-page-item,.ivu-page-item-active {
  font-size: 14px;
}
</style>
