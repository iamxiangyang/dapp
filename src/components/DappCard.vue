<template>
  <div class="Box" @click = 'toDetail(list.dappId)'>
    <div class="Icon">
      <img :src="list.avatar" alt="avatar">
      <button class="tron" v-show='isTron'>TRON</button>
      <button class="eos" v-show='isEos'>EOS</button>
    </div>
    <div class="Detail">
      <p class="Name">{{list.name}}</p>
      <p class="Author">
        {{list.author}}
      </p>
      <p class="starRating">
        <span>{{list.rating && list.rating[0]}}</span>
        <CustomRate  :stars = 'list.rating && list.rating[0]'></CustomRate>
      </p>
      <p class="rate">{{list.rating | getAll}} {{$t('lang.timesRate')}}</p>
      <p class="views"><span class="viewContent" :class='{"hide":isAnimate}'>{{list.views}} {{$t('lang.views')}} </span><span class="arrow"><img src="../assets/img/arrow.png" alt="arrow"></span></p>
    </div>
  </div>
</template>
<script type="text/javascript">
import CustomRate from './CustomRate.vue'
import {mapState} from 'vuex'
export default {
  name: 'DappCard',
  props: {
    list: {
      type: Object
    },
    isTron: {
      type: Boolean
    },
    isEos: {
      type: Boolean
    },
    isAnimate: {
      default: true,
      type: Boolean
    }
  },
  components: {
    CustomRate
  },
  computed: {
    ...mapState({
      catagoryId: state => state.vc.catagoryId
    })
  },
  methods: {
    toDetail (dappId) {
      this.$router.push({path: 'dapp/' + dappId})
    }
  },
  filters: {
    getAll: (val) => {
      if (!val) {
        return
      }
      let arr = [].concat(val)
      arr.splice(0, 1)
      return arr.reduce((pre, cur) => {
        return pre + cur
      })
    }
  }
}
</script>
<style type="text/css" scoped>
.Box {
  padding-top: 20px;
  padding-left: 15px;
  background: inherit;
  overflow: hidden;
  border-radius: 8px;
}
.Box .Icon {
  width: 66px;
  height: 66px;
  border-radius: 10px;
  float: left;
}
.Box .Icon img {
  display: block;
  border-radius: 10px;
  width: 100%;
  height: 66px;
}
.Box .tron {
  width: 50px;
  height: 24px;
  background: #FF9792;
  font-size: 12px;
  color: #fff;
  margin-top: 10px;
  border-radius: 4px;
}
.Box .eos {
  width: 50px;
  height: 24px;
  background: #5BC7CB;
  font-size: 12px;
  color: #fff;
  margin-top: 10px;
  border-radius: 4px;
}
.Box .Detail {
  width: 205px;
  text-align: left;
  float: left;
  margin-left: 15px;
}
.Box .Name {
  font-size: 16px;
  font-weight: bold;
  line-height: 18px;
  color: #191b1b;
  width: 180px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow:ellipsis;
}

.Box .Author {
  margin-top: 5px;
  font-size: 14px;
  line-height: 24px;
  color: #333;
}
.Box .starRating {
  font-size: 14px;
  line-height: 24px;
  color: #666;
}
.Box .starRating >>> .ivu-rate-star {
  margin-right: 0px !important;
}
.Box .starRating >>> .ivu-rate {
  margin-right: 20px !important;
}
.Box .rate {
  font-size: 12px;
  line-height: 22px;
  color: #999;
}
.Box .views {
  float: right;
  margin-right: 15px;
  height: 14px;
}
.Box .viewContent {
  float: left;
  text-align: right;
  line-height: 14px;
  color: #999;
  font-size: 12px;
}
.Box .hide {
  display: none;
}
.Box .arrow {
  display: inline-block;
  width: 14px;
  height: 14px;
  overflow: hidden;
}
.Box .arrow img {
  width: 6px;
  height: 10px;
  line-height: 10px;
  margin-left: 5px;
  padding-right: 20px;
}
.Box:hover .arrow img {
  padding-right: 0;
  transition-delay: .2s;
  transition: .5s;
}
.Box:hover .hide {
  display: block;
}
</style>
