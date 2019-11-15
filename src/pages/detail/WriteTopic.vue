<template>
  <div class="all">
    <div class="header">
      <div class="btnGroup">
        <button class="preview" @click.stop='preview = !preview'>{{$t('lang.preview')}}</button>
        <button class="preview" @click='save'>{{$t('lang.saveDraft')}}</button>
        <button class="send" :class='{"active": canSend}' @click='send'>{{$t('lang.send')}}</button>
      </div>
    </div>
    <div class="artical">
      <input type="file" accept="image/*" v-show='false' ref='preSelect' @change='handelImg'>
      <input type="text" class='title' :placeholder="$t('lang.enterTitle')" v-model='title' @input='handleTitle'>
      <quill-editor
            v-model="content"
            ref="myQuillEditor"
            :options="editorOption"
            @change="onEditorChange($event)"
            class='editor'>
      </quill-editor>
    </div>
    <Preview v-show='preview' :htmlText='content' :title='title' @close='closePreview'></Preview>
  </div>
</template>
<script type="text/javascript">
import {quillEditor} from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import {getQNToken, uploadImg, IMGURL, addDrafts, editArticle, publishArticle, getArticle} from '../../util/axios.js'
import Preview from './Preview.vue'
export default {
  data () {
    return {
      dappID: '',
      title: '',
      content: '',
      articleID: '',
      flag: 0,
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline'],
            ['image'],
            [{'align': []}]
          ]
        },
        placeholder: this.$t('lang.enterText'),
        previewImgs: [],
        quill: null
      },
      preview: false,
      canSend: false
    }
  },
  mounted () {
    this.dappID = this.$route.params.dappId
    this.articleID = this.$route.params.topicID
    if (this.articleID) {
      getArticle(this.articleID).then(res => {
        if (res && res.status === 200) {
          this.title = res.data.title
          this.content = res.data.content
          this.dappID = res.data.dappId
        }
      })
    }
    this.quill = this.$refs.myQuillEditor.quill
    this.$nextTick(() => {
      this.quill.getModule('toolbar').addHandler('image', this.imgHandler)
    })
  },
  methods: {
    closePreview () {
      this.preview = false
    },
    imgHandler (state) {
      if (state) {
        let inp = this.$refs.preSelect
        inp.click()
      }
    },
    handleTitle () {
      if (!this.content || !this.title) {
        this.canSend = false
      } else {
        this.canSend = true
      }
      if (this.articleID) {
        this.edit()
        return
      }
      if (this.title.length > 0 && this.flag === 0) {
        this.flag = 1
        this.saveDraft()
      }
    },
    handelImg () {
      let that = this
      let file = this.$refs.preSelect && this.$refs.preSelect.files[0]
      let maxSize = 1000
      if (!file) {
        return
      }
      if (/^image/.test(file.type) && /[jpeg,png]$/.test(file.type)) {
        // 资源大小限制
        if (file.size > maxSize * 1024) {
          this.$toast.show({
            toast: this.$t('lang.picBig')
          })
          return
        }
        // 创建一个reader
        var reader = new FileReader()
        // 将图片将转成 base64 格式
        reader.readAsDataURL(file)
        // 读取成功后的回调
        reader.onloadend = function () {
          // 解决不能选取重复图片
          that.$refs.preSelect.type = 'text'
          that.$refs.preSelect.type = 'file'
          let addImgRange = that.quill.getSelection()
          let index = addImgRange !== null ? addImgRange.index : 0
          let formData = new FormData()
          getQNToken(1).then((res) => {
            formData.append('token', res.data.token)
            formData.append('key', res.data.key)
            formData.append('file', file)
          }).then(() => {
            uploadImg(formData).then((response) => {
              if (response && response.status === 200) {
                let url = IMGURL + response.data.key
                that.quill.insertEmbed(index, 'image', url)
                // 光标后移
                that.quill.setSelection(index + 1)
              }
            })
          })
        }
      }
    },
    onEditorChange (editor) {
      setTimeout(this.edit, 500)
    },
    save () {
      if (!this.title || !this.content) {
        return
      }
      this.$router.push({name: 'Topics', params: {dappId: this.dappID}})
    },
    saveDraft () {
      let article = {title: this.title, content: this.content}
      addDrafts(this.dappID, article).then((res) => {
        if (res && res.status === 201) {
          this.articleID = res.data.article_id
        }
      })
    },
    send () {
      if (!this.title || !this.content) {
        return
      }
      publishArticle(this.articleID).then(res => {
        if (res && res.status === 201) {
          this.$toast.show({
            toast: this.$t('lang.publishedSuccess')
          })
          this.$router.push({name: 'Topics', params: {dappId: this.dappID}})
        }
      })
    },
    edit () {
      if (!this.content || !this.title) {
        this.canSend = false
      } else {
        this.canSend = true
      }
      let data = {title: this.title, content: this.content}
      if (!this.articleID) {
        this.saveDraft()
      }
      editArticle(this.articleID, data)
    }
  },
  components: {
    quillEditor,
    Preview
  }

}
</script>
<style type="text/css" scoped>
.all {
  width: 100%;
  position: fixed;
  overflow:hidden;
  top: 74px;
  bottom: 0;
  margin: 0;
  padding: 0;
}
.header {
  width: 100%;
  height: 66px;
  border-bottom: 1px solid #EBEBEB;
}
.title {
  width: 100%;
  height: 30px;
  line-height: 30px;
  border: none;
  margin-top: 20px;
  margin-bottom: 20px;
  font-size: 24px;
}
.artical {
  width: 805px;
  margin: 0 auto;
}
.btnGroup {
  margin-top: 15px;
  float: right;
  margin-right: 10%;
}
.btnGroup button {
  height: 36px;
  border-radius: 8px;
  margin-left: 10px;
}
.preview{
  width: 96px;
  background: #fff;
  color: #666666;
  border: 1px solid #DEDEDE;
}
.preview:hover {
  border: 1px solid #333;
  color: #333;
}
.send {
  width: 73px;
  color: #fff;
  background: rgba(109, 100, 251, 0.5);
}
.active {
  background: rgba(109, 100, 251, 1) !important;
}
</style>
<style type="text/css">
.editor .ql-toolbar{
  border: none;
  border-top: 1px solid #EBEBEB;
  border-bottom: 1px solid #EBEBEB;
}
.editor .ql-container{
  height: 500px;
  border: 1px solid red;
  border: none;
  padding: 0;
  overflow-y: scroll;
}
.editor .ql-editor {
  padding: 0;
}
.editor .ql-editor.ql-blank::before {
  left: 0;
}
.artical .ql-editor {
  margin-top: 15px;
}
</style>
