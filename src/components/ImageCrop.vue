<template>
<div class="cropWrap" v-show='crop'>
  <div class="cropContainer">
      <p class="tit">{{$t('lang.upload')}}</p>
     <img src="../assets/img/close2.png" class="closeIcon" @click='close'>
     <div class="cropBox" @click='selectImg' @dragenter='dragenter' @dragover='dragover' @drop='drop'>
        <VueCropper
        ref="cropper"
        :img='option.img'
        :outputSize="option.size"
        :outputType="option.outputType"
        :info="option.info"
        :full="option.full"
        :canMove="option.canMove"
        :canMoveBox="option.canMoveBox"
        :original="option.original"
        :autoCrop="option.autoCrop"
        :autoCropWidth="option.autoCropWidth"
        :autoCropHeight="option.autoCropHeight"
        :fixedBox="option.fixedBox"
        :centerBox = 'option.centerBox'
        :fixed = 'option.fixed'
        @realTime="realTime"
        >
        </VueCropper>
        <div class="handelBox" v-show='flag'>
          <img src="../assets/img/add.png" />
          <p>{{$t('lang.drag_click')}}</p>
        </div>
    </div>
    <div class="preview">
      <div class="big"><img  :src='url' v-show='url'></div>
      <div class="circleBox">
        <div class="normal"><img :src="url" v-show='url'></div>
        <div class="small"><img :src="url" v-show='url'></div>
      </div>
    </div>
    <div style="clear: both;"></div>
    <div class='btnBox'>
      <CustomButton @click='cancel'>{{$t('lang.cancel')}}</CustomButton>
      <CustomButton kind='active' style='margin-left: 20px;' @click='finish'>{{$t('lang.save')}}</CustomButton>
    </div>
    <input type="file" ref='logoInp' class="uploads" :value="imgFile" style="position:absolute;display: none;" accept="image/png, image/jpeg, image/jpg" @change="handelImg()">
  </div>
</div>
</template>
<script type="text/javascript">
import { VueCropper } from 'vue-cropper'
import CustomButton from './CustomButton.vue'
export default {
  data () {
    return {
      option: {
        img: '',
        outputSize: 1,
        outputType: 'png',
        canMove: true,
        original: false,
        canMoveBox: true,
        autoCrop: true,
        info: false,
        autoCropWidth: 150,
        autoCropHeight: 150,
        fixedBox: false,
        centerBox: false,
        fixed: true
      },
      imgFile: '',
      url: '',
      flag: true,
      oldImg: ''
    }
  },
  props: {
    crop: {
      default: false,
      type: Boolean
    },
    img: {
      type: String
    }
  },
  watch: {
    'option.img': function (value) {
      if (value === '' || value === 'null') {
        this.flag = true
      } else {
        this.flag = false
      }
    },
    img: function (value) {
      if (!this.oldImg) {
        this.oldImg = value
      }
      this.url = value
    }
  },
  methods: {
    handelImg () {
      let inp = this.$refs.logoInp
      this.fileList(inp.files)
    },
    cancel () {
      this.$set(this.option, 'img', 'null')
      this.url = this.oldImg
    },
    close () {
      this.$emit('close')
    },
    selectImg (e) {
      if (this.flag) {
        e.preventDefault()
        let inp = this.$refs.logoInp
        inp.click()
      }
    },
    dragenter (e) {
      e = e || window.event
      e.preventDefault()
      e.stopPropagation()
    },
    dragover (e) {
      e = e || window.event
      e.preventDefault()
      e.stopPropagation()
    },
    drop (e) {
      e = e || window.event
      e.preventDefault()
      e.stopPropagation()
      this.fileList(e.dataTransfer.files)
    },
    // 获取文件信息
    fileList (files) {
      let type = files[0].type
      let that = this
      if (files.length > 1) {
        return
      }
      if (type && type.indexOf('image') === -1) {
        this.$toast.show({
          toast: this.$t('lang.picErr')
        })
        return
      }
      let fileReader = new FileReader()
      fileReader.readAsDataURL(files[0])
      fileReader.onload = function () {
        that.option.img = this.result
      }
    },
    realTime (data) {
      let that = this
      if (this.option.img === '' || this.option.img === 'null') {
        return
      }
      this.$refs.cropper.getCropBlob((data) => {
        let img = window.URL.createObjectURL(data)
        that.url = img
      })
    },
    finish () {
      // 输出
      this.$refs.cropper.getCropBlob((data) => {
        this.$emit('save', [data])
        this.$refs.cropper.clearCrop()
      })
    }
  },
  components: {
    VueCropper,
    CustomButton
  }
}
</script>
<style type="text/css" scoped="">
  .cropWrap {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.65);
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .cropContainer {
    position: relative;
    width: 545px;
    border-radius: 10px;
    padding-top: 30px;
    padding-bottom: 20px;
    margin: 0 auto;
    background-color: #fff;
  }
  .cropContainer .tit {
    position: relative;
    text-align: center;
    font-size: 24px;
    color: #000;
    line-height: 29px;
  }
  .cropBox {
    float: left;
    margin-left: 20px;
    margin-top: 20px;
    width: 268px;
    height: 268px;
    position: relative;
    cursor: pointer;
  }
  .handelBox {
    width: 268px;
    height: 268px;
    top: 0;
    text-align: center;
    position: absolute;
  }
  .handelBox img {
    width: 16px;
    height: 16px;
    margin-top: 112px;
  }
  .handelBox p {
    width: 100%;
    height: 17px;
    line-height: 17px;
    font-size: 14px;
    color: #333333;
  }
  .preview{
    float: left;
    margin-left: 20px;
    margin-top: 20px;
    top: 0;
  }
 .circleBox {
    margin-top: 20px;
 }
 .preview .big, .big img{
    width: 160px;
    height: 160px;
    background: #F3F4F6;
 }
 .preview .normal, .normal img {
    width: 88px;
    height: 88px;
    border-radius: 50%;
    background: #F3F4F6;
    display: inline-block;
 }
 .preview .small, .small img{
    display: inline-block;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #F3F4F6;
 }
 .btnBox {
  width: 100%;
  height: 36px;
  margin-top: 45px;
  text-align: center;
 }
 .cropContainer .closeIcon {
  position: absolute;
  width: 24px;
  height: 24px;
  top: 0;
  right: -30px;
 }
</style>
<style type="text/css">
.crop-line {
  opacity: 0.75 !important;
}
.line-w {
  top: 33.3% !important;
  background: #39f;
  height: 1px !important;
}
.line-a {
  left: 33.3% !important;
  background: #39f;
  width: 1px !important;
}
.line-s {
  bottom: 33.3% !important;
  background: #39f;
  height: 1px !important;
}
.line-d {
  right: 33.3% !important;
  background: #39f;
  width: 1px !important;
}
.cropper-box {
  background: #F3F4F6;
}
</style>
