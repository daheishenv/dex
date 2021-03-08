<template>
  <div>
    <iframe class="iframe" :class="{'noTabbar': !$store.state.sys.otcToShowBar}"
      id="iframe" :src="iframeSrc" frameborder="0"></iframe>
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
      iframeSrc: '',
      refList: [
        'newdexTest',
        'localTest',
        '',
        ''
      ],
      localHostList: [
        `http://${getReqUrl('ip')}:${process.env.VUE_APP_PORT14}`,
        'http://192.168.8.253:9998',
        'https://newdex.340wan.com',
        'https://dapp.newdex.io',
        'http://0.0.0.0:9998',
        'http://192.168.8.254:9998',
        'http://localhost:9998',
      ],
      hostList: [
        `http://${getReqUrl('ip')}:2032`, // 测试服 - 对应 测试服地址
        'http://192.168.8.253:2032', // 本地测试 - 对应 http://192.168.8.253:8890
        'https://dapp.danchor.io', // 国内生产 - 对应 https://newdex.340wan.com
        'https://dapp.danchor.io', // 国外生产 - 对应 https://dapp.newdex.io
        'http://localhost:2032',
        'http://192.168.8.254:2032',
        'http://localhost:2032',
      ],
      host: '',
    }
  },
  watch: {
    '$store.state.sys.timestamp': function listen() {
      const fchannel = localStorage.getItem('channel')
      this.iframeSrc = `${this.host}/usn?channel=scatterEmbed&chain=eos&fchannel=${fchannel}&t=${this.$store.state.sys.timestamp}`;
      this.responseMessage('routeTo', {
        routeName: 'index',
      });
    }
  },
  mounted() {
    const host = location.origin;
    let index = this.localHostList.findIndex(item => item === host);
    if (index < 0) {
      index = 0;
    }
    this.host = this.hostList[index];
    const fchannel = localStorage.getItem('channel')
    this.iframeSrc = `${this.host}/usn?channel=scatterEmbed&chain=eos&fchannel=${fchannel}&t=${this.$store.state.sys.timestamp}`;
    window.addEventListener('message', this.receiveMessage, false);
  },
  beforeDestroy() {
    if (document.getElementById('webWidget')) {
      document.getElementById('webWidget').style.display = 'none';
    }
    if (document.getElementById('launcher')) {
      document.getElementById('launcher').style.display = 'none';
    }
    window.removeEventListener('message', this.receiveMessage, false);
    this.$store.dispatch('setOtcToShowBar', true)
  },
  methods: {
    async receiveMessage(event) {
      const origin = event.origin || event.originalEvent.origin;
      console.log(origin); // eslint-disable-line
      if (origin !== this.host) return;
      const message = JSON.parse(event.data);
      console.log('testIframe -> actionName', message.action); // eslint-disable-line
      const fromName = this.$store.state.app.accountInfo.account;
      const permission = this.$store.state.app.accountInfo.permissions;
      switch (message.action) {
        case 'getConfig': {
          const response = {
            language: this.$store.state.app.language, // en / zh-CN / zh-TW / ko
            channel: localStorage.getItem('channel')
          }
          this.responseMessage(message.action, response);
          break;
        }
        case 'getAccount': {
          const accountInfo = this.$store.state.app.accountInfo;
          const response = {
            account: accountInfo.account,
            authority: accountInfo.permissions,
            blockchain: accountInfo.chain,
            publicKey: accountInfo.publicKey,
            encodeName: accountInfo.encodeName
          }
          this.responseMessage(message.action, response);
          break;
        }
        case 'getArbitrarySignature': {
          // const timestamp = message.data.text;
          // DApp.signText(timestamp.toString(), (err, data) => {
          //   if (err) {
          //     Toast(this.$t('error.tokenError'));
          //     return;
          //   }
          //   this.responseMessage(message.action, data);
          // });
          this.handelRegToken(message, () => {
            const token = localStorage.getItem('token');
            if (token) {
              const data = {
                token,
              }
              this.responseMessage(message.action, data);
              return;
            }
            accountToSign(this, () => {
              const data = {
                token: localStorage.getItem('token')
              }
              this.responseMessage(message.action, data);
            })
          })
          break;
        }
        case 'transfer': {
          // 转账
          console.log(message.data); // eslint-disable-line
          const obj = message.data
          const params = {
            actions: [
              {
                account: obj.code,
                name: 'transfer',
                authorization: [{
                  actor: fromName, // 转账者
                  permission,
                }],
                data: {
                  from: fromName,
                  to: obj.toAccount,
                  quantity: obj.quantity,
                  memo: obj.memo
                }
              }
            ]
          };
          // mykey不是免CPU下单
          const channelWallet = localStorage.getItem('channel') || '';
          if (!this.$store.state.whiteConfig.isFreeCpuWhite) {
            obj.useFreeCpu = false;
          }
          const transferParams = {
            params,
            useFreeCpu: obj.useFreeCpu
          }
          const result = await DApp.transactionApi(transferParams);
          // 错误信息
          if (result && result.code !== 0) {
            DApp.handleScatterErrorBack(result, (type, text) => {
              type === 'lang' ? this.$toast(this.$t(text)) : this.$toast(text);
            });
          } else {
            result.channelWallet = channelWallet;
          }
          this.responseMessage(message.action, {
            err: result,
            res: result
          });
          // DApp.transfer(params, (err, res) => {
          //   const result = params.useFreeCpu ? JSON.stringify(res) : res;
          //   // if (!err) {
          //   //   result.channelWallet = channelWallet;
          //   // }
          //   this.responseMessage(message.action, {
          //     err,
          //     res: result
          //   });
          // })
          break;
        }
        case 'locationHref': {
          const channelWallet = localStorage.getItem('channel') || 'scatter';
          const params = message.data;
          params.url = params.url.replace('channel=scatterEmbed', `channel=${channelWallet}`)
          location.href = params.url;
          break;
        }
        case 'setTabbar': {
          console.log(message.data); // eslint-disable-line
          const params = message.data
          this.$store.dispatch('setOtcToShowBar', params.type)
          break;
        }
        case 'generateUsn': {
          console.log('generateUsn', message.data); // eslint-disable-line
          const obj = message.data
          // mykey不是免CPU下单
          // const channelWallet = localStorage.getItem('channel') || '';
          if (!this.$store.state.whiteConfig.isFreeCpuWhite) {
            obj.useFreeCpu = false;
          }
          const params = {
            actions: [
              {
                account: obj.toAccount, // 合约账户
                name: 'adjust', // adjust - 下调质押率
                authorization: [{
                  actor: fromName, // 转账者
                  permission, // 权限 active | owner
                }],
                data: {
                  owner: fromName,
                  rate: window.parseInt(obj.percent * 100),
                  issue: obj.issue, // 1 - 生成 USN || 0 - 取出EOS
                }
              }
            ]
          };
          const transferParams = {
            params,
            useFreeCpu: obj.useFreeCpu
          }
          const result = await DApp.transactionApi(transferParams);
          if (result && result.code !== 0) {
            DApp.handleScatterErrorBack(result, (type, text) => {
              type === 'lang' ? this.$toast(this.$t(text)) : this.$toast(text);
            });
          }
          this.responseMessage(message.action, {
            err: result,
            res: result
          });
          // DApp.generateUsn(params, (err, res) => {
          //   const result = res;
          //   // if (!err) {
          //   //   result.channelWallet = channelWallet;
          //   // }
          //   this.responseMessage(message.action, {
          //     err,
          //     res: result
          //   });
          // })
          break;
        }
        case 'manageStake': {
          console.log(message.data); // eslint-disable-line
          const params = message.data
          // mykey不是免CPU下单
          // const channelWallet = localStorage.getItem('channel') || '';
          if (!this.$store.state.whiteConfig.isFreeCpuWhite) {
            params.useFreeCpu = false;
          }
          DApp.manageStake(params, (err, res) => {
            const result = res;
            // if (!err) {
            //   result.channelWallet = channelWallet;
            // }
            this.responseMessage(message.action, {
              err,
              res: result
            });
          })
          break;
        }
        case 'routerTo': {
          const params = message.data
          this.$router.push(params)
          break;
        }
        default:
          break;
      }
    },
    responseMessage(action, data) {
      const iframe = document.getElementById('iframe');
      const targetOrigin = this.host;
      const message = {
        action,
        data
      }
      iframe.contentWindow.postMessage(JSON.stringify(message), targetOrigin);
    },
    handelRegToken(message, cb) {
      const params = {
        token: localStorage.getItem('token')
      }
      this.$http.post('/token/checkTokenStatus', params).then((res) => {
        if (res.code !== 0) {
          // token 无效
          accountToSign(this, () => {
            const data = {
              token: localStorage.getItem('token')
            }
            this.responseMessage(message.action, data);
          })
          return
        }
        cb()
      });
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
  height: calc(100vh - 1rem);
  min-width: 100%;
  max-width: 7.5rem;
  margin: 0px;
  display: flex;

  &.noTabbar{
    height: calc(100vh);
  }
}
</style>
