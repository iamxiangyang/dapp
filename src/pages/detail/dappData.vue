<template>
  <div>
    <div class="itemBox">
        <SlideButton tit='24H' @click='selectTime(times[0])' :active='time === times[0]' class='slideItem'></SlideButton>
        <SlideButton tit='7D' @click='selectTime(times[1])' :active='time=== times[1]' class='slideItem'></SlideButton>
        <SlideButton tit='2W' @click='selectTime(times[2])' :active='time === times[2]' class='slideItem'></SlideButton>
        <SlideButton tit='4W' @click='selectTime(times[3])' :active='time === times[3]' class='slideItem'></SlideButton>
    </div>
    <div class="dataBox">
      <div>
        <DataCard
        class='card'
        name='DAU'
        :percent='quotes.user_total_increment'
        :value='quotes.user_total'
        :isActive='quote === quoteCodes[0]'
        @click='selectQuota(quoteCodes[0])'>
        </DataCard>
        <DataCard
        class='card'
        name='Balance'
        :percent='quotes.balance_increment'
        :value='quotes.balance'
        :usdt = 'quotes.balance_usdt'
        :isActive='quote === quoteCodes[1]'
        @click='selectQuota(quoteCodes[1])'>
        </DataCard>
        <DataCard
        class='card'
        name='Volume(ETH)'
        :percent='quotes.trans_volume_total_increment'
        :value='quotes.trans_volume_total'
        :usdt = 'quotes.trans_volume_total_usdt'
        :isActive='quote === quoteCodes[2]'
        @click='selectQuota(quoteCodes[2])'></DataCard>
        <DataCard
        class='card'
        name='Exchange'
        :percent='quotes.trans_amount_total_increment'
        :value='quotes.trans_amount_total'
        :avg = 'quotes.trans_volume_total / quotes.user_total'
        :isActive='quote === quoteCodes[3]'
        @click='selectQuota(quoteCodes[3])'>
        </DataCard>
        <DataCard
        class='card'
        name='Total(per)'
        :percent='quotes.avg_trans_volume_total_increment'
        :value='quotes.avg_trans_volume_total'
        :usdt='quotes.avg_trans_volume_total_usdt'
        :isActive='quote === quoteCodes[4]'
        @click='selectQuota(quoteCodes[4])'>
        </DataCard>
        <DataCard
        class='card'
        name='Exchange(per)'
        :percent='quotes.avg_trans_amount_total_increment'
        :value='quotes.avg_trans_amount_total'
        :isActive='quote === quoteCodes[5]'
        @click='selectQuota(quoteCodes[5])'>
        </DataCard>
      </div>
      <div id='myChart' class="chart"></div>
    </div>
  </div>
</template>
<script type="text/javascript">
import echarts from 'echarts'
import DataCard from '../../components/DataCard.vue'
import SlideButton from '../../components/SlideButton.vue'
import {getAllQuotasWithDapp, getQuotaWithDapp} from '../../util/axios.js'
export default {
  data () {
    return {
      quote: 2,
      time: '1d',
      quotes: {},
      quoteCodes: [2, 1, 4, 3, 6, 5],
      times: ['1d', '1w', '2w', '1m'],
      myChart: {},
      dappId: ''
    }
  },
  components: {
    DataCard,
    SlideButton
  },
  mounted () {
    this.initChart()
    if (!this.dappId) {
      this.dappId = this.$route.params.dappId
      this.selectTime()
    }
  },
  methods: {
    initChart () {
      this.myChart = echarts.init(document.getElementById('myChart'))
      this.myChart.setOption({
        grid: {
          top: 40,
          left: 65,
          right: 45
        },
        animation: false,
        tooltip: {
          position: 'top',
          formatter: '<a style="color:rgba(255, 255, 255, 0.7);font-size:10px;">{b}</a><br />{c}',
          extraCssText: 'text-align: center;'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisTick: {
            interval: 0
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          type: 'line',
          smooth: true,
          symbolSize: 8,
          symbol: 'circle',
          itemStyle: {
            color: '#6F68F4'
          },
          lineStyle: {
            color: '#6F68F4'
          }
        }]
      })
    },
    selectQuota (code = 2) {
      this.quote = code
      getQuotaWithDapp(this.dappId, this.quote, this.time).then(res => {
        if (res && res.status === 200) {
          let data = []
          let keys = []
          let interval = 0
          for (let k in res.data) {
            if (this.time === '2w' && interval % 2 === 0) {
              data.push(res.data[k])
              keys.push(k)
            } else if (this.time === '1m' && interval % 3 === 0) {
              data.push(res.data[k])
              keys.push(k)
            } else if (this.time === '1d' || this.time === '1w') {
              data.push(res.data[k])
              keys.push(k)
            }
            interval++
          }
          this.myChart.setOption({
            series: [{
              data: data
            }],
            xAxis: {
              data: keys
            }
          })
        }
      })
    },
    selectTime (time = '1d') {
      this.time = time
      getAllQuotasWithDapp(this.dappId, this.time).then(res => {
        if (res && res.status === 200) {
          this.quotes = res.data
          this.selectQuota(this.quote)
        }
      })
    }
  }
}
</script>
<style type="text/css" scoped>
.chart {
  width: 586px;
  height: 410px;
  border: 1px dashed #DEDEDE;
  margin-left: 10px;
}
.card {
  margin-bottom: 5px;
}
.dataBox {
  margin-top: 15px;
  display: flex;
  justify-content: center;
}
.itemBox {
  height: auto;
  margin: 0 auto;
  display: flex;
  justify-content: center;
}
.slideItem {
  padding-left: 40px;
  padding-right: 40px;
}
</style>
