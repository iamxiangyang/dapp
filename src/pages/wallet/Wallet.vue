<template>
  <div class="boxAll" ref='boxAll'>
    <div class="content" ref='content'>
      <div class="option">
        <div class="optionItem" @click='changeTutorial("metamask")'><p><span :class='{active:selected === "metamask"}'>METAMASK</span></p><div v-show='selected === "metamask"'></div></div>
        <div class="optionItem" @click='changeTutorial("tron")'><p><span :class='{active:selected === "tron"}'>TronLink</span></p><div v-show='selected === "tron"'></div></div>
        <div class="optionItem" @click='changeTutorial("scatter")'><p><span :class='{active:selected === "scatter"}'>Scatter</span></p><div v-show='selected === "scatter"'></div></div>

      </div>
      <div>
        <MetaMask v-show='selected === "metamask"'></MetaMask>
        <tron v-show='selected === "tron"'></tron>
        <Scatter v-show='selected === "scatter"'></Scatter>
      </div>
    </div>
    <div class="buttonScroll">
      <div class='buttonUp' :class = "{'changeColor': isChange}" @click="returnTop"><a href="javascript:void(0)">{{$t('lang.installation')}}</a></div>
      <div class='buttonDown'  :class = "{'changeColor': !isChange} " @click="returnBottom"><a href="javascript:void(0)">{{$t('lang.registration')}}</a></div>
    </div>
  </div>
</template>

<script>
import MetaMask from './MetaMaskTutorial.vue'
import Tron from './TronLink.vue'
import Scatter from './Scatter.vue'
export default {
  name: 'Wallet',
  data () {
    return {
      scroll: null,
      isChange: true,
      changeColor: 'changeColor',
      buttonUp: 'buttonUp',
      buttonDown: 'buttonDown',
      selected: 'metamask'
    }
  },
  components: {
    MetaMask,
    Tron,
    Scatter
  },
  methods: {
    returnTop: function () {
      let box = this.$refs.boxAll
      box.scrollTop = 100
    },
    returnBottom: function () {
      let reg = {}
      if (this.selected === 'tron') {
        reg = document.querySelector('.tronReg')
      } else if (this.selected === 'scatter') {
        reg = document.querySelector('.scatterReg')
      } else {
        reg = document.querySelector('.metaReg')
      }
      let box = this.$refs.boxAll
      box.scrollTop = reg.offsetTop
    },
    changeTutorial (val) {
      this.selected = val
    },
    handleScroll: function () {
      let regTop = 0
      let box = this.$refs.boxAll
      let scrollTop = box.pageYOffset || box.scrollTop
      if (this.selected === 'tron') {
        regTop = document.querySelector('.tronReg').offsetTop
      } else if (this.selected === 'scatter') {
        regTop = document.querySelector('.scatterReg').offsetTop
      } else {
        regTop = document.querySelector('.metaReg').offsetTop
      }
      if (scrollTop < regTop) {
        this.isChange = true
      } else {
        this.isChange = false
      }
    }
  },
  mounted: function () {
    let box = this.$refs.boxAll
    box.addEventListener('scroll', this.handleScroll)
  }
}
</script>

<style scoped>
.boxAll {
  width: 100%;
  background-color: #f3f4f5;
  top: 74px;
  left: 0;
  bottom: 0;
  position: absolute;
  overflow: auto;
  min-width: 650px;
}
.content {
  position: absolute;
  width: 100%;
  top: 0;
}
.buttonScroll {
  height: 96px;
  min-width: 96px;
  position: fixed;
  top: 450px;
  left: 82%;
  border-radius: 8px;
}
.changeColor {
  background-color: #6D64FB !important;
}
.changeColor a {
  color: #fff !important;
}
.buttonScroll a {
  display: block;
  line-height: 48px;
  font-size: 14px;
  border-radius: 8px;
  color: #607098;
}
.buttonUp {
  width: 100%;
  padding-left: 10px;
  padding-right: 10px;
  height: 48px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border: 1px solid #EBEBEB;
}
.buttonDown {
  width: 100%;
  padding-left: 10px;
  padding-right: 10px;
  height: 48px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  border: 1px solid #EBEBEB;
}
.optionItem {
  font-size: 16px;
  height: 50px;
  color: #8590A6;
  height: auto;
  cursor: default;
  margin-right: 64px;
}
.optionItem div {
  width: 21px;
  height: 4px;
  background: #6D64FB;
  border-radius: 2px;
  margin: 5px auto 0;
}
.optionItem p {
  width: 100%;
  letter-spacing: 0.5px;
  text-align: center;
  margin-top: 13px;
  line-height: 20px;
  white-space:nowrap;
}
.optionItem span{
  text-align: center;
}
.optionItem:hover {
  color: #6D64FB;
}
.active {
  color: #6D64FB;
}
.option {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
}

</style>
