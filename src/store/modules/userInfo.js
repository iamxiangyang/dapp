const state = {
  user: JSON.parse(sessionStorage.getItem('user')),
  dapp: JSON.parse(localStorage.getItem('dapp')) || {},
  dappId: localStorage.getItem('dappId'),
  dappEditInfo: JSON.parse(localStorage.getItem('dappEditInfo')) || {}
}

const mutations = {
  setUserInfo (state, info) {
    let obj = {}
    for (let k in info) {
      obj[k] = info[k]
    }
    sessionStorage.setItem('user', JSON.stringify(obj))
    state.user = JSON.parse(sessionStorage.getItem('user'))
  },
  cleanUserInfo () {
    sessionStorage.removeItem('user')
    localStorage.removeItem('dapp')
    state.dapp = JSON.parse(localStorage.getItem('dapp')) || ''
    state.user = JSON.parse(sessionStorage.getItem('user')) || ''
  },
  // 编辑dapp时保存dapp信息
  setUserDapp (state, data) {
    localStorage.setItem('dapp', JSON.stringify(data))
    state.dapp = JSON.parse(localStorage.getItem('dapp'))
  },
  cleanUserDapp () {
    localStorage.removeItem('dapp')
    state.dapp = JSON.parse(localStorage.getItem('dapp')) || ''
  },
  setDappId (state, dappId) {
    localStorage.setItem('dappId', dappId)
    state.dappId = localStorage.getItem('dappId')
  }
}

const getters = {
  isLogined: function (state) {
    return !!state.user
  }
}
export default {
  state,
  mutations,
  getters,
  namespaced: true
}
