import Vue from 'vue'
import {Format} from './tool.js'
window.eventBus = new Vue()
window.listener = function () {
  let width = document.body.clientWidth || document.documentElement.clientWidth
  window.eventBus.$emit('resize', width)
}
window.addEventListener('resize', window.listener, false)
Vue.directive('focus', {
  inserted: function (el) {
    if (el.autofocus) {
      // 聚焦元素
      el.focus()
    }
  }
})
Vue.filter('formatDate',
  function (value) {
    return Format(value, 'yyyy.MM.dd hh:mm:ss')
  })
Vue.filter('fixTwo',
  function (value) {
    if (value && value !== 0) {
      return parseInt(value * 100) / 100
    }
    return value
  })
Vue.filter('shortenLargeNumber',
  function (value, digits) {
    var units = ['k', 'M', 'B', 'T', 'P', 'E', 'Z', 'Y']
    for (var i = units.length - 1; i >= 0; i--) {
      var decimal = Math.pow(1000, i + 1)
      if (value <= -decimal || value >= decimal) {
        return +(value / decimal).toFixed(digits) + units[i]
      }
    }
    return value
  })
Vue.filter('divide',
  function (value, number) {
    if (value === 0 || number === 0) {
      return 0
    }
    return parseInt((value / number) * 100) / 100
  })
