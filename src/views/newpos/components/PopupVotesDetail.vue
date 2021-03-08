<template>
  <div class="allVotes">
    <span class="iconfont icon-huaban17 popupClose" @click="handleClose"></span>
    <div class="title">{{ $t('newpos.accountPosDetail') }}</div>
    <div class="content">
      <div class="itemTitle item">
        <div>{{ $t('newpos.posType') }}</div>
        <div>{{ $t('newpos.num') }} (EOS)</div>
      </div>
      <div class="item">
        <div>{{ $t('newpos.buyRex') }}</div>
        <div class="num">{{ rexCount }}</div>
      </div>
      <div class="item">
        <div>{{ $t('newpos.stakedResources') }}</div>
        <div class="num">{{ stakeCount }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: [
    'stakeCount',
    'rexCount'
  ],
  mounted() {
  },
  methods: {
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

    .item{
      height: .73rem;
      display: flex;
      align-items: center;
      border-bottom: 1px solid $color-this;
      font-size: .25rem;

      &:last-child{
        border-bottom: 0px solid $color-this;
      }

      &>div{
        flex: 2;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      &>div:last-child{
        flex: 3;
        height: 100%;
        border-left: 1px solid $color-this;
      }

      .num{
        font-size: .3rem;
      }
    }
  }
}
</style>
