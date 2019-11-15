<template>
<div class="editWrap">
  <div class="editBox" v-if='hasData'>
   <FormContent :dappData='dapp' v-on:cancel='cancel' v-on:save='save'>
   </FormContent>
  </div>
  <EditAlert :toast ='toast'  v-on:confirm='confirm'><span class="txt">{{$t('lang.withdrawToast')}}</span></EditAlert>
</div>
</template>
<script type="text/javascript">
import FormContent from '../../components/FormContent.vue'
import EditAlert from '../../components/CommonEditAlert.vue'
import {mapMutations} from 'vuex'
import {getQNToken, uploadImg, dappEdit, updataPreviws, dappsDetail} from '../../util/axios.js'
import {sliceKey} from '../../util/tool.js'
const toastList = ['lang.cancelEditToast', 'lang.approvedToast']
export default {
  data () {
    return {
      toast: '',
      kind: '',
      postData: {},
      preImgs: [],
      dapp: {},
      hasData: false
    }
  },
  components: {
    FormContent,
    EditAlert
  },
  created () {
    this.closeLoad()
  },
  mounted () {
    let appId = this.$route.params.dappId
    dappsDetail(appId)
      .then((response) => {
        if (response && response.status === 200) {
          this.dapp = response.data
          this.hasData = true
        }
      })
  },
  methods: {
    ...mapMutations('vc', ['showEditAlert', 'closeLoad']),
    cancel () {
      this.toast = toastList[0]
      this.kind = 'cancel'
      this.showEditAlert()
    },
    save (data) {
      this.toast = toastList[1]
      this.kind = 'save'
      this.postData = data[0]
      this.preImgs = data[1]
      this.showEditAlert()
    },
    confirm () {
      let that = this
      if (that.kind === 'save') {
        that.postData.avatar = sliceKey(that.postData.avatar)
        dappEdit(that.dapp.dappId, that.postData).then(res => {
          if (res && res.status === 201) {
            that.getImgKeys(that.postData.previews, that.preImgs)
          }
        })
      } else if (this.kind === 'cancel') {
        this.$router.go(-1)
      }
    },
    async getImgKeys (oldImgs, editImgs) {
      let that = this
      let arr = []
      var imgKeys = []
      editImgs.forEach((v) => {
        if (oldImgs.indexOf(v) === -1) {
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
        } else {
          imgKeys.push(sliceKey(v))
        }
      })
      await Promise.all(arr)
      updataPreviws(that.dapp.dappId, {'previews': imgKeys}).then((response) => {
        if (response && response.status === 201) {
          imgKeys = []
          that.$router.go(-1)
        }
      })
    }
  }
}
</script>
<style type="text/css" scoped>
 .editWrap {
  width: 100%;
  padding: 0;
  margin: 0;
  overflow-y: scroll;
 }
 .editBox {
  margin: 0 auto;
 }
 .btnGroup {
  width: 212px;
  margin: 40px auto 0;
  display: flex;
  justify-content: space-between;
 }
 .editWrap  >>>.txt {
  color: #666666;
  font-size: 12px;
  display: block;
  margin: 10px auto 0;
  text-align: center;
 }
</style>
