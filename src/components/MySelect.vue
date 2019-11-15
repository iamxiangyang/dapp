<template>
  <div class="select">
    <div class="inner">
      <div class="inputWrapper" @click.stop="showOptions = !showOptions">
        <img :src="country" width="18px" height="18px" style="vertical-align: middle;margin-left: 5px;margin-right: 5px" v-if='type !== "normal"'>
        <input type="text" readonly  :value="type==='normal'?$t(selected):selected">
        <span v-if='type==="normal"'><i class="icon iconfont icon-Screening" style="font-size: 12px;"></i></span>
        <span v-else style="font-size: 15px;"><Icon type="ios-arrow-down" size='15' :class='[showOptions ? "up" : "down"]'/></span>
      </div>
      <transition name="slide-up">
      <ul class="options" v-show='showOptions' v-clickOut="test">
        <li v-for="(item, index) in options" :key="index" @click.stop="choose(item.value)" >
        <i class="icon iconfont icon-Checkmark" style="font-size: 12px;position: absolute;left: 5px;"
        v-show='item.value === selected' v-if='type === "normal"'></i>
        <i v-else><img :src="countries[index]" width="18px" height="18px" style="margin-left: 5px;vertical-align: middle;"></i>
        <span class="itemText" :class='{"normal": type==="normal"}'>{{type==='normal' ? $t(item.value): item.value}}</span></li>
      </ul>
    </transition>
    </div>
  </div>
</template>
<script>
import {Icon} from 'iview'
export default {
  data () {
    return {
      showOptions: false,
      selected: '',
      countries: [require('../assets/img/countries/EN.png'), require('../assets/img/countries/CN.png'), require('../assets/img/countries/JA.png'), require('../assets/img/countries/KO.png'), require('../assets/img/countries/RU.png'), require('../assets/img/countries/IR.png'), require('../assets/img/countries/AR.png')]
    }
  },
  props: {
    type: {
      default: 'normal'
    },
    options: {
      default: () => {
        return [
          {
            value: 'lang.recent'
          },
          {
            value: 'lang.hot'
          }
        ]
      }
    },
    default: {
      default: 'lang.recent'
    },
    lang: {
      default: 'EN'
    }
  },
  computed: {
    country: function () {
      if (this.type === 'normal') {
        return
      }
      let src = ''
      switch (this.lang) {
        case 'EN':
          src = require('../assets/img/countries/EN.png')
          break
        case 'CN':
          src = require('../assets/img/countries/CN.png')
          break
        case 'JA':
          src = require('../assets/img/countries/JA.png')
          break
        case 'KO':
          src = require('../assets/img/countries/KO.png')
          break
        case 'RU':
          src = require('../assets/img/countries/RU.png')
          break
        case 'IR':
          src = require('../assets/img/countries/IR.png')
          break
        case 'AR':
          src = require('../assets/img/countries/AR.png')
          break
        default:
          src = require('../assets/img/countries/EN.png')
          break
      }
      return src
    }
  },
  watch: {
    'lang': function (val) {
      this.selected = val
    }
  },
  mounted () {
    this.selected = this.default
  },
  methods: {
    choose (value) {
      this.showOptions = false
      if (value !== this.selected) {
        this.selected = value
        this.$emit('valueChanged', value)
      }
    },
    test () {
      this.showOptions = false
    }
  },
  components: {
    Icon
  },
  directives: {
    clickOut: {
      bind: function (el, binding) {
        function handler (e) {
          if (el.contains(el.target)) return false
          if (binding.expression) {
            binding.value()
          }
        }
        el.handler = handler
        document.addEventListener('click', el.handler)
      },
      unbind: function (el) {
        document.removeEventListener('click', el.handler)
      }
    }
  }
}
</script>
<style scoped>
.inner {
  position: relative;
}
.inputWrapper {
  min-width: 92px;
  height: 25px;
  line-height: 25px;
  border-radius: 8px;
  border: 1px solid #ebebeb;
  padding-left: 10px;
  padding-right: 10px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.inputWrapper input{
  min-width: 40px;
  width: 99%;
  height: 23px;
  line-height: 23px;
  outline: none;
  border: none;
  background: rgba(0, 0, 0, 0);
  color: #333;
  cursor: inherit;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.inputWrapper span {
  height: 25px;
  line-height: 25px;
  color: #ccc;
}
.options {
  padding: 10px 0;
  border-radius: 8px;
  border: 1px solid #ebebeb;
  position: absolute;
  top: 30px;
  left: 0;
  z-index: 999;
  text-align: left;
  background: #F9F9F9;
}
.options li {
  height: 28px;
  line-height: 28px;
  width: 95px;
  padding: 0 10px;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.options li:hover {
  background: #3C99FC;
  color: #fff;
}
.up {
  color: #fff;
  transform: rotate(180deg);
  transition: all 0.5s;
}
.down {
  color: #fff;
  transform: rotate(0deg);
  transition: all 0.5s;
}
.itemText {
  margin-left: 5px;
  white-space: nowrap;
  text-overflow: ellipsis;height: 18px;
}
.normal {
  margin-left: 10px;
}
</style>
