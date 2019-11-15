<template>
<div class="articleBox">
  <div class="selectCard" v-if='isOwner'>
    <button class="pub" :class='{"activeState":pubActive}' @click='published'>{{$t('lang.published_topic')}}</button>
    <span class="line"></span>
    <button class="draft" :class='{"activeState":draftActive}' @click='draft'>{{$t('lang.draft')}}</button>
  </div>
  <div class="placeBox" v-if='articles.length === 0'><img src="../../assets/img/nullPlace.png">{{$t('lang.nocontent')}}</div>
  <div v-for='(item, index) in articles' :key='index' class="infoRow">
    <Discussion :info='item' :from = 'from' class='dis'></Discussion>
  </div>
</div>
</template>
<script type="text/javascript">
import {myArticles} from '../../util/axios.js'
import {mapState} from 'vuex'
import Discussion from '../detail/discussion.vue'
import {PUBLISHED, DRAFT} from '../../common/Contants.js'
export default {
  data () {
    return {
      draftActive: false,
      pubActive: true,
      articles: [],
      from: PUBLISHED,
      isOwner: false,
      userId: ''
    }
  },
  computed: {
    ...mapState({
      user: state => state.userInfo.user
    })
  },
  components: {
    Discussion
  },
  mounted () {
    this.userId = this.$route.params['userId']
    if (this.user && this.userId && this.userId.toString() === this.user.userId.toString()) {
      this.isOwner = true
    }
    this.getArticles()
  },
  methods: {
    published () {
      this.getArticles(1)
      this.pubActive = true
      this.draftActive = false
      this.from = PUBLISHED
    },
    draft () {
      this.getArticles(0)
      this.pubActive = false
      this.draftActive = true
      this.from = DRAFT
    },
    getArticles (status = 1) {
      myArticles(this.userId, status).then(res => {
        if (res && res.status === 200) {
          this.articles = res.data.articels
        }
      })
    }
  }
}
</script>
<style type="text/css" scoped>
.articleBox {
  width: 100%;
  padding-bottom: 20px;
}
.selectCard {
  height: 36px;
  line-height:36px;
  margin: 15px auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
.selectCard button:hover {
  color: #6D64FB;
}
.placeBox {
  width: 100%;
  margin-top: 58px;
  text-align: center;
  font-size: 14px;
  color: #64442C;
}
.placeBox img {
  width: 80px;
  height: 54px;
  margin: 0 auto;
  display: block;
}
.draft, .pub{
  width: auto;
  padding: 0 10px;
  height: 36px;
  color: #8590A6;
  font-size: 14px;
  line-height: 36px;
  background: #fff;
}
.line {
  width: 1px;
  height: 17px;
  background: rgb(180, 180, 180);
}
.activeState {
  color: #6D64FB;
}
.infoRow {
  width: 652px;
  margin: 10px auto 0;
  background: #fff;
}
</style>
<style type="text/css">
.dis ul {
   background: #f9f9f9 !important;
 }
</style>
