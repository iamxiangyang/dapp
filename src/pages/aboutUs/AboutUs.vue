<template>
  <div class="boxAll">
    <div class="team">
      <h2>{{$t('lang.team')}}</h2>
      <h3>{{$t('lang.about')}}</h3>
      <div class="teamContent">
        <h4>{{$t('lang.who')}} </h4>
        <p>{{$t('lang.who_text')}}</p>
        <h4>{{$t('lang.ourvalue')}}</h4>
        <p>{{$t('lang.ourvalue_text')}}</p>
        <h4>{{$t('lang.wedo')}}</h4>
        <p>{{$t('lang.wedo_text')}}</p>
        <h4>{{$t('lang.contact')}}</h4>
        <p>{{$t('lang.contact_text')}}</p>
        <p>{{$t('lang.contact_text_two')}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutUs'
}
</script>

<style scoped>
.boxAll {
  position: absolute;
  left: 0;
  right: 0;
  top: 74px;
  bottom: 0;
  background-color: #f3f4f5;
}
.team {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.team h2 {
  font-size: 36px;
  line-height: 36px;
  margin: 30px auto 0;
  letter-spacing: 0.8px;
  text-align: left;
}
.team h3 {
  font-size: 16px;
  color: #999;
  margin: 0 auto 30px;
  padding-left: 10px;
  text-align: center;
  letter-spacing: 0.5px;
}
.teamContent {
  width: 45%;
  height: 550px;
  margin: 0 auto;
  padding: 30px;
  text-align: left;
  background-color: #fff;
  overflow: auto;
}
.teamContent h4 {
  font-size: 24px;
  line-height: 72px;
}
.teamContent p {
  font-size: 14px;
  line-height: 20px;
}
.teamContent::-webkit-scrollbar {
  display: none;
}
</style>
