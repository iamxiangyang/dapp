<template>
  <div class='wrap'>
    <header class="head">
      <router-link to='/'><img src="../../assets/img/logo.png"></router-link>
    </header>
    <div class="contentBox">
      <div class="rowBox"><CustomInput type='password' :tit='$t("lang.newPwd")' :placeholder='$t(placeList[0])' v-model='password' :isError='isPassError' :toast='$t(passToast)' :blur='passwordBlur' :focus='passwordFocus'></CustomInput></div>
      <div class="rowBox"><CustomInput type='password' :tit='$t("lang.confirmPassword")' :placeholder='$t(placeList[1])' v-model='confirm' :isError='isConfirmPassError' :toast='$t("lang.passwordNotMatch")' :blur='passwordRepeatBlur' :focus='passwordRepeatFocus'></CustomInput></div>
      <div class="btnGroup">
        <CustomButton class='btnNormal' @click='cancel'>{{$t('lang.cancel')}}</CustomButton>
        <CustomButton class='btnNormal saveBtn' @click='save' kind='active'>{{$t('lang.save')}}</CustomButton>
      </div>
    </div>
   </div>
</template>
<script type="text/javascript">
import {mapMutations} from 'vuex'
import CustomInput from '../../components/CustomInput.vue'
import {changePassword} from '../../util/axios.js'
import CustomButton from '../../components/CustomButton.vue'
export default {
  name: 'PasswordChanged',
  data () {
    return {
      placeList: ['lang.registPlace_three', 'lang.confirmPassword_place'],
      password: '',
      confirm: '',
      isConfirmPassError: false,
      isPassError: false,
      passToastList: ['lang.passwordErr_one', 'lang.passwordErr_two', 'lang.passwordErr_three'],
      passToast: ''
    }
  },
  components: {
    CustomInput,
    CustomButton
  },
  methods: {
    ...mapMutations('vc', ['headHide', 'headShow']),
    passwordRepeatFocus () {
      this.isConfirmPassError = false
    },
    passwordRepeatBlur () {
      if (this.password !== this.confirm) {
        this.isConfirmPassError = true
      }
    },
    passwordFocus () {
      this.isPassError = false
    },
    passwordBlur () {
      let val = this.password
      let reg = /\s+/g
      switch (true) {
        case reg.test(val):
          this.passToast = this.passToastList[2]
          this.isPassError = true
          break
        case val.length < 6 || val.length > 12:
          this.passToast = this.passToastList[1]
          this.isPassError = true
          break
        default:
          if (this.confirm.length > 0 && this.password !== this.confirm) {
            this.isConfirmPassError = true
            break
          } else if (this.confirm.length > 0 && this.password === this.confirm) {
            this.isConfirmPassError = false
            break
          }
          this.passToast = ''
          this.isPassError = false
          break
      }
    },
    save () {
      let data = {passwd: this.password, passwdConfirm: this.confirm}
      changePassword(data).then((res) => {
        if (res && res.status === 201) {
          this.$router.go(-1)
        }
      }).catch(err => {
        if (err.response && err.response.status === 400) {
          this.$toast.show({
            toast: this.$t('lang.changfailed')
          })
        }
      })
    },
    cancel () {
      this.$router.go(-1)
    }
  },
  created () {
    this.headHide()
  },
  beforeRouteLeave (to, from, next) {
    this.headShow()
    next()
  }
}
</script>
<style type="text/css" scoped>
.wrap {
width: 100%;
height: 100%;
}

.head {
width: 100%;
height: 74px;
line-height: 74px;
background-color: #5A3EE0;
font-size: 35px;
color: #ffffff;
text-align: center;
cursor: pointer;
z-index: 999;
vertical-align: middle;
}
.head a {
vertical-align: middle;
}
.head img {
width: 109px;
}
.contentBox {
width: 844px;
border: 1px solid #EDEDED;
border-radius: 10px;
margin: 30px auto;
}
.btnGroup {
margin: 40px auto;
}
.btnNormal {
margin: auto  0;
position: relative;
}
.saveBtn {
  margin-left: 10px;
}
.rowBox {
  width: 468px;
  margin: 0 auto;
}
</style>
