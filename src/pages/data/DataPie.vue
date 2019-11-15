<template>
  <div class="pieBox">
    <p class="pieTitle">「{{$t('lang.totalData')}}」</p>
    <div id='pie' class="pie"></div>
    <p>DAPP Total: {{total}}</p>
  </div>
</template>
<script type="text/javascript">
import echarts from 'echarts'
import {statisticsSummary} from '../../util/axios.js'
import {mapState} from 'vuex'
export default {
  data () {
    return {
      myChart: {},
      pies: {},
      total: 0
    }
  },
  mounted () {
    this.pies = this.info
    this.initEcharts()
    this.getStationData()
  },
  computed: {
    ...mapState({
      language: state => state.vc.language
    })
  },
  watch: {
    language: function () {
      console.log(123)
      this.myChart.setOption({
        series: [{
          data: [
            {value: this.pies['1'], name: this.$t('lang.games')},
            {value: this.pies['2'], name: this.$t('lang.exchanges')},
            {value: this.pies['3'], name: this.$t('lang.luckydraw')},
            {value: this.pies['4'], name: this.$t('lang.others')}
          ]
        }]
      })
    }
  },
  methods: {
    initEcharts () {
      this.myChart = echarts.init(document.getElementById('pie'))
      this.myChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{b}:{c}({d}%)'
        },
        color: ['#489FFF', '#F5525C', '#FFDB64', '#8F48FF'],
        series: [{
          type: 'pie',
          radius: 80,
          center: ['50%', '50%']
        }]
      })
    },
    getStationData () {
      statisticsSummary().then(res => {
        if (res && res.status === 200) {
          this.pies = res.data.dapp_count
          this.total = res.data.dapp_count['0']
          this.myChart.setOption({
            series: [{
              data: [
                {value: this.pies['1'], name: this.$t('lang.games')},
                {value: this.pies['2'], name: this.$t('lang.exchanges')},
                {value: this.pies['3'], name: this.$t('lang.luckydraw')},
                {value: this.pies['4'], name: this.$t('lang.others')}
              ]
            }]
          })
        }
      })
    }
  }
}
</script>
<style type="text/css" scoped="pie">
  .pieTitle {
    text-align: left;
    font-size: 14px;
    color: #333;
    font-weight: bold;
    line-height: 22px;
    height: 22px;
    margin-top: 13px;
    padding-left: 10px;
  }
  .pie {
    width: 350px;
    height: 300px;
    margin: auto;
  }
</style>
