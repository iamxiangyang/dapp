 <template>
  <div class="boxAll">
    <Scroll :on-reach-bottom="handleReachBottom" height=900 :loadingText='$t(loadingText)' :showLoading='showLoading' @wheel='handelScroll'>
      <div class="dappDetail">
        <div class="dappInfo">
          <div class="iconPosition">
            <img  :src="lists.avatar" alt="avatar" style="width: 66px; height: 66px">
          </div>
          <h2 class="dappName">{{lists.name}}</h2>
          <h3 class="author" v-if='lists.claimed'><span @click='toProfile(lists.userId)'>{{lists.author}}</span></h3>
          <div class="claim" v-else><CustomButton @click='claimAction'>{{$t('lang.claim')}}</CustomButton>
            <p>{{$t('lang.claimGuide')}}</p></div>
          <div class="dappAll">
            <div class="dappRank">
              <p class="spanLeft top">{{average}}<b><CustomeRate :stars = 'average'></CustomeRate></b></p>
              <p class="spanLeft bottom">{{allRatingNum}} {{$t('lang.timesRate')}} </p>
            </div>
            <div class="dappComment">
                <p class="spanCenter top">#{{lists.rank > 0 ? lists.rank : ''}}</p>
                <p class="spanCenter bottom">{{$t(categoryList[lists.catagory])}}</p>
            </div>
            <div class="commentOpen">
              <a target="_blank" :href="lists.url"><button class="dappToOpen">{{$t('lang.open')}}</button></a>
              <button class="dappToComment" @click='writeComment'>{{$t('lang.comments')}}</button>
            </div>
          </div>
        </div>
        <PreviewImgs :previews='lists.previews'></PreviewImgs>
        <div class="dappRow description">
          <h3>「{{$t('lang.introduction')}}」</h3>
          <p :class="brandFold? 'introduction' : 'introductionExtend'">{{lists.description}}</p>
          <p class="expand" v-if="len >285" @click="changeFoldState">
            <span class="more">{{brandFold?$t('lang.showMore'):$t('lang.collapse')}}&nbsp;</span>
            <span>
              <Icon :class="brandFold? 'show' : 'hide' " type="ios-arrow-down"></Icon>
              <Icon :class="brandFold? 'hide' : 'show' " type="ios-arrow-up"></Icon>
            </span>
          </p>
          <br style="clear:both;">
        </div>
        <div class="dappRow">
          <h3>「{{$t('lang.data')}}」</h3>
          <div style="margin-top: 10px"><DappData></DappData></div>
        </div>
        <div class="dappRow dappContract">
          <h3>「{{$t('lang.contract')}}」</h3>
          <ul class='contractBox'>
            <li v-for = "(item, index) in lists.contracts" :key ="index">
              <span class="contractNum">#{{index +1}}</span>
              <a target="_blank" :href="chainUrl + item">{{item}}</a>
            </li>
          </ul>
          <div class="unfold" v-if="contractsNum > 3" @click="changeContractFoldState">
            <span>all</span>
            <span v-text="'('+contractsNum+')'"></span>
            <span>&nbsp;
              <Icon type="ios-arrow-forward"></Icon>
            </span>
          </div>
        </div>
        <div class="userRatingWrap">
          <h3>「{{$t('lang.userRatings')}}」</h3>
          <div class="userRating">
            <div class="userRatingLeft">
              <p class="ratingStore">{{average}}</p>
              <p class="ratingSource"> {{$t('lang.fullMarks')}}</p>
            </div>
            <div class="userRatingRight">
              <p class="commentMount"><span>{{allRatingNum}}</span> {{$t('lang.timesRate')}}</p>
              <div class="ratingRatio" id='comment'>
                <p v-for ='(star, index) in ratings' :key='index'><CustomeRate :stars='5-index'></CustomeRate><Progress :percent="allRatingNum === 0 ? 0 : (star/allRatingNum) * 100" hide-info></Progress></p>
              </div>
            </div>
          </div>
        </div>
        <div class="userCommentWrap">
          <h3>「{{$t('lang.community')}}」</h3>
          <div class="itemBox">
            <SlideButton :tit='$t("lang.Comments")' :active='selected === "comment"' @click='showComment'></SlideButton>
            <SlideButton class='commentItem' :tit='$t("lang.topics")' :active='selected === "topic"' @click='showDiscussion'></SlideButton>
          </div>
        </div>
        <div style="padding: 0 10px;"><router-view v-on:endLoad='endLoad'></router-view></div>
        <div class='popContractList' v-show = "contractListShow" @click='allContractHide'>
          <div class="allContract">
            <h3>「{{$t('lang.contract')}}」</h3>
            <div class="contractMount">{{$t('lang.total')}} <span>{{contractsNum}}</span></div>
            <ul class="contractList">
              <li v-for = "(item, index) in lists.contracts" :key ="index">
                <span class="contractNum">#{{index +1}}</span>
                <a target="_blank" :href="'https://etherscan.io/address/'+ item">{{item}}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Scroll>
    <ClaimAlert :show='claimVisible' :dappName = 'lists.name' @close='hideClaim'></ClaimAlert>
  </div>
</template>
<script>
import {Icon, Progress, Option, Page} from 'iview'
import CustomeRate from '../../components/CustomRate.vue'
import Scroll from '../../common/scroll/scroll.vue'
import mySelect from '../../components/MySelect'
import {dappsDetail} from '../../util/axios.js'
import {mapGetters, mapState, mapMutations} from 'vuex'
import DappData from './dappData.vue'
import SlideButton from '../../components/SlideButton.vue'
import ClaimAlert from './ClaimAlert.vue'
import PreviewImgs from '../../components/PreviewImgs.vue'
import CustomButton from '../../components/CustomButton.vue'
import {ETH, TRON, EOS} from '../../common/Contants.js'
export default {
  name: 'Detail',
  data () {
    return {
      loadingText: 'lang.loadmore',
      chainUrl: '',
      selectind: 0,
      showLoading: true,
      lists: {},
      average: 0,
      ratings: [],
      allRatingNum: 0,
      contractsNum: 0,
      err: '',
      brandFold: true,
      contractFold: true,
      len: 0,
      contractListShow: 0,
      comments: [],
      model1: '',
      hasComment: false,
      firstCommentId: '',
      categoryList: ['lang.all', 'lang.games', 'lang.exchanges', 'lang.luckydraw', 'lang.others'],
      news: {},
      selected: 'comment',
      dappId: '',
      claimVisible: false
    }
  },
  components: {
    CustomeRate,
    Icon,
    Progress,
    Option,
    Page,
    Scroll,
    mySelect,
    DappData,
    SlideButton,
    ClaimAlert,
    PreviewImgs,
    CustomButton
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
    ...mapMutations('vc', ['setDappAuthorId']),
    claimAction () {
      if (!this.user) {
        this.$toast.show({
          toast: this.$t('lang.claimLoginToast'),
          type: 'error'
        })
        return
      } else if (this.user.status === 0) {
        this.$toast.show({
          toast: this.$t('lang.claimDevelopToast'),
          type: 'error'
        })
        return
      }
      this.claimVisible = true
    },
    hideClaim () {
      this.claimVisible = false
    },
    writeComment () {
      window.eventBus.$emit('checkVisible')
    },
    showComment () {
      this.selected = 'comment'
      this.$router.push({name: 'Comments', params: {dappId: this.dappId}})
    },
    showDiscussion () {
      this.selected = 'topic'
      this.$router.push({name: 'Topics', params: {dappId: this.dappId}})
    },
    toProfile (userId) {
      this.$router.push({name: 'Info', params: {userId: userId}})
    },
    endLoad () {
      this.loadingText = 'lang.nomore'
    },
    getPageData () {
      dappsDetail(this.dappId)
        .then((response) => {
          if (response && response.status === 200) {
            let data = response.data
            this.lists = data
            this.setDappAuthorId(data.userId)
            this.contractsNum = data.contracts.length
            this.len = data.description.length
            this.average = data.rating[0]
            this.ratings = [].concat(data.rating)
            this.ratings.splice(0, 1)
            this.ratings.reverse()
            this.allRatingNum = this.ratings.reduce((pre, cur) => {
              return pre + cur
            })
            switch (data.chain_name) {
              case 'tron':
                this.chainUrl = TRON
                break
              case 'eos':
                this.chainUrl = EOS
                break
              case 'eth':
                this.chainUrl = ETH
                break
              default:
                this.chainUrl = ETH
                break
            }
          }
        })
    },
    changeFoldState () {
      this.brandFold = !this.brandFold
    },
    changeContractFoldState () {
      this.contractFold = !this.contractFold
      this.contractListShow = 1
    },
    starChanged (val) {
      this.writeScore = val
    },
    handleReachBottom () {
      this.showLoading = true
      this.loadingText = 'lang.loadmore'
      return new Promise((resolve) => {
        setTimeout(() => {
          window.eventBus.$emit('refresh')
          resolve()
        }, 50)
      })
    },
    handelScroll (event) {
      window.eventBus.$emit('scroll', event)
    },
    allContractHide () {
      this.contractListShow = 0
    }
  },
  mounted () {
    if (this.$route.name === 'Comments') {
      this.selected = 'comment'
    } else {
      this.selected = 'topic'
    }
    this.dappId = this.$route.params.dappId
    this.getPageData()
  }
}
</script>

<style scoped>
.boxAll {
  width: 100%;
  min-width: 674px;
  margin: 0;
  padding: 0;
  top: 74px;
  bottom: 0;
  position: absolute;
  letter-spacing: 0.5px;
}
.boxAll>>>.ivu-scroll-container::-webkit-scrollbar {
  display:none
}
.dappDetail {
  width: 674px;
  margin: 0 auto;
  margin-bottom: 30px;
  background-color: #fff;
}
.show {
  text-align: center;
  margin-top: 2px;
  font-size: 14px;
  float: right;
  display: inline-block;
  transition: 0.1s;
}
.hide {
  float: right;
  display: none;
  transition: 0.1s;
}
.dappInfo {
  width: 100%;
}
.iconPosition {
  margin: 20px auto 6px;
  width: 66px;
  height: 66px;
  border-radius: 10px;
  background-color: #ccc;
}
.iconPosition img {
  border-radius: 10px;
}
.dappName {
  font-family: lato;
  font-weight: bold;
  font-size: 16px;
  line-height: 16px;
  height: 16px;
  margin-bottom: 5px;
  margin-top: 10px;
}
.author {
  font-size: 14px;
  line-height: 18px;
  height: 18px;
  margin-top: 5px;
  cursor: pointer;
  color: #8590A6;
}
.author:hover {
  text-decoration: underline;
}
.claim {
  position: relative;
}
.claim button {
  margin: 5px auto 0;
  position: relative;
  cursor: pointer;
}
.claim p {
  background: url(../../assets/img/leftExplain.png);
  background-size: 100% 100%;
  height: 28px;
  line-height: 28px;
  color: #999999;
  font-size: 12px;
  position: absolute;
  white-space:nowrap;
  top: 8px;
  left: 56%;
  text-align: left;
  padding-left: 10px;
  padding-right: 10px;
}
.dappAll {
  width: 672px;
  padding-top: 25px;
  padding-bottom: 20px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
}
.dappGeneral {
  width: 70%;
  height: 68px;
  float: left;
}
.commentOpen {
  width: 33%;
}
.commentOpen button{
  outline: none;
  border: none;
  border-radius: 10px;
  float: right;
}
.dappToComment {
  min-width: 96px;
  padding: 0 10px;
  height: 36px;
  background-color: #5BC7CB;
  word-spacing: 0.5px;
  font-size: 14px;
  color: #ffffff;
  border-radius: 10px;
  cursor: pointer;
  margin-right: 10px;
  float: left;
}
.dappToComment:hover {
  background: #54B8BB;
}
.dappToOpen:hover {
  background: #6159E1;
}
.dappToOpen {
  width: 73px;
  height: 36px;
  word-spacing: 0.5px;
  background-color: #6D64FB;
  color: #fff;
  border-radius: 10px;
  cursor: pointer;
  float: right;
}
.top {
  font-size: 14px;
  line-height: 14px;
  color: #333;
}
.bottom {
  margin-top: 10px;
  font-size: 12px;
  line-height: 12px;
  color: #666;
}
.dappRank {
  width: 33%;
}
.dappComment {
  width: 33%;
}
.dappGeneral span {
  display: inline-block;
  width: 32%;
}
.spanLeft {
  text-align: left;
}
.spanCenter {
  text-align: center;
}
.triangle {
  display: none;
  position: absolute;
  top: -15px;
  left: 46%;
  width: 10px !important;
  height: 8px !important;
  z-index: 9999;
}
.active {
  display: block;
  position: absolute;
  top: -15px;
  left: 46%;
  width: 10px !important;
  height: 8px !important;
  z-index: 9999;
}

.introduction {
  width: 633px;
  font-size: 14px;
  line-height: 24px;
  color: #666;
  display: -webkit-box;
  overflow: hidden;
  white-space: normal!important;
  text-overflow: ellipsis;
  word-wrap: break-word;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  transition: height 1s;
}
.introductionExtend {
  width: 633px;
  font-size: 14px;
  line-height: 24px;
  color: #666;
  transition: height 1s;
}
.introduction::-webkit-scrollbar {
  display:none
}
.expand {
  width: 100px;
  height: 15px;
  text-align: right;
  float: right;
  margin-top: 15px;
  font-size: 12px;
  cursor: pointer;
}

.dappContract {
  overflow: hidden;
}
.dappRow{
  text-align: left;
  margin: 10px auto 0;
  padding: 20px 20px 10px 20px;
  width: 674px;
  border-radius: 10px;
  border: solid 1px #dedede;
}
.dappRow h3 {
  font-family: lato;
  font-weight: bold;
  font-size: 16px;
  line-height: 22px;
  margin-left: -10px;
  margin-bottom: 10px;
}
.contractBox {
  width: 634px;
  max-height: 100px;
  padding-left: 20px;
  font-size: 14px;
  overflow: hidden;
  transition: height 2s;
}
.contractBoxExtend {
  width: 634px;
  height: auto;
  padding-left: 20px;
  font-size: 14px;
  transition: 0.3s;
  transition: height 2s;
}
.unfold {
  width: 80px;
  height: 15px;
  text-align: right;
  float: right;
  margin-top: 15px;
  font-size: 12px;
  cursor: pointer;
}
.contractBox::-webkit-scrollbar {
  display:none
}
.contractNum {
  margin-right: 20px;
}
.dappContract:hover .contractBox {
  display: block;
}
.contractBox li {
  line-height: 34px;
}
.contractBox li a {
  font-size: 14px;
}
.contractBox >>> a {
  color: #666;
}
.contractBox >>> a:hover {
  color: #4aa5f5;
  text-decoration: underline;
}
.contractBoxExtend li {
  line-height: 34px;
}
.contractBoxExtend li a {
  font-size: 14px;
}
.contractBoxExtend >>> a {
  color: #666;
}
.contractBoxExtend >>> a:hover {
  color: #4aa5f5;
  text-decoration: underline;
}
.userRatingWrap {
  text-align: left;
  width: 674px;
  height: 190px;
  padding: 10px;
  margin: 0 auto;
}
.userRatingWrap h3 {
  font-family: lato;
  font-weight: bold;
  font-size: 16px;
  line-height: 22px;
  margin-bottom: 10px;
}
.userRating {
  width: 380px;
  height: 138px;
  margin: 10px auto;
}
.userRatingLeft {
  width: 120px;
  height: 60px;
  float: left;
  border:1px dashed #dedede;
  margin-top: 35px;
  text-align: center;
}
.userRatingRight {
  width: 250px;
  height: 138px;
  float: right;
  text-align: left;
  background: #fff;
}
.userRatingRight p {
  text-align: left;
  height: 18px;
  font-size: 14px;
  line-height: 18px;
}
.commentMount {
  margin-bottom: 8px;
  font-size: 14px;
  line-height: 18px;
}
.commentMount {
  font-size: 14px;
  line-height: 18px;
}
.ratingStore {
  margin-top: 10px;
  height: 22px;
  font-size: 18px;
  line-height: 22px;
}
.ratingStore span {
  font-size: 18px;
  line-height: 22px;
}
.ratingSource {
  font-size: 12px;
  line-height: 15px;
  margin-top: 5px;
}
.ratingSource span {
  font-size: 12px;
  line-height: 15px;
}
.ratingRatio {
  width: 300px;
  height: 120px;
}
.ratingRatio p{
  height: 24px;
}
.ratingRatio span img {
  width: 15px;
}
.ratingRatio >>> .ivu-rate {
  margin-right: 10px !important;
}
.ratingRatio >>> .ivu-rate-star {
  margin-right: 0px !important;
}
.ratingRatio >>> .ivu-rate-star-full:before {
  color: #FFDB73 !important;
}
.ratioBar {
  display: inline-block;
  width: 160px;
  height: 5px;
  background: #000;
}
.userCommentWrap {
  text-align: left;
  width: 674px;
  margin: 0 auto 40px;
}
.userCommentWrap h3 {
  font-family: lato;
  font-weight: bold;
  font-size: 16px;
  line-height: 22px;
  margin-bottom: 10px;
}
.commentItem {
  margin-left: 60px;
  min-width: 100px;
}
.itemBox {
  height: auto;
  margin: 0 auto;
  display: flex;
  justify-content: center;
}
.breakline {
  font-size: 14px;
  margin-top: 20px;
  margin-bottom: 20px;
  color: #333333;
  text-align: center;
  letter-spacing: 0.5px;
}
.ivu-progress {
  width: 170px;
  stroke-width: 5px;
}
.ratingRatio>>>.ivu-progress-inner {
  height: 5px !important;
}
.ratingRatio>>>.ivu-progress-bg {
  height: 5px !important;
}
.bian {
  appearance: none;
  width: 92px;
  height: 25px;
  position: absolute;
}
.commentWrap {
  width: 652px;
  height: auto;
  margin-left: 20px;
  overflow: hidden;
}
.Pagination {
  margin: 0 auto;
  text-align: center;
}
.popContractList{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.6);
}
.allContract {
  width: 760px;
  height: 345px;
  padding-top: 20px;
  padding-bottom: 40px;
  overflow-y: auto;
  border: 1px solid #979797;
  border-radius: 10px;
  background: #fff;
  text-align: left;
  margin: auto;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.allContract h3 {
  display: inline-block;
  font-size: 16px;
  font-family: lato-bold;
  line-height: 22px;
  margin-left: 10px;
}
.contractMount {
  width: 90px;
  height: 22px;
  border-radius: 5px;
  text-align: center;
  display: inline-block;
  background: #F5F7F6;
  font-size: 12px;
  line-height: 22px;
}
.contractList {
  width: 100%;
  height: auto;
  padding-left: 70px;
}
.contractList li {
  width: 100%;
  height: 18px;
  margin-top: 10px;
  font-size: 14px;
  line-height: 18px;
  color: #666;
}
.contractList li a {
  font-size: 14px;
  line-height: 18px;
  color: #666;
}
/*滚动条样式*/
.allContract::-webkit-scrollbar {/*滚动条整体样式*/
  width: 20px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 130px;
}
.allContract::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
  background: rgba(0,0,0,0.2);
}
.allContract::-webkit-scrollbar-track {/*滚动条里面轨道*/
  border-radius: 10px;
}
</style>
<style type="text/css">
.ivu-scroll-loader {
  height: 0 !important;
}
</style>
