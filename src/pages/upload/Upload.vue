<template>
  <div class="boxAll">
    <div class='top'>
      <div class='textBox'>
      <p class="leftInfo">{{$t('lang.submitDapp')}}<a href="#" class='email'>dappspace2019@gmail.com</a>
     </p>
      </div>
    </div>
    <FormContent></FormContent>
</div>
</template>

<script>
import FormContent from '../../components/FormContent.vue'
export default {
  name: 'Upload',
  components: {
    FormContent
  }
}
</script>

<style scoped>
.boxAll {
  width: 844px;
  margin: 74px auto 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.top {
  width: 567px;
  height: 114px;
  background-color: #F9F9F9;
  border: 1px solid #EBEBEB;
  margin-top: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.textBox {
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
.leftInfo {
  width: 312px;
  color: #333333;
  font-size: 16px;
  font-family: Lato-Bold;
  line-height: 24px;
  letter-spacing: 0.5px;
  text-align: left;
}
.email {
  height: 30px;
  line-height: 30px;
  /*width: 160px;*/
  background-color: #E7F1FF;
  border-radius: 5px;
  font-family: Lato-Regular;
  font-size: 16px;
}
</style>
