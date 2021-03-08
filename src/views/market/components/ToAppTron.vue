<template>
  <div class="dialog">
    <div class="title">{{ $t('index.chooseWallet') }}</div>
    <div class="checkBox">
      <div>
        <div class="item" :class="{'actived': checked === 0}" @click="handleCheck(0)">
          <div class="img"><img width="100%" src="https://nds.340wan.com/static/img/chainIcon/tronlink.png" alt=""></div>
          <div class="name">{{ $t('index.tronLink') }}</div>
        </div>
      </div>
      <div>
        <div class="item" :class="{'actived': checked === 1}" @click="handleCheck(1)">
          <div class="img"><img width="100%" src="https://nds.340wan.com/static/img/chainIcon/tp.png" alt=""></div>
          <div class="name">Token Pocket</div>
        </div>
      </div>
      <div>
        <div class="item" :class="{'actived': checked === 2}" @click="handleCheck(2)">
          <div class="img"><img width="100%" src="https://nds.340wan.com/static/img/chainIcon/math.png" alt=""></div>
          <div class="name">{{ $t('index.math') }}</div>
        </div>
      </div>
    </div>
    <div class="btnDiv">
      <button class="btn" @click="handleToDown">{{ $t('down.installApp') }}</button>
    </div>

    <div
      v-clipboard:copy="'https://tron.newdex.vip'"
      v-clipboard:success="onCopy"
      v-clipboard:error="onError">
      <div class="tip">{{ $t('public.dialogTip4') }}</div>
      <div class="tip">
        <span class="link-color">https://tron.newdex.vip</span>
        {{ $t('public.dialogTip3') }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checked: 0,
      urlList: [
        'https://www.tronlink.org',
        'https://www.tokenpocket.pro/en/',
        'http://www.mathwallet.org/cn/',
      ],
    }
  },
  methods: {
    handleCheck(index) {
      this.checked = index;
    },
    /* 复制保存账户信息 start */
    onCopy() {
      this.$toast({
        message: this.$t('down.copySuccess'),
        position: 'bottom',
        duration: 2000
      });
    },
    onError() {
      this.$toast({
        message: this.$t('down.copyError'),
        position: 'bottom',
        duration: 2000
      });
    },
    /* 复制保存账户信息 end */
    handleToDown() {
      const url = this.urlList[this.checked]
      window.location.href = url;
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.dialog{
  padding: .48rem .3rem .46rem .3rem;

  .title{
    color: $color-this;
    font-size: .36rem;
    margin-bottom: .4rem;
  }

  .checkBox{
    display: flex;
    align-items: center;
    justify-content: space-between;
    // margin-bottom: .56rem;

    &>div{
      flex: 1;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .item{
      width: .95rem;
      text-align: center;
      padding: .2rem .28rem;
      // box-sizing: border-box;
      border: 1px solid transparent;
      border-radius: .06rem;

      .img{
        font-size: .28rem;
        margin-bottom: .14rem;
      }
      .name{
        height: .9rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .actived{
      background: #F5F9FF;
      border: 1px solid #4A90E2;
    }

    .chainIcon{
      width: .56rem;
      margin: auto;
      margin-bottom: .12rem;

      &.tron{
        width: .75rem;
      }
    }
  }

  .btnDiv{
    padding: .42rem .5rem .2rem .5rem;

    .btn{
      height: .8rem;
      line-height: .8rem;
      width: 100%;
      border-radius: .4rem;
      color: #FFF;
      background: #0069FF;
      border: 1px solid #0069FF;
      font-size: .32rem;
    }
  }

  .tip{
    line-height: .4rem;
    font-size: .24rem;
    color: $color-999;
  }

  .enTip{
    margin: auto;
    max-width: 5rem;
  }

  .link-color{
    color: #0069FF;
  }
}
</style>
