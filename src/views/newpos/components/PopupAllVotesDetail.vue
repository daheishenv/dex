<template>
  <div class="allVotes">
    <span class="iconfont icon-huaban17 popupClose" @click="handleClose"></span>
    <div class="title">{{ $t('newpos.posCount') }}</div>
    <div class="content">
      <div class="itemTitle item">
        <div>{{ $t('newpos.proxyAccount') }}</div>
        <div>{{ $t('newpos.proxyVotesCount') }}</div>
      </div>
      <div class="overflow">
        <div class="item" v-for="(item, $index) in proxyVotesInfos" :key="$index">
          <div>{{ item.proxyName }}</div>
          <div>{{ handleToFixed(item.proxyVotes, 0) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toFixed } from '@/utils/public';

export default {
  data() {
    return {}
  },
  props: [
    'proxyVotesInfos',
  ],
  mounted() {
  },
  methods: {
    handleToFixed(n, l) {
      return toFixed(n, l)
    },
    handleClose() {
      this.$emit('listenClose', false);
    }
  },
  beforeDestroy() {
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.allVotes{
  background: #FFF;
  width: 7rem;
  box-sizing: border-box;
  border-radius: .1725rem;
  padding: .46rem .36rem .58rem;

  .popupClose{
    position: absolute;
    right: .2rem;
    top: .2rem;
    font-size: .21rem;
  }

  .title{
    text-align: center;
    color: $color-this;
    font-size: .36rem;
    margin-bottom: .3rem;
  }

  .content{
    border: 1px solid $color-this;
    border-radius: .15rem;
    overflow: auto;
    max-height: 5.32rem;

    .itemTitle{
      font-size: .25rem !important;
      color: $color-this;
      background: #E9F2FF;;
    }

    .overflow{
      max-height: 4.3rem;
      overflow: auto;
    }

    .item{
      height: .73rem;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #A8D0FF;
      font-size: .28rem;

      &:last-child{
        border-bottom: 0px solid #A8D0FF;
      }

      &>div{
        flex: 3;
        display: flex;
        justify-content: center;
        align-items: center;
        max-width: 50%;
        overflow: hidden;
      }

      &>div:last-child{
        flex: 3;
        height: 100%;
        border-left: 1px solid #A8D0FF;
      }
    }
  }
}
</style>
