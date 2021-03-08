<template>
  <div class="main">
    <div class="chooseLv">
      <div class="lists">
        <div class="list" :class="{'listActived': chooseLv === item.level}"
          @click="chooseLv = item.level"
          v-for="(item, $index) in vipList" :key="$index">
          <div>
            <div :class="`iconfont vip ${vipCoinClass(item.level)}`"></div>
            <div class="status">
              <span v-if="func === 1">{{$t('vip.consume')}}</span>
              <span v-else>{{$t('vip.mortgage')}}</span>
            </div>
            <div class="num">
              <span>{{ item.ndxStaked }}</span>
            </div>
            <div class="perMonth">NDX/{{$t('vip.month')}}</div>
          </div>
        </div>
        <!-- <div class="swiper-container swiper-container_index">
          <div class="swiper-wrapper">
            <div class="swiper-slide list" v-for="(item, $index) in vipList" :key="$index">
              <div>
                <div :class="`iconfont vip ${vipCoinClass(item.level)}`"></div>
                <div class="status">
                  <span v-if="func === 1">消耗</span>
                  <span v-else>抵押</span>
                </div>
                <div class="num">
                  <span>{{ item.ndxStaked }}</span>
                </div>
                <div class="perMonth">NDX/月</div>
              </div>
            </div>
          </div>
          <div class="swiper-button-prev next"></div>
          <div class="swiper-button-next next"></div>
        </div> -->
      </div>
    </div>
    <!-- 会员情况下 - 不足一个月提示 | 补差额提示 -->
    <div class="tipDiv" v-if="vipInfo.level !== 0 && func === 1">
      <div class="lessMonth" v-if="lastDays < 30">{{$t('vip.tipUpgrade')}}</div>
      <div class="pay" v-else>{{$t('vip.payUpgrade')}}</div>
    </div>
    <!-- 抵押会员显示抵押数据 -->
    <div class="stakedInfo" v-if="func === 2">
      <div>
        <div>{{$t('vip.allMor')}}</div>
        <div>10000.0000 NDX</div>
      </div>
      <div v-if="type === 1">
        <div>
          <span>{{$t('vip.selfShort')}}：</span>
          <span>3000.0000 NDX</span>
        </div>
        <div>
          <span>{{$t('vip.otherShort')}}：</span>
          <span>3000.0000 NDX</span>
        </div>
      </div>
      <div v-else>
        <div>{{$t('vip.otherMortgage')}}：</div>
        <div>
          <span>3000.0000 NDX</span>
          <span class="back">{{$t('vip.redeem')}}＞</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swiper from 'swiper';
// import '/swiper/dist/css/swiper.css';

export default {
  props: [
    'func',
    'type',
    'vipInfo',
    'vipList',
    'lastDays',
    'chooseLv',
  ],
  data() {
    return {}
  },
  mounted() {
    // this.handleSwiperStart();
  },
  methods: {
    // 获取等级样式
    vipCoinClass(index) {
      const coinList = [
        'icon-v',
        'icon-huaban74',
        'icon-huaban73',
        'icon-huaban72',
        'icon-huaban68',
        'icon-huaban71',
        'icon-huaban69',
        'icon-huaban66',
        'icon-huaban70',
        'icon-huaban67',
        'icon-huaban65',
      ]
      return coinList[index];
    },
    // 启动swiper
    handleSwiperStart() {
      if (this.swiper) {
        this.swiper.destroy(true);
      }
      if (this.vipList.length < 1) {
        setTimeout(() => {
          this.handleSwiperStart()
        }, 200);
        return;
      }
      // swiper
      this.swiper = new Swiper('.swiper-container_index', { // eslint-disable-line
        pagination: '.swiper-pagination_index',
        slidesPerView: 3,
        spaceBetween: 20,
        prevButton: '.swiper-button-prev',
        nextButton: '.swiper-button-next',
        // onClick: (swiper) => {
        // }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";
@import '../../../assets/css/swiper.min.css';

.main{
  font-size: .24rem;
  .vip{
    color: #F6C85C !important;
    font-size: .41rem;
  }

  .chooseLv{
    .lists{
      display: flex;
      overflow: auto;

      .list{
        max-width: 1.75rem;
        min-width: 1.75rem;
        height: 2.25rem;
        border: 1px solid $color-input;
        border-radius: .0816rem;
        margin-left: .15rem;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        box-sizing: border-box;

        &.listActived{
          border: 1px solid #F5A623;
          background: rgba(242,219,164,0.37);
        }

        &:first-child{
          margin-left: 0rem;
        }
        .num{
          font-size: .36rem;
          color: #8B572A;
        }
        .perMonth,
        .status{
          margin: .12rem 0;
          font-size: .21rem;
          color: $color-999;
        }
      }
    }
  }

  .tipDiv{
    margin-top: .24rem;

    .lessMonth{
      color: #F5A623;
    }
    .pay{
      color: $color-999;
    }
  }
  .stakedInfo{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: .24rem;
    background: rgba(242,219,164,0.20);
    border-radius: .08rem;
    height: 1.3rem;
    padding: 0 .24rem;
    font-size: .21rem;

    &>div{
      color: $color-999;
      &>div{
        margin-bottom: .12rem;
        &:last-child{
          margin-bottom: 0rem;
        }
      }
    }
    .back{
      color: #8B572A;
      margin-left: .14rem;
    }
  }
}
</style>
