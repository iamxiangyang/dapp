<template>
  <div id="app">
   <CommonHead v-show ='hasHead'/>
    <router-view v-wechat-title='$route.meta.title' ></router-view>
  </div>
</template>

<script>
import CommonHead from './components/CommonHead.vue'
import {mapState, mapMutations} from 'vuex'
import {authentication} from './util/axios.js'
export default {
  name: 'App',
  data () {
    return {
      isShow: true
    }
  },
  methods: {
    ...mapMutations('web3Instance', ['registerWeb3Instance']),
    ...mapMutations('userInfo', ['setUserInfo', 'cleanUserInfo'])
  },
  mounted () {
    let that = this
    this.registerWeb3Instance(function (web3) {
      if (!web3) {
        that.$toast.show({
          toast: that.$t('lang.installToast'),
          time: 2000
        })
        that.$router.push('/wallet')
      }
    })
    authentication().then(res => {
      if (res && res.status === 200) {
        this.setUserInfo(res.data)
      }
    }).catch(() => {
      this.cleanUserInfo()
    })
  },
  components: {
    CommonHead
  },
  computed: {
    ...mapState({
      hasHead: state => state.vc.hasHead
    })
  },
  destoried () {
    window.removeEventListener('resize', window.listener, false)
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
}
</style>
