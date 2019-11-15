<template>
    <div>
      <p class="commentText">{{txt}}
      <button class="arrowDown" @click = 'showMore' v-if='isShowMore' :class='{active:isActive}'>{{$t('lang.viewAll')}}
      <Icon type="ios-arrow-down" class='arrow' size='20' :class= 'isUp === true ? "rotateUp" : "rotateDown"'></Icon>
      </button>
      </p>
    </div>
</template>
<script type="text/javascript">
import CustomeRate from './CustomRate.vue'
import {Icon} from 'iview'
const TEXT_LIMIT = 86
export default {
  data () {
    return {
      isShowMore: false,
      isUp: false,
      isActive: false,
      comment: ''
    }
  },
  props: {
    text: {
      default: '',
      type: String
    },
    toggle: {
      type: [Function, String]
    }
  },
  components: {
    CustomeRate,
    Icon
  },
  mounted () {
    this.comment = this.formatText(this.text)
  },
  computed: {
    txt: function () {
      if (this.comment === this.text) {
        return this.comment
      }
      return this.formatText(this.text)
    }
  },
  methods: {
    showMore (event) {
      if (this.toggle) {
        this.toggle()
        return
      }
      if (this.comment === this.text) {
        this.comment = this.formatText(this.text)
        this.isUp = false
      } else {
        this.comment = this.text
        this.isUp = true
      }
    },
    formatText (v) {
      let that = this
      var eng = 0
      var china = 0
      var length = 0
      if (v.length <= 68) {
        that.isShowMore = false
        return v
      }
      for (var i = 0; i < v.length; i++) {
        if ((eng / 2) + china >= TEXT_LIMIT && length === 0) {
          length = eng + china
        }
        if (v.charCodeAt(i) > 127 || v.charCodeAt(i) === 94) {
          china++
        } else {
          eng++
        }
      }
      if ((china + eng / 2) > TEXT_LIMIT + 10) {
        that.isShowMore = true
        v = v.slice(0, length) + '...'
      } else {
        that.isShowMore = false
      }
      return v
    }
  }
}
</script>
<style type="text/css" scoped>
.commentText {
  font-size: 14px;
  color: #333333;
  line-height: 24px;
  text-align: left;
}
.arrowDown {
  color: #8590A6;
  font-size: 14px;
  letter-spacing: 0.5px;
  line-height: 17px;
  background: none;
  outline: none;
  border: none;
  margin-left: 5px;
  display: inline;
}
.arrowDown:hover {
  color: #6D64FB;
}
.active {
  color: #6D64FB;
}
.rotateUp {
  animation: myrotate 0.3s;
  animation-fill-mode: forwards;
}
.rotateDown {
  animation: myDownRotate 0.3s;
  animation-fill-mode: forwards;
}
@keyframes myrotate {
  from {transform: rotate(0deg)}
  to {transform: rotate(180deg)}
}
@keyframes myDownRotate {
  from {transform: rotate(180deg)}
  to {transform: rotate(0deg)}
}
</style>
