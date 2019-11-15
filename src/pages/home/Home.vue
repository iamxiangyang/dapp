<template>
  <div class="boxAll" @wheel='wheel'>
    <div class="adMain">
      <nav class="swiperBox">
        <div class="swiper-container">
          <div class="swiper-wrapper">
              <div class="swiper-slide slide"   v-for="(item,index) in lists" :key="index" v-if="Object.keys(item).length > 0">
                <div class="navCardInner" @click = 'toDetail(item.dappId)' v-if='index < lists.length-1'>
                  <div class="navCardUpper">
                    <img :src="item.previews?item.previews[0]:''" alt="avatar" style="width: 100%; height: 100%">
                  </div>
                  <div class="navCardMiddle">
                    <b>{{item.name}}</b>
                  </div>
                  <div class="navCardBottom">
                    <p>{{$t('lang.madeBy')}}: {{item.author||'unknown'}}</p>
                    <p><span>{{item.rating[0]}}<b><CustomRate disabled :stars = item.rating[0]></CustomRate></b></span></p>
                    <p>{{item.views}} {{$t('lang.views')}}</p>
                  </div>
                </div>
                <div class="adSlide" v-if='index===lists.length-1'>
                  <div class="adContent">
                    <p class="adTitle">Advertising for rent</p>
                    <p class="adText">Contact information:
                    dappspace2019@gmail.com</p>
                  </div>
                </div>
              </div>
          </div>
        </div>
        <div class="all" @click='toAll'>All</div>
      </nav>
      <div class="mouseWheel"><CustomMouse/></div>
    </div>
    <div ref='dappBox' class='dappBox' id='dappBox'>
      <Application></Application>
    </div>
 </div>
</template>

<script>
import Swiper from 'swiper'
import CustomMouse from '../../components/CustomMouse'
import 'swiper/dist/css/swiper.min.css'
import CustomRate from '../../components/CustomRate.vue'
import {mapMutations} from 'vuex'
import {recommends} from '../../util/axios.js'
import Application from '../../pages/application/Application.vue'
export default {
  name: 'Home',
  data: function () {
    return {
      lists: [],
      err: '',
      direction: '',
      swiper: null,
      scroll: null
    }
  },
  components: {
    CustomRate,
    CustomMouse,
    Application
  },
  methods: {
    wheel (e) {
      let ele = document.getElementById('dappBox')
      let height = document.body.clientHeight
      if (e.deltaY > 5) {
        if (ele.offsetTop < 74) {
          ele.style.top = 74
          return
        }
        ele.style.top = '74px'
        ele.style.transition = 'top 1s ease 0s'
      } else if (e.deltaY < -5) {
        if (ele.offsetTop > height - 20) {
          ele.style.top = '100%'
          return
        }
        ele.style.top = '100%'
        ele.style.transition = 'top 1s ease 0s'
      }
    },
    toAll () {
      this.$refs.dappBox.scrollIntoView()
    },
    setSwiper (w) {
      let that = this
      if (w < 650) {
        that.direction = 'vertical'
      } else {
        that.direction = 'horizontal'
      }
      if (that.swiper) {
        that.swiper.destroy()
      }
      that.swiper = new Swiper('.swiper-container', {
        loop: false,
        slidesPerView: 'auto',
        centeredSlides: false,
        initialSlide: this.activeIndex,
        observer: true,
        observeParents: true,
        freeMode: true,
        direction: that.direction
      })
    },
    toDetail (dappId) {
      this.$router.push({path: 'dapp/' + dappId})
    },
    closeAlert () {
      this.isRegisterShow = false
    },
    ...mapMutations('vc', ['navHide', 'navShow'])
  },
  created: function () {
    recommends()
      .then((res) => {
        if (res && res.status === 200) {
          this.lists = res.data.dapps
          if (this.lists.length > 0) {
            let endIndex = res.data.dapps.length - 1
            this.lists.splice(endIndex, 0, res.data.dapps[endIndex])
          }
        }
      })
  },
  mounted: function () {
    let that = this
    // window.eventBus.$on('scrollTop', () => {
    //   that.$refs.dappBox.scrollIntoView()
    // })
    window.eventBus.$on('resize', function (w) {
      if (that && that.swiper && that.setSwiper) {
        that.setSwiper(w)
      }
    })
    let w = document.documentElement.clientWidth
    that.setSwiper(w)
    that.navHide()
  },
  beforeDestroy: function () {
    let that = this
    that.navShow()
    that.swiper = null
  }
}
</script>

<style scoped>
.boxAll {
  position: absolute;
  width: 100%;
  margin: 0;
  padding: 0;
  top: 0;
  bottom: 0;
  background: #5A3EE0;
  background-image: url(../../assets/img/home_bg.png);
  background-repeat:no-repeat;
  background-size:cover;
  overflow: hidden;
}
.dappBox {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 100%;
  z-index: 99;
}
.boxAll .adMain {
  width: 100%;
  height: 100%;
}
.swiperBox {
  width: 100%;
  position: relative;
  height: 550px;
  top: 15%;
}
.slide {
  width: 417px;
  margin-right: 30px;
}
.adSlide {
  width: 417px;
  height: 223px;
  background-color: #FFFFFF;
  border-radius: 10px;
  padding: 40px 30px;
  margin-top: 100px;
  margin-right: 30px;
  background: url('../../assets/img/advert.png');
  background-size: 100% 100%;
}
.adContent {
  width: 358px;
  height: 143px;
  border-radius: 10px;
  background-color: #F3F4F6;
  padding-top: 45px;
}
.adTitle {
  font-size: 24px;
  color: #000000;
  line-height: 30px;
  text-align: left;
  padding-left: 25px;
}
.adText {
  font-size: 14px;
  color: #666666;
  margin-top: 10px;
  text-align: left;
  padding-left: 25px;
}
.navCardUpper {
  width: 417px;
  height: 223px;
  margin-top: 100px;
  cursor: pointer;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.navCardUpper img {
  width: 100%;
  height: 100%;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.navCardMiddle {
  font-family: Lato-Bold;
  width: 417px;
  height: 100px;
  font-size: 16px;
  color: #ffffff;
  letter-spacing: 0.5px;
  line-height: 100px;
  text-align: left;
  padding-left: 40px;
  background:url('../../assets/img/title_bg_normat.png') center no-repeat;
  background-size: cover;
  transition: 0.2s;
  cursor: pointer;
}
.navCardBottom {
  width: 417px;
  height: 0;
  background-color: rgba(255,255,255,0.9);
  font-size: 14px;
  text-align: left;
  transition: 0.2s;
  padding-left: 40px;
  overflow: hidden;
  cursor: pointer;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
}
.navCardBottom p {
  margin-top: 40px;
  line-height: 14px;
}
.navCardBottom >>> .ivu-rate {
  margin-left: 10px !important;
}
.navCardBottom >>> .ivu-rate-star {
  margin-right: 0px !important;
}
.swiper-container {
  height: 550px;
  margin-left: 200px;
}
.mouseWheel {
  position: fixed;
  left: 50%;
  bottom: 6%;
}
.all {
  position: relative;
  margin: 25px auto 0;
  color: white;
  font-size: 14px;
  display: none;
  cursor: pointer;
}
.navCardInner:hover .navCardUpper{
  margin-top: 10px;
  transition: 0.3s;
}
.navCardInner:hover .navCardMiddle {
  background:url('../../assets/img/title_bg_selected.png') center no-repeat;
  background-size: cover;
  margin-top: 0px;
}
.navCardInner:hover .navCardBottom {
  height: 204px;
  transition: 0.3s;
}
@media screen and (max-width: 1440px) and (min-width: 650px) {
  .boxAll {
    background-position: 100% 0%;
  }
  .navCardInner:hover .navCardUpper{
    margin-top: 0;
    transition: 0.3s;
  }
  .swiper-container,.swiperBox{
    height: 324px;
  }
  .swiper-container {
    margin-left: 55px;
  }
  .navCardUpper {
   width: 250px;
   height: 134px;
   border-top-left-radius: 10px;
   border-top-right-radius: 10px;
  }
  .adSlide {
    width: 250px;
    height: 134px;
    margin-right: 30px;
    padding: 15px;
  }
  .adContent {
    width: 220px;
    height: 104px;
    padding-top: 20px;
  }
  .adTitle {
    font-size: 16px;
    line-height: 19px;
    padding-left: 15px;
  }
  .adText {
    margin-top: 5px;
    padding-left: 15px;
  }
  .navCardUpper img {
   border-top-left-radius: 10px;
   border-top-right-radius: 10px;
  }
  .navCardMiddle {
   width: 250px;
   height: 59px;
   font-size: 16px;
   line-height: 59px;
   padding-left: 20px;
  }
  .navCardBottom {
   width: 250px;
   padding-left: 20px;
  }
  .navCardInner:hover .navCardBottom {
   height: 129px;
  }
  .slide {
    width: 250px;
  }
  .navCardBottom p {
    margin-top: 20px;
    line-height: 17px;
  }
}

@media screen and (max-width: 650px) {
  .boxAll {
    background-position: 100% 0%;
  }
  .swiperBox {
    top: 108px;
    height: 100%;
    padding-bottom: 108px;
  }
  .all {
    display: inherit;
  }
  .mouseWheel {
    display: none;
  }
  .swiper-container {
    width: 250px;
    margin: 0 auto;
  }
  .swiper-wrapper {
    width: 250px;
    height: 258px;
    display: flex;
    flex-direction: column;
  }
  .navCardUpper {
   width: 250px;
   height: 141px;
   margin-top: 0;
   border-radius: 6px;
  }
 .adSlide {
    width: 250px;
    height: 134px;
    margin-right: 30px;
    padding: 15px;
  }
  .adContent {
    width: 220px;
    height: 104px;
    padding-top: 20px;
  }
  .adTitle {
    font-size: 16px;
    line-height: 19px;
    padding-left: 15px;
  }
  .adText {
    margin-top: 5px;
    padding-left: 15px;
  }
  .navCardUpper img {
   border-top-right-radius: 6px;
   border-top-left-radius: 6px;
  }
  .navCardMiddle {
    display: none;
  }
  .navCardBottom {
   width: 250px;
   height: 129px;
  }
  .slide {
    width: 250px;
    height: 258px;
    margin-bottom: 24px;
  }
  .navCardBottom p {
    height: 16px;
    line-height: 16px;
    font-size: 16px;
    margin-top: 20px;
  }
  .navCardInner:hover .navCardBottom {
    height: 122px;
    transition: 0.2s;
  }
  .navCardInner:hover .navCardMiddle {
    display: none;
  }
}
</style>
