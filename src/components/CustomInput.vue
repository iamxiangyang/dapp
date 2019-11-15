<template>
 <div class='row'>
  <p v-show='_isTit'>{{_tit}}</p>
  <div class='box'><input class='normal' autocomplete='off' v-bind:type="_type"  :placeholder='_placeholder'  @focus='_focus' @blur='_blur'  :class='{error:_isError}' :value="currentValue" @input="handleInput"  @change="handleChange" :autofocus='_autofocus' v-focus  readonly onfocus="this.removeAttribute('readonly');" onblur="this.setAttribute('readonly',true);"><slot></slot></div>
  <span class='toast' v-show='_isError'>{{_toast}}</span>
</div>
</template>
<script type="text/javascript">
export default {
  name: 'CustomInput',
  data () {
    return {
      currentValue: this.value
    }
  },
  computed: {
    _tit: function () {
      return this.tit
    },
    _isTit: function () {
      return this.isTit
    },
    _placeholder: function () {
      return this.placeholder
    },
    _type: function () {
      return this.type
    },
    _isError: function () {
      return this.isError
    },
    _focus: function () {
      return this.focus
    },
    _blur: function () {
      return this.blur
    },
    _toast: function () {
      return this.toast
    },
    _autofocus: function () {
      return this.autofocus
    }
  },
  props: {
    isTit: {default: true, type: Boolean},
    tit: {default: '', type: String},
    placeholder: {default: '', type: String},
    type: {default: 'text', type: String},
    isError: {default: false, type: Boolean},
    focus: {type: Function, default: () => {}},
    blur: {type: Function, default: () => {}},
    toast: {default: 'err', type: String},
    value: {type: [String, Number], default: ''},
    autofocus: {default: false}
  },
  watch: {
    value (val) {
      this.setCurrentValue(val)
    }
  },
  mounted () {
    this.currentValue = ''
  },
  methods: {
    setCurrentValue (value) {
      if (value === this.currentValue) return
      this.currentValue = value
    },
    handleInput (event) {
      let value = event.target.value
      this.$emit('input', value)
      this.setCurrentValue(value)
      this.$emit('on-change', event)
    },
    handleChange (event) {
      this.$emit('on-input-change', event)
    }
  }
}
</script>
<style type="text/css" scoped>
.row {
width: 100%;
margin: 30px auto;
position: relative;
font-size: 14px;
}
.row p{
height: 17px;
width: 100%;
font-family: Lato-Bold;
color: #333333;
text-align: left;
line-height: 17px;
margin-bottom: 10px;
letter-spacing: 0.5px;
display: flex;
justify-content: space-between;
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
width: 100%;
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
.box {
width: 100%;
display: flex;
}
</style>
