<template>
    <div class="allBox" id='discussion'>
      <div class="topBox">
        <p class="titBox" ref="tit" ><span class="top" v-if='type === "top"'>{{$t('lang.top')}}</span><span>{{info.title}}</span></p>
        <p class="source" v-show='from === "COMMUNITY"'>{{$t('lang.from')}}<span @click='showDetail(info)' @mouseover='mouseover' @mouseout='mouseout'>{{info.dappName}}</span></p>
        <div class="listBox" v-show='isVisible'>
          <span class="dots"  @click.stop="isShowList = !isShowList">...</span>
          <ul v-show='isShowList' class='options'>
            <li @click.stop="remove(info)" v-show='canDel'>{{$t('lang.Delete')}}</li>
            <li @click.stop="stiky(info)" v-if='from === "DAPP" && type !== "top"'>{{$t('lang.sticky')}}</li>
            <li @click.stop="edit(info)" v-else>{{$t('lang.edit')}}</li>
          </ul>
        </div>
      </div>
      <div class="disc" v-show='!isExtend'>
        <CustomCollapse :text='richText' :toggle='handel'></CustomCollapse>
        <img :src= "firstImg" style="width: 110px; height: 110px; margin-top: 10px;"  v-show='firstImg'/>
      </div>
      <div v-show='isExtend' class='ql-editor ql-snow'>
        <div v-html='info.content' class="disc" ></div>
      </div>
      <p class="time">{{$t('lang.Released')}} {{info.createTime | formatDate}}</p>
      <div class="bottom">
        <div class="leftArea"><img v-show='from !== "PUBLISHED" && from !== "DRAFT"' :src="info.author.avatar"  @click='toProfile'><span  class='author' v-show='from !== "PUBLISHED" && from !== "DRAFT"' @click='toProfile'>{{info.author && info.author.nickname}}</span><span class="views">{{info.views}}{{$t('lang.views')}}</span></div>
        <div class="rightArea" v-if='notDraft'>
          <span class="reply iconItem" @click='reply(info)'><i class="icon iconfont icon-Reply"></i><span>{{$t('lang.Reply')}}</span></span>
          <span class="comments iconItem" @click='comment(info)'><i class="icon iconfont icon-News"></i> <span>{{(replyListFold && info.commentCount > 0) ? $t('lang.collapse') : info.commentCount}}</span></span>
          <span class="iconItem" :class='{"likes":info && info.likeStatus}' @click='like(info)'><i class="icon iconfont icon-Like"></i> <span style="color: #8590A6">{{info.likeCount}}</span></span>
         </div>
      </div>
      <div class="replyInput" v-show='replyFold'><ReplyInput  :placeholder='replyAuthor' v-model='replyContent' :avatar = 'user.avatar' @send="addReply(info)" @cancel='cancelReply'></ReplyInput>
      </div>
      <div v-if='replyListFold && replys'><ReplyList :comment='info' type='TOPIC' v-on:removeSucced='removeReply' v-on:checkUserStatus='checkType'></ReplyList></div>
    <!-- fixed bottom-->
    <div class="bottom fixed" id='fixed' :style='styleObject' v-show='isFixed' v-if='notDraft'>
      <div class="leftArea"><img :src="info.author.avatar" @click='toProfile' v-show='from !== "PUBLISHED" && from !== "DRAFT"'><span class="author" v-show='from !== "PUBLISHED" && from !== "DRAFT"' @click='toProfile'>{{info.author && info.author.nickname}}</span><span class="views">{{info.views}}{{$t('lang.views')}}</span>
      </div>
      <div class="rightArea selfRight">
        <span class="reply iconItem" @click='reply(info)'><i class="icon iconfont icon-Reply"></i><span>{{$t('lang.Reply')}}</span></span>
        <span class="comments iconItem" @click='comment(info)'><i class="icon iconfont icon-News"></i> <span>{{info.commentCount}}</span></span>
        <span class="like iconItem" @click='like(info)' :class='{"likes":info && info.likeStatus}'><i class="icon iconfont icon-Like"></i> <span style="color: #8590A6">{{info.likeCount}}</span></span>
        <span class="show iconItem" @click='handel'>{{$t('lang.collapse')}}</span>
      </div>
    </div>
    <LoginAlert v-if='showLogin' v-on:hide='hideAlert' :toast='tips'></LoginAlert>
  </div>
</template>
<script type="text/javascript">
import CustomCollapse from '../../components/CustomCollapse.vue'
import {imgUrlFun, getSimpleText} from '../../util/tool.js'
import {commentArticle, articleLike, articleStiky, deleteArticle} from '../../util/axios.js'
import ReplyInput from '../../components/ReplyInput.vue'
import ReplyList from '../../components/ReplyList.vue'
import LoginAlert from '../../components/LoginAlert.vue'
import {Page} from 'iview'
import {mapState, mapGetters, mapMutations} from 'vuex'
import {DRAFT, DAPP, COMMUNITY, PUBLISHED} from '../../common/Contants.js'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.core.css'
export default {
  data () {
    return {
      isFixed: false,
      isExtend: false,
      firstImg: '',
      richText: '',
      showText: 'lang.showMore',
      replyFold: false,
      replyContent: '',
      replyAuthor: '',
      replyListFold: false,
      replyReplyFold: [],
      childrenReplyContents: [],
      replys: [],
      replyName: '',
      showLogin: false,
      tips: '',
      articleId: '',
      isShowList: false,
      isVisible: false,
      canDel: false,
      isOwner: false,
      styleObject: {
      }
    }
  },
  props: {
    info: {
      type: Object
    },
    type: {
      type: String,
      default: 'normal'
    },
    from: {
      type: String,
      default: DAPP
    }
  },
  components: {
    CustomCollapse,
    ReplyInput,
    Page,
    ReplyList,
    LoginAlert
  },
  computed: {
    ...mapState({
      user: state => state.userInfo.user,
      dappAuthorId: state => state.vc.dappAuthorId
    }),
    ...mapGetters('userInfo', ['isLogined']),
    notDraft: function () {
      // 草稿箱无显示点赞 回复 评论
      if (this.from !== DRAFT) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    info (value) {
      this.firstImg = imgUrlFun(this.info.content)
      this.richText = getSimpleText(this.info.content)
    }
  },
  mounted () {
    window.eventBus.$on('scroll', this.handelScroll)
    window.eventBus.$on('resize', this.handelResize)
    this.articleId = this.info.articleId
    this.checkVisible()
    this.firstImg = imgUrlFun(this.info.content)
    this.richText = getSimpleText(this.info.content)
  },
  methods: {
    ...mapMutations('vc', ['setDappAuthorId', 'changeReplyCount']),
    checkVisible () {
      if (this.from === COMMUNITY) {
        this.isVisible = false
      } else if (this.from === PUBLISHED || this.from === DRAFT) {
        if (this.info && this.user && this.info.author.userId.toString() === this.user.userId.toString()) {
          this.isVisible = true
          this.canDel = true
        }
      } else {
        if (this.user && this.user.userId.toString() === this.dappAuthorId.toString()) {
          this.isVisible = true
        }
        this.canDel = this.info && this.user && this.info.author.userId.toString() === this.user.userId.toString()
      }
    },
    mouseover (event) {
      this.$emit('mouseover', event)
    },
    mouseout () {
      this.$emit('mouseout', event)
    },
    showDetail (info) {
      this.$router.push({name: 'Topics', params: {dappId: info.dappId}})
    },
    stiky () {
      this.isShowList = false
      articleStiky(this.articleId).then(res => {
        if (res && res.status === 201) {
          this.$emit('refreshList')
        }
      })
    },
    remove () {
      this.isShowList = false
      deleteArticle(this.articleId).then(res => {
        if (res && res.status === 201) {
          this.$emit('refreshList')
        }
      })
    },
    edit () {
      this.$router.push({name: 'EditTopic', params: {topicID: this.info.articleId}})
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
    handel () {
      this.isExtend = !this.isExtend
      this.isFixed = false
      this.showText = this.showText === 'lang.showMore' ? 'lang.collapse' : 'lang.showMore'
    },
    toProfile () {
      let userId = this.info.author.userId
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
    addReply (info) {
      let data = {content: this.replyContent}
      commentArticle(info.articleId, data).then(res => {
        if (res && res.status === 201) {
          info.commentCount++
          this.changeReplyCount(info.commentCount)
          this.replyContent = ''
          this.replyFold = false
        }
      })
    },
    cancelReply () {
      this.replyContent = ''
      this.replyFold = false
    },
    reply (info) {
      this.checkType(['reply', () => {
        this.replyFold = !this.replyFold
        this.replyAuthor = this.$t('lang.reply') + ' ' + info.author.nickname
      }])
    },
    removeReply () {
      this.info.commentCount > 0 && this.info.commentCount--
      this.changeReplyCount(this.info.commentCount)
      if (this.info.commentCount === 0) {
        this.replyListFold = false
      }
    },
    comment (info) {
      if (info.commentCount > 0) {
        this.replyListFold = !this.replyListFold
        this.articleId = info.articleId
      }
    },
    like (info) {
      this.checkType(['like', () => {
        articleLike(info.articleId).then(res => {
          if (res && res.status === 201) {
            info.likeStatus = !info.likeStatus
            info.likeCount = res.data.like
          }
        })
      }])
    },
    handelScroll (event) {
      if (!this.isExtend) {
        return
      }
      let y = this.$el.getBoundingClientRect().y
      // 当前元素高
      let elHeight = this.$el.offsetHeight
      let windowH = document.body.clientHeight || document.documentElement.clientHeight
      if (y + 200 < windowH && y + elHeight > windowH) {
        this.isFixed = this.isExtend
      } else {
        this.isFixed = false
      }
      let x = this.$el.getBoundingClientRect().x
      this.styleObject = {left: x + 'px'}
    },
    handelResize () {
      if (!this.isExtend) {
        return
      }
      let x = this.$el.getBoundingClientRect().x
      this.styleObject = {left: x + 'px'}
    }
  }
}
</script>
<style type="text/css" scoped>
.allBox {
  width: 652px;
  padding-top: 15px;
  padding-bottom: 10px;
  background: inherit;
  margin: 10px auto 0;
  position: relative;
}
.reply {
  display: none;
}
.allBox:hover .reply{
  display: inline-block;
}
.titBox {
  width: 400px;
  line-height: 18px;
  font-size: 16px;
  margin-left: 15px;
  text-align: left;
  color: rgb(51, 51, 51);
  font-weight: bold;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.tit:hover {
  cursor: pointer;
  text-decoration: underline;
}
.source {
  text-align: left;
  color: #999999;
  font-size: 12px;
  margin-top: 5px;
  margin-left: 15px;
}
.source span {
  color: #92C6E3;
  margin-left: 5px;
}
.source span:hover {
  cursor: pointer;
  text-decoration: underline;
}
.topBox {
  width: 100%;
}
.listBox {
  min-width: 92px;
  cursor: pointer;
  position: absolute;
  top: 15px;
  right: 0;
}
.listBox .dots {
  width: 21px;
  height: 21px;
  margin: 0 auto;
  display: block;
  color: #8590A6;
  cursor: pointer;
}
.listBox .options {
  min-width: 92px;
  width: auto;
  position: relative;
  border-radius: 10px;
  background: #fff;
  border: 1px solid #DEDEDE;
  padding-top: 10px;
}
.options>li {
  height: 17px;
  line-height: 17px;
  text-align: center;
  margin-bottom: 10px;
  color: #666666;
  font-size: 14px;
}
.options>li:hover {
  background: #3C99FC;
  color: #fff;
}
.top {
  float: left;
  width: 36px;
  height: 18px;
  line-height: 18px;
  background: rgb(86, 199, 204);
  color: rgb(247, 247, 247);
  font-size: 12px;
  margin-right: 5px;
  border-radius: 4px;
  text-align: center;
}
.fixed {
  width: 652px !important;
  height: 36px;
  position: fixed;
  padding: 15px !important;
  margin-left:auto;
  margin-right:auto;
  bottom: 0;
  background: #fff;
}
.fixed:hover .reply{
  display: inline-block;
}
.disc {
  font-size: 14px;
  color: #666666;
  line-height: 24px;
  text-align: left;
  margin: 10px auto 0;
  padding: 0 15px;
}
.ql-snow .disc {
  padding: 0;
}
.ql-snow {
  padding-top: 0;
}
.time {
  color: #666666;
  text-align: left;
  font-size: 14px;
  margin-top: 20px;
  padding: 0 15px;
}
.bottom {
  width: 620px;
  margin: 10px auto 0;
  padding-right:0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.bottom span {
  font-size: 14px;
}
.leftArea {
  font-size: 12px;
  display: flex;
  align-items: center;
}
.leftArea img{
  width: 24px;
  height: 24px;
  border-radius: 50%;
}
.author {
  color: #8590A6;
  margin-left: 10px;
  margin-right: 20px;
  cursor: pointer;
}
.author:hover {
  text-decoration: underline;
}
.leftArea .views {
  color: #999999;
}
.rightArea {
  float: right;
  right: 0;
}
.rightArea .iconItem{
  margin-left: 40px;
  color: #8590A6;
  cursor: default;
  font-size: 14px;
}
.likes {
  color: #F5726C !important;
}
.rightArea .iconItem:hover {
  color: #6D64FB;
}
.replyInput {
  width: 100%;
  padding-left: 38px;
  padding-right: 37px;
}
.icon {
  margin-right: 5px;
}
</style>
