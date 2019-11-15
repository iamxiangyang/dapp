<template>
  <div>
    <div class="lineBox">
      <p class="lineTitle">「{{$t('lang.dailyUser')}}」</p>
      <div class="btns">
        <SlideButton class='btn' :tit='$t("lang.all")' :active='select[0] === "all"' @click='changChain("all", 2)'></SlideButton>
        <SlideButton class='btn' tit='ETH' :active='select[0] === "eth"' @click='changChain("eth", 2)'></SlideButton>
        <SlideButton class='btn' tit='TRON' :active='select[0] === "tron"' @click='changChain("tron", 2)'></SlideButton>
        <SlideButton class='btn' tit='EOS' :active='select[0] === "eos"' @click='changChain("eos", 2)'></SlideButton>

      </div>
      <div id='dailyUser' class="line"></div>
    </div>
    <div class="lineBox">
      <p class="lineTitle">「{{$t('lang.dailyTurnover')}}」</p>
      <div class="btns">
        <SlideButton class='btn' :tit='$t("lang.all")' :active='select[1] === "all"' @click='changChain("all", 3)'></SlideButton>
        <SlideButton class='btn' tit='ETH' :active='select[1] === "eth"' @click='changChain("eth", 3)'></SlideButton>
        <SlideButton class='btn' tit='TRON' :active='select[1] === "tron"' @click='changChain("tron", 3)'></SlideButton>
        <SlideButton class='btn' tit='EOS' :active='select[1] === "eos"' @click='changChain("eos", 3)'></SlideButton>

      </div>
      <div id='dailyVolume' class="line"></div>
    </div>
    <div class="lineBox">
      <p class="lineTitle">「{{$t('lang.perTrading')}}」</p>
      <div class="btns">
        <SlideButton class='btn' :tit='$t("lang.all")' :active='select[2] === "all"' @click='changChain("all", 5)'></SlideButton>
        <SlideButton class='btn' tit='ETH' :active='select[2] === "eth"' @click='changChain("eth", 5)'></SlideButton>
        <SlideButton class='btn' tit='TRON' :active='select[2] === "tron"' @click='changChain("tron", 5)'></SlideButton>
        <SlideButton class='btn' tit='EOS' :active='select[2] === "eos"' @click='changChain("eos", 5)'></SlideButton>

      </div>
      <div id='avgAmount' class="line"></div>
    </div>
    <div class="lineBox">
      <p class="lineTitle">「{{$t('lang.perTurnover')}}」</p>
      <div class="btns">
        <SlideButton class='btn' :tit='$t("lang.all")' :active='select[3] === "all"' @click='changChain("all", 6)'></SlideButton>
        <SlideButton class='btn' tit='ETH' :active='select[3] === "eth"' @click='changChain("eth", 6)'></SlideButton>
        <SlideButton class='btn' tit='TRON' :active='select[3] === "tron"' @click='changChain("tron", 6)'></SlideButton>
        <SlideButton class='btn' tit='EOS' :active='select[3] === "eos"' @click='changChain("eos", 6)'></SlideButton>
      </div>
      <div id='avgVolume' class="line"></div>
    </div>
    <div class="lineBox">
      <p class="lineTitle">「{{$t('lang.dailyUsergrowt')}}」</p>
      <div class="btns">
        <SlideButton class='btn' :tit='$t("lang.all")' :active='select[4] === "all"' @click='changChain("all", 7)'></SlideButton>
        <SlideButton class='btn' tit='ETH' :active='select[4] === "eth"' @click='changChain("eth", 7)'></SlideButton>
        <SlideButton class='btn' tit='TRON' :active='select[4] === "tron"' @click='changChain("tron", 7)'></SlideButton>
        <SlideButton class='btn' tit='EOS' :active='select[4] === "eos"' @click='changChain("eos", 7)'></SlideButton>
      </div>
      <div id='userIncrement' class="line"></div>
    </div>
  </div>
</template>
<script type="text/javascript">
import echarts from 'echarts'
import SlideButton from '../../components/SlideButton.vue'
import {statisticsChainsDates, statisticsChain} from '../../util/axios.js'
import {mapState} from 'vuex'
export default {
  data () {
    return {
      myChart: {},
      myChart2: {},
      myChart3: {},
      myChart4: {},
      myChart5: {},
      echarts: [],
      option: {},
      select: ['all', 'all', 'all', 'all', 'all']
    }
  },
  components: {
    SlideButton
  },
  mounted () {
    this.initEchart()
    this.getData('all', 2)
    this.getData('all', 3)
    setTimeout(() => {
      this.getData('all', 5)
      this.getData('all', 6)
      this.getData('all', 7)
    }, 500)
  },
  computed: {
    ...mapState({
      chainList: state => state.vc.chains
    })
  },
  methods: {
    changChain (name, categoryID) {
      this.getData(name, categoryID)
    },
    getData (name, categoryID) {
      let chart = {}
      switch (categoryID) {
        case 2:
          chart = this.myChart
          this.select.splice(0, 1, name)
          break
        case 3:
          chart = this.myChart2
          this.select.splice(1, 1, name)
          break
        case 5:
          chart = this.myChart3
          this.select.splice(2, 1, name)
          break
        case 6:
          chart = this.myChart4
          this.select.splice(3, 1, name)
          break
        case 7:
          chart = this.myChart5
          this.select.splice(4, 1, name)
          break
        default:
          chart = this.myChart
          this.select.splice(0, 1, name)
          break
      }
      if (name === 'all') {
        this.getstatistics(categoryID, chart)
      } else {
        this.getstatisticsWithChain(this.chainList[name], categoryID, chart)
      }
    },
    getstatisticsWithChain (chainID, categoryID, echart) {
      statisticsChain(chainID, categoryID).then(res => {
        if (res && res.status === 200) {
          let dates = []
          let values = []
          for (let k in res.data) {
            let v = res.data[k]
            if (categoryID === 7) {
              v = v.slice(0, v.length - 1)
            }
            dates.push(k)
            values.push(v)
          }
          echart.setOption({
            xAxis: {
              data: dates
            },
            series: [{
              data: values
            }]
          })
        }
      })
    },
    getstatistics (categoryID, echart) {
      statisticsChainsDates(categoryID).then(res => {
        if (res && res.status === 200) {
          let dates = []
          let values = []
          for (let k in res.data) {
            let v = res.data[k]
            if (categoryID === 7) {
              v = v.slice(0, v.length - 1)
            }
            dates.push(k)
            values.push(v)
          }
          echart.setOption({
            xAxis: {
              data: dates
            },
            series: [{
              data: values
            }]
          })
        }
      })
    },
    initEchart () {
      this.myChart = echarts.init(document.getElementById('dailyUser'))
      this.myChart2 = echarts.init(document.getElementById('dailyVolume'))
      this.myChart3 = echarts.init(document.getElementById('avgAmount'))
      this.myChart4 = echarts.init(document.getElementById('avgVolume'))
      this.myChart5 = echarts.init(document.getElementById('userIncrement'))
      this.option = {
        xAxis: {
          type: 'category',
          boundaryGap: false
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: false
          }
        },
        tooltip: {
          position: 'top',
          formatter: function (params, ticket, callback) {
            let v = parseInt(params.value * 100) / 100
            return v + '<br/>' + params.name
          }
        },
        series: [{
          type: 'line',
          smooth: true,
          lineStyle: {
            color: '#6F68F4'
          },
          itemStyle: {
            color: '#6F68F4'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: '#6F68F4'
            }, {
              offset: 1,
              color: '#9E98FF'
            }])
          }
        }],
        dataZoom: [{
          start: 0,
          end: 100,
          handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
          handleSize: '80%',
          handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2
          }
        }]
      }
      this.myChart.setOption(this.option)
      this.myChart2.setOption(this.option)
      this.myChart3.setOption(this.option)
      this.myChart4.setOption(this.option)
      this.myChart5.setOption(this.option)
    }
  }
}
</script>
<style type="text/css" scoped="line">
   .lineTitle {
    text-align: left;
    font-size: 14px;
    color: #333;
    font-weight: bold;
    line-height: 22px;
    height: 22px;
    margin-top: 13px;
    padding-left: 10px;
  }
  .lineBox {
    border: 1px solid #ebebeb;
    margin-top: 10px;
  }
  .line {
    width: 100%;
    height: 300px;
  }
  .btns {
    margin: 45px auto 0;
    display: flex;
    justify-content: center;
  }
  .btns .btn{
    margin-right: 75px;
  }
</style>
