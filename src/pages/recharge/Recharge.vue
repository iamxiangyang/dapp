<template>
  <div class="boxAll">
    <div class="recommendHead">
      <h2>{{$t('lang.rechargeTitle')}}</h2>
    </div>
      <ul class="recommend">
        <li>
          <a target="_blank" href="https://www.binance.com">
          <div class="recommendBox">
            <h2>Binance</h2>
            <a target="_blank" href="https://www.binance.com" class="link">https://www.binance.com</a>
            <div class="recommendText">
              <p>{{$t('lang.binance_text')}}</p>
            </div>
          </div>
          </a>
        </li>
        <li>
          <a target="_blank" href="https://www.huobi.com">
          <div class="recommendBox">
            <h2>Bittrex</h2>
            <a target="_blank" href="https://bittrex.com/" class="link">https://www.bitfinex.com/</a>
            <div class="recommendText">
              <p>{{$t('lang.bittrex_text')}}</p>
            </div>
          </div>
          </a>
        </li>
        <li>
          <a target="_blank" href="https://www.okex.com">
          <div class="recommendBox">
            <h2>Bitfinex</h2>
            <a target="_blank" href="https://www.bitfinex.com/" class="link">https://www.bitfinex.com/</a>
            <div class="recommendText">
              <p>{{$t('lang.bitfinex_text')}}</p>
            </div>
          </div>
          </a>
        </li>
      </ul>
    <div class="footer">
      <h2 class="specialNotice">{{$t('lang.specialNotice')}}</h2>
      <p class="notice">{{$t('lang.specialNotice_text')}}</p>
      <h2 class="specialNotice">{{$t('lang.testimonial')}}</h2>
      <p class="notice">{{$t('lang.testimonial_text')}} </p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Recharge'
}
</script>

<style scoped>
.boxAll {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 74px;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: auto;
  background-color: #f3f4f5;
}
.recommendHead {
  width: 100%;
  height: 30px;
  margin-top: 40px;
  margin-bottom: 25px;
  font-size: 32px;
  background-color: #f3f4f5;
}
.recommendHead h2 {
  margin: 0 auto;
}
.recommend {
  text-align: center;
  width: 1150px;
  height: 575px;
  margin: 20px auto 0;
  left: 0;
  right: 0;
}
.recommend li {
  width: 347px;
  height: 557px;
  margin-top: 18px;
  margin-left: 25px;
  float: left;
  background-color: #fff;
  overflow: hidden;
  transition: .1s;
  border-radius: 10px;
}
.recommend li:first-child {
  margin-left: 0;
}
.recommend li:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 5px rgba(216, 216, 216, 0.3);
}
.recommendBox {
  width: 100%;
  height: 100%;
  padding: 0 25px;
  border-radius: 5px;
  border:1px solid #fff;
}
.recommendBox:hover {
  cursor: pointer;
}
.recommendBox h2 {
  margin-top: 22px;
  font-size: 28px;
  color: #333;
}
.link {
  font-size: 12px;
  color: #607098;
  text-decoration: none;
  margin-top: 0px;
  margin-bottom: 20px;
  display: block;
}
.recommendBox a:hover {
  text-decoration: underline;
}
.recommendBox p {
  margin: 0 auto;
  font-size: 14px;
  line-height: 24px;
  color: #333;
  text-align: left;
}
.recommendText {
  margin-top: 10px;
  height: 410px;
  overflow: auto;
}
/* for Chrome */
.recommendText::-webkit-scrollbar {
  display: none;
}
.footer {
  width: 1150px;
  margin: 30px auto 50px;
  text-align: left;
}
.footer p {
  font-size: 14px;
  line-height: 20px;
  color: #666;
}
.specialNotice {
  margin-bottom: 5px;
  margin-top: 10px;
  font-size: 24px;
}
</style>
