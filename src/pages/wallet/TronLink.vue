<template>
 <div>
  <div class="MetaMask">
    <div class="metaHead">
      <div class="logo"></div>
      <p class="docName">{{$t('lang.tron_InstallAndRegist')}}</p>
    </div>
  </div>
  <div class="contain">
    <div class="videoBox">
      <h2>{{$t('lang.video_tutorial')}}:<span><a target="_blank" href="https://www.youtube.com/watch?v=4rc7loyEqY0">https://www.youtube.com/watch?v=4rc7loyEqY0</a></span></h2>
    </div>
    <div class="metaMain">
      <h2>{{$t('lang.text_tutorial')}}:</h2>
      <div class="handleStep">
        <h3>1. {{$t('lang.install_chrome')}} </h3>
        <p>(1) {{$t('lang.tron_one')}}</p>
        <p>(2) {{$t('lang.tron_two')}}</p>
        <p>(3) {{$t('lang.chrome_three_one')}}<a target='_blank' href="https://www.google.com/chrome/">https://www.google.com/chrome/</a> {{$t('lang.chrome_three_two')}}<a target='_blank' href='https://www.google.com/-chrome/browser/desktop/index.html'>https://www.google.com/-chrome/browser/desktop/index.html</a>{{$t('lang.chrome_three_three')}}</p>
        <div class="picBig"><img src="../../assets/img/2.png" alt="2"></div><span>pic 1</span>
        <div class="picBig"><img src="../../assets/img/3.png" alt="3"></div><span>pic 2</span>
        <h3>2. TronLink {{$t('lang.installation')}}</h3>
        <p>(1) {{$t('lang.tron_chrome_one')}}<a target="_blank" href="https://chrome.google.com/webstore/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec?hl=en-US\">https://chrome.google.com/webstore/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec?hl=en-US\</a>{{$t('lang.tron_chrome_one_a')}}</p>
        <div class="picBig"><img src="../../assets/img/tronTutorial/1.png" alt="3"></div><span>pic 3</span>
        <p>(2) {{$t('lang.tron_chrome_two')}}</p>
        <div class="picBig"><img src="../../assets/img/tronTutorial/2.png" alt="4"></div><span>pic 4</span>
        <div class="picBig"><img src="../../assets/img/tronTutorial/3.png" alt="5"></div><span>pic 5</span>
        <div class="picBig "><img src="../../assets/img/tronTutorial/4.png" alt="6"></div><span>pic 6</span>
        <p>(3) {{$t('lang.tron_chrome_three')}}</p>
        <h3 class="Registration tronReg">3. {{$t('lang.regist')}} </h3>
        <p>(1) {{$t('lang.tron_regist_one')}}</p>
        <div class="picSmall"><img src="../../assets/img/tronTutorial/5.png" alt="7"></div><span>pic 7</span>
        <p>(2) {{$t('lang.tron_regist_two')}}</p>
        <div class="picSmall"><img src="../../assets/img/tronTutorial/6.png" alt="8"></div><span>pic 8</span>
        <p>(3) {{$t('lang.tron_regist_three')}}</p>
        <div class="picSmall"><img src="../../assets/img/tronTutorial/7.png" alt="9"></div><span>pic 9</span>
        <p>(4) {{$t('lang.tron_regist_four')}}</p>
        <div class="picSmall"><img src="../../assets/img/tronTutorial/8.png" alt="10"></div><span>pic 10</span>
        <p>(5) {{$t('lang.tron_regist_five')}}</p>
        <div class="picSmall"><img src="../../assets/img/tronTutorial/9.png" alt="11"></div><span>pic 11</span>
        <div class="picSmall"><img src="../../assets/img/tronTutorial/10.png" alt="12"></div><span>pic 12</span>
      </div>
    </div>
  </div>
</div>
</template>
<style type="text/css" scoped="tron">
.MetaMask {
width: 63%;
padding: 30px 40px;
margin: 0px auto 20px;
background-color: #fff;
}
.contain {
width: 63%;
margin: 0px auto 20px;
}
.videoBox {
width: 100%;
background: #fff;
padding: 0 15px;
height: 50px;
line-height: 50px;
}
.videoBox span,a{
font-weight: normal;
}
.metaHead {
text-align: center;
}
.logo {
width: 82px;
height: 62px;
background-size: 100% 100%;
background-repeat: no-repeat;
background-image: url("../../assets/img/tronlink.png");
margin: 20px auto 15px;
}
.docName {
font-size: 24px;
line-height: 24px;
}
.metaMain {
margin-top: 10px;
background: #fff;
padding: 15px 15px 0;
}

.metaMain p,h2,h3 {
text-align: left;
}
.metaMain p {
font-size: 14px;
line-height: 20px;
word-wrap: break-word;
color: #666;
}
.handleStep {
margin-top: 10px;
line-height: 24px;
}
h2 {
font-size: 14px;
font-weight: bold;
color: #333;
}
h3 {
font-size: 14px;
font-weight: bold;
color: #333;
}
a {
color: #607098;
}
a:hover{
text-decoration: underline;
}
.metaMain span {
display: block;
margin: 0 auto;
}
.metaMain img {
display: block;
margin: 15px auto 0;
width: 100%;
}
.picBig {
width: 650px;
margin: 0 auto;
}
.picSmall {
width: 323px;
margin: 0 auto;
}
.metaMain span {
display: inline-block;
margin-bottom: 30px;
}
</style>
