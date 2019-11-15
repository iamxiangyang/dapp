<template>
  <div class="dataWrap">
    <div class="highLight" :class='chainBg'>
      <span>{{$t('lang.dappTotal')}}:{{dappCount}}</span>
      <span>{{$t('lang.totalTransaction24')}}:{{infos.trans_amount_total}}</span>
      <span>{{$t('lang.totalDailyLife')}}:{{infos.user_total}}</span>
      <span>{{$t('lang.totalTradingVolume24')}}:{{infos.trans_volume_total}}ETH</span>
      <span>{{$t('lang.totalContracts')}}: {{contractCount}}</span>
    </div>
    <div class="btns">
      <SlideButton class='btn' :tit='$t("lang.all")' :active='select === "all"' @click='changChain("all")'></SlideButton>
      <SlideButton class='btn' tit='TRON' :active='select === "tron"' @click='changChain("tron")'></SlideButton>
      <SlideButton class='btn' tit='EOS' :active='select === "eos"' @click='changChain("eos")'></SlideButton>
      <SlideButton class='btn' tit='ETH' :active='select === "eth"' @click='changChain("eth")'></SlideButton>
    </div>
    <div class="allBox">
      <div class="allTit" @click='showDetail(0)'>
        <span class='leftSpan'>「{{$t(dappCategorys[0])}}」</span>
        <button class="rightBtn">{{$t('lang.all')}} ></button>
      </div>
      <DataTable :info='allRank'></DataTable>
    </div>
    <div class="otherRow">
      <div class="otherBox"><DataList :name='dappCategorys[1]' :datas='gameRank' @showAll='showDetail(1)'></DataList></div>
      <div class="otherBox rightOther"><DataList :name='dappCategorys[2]' :datas='marketRank' @showAll='showDetail(2)'></DataList></div>
      <div class="otherBox"><DataList :name='dappCategorys[3]' :datas='luckyRank' @showAll='showDetail(3)'></DataList></div>
      <div class="otherBox rightOther"><DataList :name='dappCategorys[4]' :datas='otherRank' @showAll='showDetail(4)'></DataList></div>
    </div>
    <div style="clear: both;"></div>
    <div class="pieRow">
      <DataPie></DataPie>
    </div>
    <div class="lineRow">
      <DataLine v-if='chainList'></DataLine>
    </div>
    <div><DataAlert :info = 'alertList' :title='tit' :isShow='show' @close='hideAlert'></DataAlert></div>
  </div>
</template>
<script type="text/javascript">
import DataList from './DataList.vue'
import DataPie from './DataPie.vue'
import DataLine from './DataLine.vue'
import {chainsRank, chainsRankWithCategoryID, chainRankWithChainID, chainRankWithChainAndCategory, statisticsSummary, chains} from '../../util/axios.js'
import SlideButton from '../../components/SlideButton.vue'
import DataAlert from './DataAlert.vue'
import DataTable from './DataTable.vue'
import {mapMutations, mapState} from 'vuex'
export default {
  data () {
    return {
      allRank: [],
      gameRank: [],
      marketRank: [],
      luckyRank: [],
      otherRank: [],
      dappCategorys: ['lang.all', 'lang.games', 'lang.exchanges', 'lang.luckydraw', 'lang.others'],
      infos: {},
      contractCount: 0,
      dappCount: 0,
      select: 'all',
      show: false,
      tit: '',
      alertList: [],
      chainBg: 'all_bg'
    }
  },
  mounted () {
    this.getChains()
  },
  computed: {
    ...mapState({
      chainList: state => state.vc.chains
    })
  },
  methods: {
    ...mapMutations('vc', ['setChains']),
    getChains () {
      chains().then(res => {
        if (res && res.status === 200) {
          this.setChains(res.data)
          this.getChainsRankAll()
          this.getStationData()
        }
      })
    },
    hideAlert () {
      this.show = false
    },
    showDetail (type) {
      this.show = true
      this.tit = this.dappCategorys[type]
      if (type === 0) {
        chainsRank(0, 100).then(res => {
          if (res && res.status === 200) {
            this.alertList = res.data.statistics
          }
        })
      } else {
        chainsRankWithCategoryID(type, 0, 100).then(res => {
          if (res && res.status === 200) {
            this.alertList = res.data.statistics
          }
        })
      }
    },
    changChain (category) {
      this.select = category
      switch (category) {
        case 'all':
          // this.chainBg = 'all_bg'
          this.getChainsRankAll()
          break
        case 'tron':
          // this.chainBg = 'tron_bg'
          this.getChainRankWithChainID(this.chainList['tron'])
          break
        case 'eos':
          // this.chainBg = 'eos_bg'
          this.getChainRankWithChainID(this.chainList['eos'])
          break
        case 'eth':
          // this.chainBg = 'eth_bg'
          this.getChainRankWithChainID(this.chainList['eth'])
          break
        default:
          this.getChainsRankAll()
          break
      }
    },
    getChainRankWithChainID (chainID) {
      chainRankWithChainID(chainID).then(res => {
        if (res && res.status === 200) {
          this.allRank = res.data.statistics
        }
      })
      chainRankWithChainAndCategory(chainID, 1).then(res => {
        if (res && res.status === 200) {
          this.gameRank = res.data.statistics
        }
      })
      chainRankWithChainAndCategory(chainID, 2).then(res => {
        if (res && res.status === 200) {
          this.marketRank = res.data.statistics
        }
      })
      chainRankWithChainAndCategory(chainID, 3).then(res => {
        if (res && res.status === 200) {
          this.luckyRank = res.data.statistics
        }
      })
      chainRankWithChainAndCategory(chainID, 4).then(res => {
        if (res && res.status === 200) {
          this.otherRank = res.data.statistics
        }
      })
    },
    getChainsRankAll () {
      chainsRank().then(res => {
        if (res && res.status === 200) {
          this.allRank = res.data.statistics
        }
      })
      chainsRankWithCategoryID(1).then(res => {
        if (res && res.status === 200) {
          this.gameRank = res.data.statistics
        }
      })
      chainsRankWithCategoryID(2).then(res => {
        if (res && res.status === 200) {
          this.marketRank = res.data.statistics
        }
      })
      chainsRankWithCategoryID(3).then(res => {
        if (res && res.status === 200) {
          this.luckyRank = res.data.statistics
        }
      })
      chainsRankWithCategoryID(4).then(res => {
        if (res && res.status === 200) {
          this.otherRank = res.data.statistics
        }
      })
    },
    getStationData () {
      statisticsSummary().then(res => {
        if (res && res.status === 200) {
          this.infos = res.data.yesterday_statistics
          this.dappCount = res.data.dapp_count['0']
          this.contractCount = res.data.contract_count
        }
      })
    }
  },
  components: {
    DataList,
    DataPie,
    DataLine,
    SlideButton,
    DataAlert,
    DataTable
  }
}
</script>
<style type="text/css" scoped="data">
  .dataWrap {
    width: 100%;
    top: 74px;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0;
    padding: 0;
    position: absolute;
  }
  .highLight {
    left: 0;
    right: 0;
    width: 100%;
    position: fixed;
    height: 24px;
    line-height: 24px;
    z-index: 100;
  }
  .all_bg {
    background: #489FFF;
  }
  .tron_bg {
    background: #5BC7CB;
  }
  .eos_bg {
    background: #8F48FF;
  }
  .eth_bg {
    background: #6D64FB;
  }
  .highLight span {
    color: #fff;
    font-size: 12px;
    margin-right: 115px;
  }
  .btns {
    margin: 45px auto 0;
    display: flex;
    justify-content: center;
  }
  .btns .btn{
    margin-right: 75px;
  }
  .allBox {
    width: 1117px;
    height: 328px;
    margin: 20px auto;
  }
  .allTit {
    width: 100%;
    height: 38px;
    line-height: 38px;
    border-radius: 6px;
    background: rgba(133, 144, 166, 0.1);
  }
  .leftSpan {
    float: left;
    color: #333;
    font-size: 14px;
    font-weight: bold;
    height: 17px;
  }
  .rightBtn {
    float: right;
    margin-right: 10px;
    background: none;
    color: #8590A6;
    font-size: 12px;
  }
  .allTit:hover {
    background: #6D64FB;
  }
  .allTit:hover .leftSpan,.allTit:hover .rightBtn {
    color:#fff;
  }
  .otherRow {
    width: 1117px;
    margin: 0 auto;
  }
  .rightOther {
    margin-left: 15px;
  }
  .otherBox {
    width: 551px;
    float: left;
    margin-top: 10px;
  }
  .pieRow {
    width: 1117px;
    border: 1px solid #ebebeb;
    margin: 10px auto 0;
  }
  .lineRow {
    width: 1117px;
    margin: 10px auto;
  }
</style>
