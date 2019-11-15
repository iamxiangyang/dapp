<template>
<div class="newsWrap">
  <div class="headerBox">
    <div class="optionItem commentItem" @click='comment' v-if='isDeveloper'><p><Badge dot :count='dots[1]'><span :class='{active:selected === "comment"}'>{{$t('lang.Comments')}}</span></Badge></p><div v-show='selected === "comment"'></div></div>
    <div class="optionItem commentItem" @click='reply'><p><Badge dot :count='dots[2]'><span :class='{active:selected === "reply"}'>{{$t('lang.Reply')}}</span></Badge></p><div v-show='selected === "reply"'></div></div>
    <div class="optionItem commentItem" @click='like'><p><Badge dot :count='dots[3]'><span :class='{active:selected === "like"}'>{{$t('lang.Like')}}</span></Badge></p><div v-show='selected === "like"'></div></div>
    <div class="optionItem commentItem" @click='notice'><p><Badge dot :count='dots[0]'><span :class='{active:selected === "notice"}'>{{$t('lang.Notice')}}</span></Badge></p><div v-show='selected === "notice"'></div></div>
  </div>
  <div class="nullcontentBox" v-if='lists.length===0'>
    <div class="nullBox"><div style="height: 76px;"><img :src="nullIMG"><p>{{$t(nullToast)}}</p></div></div>
  </div>
  <div class="contentBox" v-else>
    <div class="rowBox"  v-for='(item,index) in lists' :key='index' >
      <div class="row">
      <span class="placeBox">
      <Badge v-show='!item.isRead' status="error"/>
      </span>
      <p v-html='item.message'></p>
      </div>
    </div>
  </div>
</div>
</template>
<script type="text/javascript">
import {Badge} from 'iview'
import {notifications, notificationsNum} from '../../util/axios.js'
import {mapState} from 'vuex'
const COMMENT = 'comment'
const REPLY = 'reply'
const LIKE = 'like'
const NOTICE = 'notice'
const COMMENTIMG = require('../../assets/img/nocomment.png')
const REPLYIMG = require('../../assets/img/noreply.png')
const LIKEIMG = require('../../assets/img/nolike.png')
const NOTICEIMG = require('../../assets/img/nonotice.png')
export default {
  data () {
    return {
      selected: COMMENT,
      lists: [],
      nullIMG: '',
      nullToast: '',
      dots: []
    }
  },
  components: {
    Badge
  },
  computed: {
    ...mapState({
      isDeveloper: state => state.userInfo.user && state.userInfo.user.level === 1
    })
  },
  mounted () {
    if (this.isDeveloper) {
      this.comment()
    } else {
      this.reply()
    }
    this.getNoticesNum()
  },
  methods: {
    getNoticesNum () {
      notificationsNum().then(res => {
        if (res && res.status === 200) {
          this.dots = res.data
        }
      })
    },
    comment () {
      this.selected = COMMENT
      this.nullIMG = COMMENTIMG
      this.nullToast = 'lang.nocomment'
      this.getNotices(1)
      this.dots[1] = 0
    },
    reply () {
      this.selected = REPLY
      this.nullIMG = REPLYIMG
      this.nullToast = 'lang.noreply'
      this.getNotices(2)
      this.dots[2] = 0
    },
    like () {
      this.selected = LIKE
      this.nullIMG = LIKEIMG
      this.nullToast = 'lang.nolike'
      this.getNotices(3)
      this.dots[3] = 0
    },
    notice () {
      this.selected = NOTICE
      this.nullIMG = NOTICEIMG
      this.nullToast = 'lang.nonotice'
      this.getNotices(0)
      this.dots[0] = 0
    },
    getNotices (catagory) {
      notifications(catagory).then(res => {
        if (res && res.status === 200) {
          this.lists = res.data.notifications
        }
      })
    }
  }
}
</script>
<style type="text/css" scoped>
.newsWrap {
  position: fixed;
  top: 74px;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background: rgb(245, 247, 246);
}
.headerBox {
  width: 828px;
  height: 40px;
  margin: 20px auto 0;
  display: flex;
  justify-content: center;
  background: #ffffff;
}
.nullcontentBox {
  width: 828px;
  height: 161px;
  margin: 10px auto 0;
  padding: 20px;
  background: #ffffff;
}
.contentBox {
  width: 828px;
  margin: 10px auto 0;
  background: #ffffff;
}
.optionItem {
  font-size: 16px;
  color: #8590A6;
  height: auto;
  cursor: default;
  display: flex;
  flex-wrap: wrap;
  margin-left: 60px;
  min-width: 100px;
}
.optionItem div {
  width: 21px;
  height: 4px;
  background: #6D64FB;
  border-radius: 2px;
  margin: 5px auto 0;
}
.optionItem p {
  width: 100%;
  letter-spacing: 0.5px;
  text-align: center;
  margin-top: 13px;
  line-height: 20px;
}
.optionItem span{
  text-align: center;
  /*margin-right: 5px;*/
}
.active {
  color: #6D64FB;
}
.optionItem p:hover {
  color: #6D64FB;
}
.nullBox {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}
.nullBox img{
 width: 80px;
 height: 54px;
}
.nullBox p {
  font-size: 14px;
  color: #64442C;
  line-height: 17px;
  height: 17px;
  width: 100%;
}
.rowBox {
  width: 100%;
  padding: 20px 20px 0;
}
.row {
  width: 100%;
  border-bottom: 1px dashed #EBEBEB;
  padding-bottom: 20px;
  padding-top: 20px;
}
.rowBox:hover {
  background: #F9F9F9;
}

.placeBox {
  width: 10px;
  height: 20px;
  float: left;
}

</style>
<style type="text/css">
.row .ivu-badge-status {
  float: left;
}
</style>
