 <template>
   <div class="formContent">
    <div class="formBox">
      <CustomInput :tit='$t("lang.dapp_name")' :placeholder='$t(placeholderList[0])' v-model='appName' :focus='nameFocus' :blur='nameBlur' :isError='isNameError' :toast='$t(nameToast)' autofocus>
      </CustomInput>
    </div>
    <div class='row seletRow'>
     <p>{{$t('lang.blockchain')}}</p>
     <Select :placeholder='$t("lang.chaintypePlace")' class='select' v-model='chainType'>
       <Option v-for="item in chainList" :value="item.value" :key="item.value">{{item.label}}</Option>
     </Select>
   </div>
    <div class="row" style="margin-top: 0"><span class="toast" v-show='isChainTypeError'>{{$t(chainTypeToast)}}</span></div>

    <div class="row"><p>{{$t('lang.dapp_description')}}<span class='right'>({{textNum}}/300)</span></p>
     <textarea @input="descArea" @focus='describeFocus' @blur='describeBlur' v-model='describe'></textarea>
     <span class="toast" v-show='isDescribeError'>{{$t(describeToast)}}</span>
   </div>
   <div class="formBox">
     <CustomInput :tit='$t("lang.websiteLink")' :placeholder='$t(placeholderList[1])' v-model='link' :toast='$t(linkToast)' :focus='linkFocus' :blur='linkBlur' :isError='isLinkError'></CustomInput>
   </div>
   <div class='row seletRow'>
     <p>{{$t('lang.classification')}}</p>
     <Select :placeholder='$t("lang.dapptypePlace")' class='select' v-model='appType'>
       <Option v-for="item in classifyList" :value="item.value" :key="item.value">{{$t(item.label)}}</Option>
     </Select>
   </div>
   <div class="row" style="margin-top: 0"><span class="toast" v-show='isAppTypeError'>{{$t(appTypeToast)}}</span></div>

   <div class="row">
    <p>{{$t('lang.upload_icon')}} <span class='right'>{{$t('lang.recommen_icon')}}</span></p>
    <div class="load">
      <div class='loadImg'><img :src="logoSrc" width="100%" height="100%" style="border-radius: 10px" v-show='hasLogo'></div>
      <CallMeButton @click='selectIcon'>{{hasLogo? $t('lang.change'):$t('lang.upload')}}</CallMeButton></div>
      <span class="toast" v-show='isIconError'>{{$t(iconToast)}}</span>
    </div>
  <div class="row">
    <p style="margin-bottom: 0">{{$t('lang.upload_preview')}} <span class='right'>{{$t('lang.recommen_preview')}}</span></p>
    <div class='uploadPre'>
      <ul>
        <draggable v-model='preImgList' v-on:end='move'>
          <transition-group>
            <li v-for='(item, index) in preImgList' :key='index' class='preImg' :class='{cursorMove: isMove}' @mouseover='showDustbin(index)' @mouseout='hideDustbin'>
                <img :src="item" class='imgItem' />
                <img src="../assets/img/trashWhite.png" class="dustbin" @click='deleteImg(index)' v-show='dustbinShowIndex == index' @mouseenter='dustbinShowIndex=index' @mouseout='dustbinShowIndex=index'/>
              <div class='imgCover' v-show='dustbinShowIndex == index' @mouseenter='dustbinShowIndex=index' @mouseout='dustbinShowIndex=index'></div>
            </li>
          </transition-group>
        </draggable>
      </ul>
      <div class='addBox preImg'  @click='selectPreImg' v-show='isCanAddImg'>
        <img src='../assets/img/add.png' width="16px" height='16px'>
        <span class="addText">{{$t('lang.addPic')}}</span>
      </div>
      <input type="file" name="selectPre" accept="image/*" v-show='false' ref='preSelect' @change='handelPreImg'>
    </div>
  </div>
  <div class="row" style="margin-top: 0;"><span class="toast"  v-show='isPreImgError'>{{$t(preImgToast)}}</span></div>
  <div class='row'>
    <p>{{$t('lang.contract')}}</p>
    <div :class="{contractBox:index!==0}" v-for='(item, index) in contractList' :key='index'>
      <input class='normal' type="text" :placeholder='$t(placeholderList[3])' @focus='contractFocus(index)' @blur='contractBlur(index)' v-focus :class='{error:contractErrorList[index]}' v-model='contractList[index]'>
      <span @click='removeContract(index)' class="trash">
        <i class="icon iconfont icon-Delete" size='14' v-show='index!==0' style="margin-left: 5px"></i>
      </span>
      <span class='toast' v-show='contractErrorList[index]'>{{$t(contractToast[index])}}</span>
    </div>
  </div>
  <div class="bottomBox" @click='addContract'><img :src='addImg' width="100%" height="100%" @mouseenter='addImg = require("../assets/img/AddActive.png")' @mouseout='addImg = require("../assets/img/AddTo.png")'></div>
  <div>
  <div class="btnGroup" v-if='dappInfo'>
    <CallMeButton @click='cancel' size='normal'>{{$t('lang.cancel')}}</CallMeButton>
    <CallMeButton @click= 'save' size='normal' kind='active'>{{$t('lang.save')}}</CallMeButton>
  </div>
  <CallMeButton v-else  class='submitBtn' @click='submit' kind='active'>{{$t('lang.submit')}}</CallMeButton>
 </div>
 <ImageCrop :crop='crop' :img = 'logoSrc' @close='crop = false' @save='saveAvatar'></ImageCrop>
</div>
</template>
<script type="text/javascript">
import CustomInput from './CustomInput.vue'
import CallMeButton from '../components/CustomButton.vue'
import {Option} from 'iview'
import Select from 'iview/src/components/select'
import draggable from 'vuedraggable'
import {checkDapp, getQNToken, uploadImg, uploadDapps, updataPreviws} from '../util/axios.js'
import {isURL} from '../util/tool.js'
import ImageCrop from './ImageCrop.vue'
export default {
  name: 'FormContent',
  data () {
    return {
      hasLogo: false,
      dustbinShowIndex: -100,
      addImg: require('../assets/img/AddTo.png'),
      trashImg: require('../assets/img/trash.png'),
      isMove: false,
      appName: '',
      logoSrc: '',
      describe: '',
      link: '',
      appType: '',
      chainType: '',
      preImgList: [],
      contractList: [null],
      contractErrorList: [false],
      isNameError: false,
      isChainTypeError: false,
      isDescribeError: false,
      isLinkError: false,
      isIconError: false,
      isPreImgError: false,
      isAppTypeError: false,
      nameToast: '',
      describeToast: '',
      linkToast: '',
      iconToast: '',
      preImgToast: '',
      appTypeToast: 'lang.classification_null',
      chainTypeToast: 'lang.classification_null',
      contractToast: [],
      textNum: 0,
      placeholderList: ['lang.dappPlace', 'lang.websitePlace', 'lang.dapptypePlace', 'lang.contract_addr'],
      classifyList: [{label: 'lang.games', value: 1}, {label: 'lang.exchanges', value: 2}, {label: 'lang.luckydraw', value: 3}, {label: 'lang.others', value: 4}],
      chainList: [{label: 'ETH', value: 'eth'}, {label: 'TRON', value: 'tron'}, {label: 'EOS', value: 'eos'}],
      nameToastList: ['lang.dappNameErr_one', 'lang.dappNameErr_two', 'lang.dappNameErr_three', 'lang.dappNameErr_four'],
      describeToasList: ['lang.dappDescribeErr_one', 'lang.dappDescribeErr_two'],
      linkToastList: ['lang.websiteErr', 'lang.websitePlace'],
      iconToastList: ['lang.iconErr_one', 'lang.picErr', 'lang.iconErr_two'],
      preImgToastList: ['lang.previewErr_one', 'lang.picErr', 'lang.previewErr_two'],
      contractToastList: ['lang.contractErr_one', 'lang.contractErr_two'],
      previewImgs: [],
      postData: {
        'avatarKey': '',
        'url': '',
        'description': '',
        'name': '',
        'contracts': [],
        'catagory': 0,
        'previews': []
      },
      crop: false
    }
  },
  props: {
    dappData: {
      type: Object
    }
  },
  computed: {
    isCanAddImg: function () {
      if (this.preImgList.length < 5) {
        return true
      }
      return false
    },
    dappInfo: function () {
      return this.dappData
    }
  },
  components: {
    Select,
    Option,
    draggable,
    CustomInput,
    CallMeButton,
    ImageCrop
  },
  mounted () {
    if (this.dappInfo) {
      this.link = this.dappInfo.url
      this.appName = this.dappInfo.name
      this.describe = this.dappInfo.description
      this.textNum = this.describe.length
      this.appType = this.dappInfo.catagory
      this.chainType = this.dappInfo.chain_name
      this.contractList = this.dappInfo.contracts
      this.preImgList = this.preImgList.concat(this.dappInfo.previews)
      this.logoSrc = this.dappInfo.avatar
      this.hasLogo = true
      this.postData = this.dappInfo
      this.previewImgs = this.previewImgs.concat(this.dappInfo.previews)
    }
  },
  methods: {
    cancel () {
      this.$emit('cancel')
    },
    save (data) {
      this.$emit('save', [this.postData, this.previewImgs])
    },
    move (e) {
      let newIndex = e.newIndex
      let oldIndex = e.oldIndex
      let temp = this.previewImgs[oldIndex]
      this.previewImgs[oldIndex] = this.previewImgs[newIndex]
      this.previewImgs[newIndex] = temp
    },
    removeContract (index) {
      this.contractList.splice(index, 1)
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
    nameFocus () {
      this.isNameError = false
      this.nameToast = ''
    },
    nameBlur () {
      let val = this.appName
      if (this.dappInfo && this.appName === this.dappInfo.name) {
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
          checkDapp(this.appName).then(res => {
            if (res.status === 200) {
              that.postData.name = that.appName
            }
          }).catch(err => {
            if (err.response && err.response.status === 409) {
              that.isNameError = true
              that.nameToast = that.nameToastList[3]
            }
          })
          break
      }
    },
    describeFocus () {
      this.isDescribeError = false
      this.describeToast = ''
    },
    describeBlur () {
      if (this.describe.length === 0) {
        this.isDescribeError = true
        this.describeToast = this.describeToasList[0]
      } else if (this.describe.length < 10 || this.describe.length > 300) {
        this.isDescribeError = true
        this.describeToast = this.describeToasList[1]
      } else {
        this.postData.description = this.describe
      }
    },
    contractFocus (index) {
      this.contractErrorList.splice(index, 1, false)
    },
    contractBlur (index) {
      let val = this.contractList[index]
      if (val === null || val.length === 0) {
        this.contractErrorList.splice(index, 1, true)
        this.contractToast.splice(index, 1, this.contractToastList[0])
      } else {
        this.contractList.splice(index, 1, val)
        this.postData.contracts = this.contractList
      }
      // else if (val.length !== 42 || val.slice(0, 2) !== '0x') {
      //   this.contractErrorList.splice(index, 1, true)
      //   this.contractToast.splice(index, 1, this.contractToastList[1])
      // }
    },
    addContract () {
      let res = this.contractList.filter(function (item, index) {
        return item === null
      })
      if (res.length > 0) {
        let last = this.contractList.length - 1
        this.contractErrorList.splice(last, 1, true)
        this.contractToast.splice(last, 1, this.contractToastList[0])
      } else {
        this.contractList.push('')
      }
    },
    descArea (e) {
      let val = this.describe
      if (val.length > 300) {
        e.target.value = val.substring(0, 300)
        return
      }
      this.textNum = val.length
    },
    submit () {
      if (this.appName.length === 0) {
        this.isNameError = true
        this.nameToast = this.nameToastList[1]
      }
      if (this.describe.length === 0) {
        this.isDescribeError = true
        this.describeToast = this.describeToasList[0]
      }
      if (this.link.length === 0) {
        this.isLinkError = true
        this.linkToast = this.linkToastList[1]
      }
      if (this.logoSrc.length === 0) {
        this.isIconError = true
        this.iconToast = this.iconToastList[2]
      }
      if (this.appType.length === 0) {
        this.isAppTypeError = true
      }
      if (this.chainType.length === 0) {
        this.isChainTypeError = true
      }
      if (this.preImgList.length === 0) {
        this.isPreImgError = true
        this.preImgToast = this.preImgToastList[2]
      }
      if (this.contractList[0] === null || this.contractList.length === 0) {
        this.contractErrorList.splice(0, 1, true)
        this.contractToast.splice(0, 1, this.contractToastList[0])
      }
      if (!this.isNameError && !this.isDescribeError && !this.isLinkError && !this.isIconError && !this.isAppTypeError && !this.isChainTypeError && !this.isPreImgError && this.contractList[0] !== null) {
        this.postData.url = this.link
        this.postData.name = this.appName
        this.postData.description = this.describe
        this.postData.catagory = this.appType
        this.postData.chain_name = this.chainType
        this.postData.contracts = this.contractList
        let self = this
        uploadDapps(this.postData).then((res) => {
          if (res && res.status === 201) {
            let dappId = res.data.dappId
            self.getImgKeys(dappId, self.previewImgs)
          }
        })
      }
    },
    selectIcon () {
      this.crop = true
    },
    saveAvatar (data) {
      let file = data[0]
      let maxSize = 100
      let that = this
      if (!file || !window.FileReader) return
      if (file.size > maxSize * 1024) {
        that.isIconError = true
        that.iconToast = that.iconToastList[0]
        return
      }
      var reader = new FileReader()
      // 将图片将转成 base64 格式
      reader.readAsDataURL(file)
      // 读取成功后的回调
      reader.onloadend = function () {
        that.crop = false
        that.isIconError = false
        that.iconToast = ''
        that.logoSrc = this.result
        that.hasLogo = true
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
    },
    selectPreImg () {
      let inp = this.$refs.preSelect
      inp.click()
    },
    handelPreImg () {
      let that = this
      let file = this.$refs.preSelect.files[0]
      let maxSize = 500
      that.isPreImgError = false
      that.preImgToast = ''
      if (!file) {
        return
      }
      if (/^image/.test(file.type) && /[jpeg,png]$/.test(file.type)) {
        if (file.size > maxSize * 1024) {
          that.isPreImgError = true
          that.preImgToast = that.preImgToastList[0]
          return
        }
        // 创建一个reader
        var reader = new FileReader()
        // 将图片将转成 base64 格式
        reader.readAsDataURL(file)
        // 读取成功后的回调
        reader.onloadend = function () {
          that.$refs.preSelect.type = 'text'
          that.$refs.preSelect.type = 'file'
          that.preImgList.push(this.result)
          that.previewImgs.push(file)
        }
      } else {
        that.isPreImgError = true
        that.preImgToast = that.preImgToastList[1]
      }
    },
    deleteImg (index) {
      this.preImgList.splice(index, 1)
      this.previewImgs.splice(index, 1)
    },
    showDustbin (index) {
      this.dustbinShowIndex = index
      this.isMove = true
    },
    hideDustbin () {
      this.dustbinShowIndex = -1
      this.isMove = false
    },
    async getImgKeys (dappId, imgs) {
      let that = this
      let arr = []
      var imgKeys = []
      imgs.forEach((v) => {
        let formData = new FormData()
        const pro = new Promise((resolve) => {
          getQNToken(1).then(res => {
            formData.append('token', res.data.token)
            formData.append('key', res.data.key)
            formData.append('file', v)
          }).then(() => {
            uploadImg(formData).then((response) => {
              if (response && response.status === 200) {
                imgKeys.push(response.data.key)
                resolve(response.data.key)
              }
            })
          })
        })
        arr.push(pro)
      })
      await Promise.all(arr)
      updataPreviws(dappId, {'previews': imgKeys}).then((response) => {
        if (response && response.status === 201) {
          imgKeys = []
          that.$router.go(-1)
        }
      })
    }
  }
}
</script>
<style scoped>
.formContent {
  width: 100%;
  min-height: 950px;
}
.formBox {
  width: 468px;
  margin: 30px auto 0;
}
.row {
  width: 468px;
  margin: 30px auto 0;
  font-size: 14px;
  height: auto;
  cursor: default;
}

.uploadPre {
  width: 600px;
  height: auto;
  overflow: hidden;
}
.row p{
  width: 100%;
  font-family: Lato-Bold;
  color: #333333;
  text-align: left;
  line-height: 17px;
  margin-bottom: 10px;
  letter-spacing: 0.5px;
}
.row textarea {
  width: 468px;
  height: 108px;
  padding-left: 7px;
  resize: none;
  outline: none;
  border: 1px solid #EBEBEB;
}
.seletRow {
  display: flex;
  flex-wrap: wrap;
}
.contractBox {
  margin-top: 10px;
  width: 500px;
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
.normal {
  width: 468px;
  height: 42px;
  color: #333333;
  font-family: Lato-Regular;
  display: inline-block;
  line-height: 42px;
  border-radius: 5px;
  border: 1px solid #EBEBEB;
  padding-left: 12px;
  letter-spacing: 0.5px;
}
.normal:focus {
  outline: none;
  border: 1px solid #3c99fc;
}
.error {
  border: 1px solid #F55452;
}
.right {
 font-size: 12px;
 color: #999999;
 margin-left: 10px;
 text-align: left;
}
.load {
  width: 73px;
}
.loadImg {
  width: 66px;
  height: 66px;
  background-color: #F5F7F6;
  border-radius: 10px;
}
.load button {
  margin-top: 6px;
  white-space: nowrap;
}
.preImg{
  width: 181px;
  height: 93px;
  margin:10px 10px 0px 0px;
  border-radius: 10px;
  background-color: #F5F7F6;
  border: 1px solid #EBEBEB;
  float: left;
  position: relative;
  display: flex;
  justify-content: center;
  cursor: pointer;
}
.imgCover {
  width: 181px;
  height: 93px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.3);
  position: absolute;
}
.imgItem {
  width: 100%;
  height: 100%;
  border-radius: 10px;
}
.dustbin {
  width: 12px;
  height: 10px;
  position: absolute;
  top: 75px;
  cursor: default;
  z-index: 10;
}
.addBox {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.addText {
  font-size: 14px;
  color: #8590A6;
  font-family: Lato-Regular;
  letter-spacing: 0.5px;
  line-height: 17px;
  height: 17px;
  text-align: center;
  margin-left: 5px;
}
.toastBox {
  width: 468px;
  height: 17px;
  line-height: 17px;
  display: flex;
  position: relative;
  margin:0 auto;
  padding-left: 10px;
}
.bottomBox {
  width: 63px;
  margin: 20px auto 0;
}
.cursorMove {
  cursor: move;
}
.bottom span {
  margin: 0;
}
.submitBtn {
 margin: 30px auto;
 cursor: pointer;
}
.btnGroup {
  width: 212px;
  margin: 40px auto 0;
  display: flex;
  justify-content: space-between;
 }
</style>
<style type="text/css">
.trash:hover i {
  color: #6D64FB;
}
.formContent .select {
  width: 279px;
  border-radius: 5px;
  float: left;
  }
.formContent .ivu-select-selection {
  height: 42px !important;
  line-height: 42px !important;
  width: 279px;
  margin: 0;
  border: 1px solid #EBEBEB;
  box-shadow: none !important;
}
.formContent .ivu-select-selection span {
  height: 42px !important;
  line-height: 42px !important;
  font-size: 14px !important;
  color: #666666 !important;
  text-align: left;
  font-family: Lato-Regular;
  letter-spacing: 0.5px;
}
.formContent .ivu-select-dropdown {
  position: relative !important;
  top: 10px !important;
  left: 0 !important;
  border: 1px solid #EBEBEB;
  margin: 0;
  padding: 0;
  box-shadow: none;
}
.formContent .ivu-select-item:hover {
  color: #fff !important;
  background: #3C99FC !important;
}
.formContent .ivu-select-item{
  color: #666666 !important;
  text-align: left;
}
.formContent .ivu-select-item-selected,.ivu-select-item-focus {
  background: rgba(255,255,255,0);
}
.ivu-select,.ivu-select-visible,.ivu-select-single,.ivu-select-selection{
  box-shadow: none;
  border: 1px solid rgba(0,0,0,0);
  background-color: rgba(0,0,0,0);
}
</style>
