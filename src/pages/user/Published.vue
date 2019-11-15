<template>
  <div class='publish'>
    <div class='box'>
      <header v-show='isOwner'>
        <div class='state'  :class= '{selected: selectedIndex === 0}' @click='all'><i class="icon iconfont icon-All"></i><span>{{$t('lang.all')}}</span></div>
        <div class='state' :class= '{selected: selectedIndex === 1}' @click='stored'><i class="icon iconfont icon-Published"></i><span>{{$t('lang.launched')}}</span></div>
        <div class='state'  :class= '{selected: selectedIndex === 2}' @click='notReviewed'><i class="icon iconfont icon-Unapprove"></i><span>{{$t('lang.unapprove')}}</span></div>
        <div class='state' :class= '{selected: selectedIndex === 3}' @click='frozen'><i class="icon iconfont icon-Frozen"></i><span>{{$t('lang.frozen')}}</span></div>
        <div class='state' :class= '{selected: selectedIndex === 4}' @click='pending'><i class="icon iconfont icon-Approving"></i><span>{{$t('lang.approving')}}</span></div>
      </header>
      <div class="placeBox" v-if='dapps.length === 0'><img src="../../assets/img/nullPlace.png">{{$t('lang.nocontent')}}</div>
      <div class='itemList' v-else>
        <ul>
          <li class='item'  v-for = '(item, index) in dapps' :key='index' @mouseover='coverIndex = index' @mouseout='coverIndex = false'>
            <div class='coverView' v-show='coverIndex === index && isOwner'>
              <p v-if='item.reason'>{{$t('lang.reason')}}:{{item.reason}}</p>
              <div class="btnBox">
              <button @click='modify(item)' class="modify">{{$t('lang.change')}}</button>
              <button @click='showDetail(item)' class="views" v-if='item.status === 1'>{{$t('lang.view')}}</button>
              </div>
            </div>
            <img :src= 'item.avatar' class='left'>
            <div class='mid'>
              <p class='itemName'>{{item.name}}</p>
              <p class='itemClassify'>{{$t(categoryList[item.catagory])}}</p>
              <p class='itemStar'><span class="rate">{{item.rating[0]}}</span><CustomRate :stars = 'item.rating[0]'></CustomRate></p>
              <p class='itemRate'>{{item.views}} {{$t('lang.timesRate')}}</p>
            </div>
            <div class='right'>
              <p class='stateText' :class='classList[item.status]'><span v-show='isOwner'>{{$t(statusList[item.status])}}</span></p>
              <p class='time'>{{item.updateTime | formatDate}}</p>
            </div>
          </li>
        </ul>
      </div>
     </div>
  </div>
</template>
<script type='text/javascript'>
import CustomRate from '../../components/CustomRate.vue'
import {myDapps} from '../../util/axios.js'
import {mapState, mapMutations} from 'vuex'
export default {
  data () {
    return {
      classList: ['', 'stateText_one', 'stateText_two', 'stateText_three', 'stateText_four'],
      isAllActive: true,
      isStoredActive: false,
      isFrozenActive: false,
      isNotReviewedActive: false,
      isPendingActive: false,
      selectedIndex: 0,
      dapps: [],
      coverIndex: false,
      start: 0,
      limit: 10,
      categoryList: ['lang.all', 'lang.games', 'lang.exchanges', 'lang.luckydraw', 'lang.others'],
      statusList: ['lang.approving', 'lang.launched', '', '', 'lang.frozen', 'lang.unapprove'],
      isOwner: false,
      userId: ''
    }
  },
  components: {
    CustomRate
  },
  computed: {
    ...mapState({
      user: state => state.userInfo.user
    })
  },
  mounted () {
    let that = this
    window.eventBus.$on('loadMore', function () {
      if (that.$route.name === 'Published') {
        that.start += 10
        that.getDapps({load: true})
      }
    })
    that.userId = this.$route.params['userId']
    if (that.user && that.userId && that.userId.toString() === this.user.userId.toString()) {
      that.isOwner = true
    }
    that.getDapps()
    that.showLoad()
  },
  methods: {
    ...mapMutations('userInfo', ['setDappId']),
    ...mapMutations('vc', ['setLoadText', 'showLoad']),
    showDetail (item) {
      this.$router.push({name: 'Detail', params: {dappId: item.dappId}})
    },
    modify (item) {
      this.setDappId(item.dappId)
      this.$router.push({name: 'PublishedEdit', params: {dappId: item.dappId}})
    },
    all () {
      this.exchangeStatus(0, -1)
    },
    stored () {
      this.exchangeStatus(1, 1)
    },
    notReviewed () {
      this.exchangeStatus(2, 5)
    },
    frozen () {
      this.exchangeStatus(3, 4)
    },
    pending () {
      this.exchangeStatus(4, 0)
    },
    exchangeStatus (index, status) {
      this.selectedIndex = index
      this.start = 0
      if (status >= 0) {
        this.getDapps({status: status})
      } else {
        this.getDapps()
      }
    },
    getDapps ({limit = 10, status, load = false} = {}) {
      myDapps(this.userId, this.start, limit, status).then((res) => {
        if (res && res.status === 200) {
          if (res.data.dapps.length < 10) {
            this.setLoadText('lang.nomore')
          }
          if (load) {
            this.dapps = this.dapps.concat(res.data.dapps)
          } else {
            this.dapps = res.data.dapps
          }
        }
      })
    }
  }
}
</script>
<style type='text/css' scoped>
button {
  outline: none;
  border: none;
}
.publish {
  width: 100%;
  margin: 0;
  padding: 0;
  font-family: Lato-Regular;
  letter-spacing: 0.5px;
  display: flex;
  justify-content: center;
}
.box {
  width: 985px;
  margin: 30px auto;
}
header {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
}
.state {
  padding-left: 10px;
  padding-right: 10px;
  height: 36px;
  line-height: 36px;
  border: 1px solid #EBEBEB;
  color: #8590A6;
  font-size: 14px;
  border-radius: 8px;
  margin-left: 20px;
  text-align: left;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: default;
}
.state:hover {
  color: #6D64FB;
  cursor: pointer;
  border: 1px solid #6D64FB;
}
.selected {
  color: #6D64FB;
  border: 1px solid #6D64FB;
}
.state img {
  width: 15px;
  height: 15px;
}
.state span {
  margin-left: 10px;
}
.itemList {
  width: 100%;
  height: auto;
  margin-top: 10px;
}
.itemList ul {
 max-width: 1080px;
}
.item {
  float: left;
  width: 482px;
  height: 137px;
  background: #FFFFFF;
  padding: 0 0 20px 20px;
  margin-top: 20px;
  border-radius: 10px;
  display: flex;
  position: relative;
}
.item:nth-child(even) {
  margin-left: 20px;
}
.item:hover {
  cursor: pointer;
  box-shadow: 0 2px 20px 0 #d8d8d8;
}
.coverView {
  background: rgba(255, 255, 255, 0.95);
  position: absolute;
  border-radius: 10px;
  padding: 0;
  margin: 0;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 10;
}
.coverView p {
  margin-left: 25px;
  margin-top: 20px;
  color: #333333;
  font-size: 12px;
}
.btnBox {
  position: absolute;
  right: 20px;
  bottom: 20px;
  height: 36px;
}
.modify {
  width: auto;
  min-width: 60px;
  padding: 0 10px;
  height: 36px;
  border-radius: 10px;
  background: rgb(40, 202, 203);
  color: #ffffff;
  cursor: pointer;
}
.views {
  width: auto;
  min-width: 60px;
  padding: 0 10px;
  height: 36px;
  margin-left: 10px;
  border-radius: 10px;
  background: rgb(106, 86, 255);
  color: #ffffff;
  cursor: pointer;
}
.left {
  margin-top: 20px;
  width: 66px;
  height: 66px;
  border-radius: 10px;
}
.mid {
  margin-left: 20px;
  margin-top: 15px;
  width: 235px;
}
.itemName {
  font-weight: bold;
  font-size: 18px;
  color: #000000;
  line-height: 22px;
  height: 22px;
  text-overflow:ellipsis;
  overflow: hidden;
  white-space:nowrap;
}
.itemClassify {
  font-size: 14px;
  color: #333333;
  height: 17px;
  line-height: 17px;
  margin-top: 10px;
}
.itemStar {
  color: #666666;
  font-size: 14px;
  height: 17px;
  line-height: 17px;
  margin-top: 10px;
}
.starImg {
  width: 75px;
  height: 14px;
  margin-left: 5px;
}
.itemRate {
  font-size: 12px;
  color: #999999;
  height: 17px;
  line-height: 17px;
  margin-top: 10px;
}
.rate {
  margin-right: 5px;
}
.right {
  margin-top: 20px;
  margin-right: 15px;
  display: inline-block;
  text-align: right;
}
.stateText {
  height: 26px;
  line-height: 26px;
  border-radius: 5px;
  text-align: center;
  font-size: 14px;
  margin-right: 0;
  display: inline-block;
}
.stateText_one {
  color: #3C99FC;
}
.stateText_two {
  color: #F55452;
}
.stateText_three {
  color: #FFFFFF;
  background: #D9D9D9;
  width: 62px;
}
.stateText_four {
  color: #607E9F;
}
.time {
  color: #999999;
  font-size: 12px;
  margin-top: 55px;
}
.placeBox {
  width: 100%;
  margin-top: 58px;
  text-align: center;
  font-size: 14px;
  color: #64442C;
}
.placeBox img {
  width: 80px;
  height: 54px;
  margin: 0 auto;
  display: block;
}
@media screen and (max-width: 960px) {
  .item:nth-child(even) {
    margin-left: 0;
  }
  .itemList ul {
    margin: 10px auto;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>
