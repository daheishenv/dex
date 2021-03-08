<template>
  <div class="tradeLeft">
    <!-- 买入卖出 -->
    <div class="typeBtn">
      <!-- 买入 -->
      <span class="buy btn" @click="handleSellOrBuy('buy')"
        :class="{'active': activeType === 'buy'}">{{ $t('public.buy') }}</span>

      <!-- 卖出 -->
      <span class="sell btn"
        :class="{'activeSell': activeType === 'sell'}"
        @click="handleSellOrBuy('sell')">{{ $t('public.sell') }}</span>
    </div>

    <!-- 限价 / 市价 -->
    <div class="priceType">
      <!-- select - 买入 / 卖出 -->
      <div class="selectDiv"
        :class="{'mb60': $store.state.app.trad.baseChain === $store.state.app.trad.valuationChain}"
        @click.stop="select = !select">
        <span class="borderTop"></span>
        <div class="select">
          <span v-if="priceType === '0'">{{ $t('quotation.limit') }}</span>
          <span v-if="priceType === '1'">{{ $t('quotation.market') }}</span>
        </div>
        <!-- <select class="select" v-model="priceType">
          <option value="0">{{ $t('quotation.limit') }}</option>
          <option value="1">{{ $t('quotation.market') }}</option>
        </select> -->
        <!-- 深度选择框 start -->
        <div class="selectMenu" v-if="select">
          <div class="selectIn color-333">
            <div @click="priceType = '0'">{{ $t('quotation.limit') }}</div>
            <div @click="priceType = '1'">{{ $t('quotation.market') }}</div>
          </div>
        </div>
        <!-- 深度选择框 end -->
      </div>

      <!-- 价格 & 数量 & range -->
      <!-- 限价交易 -->
      <div class="priceDiv mb30"
        :class="{'mb60': $store.state.app.trad.baseChain === $store.state.app.trad.valuationChain}"
        v-if="priceType === '0'">
        <span class="tool item" @click="handleDecrease">
          <i class="color-red" style="font-size: .27rem;">—</i>
        </span>
        <span class="input item">
          <input ref="priceInput" type="number" class="inputStyle" :class="{'ani': ani}"
            v-model="thisPrice" @blur="handleThisPriceBlur">
        </span>
        <span class="tool item" @click="handleAdd">
          <i class="iconfont icon-huaban26 color-green" style="font-size: .27rem;"></i>
        </span>
      </div>
      <!-- 市价交易 -->
      <div class="priceDiv mb30"
        :class="{'mb60': $store.state.app.trad.baseChain === $store.state.app.trad.valuationChain}"
        v-if="priceType === '1'">
        <input type="number" class="input item marketInput" disabled :placeholder="$t('quotation.tip')">
      </div>

      <!-- 限价输入数量 -->
      <div class="numberDiv" v-if="priceType === '0'">
        <div class="inputDiv">
          <input type="number" ref="num" class="input numInput" :class="{'iptBorder': flag, 'ani': ani}"
            v-model="num" @blur="handleNumBlur" @focus="handleFocus">
          <div @click="handleClear">
            <span class="tip" :class="{'hide': numFocus}"
              @click.stop="handleNoAction">{{ symbol1 }}</span>
            <span class="tip iconfont icon-huaban17 clear" :class="{'hide': !numFocus}"></span>
          </div>
          <!-- <span class="tip" v-if="!numFocus">{{ symbol1 }}</span>
          <span class="tip" v-if="numFocus"><span class="iconfont icon-huaban17 clear" @click="handleClear"></span></span> -->
        </div>
        <div class="about">
          <span class="iconfont icon-huaban31 question" :class="{'hidden': activeType !== 'buy'}"
            @click="showAmountTip = true"></span>
          <!-- <span class="color-red fl out" :class="{'hidden': !flag}">≥{{minSellEos}} {{symbol2}}</span> -->
          <span class="aboutNum">≈{{ toFixed(aboutPrice, $store.state.app.trad.valuationCoinDecimal) }}{{ symbol2 }}</span>
        </div>
      </div>

      <!-- 市价交易输入转账金额 -->
      <div class="numberDiv" v-if="priceType === '1'">
        <div class="inputDiv">
          <input type="number" ref="price" class="input" :class="{'iptBorder': flag}"
            v-model="price" @blur="handlePriceBlur" @focus="handleMarketFocus">
          <div @click="handleClear">
            <span class="tip" :class="{'hide': priceFocus}" @click.stop="handleNoAction">
              <span v-if="activeType === 'buy'">{{ symbol2 }}</span>
              <span v-if="activeType === 'sell'">{{ symbol1 }}</span>
            </span>
            <span class="tip iconfont icon-huaban17 clear" :class="{'hide': !priceFocus}"></span>
          </div>
          <!-- <span class="tip" v-if="activeType === 'buy' && !priceFocus">{{ symbol2 }}</span>
          <span class="tip" v-if="activeType === 'sell' && !priceFocus">{{ symbol1 }}</span>
          <span class="tip" v-if="priceFocus"><span class="iconfont icon-huaban17 clear" @click="handleClear"></span></span> -->
        </div>
        <div class="about" :class="{'hidden': !flag}">
          <span class="color-red fl" v-if="activeType === 'buy'">>{{minSellEos}} {{symbol2}}</span>
          <span class="color-red fl" v-if="activeType === 'sell'">>{{ sellCount }} {{symbol1}}</span>
        </div>
      </div>

      <div class="range" :class="{'sellRange': activeType === 'sell',
        'mt30': $store.state.app.trad.baseChain === $store.state.app.trad.valuationChain}"
        @touchend="handleTouchEnd"
        @touchstart="handleTouchStart">
        <div class="desc">
          <span>
            <span class="before" @click="handleRangeSet(0)" :class="{'border-green': rangeValue >= 0}"></span>
          </span>
          <span>
            <span class="before" @click="handleRangeSet(25)" :class="{'border-green': rangeValue >= 25}"></span>
          </span>
          <span>
            <span class="before" @click="handleRangeSet(50)" :class="{'border-green': rangeValue >= 50}"></span>
          </span>
          <span>
            <span class="before" @click="handleRangeSet(75)" :class="{'border-green': rangeValue >= 75}"></span>
            <span class="last" @click.stop="handleRangeSet(100)" :class="{'border-green': rangeValue >= 100}"></span>
          </span>
        </div>
        <mt-range v-model="rangeValue" :min="0" :max="100" :step="1" :bar-height="5">
        </mt-range>
        <div class="ableDiv">
          <span class="able" v-if="activeType === 'sell'">{{ $t('quotation.abled') }}{{ symbol1}}：{{ toFixed(balanceSymbol1, precision.coin) }}</span>
          <span class="able" v-if="activeType === 'buy'">
            {{ $t('quotation.abled') }}{{ symbol2 }}：{{ toFixed(balanceSymbol2, $store.state.app.trad.valuationCoinDecimal) }}
          </span>
          <span class="precents">{{rangeValue}}%</span>
        </div>
      </div>

      <!-- 接收账户 start -->
      <div class="receiveAccount"
        v-if="$store.state.app.trad.baseChain !== $store.state.app.trad.valuationChain">
        <!-- 买入 - 账户输入框 - 特殊处理 -->
        <input v-if="activeType === 'buy'"
          v-model="receiver" :class="{'errorInput': receiverError}"
          :placeholder="`${$t('trade.fillInAccount', {account: $store.state.app.trad.baseChain.toUpperCase()})}`" />

        <!-- 卖出 - 账户输入框 -->
        <input v-if="activeType === 'sell'" v-model="receiver" :class="{'errorInput': receiverError}"
          :placeholder="`${$t('trade.fillInAccount', {account: $store.state.app.trad.valuationChain.toUpperCase()})}`" />
        <i class="iconfont icon-huaban212" @click="handleCheckAddress"></i>
        <span class="error" v-if="receiverError === 1">{{ $t('trade.receiverErrorTip1') }}</span>
        <span class="error" v-if="receiverError === 2">{{ $t('trade.receiverErrorTip2') }}</span>
      </div>
      <!-- 接收账户 end -->
      <!-- 免CPU -->
      <div v-if="showFreeCpu && $store.state.whiteConfig.isFreeCpuWhite" class="special freeCpuDiv">
        <div @click="handleUseFreeCpu" class="flexDiv">
          <div class="freeCpuDiv">
            <i class="freeCpu" v-if="!useFreeCpu"></i>
            <i class="iconfont freeCpuIcon icon-huaban90" v-else ></i>
          </div>
          <div class="freeCpuTip">
            <div>
              <span>{{ $t('trade.freeCpu') }}</span><span v-if="$store.state.app.language !== 'en'"
                >({{ $t('trade.perDayCount', {num: $store.state.app.vipInfo.remainFreeOrderCount || 0}) }})</span>
              <span class="iconfont icon-xinxi spacialTip" @click.stop="useFreeCpuTip = true"></span>
            </div>
            <div v-if="$store.state.app.language === 'en'">
              ({{ $t('trade.perDayCount', {num: $store.state.app.vipInfo.remainFreeOrderCount || 0}) }})</div>
          </div>
        </div>
      </div>

      <div class="btnDivOut">
        <div class="btnList">
          <Loading v-if="loading"/>
          <!-- btn - 正常交易 -->
          <div class="btnDiv m30" v-if="newStatusInfo.status === 0"
            :class="{'m40': $store.state.app.trad.baseChain === $store.state.app.trad.valuationChain}">
            <button class="btn buy"
              :class="{'btnFlex': $store.state.app.accountInfo && $store.state.app.accountInfo.chain !== $store.state.app.trad.valuationChain}"
              v-if="activeType === 'buy'" @click="handleCheckServerStop">{{ $t('public.buy') }}</button>
            <button class="btn sell"
              :class="{'btnFlex': $store.state.app.accountInfo && $store.state.app.accountInfo.chain !== $store.state.app.trad.baseChain}"
              v-if="activeType === 'sell'" @click="handleCheckServerStop">{{ $t('public.sell') }}</button>
          </div>
          <!-- btn - 即将开放: 买入显示倒计时，卖出正常 -->
          <div class="btnDiv m30" v-if="newStatusInfo.status === 5"
            :class="{'m40': $store.state.app.trad.baseChain === $store.state.app.trad.valuationChain}">
            <button class="btn buy"
              :class="{'btnFlex': $store.state.app.accountInfo && $store.state.app.accountInfo.chain !== $store.state.app.trad.valuationChain}"
              v-if="activeType === 'buy'" @click="handleGround">{{ $t('trade.openSoon') }}</button>
            <button class="btn sell"
              :class="{'btnFlex': $store.state.app.accountInfo && $store.state.app.accountInfo.chain !== $store.state.app.trad.baseChain}"
              v-if="activeType === 'sell'" @click="handleCheckServerStop">{{ $t('public.sell') }}</button>
          </div>
          <!-- btn -->
          <div class="btnDiv m30" v-if="newStatusInfo.status !== 0 && newStatusInfo.status !== 5"
            :class="{'m40': $store.state.app.trad.baseChain === $store.state.app.trad.valuationChain}">
            <button class="btn btnFlex" v-if="newStatusInfo.status === 1" @click="stop = true">
              <span class="iconfont icon-huaban32 warn"></span>
              <span>{{ $t('quotation.stop')}}</span>
            </button>
            <button class="btn btnFlex" v-if="newStatusInfo.status === 2" @click="down = true">
              <span class="iconfont icon-huaban32 warn"></span>
              <span>{{ $t('quotation.down')}}</span>
            </button>
            <button class="btn btnFlex" v-if="newStatusInfo.status === 3" @click="oldDown = true">
              <span class="iconfont icon-huaban32 warn"></span>
              <span>{{ $t('quotation.oldDown') }}</span>
            </button>
            <!-- <button class="btn btnFlex" v-if="newStatusInfo.status === 4">
              <span class="iconfont icon-huaban32 warn"></span>
              <span>即将上架</span>
            </button> -->
          </div>
        </div>
        <div v-if="$store.state.app.accountInfo && $store.state.app.accountInfo.chain === 'eos' && !$embed"><vip-tip /></div>
      </div>

      <!-- MARF 特别提示 -->
      <div class="special" v-if="symbol1 === 'MARF'" @click="showSpecial = true">
        <span class="iconfont icon-huaban31 specialIcon"></span>
        <span>{{activeType === 'sell' ?
          $t('quotation.sellRule', {coin: symbol1}) : $t('quotation.buyRule', {coin: symbol1})}}</span>
      </div>
      <!-- SOV 特别提示 -->
      <div class="special" v-if="symbol1 === 'SOV' && activeType === 'sell'" @click="showSpecial = true">
        <span class="iconfont icon-huaban31 specialIcon"></span>
        <span>{{$t('quotation.iqTipTitle')}}</span>
      </div>
      <!-- Lucky 特别提示 -->
      <div class="special" v-if="$store.state.app.trad.riskStatus !== 1">
        <div v-if="symbol1 === 'LUCKY'" @click="showSpecial = true">
          <span class="iconfont icon-huaban31 specialIcon"></span>
          <span>{{ $t('quotation.luckyTip') }}</span>
        </div>
      </div>
      <!-- 风险提示 -->
      <div class="special warm" v-if="$store.state.app.trad.riskStatus === 1">
        <div @click="warmTip = true">
          <span class="iconfont icon-huaban32 warmIcon"></span>
          <span>{{ $t('quotation.warnTitle') }}</span>
        </div>
      </div>
    </div>

    <!-- 特殊币种提示 - MARF -->
    <mt-popup
      v-if="symbol1 === 'MARF'"
      v-model="showSpecial"
      class="specialTip"
      popup-transition="popup-fade">
      <special-tip-marf
      v-if="showSpecial && symbol1 === 'MARF'"
      :way="activeType"
      :money="'1%'"
      :coin="'MARF'"
      @listenBack="handleBack"/>
    </mt-popup>

    <!-- 特殊币种提示 - SOV -->
    <mt-popup
      v-if="symbol1 === 'SOV'"
      v-model="showSpecial"
      class="specialTip"
      popup-transition="popup-fade">
      <special-tip v-if="showSpecial && symbol1 === 'SOV'" @listenBack="handleBack"/>
    </mt-popup>
    <!-- 特殊币种提示 - LUCKY -->
    <mt-popup
      v-if="symbol1 === 'LUCKY'"
      v-model="showSpecial"
      class="specialTip"
      popup-transition="popup-fade">
      <special-tip-lucky v-if="showSpecial && symbol1 === 'LUCKY'" @listenBack="handleBack"/>
    </mt-popup>

    <!-- 暂停交易 -->
    <mt-popup
      v-model="stop"
      class="specialTip"
      popup-transition="popup-fade">
      <stop-tip :statusInfo="newStatusInfo" v-if="stop" @listenClose="handleClose"/>
    </mt-popup>

    <!-- 停止交易 -->
    <mt-popup
      v-model="down"
      class="specialTip"
      popup-transition="popup-fade">
      <down-tip :statusInfo="newStatusInfo" v-if="down" @listenClose="handleClose"/>
    </mt-popup>

    <!-- 已下架 -->
    <mt-popup
      v-model="oldDown"
      class="specialTip"
      popup-transition="popup-fade">
      <old-down-tip :statusInfo="newStatusInfo" v-if="oldDown" @listenClose="handleClose"/>
    </mt-popup>

    <!-- 服务维护，停止交易 -->
    <mt-popup
      v-model="serverStop"
      class="specialTip"
      popup-transition="popup-fade">
      <server-stop v-if="serverStop" @listenClose="handleClose"/>
    </mt-popup>

    <!-- 使用协议 -->
    <mt-popup
      v-model="accountAgree"
      class="specialTip"
      popup-transition="popup-fade">
      <account-agree v-if="accountAgree" @listenClose="handleClose"/>
    </mt-popup>

    <!-- 风险提示 -->
    <mt-popup
      v-model="warmTip"
      class="specialTip"
      popup-transition="popup-fade">
      <warn-tip v-if="warmTip" @listenClose="handleClose"/>
    </mt-popup>

    <!-- 切换账户提示 -->
    <mt-popup
      v-model="changeAccountTip"
      class="specialTip"
      popup-transition="popup-fade">
      <change-account-tip :changeChain="changeChain" v-if="changeAccountTip" @listenClose="handleClose"/>
    </mt-popup>

    <!-- 确认跨链账户提示 -->
    <mt-popup
      v-model="receiverTip"
      class="specialTip"
      popup-transition="popup-fade">
      <account-sure-tip :activeType="activeType" :receiver="receiver" v-if="receiverTip" @listenSureTrade="handleSureTrade"/>
    </mt-popup>

    <!-- 即将上架倒计时 -->
    <mt-popup
      v-model="showCountDown"
      class="specialTip"
      popup-transition="popup-fade">
      <SymbolCountDown v-if="showCountDown" :time="time" @listenClose="handleClose"/>
    </mt-popup>

    <!-- 订单超过200条 -->
    <mt-popup
      v-model="showTooMoreOrder"
      class="specialTip"
      popup-transition="popup-fade">
      <PopupTooMoreOrder v-if="showTooMoreOrder"
        :maxNum="maxNum"
        @listenClose="handleClose"/>
    </mt-popup>

    <!-- 卖出EOS提示 -->
    <mt-popup
      v-model="showSellTip"
      class="specialTip"
      popup-transition="popup-fade">
      <popup-sell-eos-tip v-if="showSellTip"
        @listenSure="handleSure"
        @listenClose="handleClose"/>
    </mt-popup>

    <!-- 数量不一致说明 -->
    <mt-popup
      v-model="showAmountTip"
      class="specialTip"
      popup-transition="popup-fade">
      <PopupAmountRule v-if="showAmountTip"
        :symbol2="symbol2.toUpperCase()"
        @listenClose="handleClose"/>
    </mt-popup>

    <!-- 免CPU说明 -->
    <mt-popup
      class="specialTip"
      v-model="useFreeCpuTip"
      popup-transition="popup-fade">
      <popup-common v-if="useFreeCpuTip" @listenClose="handleClose" class="defect">
        <template v-slot:default>
          <div class="color-333 mb25">{{ $t('public.tip') }}</div>
          <div class="popupContent">
            <div class="popupCenter" :class="{'en': $store.state.app.language === 'en'}">
              <!-- <span :class="`iconfont vip ${vipCoinClass()}`"></span> -->
              <span class="popupCount">{{ $t('trade.hasFreeCpuNum', {
                  num: vipData.freeOrderQuota
                }) }}</span>
            </div>
            <div class="popupTipDiv" :class="{'en': $store.state.app.language === 'en'}">{{ $t('trade.upToGetMore') }}</div>
          </div>
          <div class="popupBtn" @click="handleToVip">
            <span v-if="!$embed">{{ $t('vip.updataVip') }}</span>
            <span v-else>{{ $t('vip.updataVipEmbed') }}</span>
          </div>
        </template>
      </popup-common>
    </mt-popup>
    <!-- 聚合交易提示 -->
    <mt-popup
      v-model="tipSwapVisible"
      class="specialTip"
      popup-transition="popup-fade">
      <swap-tip v-if="tipSwapVisible && showOnce" @listenClose="handleClose"/>
    </mt-popup>
  </div>
</template>

<script>
import axios from 'axios';
import Bus from '@/utils/bus';
import StopTip from '@/views/market/components/StopTip';
import DownTip from '@/views/market/components/DownTip';
import AccountAgree from '@/views/market/components/AccountAgree';
import SwapTip from '@/views/market/components/SwapTip'; // 聚合交易对提示
import OldDownTip from '@/views/market/components/OldDownTip';
import ServerStop from '@/components/ServerStop';

import { toFixed, countdown, toLocalTime, dealSymbolSplit, getReqUrl, toBrowser } from '@/utils/public';
import { getOrderNum, accountToSign } from '@/utils/publicApi'
import RequestApi from '@/utils/requestApi';
import { Decimal } from 'decimal.js';
import { Popup, Range } from 'mint-ui';
import DApp from '@/utils/wallet';
import VipTip from '@/views/more/components/VipTip';
import PopupCommon from '@/components/PopupCommon';
import Loading from '@/components/Loading'
import SpecialTip from './SpecialTip';
import SpecialTipLucky from './SpecialTipLucky';
import SpecialTipMarf from './SpecialTipMarf';
import WarnTip from './WarnTip';
import ChangeAccountTip from '../popup/ChangeAccountTip';
import AccountSureTip from '../popup/AccountSureTip';
import SymbolCountDown from '../popup/SymbolCountDown';
import PopupTooMoreOrder from '../popup/PopupTooMoreOrder';
import PopupSellEosTip from '../popup/PopupSellEosTip';
import PopupAmountRule from '../popup/PopupAmountRule';

export default {
  data() {
    return {
      symbol: '', // 交易对
      symbol1: '',
      symbol2: '',
      memoSymbol: '', // eg: BLACK_EOS
      contract: '',

      activeType: 'buy', // 选择买卖类型
      priceType: '0', // 0:限价 / 1:市价
      rangeValue: 0, // range
      num: '', // num
      thisPrice: '0.0000', // 买入 / 卖出 价格
      aboutPrice: '0.0000', // 大约价格 - 限价交易时显示

      price: '0.0000', // 市价交易转账金额
      balanceSymbol1: '0.0000', // 交易对 ‘/’ 前币种余额 - 卖出时显示
      balanceSymbol2: '0.0000', // 交易对 ‘/’ 后币种余额 - 买入时显示

      // 定时器
      timer: null,

      // 焦点
      numFocus: false,
      priceFocus: false,
      rangeFocus: false,
      flag: false,
      minSellEos: '0.01',
      sellCount: '0.0100',

      showSpecial: false,
      stop: false, // 暂停交易
      down: false, // 停止交易
      oldDown: false, // 已下架
      serverStop: false, // 服务器维护

      warmTip: false, // 风险提示
      changeAccountTip: false, // 切换账户提示

      iqFirst: true, // 第一次iq全部卖出
      accountAgree: false, // 用户同意使用协议
      select: false,
      tipSwapVisible: false, // 聚合交易对提示
      showOnce: false, // 当前只出现一次聚合提示

      receiver: '', // 接受账户
      receiverError: 0, // 接收账户 0 - 没有错误 | 1 - 没有输入账户 | 2 - 账户不存在
      receiverTip: false, // 确认账户弹窗
      changeChain: '', // 提示切换至*链账户交易
      showCountDown: false, // 显示即将上架倒计时

      newStatusInfo: null,

      routeFirst: true,
      soonTimer: null, // 即将上架倒计时
      time: {
        days: 0,
        hours: '00',
        minutes: '00',
        seconds: '00',
        total: 3600000,
      },
      timerInput: null,
      ani: false,
      bookLength: { // 记录订单本长度
        ask: 0,
        bid: 0
      },
      showTooMoreOrder: false, // 显示委托数量已达上限
      maxNum: 200,
      showSellTip: false, // 显示卖出EOS的提示
      showAmountTip: false, // 显示 输入数量和订单数量不一致的解释
      transfering: false, // 转账中
      useFreeCpu: false, // 使用免费CPU
      useFreeCpuTip: false, // 显示免CPU弹窗
      loading: false,
    }
  },
  props: [
    'symbolInfo', // 交易对信息
    'precision', // 精度
    'newPrice', // 最新价
    'priceDefault', // 买 / 卖盘价格
    'statusInfo', // 上架信息
  ],
  computed: {
    showFreeCpu() {
      if (!this.$store.state.app.accountInfo || this.$store.state.app.accountInfo.chain !== 'eos') {
        return false;
      }
      if (this.activeType === 'buy' && this.$store.state.app.trad.valuationChain !== 'eos') {
        return false;
      }
      if (this.activeType === 'sell' && this.$store.state.app.trad.baseChain !== 'eos') {
        return false;
      }
      return true;
    }
  },
  components: {
    SpecialTip,
    StopTip,
    DownTip,
    OldDownTip,
    ServerStop,
    AccountAgree,
    SpecialTipLucky,
    SpecialTipMarf,
    WarnTip,
    VipTip, // vip
    ChangeAccountTip,
    AccountSureTip,
    SymbolCountDown,
    PopupTooMoreOrder,
    PopupSellEosTip,
    PopupAmountRule,
    PopupCommon,
    Loading,
    mtPopup: Popup,
    mtRange: Range,
    SwapTip, // 聚合交易对提示
  },
  watch: {
    // 买入卖出切换
    activeType(newVal) {
      this.loading = false;
      if (newVal === 'buy' && this.$store.state.app.trad.status === 5) {
        return;
      }
      this.handleRegInSameChain(); // 账户切换提示
    },
    // 市价交易数量
    price(newVal) {
      if (!this.priceFocus) {
        return;
      }
      if (Number(newVal) < 0) {
        if (this.activeType === 'buy') {
          this.price = toFixed(0, this.$store.state.app.trad.valuationCoinDecimal);
          return;
        }
        this.price = toFixed(0, this.precision.coin);
        return;
      }
      this.handleDealLimitRange()
    },
    // 数量不小于 0
    num(newVal, oldVal) {
      if (!this.numFocus) {
        return;
      }
      if (Number(newVal) < 0) {
        this.num = toFixed(0, this.precision.coin);
        return;
      }
      if (newVal >= 10000000000) {
        this.num = oldVal;
        return;
      }
      this.handleAboutPrice();
    },
    // 限价不小于 0
    thisPrice(newVal, oldVal) {
      if (Number(newVal) < 0) {
        this.thisPrice = toFixed(0, this.precision.price);
        return;
      }
      if (newVal >= 100000000) {
        this.thisPrice = oldVal;
        return;
      }
      this.handleAboutPrice();
    },
    // 精度
    precision(newVal) {
      // this.num = this.toFixed(this.num, newVal.coin);
      this.thisPrice = this.toFixed(this.thisPrice, newVal.price);
    },
    // 限价 / 市价切换
    priceType(newVal) {
      this.price = toFixed(0, this.$store.state.app.trad.valuationCoinDecimal);
      if (newVal === '1' && this.activeType === 'sell') {
        this.price = toFixed(0, this.precision.coin);
      }
      this.rangeValue = 0;
      this.num = toFixed(0, this.precision.coin);
      this.flag = false;
      this.aboutPrice = toFixed(0, this.$store.state.app.trad.valuationCoinDecimal);
      this.handlePriceDefault();
    },
    // 滑块滑动
    rangeValue() {
      // 是否滑动range
      if (!this.rangeFocus) {
        return;
      }
      // 限价
      if (this.priceType === '0') {
        /* ---------- 限价 - 买入 ------------ */
        if (this.activeType === 'buy') {
          if (Number(this.thisPrice) < 0) {
            return;
          }
          // 判断价格 - 为 0 时返回
          if (!Number(this.thisPrice)) {
            return;
          }
          // 计算数量
          let aboutPrice = Decimal.mul(this.rangeValue, this.balanceSymbol2);
          aboutPrice = Decimal.div(aboutPrice, 100).toString();
          this.aboutPrice = toFixed(aboutPrice, this.$store.state.app.trad.valuationCoinDecimal);
          const num = Decimal.div(aboutPrice, this.thisPrice).toString();
          this.num = toFixed(num, this.precision.coin);
          return;
        }
        /* ---------- 限价 - 卖出 ------------ */
        // 计算数量
        let num = Decimal.mul(this.rangeValue, this.balanceSymbol1);
        num = Decimal.div(num, 100).toString();
        this.num = toFixed(num, this.precision.coin);
        if (!Number(this.thisPrice)) {
          return;
        }
        const aboutPrice = Decimal.mul(this.thisPrice, this.num);
        this.aboutPrice = toFixed(aboutPrice, this.$store.state.app.trad.valuationCoinDecimal);
        return;
      }
      /* ---------- 市价 - 买入 ------------ */
      if (this.activeType === 'buy') {
        let price = Decimal.mul(this.rangeValue, this.balanceSymbol2);
        price = Decimal.div(price, 100).toString();
        this.price = toFixed(price, this.$store.state.app.trad.valuationCoinDecimal);
        return;
      }
      let price = Decimal.mul(this.rangeValue, this.balanceSymbol1);
      price = Decimal.div(price, 100).toString();
      this.price = toFixed(price, this.$store.state.app.trad.valuationCoinDecimal);
    },
    // 交易对改变
    '$store.state.app.trad': function listen(newVal) {
      this.showOnce = false;
      this.loading = false;
      this.handleSetMinSell();
      this.handleGetSymbol();
      this.handleShowWarm();
      this.aboutPrice = '0.0000'
      // this.handleRegInSameChain(); // 账户切换提示

      if (newVal.status === 5) {
        this.handleCountdown();
      }

      if (newVal.status === 5 && this.activeType === 'buy') {
        this.showCountDown = true;
      }
    },
    // 买卖盘价格改变
    priceDefault() {
      this.handlePriceDefault();
    },
    // 点击价格
    '$store.state.app.clickPrice': function listen(newVal) {
      if (this.priceType === '1') {
        return;
      }
      // 处理价格
      this.thisPrice = newVal.price;
      this.handleThisPriceBlur();

      // 处理数量
      // 限价 - 买入处理
      if (this.activeType === 'buy') {
        const allPrice = Decimal.mul(this.thisPrice, newVal.num);
        if (Number(this.balanceSymbol2) >= Number(allPrice)) { // 余额大于买入总价格 - 不处理
          this.num = newVal.num;
        } else { // 余额低于买入总价格 - 处理成最大买入量
          let dealNum = Decimal.div(this.balanceSymbol2, this.thisPrice);
          dealNum = toFixed(dealNum, this.precision.coin);
          this.num = dealNum;
        }
      }
      // 限价 - 卖出处理
      if (this.activeType === 'sell') {
        if (Number(this.balanceSymbol1) >= Number(newVal.num)) { // 余额大于买入总价格 - 不处理
          this.num = newVal.num;
        } else {
          this.num = this.balanceSymbol1;
        }
      }
      this.handleNumBlur();
      this.ani = true;
      window.clearTimeout(this.timerInput)
      this.timerInput = window.setTimeout(() => {
        this.ani = false;
      }, 200);
      // this.handleAnimal();
    },
    // 路由交易对改变
    '$route.params.symbol': function listen(newVal) {
      if (!newVal) {
        return
      }
      this.receiver = '';
      this.handleMouted();
    },
    // 估值大于0.01时，关闭警告提示
    aboutPrice(newVal) {
      if (newVal >= 0.01) {
        this.flag = false;
      }
    },
    statusInfo() {
      this.newStatusInfo = this.statusInfo;
    },
    '$store.state.app.bookLength': function bookLength(newVal) {
      this.bookLength = JSON.parse(newVal)
    },
    '$store.state.app.vipInfo': {
      handler(newVal) {
        if (Number(newVal.remainFreeOrderCount) <= 0) {
          this.useFreeCpu = false;
        }
      },
      immediate: true
    },
    '$store.state.app.accountMsg': function listen2(newVal, oldVal) {
      if (newVal.times !== oldVal.times) {
        this.loading = false;
      }
    },
  },
  created() {
    this.newStatusInfo = this.statusInfo;
  },
  mounted() {
    this.handleMouted();
    this.handleCheckedAccountBook();
    document.addEventListener('click', this.listenClick, false);
  },
  methods: {
    // 获取会员等级列表
    handleGetVipLvList() {
      if (this.$appName !== 'eosNewdex') return;
      this.$http.get('/levelRule/list').then((res) => {
        if (res.code !== 0) {
          return;
        }
        this.vipData = res.ruleList.find(item => item.level === this.$store.state.app.vipInfo.level);
      });
    },
    handleToVip() {
      if (this.$embed) {
        const channel = this.$fchannel;
        const lang = this.$store.state.app.language || 'en';
        const host = location.origin;
        const url = `${host}/vipDetail?channel=${channel}&chain=eos&language=${lang}`;
        toBrowser(url)
        return;
      }
      this.$router.push({
        name: 'vipDetail'
      })
    },
    // 获取等级样式
    vipCoinClass() {
      const index = this.$store.state.app.vipInfo.level;
      const coinList = [
        'icon-v vip0',
        'icon-huaban74',
        'icon-huaban73',
        'icon-huaban72',
        'icon-huaban68',
        'icon-huaban71',
        'icon-huaban69',
        'icon-huaban66',
        'icon-huaban70',
        'icon-huaban67',
        'icon-huaban65',
      ]
      return coinList[index];
    },
    handleUseFreeCpu() {
      if (Number(this.$store.state.app.vipInfo.remainFreeOrderCount) <= 0) {
        return;
      }
      this.useFreeCpu = !this.useFreeCpu
    },
    // 点击数量 & 价格动画
    handleAnimal() {
      this.$refs.priceInput.style.transform = 'scale(1.2)';
      this.$refs.priceInput.style[''] = 'scale(1.2)';
      this.$refs.num.style.transform = 'scale(1.2)';
      // this.$refs.priceInput.style.fontSize = '.6rem';
      // this.$refs.num.style.fontSize = '.6rem';
      let size = 0.5
      window.clearInterval(this.timerInput);
      this.timerInput = window.setInterval(() => {
        if (size <= 1) {
          this.$refs.priceInput.style.transform = 'scale(1)'
          this.$refs.num.style.transform = 'scale(1)'
          // this.$refs.priceInput.style.fontSize = '.32rem';
          // this.$refs.num.style.fontSize = '.32rem';
          clearInterval(this.timerInput)
          return;
        }
        size -= 0.01;
        this.$refs.priceInput.style.transform = `scale(${size})`
        this.$refs.num.style.transform = `scale(${size})`
        // this.$refs.priceInput.style.fontSize = `${size}rem`
        // this.$refs.num.style.fontSize = `${size}rem`
      }, 10);
    },
    // 即将上架倒计时
    handleCountdown() {
      try {
        clearInterval(this.soonTimer);
        this.time = countdown(toLocalTime(this.$store.state.app.trad.openTime))
        this.soonTimer = window.setInterval(() => {
          this.time = countdown(toLocalTime(this.$store.state.app.trad.openTime))
          if (this.time.total <= 0) {
            window.clearInterval(this.soonTimer);
            const data = {
              type: 'cd',
              status: 0
            }
            this.handleClose(data);
          }
        }, 1000);
      } catch (error) {
        setTimeout(() => {
          this.handleCountdown();
        }, 100);
      }
    },
    // 监听click事件 - 关闭限价/市价切换
    listenClick() {
      if (this.select) {
        this.select = !this.select;
      }
    },
    // 无操作
    handleNoAction() {
    },
    // 删除数量
    handleClear() {
      if (this.priceType === '0') {
        this.num = 0;
        this.handleNumBlur();
        this.$refs.num.focus();
        return;
      }
      this.price = 0;
      this.handlePriceBlur();
      this.$refs.price.focus();
    },
    handleSetMinSell() {
      if (this.$appName === 'tronNewdex') {
        this.minSellEos = '100';
        if (this.$store.state.app.trad.symbol2 === 'USDT') {
          this.minSellEos = '15';
        }
      }
    },
    // vue挂载时执行
    handleMouted() {
      this.handleSetMinSell();
      this.activeType = this.$route.params.activeType || 'buy';
      this.priceType = '0';
      this.balanceSymbol1 = toFixed(0, this.precision.coin); // 交易对 ‘/’ 前币种余额 - 卖出时显示
      this.balanceSymbol2 = toFixed(0, this.$store.state.app.trad.valuationCoinDecimal); // 交易对 ‘/’ 后币种余额 - 买入时显示

      this.iqFirst = localStorage.getItem('iqFirst') ? JSON.parse(localStorage.getItem('iqFirst')) : true;
      this.thisPrice = toFixed(this.thisPrice, this.precision.price);

      this.handlePriceDefault();
      this.symbol = this.$route.params.symbol.toLowerCase();
      const obj = dealSymbolSplit(this.symbol);
      this.contract = obj.contract;
      this.memoSymbol = `${obj.symbol1.toUpperCase()}_${obj.symbol2.toUpperCase()}`;
      this.symbol1 = obj.symbol1.toUpperCase();
      this.symbol2 = obj.symbol2.toUpperCase();

      this.handleGetSymbol();
      this.handleGetVipLvList();
    },
    // 风险提示
    handleShowWarm() {
      if (this.$store.state.app.trad.riskStatus === undefined) {
        setTimeout(() => {
          this.handleShowWarm();
        }, 200);
        return;
      }
      // 风险提示处理
      if (this.$store.state.app.trad.riskStatus === 1) { // 币种存在风险
        // 查询本地是否同意该风险
        const warnList = localStorage.getItem('warnList') ? JSON.parse(localStorage.getItem('warnList')) : [];
        let show = true;
        warnList.forEach((item) => {
          if (item.id === this.$store.state.app.trad.id && item.riskStatus === 0) {
            show = false;
          }
        });
        if (show) {
          this.warmTip = true;
        }
      }
    },
    // 限价数量获取焦点变成浮点型数字
    handleFocus() {
      this.numFocus = true;
      const tNum = parseFloat(this.num);
      if (tNum === 0) {
        this.num = '';
        return;
      }
      this.num = tNum;
    },
    // 市价获取焦点变成浮点型数字
    handleMarketFocus() {
      this.priceFocus = true;
      const tNum = parseFloat(this.price);
      if (tNum === 0) {
        this.price = '';
        return;
      }
      this.price = tNum;
    },
    // 关闭 暂停交易 / 停止交易
    handleClose(data) {
      this.stop = false;
      this.down = false;
      this.oldDown = false;
      this.serverStop = false;
      this.accountAgree = false;
      this.warmTip = false;
      this.changeAccountTip = false;
      this.showCountDown = false;
      this.showTooMoreOrder = false;
      this.showSellTip = false;
      this.showAmountTip = false;
      this.useFreeCpuTip = false;
      this.tipSwapVisible = false;

      if (data && data.type === 'cd' && data.status === 0) {
        this.$emit('listenUpdateSymbolInfo', false);
      }
    },
    // 确定交易
    handleSure() {
      this.showSellTip = false;
      // 验证账户存在
      this.handleGetAccount((error) => {
        if (error) {
          this.receiverError = 2;
          return;
        }
        this.receiverError = 0;
        if (!this.handleRegSureAccount()) {
          return;
        }
        this.handleToTrade();
      });
    },
    // 关闭提示
    handleBack(data) {
      this.showSpecial = data;
    },
    // 买卖盘价
    handlePriceDefault() {
      if (this.activeType === 'buy') {
        // this.thisPrice = this.priceDefault.buy;
        this.thisPrice = toFixed(this.priceDefault.buy, this.precision.price);
        return;
      }
      this.thisPrice = toFixed(this.priceDefault.sell, this.precision.price);
    },
    // 获取交易对余额
    async handleGetSymbol(next) {
      // 处理币种所属链与账户所属链不同情况
      if (next !== 'next' && this.$store.state.app.trad.valuationChain !== this.$store.state.app.accountInfo.chain) {
        // 计价币和账户不同链 - 不查询
        this.balanceSymbol2 = toFixed(0, this.$store.state.app.trad.valuationCoinDecimal);
        this.handleGetSymbol('next');
        return;
      }
      if (next === 'next' && this.$store.state.app.trad.baseChain !== this.$store.state.app.accountInfo.chain) {
        // 基础币种和账户不同链 - 不查询
        this.balanceSymbol1 = toFixed(0, this.precision.coin);
        window.clearTimeout(this.timer);
        if (this.$route.name === 'trade') {
          this.timer = window.setTimeout(() => {
            this.handleGetSymbol();
          }, 3000);
        }
        return;
      }
      // 正常获取余额
      const params = {
        account: this.$store.state.app.accountInfo.account,
        code: this.$store.state.app.trad.symbol2_code,
        coin: this.$store.state.app.trad.symbol2,
        decimal: this.$store.state.app.trad.valuationCoinDecimal
      }
      if (next === 'next' || this.activeType === 'sell') {
        params.code = this.$store.state.app.trad.symbol1_code;
        params.coin = this.$store.state.app.trad.symbol1;
        params.decimal = this.$store.state.app.trad.coinDecimal;
      }
      const obj = {
        code: params.code,
        symbol: params.coin,
        account: this.$store.state.app.accountInfo.account
      }
      if (this.$appName === 'tronNewdex') {
        obj.coin = obj.symbol;
        this.handlerGetTronBalance(params, next);
        return;
      }
      const balance = await DApp.getBalance(obj);
      if (balance || balance === 0) {
        if (next === 'next' || this.activeType === 'sell') {
          this.balanceSymbol1 = toFixed(parseFloat(balance), params.decimal);
        } else {
          this.balanceSymbol2 = toFixed(parseFloat(balance), this.$store.state.app.trad.valuationCoinDecimal);
        }
      } else {
        this.balance = toFixed(0, params.decimal);
      }
      window.clearTimeout(this.timer);
      this.timer = window.setTimeout(() => {
        this.handleGetSymbol(next);
      }, 3000);
      // DApp.getCurrencyBalance(params, (err, data) => {
      //   if (err) {
      //     // 没有该币种 - 显示0
      //     if (next === 'next') {
      //       this.balanceSymbol1 = toFixed(0, this.precision.coin);
      //       return
      //     }
      //     this.balanceSymbol2 = toFixed(0, this.$store.state.app.trad.valuationCoinDecimal); // EOS 默认4位小数
      //     this.handleGetSymbol('next')
      //     return;
      //   }
      //   // 判断是否是当前币种的余额
      //   const balanceArr = data.split(' ');
      //   if (balanceArr[1] !== this.symbol1 && balanceArr[1] !== this.symbol2) {
      //     return;
      //   }
      //   // 查询到余额
      //   if (next === 'next') {
      //     this.balanceSymbol1 = toFixed(parseFloat(data), this.precision.coin);
      //     window.clearTimeout(this.timer);
      //     if (this.$route.name === 'trade') {
      //       this.timer = window.setTimeout(() => {
      //         this.handleGetSymbol();
      //       }, 3000);
      //     }
      //     return
      //   }
      //   this.balanceSymbol2 = toFixed(parseFloat(data), this.$store.state.app.trad.valuationCoinDecimal);
      //   this.handleGetSymbol('next');
      // });
    },

    // Tron 余额获取
    handlerGetTronBalance(params, next) {
      DApp.getCurrencyBalance(params, (err, data) => {
        if (err) {
          // 没有该币种 - 显示0
          if (next === 'next') {
            this.balanceSymbol1 = toFixed(0, this.precision.coin);
            return
          }
          this.balanceSymbol2 = toFixed(0, this.$store.state.app.trad.valuationCoinDecimal); // EOS 默认4位小数
          this.handleGetSymbol('next')
          return;
        }
        // 判断是否是当前币种的余额
        const balanceArr = data.split(' ');
        if (balanceArr[1] !== this.symbol1 && balanceArr[1] !== this.symbol2) {
          return;
        }
        // 查询到余额
        if (next === 'next') {
          this.balanceSymbol1 = toFixed(parseFloat(data), this.precision.coin);
          window.clearTimeout(this.timer);
          if (this.$route.name === 'trade') {
            this.timer = window.setTimeout(() => {
              this.handleGetSymbol();
            }, 3000);
          }
          return
        }
        this.balanceSymbol2 = toFixed(parseFloat(data), this.$store.state.app.trad.valuationCoinDecimal);
        this.handleGetSymbol('next');
      });
    },
    // 手机滑动
    handleTouchStart() {
      this.rangeFocus = true;
    },
    handleTouchEnd() {
      this.rangeFocus = false;
    },
    // 截取小数
    toFixed(numb, p) {
      if (numb && p) {
        return toFixed(numb, p);
      }
      return toFixed(numb, 4);
    },
    // 买入 / 卖出
    handleSellOrBuy(type) {
      this.activeType = type;
      this.price = toFixed(0, this.$store.state.app.trad.valuationCoinDecimal);
      if (this.priceType === '1' && type === 'sell') {
        this.price = toFixed(0, this.precision.coin);
      }
      if (type === 'sell') {
        this.handleGetSymbol('next');
      } else {
        this.handleGetSymbol();
      }
      this.rangeValue = 0; // range
      // this.num = toFixed(0, this.precision.coin);
      this.num = '';
      this.aboutPrice = toFixed(0, this.$store.state.app.trad.valuationCoinDecimal);
      this.flag = false;
      this.receiver = '';
      this.handlePriceDefault();
      this.$router.push({query: {tab: this.activeType}})
    },
    // 减 decrease
    handleDecrease() {
      this.rangeFocus = false;

      let sub = Decimal.sub(this.thisPrice, 1 / (10 ** this.precision.price));
      if (sub < 0) {
        sub = 0;
      }
      sub = this.getFullNum(sub)
      this.thisPrice = toFixed(sub, this.precision.price);

      this.handleAboutPrice();
    },
    // 加 add
    handleAdd() {
      this.rangeFocus = false;

      let add = parseFloat(Decimal.add(this.thisPrice, 1 / (10 ** this.precision.price)));
      add = this.getFullNum(add)
      this.thisPrice = toFixed(add, this.precision.price);

      this.handleAboutPrice();
    },
    // 科学计数法转数值 - 处理 1e-7 这类精度问题
    getFullNum(num) {
      // 处理非数字
      if (isNaN(num)) {
        return num;
      }
      // 处理不需要转换的数字
      const str = String(num);
      if (!/e/i.test(str)) {
        return num;
      }
      return (num).toFixed(18).replace(/\.?0+$/, '');
    },
    // 滑块点击
    handleRangeSet(num) {
      this.rangeFocus = true;
      this.rangeValue = num;
      setTimeout(() => {
        this.rangeFocus = false;
      }, 500);
    },
    // 数量框获取焦点
    // handleNumFocus() {
    //   this.numFocus = true;
    //   this.rangeFocus = false;
    // },
    // 数量框失去焦点
    handleNumBlur() {
      document.documentElement.scrollTop = 0;
      this.numFocus = false;
      this.rangeFocus = false;
      let num = 0;
      if (this.num) {
        num = this.num;
      }
      this.num = toFixed(Number(num), this.precision.coin);

      this.handleAboutPrice();
    },
    // 价格框失去焦点
    handleThisPriceBlur() {
      document.documentElement.scrollTop = 0;
      this.priceFocus = false;
      this.rangeFocus = false;
      let thisPrice = toFixed(this.thisPrice, this.precision.price);
      thisPrice = this.getFullNum(Number(thisPrice));
      this.thisPrice = toFixed(thisPrice, this.precision.price);

      this.handleAboutPrice();
    },
    // 计算大约价格 - thisPrice * num
    handleAboutPrice() {
      const aboutPrice = Decimal.mul(Number(this.thisPrice), Number(this.num)).toString();
      this.aboutPrice = toFixed(aboutPrice, this.$store.state.app.trad.valuationCoinDecimal);

      /* ******** 计算range - start ******** */
      if (this.activeType === 'sell') {
        if (!Number(this.thisPrice)) {
          this.rangeValue = 0;
          return;
        }
        if (!Number(this.num)) {
          this.rangeValue = 0;
          return;
        }
        const precent = Decimal.div(this.num, this.balanceSymbol1).toString();
        if (precent === 'Infinity') {
          this.rangeValue = 0;
          return;
        }
        if (precent > 1) {
          this.rangeValue = 100;
          return;
        }
        this.rangeValue = Number(this.toFixed(precent * 100, 2));
        return;
      }
      if (!Number(this.num) || !Number(this.thisPrice)) {
        this.rangeValue = 0;
        return;
      }
      const precent = Decimal.div(aboutPrice, this.balanceSymbol2).toString();
      if (precent === 'Infinity' || precent === 'NaN') {
        this.rangeValue = 0;
        return;
      }
      if (precent > 1) {
        this.rangeValue = 100;
        return;
      }
      this.rangeValue = Number(this.toFixed(precent * 100, 2));
      /* ******** 计算range - end ******** */
    },
    // 市价价格框失去焦点
    handlePriceBlur() {
      document.documentElement.scrollTop = 0;
      this.priceFocus = false;
      if (!this.price) {
        this.price = 0;
      }
      if (this.activeType === 'sell') {
        this.price = toFixed(Number(this.price), this.$store.state.app.trad.coinDecimal);
      } else {
        this.price = toFixed(Number(this.price), this.$store.state.app.trad.valuationCoinDecimal);
      }
      this.handleDealLimitRange()
    },
    handleDealLimitRange() {
      if (this.activeType === 'sell') {
        if (Number(this.price) <= 0) {
          this.rangeValue = 0;
          return;
        }
        const precent = Decimal.div(this.price, this.balanceSymbol1).toString();
        if (precent === 'Infinity') {
          this.rangeValue = 0;
          return;
        }
        if (precent > 1) {
          this.rangeValue = 100;
          return;
        }
        this.rangeValue = Number(this.toFixed(precent * 100, 2));
        return;
      }
      if (Number(this.price) <= 0) {
        this.rangeValue = 0;
        return;
      }
      const precent = Decimal.div(this.price, this.balanceSymbol2).toString();
      if (precent === 'Infinity' || precent === 'NaN') {
        this.rangeValue = 0;
        return;
      }
      if (precent > 1) {
        this.rangeValue = 100;
        return;
      }
      this.rangeValue = Number(this.toFixed(precent * 100, 2));
    },
    // 验证是否 > 0.0100 EOS
    handleReg() {
      if (this.priceType === '0') {
        const buyPrice = Decimal.mul(this.thisPrice, this.num).toString();
        if (buyPrice < Number(this.minSellEos)) {
          this.flag = true; // 提示文本不显示
          this.$toast({
            message: `${this.$t('trade.minTrade')} ${this.minSellEos} ${this.symbol2}`,
            position: 'center',
            duration: 2000,
          })
          return false;
        }
        this.flag = false; // 提示文本不显示
        return true;
      }
      if (this.activeType === 'buy') {
        if (this.price < Number(this.minSellEos)) {
          this.flag = true; // 提示文本不显示
          return false;
        }
        this.flag = false; // 提示文本不显示
        return true;
      }
      const sellPrice = this.price * this.newPrice;
      if (sellPrice < Number(this.minSellEos)) {
        const sellCount = Decimal.div(Number(this.minSellEos), this.newPrice).toString();
        this.sellCount = toFixed(sellCount, this.precision.coin);
        this.flag = true; // 提示文本不显示
        return false;
      }
      this.flag = false; // 提示文本不显示
      return true;
    },
    // 验证余额是否足够使用
    handleRegBanlance() {
      /* -------- 限价 - 买入 / 卖出 -------- */
      if (this.priceType === '0') {
        // 买入验证
        if (this.activeType === 'buy') {
          const buyPrice = Decimal.mul(this.thisPrice, this.num).toString();
          if (Number(buyPrice) > Number(this.balanceSymbol2)) {
            this.$toast(`${this.symbol2} ${this.$t('quotation.low')}`)
            return false;
          }
          return true;
        }
        // 卖出验证
        if (Number(this.num) > Number(this.balanceSymbol1)) {
          this.$toast(`${this.symbol1} ${this.$t('quotation.low')}`)
          return false;
        }
        return true;
      }
      /* -------- 市价 - 买入 / 卖出 -------- */
      // 市价买入验证
      if (this.activeType === 'buy') {
        if (Number(this.price) > Number(this.balanceSymbol2)) {
          this.$toast(`${this.symbol2} ${this.$t('quotation.low')}`)
          return false;
        }
        return true;
      }
      // 市价卖出验证
      if (Number(this.price) > Number(this.balanceSymbol1)) {
        this.$toast(`${this.symbol1} ${this.$t('quotation.low')}`)
        return false;
      }
      return true;
    },
    // 验证跨链交易账户是否有填写
    handleRegReceiver() {
      if (this.$store.state.app.trad.baseChain === this.$store.state.app.trad.valuationChain) {
        return true;
      }
      if (this.receiver && this.receiver.length <= 12) {
        return true;
      }
      if (this.receiver && this.receiver.length > 12) {
        this.receiverError = 2;
        return false;
      }
      this.receiverError = 1;
      return false;
    },
    // 验证账户与交易币种是否在同一个链
    handleRegInSameChain() {
      // 是否当前交易对
      const obj = dealSymbolSplit(this.$route.params.symbol);
      const trad = this.$store.state.app.trad;
      if (obj.symbol1.toUpperCase() === trad.symbol1 && obj.symbol2.toUpperCase() === trad.symbol2) {
        const accountChain = this.$store.state.app.accountInfo.chain;
        if (this.activeType === 'buy') { // 买入 - 账户所属链 === 计价币所属链
          this.changeChain = trad.valuationChain.toUpperCase();
          if (accountChain === trad.valuationChain) {
            return true;
          }
          this.changeAccountTip = true;
          return false;
        }
        // 卖出 - 账户所属链 === 基础币所属链
        this.changeChain = trad.baseChain.toUpperCase();
        if (accountChain === trad.baseChain) {
          return true;
        }
        if (this.$route.params.activeType === 'sell' && this.routeFirst) {
          this.routeFirst = false;
          this.changeAccountTip = false;
          return false;
        }
        this.changeAccountTip = true;
        return false;
      }
      return false;
    },
    // Meetone错误处理
    handleMeetOneErrDeal() {
      // 验证账户合约订单达到上限
      getOrderNum((err, res) => {
        if (err) {
          return;
        }
        // 可以下单 - 判断为meetone其他错误 - 弹出下单失败
        if (res.abled) {
          this.showTooMoreOrder = false;
          const channel = localStorage.getItem('channel')
          if (channel === 'meetone') {
            this.$toast(this.$t('quotation.dealError'));
          }
        } else { // 判断数量超限 - 记录最大数，弹出提示
          this.showTooMoreOrder = true;
          this.maxNum = res.maxNum;
        }
      })
    },
    // 买入
    async handleBuy() {
      /* -------- 买入 -------- */
      let params = {};
      const chain = this.$store.state.app.accountInfo.chain;
      if (this.priceType === '0') {
        // 限价 - 买入
        let buyPrice = Decimal.mul(this.thisPrice, this.num).toString();
        buyPrice = toFixed(buyPrice, this.$store.state.app.trad.valuationCoinDecimal);
        const memo = {
          type: 'buy-limit',
          symbol: this.symbol,
          price: this.thisPrice,
          channel: 'dapp',
          ref: encodeURI(this.$store.state.app.channel),
        }
        // 验证是否跨链交易
        if (this.$store.state.app.trad.baseChain !== this.$store.state.app.trad.valuationChain) {
          memo.receiver = this.receiver;
        }
        params = {
          code: this.$store.state.app.trad.symbol2_code,
          toAccount: this.$store.state.sys.toAccountList[chain],
          quantity: `${buyPrice} ${this.symbol2}`,
          memo: JSON.stringify(memo),

          // tp 需要更多的参数
          tokenName: this.symbol2.toUpperCase(),
          precision: this.$store.state.app.trad.valuationCoinDecimal,

          // tron合约需要的参数
          coinPrice: this.thisPrice,
          coinCount: this.num,
        }
      } else {
        // 市价 - 买入
        const buyPrice = toFixed(this.price, this.$store.state.app.trad.valuationCoinDecimal);
        const memo = {
          type: 'buy-market',
          symbol: this.symbol,
          price: '0.0000',
          channel: 'dapp',
          ref: encodeURI(this.$store.state.app.channel),
        }
        // 验证是否跨链交易
        if (this.$store.state.app.trad.baseChain !== this.$store.state.app.trad.valuationChain) {
          memo.receiver = this.receiver;
        }
        const newPrice = Number(this.newPrice) !== 0 ? Number(this.newPrice) : 0.000001;
        const coinCount = toFixed(Decimal.div(Number(buyPrice), newPrice).toString(), this.$store.state.app.trad.coinDecimal)
        params = {
          code: this.$store.state.app.trad.symbol2_code,
          toAccount: this.$store.state.sys.toAccountList[chain],
          quantity: `${buyPrice} ${this.symbol2}`,
          memo: JSON.stringify(memo),

          // tp 需要更多的参数
          tokenName: this.symbol2.toUpperCase(),
          precision: this.$store.state.app.trad.valuationCoinDecimal,

          // tron合约需要的参数
          coinPrice: newPrice,
          coinCount,
        }
      }
      // 处理欧洲 '小数点,' 问题
      let dealQuantity = params.quantity;
      dealQuantity = dealQuantity.replace(/,/g, '.');
      params.quantity = dealQuantity;
      params.status = 'buy';
      params.code1 = this.$store.state.app.trad.symbol1_code; // 基础币合约
      params.code2 = this.$store.state.app.trad.symbol2_code; // 计价币合约
      params.dexCode = this.$store.state.app.trad.dexContract; // 交易所合约
      // 判断是否合约下单 - 修改接收账户
      if (this.$store.state.app.trad.onChain === 1 && this.$appName === 'eosNewdex') {
        params.toAccount = this.$store.state.sys.toAccountList[`chain-${chain}`]
      }
      // 如果是聚合交易
      if (this.symbolInfo.aggConfigs) {
        params.toAccount = 'agg.newdex';
      }
      this.transfering = true;
      // 判断是否是免CPU下单
      params.useFreeCpu = this.useFreeCpu && this.showFreeCpu;
      const channelWallet = localStorage.getItem('channel') || '';
      if (channelWallet.toLowerCase() === 'mykey' || channelWallet.toLowerCase() === 'huobiwallet') {
        params.useFreeCpu = false;
      }
      // 转账
      const fromName = this.$store.state.app.accountInfo.account;
      const permission = this.$store.state.app.accountInfo.permissions;
      const transferParams = {
        useFreeCpu: params.useFreeCpu,
        params: {
          actions: [
            {
              account: params.code,
              name: 'transfer',
              authorization: [{
                actor: fromName, // 转账者
                permission,
              }],
              data: {
                from: fromName,
                to: params.toAccount,
                quantity: params.quantity,
                memo: params.memo
              }
            }
          ]
        }
      };

      if (this.$appName === 'tronNewdex') {
        this.handleTronBuy(params);
        return;
      }

      const result = await DApp.transactionApi(transferParams);
      this.transfering = false;
      this.loading = false;
      Bus.$emit('showLoading', false);
       // 错误信息
      if (result && result.code !== 0) {
        DApp.handleScatterErrorBack(result, (type, text) => {
          type === 'lang' ? this.$toast(this.$t(text)) : this.$toast(text);
        });
        return;
      }
      if (transferParams.useFreeCpu) { // 如果免CPU需要特殊处理结果
        if (result.code === 0) {
          this.handleUseFreeCpuPost(result.result);
        }
        return;
      }
      this.$toast(this.$t('quotation.dealSuccess'));
      this.handleGetSymbol();

      // DApp.transfer(params, (err, data) => {
      //   this.transfering = false;
      //   this.loading = false;
      //   if (err) {
      //     Bus.$emit('showLoading', false);
      //     if (err.code === 1) {
      //       this.handleMeetOneErrDeal();
      //       return;
      //     }
      //     if (err.code === 3080004) {
      //       this.$toast(this.$t('error.error3080004'));
      //       return
      //     }
      //     if (err.code === 3080002) {
      //       this.$toast(this.$t('error.error3080002'));
      //       return
      //     }
      //     if (err.code === 3080001) {
      //       this.$toast(this.$t('error.error3080001'));
      //       return
      //     }
      //     if (this.$appName === 'eosNewdex') {
      //       this.$toast(this.$t('quotation.dealError'));
      //     }
      //     return;
      //   }
      //   // 调用免CPU挂单
      //   if (params.useFreeCpu) {
      //     Bus.$emit('showLoading', false);
      //     this.handleUseFreeCpuPost(data);
      //     return
      //   }
      //   if (data) {
      //     Bus.$emit('showLoading', false);
      //     this.$toast(this.$t('quotation.dealSuccess'));
      //   }
      //   this.handleGetSymbol();
      // });
    },

    // Tron买入
    handleTronBuy(params) {
      DApp.transfer(params, (err, data) => {
        this.transfering = false;
        this.loading = false;
        if (err) {
          Bus.$emit('showLoading', false);
          if (err.code === 1) {
            this.handleMeetOneErrDeal();
            return;
          }
          if (err.code === 3080004) {
            this.$toast(this.$t('error.error3080004'));
            return
          }
          if (err.code === 3080002) {
            this.$toast(this.$t('error.error3080002'));
            return
          }
          if (err.code === 3080001) {
            this.$toast(this.$t('error.error3080001'));
            return
          }
          if (this.$appName === 'eosNewdex') {
            this.$toast(this.$t('quotation.dealError'));
          }
          return;
        }
        // 调用免CPU挂单
        if (params.useFreeCpu) {
          Bus.$emit('showLoading', false);
          this.handleUseFreeCpuPost(data);
          return
        }
        if (data) {
          Bus.$emit('showLoading', false);
          this.$toast(this.$t('quotation.dealSuccess'));
        }
        this.handleGetSymbol();
      });
    },

    // 卖出
    async handleSell() {
      /* -------- 卖出 -------- */
      let myCount;
      let getCount;
      let memo = {};
      const chain = this.$store.state.app.accountInfo.chain;
      if (this.priceType === '0') {
        // 限价 - 卖出
        myCount = toFixed(this.num, this.precision.coin);
        getCount = Decimal.mul(this.thisPrice, this.num).toString();
        getCount = toFixed(getCount, this.$store.state.app.trad.valuationCoinDecimal);
        memo = {
          type: 'sell-limit',
          symbol: this.symbol,
          price: this.thisPrice,
          channel: 'dapp',
          ref: encodeURI(this.$store.state.app.channel),
        }
      } else {
        // 市价 - 卖出
        myCount = toFixed(this.price, this.precision.coin);
        getCount = Decimal.mul(this.thisPrice, this.price).toString();
        getCount = toFixed(getCount, this.$store.state.app.trad.valuationCoinDecimal);
        memo = {
          type: 'sell-market',
          symbol: this.symbol,
          price: '0.0000',
          channel: 'dapp',
          ref: encodeURI(this.$store.state.app.channel),
        }
      }
      // 验证是否跨链交易
      if (this.$store.state.app.trad.baseChain !== this.$store.state.app.trad.valuationChain) {
        memo.receiver = this.receiver;
      }
      const params = {
        code: this.$store.state.app.trad.symbol1_code,
        toAccount: this.$store.state.sys.toAccountList[chain],
        quantity: `${myCount} ${this.symbol1}`,
        memo: JSON.stringify(memo),

        // tp 需要更多的参数
        tokenName: this.symbol1,
        precision: this.$store.state.app.trad.coinDecimal,

        // tron合约需要的参数
        coinPrice: this.thisPrice,
        coinCount: this.num,
        code2: this.$store.state.app.trad.symbol2_code, // 计价币合约
        code1: this.$store.state.app.trad.symbol1_code, // 基础币合约
        dexCode: this.$store.state.app.trad.dexContract, // 交易所合约
        getCount,
      }
      // 判断波产市价卖出
      if (this.priceType !== '0') {
        const newPrice = Number(this.newPrice) !== 0 ? Number(this.newPrice) : 0.000001;
        params.coinPrice = newPrice;
        params.coinCount = myCount;
      }
      // 处理欧洲 '小数点,' 问题
      let dealQuantity = params.quantity;
      dealQuantity = dealQuantity.replace(/,/g, '.');
      params.quantity = dealQuantity;
      params.status = 'sell';
      // 判断是否合约下单 - 修改接收账户
      if (this.$store.state.app.trad.onChain === 1 && this.$appName === 'eosNewdex') {
        params.toAccount = this.$store.state.sys.toAccountList[`chain-${chain}`]
      }
      // 如果是聚合交易
      if (this.symbolInfo.aggConfigs) {
        params.toAccount = 'agg.newdex';
      }
      this.transfering = true;
      // 判断是否是免CPU下单
      params.useFreeCpu = this.useFreeCpu && this.showFreeCpu;
      const channelWallet = localStorage.getItem('channel') || '';
      if (channelWallet.toLowerCase() === 'mykey' || channelWallet.toLowerCase() === 'huobiwallet') {
        params.useFreeCpu = false;
      }
      if (this.$appName === 'tronNewdex') {
        this.handleTronSell(params);
        return;
      }
      // 转账
      const fromName = this.$store.state.app.accountInfo.account;
      const permission = this.$store.state.app.accountInfo.permissions;
      const transferParams = {
        useFreeCpu: params.useFreeCpu,
        params: {
          actions: [
            {
              account: params.code,
              name: 'transfer',
              authorization: [{
                actor: fromName, // 转账者
                permission,
              }],
              data: {
                from: fromName,
                to: params.toAccount,
                quantity: params.quantity,
                memo: params.memo
              }
            }
          ]
        }
      };
      // console.log(transferParams);
      const result = await DApp.transactionApi(transferParams);
      this.transfering = false;
      this.loading = false;
      Bus.$emit('showLoading', false);
       // 错误信息
      if (result && result.code !== 0) {
        DApp.handleScatterErrorBack(result, (type, text) => {
          type === 'lang' ? this.$toast(this.$t(text)) : this.$toast(text);
        });
        return;
      }
      if (transferParams.useFreeCpu) { // 如果免CPU需要特殊处理结果
        if (result.code === 0) {
          this.handleUseFreeCpuPost(result.result);
        }
        return;
      }
      this.$toast(this.$t('quotation.dealSuccess'));
      this.handleGetSymbol('next');
      // 转账
      // DApp.transfer(params, (err, data) => {
      //   this.transfering = false;
      //   this.loading = false;
      //   if (err) {
      //     Bus.$emit('showLoading', false);
      //     // if (JSON.parse(err).code === '2010001') {
      //     //   this.$toast(this.$t('quotation.cancel'));
      //     //   return;
      //     // }
      //     if (err.code === 1) {
      //       this.handleMeetOneErrDeal();
      //       return;
      //     }
      //     if (err.code === 3080004) {
      //       this.$toast(this.$t('error.error3080004'));
      //       return
      //     }
      //     if (err.code === 3080002) {
      //       this.$toast(this.$t('error.error3080002'));
      //       return
      //     }
      //     if (err.code === 3080001) {
      //       this.$toast(this.$t('error.error3080001'));
      //       return
      //     }
      //     if (this.$appName === 'eosNewdex') {
      //       this.$toast(this.$t('quotation.dealError'));
      //     }
      //     return;
      //   }
      //   // 调用免CPU挂单
      //   if (params.useFreeCpu) {
      //     Bus.$emit('showLoading', false);
      //     this.handleUseFreeCpuPost(data);
      //     return
      //   }
      //   if (data) {
      //     Bus.$emit('showLoading', false);
      //     this.$toast(this.$t('quotation.dealSuccess'));
      //   }
      //   this.handleGetSymbol();
      // });
    },

    // tron 卖出
    handleTronSell(params) {
      DApp.transfer(params, (err, data) => {
        this.transfering = false;
        this.loading = false;
        if (err) {
          Bus.$emit('showLoading', false);
          // if (JSON.parse(err).code === '2010001') {
          //   this.$toast(this.$t('quotation.cancel'));
          //   return;
          // }
          if (err.code === 1) {
            this.handleMeetOneErrDeal();
            return;
          }
          if (err.code === 3080004) {
            this.$toast(this.$t('error.error3080004'));
            return
          }
          if (err.code === 3080002) {
            this.$toast(this.$t('error.error3080002'));
            return
          }
          if (err.code === 3080001) {
            this.$toast(this.$t('error.error3080001'));
            return
          }
          if (this.$appName === 'eosNewdex') {
            this.$toast(this.$t('quotation.dealError'));
          }
          return;
        }
        // 调用免CPU挂单
        if (params.useFreeCpu) {
          Bus.$emit('showLoading', false);
          this.handleUseFreeCpuPost(data);
          return
        }
        if (data) {
          Bus.$emit('showLoading', false);
          this.$toast(this.$t('quotation.dealSuccess'));
        }
        this.handleGetSymbol();
      });
    },
    // 提示确认账户验证
    handleRegSureAccount() {
      if (this.$store.state.app.trad.baseChain === this.$store.state.app.trad.valuationChain) {
        return true;
      }
      const warnList = localStorage.getItem('spanChainList') ? JSON.parse(localStorage.getItem('spanChainList')) : [];
      let has = false;
      warnList.forEach((item) => {
        if (item.id === this.$store.state.app.trad.id && item.noTip) {
          has = true;
        }
      });
      this.receiverTip = !has;
      return has;
    },
    // 即将上架倒计时
    handleGround() {
      // if (this.$store.state.app.accountInfo &&
      //   this.$store.state.app.accountInfo.chain !== this.$store.state.app.trad.valuationChain) {
      //   return;
      // }
      this.showCountDown = true;
    },
    // 服务器是否在维护 serverStatus: false - 暂停 | true - 正常
    handleCheckServerStop() {
      const tipSwap = localStorage.getItem('tipSwap');
      if (this.symbolInfo.aggConfigs && !Number(tipSwap) && !this.showOnce) {
        this.tipSwapVisible = true; // 聚合交易提示弹窗
        this.showOnce = true; // 仅第一次出现提示
        return;
      }
      // 合约调用中 - 拒绝再次调用
      // if (this.transfering) {
      //   return;
      // }
      // 切换账户提示
      if (!this.handleRegInSameChain()) {
        return;
      }
      // 风险提示处理
      if (this.$store.state.app.trad.riskStatus === 1) { // 币种存在风险
        // 查询本地是否同意该风险
        const warnList = localStorage.getItem('warnList') ? JSON.parse(localStorage.getItem('warnList')) : [];
        let show = true;
        warnList.forEach((item) => {
          if (item.id === this.$store.state.app.trad.id && item.riskStatus === 0) {
            show = false;
          }
        });
        if (show) {
          this.warmTip = true;
          return;
        }
      }
      // 账户同意协议验证
      // const accountAgree = sessionStorage.getItem('accountAgree') ? JSON.parse(sessionStorage.getItem('accountAgree')) : false;
      // if (!accountAgree) {
      //   this.accountAgree = true;
      //   return;
      // }
      // 最小交易额验证
      if (!this.handleReg()) {
        return;
      }
      // 余额验证
      if (!this.handleRegBanlance()) {
        return;
      }
      // 跨链接收账户验证
      if (!this.handleRegReceiver()) {
        return;
      }
      // 验证市价交易时 - 买卖盘是否有数量
      if (this.priceType === '1') {
        if (this.activeType === 'buy' && this.bookLength.ask === 0) {
          this.$toast(this.$t('trade.noTransion'))
          return;
        }
        if (this.activeType === 'sell' && this.bookLength.bid === 0) {
          this.$toast(this.$t('trade.noTransion'))
          return;
        }
      }
      // // 验证是否弹出稳定币卖出提示框
      // if (this.handleRegUsdSell()) {
      //   this.showSellTip = true;
      //   return
      // }
      this.loading = true;
      // 验证账户存在
      this.handleGetAccount((error) => {
        if (error) {
          this.loading = false;
          this.receiverError = 2;
          return;
        }
        this.receiverError = 0;
        if (!this.handleRegSureAccount()) {
          this.loading = false;
          return;
        }
        this.handleToTrade();
      });
    },
    // 验证是否弹出稳定币卖出提示框 - flase:不弹出 | true: 弹出
    handleRegUsdSell() {
      // 判断是否是卖出 - 不是卖出 - 不弹出
      if (this.activeType !== 'sell') {
        return false;
      }
      // 当前交易对是否是稳定比交易对
      if (this.contract === 'eosio.token' && this.symbol1.toLowerCase() === 'eos') {
        // 判断本地是否设置提示开关
        const routeSymbol = this.$route.params.symbol;
        const account = this.$store.state.app.accountInfo.account;
        const allTipSwitch = this.$store.state.sys.tipSwitch;
        const accountSwitch = allTipSwitch[account] || {};
        if (!accountSwitch[routeSymbol]) { // 没有查到配置 | 配置为false - 弹出提示
          return true;
        }
        // 有配置 - 不弹出提示
        return false;
      }
      // 不是eos/稳定币交易对 - 不弹出提示
      return false;
    },
    handleToTrade() {
      // this.$http.get('common/getCommonParam').then((res) => {
      RequestApi.commonParam((res) => {
        if (res.code !== 0) {
          this.loading = false;
          return;
        }
        if (!Number(res.exchangeStatus)) {
          this.serverStop = true;
          this.loading = false;
          return;
        }
        // 买入
        if (this.activeType === 'buy') {
          this.handleBuy();
          return;
        }
        // 卖出
        this.handleSell();
      });
    },
    // iq卖出收取手续费
    handleRegSellIq() {
      if (this.priceType === '0') {
        // 限价 - 卖出
        const charge = Decimal.mul(this.num, 0.001).toString();
        if (Decimal.add(this.num, charge) > Number(this.balanceSymbol1)) {
          const newCharge = Decimal.mul(this.balanceSymbol1, 0.001).toString(); // iq手续费
          const newNum = Decimal.sub(Number(this.balanceSymbol1), newCharge);
          this.num = toFixed(newNum, this.precision.coin);
          this.handleNumBlur();
          return false;
        }
        return true;
      }
      // 市价 - 卖出
      const charge = Decimal.mul(this.price, 0.001).toString();
      if (Decimal.add(this.price, charge) > Number(this.balanceSymbol1)) {
        const newCharge = Decimal.mul(this.balanceSymbol1, 0.001).toString(); // iq手续费
        const newNum = Decimal.sub(Number(this.balanceSymbol1), newCharge);
        this.price = toFixed(newNum, this.precision.coin);
        this.handlePriceBlur();
        return false;
      }
      return true;
    },
    // 确认交易
    handleSureTrade() {
      this.receiverTip = false;
      this.handleToTrade();
    },
    // 账户存在判断
    handleGetAccount(callback) {
      // 交易对所属链相同下，不进行验证
      if (this.$store.state.app.trad.baseChain === this.$store.state.app.trad.valuationChain) {
        callback(null)
        return;
      }
      // 交易对所属链不同，进行验证
      let chainNode;
      if (this.activeType === 'buy') {
        chainNode = `${this.$store.state.app.trad.baseChain}Node`;
      } else {
        chainNode = `${this.$store.state.app.trad.valuationChain}Node`;
      }
      const params = {
        account_name: this.receiver,
      }
      axios.post(`${this.$store.state.sys.nodeList[chainNode].httpEndpoint}/v1/chain/get_account`, JSON.stringify(params)).then((result) => {
        const res = result.data;
        if (res.account_name === this.receiver) {
          callback(null);
          return;
        }
        callback('error');
      }).catch(() => {
        callback('error');
      });
    },
    // 调用免CPU挂单
    handleUseFreeCpuPost(signedTx) {
      let url = `http://${getReqUrl('ip')}:${process.env.VUE_APP_PORT2}/cpu/pushTxWithoutCPU`;
      if (this.$evn !== 'test') {
        const host = location.origin;
        url = `${host}/cpu/pushTxWithoutCPU`;
      }
      axios.post(url, {
        signed: signedTx
      }, {
        headers: {
          accept: 'application/json, text/plain, */*',
        },
      }).then((res) => {
        if (res.data.code === 500) {
          this.$toast(res.data.message);
          return;
        }
        this.handleGetAccountInfo();
        if (res.data.code !== 200) {
          Bus.$emit('showLoading', false);
          const msg = JSON.parse(res.data.message);
          const err = msg.error;
          if (err.code === 3080004) {
            this.$toast(this.$t('error.error3080004'));
            return
          }
          if (err.code === 3080002) {
            this.$toast(this.$t('error.error3080002'));
            return
          }
          if (err.code === 3080001) {
            this.$toast(this.$t('error.error3080001'));
            return
          }
          if (err.code === 3050003) {
            if (err.details && err.details.length) {
              this.$toast(err.details[0].message);
              return
            }
            this.$toast(err.what);
            return
          }
          this.$toast(this.$t('quotation.dealError'));
          return;
        }
        this.$toast(this.$t('quotation.dealSuccess'));
        this.handleGetSymbol();
      }).catch((error) => {
        console.log(error); // eslint-disable-line
        DApp.handleScatterErrorBack(error, (type, text) => {
          type === 'lang' ? this.$toast(this.$t(text)) : this.$toast(text);
        });
        return;
      })
    },
    // 获取账户会员等级
    handleGetAccountInfo() {
      try {
        const params = {
          account: this.$store.state.app.accountInfo.account
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
          this.$store.dispatch('setVipInfo', res.accountInfo);
        })
      } catch (error) {
        setTimeout(() => {
          this.handleGetAccountInfo();
        }, 200);
      }
    },
    // 选择地址薄
    handleCheckAddress() {
      const token = localStorage.getItem('token');
      const chain = this.activeType === 'buy' ? this.$store.state.app.trad.baseChain : this.$store.state.app.trad.valuationChain;
      const rp = {
        name: 'addressBook',
        params: {
          type: 1,
          addressChain: chain.toLowerCase()
        },
        query: {
          backpath: this.$route.fullPath
        }
      }
      if (!token) {
        accountToSign(this, () => {
          this.$router.push(rp);
        });
        return;
      }
      this.$router.push(rp);
    },
    // 获取地址簿中的选中地址
    handleCheckedAccountBook() {
      if (this.$route.query && this.$route.query.tab) {
        this.activeType = this.$route.query.tab;
      } else {
        this.$router.push({ query: { tab: this.activeType } });
      }
      const sap = this.$store.state.app;
      if (sap && sap.accountBook && sap.accountBook.length > 0) {
        const item = sap.accountBook.find(v => v.checked);
        if (item) {
          item.checked = false;
          this.receiver = item.address; // 接受账户
          this.$store.dispatch('setAccountBook', sap.accountBook);
        }
      }
    }
  },
  beforeDestroy() {
    window.clearTimeout(this.timer);
    window.clearInterval(this.soonTimer);
    document.removeEventListener('click', this.listenClick, false)
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

input::-webkit-input-placeholder{
  color: $color-999;
}
.m30{
  margin: .2rem 0;
}
.m40{
  margin: .26rem 0 .2rem !important;
}
.mt30{
  margin-top: .3rem;
}
.mb30{
  margin-bottom: .3rem;
}
.mb60{
  margin-bottom: .6rem !important;
}
.m80{
  margin: .8rem 0;
}
.borderTop{
  border: .1rem solid transparent;
  border-top: .1rem solid $color-999;
  position: absolute;
  right: .36rem;
  top: 50%;
  transform: translate(0px, -30%);
}
.iptBorder{
  border-color: $color-red !important;
}
.out{
  position: absolute;
  left: 0px;
  &.hidden{
    visibility: hidden;
    display: none;
  }
}
.clear{
  font-size: .25rem;
}

.ani{
  transform: scale(1.2) !important;
}

.tradeLeft{
  position: relative;

  /deep/ html{
    border: 2px solid black;
  }

  // 买入卖出
  .typeBtn{
    display: flex;
    align-items: center;/*垂直居中*/

    .btn{
      flex: 1;
      box-sizing: border-box;
      text-align: center;
      height: .83rem;
      line-height: .83rem;
      font-size: .3rem;
      border: 1px solid $color-input;
      border-top-left-radius: .12rem;
      border-bottom-left-radius: .12rem;

      &:last-child{
        // margin-left: 0.1rem;
        border-top-left-radius: 0rem;
        border-bottom-left-radius: 0rem;
        border-top-right-radius: .12rem;
        border-bottom-right-radius: .12rem;
      }

      &.active{
        color: $color-green;
        border-color: $color-green;
      }
      &.activeSell{
        color: $color-red;
        border-color: $color-red;
      }
    }
  }

  // 限价 / 市价
  .priceType{
    font-size: .32rem;

    .selectDiv{
      margin-top: .3rem;
      margin-bottom: .3rem;
      position: relative;
    }

    .select{
      background: transparent;
      font-size: .32rem;
      border: 1px solid $color-input;
      // width: 100%;
      height: .83rem;
      line-height: .83rem;
      padding-left: .2rem;
      border-radius: .12rem;
    }

    // 价格
    .priceDiv{
      display: flex;

      .item{
        flex: 1;
        text-align: center;

        &.tool{
          // min-width: .8rem;
          // width: .8rem;
          // max-width: .8rem;
          height: .8rem;
          line-height: .8rem;
          border: 1px solid $color-input;
          border-top-left-radius: .12rem;
          border-bottom-left-radius: .12rem;

          &:last-child{
            border-top-left-radius: 0rem;
            border-bottom-left-radius: 0rem;
            border-top-right-radius: .12rem;
            border-bottom-right-radius: .12rem;
          }

          &:active{
            background: $active-white;
          }
        }

        &.input{
          font-size: .32rem;
          width: 2rem;
          flex: 3;
          border-top: 1px solid $color-input;
          border-bottom: 1px solid $color-input;
          border-radius: 0px;
          overflow: hidden;
          position: relative;
          // display: flex;

          .inputStyle{
            position: absolute;
            top: 50%;
            left: 0px;
            font-size: .32rem;
            width: 100%;
            text-align: center;
            background: transparent;
            transition: .3s all;
            transform: scale(1) translateY(-50%);

            &.ani{
              transform: scale(1.2) translateY(-50%) !important;
            }
          }
        }

        &.marketInput{
          height: .8rem;
          line-height: .8rem;
          font-size: .32rem;
          width: 2rem;
          flex: 3;
          border: 1px solid $color-input;
          border-radius: .12rem;
        }
      }
    }

    // 数量
    .numberDiv{
      position: relative;

      .inputDiv{
        display: flex;
        align-items: center;
        justify-content: space-between;
        border: 1px solid $color-input;
        border-radius: .12rem;
        padding-left: .2rem;
        box-sizing: border-box;
      }

      .input{
        height: .8rem;
        flex: 1;
        width: 100%;
        font-size: .32rem;
        background: transparent;
        z-index: 1;
        transition: .3s all;
        transform: scale(1);
        position: relative;
      }

      .tip{
        position: relative;
        height: .83rem;
        line-height: .83rem;
        margin-right: 0.2rem;
        color: $color-999;
        font-weight: 300;
        font-size: .25rem;
        z-index: 1;

        &.hide{
          visibility: hidden !important;
          position: absolute;
        }
      }

      .about{
        margin-top: .08rem;
        font-size: .25rem;
        text-align: right;
        line-height: .36rem;
        height: .36rem;
        font-weight: 300;
        color: $color-999;
        display: flex;
        align-items: center;
        justify-content: space-between;

        &.hidden{
          visibility: hidden;
        }

        .question{
          font-size: .27rem;
          margin-right: .1rem;
          margin-left: .04rem;
        }

        .aboutNum{
          display: inline-block;
          position: relative;
          max-width: 100%;
          overflow: hidden;
        }
      }
    }

    .range{
      margin-top: .2rem;

      &.sellRange{
        /deep/ .mt-range-progress{
          background-color: $color-red !important;
        }

        .border-green{
          border-color: $color-red !important;
        }
      }

      /deep/ .mt-range{
        height: .5rem;
        line-height: .5rem;

        .mt-range-content{
          margin-right: .3rem;
        }

        .mt-range-runway{
          right: -0.05rem;
        }

        .mt-range-thumb{
          width: .5rem;
          height: .5rem;
          z-index: 10;
        }

        .mt-range-progress{
          background-color: $color-green;
        }
      }

      .desc{
        display: flex;
        align-items: center;/*垂直居中*/
        position: absolute;
        width: 100%;
        height: .50rem;
        z-index: 1;
        line-height: .5rem;

        &>span{
          flex: 1;
          height: .4rem;
          display: flex;
          align-items: center;/*垂直居中*/
          text-align: right;

          .before{
            display: inline-block;
            border: 2px solid $color-999;
            height: .22rem;
            width: .22rem;
            border-radius: 50%;
            transform: translate(-50%, 0);
            background: #ffffff;

            &.border-green{
              border-color: $color-green;
            }
          }

          &:nth-child(2) .before{
            transform: translate(-25%, 0);
          }
          &:nth-child(1) .before{
            transform: translate(0, 0);
          }

          .last{
            background: #ffffff;
            border: 2px solid $color-999;
            height: .22rem;
            width: .22rem;
            border-radius: 50%;
            position: absolute;
            right: 0px;
          }

        }
      }

      .ableDiv{
        display: flex;
        align-items: center;/*垂直居中*/
        font-size: .25rem;
        color: $color-999;
        margin-top: .12rem;

        &>span{
          flex: 9;
        }

        .precents{
          flex: 1;
          text-align: right;
        }
      }
    }

    .special{
      // margin-top: .18rem;
      margin-bottom: .1rem;
      font-size: .23rem;
      color: $color-this;
      display: flex;
      align-items: center;/*垂直居中*/

      &.freeCpuDiv{
        margin-top: .18rem;
        margin-bottom: 0rem;
      }

      &.warm{
        color: $color-red;
      }

      .specialIcon{
        font-size: .25rem;
      }

      .warmIcon{
        font-size: .25rem;
        color: $color-red;
      }
      .flexDiv{
        display: flex;
        // &.center{
        //   align-items: center;
        // }
      }
      .freeCpuDiv{
         margin-right: .06rem;
         margin-top: .03rem;
         width: .24rem;
         min-width: .24rem;
         height: .24rem;
         display: flex;
         align-items: center;
         justify-content: center;
        //  overflow: hidden;

        .freeCpu{
          width: .24rem;
          min-width: .24rem;
          height: .24rem;
          border-radius: 50%;
          border: 1px solid $color-input;
          box-sizing: border-box;
          display: block;

        }
        .freeCpuIcon{
          font-size: .24rem;
          color: $color-this;
        }
      }
      .freeCpuTip{
        // display: flex;
        // align-items: center;
        font-size: .21rem;
        color: $color-999;
      }
      .spacialTip{
        position: relative;
        font-size: .22rem;
        margin-top: .03rem;
        color: $color-999;
      }
    }

    .btnDivOut{
      display: flex;
      align-items: center;

      .btnList{
        position: relative;
      }

      &>div{
        flex: 10;

        &:nth-child(2){
          flex: 2;
          margin-left: .14rem;
        }
      }
    }

    .btnDiv{
      // margin-top: .4rem;

      .btn{
        height: .8rem;
        line-height: .8rem;
        width: 100%;
        color: $color-white;
        background: $color-green;
        font-size: .32rem;
        border-radius: .08rem;

        &.sell{
          background: $color-red;
        }

        &.buy:active{
          background: $active-green;
        }

        &.sell:active{
          background: $active-red !important;
        }
      }

      .btnFlex{
        display: flex;
        align-items: center; /*垂直居中*/
        justify-content: center; /*水平居中*/
        background: #9b9b9b !important;

        .warn{
          font-size: .35rem;
          padding-right: .1rem;
        }
      }
    }
  }

  .specialTip{
    border-radius: .12rem;
    top: 40%;
    .mb25{
      margin-bottom: .25rem;
    }
    .popupContent{
      .popupCenter{
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: .2rem;
        text-align: left;

        &.en{
          text-align: left;
        }

        .vip{
          color: #F6C85C !important;
          font-size: .3rem;

          &.vip0{
            color: $color-999 !important;
          }
        }
      }

      .popupTipDiv{
        color: $color-999;
        font-size: .25rem;
        &.en{
          text-align: left;
        }
      }
    }

    .popupTitle{
      color: #F6C85C !important;
    }

    .popupBtn{
      margin: auto;
      width: 4.27rem;
      background: #F6C85C;
      color: #8B572A;
    }
  }

  .addressBookCls {
    background: #fafafa !important;
    width: 100%;
    height: 100%;
  }
}

// 接收账户 style
.receiveAccount{
  margin-top: .2rem;
  position: relative;

  &>input{
    border: 1px solid $color-input;
    width: 100%;
    height: .83rem;
    border-radius: .12rem;
    font-size: .28rem;
    box-sizing: border-box;
    padding-left: .2rem;

    &.errorInput{
      border: 1px solid $color-red;
    }
  }

  .error{
    position: absolute;
    font-size: .2rem;
    color: $color-red;
  }

  .icon-huaban212 {
    box-sizing: border-box;
    width: .5rem;
    height: .6rem;
    position: absolute;
    right: .01rem;
    top: 50%;
    transform: translateY(-50%);
    background: #fff;
    padding: .14rem .08rem 0 .1rem;
  }
}

// 自定义下拉选择框
.selectMenu{
  background: white;
  box-shadow: 0px 0px .07rem rgba(74, 144, 226, .31);
  // width: calc(100% + .23rem);
  width: 100%;
  // transform: translateX(-.1rem);
  position: absolute;
  top: .85rem;
  border-radius: .13rem;
  padding: 0rem .2rem;
  box-sizing: border-box;
  z-index: 10;
  margin-top: .1rem;

  // &::after{
  //   content: '';
  //   border: .1rem solid white;
  //   position: absolute;
  //   top: -.1rem;
  //   right: .4rem;
  //   box-shadow: 0px 0px .07rem rgba(74, 144, 226, .31);
  //   transform: rotate(45deg);
  // }

  .selectIn{
    position: relative;
    z-index: 11;;
    background: #FFF;
    font-size: .32rem;

    &>div{
      line-height: 1rem;
      height: 1rem;
      border-bottom: 1px solid $color-e3e3e3;

      &:last-child{
        border-bottom: 0px solid $color-e3e3e3;
      }
    }
  }
}
</style>
