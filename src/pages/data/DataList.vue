<template>
  <div class="box">
    <div class="allTit" @click='showAll'>
        <span class='leftSpan'>「{{$t(name)}}」</span>
        <button class="rightBtn">{{$t('lang.all')}} ></button>
    </div>
   <table class="itemsRow"  width="100%">
        <tr class="first">
          <td class="order">#</td>
          <td class="name">{{$t('lang.name')}}</td>
          <td class="counts">{{$t('lang.user24')}}</td>
          <td class="volume">{{$t('lang.volume24')}}</td>
        </tr>
        <tr class="others" v-for='(item, index) in datas' :key='item.statsId' @click='toDetail(item.dapp_id)'>
          <td class="order">{{index + 1}}</td>
          <td class="name dappName">{{item.dapp_name}}</td>
          <td class="counts">{{item.user_total | shortenLargeNumber(2)}}</td>
          <td class="volume">
            <img :src='item.chain_name === "eth" ? require("../../assets/img/Ethereum.png") : item.chain_name === "tron" ? require("../../assets/img/TRON.png") : require("../../assets/img/EOS.png")' class="ethImg"/>
            {{item.trans_volume_total | shortenLargeNumber(2)}}
          </td>
        </tr>
      </table>
    </div>
</template>
<script type="text/javascript">
export default {
  props: {
    name: {
      type: String
    },
    datas: {
      type: Array
    }
  },
  methods: {
    showAll (e) {
      this.$emit('showAll')
    },
    toDetail (dappID) {
      this.$router.push({name: 'Detail', params: {dappId: dappID}})
    }
  }
}
</script>
<style type="text/css" scoped="dataList">
  .box {
    width: 100%;
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
  .itemsRow {
    width: 100%;
    table-layout: fixed;
  }
  .itemsRow .others:hover {
    border: 1px solid #3C99FC;
  }
  .itemsRow tr {
    width: 100%;
    height: 46px;
    line-height: 46px;
    display: flex;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    cursor: pointer;
  }
  .itemsRow td {
    text-align: left;
    padding-left: 10px;
    padding-right: 10px;
    vertical-align: middle;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .itemsRow .others {
    font-size: 14px;
    color: #666666;
    margin-top: 5px;
    border: 1px solid #ebebeb;
  }
  .itemsRow .order {
    width: 45px;
  }
  .itemsRow .name {
    width: 225px;
  }
  .itemsRow .counts {
    width: 120px;
  }
  .itemsRow .volume {
    width: 150px;
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
    top: 3px;
    position: relative;
  }
</style>
