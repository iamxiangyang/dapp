import Vue from 'vue'
import Vuex from 'vuex'
import vc from './modules/viewControl.js'
import web3Instance from './modules/web3Model.js'
import userInfo from './modules/userInfo.js'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    vc,
    web3Instance,
    userInfo
  }
})
