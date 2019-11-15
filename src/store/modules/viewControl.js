const state = {
  isHeadShow: true,
  isMenuShow: false,
  hasHead: true,
  isShowRegistAlert: false,
  isDeveloper: sessionStorage.getItem('isDeveloper') === 'true',
  isShowEditAlert: false,
  loadingText: 'lang.loadmore',
  language: sessionStorage.getItem('language') || 'EN',
  isShowLoad: true,
  catagoryId: 0,
  dappAuthorId: '',
  replyCount: 0,
  chains: sessionStorage.getItem('chains')
}

const getters = {
}

const actions = {
}

const mutations = {
  navHide (state) {
    state.isHeadShow = false
  },
  navShow (state) {
    state.isHeadShow = true
  },
  menuShow (state) {
    state.isMenuShow = true
  },
  menuHide (state) {
    state.isMenuShow = false
  },
  headHide (state) {
    state.hasHead = false
  },
  headShow (state) {
    state.hasHead = true
  },
  showLoginMetaMask (state) {
    state.isShowRegistAlert = true
  },
  hideLoginMetaMask (state) {
    state.isShowRegistAlert = false
  },
  showEditAlert () {
    state.isShowEditAlert = true
  },
  hideEditAlert () {
    state.isShowEditAlert = false
  },
  developerRegist () {
    sessionStorage.setItem('isDeveloper', 'true')
    state.isDeveloper = true
  },
  userRegist () {
    sessionStorage.setItem('isDeveloper', 'false')
    state.isDeveloper = false
  },
  setLoadText (state, txt) {
    if (!txt) {
      state.loadingText = 'lang.loadmore'
    }
    state.loadingText = txt
  },
  setLanguage (state, value) {
    sessionStorage.setItem('language', value)
    state.language = value
  },
  closeLoad (state) {
    state.isShowLoad = false
  },
  showLoad (state) {
    state.isShowLoad = true
  },
  changeDappType (state, value) {
    let catagoryId = 0
    switch (value) {
      case 'games':
        catagoryId = 1
        break
      case 'exchanges':
        catagoryId = 2
        break
      case 'luckydraw':
        catagoryId = 3
        break
      case 'others':
        catagoryId = 4
        break
      case 'tron':
        catagoryId = -1
        break
      case 'eos':
        catagoryId = -2
        break
      default:
        catagoryId = 0
        break
    }
    state.catagoryId = catagoryId
  },
  setDappAuthorId (state, value) {
    state.dappAuthorId = value
  },
  changeReplyCount (state, value) {
    state.replyCount = value
  },
  setChains (state, value) {
    let lists = {}
    value.forEach(function (element, index) {
      let k = element['chain_name']
      let v = element['chain_id']
      lists[k] = v
    })
    sessionStorage.setItem('chains', lists)
    state.chains = lists
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
  namespaced: true
}
