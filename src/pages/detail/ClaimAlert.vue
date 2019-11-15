<template>
  <div class="claimCover" v-if='isShow'>
    <div class="claimBox">
      <div class="claimAlert">
        <img src="../../assets/img/close2.png" class="close" @click='close'>
        <h1 class="tit">{{$t('lang.claimCertification')}}</h1>
        <p class="nameRow"><span class="itemTit">{{$t('lang.dapp_name')}}:</span><span class="dappName">{{dappName}}</span>
        <p class="previewRow"><span class="itemTit">{{$t('lang.upload_preview')}}</span><input type="file" ref='addInp' @change='selectImg'></p>
        <p class="previewToast">({{$t('lang.claimUploadToast')}})</p>
        <div class="addBox" @click='addImg'>
          <div v-show='!hasImg'>
            <img src="../../assets/img/add.png" class="add">
            <p>({{num}}/1)</p>
          </div>
          <img class='loadImg' :src='imgSrc' v-show='hasImg'>
        </div>
        <div class="btnGroup">
          <CustomButton size='normal' @click='close'>{{$t('lang.cancel')}}</CustomButton>
          <CustomButton size='normal' kind='active' class='submitBtn' @click='submit'>{{$t('lang.submit')}}</CustomButton>
        </div>
        <p class="contact">{{$t('lang.claimContactToast')}}</p>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import CustomButton from '../../components/CustomButton.vue'
import {getQNToken, uploadImg, dappClaim} from '../../util/axios.js'
export default {
  data () {
    return {
      isShow: this.show,
      num: 0,
      imgSrc: '',
      hasImg: false,
      file: undefined,
      key: '',
      dappId: ''
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    dappName: {
      type: String,
      default: ''
    }

  },
  components: {
    CustomButton
  },
  watch: {
    show (val) {
      this.isShow = val
    }
  },
  mounted () {
    this.dappId = this.$route.params.dappId
  },
  methods: {
    close () {
      this.$emit('close')
    },
    addImg (e) {
      e.preventDefault()
      let inp = this.$refs.addInp
      inp.click()
    },
    selectImg () {
      this.file = this.$refs.addInp.files[0]
      if (this.file.size > 1000 * 1024) {
        this.$toast.show({
          toast: this.$t('lang.claimImgErr')
        })
        return
      }
      let reader = new FileReader()
      reader.readAsDataURL(this.file)
      let that = this
      reader.onloadend = function () {
        // 解决不能选取重复图片
        that.$refs.addInp.type = 'text'
        that.$refs.addInp.type = 'file'
        that.imgSrc = this.result
        that.hasImg = true
      }
    },
    submit () {
      if (this.hasImg && this.file) {
        let that = this
        that.uploadImgToQN({
          file: that.file,
          success: function (key) {
            let data = {origin_evidence: key}
            dappClaim(that.dappId, data).then(res => {
              if (res && res.status === 201) {
                that.$toast.show({
                  toast: that.$t('lang.claimSuccess'),
                  type: 'success'
                })
                that.isShow = false
              }
            }).catch(() => {
              that.$toast.show({
                toast: that.$t('lang.claimFail'),
                type: 'error'
              })
            })
          },
          fail: function () {
            that.$toast.show({
              toast: that.$t('lang.claimFail'),
              type: 'error'
            })
          }
        })
      }
    },
    uploadImgToQN ({file, success = () => {}, fail = () => {}}) {
      getQNToken(1).then((res) => {
        if (!res) return
        let formData = new FormData()
        formData.append('token', res.data.token)
        formData.append('file', file)
        formData.append('key', res.data.key)
        uploadImg(formData).then((res) => {
          if (res && res.status === 200) {
            let key = res.data.key
            success(key)
          }
        })
      }).catch(err => {
        fail(err)
      })
    }
  }
}
</script>
<style type="text/css" scoped="claim">
.claimCover {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
}
.claimAlert {
  width: 657px;
  height: 380px;
  background: #fff;
  border-radius: 10px;
  padding-left: 50px;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
}
.close {
  width: 24px;
  height: 24px;
  float: right;
  margin-right: -35px;
  border-radius: 10px;
  cursor: pointer;
}
.tit {
  color: #000000;
  font-size: 24px;
  height: 29px;
  line-height: 29px;
  text-align: center;
  margin: 30px auto 0;
}
.nameRow {
  margin-top: 15px;
  text-align: left;
}
.nameRow .dappName {
  margin-left: 10px;
  color: #999999;
  font-size: 14px;
}
.itemTit {
  color: #333333;
  font-size: 14px;
  font-weight: bold;
}
.previewRow {
  margin-top: 15px;
  text-align: left;
}
.previewRow input{
  display: none;
}
.previewToast {
  color: #999999;
  font-size: 12px;
  margin-top: 10px;
  text-align: left;
}
.addBox {
  width: 180px;
  height: 95px;
  border-radius: 10px;
  margin-top: 10px;
  border: 1px dashed #EBEBEB;
  cursor: pointer;
}
.addBox .add {
  width: 16px;
  height: 16px;
  position: relative;
  margin: auto;
  margin-top: 30px;
}
.addBox .loadImg {
  width: 100%;
  height: 100%;
  background-color: #F5F7F6;
  border-radius: 10px;
}
.claimAlert .btnGroup {
  margin: 20px auto 0;
  height: 36px;
  width: 216px;
}
.btnGroup .submitBtn {
  margin-left: 20px;
}
.contact {
  color: #999;
  font-size: 12px;
  text-align: center;
  margin: 30px auto;
  text-decoration: underline;
  height: 15px;
  line-height: 15px;
}
</style>
