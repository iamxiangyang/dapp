<template>
  <div class='optionItem' :class= '{selected:active}' @click='handel' @mouseover='enter' @mouseout='leave'>
    <p>{{tit}}</p>
    <div v-show='active'></div>
  </div>
</template>
<script type="text/javascript">
export default {
  data () {
    return {
      selected: false
    }
  },
  props: {
    tit: {
      type: String
    },
    active: {
      type: [String, Boolean],
      default: false
    }
  },
  methods: {
    handel (event) {
      this.$emit('click', event)
    },
    leave (event) {
      this.$emit('mouseout', event)
    },
    enter (event) {
      this.$emit('mouseover', event)
    }
  }
}
</script>
<style type="text/css" scoped>
.optionItem {
  font-size: 16px;
  color: #8590A6;
  height: 30px;
  text-align: center;
  cursor: default;
}
.optionItem:hover {
  color: #6D64FB;
}
.optionItem div {
  width: 21px;
  height: 4px;
  margin: 0 auto;
  background: #6D64FB;
  border-radius: 2px;
}
.selected {
  color: #6D64FB;
}
</style>
