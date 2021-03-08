<template>
  <div class="chooseChain">
    <div class="main">
      <span class="iconfont icon-huaban17 popupClose" @click="handleChoiceChainClose"></span>
      <div class="title">{{ $t('index.chooseChain') }}</div>
      <div class="content">
        <!-- <div class="">
          <div class="item" :class="{'actived': checked === 'eos'}" @click="handleCheck('eos')">
            <div class="chainIcon">
              <img width="100%" src="https://nds.340wan.com/static/img/chainIcon/EOS-big.png" alt="">
            </div>
            <div>EOS</div>
          </div>
        </div>
        <div class="">
          <div class="item" :class="{'actived': checked === 'tron'}" @click="handleCheck('tron')">
            <div class="chainIcon tron">
              <img width="100%" src="https://nds.340wan.com/static/img/chainIcon/TRON-big.png" alt="">
            </div>
            <div>TRON</div>
          </div>
        </div> -->
          <div class="list" @click="handleCheck('eos')">
            <div class="chainDiv">
              <div class="chainImg">
                <img class="img" src="https://nds.340wan.com/static/img/chainIcon/EOS.png">
              </div>
              <div class="chainName">EOS</div>
            </div>
            <span class="iconfont lang" :class="{'icon-huaban90 checked': checked === 'eos'}"></span>
          </div>
          <div class="list" @click="handleCheck('tron')">
            <div class="chainDiv">
              <div class="chainImg">
                <img class="img" src="https://nds.340wan.com/static/img/chainIcon/TRON.png">
              </div>
              <div class="chainName">TRON</div>
            </div>
            <span class="iconfont lang" :class="{'icon-huaban90 checked': checked === 'tron'}"></span>
          </div>
      </div>
      <div class="btn" @click="handleSure">{{ $t('trade.comfirm') }}</div>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie';
import { getReqUrl } from '@/utils/public';

export default {
  data() {
    return {
      channelRef: 'dapp',
      host: '',
      checked: 'eos',
    }
  },
  created() {
    this.host = location.host;
    const noCookieChain = this.$appName === 'eosNewdex' ? 'eos' : 'tron'
    this.checked = Cookies.get('tradeCode') || noCookieChain;
  },
  methods: {
    // 选择
    handleCheck(chain) {
      this.checked = chain;
    },
    // 关闭弹窗的单独Cookies动作
    handleChoiceChainClose() {
      const index = this.host.indexOf('m.newdex.'); // 正式
      // const index = this.host.indexOf('192.168.8.'); // 测试
      if (index !== -1) {
        // 总入口 - 关闭按钮默认选择 eos
        const hostnames = window.location.hostname.split('.');
        const size = hostnames.length;
        const domain = `.${hostnames[size - 2]}.${hostnames[size - 1]}`;
        Cookies.set('tradeCode', this.checked, { path: '/', domain, expires: 30 });
      }
      // 关闭弹窗
      this.$emit('listenClose', false);
    },
    // 确认
    handleSure() {
      const hostnames = window.location.hostname.split('.');
      const size = hostnames.length;
      const domain = `.${hostnames[size - 2]}.${hostnames[size - 1]}`;
      Cookies.set('tradeCode', this.checked, { path: '/', domain, expires: 30 });

      const index = this.host.indexOf('192.168.8.')
      if (index !== -1) { // 测试服
        if (this.checked === 'eos') {
          location.href = `http://${getReqUrl('ip')}:${process.env.VUE_APP_PORT14}`;
        } else if (this.checked === 'tron') {
          location.href = `http://${getReqUrl('ip')}:${process.env.VUE_APP_PORT19}`;
        }
        return;
      }
      // 生产
      location.href = `https://m.${this.checked}${domain}`;
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/public.scss";

.chooseChain{
  font-size: .3rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1000000;

  .main{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #FFF;
    width: 6.21rem;
    border-radius: .0867rem;
    padding: .4rem;
    box-sizing: border-box;
  }
  .popupClose{
    position: absolute;
    right: .2rem;
    top: .2rem;
    color: $color-999;
    font-size: .25rem;
  }
  .title{
    color: $color-this;
    font-size: .36rem;
    text-align: center;
    margin-bottom: .4rem;
  }

  // .content{
  //   display: flex;
  //   align-items: center;
  //   justify-content: space-between;
  //   margin-bottom: .56rem;

  //   &>div{
  //     flex: 1;
  //     text-align: center;
  //     display: flex;
  //     align-items: center;
  //     justify-content: center;
  //   }

  //   .item{
  //     width: 1.47rem;
  //     text-align: center;
  //     padding: .2rem .1rem;
  //     box-sizing: border-box;
  //     border: 1px solid transparent;
  //     border-radius: .06rem;
  //     color: $color-333;
  //   }

  //   .actived{
  //     background: #F5F9FF;
  //     border: 1px solid #4A90E2;
  //   }

  //   .chainIcon{
  //     width: .56rem;
  //     margin: auto;
  //     margin-bottom: .12rem;

  //     &.tron{
  //       width: .75rem;
  //     }
  //   }
  // }
  .list{
      height: 1.14rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid $color-input;
      padding: 0.2rem .4rem;

      &:last-child{
        margin-bottom: .2rem;
        border-bottom: 0px solid $color-input;
      }
      .chainDiv{
        display: flex;
        align-items: center;
        .chainImg{
          height: .9rem;
          width: .9rem;
          // border-radius: 50%;
          // background: #F8F9FB;
          // margin-right: .26rem;
          display: flex;
          align-items: center;
          justify-content: center;

          .img{
            width: .6rem;
            height: .6rem;

          }
        }
        .chainName{
          color: #333;
          font-size: .3rem;
        }
      }

      .lang{
        height: .36rem;
        width: .36rem;
        font-size: .36rem;
        color: $color-this;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid $color-999;
        border-radius: 2rem;
        box-sizing: border-box;

        &.checked{
          font-size: .38rem;
          border: 0px solid transparent;
        }
      }
    }
  .btn{
    margin: auto;
    width: 4.9rem;
    height: .78rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $color-this;
    border-radius: .0965rem;
    color: #FFF;
  }
}

</style>
