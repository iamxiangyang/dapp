<template>
  <div>
    <div class="contentBox">
      <div class="placeBox" v-if='comments.length === 0'>
        <img src="../../assets/img/nullPlace.png">{{$t('lang.nocontent')}}
      </div>
       <div class = 'commentList' v-for='item in comments' :key='item.commentId'>
        <Comment  :comment ='item' from='StudioProfile'></Comment>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import CustomCollapse from '../../components/CustomCollapse.vue'
import CustomeRate from '../../components/CustomRate.vue'
import {myComments} from '../../util/axios.js'
import {mapState, mapMutations} from 'vuex'
import Comment from '../../pages/detail/comment.vue'
export default {
  data () {
    return {
      comments: [],
      start: 0,
      limit: 10,
      userId: ''
    }
  },
  components: {
    CustomCollapse,
    CustomeRate,
    Comment
  },
  computed: {
    ...mapState({
      user: state => state.userInfo.user
    })
  },
  mounted () {
    this.userId = this.$route.params['userId']
    this.getComments()
    let that = this
    window.eventBus.$on('loadMore', () => {
      if (that.$route.name === 'Comment') {
        that.start += 10
        that.getComments()
      }
    })
    this.showLoad()
  },
  methods: {
    ...mapMutations('vc', ['setLoadText', 'showLoad']),
    getComments () {
      let that = this
      myComments(that.userId, that.start, that.limit).then((res) => {
        if (res && res.status === 200) {
          if (res.data.comments && res.data.comments.length < 10) {
            this.setLoadText('lang.nomore')
          }
          that.comments = that.comments.concat(res.data.comments)
        }
      })
    }
  }
}
</script>
<style type="text/css" scoped>
.contentBox {
  width: 652px;
  margin: 10px auto 10px;
  height: auto;
  letter-spacing: 0.5px;
}
.placeBox img {
  width: 80px;
  height: 54px;
  margin: 0 auto;
  display: block;
}
.placeBox {
  font-size: 14px;
  color: #64442C;
  text-align: center;
  margin: 58px auto 0;
}
.commentList {
  background: #fff;
}
</style>
