<template>
  <div class="card" @click='showDetail' :class='{active:isActive}'>
    <p class="fontone">{{name}}</p>
    <div>
      <p class="textRow"><span class="fontone">{{value | fixTwo}}</span> <span class="precent" :class='[percent > 0 ? "rise" : "fall"]'>{{percent}}</span></p>
      <p class="fonttwo" v-show='usdt || usdt === 0'>{{usdt | fixTwo}} USDT</p>
      <p class="fonttwo" v-show='avg || avg === 0'>{{avg | fixTwo}} ETH/Exchange</p>
    </div>
  </div>
</template>
<script type="text/javascript">
export default {
  data () {
    return {
    }
  },
  props: {
    value: {
      type: Number
    },
    percent: {
      default: Number
    },
    name: {
      type: String
    },
    usdt: {
      type: Number
    },
    avg: {
      type: Number
    },
    isActive: {
      default: false
    }
  },
  methods: {
    showDetail (event) {
      this.$emit('click', event)
    }
  }
}
</script>
<style type="text/css">
.card {
  width: 276px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border: 1px solid #EBEBEB;
  border-radius: 6px;
  cursor: pointer;
}
.card:hover {
  background: #F6F6F6;
}
.active {
  background: #F6F6F6 !important;
}
.textRow {
  height: 22px;
  line-height: 22px;
  text-align: right;
}
.fontone {
  color: #333333;
  font-size: 14px;
}
.precent {
  width: 52px;
  height: 22px;
  font-size: 12px;
  border-radius: 6px;
  margin-left: 10px;
}
.rise {
  background: rgba(91, 199, 203, 0.08);
  color: #5BC7CB;
}
.fall {
  background: rgba(245, 84, 82, 0.08);
  color: #F55452;
}
.fonttwo {
  font-size: 12px;
  color: #999999;
  text-align: right;
}
</style>
