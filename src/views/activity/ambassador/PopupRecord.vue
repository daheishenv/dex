<template>
  <div class="rentTip">
    <span class="iconfont icon-huaban17 popupClose" @click="handleClosePopup"></span>
    <div class="title">{{ $t('turnTable.Record') }}</div>
      <div v-if="drawLogList.length !== 0" class="list">
        <div class="item-title">
          <div >{{ $t('turnTable.prize') }}</div>
          <div >{{ $t('turnTable.timePrize') }}</div>
        </div>
        <div class="content" >
          <div class="item" v-for="item in drawLogList" :key="item.id">
            <div>{{item.reward}}</div>
            <div>{{handleTime(item.createTs)}}</div>
          </div>
        </div>
        <!-- handleOrder -->
        <div class="btn" @click="handleClosePopup">
          {{ $t('turnTable.sure') }}
        </div>
      </div>
      <div v-else>
          <div class="content color-fff">{{ $t('turnTable.noData') }}</div>
      </div>
  </div>
</template>

<script>
import { toLocalTime } from '@/utils/public';

export default {
  data() {
    return {}
  },
  props: ['drawLogList'],
  methods: {
    // 关闭弹窗
    handleOrder() {
      this.$emit('listenOrder', true)
    },
    handleClosePopup() {
      this.$emit('listenClose', false)
    },
    handleTime(val) {
      return toLocalTime(val).substring(0, 19)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.rentTip{
  width: 6.21rem;
  padding: .46rem .26rem .55rem;
  box-sizing: border-box;
  position: relative;
  font-size: .28rem;
  background: #020D33;
  border-radius: 0.15rem;

  .popupClose{
    position: absolute;
    right: .2rem;
    top: .2rem;
    font-size: .18rem;
    color: #fff;
  }

  .title{
    text-align: center;
    margin-bottom: .4rem;
    font-size: .32rem;
    color: #E7C9AA;
  }
  .list{
    display: flex;
    flex-direction: column;
  }
  .item-title{
    height: 0.78rem;
    display: flex;
    color: #E7C9AA;
    // border-radius: 0.1rem 0.1rem 0 0;
     background-color: #40444B;
    overflow: hidden;
    div{
      font-size: 0.26rem;
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 0.78rem;
      // border-left: 0.01rem solid #D7D7D7;
      // border-bottom: 0.01rem solid #D7D7D7;
      // box-sizing: border-box;
      // &:first-child{
      //   border-left: none;
      // }
    }
  }

  .content{
    text-align: center;
    max-height: 4.8rem;
    overflow: auto;
    color: #fff;
    // border-radius: 0 0 0.1rem 0.1rem;
  }
  .item{
    height: 0.78rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #EAEDEF;
    font-size: 0.25rem;
    background-color: #34373A;
    box-sizing: border-box;
    // border-bottom: 0.02rem solid #43459c;
    &>:last-child{
      border-bottom: none;
    }
    // margin-bottom: 0.1rem;
    // border-right: 0.01rem solid #D7D7D7;
    div{

      font-size: 0.24rem;
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 0.78rem;
      // border-left: 0.01rem solid #f5f5f5;
      // border-top: 0.01rem solid #f5f5f5;
      // box-sizing: border-box;
      // &:first-child{
      //   border-left: none;
      // }
    }
  }
  .btn{
    // background: #FFFFFF;
    border-radius: 0.05rem;
    width: 2.7rem;
    height: .77rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.27rem;
    // color: #633420;
    margin: 0.6rem auto 0.1rem;
    // background: linear-gradient(to top, #FFE275, #FEAF37);
    color: #fff;
    background-image: linear-gradient(90deg, #848EFF 0%, #3452E3 100%);
    // background-color: #333438;
    // color:#63381a;
    // background-color: #F1C89E;
  }
}
</style>
