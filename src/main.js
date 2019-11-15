// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueWechatTitle from 'vue-wechat-title'
import App from './App'
import router from './router'
import VueI18n from 'vue-i18n'
import Toast from '@/plugins/toast/toast'
import store from './store'
import './util/start.js'

import './assets/icon/iconfont.css'
import './assets/css/reset.css'
import 'iview/dist/styles/iview.css'

Vue.use(VueWechatTitle)
Vue.use(VueI18n)
Vue.use(Toast)
Vue.config.productionTip = false
const i18n = new VueI18n({
  locale: 'en-US',
  messages: {
    'zh-CN': require('./common/lang/zh'),
    'en-US': require('./common/lang/en'),
    'ja-JA': require('./common/lang/ja'),
    'ko-KO': require('./common/lang/ko'),
    'ru-RU': require('./common/lang/ru'),
    'ir-IR': require('./common/lang/ir'),
    'ar-AR': require('./common/lang/ar')
  }
})
export default new Vue({ // eslint-disable-line no-new
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})
