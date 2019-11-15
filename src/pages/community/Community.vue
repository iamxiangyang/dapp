<template>
  <div class="wrap" ref='wrap'>
    <div class="contentBox">
    <div class="centerBox" ref='centerBox'>
      <div v-for='(item, index) in articles' :key='item.content' class="articlesBox">
        <Discussion :info='item' :from = 'from' @mouseover='showCard(index, item.dappId)' @mouseout='hideCard'>
        </Discussion>
        <DappCard class="dappCard" :list='dappDetail' :isAnimate='animate' :isTron = 'dappDetail.chain_name === "tron"' :isEos = 'dappDetail.chain_name === "eos"' v-if='index === currentIndex'></DappCard>
      </div>
      <div v-for='(item, index) in comments' :key='item.commentId' class="commentsBox">
      <Comment :comment ='item' :from='from' @mouseover='showCards(index, item.dapp.dappId)' @mouseout='hideCards'></Comment>
      <DappCard class="dappCard" :list='dappDetail' :isAnimate='animate' :isTron = 'dappDetail.chain_name === "tron"' :isEos = 'dappDetail.chain_name === "eos"' v-if='index === currentCommentIndex'></DappCard>
      </div>
    </div>
   <!--  <div class="right">
      <div class="recommend">
        <p class="title">{{$t('lang.recommendDapp')}}</p>
        <div v-for='(list, index) in dapps' :key='index' class="dappsBox">
          <div class="itemBox" @click='showDetail(list)'>
            <div class="dappIcons"><img :src="list.avatar" alt="avatar" ></div>
            <div class="dappDetails">
              <p class="dappNames">{{list.name}}</p>
              <p class="authors">{{list.author}}</p>
            </div>
            <div class="rates">
              <span style="float: left;margin-left: -7px;margin-top:36px;width: 7px; height: 14px;">
                <img src="../../assets/img/triangleLeft.png" width="7px" height="14px"></span>
              <p class="stars">
                <span>{{list.rating[0]}}</span>
                <CustomRate  :stars = 'list.rating[0]'></CustomRate>
              </p>
              <p class="views">{{list.views}} views</p>
            </div>
          </div>
        </div>
      </div>
      <div class="guess">
        <p class="title">{{$t('lang.guessYouLike')}}</p>
        <ul class="guessList">
          <li v-for='(item, index) in guess' :key='index' @click='toDetail(item)'>
            <button class="dot"></button>
            <p>{{item.title}}</p>
          </li>
        </ul>
      </div>
    </div> -->
    </div>
  </div>
</template>
<script type="text/javascript">
import Discussion from '../detail/discussion.vue'
import Comment from '../detail/comment.vue'
import CustomRate from '../../components/CustomRate.vue'
import DappCard from '../../components/DappCard.vue'
import {COMMUNITY} from '../../common/Contants.js'
import {articles, commentRecommends, recommends, articleRecommends, dappsDetail} from '../../util/axios.js'
export default {
  data () {
    return {
      from: COMMUNITY,
      articles: [],
      comments: [],
      dapps: [],
      dappDetail: {},
      guess: [],
      isHover: false,
      currentIndex: -1,
      currentCommentIndex: -1,
      animate: false
    }
  },
  mounted () {
    this.$refs.wrap.addEventListener('scroll', function (event) {
      window.eventBus.$emit('scroll', event)
    })
    this.getData()
  },
  methods: {
    getData () {
      articles().then(res => {
        if (res && res.status === 200) {
          this.articles = res.data.articles
        }
      })
      commentRecommends().then(res => {
        if (res && res.status === 200) {
          this.comments = res.data.comments
        }
      })
      recommends().then(res => {
        if (res && res.status === 200) {
          this.dapps = res.data.dapps.splice(0, 3)
        }
      })
      articleRecommends().then(res => {
        if (res && res.status === 200) {
          this.guess = res.data.articles
        }
      })
    },
    showDetail (info) {
      this.$router.push({name: 'Detail', params: {dappId: info.dappId}})
    },
    toDetail (info) {
      this.$router.push({name: 'Topics', params: {dappId: info.dappId}})
    },
    showCard (index, dappId) {
      this.currentIndex = index
      dappsDetail(dappId).then(res => {
        if (res && res.status === 200) {
          this.dappDetail = res.data
        }
      })
    },
    hideCard () {
      this.currentIndex = -1
    },
    showCards (index, dappId) {
      this.currentCommentIndex = index
      dappsDetail(dappId).then(res => {
        if (res && res.status === 200) {
          this.dappDetail = res.data
        }
      })
    },
    hideCards () {
      this.currentCommentIndex = -1
    }
  },
  components: {
    Discussion,
    Comment,
    CustomRate,
    DappCard
  }
}
</script>
<style type="text/css" scoped>
.wrap {
  width: 100%;
  position: absolute;
  top: 74px;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 10px 0;
  margin: 0;
  background: #f5f7f6;
  overflow: auto;
}
.centerBox {
  width: 652px;
  min-width: 652px;
  padding-bottom: 20px;
  float: left;
}
.contentBox {
  width: 982px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
}
.articlesBox {
  position: relative;
  width: 100%;
  background: #fff;
  margin-bottom: 10px;
}
.commentsBox {
  position: relative;
  width: 100%;
  background: #fff;
}
.right {
  width: 319px;
  margin-top: 10px;
  margin-left: 10px;
}
.recommend {
  position: relative;
  padding-top: 20px;
  background: #fff;
}
.title {
  color: #666666;
  font-size: 12px;
  text-align: left;
  line-height: 15px;
  margin-left: 20px;
  margin-bottom: 15px;
}
.guess {
  position: relative;
  width: 319px;
  height: 328px;
  margin-top: 10px;
  padding-top: 20px;
  display: inline-block;
  background: #fff;
}
.guessList {
  position: relative;
  padding-left: 20px;
}
.guessList li {
  color: #333;
  font-size: 12px;
  height: 15px;
  line-height: 15px;
  margin-bottom: 10px;
  text-align: left;
  display: flex;
  align-items: center;
}
.guessList li p {
  margin-left: 10px;
  font-size: 14px;
  color: #333;
  width: 250px;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  display: inline;
}
.guessList li:hover {
  cursor: pointer;
  text-decoration: underline;
}
.guess .dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #d9d9d9;
}
.itemBox {
  width: 320px;
  height: 86px;
  padding-left: 20px;
  display: flex;
  padding-top: 12px;
}
.itemBox:hover {
  background: #6D64FB;
  cursor: pointer;
}
.itemBox:hover .author,.itemBox:hover .dappName {
  color: #fff;
}
.dappsBox {
  width: 450px;
  position: relative;
}
.dappCard {
  position: absolute;
  top: 55px;
  left: 147px;
  width: 302px;
  height: 150px;
  border-radius: 8px;
  z-index: 100;
  background: #fff;
  box-shadow: 4px 2px 12px 3px rgba(202, 203, 207, 44)
}
.dappIcons {
  width: 66px;
  height: 66px;
}
.dappIcons img {
  width: 100%;
  height: 100%;
  display: block;
}
.dappDetails {
  width: 205px;
  text-align: left;
  margin-left: 15px;
  float: left;
  top: 12px;
}
.dappDetails .dappNames {
  font-size: 14px;
  line-height: 14px;
  font-weight: bold;
  color: #000;
}
.dappDetails .authors {
  margin-top: 10px;
  font-size: 14px;
  line-height: 14px;
  color: #666;
}
.itemBox:hover .dappNames{
  color: #fff;
}
.itemBox:hover .authors{
  color: #fff;
}
.rates {
  width: 120px;
  height: 86px;
  position: absolute;
  left: 320px;
  background: #fff;
  top: 0;
  display: none;
}
.itemBox:hover .rates {
  display: block;
}
.itemBox .author {
  font-size: 14px;
  line-height: 24px;
  color: #333;
}
.itemBox .dappName {
  font-size: 16px;
  font-weight: bold;
  line-height: 30px;
  color: #191b1b;
  width: 180px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow:ellipsis;
}
.itemBox .stars {
  text-align: left;
  padding-left: 10px;
  margin-top: 22px;
}
.itemBox .views {
  color: #999999;
  font-size: 12px;
  text-align: left;
  padding-left: 10px;
}
</style>
