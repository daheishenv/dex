<template>
  <section class="page">
    <div class="header-title">
      兑换记录
      <i class="iconfont icon-huaban11" @click="$router.go(-1)"></i>
    </div>
    <div class="num-box">
      <div class="num">
        <span>- 9990.8699 <span class="desc">EBTC</span> </span>
      </div>
    </div>
    <div class="info-box">
      <div class="info">
        <div class="info-name">类型</div>
        <div class="info-text">EBTC BTC</div>
      </div>
      <div class="info">
        <!-- c0 fail c1 going c2 success  -->
        <div class="info-name">状态</div>
        <div class="info-text c2">已完成</div>
      </div>
      <div class="info">
        <div class="info-name">地址</div>
        <div class="info-text">123wwwmmm123</div>
      </div>
      <div class="info">
        <div class="info-name">手续费</div>
        <div class="info-text">0.1234 EOS</div>
      </div>
      <div class="info">
        <div class="info-name">TxID</div>
        <div class="info-text color-this">P5Hyd1uCp5uqKsceyg2FbzBgUiNy2DF7Jsi59</div>
      </div>
      <div class="info">
        <div class="info-name">操作时间</div>
        <div class="info-text">2019-10-10  14:22:33</div>
      </div>
      <div class="info">
        <div class="info-name">完成时间</div>
        <div class="info-text">2019-10-10  14:22:33</div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import "../../../assets/css/color.scss";
.page{
  width: 100%;
  min-height: calc(100vh- 1rem);
  background-color: #fff;
}
.header-title {
  position: relative;
  width: 100%;
  height: 0.9rem;
  background-color: #fff;
  text-align: center;
  line-height: 0.9rem;
  font-size: 0.36rem;
  color: #000000;
  font-weight: bold;
  border-bottom: 0.12rem solid #fafafa;
  .icon-huaban11 {
    position: absolute;
    left: 0.3rem;
    top: 50%;
    transform: translateY(-50%) rotate(180deg);
  }
}
.num-box{
  padding: 0 0.25rem;
  .num{
    display: flex;
    width: 100%;
    height: 2.38rem;
    line-height: 2.38rem;
    // font-weight: bold;
    font-size: .45rem;
    justify-content: center;
    border-bottom: 1px solid #C7C7C7;
    .desc{
      font-size: 0.3rem;
      color: #001B1F;
      font-weight: normal;
    }
  }
}
.info-box{
  display: flex;
  flex-direction: column;
  padding: 0.3rem .65rem;
  .info{
    display: flex;
    line-height: 0.6rem;
    .info-name{
      font-size: .27rem;
      color: #999999;
      width: 1.45rem;
      flex-shrink: 0;
    }
    .info-text{
      width: 4.86rem;
      min-height: 0.6rem;
      font-size: .3rem;
      color: #353442;
      word-wrap:break-word;
    }

    .c0{
      color: $color-red;
    }
    .c1{
      color: $color-this;
    }
    .c2{
      color: #00BE66;
    }
  }
}
</style>

