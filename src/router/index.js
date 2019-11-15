import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: resolve => require(['@/pages/home/Home'], resolve),
      meta: {
        title: 'DappSpace'
      }
    },
    {
      path: '/agreement',
      name: 'Agreement',
      component: resolve => require(['@/pages/agreement/agreement'], resolve),
      meta: {
        title: 'DappSpace'
      }
    },
    {
      path: '/regist',
      name: 'Regist',
      component: resolve => require(['@/pages/regist/Regist'], resolve),
      meta: {
        title: 'DappSpace'
      }
    },
    {
      path: '/registType',
      name: 'RegistType',
      component: resolve => require(['@/pages/regist/RegistType'], resolve),
      meta: {
        title: 'DappSpace'
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: resolve => require(['@/pages/login/Login'], resolve),
      meta: {
        title: 'DappSpace'
      }
    },
    {
      path: '/news',
      name: 'News',
      component: resolve => require(['@/pages/news/News'], resolve),
      meta: {
        title: 'DappSpace'
      }
    },
    {
      path: '/user/:userId',
      name: 'User',
      component: resolve => require(['@/pages/user/CommonUser'], resolve),
      meta: {
        title: 'DappSpace'
      },
      children: [
        {
          path: '/user/:userId/comments',
          name: 'Comment',
          component: resolve => require(['@/pages/user/PublishedComment'], resolve),
          meta: {
            title: 'DappSpace'
          }
        },
        {
          path: '/user/:userId/profile',
          name: 'Info',
          component: resolve => require(['@/pages/user/UserInfo'], resolve),
          meta: {
            title: 'DappSpace'
          }
        },
        {
          path: '/user/:userId/dapps',
          name: 'Published',
          component: resolve => require(['@/pages/user/Published'], resolve),
          meta: {
            title: 'DappSpace'
          }
        },
        {
          path: '/user/:userId/topics',
          name: 'Topic',
          component: resolve => require(['@/pages/user/Topic'], resolve),
          meta: {
            title: 'DappSpace'
          }
        },
        {
          path: '/dapp/:dappId/edit',
          name: 'PublishedEdit',
          component: resolve => require(['@/pages/user/PublishedEdit'], resolve),
          meta: {
            title: 'DappSpace',
            keepAlive: true
          }
        }
      ]
    },
    {
      path: '/user/:userId/profile/edit',
      name: 'UserInfoEdit',
      component: resolve => require(['@/pages/user/CommonUserEdit'], resolve),
      meta: {
        title: 'DappSpace'
      }
    },
    {
      path: '/passwordChanged',
      name: 'PasswordChanged',
      component: resolve => require(['@/pages/user/PasswordChanged'], resolve),
      meta: {
        title: 'DappSpace'
      }
    },
    {
      path: '/games',
      name: 'Games',
      component: resolve => require(['@/pages/application/Application'], resolve),
      meta: {
        title: 'Games-DappSpace'
      }
    },
    {
      path: '/exchanges',
      name: 'Exchanges',
      component: resolve => require(['@/pages/application/Application'], resolve),
      meta: {
        title: 'Exchanges-DappSpace'
      }
    },
    {
      path: '/luckydraw',
      name: 'Luckydraw',
      component: resolve => require(['@/pages/application/Application'], resolve),
      meta: {
        title: 'Lucky draw-DappSpace'
      }
    },
    {
      path: '/others',
      name: 'Others',
      component: resolve => require(['@/pages/application/Application'], resolve),
      meta: {
        title: 'Others-DappSpace'
      }
    },
    {
      path: '/dapp/:dappId',
      name: 'Detail',
      component: resolve => require(['@/pages/detail/Detail'], resolve),
      meta: {
        title: 'Detail-DappSpace'
      },
      redirect: {path: '/dapp/:dappId/comment'},
      children: [
        {
          path: '/dapp/:dappId/comment',
          name: 'Comments',
          component: resolve => require(['@/pages/detail/CommentPage'], resolve),
          meta: {
            title: 'Detail-DappSpace'
          }
        },
        {
          path: '/dapp/:dappId/topic',
          name: 'Topics',
          component: resolve => require(['@/pages/detail/DiscussionPage'], resolve),
          meta: {
            title: 'Detail-DappSpace'
          }
        }
      ]
    },
    {
      path: '/:dappId/write',
      name: 'WriteTopic',
      component: resolve => require(['@/pages/detail/WriteTopic'], resolve),
      meta: {
        title: 'Detail-DappSpace'
      }
    },
    {
      path: '/topic/:topicID/edit',
      name: 'EditTopic',
      component: resolve => require(['@/pages/detail/WriteTopic'], resolve),
      meta: {
        title: 'Detail-DappSpace'
      }
    },
    {
      path: '/all',
      name: 'Application',
      component: resolve => require(['@/pages/application/Application'], resolve),
      meta: {
        title: 'All-DappSpace'
      }
    },
    {
      path: '/community',
      name: 'Community',
      component: resolve => require(['@/pages/community/Community'], resolve),
      meta: {
        title: 'Community-DappSpace'
      }
    },
    {
      path: '/recharge',
      name: 'Recharge',
      component: resolve => require(['@/pages/recharge/Recharge'], resolve),
      meta: {
        title: 'Recharge-DappSpace'
      }
    },
    {
      path: '/wallet',
      name: 'Wallet',
      component: resolve => require(['@/pages/wallet/Wallet'], resolve),
      meta: {
        title: 'Wallet-DappSpace'
      }
    },
    {
      path: '/dapps/upload',
      name: 'Upload',
      component: resolve => require(['@/pages/upload/Upload'], resolve),
      meta: {
        title: 'Upload-DappSpace'
      }
    },
    {
      path: '/about',
      name: 'AboutUs',
      component: resolve => require(['@/pages/aboutUs/AboutUs'], resolve),
      meta: {
        title: 'About-DappSpace'
      }
    },
    {
      path: '/data',
      name: 'Data',
      component: resolve => require(['@/pages/data/DataPage'], resolve),
      meta: {
        title: 'Data-DappSpace'
      }
    }
  ]
})
