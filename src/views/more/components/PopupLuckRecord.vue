<template>
  <div class="record">
    <span class="iconfont icon-huaban17 popupClose" @click="handleClosePopup"></span>
    <div class="title">{{ $t('luckDraw.recordList') }}</div>
    <div class="list">
      <div class="item notices" v-for="(item, $index) in list" :key="$index">
        <span>
          <span class="iconfont icon-v vip" :class="{'trade font40': $route.name === 'trade', 'trade': $route.name === 'index'}"
            v-if="!item.level"></span>
          <span class="iconfont icon-huaban74 vip isVip" :class="{'font40': $route.name === 'trade'}"
            v-if="item.level === 1"></span>
          <span class="iconfont icon-huaban73 vip isVip" :class="{'font40': $route.name === 'trade'}"
            v-if="item.level === 2"></span>
          <span class="iconfont icon-huaban72 vip isVip" :class="{'font40': $route.name === 'trade'}"
            v-if="item.level === 3"></span>
          <span class="iconfont icon-huaban68 vip isVip" :class="{'font40': $route.name === 'trade'}"
            v-if="item.level === 4"></span>
          <span class="iconfont icon-huaban71 vip isVip" :class="{'font40': $route.name === 'trade'}"
            v-if="item.level === 5"></span>
          <span class="iconfont icon-huaban69 vip isVip" :class="{'font40': $route.name === 'trade'}"
            v-if="item.level === 6"></span>
          <span class="iconfont icon-huaban66 vip isVip" :class="{'font40': $route.name === 'trade'}"
            v-if="item.level === 7"></span>
          <span class="iconfont icon-huaban70 vip isVip" :class="{'font40': $route.name === 'trade'}"
            v-if="item.level === 8"></span>
          <span class="iconfont icon-huaban67 vip isVip" :class="{'font40': $route.name === 'trade'}"
            v-if="item.level === 9"></span>
          <span class="iconfont icon-huaban65 vip isVip" :class="{'font40': $route.name === 'trade'}"
            v-if="item.level === 10"></span>
          <span>{{ item.account }}</span>
        </span>
        <span>
          <span :class="{'padding8': $store.state.app.language === 'en' ||$store.state.app.language === 'ko' }">
            {{ $t('luckDraw.gets') }}{{item.reward}} {{item.coin}}
          </span>
        </span>
        <span>
          {{ handleToLocalTime(item.createTs) }}
        </span>
        <!-- <span :class="{'padding8': $store.state.app.language === 'ko' }">
          {{ $t('luckDraw.gets2') }}
        </span> -->
      </div>
    </div>
  </div>
</template>

<script>
import { toLocalTime } from '@/utils/public';

export default {
  data() {
    return {
      list: [],
    }
  },
  mounted() {
    this.handleGetRecord();
  },
  methods: {
    // 关闭弹窗
    handleClosePopup() {
      this.$emit('listenClose', false)
    },
    handleToLocalTime(t) {
      return toLocalTime(t).substr(0, 10)
    },
    handleGetRecord() {
      this.$http.get('/draw/getTopRewards').then((res) => {
        if (res.code !== 0) {
          return;
        }
        this.list = res.list;
      });
    }
  },
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.record{
  width: 7.15rem;
  height: 5.33rem;
  border: .16rem solid #0069FF;
  border-radius: .11rem;
  box-sizing: border-box;
  background: #fff;
  padding: .26rem .12rem;
  position: relative;

  .popupClose{
    position: absolute;
    right: .2rem;
    top: .2rem;
    color: $color-999;
    font-size: .25rem;
  }

  .title{
    text-align: center;
    font-size: .396rem;
    color: #F5A623;
    margin-bottom: .11rem;
  }

  .list{
    width: 6.55rem;
    height: 3.75rem;;
    margin: auto;
    overflow: auto;

    .item{
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: .264rem;
      height: .7rem;
      border-bottom: 1px solid $color-input;

      &>span{
        margin-right: .12rem;;
        flex: 1;

        &:first-child{
          min-width: 2.5rem;
          max-width: 2.5rem;
        }

        &:nth-child(2){
          margin-right: .12rem;;
        }

        &:last-child{
          text-align: left;
          margin-right: 0rem;
          max-width: 1.6rem;;
        }
      }

      .padding8{
        padding: 0px .08rem;
      }

      .vip{
        font-size: .26rem;
        opacity: .6;
        color: #FFF;
        margin-right: .06rem;
      }

      .trade{
        color: #b7b7b7;
      }

      .isVip{
        color: #F6C85C !important;
        opacity: 1;
      }
    }
  }
}
</style>
