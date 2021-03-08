<template>
  <div class="aboutFee">
    <span class="iconfont icon-huaban17 popupClose" @click="handleClose"></span>
    <div class="title">{{ $t('exchange.popupAboutUsdt1') }}</div>
    <div class="tableDiv">
      <div class="tableTitle">
        <div>{{ $t('exchange.exchangeUsdt') }}</div>
        <div>{{ $t('exchange.minerFee') }}</div>
        <div>{{ $t('exchange.feeBi') }}</div>
      </div>
      <div class="tableContent">
        <div class="tableItem" v-for="item in feeListFormat" :key="item.id">
          <div>
            <div>
              <p>USDT</p>
              <p class="chian">({{ item.fromChain.toUpperCase() }}{{ $t('exchange.chain') }})</p>
            </div>
            <i class="iconfont icon-huaban124 iconChain" :class="{ reverse: item.reverse }"></i>
            <div>
              <p>USDT</p>
              <p class="chian">({{ item.toChain.toUpperCase() }}{{ $t('exchange.chain') }})</p>
            </div>
          </div>
          <!-- 矿工费 -->
          <div>
            <span v-if="item.fee > 0">{{ $t('exchange.ownPay') }}</span>
            <span v-else>{{ $t('exchange.no') }}</span>
          </div>
          <!-- 手续费 -->
          <div>
            <span v-if="item.fee > 0">{{ item.fee }} USDT</span>
            <span v-else>{{ $t('exchange.no') }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- eos->tron -->
    <div class="tipDiv">
      <div class="tip">{{ $t('exchange.minerFeeTip1') }}</div>
      <!-- <div class="tip">{{$t('exchange.feeTip1')}}</div> -->
    </div>
    <!-- tron->eos -->
    <!-- <div class="tipDiv" v-else>
        <div class="tip">{{$t('exchange.minerFeeTip1')}}</div>
        <div class="tip">{{$t('exchange.minerFeeTip2')}}</div>
      </div> -->
  </div>
</template>

<script>
export default {
  props: ['coin', 'reverse', 'feelist'],
  data() {
    return {};
  },
  computed: {
    feeListFormat() {
      return JSON.parse(JSON.stringify(this.feelist)).map((el) => {
        if (el.fromChain.toLowerCase() !== 'eos') {
          // 调换位置,reverse用来标记箭头方向
          let temp = el.fromChain;
          el.fromChain = el.toChain;
          el.toChain = temp;
          el.reverse = true;
        } else {
          el.reverse = false;
        }
        return el;
      });
    },
  },
  methods: {
    // 关闭弹窗
    handleOrder() {
      this.$emit('listenOrder', true);
    },
    handleClose() {
      this.$emit('listenClose', false);
    },
  },
};
</script>

<style lang="scss" scoped>
.aboutFee {
  width: 6.21rem;
  padding: 0.46rem 0.26rem 0.55rem;
  box-sizing: border-box;
  position: relative;
  font-size: 0.28rem;
  background: #fff;
  border-radius: 0.15rem;

  .popupClose {
    position: absolute;
    right: 0.2rem;
    top: 0.2rem;
    font-size: 0.18rem;
    color: #3a3949;
  }

  .title {
    text-align: center;
    margin-bottom: 0.4rem;
    font-size: 0.28rem;
    color: #4a90e2;
  }
  .tableDiv {
    border: 1px solid #4a90e2;
    border-radius: 0.15rem;
    .tableTitle {
      display: flex;
      background: #e9f2ff;
      border-radius: 0.15rem 0.15rem 0 0;
      font-size: 0.22rem;
      color: #4a90e2;
      border-bottom: 1px solid #a8d0ff;
      & > div {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        height: 0.73rem;
        border-right: 1px solid #a8d0ff;
        box-sizing: border-box;
        &:last-child {
          min-width: 1.7rem;
          border-right: none;
        }
        // 特殊样式
        &:first-child {
          min-width: 2.6rem;
          // background-color: #eee;
          border-radius: 0.15rem 0 0 0;
        }
      }
    }
    .tableContent {
      display: flex;
      flex-direction: column;
      background: #fff;
      border-radius: 0 0 0.15rem 0.15rem;
      font-size: 0.22rem;
      color: #4a4a4a;
      & > .tableItem {
        display: flex;
        border-bottom: 1px solid #a8d0ff;
        &:last-child {
          border-bottom: none;
        }
        & > div {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          border-right: 1px solid #a8d0ff;
          padding: 0.22rem 0.15rem 0.18rem;
          box-sizing: border-box;
          &:last-child {
            min-width: 1.7rem;
            border-right: none;
          }
          // 特殊样式
          &:first-child {
            min-width: 2.6rem;
          }
        }
      }
    }
  }

  .chian {
    font-size: 0.18rem;
    text-align: center;
    color: #9b9b9b;
  }
  .iconChain {
    font-size: 0.25rem;
    color: #4a90e2;
    margin: 0 0.1rem;
    transform: rotate(-90deg);
    &.reverse {
      transform: rotate(90deg);
    }
  }
  .ethFee {
    flex-direction: column;
  }
  .tipDiv {
    margin-top: 0.18rem;
  }
  .tip {
    // margin: .17rem .36rem;
    font-size: 0.24rem;
    color: #9b9b9b;
    padding-left: 0.3rem;
    position: relative;
    margin-bottom: 0.14rem;

    &::before {
      content: '';
      position: absolute;
      width: 0.06rem;
      height: 0.06rem;
      border-radius: 50%;
      background: #a6b6d7;
      left: 0.15rem;
      top: 0.18rem;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
