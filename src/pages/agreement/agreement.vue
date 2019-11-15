<template>
  <div class="wrap">
    <article>
      <h1>{{$t('lang.agree_title')}}</h1>
      <p>{{$t('lang.agree_preface')}}</p>
      <h2>{{$t('lang.agree_regist')}}</h2>
      <p>{{$t('lang.agree_regist_one')}}</p>
      <p>{{$t('lang.agree_regist_two')}}</p>
      <h2>{{$t('lang.agree_privacy')}}</h2>
      <p>{{$t('lang.agree_privacy_one')}}</p>
      <p>{{$t('lang.agree_privacy_two')}}</p>
      <p>{{$t('lang.agree_privacy_three')}}</p>
      <p>{{$t('lang.agree_privacy_four')}}</p>
      <h2>{{$t('lang.agree_publish')}}</h2>
      <p>{{$t('lang.agree_publish_one')}}</p>
      <p>{{$t('lang.agree_publish_two')}}</p>
         <p>{{$t('lang.agree_publish_two_a')}}</p>
         <p>{{$t('lang.agree_publish_two_b')}}</p>
         <p>{{$t('lang.agree_publish_two_c')}}</p>
         <p>{{$t('lang.agree_publish_two_d')}}</p>
         <p>{{$t('lang.agree_publish_two_e')}}</p>
         <p>{{$t('lang.agree_publish_two_f')}}</p>
         <p>{{$t('lang.agree_publish_two_g')}}</p>
         <p>{{$t('lang.agree_publish_two_h')}}</p>
         <p>{{$t('lang.agree_publish_two_i')}}</p>
      <p>{{$t('lang.agree_publish_three')}}</p>
         <p>{{$t('lang.agree_publish_three_a')}}</p>
         <p>{{$t('lang.agree_publish_three_b')}}</p>
         <p>{{$t('lang.agree_publish_three_c')}}</p>
         <p>{{$t('lang.agree_publish_three_d')}}</p>
         <p>{{$t('lang.agree_publish_three_e')}}</p>
         <p>{{$t('lang.agree_publish_three_f')}}</p>
         <p>{{$t('lang.agree_publish_three_g')}}</p>
      <h2>{{$t('lang.agree_use')}}</h2>
      <p>{{$t('lang.agree_use_one')}}</p>
      <p>{{$t('lang.agree_use_two')}}</p>
         <p>{{$t('lang.agree_use_two_a')}}</p>
         <p>{{$t('lang.agree_use_two_b')}}</p>
         <p>{{$t('lang.agree_use_two_c')}}</p>
         <p>{{$t('lang.agree_use_two_d')}}</p>
         <p>{{$t('lang.agree_use_two_e')}}</p>
         <p>{{$t('lang.agree_use_two_f')}}</p>
         <p>{{$t('lang.agree_use_two_g')}}</p>
      <p>{{$t('lang.agree_use_three')}}</p>
      <p>{{$t('lang.agree_use_four')}}</p>
      <h2>{{$t('lang.agree_disclaimer')}}</h2>
      <p>{{$t('lang.agree_disclaimer_one')}}</p>
      <p>{{$t('lang.agree_disclaimer_two')}}</p>
      <p>{{$t('lang.agree_disclaimer_three')}}</p>
      <p>{{$t('lang.agree_disclaimer_four')}}</p>
      <p>{{$t('lang.agree_disclaimer_five')}}</p>
      <p>{{$t('lang.agree_disclaimer_six')}}</p>
      <p>{{$t('lang.agree_disclaimer_seven')}}</p>
      <h2>{{$t('lang.agree_others')}}</h2>
      <p>{{$t('lang.agree_others_one')}}</p>
      <p>{{$t('lang.agree_others_two')}}</p>
      <p>{{$t('lang.agree_others_three')}}</p>
    </article>
  </div>
</template>
<script type="text/javascript">
import {mapMutations} from 'vuex'
export default {
  methods: {
    ...mapMutations('vc', ['headHide', 'headShow'])
  },
  created () {
    this.headHide()
  }
}
</script>
<style type="text/css" scoped="agreement">
.wrap {
width: 100%;
background-color: #f3f4f5;
top: 0;
left: 0;
bottom: 0;
position: absolute;
overflow: auto;
min-width: 650px;
}
h1 {
font-size: 16px;
font-weight: bold;
color: #333;
line-height: 24px;
margin-bottom: 20px;
}
h2 {
font-size: 14px;
font-weight: bold;
color: #333;
}
p {
font-size: 14px;
line-height: 24px;
word-wrap: break-word;
color: #666;
}
h2, p {
text-align: left;
}
article {
width: 63%;
padding: 30px 40px;
margin: 0px auto 20px;
background-color: #fff;
}
</style>
