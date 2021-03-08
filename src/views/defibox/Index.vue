
<template>
  <!-- background: #f9f9f9; -->
  <div>
    <div class="iframe" :class="{'noTabbar': !$store.state.sys.otcToShowBar}">
      <div class="loadingDiv" v-if="iframeLoading">
        <i class="iconfont icon-huaban134 loading el-icon-loading" style="color:#4a90e2"></i>
      </div>
      <iframe class="embedIfram" id="newdexIframe" height="100%" frameborder="0"></iframe>
    </div>
  </div>
</template>

<script>
import DApp from '@/utils/wallet';
import { getReqUrl } from '@/utils/public'; // eslint-disable-line

export default {
  name: 'swap',
  data() {
    return {
      parentUrl: '',
      targetOrigin: '',
      iframeLoading: true,
      appResTimer: null,
    }
  },
  props: {},
  watch: {
    '$store.state.app.language': function change() {
      const response = {
        language: this.$store.state.app.language, // en / zh-CN / zh-TW / ko
      }
      this.handleResponseMessage('getConfig', response);
    },
    '$store.state.sys.timestamp': function listen() {
      this.handleMounted()
      this.responseMessage('routeTo', {
        routeName: 'index',
      });
    }
  },
  computed: {},
  created() {
  },
  mounted() {
    this.parentUrl = window.location.origin;
    this.handleMounted();
  },
  beforeDestroy() {
    window.removeEventListener('message', this.handleReceiveMessage, false);
    document.getElementById('newdexIframe').setAttribute('src', '');
    window.clearInterval(this.appResTimer)
  },
  methods: {
    handleMounted() {
      this.iframeLoading = true;
      const env = process.env.NODE_ENV;
      let src = 'https://defibox.340wan.com'
      if (env === 'development') {
        // ${getReqUrl('ip')}
        src = `http://${getReqUrl('ip')}:${process.env.VUE_APP_PORT22}`;
        // src = 'http://localhost:2002';
      }
      this.targetOrigin = src;
      let channel = localStorage.getItem('channel');
      if (channel.toLowerCase() === 'tokenpocket') {
        channel = 'scatter'
      }
      const lang = this.$store.state.app.language;
      const iframeSrc = `${src}/swap?origin=${encodeURIComponent(this.parentUrl)}&channel=${channel}&fchannel=${channel}&embed=1&chain=eos&language=${lang}&v=${new Date().getTime()}`;
      document.getElementById('newdexIframe').setAttribute('src', iframeSrc);
      window.addEventListener('message', this.handleReceiveMessage, false);
      document.getElementById('newdexIframe').onload = (() => {
        this.iframeLoading = false;
      })
    },
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
          const params = message.params;
          const transObj = {
            params,
            useFreeCpu: message.useFreeCpu
          }
          const result = await DApp.transactionApi(transObj);
          this.handleResponseMessage(message.action, { result, useFreeCpu: transObj.useFreeCpu});
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
        default:
      }
    },
    handleResponseMessage(action, data) {
      const iframe = document.getElementById('newdexIframe');
      const message = { action, data }
      iframe.contentWindow.postMessage(JSON.stringify(message), this.targetOrigin);
    },
  },
}
</script>
<style lang="scss" scoped>

.embedIfram {
  width: 100%;
  min-width: 7.5rem;
}
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .iframe {
      height: calc(100vh - 1.5rem) !important;
    &.noTabbar{
      height: calc(100vh - .50rem) !important;
    }
  }
}

.iframe{
  height: calc(100vh - 1rem);
  min-width: 100%;
  max-width: 750px;
  margin: 0px;
  display: flex;
  background: #fff;
  position: relative;

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
  }
}
</style>
