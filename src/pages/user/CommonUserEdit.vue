<template>
  <div class="wrap">
    <div class="box">
    <header>
      <div class="headBox" @mouseover='showHeadCover' @mouseout='hideHeadCover' @click='selectIcon'>
        <img :src="avatar" class="headPortrait" :title="$t('lang.change')" >
        <div class="imgCover" v-show='isCover'></div>
        <span v-show='isCover'>{{$t('lang.change')}}</span>
      </div>
      <p :class='{"error":isIconError}'>{{isIconError ? $t(warning) : $t(iconToast)}}</p>
    </header>
    <div>
      <CustomInput :tit='$t("lang.nick")'  v-model='name' :focus='nameFocus' :blur='nameBlur' :isError='isNameError' :toast='$t(nameToast)' :placeholder='$t("lang.nickErr_two")' autofocus>
      </CustomInput>
      <div class="row"><span>{{$t('lang.account')}}({{$t('lang.nochanged')}})</span><p>{{account}}</p></div>
      <div class="row"><span>{{$t('lang.address')}}(({{$t('lang.nochanged')}}))</span><p>{{metamask}}</p></div>
    </div>
    <div v-if='isDeveloper'>
      <CustomInput :tit='$t("lang.websiteLink")' v-model='link' :toast='$t(linkToast)' :focus='linkFocus' :blur='linkBlur' :isError='isLinkError'></CustomInput>
      <div class="row"><span class="selfFont">{{$t('lang.studioIntroduction')}}<span class='right'>({{textNum}}/500)</span></span>
       <textarea @input="descArea" @focus='describeFocus' @blur='describeBlur' v-model='description'></textarea>
       <span class="toast" v-show='isDescribeError'>{{$t(describeToast)}}</span>
      </div>
    </div>
    <div class="btnGroup">
      <CallMeButton @click='cancelEdit' size='normal'>{{$t('lang.cancel')}}</CallMeButton>
      <CallMeButton @click='saveInfo' size='normal' kind='active'>{{$t('lang.save')}}</CallMeButton>
    </div>
    </div>
    <CommonEditAlert :toast='toast' v-on:confirm='confirm' v-on:cancel='cancel'></CommonEditAlert>
    <ImageCrop :crop='crop' :img = 'avatar' @close='crop = false' @save='saveAvatar'></ImageCrop>
  </div>
</template>
<script type="text/javascript">
import CommonEditAlert from '../../components/CommonEditAlert.vue'
import CustomInput from '../../components/CustomInput.vue'
import ImageCrop from '../../components/ImageCrop.vue'
import {mapMutations, mapState} from 'vuex'
import {isURL, sliceKey} from '../../util/tool.js'
import {putUser, getQNToken, uploadImg, checkDapp} from '../../util/axios.js'
import CallMeButton from '../../components/CustomButton.vue'
const MIN = 10
const MAX = 500
export default {
  data () {
    return {
      name: '',
      account: '',
      metamask: '',
      link: '',
      type: '',
      description: '',
      avatar: '',
      isCover: false,
      iconToast: 'lang.recommen_icon_two',
      isNameError: false,
      isLinkError: false,
      isDescribeError: false,
      nameToast: '',
      nameToastList: ['lang.nickErr_one', 'lang.nickErr_two', 'lang.nickErr_three', 'lang.nickErr_four'],
      linkToast: '',
      linkToastList: ['lang.websiteErr', 'lang.websitePlace'],
      describeToast: '',
      describeToasList: ['lang.dappDescribeErr_one', 'lang.dappDescribeErr_two'],
      warning: 'lang.iconErr_three',
      isIconError: false,
      toast: '',
      toastList: ['lang.saveEditToast', 'lang.cancelEditToast'],
      postData: {},
      textNum: 0,
      userId: '',
      crop: false
    }
  },
  components: {
    CommonEditAlert,
    CustomInput,
    CallMeButton,
    ImageCrop
  },
  mounted () {
    this.userId = this.$route.params['userId']
    if (this.isDeveloper) {
      this.name = this.user.nickname
      this.account = this.user.username
      this.metamask = this.user.metamask
      this.link = this.user.url
      this.avatar = this.user.avatar
      this.description = this.user.description
      this.textNum = this.user.description.length
      this.postData.name = this.name
      this.postData.url = this.link
      this.postData.description = this.description
      this.postData.avatar = sliceKey(this.avatar)
    } else {
      this.name = this.postData.nickname = this.user.nickname
      this.account = this.user.username
      this.avatar = this.postData.avatar = this.user.avatar
      this.metamask = this.user.metamask
    }
  },
  computed: {
    ...mapState({
      user: state => state.userInfo.user,
      isDeveloper: state => state.userInfo.user && state.userInfo.user.level === 1
    })
  },
  methods: {
    ...mapMutations('vc', ['showEditAlert']),
    ...mapMutations('userInfo', ['setUserInfo']),
    putDeveloperInfo () {
      this.postData.name = this.name
      this.postData.url = this.link
      this.postData.description = this.description
      putUser(this.userId, this.postData).then((res) => {
        if (res && res.status === 201) {
          this.setUserInfo(res.data)
          this.$router.go(-1)
        }
      })
    },
    putUserInfo () {
      if (this.name.length === 0) {
        this.isNameError = true
        this.nameToast = this.nameToastList[1]
      }
      if (!this.isNameError) {
        this.postData.nickname = this.name
        putUser(this.userId, this.postData).then((res) => {
          if (res && res.status === 201) {
            this.setUserInfo(res.data)
            this.$router.go(-1)
          }
        })
      }
    },
    saveInfo () {
      if (this.name.length === 0) {
        this.isNameError = true
        this.nameToast = this.nameToastList[1]
      }
      if (this.description && this.description.length === 0) {
        console.log(this.description)
        this.isDescribeError = true
        this.describeToast = this.describeToasList[0]
      }
      if (this.link && this.link.length === 0) {
        this.isLinkError = true
        this.linkToast = this.linkToastList[1]
      }
      if (!this.isNameError && !this.isDescribeError && !this.isLinkError) {
        this.type = 'save'
        this.toast = this.toastList[0]
        this.showEditAlert()
      }
    },
    cancelEdit () {
      this.type = 'cancel'
      this.toast = this.toastList[1]
      this.showEditAlert()
    },
    confirm () {
      if (this.type === 'save') {
        if (this.isDeveloper) {
          this.putDeveloperInfo()
        } else {
          this.putUserInfo()
        }
      } else if (this.type === 'cancel') {
        this.$router.go(-1)
      } else {
        this.type = 'cancel'
        this.$router.go(-1)
      }
    },
    cancel () {
      if (this.type === 'save') {
        this.$router.go(-1)
      }
    },
    showHeadCover () {
      this.isCover = true
    },
    hideHeadCover () {
      this.isCover = false
    },
    selectIcon () {
      this.crop = true
    },
    descArea (e) {
      let val = this.description
      if (val.length > MAX) {
        e.target.value = val.substring(0, MAX)
        return
      }
      this.textNum = val.length
    },
    describeFocus () {
      this.isDescribeError = false
      this.describeToast = ''
    },
    describeBlur () {
      if (this.description.length === 0) {
        this.isDescribeError = true
        this.describeToast = this.describeToasList[0]
      } else if (this.description.length < MIN || this.description.length > MAX) {
        this.isDescribeError = true
        this.describeToast = this.describeToasList[1]
      } else {
        this.postData.description = this.description
      }
    },
    nameBlur () {
      let val = this.name
      if (this.user && val === this.user.name) {
        return
      }
      let reg1 = /^[a-zA-Z0-9\u4E00-\u9FA5]+$/
      switch (true) {
        case val.length === 0:
          this.isNameError = true
          this.nameToast = this.nameToastList[1]
          break
        case val.length < 2 || val.length > 30:
          this.nameToast = this.nameToastList[2]
          this.isNameError = true
          break
        case !reg1.test(val):
          this.nameToast = this.nameToastList[0]
          this.isNameError = true
          break
        default:
          this.nameToast = ''
          this.isNameError = false
          let that = this
          checkDapp(this.name).then(res => {
            if (res.status === 200) {
              that.postData.name = that.name
            }
          }).catch(err => {
            if (err.response && err.response.data.errmsg === 409) {
              that.isNameError = true
              that.nameToast = that.nameToastList[3]
            }
          })
          break
      }
    },
    nameFocus () {
      this.isNameError = false
      this.nameToast = ''
    },
    linkFocus () {
      this.isLinkError = false
      this.linkToast = ''
    },
    linkBlur () {
      if (this.link.length === 0) {
        this.isLinkError = true
        this.linkToast = this.linkToastList[1]
      } else if (!isURL(this.link)) {
        this.isLinkError = true
        this.linkToast = this.linkToastList[0]
      } else {
        this.postData.url = this.link
      }
    },
    saveAvatar (data) {
      let file = data[0]
      let maxSize = 200
      let that = this
      if (!file || !window.FileReader) return
      if (file.size > maxSize * 1024) {
        that.isIconError = true
        return
      }
      var reader = new FileReader()
      // 将图片将转成 base64 格式
      reader.readAsDataURL(file)
      // 读取成功后的回调
      reader.onloadend = function () {
        that.isIconError = false
        that.avatar = this.result
        that.crop = false
      }
      getQNToken(1).then((res) => {
        if (!res) return
        let formData = new FormData()
        formData.append('token', res.data.token)
        formData.append('file', file)
        formData.append('key', res.data.key)
        uploadImg(formData).then((res) => {
          if (res && res.status === 200) {
            that.postData.avatar = res.data.key
            that.$toast.show({
              toast: 'Success!'
            })
          }
        })
      })
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.type !== '') {
      next()
    } else {
      if (this.name !== this.user.nickname || this.link !== this.user.url || this.description !== this.user.description || this.avatar !== this.user.avatar) {
        this.toast = this.toastList[1]
        this.showEditAlert()
      } else {
        next()
      }
    }
  }
}
</script>
<style type="text/css" scoped>
.wrap {
  font-family: Lato-Regular;
  letter-spacing: 0.5px;
  text-align: left;
  background: rgba(245, 247, 246, 1);
  width: 100%;
  top: 74px;
  position: absolute;
  margin: 0;
  padding: 0;
  padding-bottom: 20px;
}
.box {
  width: 468px;
  height: 100%;
  margin: 0 auto;
}
header {
  width: 100%;
  margin-top: 30px;
}
.headBox {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  margin: 0 auto;
  position: relative;
}
.headBox span {
  margin-top: 35px;
  margin-left: 21px;
  text-align: center;
  width: 47px;
  height: 17px;
  color: #ffffff;
  font-size: 14px;
  position: absolute;
  cursor: default;
}
.headPortrait {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  position: absolute;
}
.imgCover {
  width: 88px;
  height: 88px;
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  border-radius: 50%;
}

header p {
  margin: 10px auto 0;
  color: #999999;
  font-size: 12px;
  text-align: center;
}
.row {
  width: 100%;
  font-size: 14px;
  color: #999999;
  margin-top: 30px;
}
.row p,input {
  border: 2px solid #EBEBEB;
  width: 100%;
  height: 42px;
  line-height: 42px;
  border-radius: 5px;
  padding-left: 12px;
  margin-top: 10px;
}

.row input:focus {
  outline: none;
  border: 2px solid #3C99FC;
}
.row textarea {
  width: 468px;
  height: 108px;
  padding-left: 7px;
  resize: none;
  outline: none;
  border: 1px solid #EBEBEB;
  margin-top: 10px;
}
.toast {
  height: 17px;
  font-family: Lato-Regular;
  color: #F55452;
  text-align: left;
  line-height: 17px;
  letter-spacing: 0.5px;
  margin-top: 10px;
  display: block;
}
.selfFont {
  color: #333333;
}
.btnGroup {
  width: 212px;
  height: 36px;
  margin: 40px auto 0;
  display: flex;
  justify-content: space-between;
}

.selected {
  background: #6D64FB;
  color: #FFFFFF !important;
}
.error {
  color: #F55452 !important;
}
</style>
