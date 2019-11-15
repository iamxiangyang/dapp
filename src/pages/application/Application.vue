<template>
  <div class="applicationWrap">
    <div class="applicationBox">
      <div class="sortRow">
        <div class="headBox">
          <div class="option pc">
            <div class="optionItem" @click='getDapps("all")'><p><span :class='{active:selected === "all"}'>{{$t('lang.all')}}</span></p><div v-show='selected === "all"'></div></div>
            <div class="optionItem" @click='getDapps("games")'><p><span :class='{active:selected === "games"}'>{{$t('lang.games')}}</span></p><div v-show='selected === "games"'></div></div>
            <div class="optionItem" @click='getDapps("exchanges")'><p><span :class='{active:selected === "exchanges"}'>{{$t('lang.exchanges')}}</span></p><div v-show='selected === "exchanges"'></div></div>
            <div class="optionItem" @click='getDapps("luckydraw")'><p><span :class='{active:selected === "luckydraw"}'>{{$t('lang.luckydraw')}}</span></p><div v-show='selected === "luckydraw"'></div></div>
            <div class="optionItem" @click='getDapps("tron")'><p><span :class='{active:selected === "tron"}'>{{$t('lang.tron')}}</span></p><div v-show='selected === "tron"'></div></div>
            <div class="optionItem" @click='getDapps("eos")'><p><span :class='{active:selected === "eos"}'>{{$t('lang.eos')}}</span></p><div v-show='selected === "eos"'></div></div>
            <div class="optionItem" @click='getDapps("others")'><p><span :class='{active:selected === "others"}'>{{$t('lang.others')}}</span></p><div v-show='selected === "others"'></div></div>
          </div>
           <div class="option phone">
            <MySelect  :options='options' default='lang.all' @valueChanged='changed'></MySelect>
          </div>
          <span class="commentSort">
          <MySelect v-on:valueChanged='sortChanged'></MySelect>
          </span>
        </div>
      </div>
      <div class="appPosition" :class='{tronBg: selected === "tron", eosBg: selected === "eos"}'>
        <Scroll :on-reach-bottom="handleReachBottom" :height = 'height' :loadingText='$t(loadText)' class='scrollContainer' @wheel='wheel'>
        <ul class="appList">
          <li  v-for="list in lists" v-if="Object.keys(list).length > 0" :key="list.id">
            <DappCard :list='list' :isTron = 'list.chain_name === "tron" && catagoryId >=0 ' :isEos = 'list.chain_name === "eos" && catagoryId >=0'></DappCard>
          </li>
        </ul>
      </Scroll>
      </div>
    </div>
  </div>
</template>

<script>
import Scroll from '../../common/scroll/scroll.vue'
import {catagory, getDappsByChain} from '../../util/axios.js'
import MySelect from '../../components/MySelect.vue'
import {mapState, mapMutations} from 'vuex'
import DappCard from '../../components/DappCard.vue'
export default {
  name: 'Application',
  data () {
    return {
      lists: [],
      page: 0,
      err: '',
      allRates: 0,
      loadText: '',
      selected: 'all',
      options: [{value: 'lang.all'}, {value: 'lang.games'}, {value: 'lang.exchanges'}, {value: 'lang.luckydraw'}, {value: 'lang.tron'}, {value: 'lang.others'}],
      isTop: false,
      height: 750
    }
  },
  props: ['path'],
  components: {
    Scroll,
    MySelect,
    DappCard
  },
  mounted () {
    this.getList()
    this.height = document.body.clientHeight - 150
    let that = this
    window.eventBus.$on('resize', function () {
      that.height = document.body.clientHeight - 150
    })
  },
  computed: {
    ...mapState({
      catagoryId: state => state.vc.catagoryId
    })
  },
  methods: {
    ...mapMutations('vc', ['changeDappType']),
    wheel (e) {
      let scrollContainer = document.querySelector('#scrollContainer')
      if (scrollContainer.scrollTop > 0) {
        e.stopPropagation()
      }
    },
    changed (value) {
      let name = ''
      switch (value) {
        case 'lang.all':
          name = 'all'
          break
        case 'lang.games':
          name = 'games'
          break
        case 'lang.exchanges':
          name = 'exchanges'
          break
        case 'lang.luckydraw':
          name = 'luckydraw'
          break
        case 'lang.tron':
          name = 'tron'
          break
        case 'lang.eos':
          name = 'eos'
          break
        case 'lang.others':
          name = 'others'
          break
        default:
          name = 'all'
          break
      }
      this.changeDappType(name)
    },
    getList ({refresh = false} = {}) {
      let data = {start: this.page * 20, limit: 20}
      if (this.catagoryId < 0) {
        let chain = this.catagoryId === -1 ? 'tron' : 'eos'
        getDappsByChain(chain, data).then(res => {
          if (res && res.status === 200) {
            if (refresh) {
              this.page = 0
              this.lists = res.data.dapps
            } else {
              this.lists = this.lists.concat(res.data.dapps)
            }
            if (res.data.dapps.length < 20) {
              this.endLoad()
            }
          }
        })
      } else {
        catagory(this.catagoryId, data)
          .then((response) => {
            if (response && response.status === 200) {
              if (refresh) {
                this.lists = response.data.dapps
              } else {
                this.lists = this.lists.concat(response.data.dapps)
              }
              if (response.data.dapps.length < 20) {
                this.endLoad()
              }
            }
          })
      }
    },
    getDapps (name) {
      this.selected = name
      this.changeDappType(name)
    },
    endLoad () {
      this.loadText = 'lang.nomore'
    },
    handleReachBottom () {
      this.loadText = 'lang.loadmore'
      this.page++
      this.getList()
    },
    sortChanged (value) {
      this.getList({refresh: true})
    }
  },
  watch: {
    'catagoryId': function (old, newValue) {
      this.getList({refresh: true})
    }
  }
}
</script>

<style scoped>
.applicationWrap {
  width: 100%;
  min-width: 456px;
  margin: 0;
  height: 100%;
  position: absolute;
  overflow: hidden;
}
.applicationBox {
  width: 100%;
  top: 0;
  background: rgba(245, 247, 246, 1);
  position: absolute;
  bottom: 0;
}
.sortRow {
  width: 100%;
  height: 50px;
  background: #FFFFFF;
}
.headBox {
  width: 1280px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
}
.option {
  width: 1184px;
  display: flex;
  justify-content: center;
}
.commentSort {
  width: 92px;
  height: 25px;
  margin-top: 12px;
}

.optionItem {
  font-size: 16px;
  color: #8590A6;
  height: auto;
  cursor: default;
  margin-right: 64px;
}
.optionItem div {
  width: 21px;
  height: 4px;
  background: #6D64FB;
  border-radius: 2px;
  margin: 5px auto 0;
}
.optionItem p {
  width: 100%;
  letter-spacing: 0.5px;
  text-align: center;
  margin-top: 13px;
  line-height: 20px;
  white-space:nowrap;
}
.optionItem span{
  text-align: center;
}
.optionItem:hover {
  color: #6D64FB;
}
.active {
  color: #6D64FB;
}
.appPosition {
  width: 100%;
  position: relative;
}
.tronBg {
  background: url('../../assets/img/tron_bg.png');
  background-size:400px;
}
.eosBg {
  background: url('../../assets/img/eos_bg.png');
  background-size:400px;
}
.appList {
  width: 1300px;
  overflow: hidden;
  margin: 0 auto;
  margin-top: 10px;
}
.appList li {
  width: 302px;
  height: 150px;
  margin: 10px;
  background-color: #fff;
  cursor: pointer;
  transition: 0.2s;
  float: left;
  border-radius: 8px;
}
.appList:after{
  content: " ";
  display: block;
  height: 0;
  font-size: 0;
}
.appList li:hover {
  box-shadow: 0 8px 10px 1px rgba(216, 216, 216, 0.8);
  transform: translateY(-5px);
}
.loadMore {
  height: 46px;
  width: 100%;
  margin: auto;
  font-size: 12px;
  line-height: 46px;
  background-color: #dadbdc;
  cursor: pointer;
}
.scrollContainer {
  width: 100%;
}
.phone {
  display: none;
}
@media screen and (min-width: 1440px) {
  .appList {
    width: 1300px;
  }
}
@media screen and (max-width: 1304px) {
  .appList {
    width: 978px;
  }
  .headBox {
    width: 955px;
  }
  .option {
    width: 863px;
  }
  .optionItem {
    margin-right: 44px;
  }
}
@media screen and (max-width: 960px) {
  .appList {
    width: 652px;
  }
  .headBox {
    width: 629px;
  }
  .option {
    width: 547px;
  }
}
@media screen and (max-width: 650px) {
  .appList {
    width: 326px;
  }
  .headBox {
    width: 303px;
    margin-left: 0;
  }
  .option {
    width: 211px;
    z-index: 10;
    margin-top: 12px;
  }
  .optionItem {
    margin-right: 0;
  }
  .pc {
    display: none;
  }
  .phone {
    display: inherit;
  }
}
</style>
<style type="text/css">
  .option .options {
    width: 100px !important;
  }
  .option .inputWrapper {
    width: 110px !important;
  }
  .option .inputWrapper input {
    width: 78px !important;
  }
  .ivu-scroll-loader {
    height: 0;
  }
</style>
