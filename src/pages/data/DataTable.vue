<template>
<table class="itemsRow">
<tr class="first">
  <td class="order">#</td>
  <td class="name">{{$t('lang.name')}}</td>
  <td class="chain">{{$t('lang.chain')}}</td>
  <td class="category">{{$t('lang.category')}}</td>
  <td class="volume">{{$t('lang.balance')}}</td>
  <td class="counts">{{$t('lang.user24')}}</td>
  <td class="volume">{{$t('lang.volume24')}}</td>
  <td class="counts">{{$t('lang.exchange24')}}</td>
  <td class="counts">{{$t('lang.exchangePer')}}</td>
</tr>
<tr class="others" v-for='(item, index) in info' :key='item.statsId' @click='toDetail(item.dapp_id)'>
  <td class="order">{{index + 1}}</td>
  <td class="dappName name">{{item.dapp_name}}</td>
  <td class="chain">{{item.chain_name}}</td>
  <td class="category">{{$t(dappCategorys[item.dapp_category]) || $t('lang.others')}}</td>
  <td class="volume"><img :src='item.chain_name === "eth" ? require("../../assets/img/Ethereum.png") : item.chain_name === "tron" ? require("../../assets/img/TRON.png") : require("../../assets/img/EOS.png")'  class="ethImg">{{item.balance | shortenLargeNumber(2)}}</td>
  <td class="counts">{{item.user_total | shortenLargeNumber(2)}}</td>
  <td class="volume"><img :src='item.chain_name === "eth" ? require("../../assets/img/Ethereum.png") : item.chain_name === "tron" ? require("../../assets/img/TRON.png") : require("../../assets/img/EOS.png")' class="ethImg">{{item.trans_volume_total | shortenLargeNumber(2)}}</td>
  <td class="counts">{{item.trans_amount_total | shortenLargeNumber(2)}}</td>
  <td class="counts">{{item.trans_volume_total | shortenLargeNumber(2)}}</td>
</tr>
</table>
</template>
<script type="text/javascript">
export default {
  data () {
    return {
      dappCategorys: ['others', 'lang.games', 'lang.exchanges', 'lang.luckydraw', 'lang.others']
    }
  },
  props: {
    info: {
      type: Array
    }
  },
  methods: {
    toDetail (dappID) {
      this.$router.push({name: 'Detail', params: {dappId: dappID}})
    }
  }
}
</script>
<style type="text/css" scoped="dataTable">
.itemsRow {
  width: 100%;
  border-radius: 6px;
  table-layout: fixed;
}
.itemsRow tr {
  width: 100%;
  height: 46px;
  line-height: 46px;
  display: flex;
  cursor: pointer;
}
.itemsRow td {
  text-align: left;
  padding-left: 10px;
  padding-right: 10px;
  vertical-align: middle;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.itemsRow .order {
  width: 45px;
}
.itemsRow .name {
  width: 225px;
}
.itemsRow .chain {
  width: 90px;
}
.itemsRow .category {
  width: 110px;
}
.itemsRow .volume {
  width: 150px;
}
.itemsRow .counts {
  width: 120px;
}
.itemsRow .others {
  font-size: 14px;
  color: #666666;
  margin-top: 5px;
  border: 1px solid #EBEBEB;
}
.itemsRow .others:hover {
  border: 1px solid #3C99FC;
}
.itemsRow .first {
  color: #999999;
  font-size: 12px;
  border: none;
}
.itemsRow .dappName {
  color: #607098;
}
.ethImg {
  width: 20px;
  height: 17px;
  position: relative;
  top: 3px;
}
</style>
