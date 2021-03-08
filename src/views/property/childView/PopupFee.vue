<template>
  <div class="aboutFee">
    <span class="iconfont icon-huaban17 popupClose" @click="handleClose"></span>
    <div class="title">{{$t('exchange.aboutUsdtFee')}}</div>
      <div class="tableDiv">
        <div class="tableTitle">
          <div>{{$t('exchange.exchangeUsdt')}}</div>
          <div>{{$t('exchange.feeBi')}}</div>
        </div>
        <div class="tableContent">
          <div class="tableItem">
             <div>
               <div>
                 <p>USDT</p>
                 <p class="chian">(EOS{{$t('exchange.chain')}})</p>
               </div>
               <i class="iconfont icon-huaban124 iconChain"></i>
               <div>
                 <p>USDT</p>
                 <p class="chian">(TRON{{$t('exchange.chain')}})</p>
               </div>
             </div>
             <div>{{$t('exchange.no')}}</div>
          </div>
          <div class="tableItem">
             <div>
               <div>
                 <p>USDT</p>
                 <p class="chian">(EOS{{$t('exchange.chain')}})</p>
               </div>
               <i class="iconfont icon-huaban124 iconChain"></i>
               <div>
                 <p>USDT</p>
                 <p class="chian">(ETH{{$t('exchange.chain')}})</p>
               </div>
             </div>
             <div class="ethFee">
                 <p>0.5 USDT</p>
                 <p class="chian">（ETH{{$t('exchange.chain')}}）</p>
             </div>
          </div>
        </div>
      </div>
      <div class="tipDiv">
        <div class="tip">{{$t('exchange.feeTip1',{coin:"TRON"})}}</div>
        <div class="tip">{{$t('exchange.feeTip2')}}</div>
      </div>
  </div>
</template>

<script>

export default {
  props: ['coin'],
  data() {
    return {}
  },
  methods: {
    // 关闭弹窗
    handleOrder() {
      this.$emit('listenOrder', true)
    },
    handleClose() {
      this.$emit('listenClose', false)
    },
  }
}
</script>

<style lang="scss" scoped>

.aboutFee{
  width: 6.21rem;
  padding: .46rem .26rem .55rem;
  box-sizing: border-box;
  position: relative;
  font-size: .28rem;
  background: #fff;
  border-radius: 0.15rem;

  .popupClose{
    position: absolute;
    right: .2rem;
    top: .2rem;
    font-size: .18rem;
    color: #3A3949;
  }

  .title{
    text-align: center;
    margin-bottom: .4rem;
    font-size: 0.36rem;
    color: #4A90E2;
  }
  .tableDiv{
    border: 1px solid #4A90E2;
    border-radius: 0.15rem;
    .tableTitle{
      display: flex;
      background: #E9F2FF;
      border-radius: 0.15rem 0.15rem 0 0;
      font-size: 0.25rem;
      color: #4A90E2;
      border-bottom: 1px solid #A8D0FF;
      &>div{
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        height: .73rem;
        border-right: 1px solid #A8D0FF;
        box-sizing: border-box;
        &:last-child{
          border-right: none;
        }
        // 特殊样式
        &:first-child{
          min-width: 2.94rem;
          // background-color: #eee;
          border-radius: 0.15rem 0 0 0;
        }
      }
    }
    .tableContent{
      display: flex;
      flex-direction: column;
      background: #fff;
      border-radius: 0 0 0.15rem 0.15rem;
      font-size: 0.27rem;
      color: #4A4A4A;
      &>.tableItem{
        display: flex;
        border-bottom: 1px solid #A8D0FF;
        &:last-child{
          border-bottom: none;
        }
        &>div{
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          border-right: 1px solid #A8D0FF;
          padding: .22rem .22rem .18rem;
          box-sizing: border-box;
          &:last-child{
            border-right: none;
          }
          // 特殊样式
          &:first-child{
            min-width: 2.94rem;
          }
        }
      }
    }
  }

  .chian{
    font-size: 0.18rem;
    text-align: center;
    color: #9B9B9B;
  }
  .iconChain{
    font-size: .25rem;
    color: #4A90E2;
    margin: 0 .1rem;
    transform: rotate(-90deg);
  }
  .ethFee{
    flex-direction: column;
  }
  .tipDiv{
    margin-top: .18rem;
  }
  .tip{
    // margin: .17rem .36rem;
    font-size: 0.24rem;
    color: #9B9B9B;
    padding-left: .3rem;
    position: relative;
    margin-bottom: .14rem;

  &::before{
    content: '';
    position: absolute;
    width: .06rem;
    height: .06rem;
    border-radius: 50%;
    background: #A6B6D7;
    left: .15rem;
    top: .18rem;
    transform: translate(-50%, -50%);
   }
  }
}
</style>
