<template>
  <div class="info">
    <div class="iconDiv">
      <div class="imgDiv"><img src="https://ndi.340wan.com/eos/eosio.token-eos.png" alt=""></div>
      <div>CPU & NET {{ $t('resources.lease') }}</div>
    </div>

    <div class="content">
      <div class="item">
        <span>{{ $t('resources.cpuLeaseTip') }}</span>
      </div>
      <div>
        <span>{{ $t('resources.cpuLeaseTip1') }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.info{
  padding: .26rem;
  font-size: .25rem;

  .iconDiv{
    padding: .2rem 0px 0rem 0px;
    display: flex;
    align-items: center;/*垂直居中*/

    .imgDiv{
      width: .7rem;
      height: .7rem;
      margin-right: .13rem;
      img{
        width: 100%;
      }
    }

    .coin{
      padding-left: .2rem;

      .coinName{
        font-size: .29rem;
      }
    }
  }

  .content{
    margin-top: .22rem;

    .item{
      margin-bottom: .25rem;
      word-break: break-all;

      &:last-child{
        margin-bottom: 0rem;
      }

      .tip{
        color: $color-999;
      }
    }
  }
}
</style>
