import {checkMetamaskBinded} from '../../util/axios.js'
const state = {
  web3: {
    web3Instance: null,
    coinbase: null,
    balance: null
  },
  isBindedMetaMask: sessionStorage.getItem('isBindedMetaMask') === 'true'
}
const mutations = {
  registerWeb3Instance (state, callback = function () {}) {
    var web3js = window.web3
    if (typeof web3js !== 'undefined') {
      var result = {
        web3 () {
          return web3js
        }
      }
    } else {
      callback()
      return
    }
    result.web3().eth.getCoinbase((err, coinbase) => {
      if (!err) {
        result = Object.assign({}, result, { coinbase })
        let web3Copy = state.web3
        web3Copy.coinbase = result.coinbase
        web3Copy.web3Instance = result.web3()
        state.web3 = web3Copy
        callback(web3js)
      }
    })
  },
  getBalance (state, callback) {
    let web3 = state.web3.web3Instance
    let coinbase = state.web3.coinbase
    web3.eth.getBalance(coinbase, (err, balance) => {
      if (!err) {
        let web3Copy = state.web3
        web3Copy.balance = balance
        state.web3 = web3Copy
        callback(state.web3.balance)
      }
    })
  },
  checkIsBinded (state, callback) {
    if (state.web3.coinbase) {
      checkMetamaskBinded(state.web3.coinbase).then(function (res) {
        if (res && res.status === 200) {
          sessionStorage.setItem('isBindedMetaMask', 'false')
          state.isBindedMetaMask = false
        }
        callback()
      }).catch((err) => {
        if (err.response && err.response.status === 409) {
          sessionStorage.setItem('isBindedMetaMask', 'true')
          state.isBindedMetaMask = true
        }
        callback()
      })
    } else {
      sessionStorage.setItem('isBindedMetaMask', 'false')
      state.isBindedMetaMask = sessionStorage.getItem('isBindedMetaMask') === 'true'
      callback()
    }
  }
}
const actions = {
}
export default {
  state,
  actions,
  mutations,
  namespaced: true
}
