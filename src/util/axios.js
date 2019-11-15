import axios from 'axios'
import vm from '../main.js'
import {getCookie} from './tool.js'
// axios 配置
axios.defaults.timeout = 5000
let _captchaSrc = ''
let _IMGURL = ''
if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = '/api'
  _captchaSrc = '/api/api/accounts/captcha'
  _IMGURL = 'http://photob.raybo.com/'
} else {
  _captchaSrc = '/api/accounts/captcha'
  _IMGURL = 'http://photoa.raybo.com/'
}
export const captchaSrc = _captchaSrc
export const IMGURL = _IMGURL
function checkCode (err) {
  if (err.code === 'ECONNABORTED') {
    return
  } else if (err && err.response.status === 401) {
    if (err.response.config.method !== 'get') {
      vm.$toast.show({
        toast: vm.$t('lang.NoPermissions')
      })
    }
    vm.$store.commit('userInfo/cleanUserInfo')
  } else if (err && err.response.status === 403) {
    vm.$toast.show({
      toast: err.response.data.errmsg || vm.$t('lang.NoPermissions')
    })
  } else if (err && err.response.status === 500) {
    vm.$toast.show({
      toast: err.response.data.errmsg || vm.$t('lang.ServerBusy')
    })
  }
  return Promise.reject(err)
}

function checkStatus (response) {
  // 如果http状态码正常，则直接返回数据
  if (response && (response.status === 200 || response.status === 201)) {
    return response
  }
  // 异常状态下，把错误信息返回去
  return Promise.reject(response)
}

// POST传参序列化
axios.interceptors.request.use((config) => {
  let CSRFToken = getCookie('X-CSRFToken')
  if (CSRFToken) {
    axios.defaults.headers.common['X-CSRFToken'] = CSRFToken
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// 返回状态判断
axios.interceptors.response.use((response) => {
  return checkStatus(response)
}, (error) => {
  return checkCode(error)
})
export function post (url, data, config) {
  if (config) {
    return axios({
      method: 'post',
      url,
      data: data,
      config
    })
  }
  return axios.post(url, data)
}
export function put (url, data, config) {
  return axios.put(url, data)
}
export function get (url, data) {
  if (data) {
    return axios({
      method: 'get',
      url,
      params: data
    })
  }
  return axios({
    method: 'get',
    url
  })
}
export function del (url) {
  return axios.delete(url)
}
// 免登陆认证
export const authentication = () => get('/api/oauth/me')
// 推荐的dapp
export const recommends = () => get('/api/dapp/recommends')
// dapp列表
export const dapps = (url) => get('/api/dapps')
// dapp分类
export const catagory = (catagoryID, data) => get('/api/dapp/catagory/' + catagoryID, data)
// dapp按热度排序
export const hotests = () => get('/api/dapp/hotests')
// 上传dapp 201 401 400
export const uploadDapps = (data) => post('/api/dapp', data)
// dapp详情
export const dappsDetail = (dappID) => get('/api/dapp/' + dappID)
// 检测昵称
export const checkNickname = (nick) => get('/api/accounts/checked?nickname=' + nick)
// 检测验证码
export const checkCaptcha = (captcha) => get('/api/accounts/captcha/verify?captcha=' + captcha)
// 检测账号
export const checkAccount = (account) => get('/api/accounts/checked?name=' + account)
// 检测metaMask是否绑定
export const checkMetamaskBinded = (metamask) => get('/api/accounts/checked?metamask=' + metamask)
// 检测dapp是否存在
export const checkDapp = (name) => get('/api/dapp/checked?name=' + name)
// 普通用户注册
export const registUser = (data) => post('/api/accounts/register', data)
// 开发者注册
export const registEnterprise = (data) => post('/api/accounts/enterprise/register', data)
// 获取token
export const getQNToken = (type) => get('/api/fs/token?type=' + type)
// 上传图片
export const uploadImg = (data) => post('https://upload-na0.qiniup.com', data, {headers: {'Content-Type': 'multipart/form-data', 'withCredentials': false}})
// 登录
export const login = (data) => post('/api/accounts/login', data)
// 退出
export const logout = () => get('/api/accounts/logout')
// 快捷登录
export const quickLogin = (data) => post('/api/accounts/login/metamask', data)
// 个人资料
export const getUser = (userID) => get('/api/user/' + userID + '/profile')
// 修改个人资料
export const putUser = (userID, data) => put('/api/user/' + userID + '/profile', data)
// 获取上传的dapp
export const myDapps = (id, start = 0, limit = 10, status) => get('/api/user/' + id + '/dapps?' + 'start=' + start + '&limit=' + limit + (status === undefined ? '' : '&status=' + status))
// 上传 更新预览图
export const updataPreviws = (id, data) => post('/api/dapp/' + id + '/previews', data)
// 更改密码
export const changePassword = (data) => post('/api/accounts/password/changed', data)
// 更改dapp信息
export const dappEdit = (dappID, data) => put('/api/dapp/' + dappID + '/edit', data)
// 用户的评论
export const myComments = (id, start = 0, limit) => get('/api/user/' + id + '/dapp/comments?' + 'start=' + start + '&limit=' + limit)
// dapp的评论
export const dappComments = (dappID, order = 'recent', start = 0, limit = 10) => get('/api/dapp/' + dappID + '/comments?order=' + order + '&start=' + start + '&limit=' + limit)
// 获取dapp评论的回复
export const commentReply = (commentID, start = 0, limit = 10) => get('/api/dapp/comment/' + commentID + '/replies?start=' + start + '&limit=' + limit)
// 评论dapp content rating
export const comment = (dappID, data) => post('/api/dapp/' + dappID + '/comment', data)
// 回复评论 content
export const reply = (commentID, data) => post('/api/dapp/comment/' + commentID + '/reply', data)
// 删除评论  420 操作错误,原评论不可删除
export const deleteComment = (commentID) => del('/api/dapp/comment/' + commentID)
// 根据id获取评论
export const getCommentWithID = (commentID) => get('/api/dapp/comment/' + commentID)
// 评论点赞 status 0点赞 1取消 id  401 没有权限
export const like = (commentID) => post('/api/dapp/comment/' + commentID + '/like')
// 获取用户未读信息数
export const notificationsNum = () => get('/api/mine/notifications/unread/total/verbose')
// 按类别获取通知
export const notifications = (catagoryID, start = 0, limit = 10) => get('/api/mine/notifications/category/' + catagoryID + '?start=' + start + '&limit=' + limit)
// 添加草稿
export const addDrafts = (dappID, data) => post('/api/dapp/' + dappID + '/drafts', data)
// 编辑帖子
export const editArticle = (articleID, data) => post('/api/dapp/drafts/' + articleID, data)
// 发布帖子
export const publishArticle = (articleID) => put('/api/article/' + articleID + '/publish')
// 删除帖子
export const deleteArticle = (articleID) => del('/api/article/' + articleID)
// 删除帖子的评论
export const deleteArticleComment = (commentID) => del('/api/article/comment/' + commentID)
// 根据id获取帖子
export const getArticle = (articleID) => get('/api/article/' + articleID)
// 帖子的评论
export const articleComments = (articleID, start = 0, limit = 10) => get('/api/article/' + articleID + '/comments?start=' + start + '&limit=' + limit)
// 评论帖子
export const commentArticle = (articleID, data) => post('/api/article/' + articleID + '/comment', data)
// 帖子评论的回复
export const articleReply = (articleID, commentID) => get('/api/article/' + articleID + '/comment/' + commentID + '/replies')
// 回复帖子的评论
export const replyArticle = (commentID, data) => post('/api/article/comment/' + commentID + '/reply', data)
// 帖子评论点赞
export const articleCommentLike = (commentID) => post('/api/article/comment/' + commentID + '/like')
// 帖子点赞
export const articleLike = (articleID) => post('/api/article/' + articleID + '/like')
// 帖子置顶
export const articleStiky = (articleID) => post('/api/article/' + articleID + '/sticky')
// 获取置顶帖子
export const getStiky = (dappID) => get('/api/article/' + dappID + '/stickies')
// 获取指定dapp的帖子
export const dappArticles = (dappID, order = '') => get('/api/dapp/' + dappID + '/articles?order=' + order)
// 获取帖子
export const articles = () => get('/api/articles')
// 推荐的帖子
export const articleRecommends = () => get('/api/article/recommends')
// 我的帖子
export const myArticles = (userID, status = 1) => get('/api/user/' + userID + '/articles?status=' + status)
// 推荐的评论
export const commentRecommends = () => get('/api/dapp/recommend/comments')
// 根据链获取dapp
export const getDappsByChain = (chainName, data) => get('/api/dapp/chain?chain_name=' + chainName, data)
/*
balance=1,
user_total=2,
trans_amount_total=3,
trans_volume_total=4,
avg_trans_amount_total=5, avg_trans_volume_total=6,
user_total_increment=7
*/
// 获取所有链
export const chains = () => get('/api/chains')
// 获取指定dapp指定日期范围内的各项指标数据
export const getAllQuotasWithDapp = (dappID, scope = '1d') => get('/api/dapp/' + dappID + '/statistics' + '?scope=' + scope)
// 获取指定dapp指定日期范围内的指定指标项统计数据
export const getQuotaWithDapp = (dappID, quota = 2, scope = '1d') => get('/api/dapp/' + dappID + '/statistics' + '/dates/mapping?quota=' + quota + '&scope=' + scope)
// 获取昨天所有链上所有dapp的排行
export const chainsRank = (start = 0, limit = 5) => get('/api/dapp/statistics/rank/chains?start=' + start + '&limit=' + limit)
// 获取昨天所有链上指定category的dapp排行
export const chainsRankWithCategoryID = (categoryID, start = 0, limit = 5) => get('/api/dapp/statistics/rank/chains/category/' + categoryID + '?start=' + start + '&limit=' + limit)
// 获取昨天指定链上所有dapp的排行
export const chainRankWithChainID = (chainID) => get('/api/dapp/statistics/rank/chain/' + chainID)
// 获取昨天指定链上指定category的dapp的排行
export const chainRankWithChainAndCategory = (chainID, categoryID) => get('/api/dapp/statistics/rank/chain/' + chainID + '/category/' + categoryID)
// 获取dapp的一些统计杂项,如各category的dapp总数,合约总数,昨天的user_total统计
export const statisticsSummary = () => get('/api/dapp/statistics/summary')
// 所有链，将统计日期范围内每天的指定指标按天对应返回
export const statisticsChainsDates = (quota) => get('/api/dapp/statistics/chains/dates/mapping?quota=' + quota)
// 指定链，将统计日期范围内每天的指定指标按天返回
export const statisticsChain = (chainID, quota) => get('/api/dapp/statistics/chain/' + chainID + '/dates/mapping?quota=' + quota)
// dapp认领
export const dappClaim = (dappID, data) => post('/api/claim/' + dappID, data)
