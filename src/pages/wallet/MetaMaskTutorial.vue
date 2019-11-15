<template>
<div>
  <div class="MetaMask">
    <div class="metaHead">
      <div class="logo"></div>
      <p class="docName">{{$t('lang.metamask_InstallAndRegist')}}</p>
    </div>
  </div>
  <article class="contain">
    <div class="videoBox"><h2>「{{$t('lang.video_tutorial')}}」<span><a target="_blank" href="https://www.youtube.com/watch?reload=9&v=tfETpi-9ORs">https://www.youtube.com/watch?reload=9&v=tfETpi-9ORs</a></span></h2></div>
    <div class="metaMain">
      <h2>「{{$t('lang.text_tutorial')}}」</h2>
      <div class="handleStep">
        <h3>1. {{$t('lang.install_chrome')}} </h3>
        <p>(1) {{$t('lang.chrome_one')}}</p>
        <p>(2) {{$t('lang.chrome_two')}}</p>
        <p>(3) {{$t('lang.chrome_three_one')}}<a target='_blank' href="https://www.google.com/chrome/">https://www.google.com/chrome/</a> {{$t('lang.chrome_three_two')}}<a target='_blank' href='https://www.google.com/-chrome/browser/desktop/index.html'>https://www.google.com/-chrome/browser/desktop/index.html</a>{{$t('lang.chrome_three_three')}}{{$t('lang.chrome_three_four')}}</p>
        <div class="picBig"><img src="../../assets/img/2.png" alt="2"></div><span>pic 1</span>
        <div class="picBig"><img src="../../assets/img/3.png" alt="3"></div><span>pic 2</span>
        <h3>2. {{$t('lang.install_metamask')}} </h3>
        <p>(1) {{$t('lang.metamask_one')}}<a target='_blank' href="https://metamask.io/#how-it-works">https://metamask.io/#how-it-works</a>{{$t('lang.metamask_one_two')}}</p>
        <div class="picBig"><img src="../../assets/img/4.png" alt="4"></div><span>pic 3</span>
        <p>(2) {{$t('lang.metamask_two')}} <a target = '_blank' href = 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn'>https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn'</a></p>
        <div class="picSmall"><a target="_blank" href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"><img src="../../assets/img/5.png" alt="5"></a></div><span>pic 4</span>
        <p>(3) {{$t('lang.metamask_three')}} </p>
        <div class="picBig"><img src="../../assets/img/6.png" alt="6"></div><span>pic 5</span>
        <div class="picBig"><img src="../../assets/img/7.png" alt="7"></div><span>pic 6</span>
        <p>(4) {{$t('lang.metamask_four')}}</p>
        <div class="picBig" ref='tpRegistration'><img src="../../assets/img/8.png" alt="8"></div><span>pic 7</span>
        <h3 class="Registration metaReg">3、{{$t('lang.regist')}} </h3>
        <p>(1) {{$t('lang.regist_one')}}</p>
        <div class="picSmall"><img src="../../assets/img/9.png" alt="9"></div><span>pic 8</span>
        <p>(2) {{$t('lang.regist_two')}}</p>
        <div class="picSmall"><img src="../../assets/img/10.png" alt="10"></div><span>pic 9</span>
        <p>(3) {{$t('lang.regist_three')}}</p>
        <div class="picSmall"><img src="../../assets/img/11.png" alt="11"></div><span>pic 10</span>
        <p>(4) {{$t('lang.regist_four')}}</p>
        <div class="picSmall"><img src="../../assets/img/12.png" alt="12"></div><span>pic 11</span>
        <p>(5) {{$t('lang.regist_five')}}</p>
        <div class="picSmall"><img src="../../assets/img/13.png" alt="13"></div><span>pic 12</span>
        <p>(6) {{$t('lang.regist_six')}}</p>
        <div class="picSmall"><img src="../../assets/img/14.png" alt="14"></div><span>pic 13</span>
        <div class="picSmall"><img src="../../assets/img/15.png" alt="15"></div><span>pic 14</span>
        <div class="picSmall"><img src="../../assets/img/16.png" alt="16"></div><span>pic 15</span>
      </div>
    </div>
  </article>
</div>
</template>
<style type="text/css" scoped="">
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
width: 61px;
height: 74px;
background-size: 100% 100%;
background-repeat: no-repeat;
background-image: url("../../assets/img/1.png");
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
.metaMain img span {
display: block;
margin: 0 auto;
}
.metaMain img {
margin: 15px auto 0;
width: 100%;
}
.picBig {
width: 650px;
margin: 0 auto;
}
.picMiddle {
width: 50%;
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
