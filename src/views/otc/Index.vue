<template>
  <div>
    <div class="iframe" :class="{'noTabbar': !$store.state.sys.otcToShowBar}">
      <div class="loadingDiv" v-if="iframeLoading">
        <i class="iconfont icon-huaban134 loading el-icon-loading" style="color:#4a90e2"></i>
      </div>
      <iframe
        id="newdexIframe" :src="iframeSrc" frameborder="0" style="width: 100%;"></iframe>
    </div>
  </div>
</template>

<script>
import DApp from '@/utils/wallet';
import { accountToSign } from '@/utils/publicApi';
// import { Toast } from 'mint-ui';
import { getReqUrl } from '@/utils/public';

export default {
  data() {
    return {
      channel: 'scatter',
      iframeSrc: '',
      parentUrl: '',
      targetOrigin: '',
      iframeLoading: false,
    }
  },
  watch: {
    '$store.state.sys.timestamp': function listen() {
      const lang = this.$store.state.app.language;
      this.iframeSrc = `${this.targetOrigin}?embed=1&origin=${encodeURIComponent(this.parentUrl)}&channel=${this.channel}&language=${lang}&chain=eos&t=${this.$store.state.sys.timestamp}`;
      this.responseMessage('routeTo', {
        routeName: 'index',
      });
    }
  },
  mounted() {
    this.iframeLoading = true;
    const env = process.env.NODE_ENV;
    this.parentUrl = window.location.origin;
    let src = 'https://newdex.340wan.com'
    if (env === 'development') {
      src = `http://${getReqUrl('ip')}:${process.env.VUE_APP_PORT15}`;
      // src = 'http://192.168.8.66:2031';
    }
    const urlParams = this.getUrlParams(window.location.href) || {};
    this.targetOrigin = src;
    this.channel = localStorage.getItem('channel');
    const lang = this.$store.state.app.language;
    if (urlParams.personal) {
      this.iframeSrc = `${src}/my?embed=1&origin=${encodeURIComponent(this.parentUrl)}&channel=${this.channel}&language=${lang}&chain=eos&t=${this.$store.state.sys.timestamp}`;
    } else {
      this.iframeSrc = `${src}?embed=1&origin=${encodeURIComponent(this.parentUrl)}&channel=${this.channel}&language=${lang}&chain=eos&t=${this.$store.state.sys.timestamp}`;
    }
    document.getElementById('newdexIframe').onload = (() => {
      this.iframeLoading = false;
    })

    this.$nextTick(() => {
      window.addEventListener('message', this.handleReceiveMessage, false);
    })
  },
  beforeDestroy() {
    if (document.getElementById('webWidget')) {
      document.getElementById('webWidget').style.display = 'none';
    }
    if (document.getElementById('launcher')) {
      document.getElementById('launcher').style.display = 'none';
    }
    window.removeEventListener('message', this.handleReceiveMessage, false);
    document.getElementById('newdexIframe').setAttribute('src', '');
  },
  methods: {
    async handleReceiveMessage(event) {
      const storeApp = this.$store.state.app;
      const origin = event.origin || event.originalEvent.origin;
      console.log(origin, this.targetOrigin); // eslint-disable-line
      if (origin !== this.targetOrigin) return;
      const message = JSON.parse(event.data);
      console.log('Newdex->get request action name', message); // eslint-disable-line
      switch (message.action) {
        case 'getConfig': {
          const response = {
            language: storeApp.language, // en / zh-CN / zh-TW / ko
            channel: localStorage.getItem('channel')
          }
          this.handleResponseMessage('getConfig', response);
          break;
        }
        case 'getAccount': {
          const accountInfo = storeApp.accountInfo;
          const response = {
            accountInfo,
          }
          this.handleResponseMessage(message.action, response);
          break;
        }
        case 'setHeight': {
          console.log('get Height', message.data.height + 'px'); // eslint-disable-line
          // document.getElementById('newdexIframe').style.height = `${parseInt(message.data.height, 0)}px`;
          // document.getElementById('newdexIframe').style['min-height'] = `${parseInt(message.data.height, 0)}px`;
          // document.documentElement.scrollTop = 0;
          break;
        }
        case 'eosTransaction': {
          const params = message.data;
          const result = await DApp.transactionApi(params);
          this.handleResponseMessage(message.action, { result, useFreeCpu:  params.useFreeCpu});
          break;
        }
        case 'getArbitrarySignature': {
          accountToSign(this, () => {
            const data = {
              token: localStorage.getItem('token')
            }
            this.handleResponseMessage(message.action, data);
          });
          break;
        }
        case 'pageSkipping': {
          window.location.href = message.href;
          break;
        }
        case 'routeTo': {
          this.$router.push({
            name: message.name
          })
          break;
        }
        case 'setTabbar': {
          console.log(message.data); // eslint-disable-line
          const params = message.data
          this.$store.dispatch('setOtcToShowBar', params.type)
          break;
        }
        case 'locationHref': {
          const params = message.data;
          location.href = params.url;
          break;
        }
        default:
      }
    },
    handleResponseMessage(action, data) {
      const iframe = document.getElementById('newdexIframe');
      const message = { action, data }
      iframe.contentWindow.postMessage(JSON.stringify(message), this.targetOrigin);
    },
    // async receiveMessage(event) {
    //   const origin = event.origin || event.originalEvent.origin;
    //   if (origin !== this.targetOrigin) return;
    //   const message = JSON.parse(event.data);
    //   switch (message.action) {
    //     case 'getConfig': {
    //       const response = {
    //         language: this.$store.state.app.language, // en / zh-CN / zh-TW / ko
    //         channel: localStorage.getItem('channel')
    //       }
    //       this.responseMessage(message.action, response);
    //       break;
    //     }
    //     case 'getAccount': {
    //       const accountInfo = this.$store.state.app.accountInfo;
    //       const response = {
    //         account: accountInfo.account,
    //         authority: accountInfo.permissions,
    //         blockchain: accountInfo.chain,
    //         publicKey: accountInfo.publicKey,
    //       }
    //       this.responseMessage(message.action, response);
    //       break;
    //     }
    //     case 'getArbitrarySignature': {
    //       this.handelRegToken(message, () => {
    //         const token = localStorage.getItem('token');
    //         if (token) {
    //           const data = {
    //             token,
    //           }
    //           this.responseMessage(message.action, data);
    //           return;
    //         }
    //         accountToSign(this, () => {
    //           const data = {
    //             token: localStorage.getItem('token')
    //           }
    //           this.responseMessage(message.action, data);
    //         })
    //       })
    //       break;
    //     }
    //     case 'transfer': {
    //       // 转账
    //       console.log(message.data); // eslint-disable-line
    //       const fromName = this.$store.state.app.accountInfo.account;
    //       const permission = this.$store.state.app.accountInfo.permissions;
    //       const obj = message.data
    //       const params = {
    //         actions: [
    //           {
    //             account: obj.code,
    //             name: 'transfer',
    //             authorization: [{
    //               actor: fromName, // 转账者
    //               permission,
    //             }],
    //             data: {
    //               from: fromName,
    //               to: obj.toAccount,
    //               quantity: obj.quantity,
    //               memo: obj.memo
    //             }
    //           }
    //         ]
    //       };
    //       // mykey不是免CPU下单
    //       const channelWallet = localStorage.getItem('channel') || '';
    //       if (!this.$store.state.whiteConfig.isFreeCpuWhite) {
    //         obj.useFreeCpu = false;
    //       }
    //       const transferParams = {
    //         params,
    //         useFreeCpu: obj.useFreeCpu
    //       }
    //       const result = await DApp.transactionApi(transferParams);
    //       // 错误信息
    //       if (result && result.code !== 0) {
    //         DApp.handleScatterErrorBack(result, (type, text) => {
    //           type === 'lang' ? this.$toast(this.$t(text)) : this.$toast(text);
    //         });
    //       } else {
    //         result.channelWallet = channelWallet;
    //       }
    //       this.responseMessage(message.action, {
    //         err: result,
    //         res: result
    //       });
    //       // DApp.transfer(params, (err, res) => {
    //       //   const result = res;
    //       //   if (!err) {
    //       //     result.channelWallet = channelWallet;
    //       //   }
    //       //   this.responseMessage(message.action, {
    //       //     err,
    //       //     res: result
    //       //   });
    //       // })
    //       break;
    //     }
    //     case 'locationHref': {
    //       const params = message.data;
    //       location.href = params.url;
    //       break;
    //     }
    //     case 'setTabbar': {
    //       console.log(message.data); // eslint-disable-line
    //       const params = message.data
    //       this.$store.dispatch('setOtcToShowBar', params.type)
    //       break;
    //     }
    //     default:
    //       break;
    //   }
    // },
    // responseMessage(action, data) {
    //   const iframe = document.getElementById('newdexIframe');
    //   const message = {
    //     action,
    //     data
    //   }
    //   iframe.contentWindow.postMessage(JSON.stringify(message), this.targetOrigin);
    // },
    // handelRegToken(message, cb) {
    //   const params = {
    //     token: localStorage.getItem('token')
    //   }
    //   this.$http.post('/token/checkTokenStatus', params).then((res) => {
    //     if (res.code !== 0) {
    //       // token 无效
    //       accountToSign(this, () => {
    //         const data = {
    //           token: localStorage.getItem('token')
    //         }
    //         this.responseMessage(message.action, data);
    //       })
    //       return
    //     }
    //     cb()
    //   });
    // },
    getUrlParams(url) {
      const params = {};
      url.replace(/[?&]+([^=&]+)=([^&]*)/gi, (str, key, value) => {
        params[key] = value;
      });
      return params;
    }
  },
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/public.scss";

@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .iframe {
    height: calc(100vh - 1.5rem) !important;
    &.noTabbar{
      height: calc(100vh - .5rem) !important;
    }
  }
}

.iframe{
  position: relative;
  height: calc(100vh - 1rem);
  min-width: 100%;
  max-width: 7.5rem;
  margin: 0px;
  display: flex;

  &.noTabbar{
    height: calc(100vh);
  }
  .loadingDiv {
    width: 100%;
    height: 100%;
    display: flex;
    position: absolute;
    justify-content: center;
    align-items: center;

    i {
      color: #999;
    }
  }
}
</style>
