<template>
  <div class="dappPic">
    <div class="picBig">
      <img :src="ImgUrl" style="width: 100%; height: 100%">
    </div>
    <div class="picSmall">
      <ul>
        <li @click='getIndex(item)' v-for = "(item, index) in previews" :key ="index">
          <img :src="item">
        </li>
      </ul>
    </div>
  </div>
</template>
<script type="text/javascript">
export default {
  name: 'PreviewImgs',
  data () {
    return {
      ImgUrl: ''
    }
  },
  props: {
    previews: {
      type: Array
    }
  },
  watch: {
    previews (value) {
      this.ImgUrl = this.previews ? this.previews[0] : ''
    }
  },
  methods: {
    getIndex (item) {
      this.ImgUrl = item
    }
  }
}
</script>
<style type="text/css" scoped="previewImgs">
  .dappPic {
  width: 672px;
  height: 420px;
  border-radius: 10px;
  border: solid 1px #dedede;
  margin: 0 auto;
}
.picBig {
  width: 652px;
  height: 334px;
  border-radius: 10px;
  margin: 10px auto 10px;
  background-color: #f4f5f5;
  border: solid 1px #ebebeb;
}
.picBig img {
  border-radius: 10px;
}
.picSmall {
  width: 100%;
  margin: 0 auto;
  height: 115px;
}
.picSmall ul {
  width: 100%;
  margin-left: 6px;
}
.picSmall ul li {
  width: 108px;
  height: 56px;
  margin: 0 4px 0 4px;
  float: left;
  position: relative;
}
.picSmall ul li:active {
  background-color: #f8f8f8;
}
.picSmall ul li img {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  border: solid 1px #ebebeb;
  cursor: pointer;
}
.picSmall ul li .triangle {
  border: none;
}
</style>
