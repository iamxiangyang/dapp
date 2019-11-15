<template>
  <Rate v-model='rates' :disabled='isDisabled' :allow-half = 'allowHalf'  @on-change='change'></Rate>
</template>
<script type="text/javascript">
import {Rate} from 'iview'
export default {
  props: {
    stars: {
      default: 0
    },
    disabled: {
      default: true
    },
    isAllowHalf: {
      default: true
    }
  },
  data () {
    return {
      isDisabled: true,
      allowHalf: true
    }
  },
  components: {
    Rate
  },
  computed: {
    rates: {
      set () {
      },
      get () {
        return Math.round(this.stars * 2) / 2
      }
    }
  },
  methods: {
    change (event) {
      this.$emit('on-change', event)
    }
  },
  mounted () {
    this.isDisabled = this.disabled !== 'false'
    this.allowHalf = this.isAllowHalf !== 'false'
  }
}
</script>
<style type="text/css">
.ivu-rate-star-full:before, .ivu-rate-star-half .ivu-rate-star-content:before {
  color: #FFDB73 !important;
  margin: 0;
  padding: 0;
}
.ivu-rate {
  margin-right: 0 !important;
  font-size: 18px;
  margin: 0;
  padding: 0;
}
.ivu-rate-star {
  margin: 0;
  padding: 0;
  margin-right: 0px !important;
}
.ivu-rate-star-zero:before {
  margin: 0;
  padding: 0;
  color: #ebebeb;
}
</style>
