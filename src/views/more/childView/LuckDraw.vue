<template>
  <div class="luckDrawDiv" :class="{'height960px webBg': urlData.source === 'web'}">
    <div class="bg">
      <!-- 每日幸运大抽奖 -->
      <div class="imgDiv">
        <img src="https://nds.340wan.com/static/img/luckDraw/title.png"
        v-if="$store.state.app.language === 'zh-CN'" alt="">
        <img src="https://nds.340wan.com/static/img/luckDraw/title-zh-TW.png"
        v-if="$store.state.app.language === 'zh-TW'" alt="">
        <img src="https://nds.340wan.com/static/img/luckDraw/title-en.png"
        v-if="$store.state.app.language === 'en' || $store.state.app.language === 'ko'">
      </div>

      <!-- title -->
      <div class="titleDiv">
        <!-- <img src="https://nds.340wan.com/static/img/luckDraw/title2.png"
        v-if="$store.state.app.language === 'zh-CN'">
        <img src="https://nds.340wan.com/static/img/luckDraw/title2-zh-TW.png"
        v-if="$store.state.app.language === 'zh-TW'" alt="">
        <img src="https://nds.340wan.com/static/img/luckDraw/title2-en.png"
        v-if="$store.state.app.language === 'en' || $store.state.app.language === 'ko'"> -->
      </div>

      <!-- 中奖滚动框 -->
      <div class="scroll" id="notice">
        <div class="item notices" v-for="(item, $index) in drawList" :key="$index">
          <span class="iconfont icon-v vip" :class="{'trade font40': $route.name === 'trade', 'trade': $route.name === 'index'}"
            v-if="!item.level"></span>
          <span class="iconfont icon-huaban74 vip isVip" :class="{'font40': $route.name === 'trade'}"
            v-if="item.level === 1"></span>
          <span class="iconfont icon-huaban73 vip isVip" :class="{'font40': $route.name === 'trade'}"
            v-if="item.level === 2"></span>
          <span class="iconfont icon-huaban72 vip isVip" :class="{'font40': $route.name === 'trade'}"
            v-if="item.level === 3"></span>
          <span class="iconfont icon-huaban68 vip isVip" :class="{'font40': $route.name === 'trade'}"
            v-if="item.level === 4"></span>
          <span class="iconfont icon-huaban71 vip isVip" :class="{'font40': $route.name === 'trade'}"
            v-if="item.level === 5"></span>
          <span class="iconfont icon-huaban69 vip isVip" :class="{'font40': $route.name === 'trade'}"
            v-if="item.level === 6"></span>
          <span class="iconfont icon-huaban66 vip isVip" :class="{'font40': $route.name === 'trade'}"
            v-if="item.level === 7"></span>
          <span class="iconfont icon-huaban70 vip isVip" :class="{'font40': $route.name === 'trade'}"
            v-if="item.level === 8"></span>
          <span class="iconfont icon-huaban67 vip isVip" :class="{'font40': $route.name === 'trade'}"
            v-if="item.level === 9"></span>
          <span class="iconfont icon-huaban65 vip isVip" :class="{'font40': $route.name === 'trade'}"
            v-if="item.level === 10"></span>
          <span>{{ item.account }}</span>
          <span :class="{'padding8': $store.state.app.language === 'en' ||$store.state.app.language === 'ko' }">
            {{ $t('luckDraw.gets') }}
          </span>
          <span>{{ toFixed(item.reward, 4) }}{{ item.coin }}</span>
          <!-- <span :class="{'padding8': $store.state.app.language === 'ko' }">
            {{ $t('luckDraw.gets2') }}
          </span> -->
        </div>
        <div class="item notices" v-for="(item, $index) in drawList" :key="`${$index}-2`">
          <span class="iconfont icon-v vip" :class="{'trade font40': $route.name === 'trade', 'trade': $route.name === 'index'}"
            v-if="!item.level"></span>
          <span class="iconfont icon-huaban74 vip isVip" :class="{'font40': $route.name === 'trade'}"
            v-if="item.level === 1"></span>
          <span class="iconfont icon-huaban73 vip isVip" :class="{'font40': $route.name === 'trade'}"
            v-if="item.level === 2"></span>
          <span class="iconfont icon-huaban72 vip isVip" :class="{'font40': $route.name === 'trade'}"
            v-if="item.level === 3"></span>
          <span class="iconfont icon-huaban68 vip isVip" :class="{'font40': $route.name === 'trade'}"
            v-if="item.level === 4"></span>
          <span class="iconfont icon-huaban71 vip isVip" :class="{'font40': $route.name === 'trade'}"
            v-if="item.level === 5"></span>
          <span class="iconfont icon-huaban69 vip isVip" :class="{'font40': $route.name === 'trade'}"
            v-if="item.level === 6"></span>
          <span class="iconfont icon-huaban66 vip isVip" :class="{'font40': $route.name === 'trade'}"
            v-if="item.level === 7"></span>
          <span class="iconfont icon-huaban70 vip isVip" :class="{'font40': $route.name === 'trade'}"
            v-if="item.level === 8"></span>
          <span class="iconfont icon-huaban67 vip isVip" :class="{'font40': $route.name === 'trade'}"
            v-if="item.level === 9"></span>
          <span class="iconfont icon-huaban65 vip isVip" :class="{'font40': $route.name === 'trade'}"
            v-if="item.level === 10"></span>
          <span>{{ item.account }}</span>
          <span :class="{'padding8': $store.state.app.language === 'en' ||$store.state.app.language === 'ko' }">
            {{ $t('luckDraw.gets') }}
          </span>
          <span>{{ toFixed(item.reward, 4) }}{{ item.coin }}</span>
        </div>
      </div>

      <!-- 中奖展示 -->
      <div class="luckListDiv">
        <div class="luckList">
          <div class="title">
            <span>{{ $t('luckDraw.luckyNumber') }}</span>
            <span>{{ $t('luckDraw.award') }}</span>
          </div>
          <div class="list" v-for="(item, $index) in ruleList"
            :class="{'thisNum': drawNum !== '' && drawNum >= item.beginNum && drawNum <= item.endNum,
            'lastChild': $index === ruleList.length - 1}" :key="$index">
            <span v-if="item.beginNum !== item.endNum">{{ item.beginNum }}-{{ item.endNum }}</span>
            <span v-if="item.beginNum === item.endNum">{{ item.endNum }}</span>
            <span>
              <div v-if="item.beginNum !== item.endNum">{{ toFixed(item.reward, 4) }} {{ item.coin }}</div>
              <div v-if="item.beginNum === item.endNum" class="record">
                <div>{{ toFixed(item.reward, 4) }} {{ item.coin }}</div>
                <div class="recordList" @click="record = true">{{ $t('luckDraw.recordList') }}</div>
              </div>
            </span>
          </div>
          <!-- <div class="record"><span @click="record = true">{{ $t('luckDraw.recordList') }}</span></div> -->
        </div>
        <div class="luckInfo" :class="{'hidden': !drawNum}">
          <span>{{ $t('luckDraw.winTip1') }}</span>
          <span class="color-red">{{ drawNum }}</span>
          <span>{{ $t('luckDraw.winTip2') }}</span>
          <span class="color-red">{{ drawWin }}</span>
          <span v-if="$store.state.app.language === 'en' || $store.state.app.language === 'ko'">{{ $t('luckDraw.winTip3') }}</span>
        </div>
        <div class="luckDiv">
          <div class="luckBtn" :class="{'nonBtn': !remainDrawCount}"
            v-if="!isDrawing" @click="handleDraw">
            {{ $t('luckDraw.run') }}（{{ remainDrawCount || 0 }}{{$t('luckDraw.runNumber')}}）
          </div>
          <div v-if="isDrawing" class="luckBtn nonBtn">{{ drawingNum }}</div>
        </div>
      </div>

      <!-- 账户信息 -->
      <div class="accountInfo">
        <div class="top" :class="{'noVipTop': !$store.state.app.vipInfo.level}">
          <span class="iconfont icon-v vip" :class="{'trade font40': $route.name === 'trade', 'trade': $route.name === 'index'}"
            v-if="!$store.state.app.vipInfo.level"></span>
          <span class="iconfont icon-huaban74 vip isVip" :class="{'font40': $route.name === 'trade'}"
            v-if="$store.state.app.vipInfo.level === 1"></span>
          <span class="iconfont icon-huaban73 vip isVip" :class="{'font40': $route.name === 'trade'}"
            v-if="$store.state.app.vipInfo.level === 2"></span>
          <span class="iconfont icon-huaban72 vip isVip" :class="{'font40': $route.name === 'trade'}"
            v-if="$store.state.app.vipInfo.level === 3"></span>
          <span class="iconfont icon-huaban68 vip isVip" :class="{'font40': $route.name === 'trade'}"
            v-if="$store.state.app.vipInfo.level === 4"></span>
          <span class="iconfont icon-huaban71 vip isVip" :class="{'font40': $route.name === 'trade'}"
            v-if="$store.state.app.vipInfo.level === 5"></span>
          <span class="iconfont icon-huaban69 vip isVip" :class="{'font40': $route.name === 'trade'}"
            v-if="$store.state.app.vipInfo.level === 6"></span>
          <span class="iconfont icon-huaban66 vip isVip" :class="{'font40': $route.name === 'trade'}"
            v-if="$store.state.app.vipInfo.level === 7"></span>
          <span class="iconfont icon-huaban70 vip isVip" :class="{'font40': $route.name === 'trade'}"
            v-if="$store.state.app.vipInfo.level === 8"></span>
          <span class="iconfont icon-huaban67 vip isVip" :class="{'font40': $route.name === 'trade'}"
            v-if="$store.state.app.vipInfo.level === 9"></span>
          <span class="iconfont icon-huaban65 vip isVip" :class="{'font40': $route.name === 'trade'}"
            v-if="$store.state.app.vipInfo.level === 10"></span>
          <span class="accountName">{{ $store.state.app.vipInfo.account || '—' }}</span>
          <span class="tip" v-if="!$store.state.app.vipInfo.account">{{ $t('luckDraw.signToDraw') }}</span>
          <span class="tip" v-if="$store.state.app.vipInfo.account && !$store.state.app.vipInfo.level">{{ $t('luckDraw.noMemberTip') }}</span>
          <span class="tip" v-if="$store.state.app.vipInfo.account && $store.state.app.vipInfo.level">
            {{ $t('luckDraw.isVip1') }} {{ $store.state.app.vipInfo.level }}{{ $t('luckDraw.isVip2')
            }}{{ $store.state.app.vipInfo.level }}{{ $t('luckDraw.isVip3') }}
          </span>
        </div>

        <div class="bottom">
          <!-- 会员升级 -->
          <div v-if="$store.state.app.vipInfo.account">
            <span>{{ $t('luckDraw.upgradeVipTip') }}</span>
            <span class="btn" @click="handleUpLevel">{{ $t('vip.updataShort') }}</span>
          </div>
          <!-- 登录 -->
          <div v-if="!$store.state.app.vipInfo.account">
            <span>{{ $t('luckDraw.joinVipTip') }}</span>
            <span class="btn" @click="handleLogin">{{ $t('luckDraw.signIn') }}</span>
          </div>
          <!-- 开通 -->
          <!-- <div v-if="$store.state.app.vipInfo.account && !$store.state.app.vipInfo.level">
            <span>{{ $t('luckDraw.upgradeVipTip') }}</span>
            <span class="btn" @click="handleOpenVip">{{ $t('vip.openShort') }}</span>
          </div> -->
        </div>
      </div>

      <!-- 活动规则 -->
      <div class="rule">
        <div class="title">{{ $t('luckDraw.eventDescription') }}</div>
        <div class="ruleList">
          <div class="ruleItem">1.{{ $t('luckDraw.pickNumbers') }}</div>
          <div class="ruleItem">2.{{ $t('luckDraw.memberTip') }}</div>
          <div class="ruleItem">3.{{ $t('luckDraw.memberTip1') }}</div>
        </div>
      </div>
    </div>

    <!-- 大奖记录 start -->
    <mt-popup
      class="popup"
      popup-transition="popup-fade"
      v-model="record">
      <PopupLuckRecord v-if="record" @listenClose="handleClose" />
    </mt-popup>
    <!-- 大奖记录 end -->
  </div>
</template>

<script>
import { Popup } from 'mint-ui';
// import DApp from '@/utils/wallet';
import { toFixed, GetUrlPara, getReqUrl } from '@/utils/public';
import { accountToSign } from '@/utils/publicApi';

import PopupLuckRecord from '../components/PopupLuckRecord'

export default {
  data() {
    return {
      channelReg: 'dapp',
      noAccount: true, // 无登陆账户
      vipLv: 0,
      drawList: [],
      ruleList: [],
      timer: null,
      timerout: null,
      drawNum: '',
      drawWin: '',
      drawingNum: 0,
      remainDrawCount: 0, // 用户抽奖次数
      drawTimer: null,
      targetOrigin: '',
      isDrawing: false,
      urlData: {
        source: ''
      },
      record: false,
    }
  },
  components: {
    PopupLuckRecord,
    mtPopup: Popup,
  },
  mounted() {
    const whost = window.location.host;
    switch (whost) {
      case `${getReqUrl('ip')}:${process.env.VUE_APP_PORT14}`:
        this.targetOrigin = `http://${getReqUrl('ip')}:2000`;
        break;
      default: {
        if (whost.indexOf('eos.newdex') >= 0) {
          this.targetOrigin = 'https://eos.newdex.io'
          if (whost.indexOf('vip') >= 0) {
            this.targetOrigin = 'https://eos.newdex.vip'
          }
        } else {
          this.targetOrigin = 'https://newdex.io'
          if (whost.indexOf('vip') >= 0) {
            this.targetOrigin = 'https://newdex.vip'
          }
        }
      }
    }
    this.urlData = GetUrlPara();
    this.channelReg = localStorage.getItem('channelRef');
    this.handleMounted();
    this.handleGetRules();
    this.handleDrawList();
    // this.handleGetAccountInfo();
    this.drawTimer = window.setInterval(() => {
      this.drawingNum = window.parseInt(Math.random() * 10000);
    }, 50)
    const vipInfo = this.$store.state.app.vipInfo;
    if (vipInfo && vipInfo.remainDrawCount) {
      this.remainDrawCount = vipInfo.remainDrawCount
    }
  },
  methods: {
    handleClose() {
      this.record = false;
    },
    toFixed(m, n) {
      return toFixed(m, n);
    },
    // 抽奖
    handleDraw() {
      // 验证次数
      if (this.remainDrawCount <= 0 || !this.remainDrawCount) return;
      // 验证token
      const token = localStorage.getItem('token');
      const urlData = GetUrlPara();
      if (this.channelReg === 'h5') {
        if (urlData.source === 'web' && !token) {
          // 调用web授权接口
          this.handleWebLogin();
          return;
        }
        if (urlData.source !== 'web' && !token) {
          // 不执行抽奖
          return;
        }
      }
      if (!token) {
        this.handleGetTimestampJson();
        return;
      }
      this.isDrawing = true;
      this.drawNum = '';
      this.$http.get('/draw/start').then((res) => {
        setTimeout(() => {
          this.isDrawing = false;
        }, 1000);
        if (res.code !== 0) {
          if (res.code === 401) {
            // 处理web端调用
            if (urlData.source === 'web') {
              this.$toast(this.$t('error.token'))
              setTimeout(() => {
                this.handleWebLogin();
              }, 1500);
              return;
            }
            this.handleGetTimestampJson();
            return
          }
          return;
        }
        setTimeout(() => {
          this.drawNum = res.luckyNumber.toString();
          // this.drawNum = '10000';
          this.drawWin = res.reward;
        }, 1000);
        // 更新用户次数信息
        this.remainDrawCount = res.remainDrawCount;
        const vipInfo = this.$store.state.app.vipInfo;
        vipInfo.remainDrawCount = res.remainDrawCount;
        this.$store.dispatch('setVipInfo', vipInfo);
      })
    },
    handleMounted() {
      // H5 - 处理web & android & ios 账户处理
      if (this.channelReg === 'h5') {
        const urlData = GetUrlPara();
        // 处理web端调用
        if (urlData.source === 'web') {
          // 回调监听
          window.addEventListener('message', this.handleReceiveMessage, false);
          // 获取用户
          const messageGetAccount = { action: 'getAccount', data: null }
          window.parent.postMessage(messageGetAccount, this.targetOrigin);
          return;
        }
        // 处理APP端调用
        if (urlData.source === 'android' || urlData.source === 'ios') {
          const data = window.action.getAccountInfo();
          this.handleGetWebAccount(JSON.parse(data))
          return;
        }
        // h5本身页面打开
        this.noAccount = true;
      }
    },
    // web监听事件 - 分发
    handleReceiveMessage(event) {
      // console.log(event.data)
      if (event.data.type === 'webpackWarnings') {
        return;
      }
      const message = event.data;
      // 处理获取账户事件
      if (message.action === 'getAccount') {
        this.handleGetWebAccount(message.data)
      }
      // 处理获取账户事件
      // if (message.action === 'accountAction') {
      // }
    },
    // 获取web账户事件处理
    handleGetWebAccount(data) {
      // console.log('获取账户信息')
      // console.log(data)
      const obj = {
        account: '',
        discountRate: 1,
        level: 0,
        maxLevel: 8,
        ndxStaked: 0,
        totalSaveAmount: 0,
        vipImageUrl: '',
        remainDrawCount: 0,
      };
      if (!data.account) {
        localStorage.setItem('token', '');
        this.$store.dispatch('setVipInfo', obj);
        const accountInfo = {
          account: '',
          chain: 'eos'
        }
        this.$store.dispatch('setAccountInfo', accountInfo);
        return;
      }
      localStorage.setItem('token', data.token || '');
      const accountInfo = {
        account: data.account,
        chain: data.chain
      }
      this.$store.dispatch('setAccountInfo', accountInfo);
      obj.account = data.account;
      this.$store.dispatch('setVipInfo', obj);

      if (data.chain !== 'eos') {
        this.remainDrawCount = 0;
        return;
      }
      if (data.authorized) {
        this.handleDraw();
      } else {
        this.handleGetAccountInfo(data.account, data.chain);
      }
    },
    // 获取活动规则
    handleGetRules() {
      this.$http.get('/draw/getRuleList').then((res) => {
        if (res.code !== 0) {
          return;
        }
        this.ruleList = res.drawRuleList;
      })
    },
    // 获取抽奖列表
    handleDrawList() {
      const params = {
        count: 6,
      }
      this.$http.get('/draw/getLatestDrawList', { params }).then((res) => {
        if (res.code !== 0) {
          return;
        }
        this.drawList = res.latestDrawList;
        this.handleScroll();
      })
    },
    // 抽奖列表滚动
    handleScroll() {
      const mainTop = document.getElementById('notice');
      if (!mainTop) {
        return;
      }
      if (this.timer) {
        window.clearInterval(this.timer);
      }
      if (this.timerout) {
        window.clearTimeout(this.timerout);
      }
      this.timerout = window.setTimeout(() => {
        this.timer = window.setInterval(() => {
          mainTop.scrollTop += 1;
          // 错误处理
          if (!mainTop.getElementsByClassName('notices')[0]) {
            return;
          }
          const height = mainTop.getElementsByClassName('notices')[0].scrollHeight;
          if (mainTop.scrollTop > height) {
            mainTop.appendChild(mainTop.getElementsByClassName('notices')[0]);
            mainTop.scrollTop -= height;
            this.handleScroll();
          }
        }, 25);
      }, 1000);
    },
    // 获取账户会员等级
    handleGetAccountInfo(account, chain) {
      try {
        let accountName = account;
        if (!accountName) {
          accountName = this.$store.state.app.accountInfo.account;
        }
        const params = {
          account: accountName,
          chain,
        }
        this.$http.post('/account/getAccountInfo', params).then((res) => {
          if (res.code === 1007) {
            const initVipInfo = this.$store.state.sys.initVipInfo;
            initVipInfo.account = this.$store.state.app.accountInfo.account;
            initVipInfo.chain = this.$store.state.app.accountInfo.chain;
            this.$store.dispatch('setVipInfo', initVipInfo);
            return;
          }
          if (res.code !== 0) {
            return;
          }
          this.remainDrawCount = res.accountInfo.remainDrawCount;
          this.$store.dispatch('setVipInfo', res.accountInfo);
          if (chain !== 'eos') {
            this.remainDrawCount = 0;
          }
        })
      } catch (error) {
        console.log(error); /* eslint-disable-line */
      }
    },
    // 登录
    handleLogin() {
      if (this.channelReg === 'dapp') {
        return;
      }
      if (this.channelReg === 'h5') {
        const urlData = GetUrlPara();
        if (urlData.source === 'web') {
          this.handleWebLogin()
          return;
        }
        if (urlData.source === 'android' || urlData.source === 'ios') {
          window.action.goToLogin()
        }
      }
    },
    // 升级
    handleUpLevel() {
      if (this.channelReg === 'dapp') {
        this.$router.push({
          name: 'vipDetail',
        })
        return;
      }
      if (this.channelReg === 'h5') {
        const urlData = GetUrlPara();
        if (urlData.source === 'web') {
          window.parent.postMessage({ action: 'toMemberAction', data: { action: 0 } }, this.targetOrigin);
          return;
        }
        if (urlData.source === 'android' || urlData.source === 'ios') {
          // window.action.goToVipCenter(this.$store.state.app.vipInfo.level)
          this.$router.push({
            name: 'vipDetail',
          })
        }
      }
    },
    // 开通
    handleOpenVip() {
      if (this.channelReg === 'dapp') {
        this.$router.push({
          name: 'vipDetail',
          params: {
            show: false,
          }
        })
        return;
      }
      if (this.channelReg === 'h5') {
        const urlData = GetUrlPara();
        if (urlData.source === 'web') {
          window.parent.postMessage({ action: 'toMemberAction', data: { action: 0 } }, this.targetOrigin);
          return;
        }
        if (urlData.source === 'android' || urlData.source === 'ios') {
          // window.action.goToVipCenter(this.$store.state.app.vipInfo.level)
          this.$router.push({
            name: 'vipDetail',
          })
        }
      }
    },
    // 账户名 || token 不存在时，发送登录请求
    handleWebLogin() {
      const token = localStorage.getItem('token');
      const params = {
        account: this.$store.state.app.accountInfo ? this.$store.state.app.accountInfo.account : null,
        token: token || null,
      }
      window.parent.postMessage({ action: 'accountAction', data: params }, this.targetOrigin);
    },

    /* -------- 权限校验 start -------- */
    // 获取服务器时间戳
    handleGetTimestampJson() {
      accountToSign(this, () => {
        this.handleDraw(); // 抽奖
      });
    },
    /* -------- 权限校验 end -------- */
  },
  beforeDestroy() {
    window.clearInterval(this.timer);
    window.clearTimeout(this.timerout);
    window.clearTimeout(this.drawTimer);
    window.removeEventListener('message', this.handleReceiveMessage, false);
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.luckDrawDiv{
  font-size: .3rem;
  background: linear-gradient(-140deg, #3248CA 0%, #1B2B8C 100%);
  min-height: 100vh;

  &.webBg{
    background: transparent !important;

    .bg {
      background: none !important;
    }

    .luckListDiv {
      width: 100% !important;
      height: 7.1rem !important;
      padding: .4rem 0.40rem !important;

      .luckList {
        .title {
          font-size: 0.25rem !important;
        }

        .list {
          font-size: 0.23rem !important;
        }
      }

      .luckInfo {
        font-size: .2rem !important;
      }
    }

    .accountInfo {
      width: 100% !important;

      .top {
        .accountName {
          font-size: 0.25rem !important;
        }

        .tip {
          font-size: 0.22rem !important;
        }

        .vip {
          font-size: 0.25rem !important;
        }
      }

      .bottom {
        font-size: .22rem !important;
        margin-top: .25rem !important;

        .btn {
          min-width: 1.4rem !important;
          max-width: 1.4rem !important;
          height: .5rem !important;
          font-size: .2rem !important;
          border-radius: .1rem !important;
        }
      }
    }

    .rule {
      width: 100% !important;
      padding: 0!important;

      .title {
        text-align: left !important;
        font-size: .21rem !important;
      }
    }
  }

  // &.height960px{
  //   min-height: 1000px;
  // }

  .bg{
    // background-image: url('https://nds.340wan.com/static/img/luckDraw/bg.png');
    background-repeat: no-repeat;
    background-size: contain;
    background-position: 0 1.7rem;
  }

  .imgDiv{
    padding-top: .38rem;
    text-align: center;

    img{
      width: 5.7rem;
    }
  }

  .titleDiv{
    padding: .1rem 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: .04rem;

    img{
      width: 4rem;
    }
  }

  .scroll{
    width: 5.2rem;
    margin: auto;
    text-align: center;
    height: .5rem;
    overflow: hidden;
    background-image: linear-gradient(-90deg, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.13) 49%, rgba(0,0,0,0) 100%);
    border-radius: 1rem;
    font-size: .24rem;
    color: #F6C85C;
    letter-spacing: 0;

    .item{
      display: flex;
      align-items: center;
      justify-content: center;
      padding: .08rem 0px;
      font-size: .24rem;

      .padding8{
        padding: 0px .08rem;
      }

      .vip{
        font-size: .26rem;
        opacity: .6;
        color: #FFF;
        margin-right: .1rem;
      }

      .trade{
        color: #b7b7b7;
      }

      .isVip{
        color: #F6C85C !important;
        opacity: 1;
      }
    }
  }

  .luckListDiv{
    background: url('https://nds.340wan.com/static/img/luckDraw/list.png') no-repeat;
    background-size: cover;
    width: 6.71rem;
    margin: auto;
    height: 7.31rem;
    padding: .35rem .35rem;
    margin-top: .2rem;
    box-sizing: border-box;

    .luckList{
      background: #FFF;
      border-radius: .1rem;
      overflow: hidden;
      height: 5.15rem;

      .record{
        font-size: .27rem;
        text-align: center;

        .recordList{
          cursor: pointer;
          font-size: .21rem;
          color: #F5A623;
        }
      }

      &>.list{
        border: 1px solid transparent;
        border-bottom: 1px solid $color-e3e3e3;
        font-size: .27rem;

        &.thisNum{
          border: 1px solid #F6C85C !important;
          box-shadow: 0 0 .1rem rgba(169,105,0,0.43) inset;
        }

        &.lastChild{
          border-bottom: 0px solid #000 !important;
        }
      }

      .title{
        color: $color-this;
        background: #E9F2FF;
        height: .72rem !important;

        &>span{
          height: .72rem !important;
        }
      }

      .title,
      .list{
        display: flex;
        align-items: center;
        height: .67rem;

        &:last-child{
          height: .9rem;

          &>span{
            height: .9rem;
          }
        }

        &>span{
          flex: 1;
          height: .63rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-right: 1px solid $color-e3e3e3;

          &:last-child{
            border-right: 0px solid $color-e3e3e3;
          }
        }
      }
    }

    .luckInfo{
      font-size: .24rem;
      text-align: center;
      padding: .17rem 0px;
      color: #FFF;

      &.hidden{
        visibility: hidden;
      }
    }

    .luckDiv{
      width: 4.63rem;
      margin: auto;
      font-size: .24rem;

      .luckBtn{
        font-size: .27rem;
        background: #F3ED39;
        height: .83rem;
        border-radius: .1rem;
        color: #23309F;
        display: flex;
        align-items: center;
        justify-content: center;

        &:first-child{
          cursor: pointer
        }

        &.nonBtn{
          background: #ABB6E1;
          color: #FFF;
        }
      }
    }
  }

  .accountInfo{
    width: 6.56rem;
    height: 2.08rem;
    margin: auto;
    box-shadow: 0px 0px .2rem rgba(255, 255, 255, .2) inset;
    margin-top: .15rem;
    border-radius: .1rem;
    padding: .15rem .32rem;
    box-sizing: border-box;

    .top{
      display: flex;
      align-items: center;
      color: #F6C85C;
      height: .9rem;
      border-bottom: 1px dashed rgba(255, 255, 255, .46);

      &.noVipTop{
        color: #fff;
      }

      &>span:last-child{
        flex: 2;
        text-align: right;
      }

      .vip{
        font-size: .33rem;
        opacity: .6;
        color: #FFF;
        margin-right: .1rem;

        &.isVip{
          color: #F6C85C !important;
          opacity: 1;
        }
      }

      .accountName{
        font-size: .32rem;
      }

      .tip{
        font-size: .24rem;
      }
    }

    .bottom{
      margin-top: .1rem;
      color: #F6C85C;
      font-size: .24rem;

      &>div{
        display: flex;
        align-items: center;
        justify-content: space-between;

        &>span:last-child{
          flex: 1;
          float: right;
        }

        .btn{
          display: flex;
          align-items: center;
          justify-content: center;
          height: .66rem;
          background: #F3ED39;
          border-radius: .15rem;
          min-width: 1.8rem;
          max-width: 1.8rem;
          font-size: .24rem;
          color: #23309F;
          cursor: pointer;
        }
      }
    }
  }

  .rule{
    color: #fff;
    width: 6.56rem;
    margin: auto;
    margin-top: .33rem;
    text-align: center;
    font-size: .32rem;
    padding: 0px .32rem;
    box-sizing: border-box;

    .ruleList{
      margin-top: .2rem;
      font-size: .21rem;
      text-align: left;
      padding-bottom: .3rem;

      .ruleItem{
        margin-top: .08rem;
      }
    }
  }
}
.popup{
  background: transparent;
}
</style>
