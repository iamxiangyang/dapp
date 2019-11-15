<template>
  <div class="dataCover"  v-show='show'>
    <div class="dataBox" @mousewheel='wheel'>
      <div class="dataContain">
        <div><img src='../../assets/img/close2.png' class='close2' @click='hide'></div>
        <div class="allTit">
          <span class='leftSpan'>「{{$t(title)}}」</span>
        </div>
        <div class="tableList">
          <DataTable :info = 'info'></DataTable>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import DataTable from './DataTable.vue'
import Scroll from '../../common/scroll/scroll.vue'
export default {
  data () {
    return {
      show: this.isShow
    }
  },
  props: {
    info: {
      type: Array
    },
    title: {
      type: String
    },
    isShow: {
      type: Boolean,
      default: false
    }
  },
  components: {
    DataTable,
    Scroll
  },
  watch: {
    isShow (val) {
      this.show = val
    }
  },
  methods: {
    wheel (e) {
      let body = document.querySelector('body')
      let html = document.querySelector('html')
      body.style.overflow = 'hidden'
      html.style.overflow = 'hidden'
    },
    hide (e) {
      let body = document.querySelector('body')
      let html = document.querySelector('html')
      body.style.overflow = 'auto'
      html.style.overflow = 'auto'
      this.$emit('close', e)
    }
  }
}
</script>
<style type="text/css" scoped="dataAlert">
.dataCover {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  z-index: 9999;
}
.dataBox {
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}
.tableList {
  padding-left: 15px;
  padding-right: 35px;
  overflow: scroll;
  height: 80%;
}
.dataContain {
  width: 1170px;
  min-width: 1170px;
  height: 80%;
  margin: auto;
  background: #fff;
  border-radius: 10px;
}
.allTit {
  width: 100%;
  height: 38px;
  line-height: 38px;
  padding-left: 15px;
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
.close2 {
  width: 24px;
  height: 24px;
  float: right;
  margin-right: -35px;
  border-radius: 10px;
  cursor: pointer;
}
</style>
