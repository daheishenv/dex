<template>
   <div class="card-box">
      <!-- <div class="title">{{ $t('anniversary.annualCarnival') }}</div> -->
      <img  class="imgTitle" v-if="$store.state.app.language === 'zh-CN' ||
       $store.state.app.language === 'zh-TW'" src="@/assets/img/activity/christmas2019/cardTitle.jpg" alt="">
      <img  class="imgTitle" v-else src="@/assets/img/activity/christmas2019/cardTitleen.png" alt="">
      <div class="tabDiv">
        <div class="btn" :class="{'active':active === 0}" @click="active = 0">{{$t('christmas.chris55')}}</div>
        <div class="btn" :class="{'active':active === 1}" @click="active = 1">{{$t('christmas.chris56')}}</div>
      </div>
      <!-- newdex大使 -->
      <div v-if="active">
           <div class="card" v-for="item in newdexList" :key="item.name">
            <span class="timg"> {{$t(`activityCard.title1${item}`)}}
            </span>
            <h2 class="name">{{$t(`activityCard.name1${item}`)}}</h2>
            <p class="private">{{$t(`activityCard.desc1${item}`)}}</p>
            <div class="time">{{$t(`activityCard.time1${item}`)}}</div>
          </div>
      </div>
      <div v-else>
        <div class="card" v-for="(item, index) in cardList" :key="item.name" @click="handleCard(item,index)">
            <img class="timg" :src="item.logo" alt="">
            <h2 class="name">{{$t(`activityCard.name${index+1}`)}}</h2>
            <p class="private">{{$t(`activityCard.desc${index+1}`)}}</p>
            <div class="time">{{$t(`activityCard.time${index+1}`)}}</div>
            <img class="img" :src="item.code" alt="">
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
    mtPopup: Popup
  },
  data() {
    return {
      active: 0,
      showCard: false,
      cardItem: {},
      cardList: [
        {
          id: 'ET',
          time: this.$t('activityCard.time1'), // 时间
          name: this.$t('activityCard.name1'), // 标题
          desc: this.$t('activityCard.desc1'), // 介绍
          logo: 'https://s-dapp.340wan.com/static/christmas2019/card/eostoken.png', // 赞助商标题
          logop: 'https://s-dapp.340wan.com/static/christmas2019/card/estoken2.png',
          code: 'https://s-dapp.340wan.com/static/christmas2019/card/ETc.jpg',

        },
        {
          id: 'TokenPocket',
          time: this.$t('activityCard.time2'),
          name: this.$t('activityCard.name2'),
          desc: this.$t('activityCard.desc2'),
          logo: 'https://s-dapp.340wan.com/static/christmas2019/card/tp.png',
          logop: 'https://s-dapp.340wan.com/static/christmas2019/card/tp2.png',
          code: 'https://s-dapp.340wan.com/static/christmas2019/card/TokenPocketc.jpg',
        },
        {
          id: 'MEETONE',
          time: this.$t('activityCard.time3'),
          name: this.$t('activityCard.name3'),
          desc: this.$t('activityCard.desc3'),
          logo: 'https://s-dapp.340wan.com/static/christmas2019/card/meetone.png',
          logop: 'https://s-dapp.340wan.com/static/christmas2019/card/meetone2.png',
          code: 'https://s-dapp.340wan.com/static/christmas2019/card/Meetonec.jpg'
        },
        {
          id: 'STARTEOS',
          time: this.$t('activityCard.time4'),
          name: this.$t('activityCard.name4'),
          desc: this.$t('activityCard.desc4'),
          logo: 'https://s-dapp.340wan.com/static/christmas2019/card/sarteos.png',
          logop: 'https://s-dapp.340wan.com/static/christmas2019/card/sarteos2.png',
          code: 'https://s-dapp.340wan.com/static/christmas2019/card/Starteosc.jpg'
        },
        {
          id: 'Paytomat',
          time: this.$t('activityCard.time5'),
          name: this.$t('activityCard.name5'),
          desc: this.$t('activityCard.desc5'),
          logo: 'https://s-dapp.340wan.com/static/christmas2019/card/paytomat.png',
          logop: 'https://s-dapp.340wan.com/static/christmas2019/card/paytomat2.png',
          code: 'https://s-dapp.340wan.com/static/christmas2019/card/Paytomatc.png'
        },
        {
          id: '公鹿钱包',
          time: this.$t('activityCard.time6'),
          name: this.$t('activityCard.name6'),
          desc: this.$t('activityCard.desc6'),
          logo: 'https://s-dapp.340wan.com/static/christmas2019/card/buckwallet.png',
          logop: 'https://s-dapp.340wan.com/static/christmas2019/card/buckwallet2.png',
          code: 'https://s-dapp.340wan.com/static/christmas2019/card/buckwalletc.png',

        },
        {
          id: 'BitKeep',
          time: this.$t('activityCard.time7'),
          name: this.$t('activityCard.name7'),
          desc: this.$t('activityCard.desc7'),
          logo: 'https://s-dapp.340wan.com/static/christmas2019/card/bitkeep.png',
          logop: 'https://s-dapp.340wan.com/static/christmas2019/card/bitkeep2.png',
          // img: 'https://s-dapp.340wan.com/static/christmas2019/card/gl1.png',
          code: 'https://s-dapp.340wan.com/static/christmas2019/card/BitKeepc.jpg'
        },
        {
          id: '麦子钱包',
          time: this.$t('activityCard.time8'),
          name: this.$t('activityCard.name8'),
          desc: this.$t('activityCard.desc8'),
          logo: 'https://s-dapp.340wan.com/static/christmas2019/card/math.png',
          logop: 'https://s-dapp.340wan.com/static/christmas2019/card/math2.png',
          code: 'https://s-dapp.340wan.com/static/christmas2019/card/mathwalletc.jpg'
        },
        {
          id: '块信钱包',
          time: this.$t('activityCard.time9'),
          name: this.$t('activityCard.name9'),
          desc: this.$t('activityCard.desc9'),
          logo: 'https://s-dapp.340wan.com/static/christmas2019/card/chattle.png',
          logop: 'https://s-dapp.340wan.com/static/christmas2019/card/chattle2.png',
          code: 'https://s-dapp.340wan.com/static/christmas2019/card/chattlec.jpg'
        },
        {
          id: 'BEPAL',
          time: this.$t('activityCard.time10'),
          name: this.$t('activityCard.name10'),
          desc: this.$t('activityCard.desc10'),
          logo: 'https://s-dapp.340wan.com/static/christmas2019/card/bepal.png',
          logop: 'https://s-dapp.340wan.com/static/christmas2019/card/bepal2.png',
          code: 'https://s-dapp.340wan.com/static/christmas2019/card/bepalc.jpg'
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
    handleCard(item, index) {
      // if (item.id === 1) {
      //   location.href = 'https://www.chainnode.com/post/364022'
      //   return
      // }
      this.cardItem = Object.assign(item, { id: index + 1 })
      this.showCard = true
      // }
    },
    handleClose() {
      this.showCard = false
    }
  }
}
</script>
<style lang="scss" scoped>
.card-box{
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #F1C89E;
    .title{
      height: 1.44rem;
      width: 100%;
      line-height: 1.44rem;
      font-size: 0.4rem;
      font-weight: bold;
      text-align: center;
      color: #f2ba68;
    }
    .imgTitle{
      height: 1.22rem;
      margin: 0.9rem auto 0.5rem;
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
  }
</style>
