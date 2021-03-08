<template>
  <div class="card-box">
    <img class="imgTitle" v-if="$store.state.app.language === 'zh-CN'"
      src="/static/img/activity/ambassadors/title1-CN.png?v=1" alt="">
    <img class="imgTitle" v-else-if="$store.state.app.language === 'zh-TW'"
      src="/static/img/activity/ambassadors/title1-TW.png?v=1" alt="">
    <img class="imgTitle" v-else src="/static/img/activity/ambassadors/title1-en.png?v=1" alt="">
    <!-- newdex大使 -->
    <div v-if="active === 0">
      <div class="card" v-for="item in newdexList" :key="item.name">
        <span class="timg"> {{$t(`activityCard.title1${item}`)}}</span>
        <h2 class="name">{{$t(`activityCard.name1${item}`)}}</h2>
        <p class="private">{{$t(`activityCard.desc1${item}`)}}</p>
        <div class="time">{{$t(`activityCard.time1${item}`)}}</div>
      </div>
    </div>
    <div v-else-if="active === 1">
      <div class="card" v-for="(item, index) in cardList" :key="item.name" @click="handleCard(item,index)">
        <img class="timg" :src="item.logo" alt="">
        <h2 class="name">{{$t(`ds.${item.name}`)}}</h2>
        <p class="private">{{$t(`ds.${item.desc}`)}}</p>
        <div class="time">{{$t(`ds.${item.time}`)}}</div>
        <img class="img" :src="item.code" alt="">
      </div>
    </div>
    <div v-else>
      <div class="card2" v-for="(item, index) in cardList" :key="item.name" @click="handleCard(item,index)">
        <div class="project">
          <div class="imgDiv"><img :src="item.logo" alt=""></div>
          <div>{{ $t(`ds.${item.id}`) }}</div>
        </div>
        <div class="time">{{$t(`ds.${item.time}`)}}</div>
        <div class="flex">
          <div class="info">
            <h2 class="name">{{$t(`ds.${item.name}`)}}</h2>
            <p class="private">{{$t(`ds.${item.desc}`)}}</p>
          </div>
          <div class="qrcodeDiv" v-if="item.code">
            <div>
              <img class="img" :src="item.code">
              <div>{{ $t('ds.ds95') }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 卡片弹窗页 -->
    <mt-popup
      class="mtPopup"
      v-model="showCard"
      popup-transition="popup-fade">
      <PopupCard v-if="showCard" :cardItem="cardItem" @listenClose="handleClose"></PopupCard>
    </mt-popup>
    </div>
</template>
<script>
import PopupCard from './PopupCard';
import { Popup } from 'mint-ui';

export default {
  components: {
    PopupCard,
    mtPopup: Popup,
  },
  data() {
    return {
      active: 2,
      showCard: false,
      cardItem: {},
      cardList: [
        {
          id: 'ds53',
          time: 'ds54', // 时间
          name: 'ds55', // 标题
          desc: 'ds56', // 介绍
          logo: '/static/img/activity/ambassadors/walletLogo/tp.png', // 赞助商标题
          logop: '/static/img/activity/ambassadors/walletLogo/tp.png',
          code: '',
        },
        {
          id: 'ds57',
          time: 'ds58',
          name: 'ds59',
          desc: 'ds60',
          logo: '/static/img/activity/ambassadors/walletLogo/dappbirds.png',
          logop: '/static/img/activity/ambassadors/walletLogo/dappbirds.png',
          code: '/static/img/activity/ambassadors/comp/DAppBirds.jpg',
        },
        {
          id: 'ds61',
          time: 'ds62',
          name: 'ds63',
          desc: 'ds64',
          logo: '/static/img/activity/ambassadors/walletLogo/mykey.png',
          logop: '/static/img/activity/ambassadors/walletLogo/mykey.png',
          code: '/static/img/activity/ambassadors/comp/MYKEY.jpg'
        },
        {
          id: 'ds65',
          time: 'ds66',
          name: 'ds67',
          desc: 'ds68',
          logo: '/static/img/activity/ambassadors/walletLogo/ET.png',
          logop: '/static/img/activity/ambassadors/walletLogo/ET.png',
          code: ''
        },
        {
          id: 'ds69',
          time: 'ds70',
          name: 'ds71',
          desc: 'ds72',
          logo: '/static/img/activity/ambassadors/walletLogo/starteo.png',
          logop: '/static/img/activity/ambassadors/walletLogo/starteo.png',
          code: '/static/img/activity/ambassadors/comp/starteos.jpg'
        },
        {
          id: 'ds73',
          time: 'ds74',
          name: 'ds75',
          desc: 'ds76',
          logo: '/static/img/activity/ambassadors/walletLogo/MathWallet.png',
          logop: '/static/img/activity/ambassadors/walletLogo/MathWallet.png',
          code: ''
        },
        {
          id: 'ds77',
          time: 'ds78',
          name: 'ds79',
          desc: 'ds80',
          logo: '/static/img/activity/ambassadors/walletLogo/Bit.png',
          logop: '/static/img/activity/ambassadors/walletLogo/Bit.png',
          code: '/static/img/activity/ambassadors/comp/Bitkeep.jpg?v=1'
        },
        {
          id: 'ds81',
          time: 'ds82',
          name: 'ds83',
          desc: 'ds84',
          logo: '/static/img/activity/ambassadors/walletLogo/meetone.png',
          logop: '/static/img/activity/ambassadors/walletLogo/meetone.png',
          code: ''
        },
        {
          id: 'ds149',
          time: 'ds150',
          name: 'ds151',
          desc: 'ds152',
          logo: '/static/img/activity/ambassadors/walletLogo/Wombat.png',
          logop: '/static/img/activity/ambassadors/walletLogo/Wombat.png',
          code: ''
        },
      ],
      newdexList: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    }
  },
  computed: {
    dealArr() {
      if (this.active) {
        return this.newdexList
      }
      return this.cardList
    }
  },
  methods: {
    // 点击卡片弹窗
    handleCard(item) {
      if (!item.code) {
        return
      }
      this.cardItem = Object.assign(item)
      this.showCard = true
    },
    handleClose() {
      this.showCard = false
    }
  }
}
</script>
<style lang="scss" scoped>
.card-box{
  font-size: .26rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #CDE4FF;
  .title{
    height: 1.44rem;
    width: 100%;
    line-height: 1.44rem;
    font-size: 0.4rem;
    font-weight: bold;
    text-align: center;
    color: #CDE4FF;
  }
  .imgTitle{
    width: 100%;
    // height: .88rem;
    margin: 0.2rem auto 0.5rem;
  }
  .tabDiv{
    display: flex;
    justify-content:center;
    width: 100%;
    padding:0.3rem 0 0.5rem;
    .btn {
      font-size: 0.26rem;
      font-weight: 400;
      border-radius: 0.05rem;
      width: 2.8rem;
      // padding: 0 .2rem;
      height: 0.68rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color:#f1c89d;
      // margin: 0.3rem auto 0;
      border: 0.02rem solid #584E46;
      box-sizing: border-box;
      &.active{
        border: none;
        color:#63381a;
        background-color: #F1C89E;
      }
      &:last-child{
        margin-left: 0.4rem;
      }
    }
  }
  .card,.card2{
    &:nth-child(4n-3) {
      background-image: linear-gradient(-270deg, #9D4FE5 0%, #422DC2 100%) !important;
    }
    &:nth-child(4n-2) {
      background-image: linear-gradient(-90deg, #6163E2 0%, #E184B2 100%) !important;
    }

    &:nth-child(4n-1) {
      background-image: linear-gradient(-90deg, #515FE1 0%, #8D8CEC 100%) !important;
    }

    &:nth-child(4n) {
      background-image: linear-gradient(-270deg, #65A8F8 0%, #307BE1 100%) !important;
    }
  }
  .card{
    width: 6.8rem;
    height: 3rem;
    // background: linear-gradient(to left, #4e54c8, #8f94fb);
    background: rgba(255,255,255,.1);
    position: relative;
    display: flex;
    flex-direction: column;
    border-radius: 0.2rem;
    font-size: 0.22rem;
    padding-left: 0.3rem;
    box-sizing: border-box;
    margin-bottom: 0.5rem;
    .timg{
      position: absolute;
      top: 0.25rem;
      left: 0.3rem;
      // width: 2rem;
      height: 0.5rem;
    }
    .img{
      width: 1.2rem;
      height: 1.2rem;
      position: absolute;
      right: 0.3rem;
      bottom: .3rem;
    }
    h2{
      margin: 0.7rem 0 0.2rem;
      font-weight: bold;
    }
    .name{
      margin:  0.8rem 0 0.2rem;
      font-weight: bold;
    }
    .private{
      width: 68%;
      line-height: 0.28rem;
    }
    .btn{
      width: 1.24rem;
      height: 0.4rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 0.02rem solid #fefefe;
      margin-top: 0.2rem;
      border-radius: 0.1rem;
    }
    .time{
      color: #fff;
      position: absolute;
      right: 0;
      top: 0;
      height: 0.48rem;
      padding: 0 0.1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 0 0.2rem 0 0.2rem;
      background: linear-gradient(to right, #f943a9, #fd9c3d);
    }
  }

  .card2{
    width: 6.8rem;
    // height: 3rem;
    background: rgba(255,255,255,.1);
    position: relative;
    display: flex;
    flex-direction: column;
    border-radius: 0.2rem;
    font-size: 0.22rem;
    padding: .5rem 0rem .37rem .3rem;
    box-sizing: border-box;
    margin-bottom: 0.5rem;
    .project{
      font-size: .32rem;
      display: flex;
      align-items: center;
      .imgDiv{
        display: flex;
        margin-right: .08rem;
        img{
          width: .45rem;
          height: .45rem;
        }
      }
    }
    .time{
      color: #fff;
      position: absolute;
      right: 0;
      top: 0;
      height: 0.48rem;
      padding: 0 0.1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 0 0.2rem 0 0.2rem;
      background:  linear-gradient(90deg, #B620E0 0%, #F7B500 100%);
    }
    .info{
      margin-top: .18rem;
      .name{
        font-size: .27rem;
      }
      .private{
        font-size: .216rem;
      }
    }
    .qrcodeDiv{
      min-width: 2.06rem;
      max-width: 2.06rem;
      width: 2.06rem;
      display: flex;
      align-items: center;
      justify-content: center;
      &>div{
        text-align: center;
      }
      .img{
        width: 1.13rem;
      }
    }
  }
}
</style>
