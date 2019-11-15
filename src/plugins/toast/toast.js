import Alert from './CallMeToast.vue'
var Toast = {}
Toast.install = function (Vue, options) {
  if (document.getElementsByClassName('alertBox').length) {
    return
  }
  let ToastTpl = Vue.extend(Alert)
  let $vm = new ToastTpl()
  let tpl = $vm.$mount().$el
  $vm.duration = 1000
  document.body.appendChild(tpl)
  Vue.prototype.$toast = {
    show (options) {
      if (typeof options === 'string') {
        $vm.toast = options
      } else if (typeof options === 'object') {
        Object.assign($vm, options)
      }
      $vm.show = true
      setTimeout(() => {
        $vm.show = false
      }, $vm.duration)
    },
    hide () {
      $vm.show = false
    }
  }
}
export default Toast
