<template>
  <div class="upgrade" @click.stop="selectTime = false">
    <!-- 切换抵押账户 -->
    <div class="tabList">
      <div class="tab" @click="type = 1">
        <span class="tabName" :class="{'actived': type === 1}">
          <span>{{ $t('vip.ownRenewalVip') }}</span>
        </span>
      </div>
      <div class="tab" @click="type = 2">
        <span class="tabName" :class="{'actived': type === 2}">
          <span>{{ $t('vip.otherRenewalVip') }}</span>
        </span>
      </div>
    </div>

    <div v-if="type === 1 || (type === 2 && hasAccount)">
      <!-- 账户信息 -->
      <div class="mainContent">
        <!-- 账户信息 -->
        <div class="item">
          <div class="title">
            <div>{{ $t('vip.account') }}</div>
            <div class="action" v-if="type === 2" @click="handleChangeAccount">{{ $t('vip.replace') }} ></div>
          </div>
          <div class="accountInfo">
            <div :class="`iconfont vip ${vipCoinClass()}`"></div>
            <span class="account">{{ vipInfo.account }}</span>
            <span class="chain">({{ vipInfo.chain ? vipInfo.chain.toUpperCase() : 'EOS' }})</span>
            <!-- 到期时间 -->
            <span class="date" v-if="!vipInfo.vipMode">( {{ $t('vip.expire',{time:vipInfo.toLocalDate}) }})</span>
          </div>
        </div>

        <!-- 升级方式 -->
        <div class="item">
          <div class="title">
            <div>{{ $t('vip.renewMode') }}:</div>
            <div class="vipType">
              <div>{{ $t('vip.consumeNDX') }}</div>
            </div>
          </div>
          <div>
            <!-- 非vip 0 显示当前方式 & 更换方式 -->
            <!-- <div class="upFunc">
              <div class="func funcActived">{{ $t('vip.consumeNDX') }}</div>
            </div> -->
          </div>
        </div>

        <div class="renewalCycle">
          <div class="item">
            <div class="title">{{ $t('vip.renewTime') }}
              <div class="icon-box" :class="{iconTri:selectTime}" @click.stop="selectTime =!selectTime">
                 <i class="iconfont icon-huaban31 question"></i>
                <span v-show="selectTime" class="icon-text">{{ $t('vip.monthDay') }}</span>
              </div>
            </div>
            <div class="chooseLv">
              <div class="lists" ref="monthLists">
                <div class="list" :class="{'listActived': chooseMonth === item.period, 'disabled': item.noChoose}"
                  @click="chooseMonth = item.period"
                  v-for="(item, $index) in periodList" :key="$index">
                  <div>
                    <span class="discount" v-if="item.discountRate !== 1">{{ handleToDealRate(item.discountRate) }}
                      {{ $t('vip.discount') }}</span>
                    <div>{{ item.period }}{{ $t('vip.months') }}</div>
                    <div class="status">
                      <span>{{ $t('vip.consume') }}</span>
                    </div>
                    <div class="num">
                      <span>{{ handlePayByMonth(item.period) }}</span>
                    </div>
                    <div class="perMonth">NDX</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 当前消耗会员不是最高等级 -->
        <div class="maxLv" v-if="false">
          {{ $t('vip.upgradeTop') }}
        </div>
        <div v-else>
          <!-- 余额 -->
          <div class="item balance">
            <div>
              <span>{{ $t('vip.myBalance') }}：</span>
              <span>{{ ableBalance }}</span>
            </div>
          </div>

          <!-- 选择等级大于当前等级 -->
          <div class="count">
            <div>
              <span>{{ $t('vip.consume') }}</span>
              <span class="prominent">{{ countNdx }} NDX</span>
            </div>
            <div>
              <span>{{ $t('vip.grade') }}</span>
              <span class="prominent">VIP {{ vipInfo.level }}</span>
              <span>，{{ $t('vip.period') }}</span>
              <span class="prominent">{{ chooseMonth }}{{ $t('vip.months') }}</span>
            </div>
          </div>
          <div class="btn" @click="handleSure">{{ $t('public.sure') }}</div>
          <div class="tip">{{ $t('vip.consumeTip') }}</div>
        </div>
      </div>
    </div>

    <!-- 输入其他账号 - 验证账户状态 -->
    <div v-if="type === 2 && !hasAccount">
      <reg-account :status="status" @listenGetAccount="handleGetAccount" />
    </div>

    <!-- 切换升级方式 start -->
    <mt-popup
      class="popup"
      v-model="showPopupUpgrade"
      popup-transition="popup-fade">
      <popup-upgrade v-if="showPopupUpgrade" :type="func - 1" @listenClose="handleClose"/>
    </mt-popup>
    <!-- 切换升级方式 end -->

    <!-- 切换升级方式 start -->
    <mt-popup
      class="popup"
      v-model="showPopupRenewalDetail"
      popup-transition="popup-fade">
      <popup-renew-detail v-if="showPopupRenewalDetail" :vipInfo="vipInfo" @listenClose="handleClose"/>
    </mt-popup>
    <!-- 切换升级方式 end -->
  </div>
</template>

<script>
// import axios from 'axios';
import { Popup } from 'mint-ui';
import { Decimal } from 'decimal.js';
import { toFixed, toLocalTime, regIsRenew } from '@/utils/public';
import { getStakedInfo, AppTransfer } from '@/utils/publicApi';
import RequestApi from '@/utils/requestApi'
import DApp from '@/utils/wallet';
// import VipTip from '../components/VipTip';
import RegAccount from '../components/RegAccount';
// import SwiperLv from '../components/SwiperLv';
import PopupUpgrade from '../components/PopupUpgrade';
import PopupRenewDetail from '../components/PopupRenewDetail';

export default {
  name: 'upgradeVip',
  components: {
    // VipTip,
    RegAccount,
    // SwiperLv,
    PopupUpgrade,
    PopupRenewDetail,
    mtPopup: Popup,
  },
  props: {
  },
  data() {
    return {
      status: 'renewal', // 当前页面时升级 - upgrade | 续费 - renewal 页面
      type: 1, // 切换抵押账户 1 - 为自己 | 2 - 为他人
      func: 1, // 升级方式 1 - 消耗NDX | 2 - 抵押NDX
      lastDays: 0, // 小于一个月 - <30 | >=30 - 大于一个月
      chooseMonth: 0, // 选择月份
      countNdx: '0.0000', // 消耗 | 抵押的总数量
      vipInfo: {},
      anotherVipInfo: {}, // 另一个账户的会员信息
      vipList: [], // 会员等级列表
      allVipList: [], // 记录所有等级列表
      periodList: [], // 会员选择升级月份
      hasAccount: false, // 其他账户是否可以操作
      stakedInfo: {}, // 抵押信息
      antherStakedInfo: {}, // 其他账户抵押信息
      balanceTimer: null, // NDX余额定时器
      balance: '0.0000', // NDX余额
      ableBalance: '0.0000', // NDX可用余额

      showPopupUpgrade: false, // 显示切换升级方式
      showPopupRenewalDetail: false, // 显示续费详情
      selectTime: false // 显示1个月= 30天
    }
  },
  mounted() {
    // 进来默认为自己账户操作 - 获取自己账户信息
    this.vipInfo = this.$store.state.app.vipInfo || {};
    this.handleMouted();
    this.handleGetVipList(); // 获取vip列表信息
    this.handleGetAccountStakedInfo(); // 获取账户抵押信息
    this.handleGetBalance(); // 获取账户可用余额

    window.clearInterval(this.balanceTimer)
    this.balanceTimer = window.setInterval(() => {
      this.handleAfterSure();
    }, 5000);
  },
  beforeDestroy() {
    window.clearInterval(this.balanceTimer)
  },
  computed: {
    countDeal() { // 显示升级等级支付数据
      return false;
    },
  },
  watch: {
    vipInfo() { // 会员等级发生改变
      this.handleMouted();
      this.handleGetVipListDeal();
    },
    func() {
      this.handleGetVipListDeal();
      this.handlePayCount()
      this.handleDealAbleStake();
      setTimeout(() => {
        this.handlePosThisMonth();
      }, 200);
    },
    chooseMonth() {
      this.handlePayCount()
    },
    '$store.state.app.vipInfo': function vipInfo(newVal) {
      if (this.type === 2) { // 为其他账户 升级|消耗 时，vipInfo记录其他账户信息 - 直接return
        this.anotherVipInfo = newVal || {};
        return;
      }
      this.vipInfo = newVal || {};
    },
    type() {
      const tInfo = JSON.stringify(this.vipInfo);
      this.vipInfo = this.anotherVipInfo;
      this.anotherVipInfo = JSON.parse(tInfo);
    },
  },
  methods: {
    handleMouted() {
      this.func = this.vipInfo.vipMode ? 2 : 1; // 获取账户当前升级方式 - 默认消耗
      this.handleLessDays(); // 获取会员到期剩余时间
      setTimeout(() => {
        this.handlePosThisMonth();
      }, 200);
    },
    // 定位当前默认选中月份
    handlePosThisMonth() {
      const monthLists = this.$refs.monthLists;
      if (!monthLists) {
        return;
      }
      const index = this.periodList.findIndex(item => item.isDefault === 1 && this.chooseMonth === item.period);
      if (index < 3) {
        monthLists.scrollLeft = 0;
        return;
      }
      const rem = (screen.width * 100) / 750;
      const scroll = (index - 2) * 1.9 * rem;
      monthLists.scrollLeft = scroll;
    },
    // 确认抵押 | 消耗 之后重新查询账户信息
    handleAfterSure() {
      this.handleGetBalance();
      this.handleGetAccountStakedInfo();
    },
    handleClose(data) {
      this.showPopupUpgrade = false;
      this.showPopupRenewalDetail = false;

      if (data.type === 'chanegeType') { // 改变升级方式
        this.func = data.status;
      }
    },
    // 处理折扣
    handleToDealRate(rate) {
      const lang = this.$store.state.app.language;
      if (lang !== 'en' && lang !== 'ko') {
        const t = Decimal.mul(rate, 10).toString();
        return toFixed(t, 1);
      }
      let t = Decimal.sub(1, rate).toString();
      t = Decimal.mul(t, 100).toString();
      return t
    },
    handleToFixed(n, l) {
      return toFixed(n, l)
    },
    handleGetVipListDeal() {
      const list = this.allVipList.filter(item => item.level > this.vipInfo.consumeLevel);
      this.vipList = list;
    },
    // 获取会员列表
    handleGetVipList() {
      if (this.$appName !== 'eosNewdex') return;
      this.$http.get('/levelRule/list').then((res) => {
        if (res.code !== 0) {
          return;
        }
        // 获取到会员列表信息
        const ruleList = res.ruleList;
        ruleList.forEach((item) => {
          if (item.ndxStaked >= 1000) {
            let dealNdxStaked = Decimal.div(item.ndxStaked, 1000).toString();
            dealNdxStaked = toFixed(dealNdxStaked, 0);
            this.$set(item, 'dealNdxStaked', `${dealNdxStaked}K`)
          } else {
            this.$set(item, 'dealNdxStaked', item.ndxStaked)
          }
          if (item.ndxConsume >= 1000) {
            let dealNdxConsume = Decimal.div(item.ndxConsume, 1000).toString();
            dealNdxConsume = toFixed(dealNdxConsume, 0);
            this.$set(item, 'dealNdxConsume', `${dealNdxConsume}K`)
          } else {
            this.$set(item, 'dealNdxConsume', item.ndxConsume)
          }
        });
        this.allVipList = ruleList;
        this.handleGetVipListDeal();
        // 获取升级月份列表
        this.periodList = res.periodList || [];
        this.chooseMonth = 1
        // const m = this.periodList.find(v => v.isDefault === 1)
        // this.chooseMonth = m.period
        // this.handlePayCount();
      })
    },
    // 获取等级样式
    vipCoinClass(item) {
      let index = this.vipInfo.consumeLevel;
      if (!item) {
        if (this.func === 2) {
          index = this.vipInfo.stakeLevel
        }
      } else {
        index = item;
      }
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
    // 计算剩余时间
    handleLessDays() { // 小于一个月 - true | false - 大于一个月
      // if (this.func === 2) {
      //   return;
      // }
      const nowDate = new Date().toLocaleDateString(); // 当前日期
      const now = new Date(nowDate).getTime();
      const toLocalDate = toLocalTime(this.vipInfo.expireTime)
      const expireTime = toLocalDate.replace(/-/g, '/');
      const lastDate = new Date(expireTime).getTime()
      let days = (lastDate - now) / (1000 * 60 * 60 * 24);
      days = Math.ceil(Number(days))
      this.lastDays = days;
      this.vipInfo.toLocalDate = toLocalDate.substr(0, 10)
    },
    // 计算总消耗
    handlePayCount() {
      if (!this.allVipList.length) {
        return;
      }
      const thisLv = this.allVipList.find(item => item.level === this.vipInfo.consumeLevel);
      const thisMonth = this.periodList.find(v => v.period === this.chooseMonth);
      if (!thisLv || !thisMonth) {
        return;
      }
      let pay = Decimal.mul(thisLv.ndxConsume, this.chooseMonth).toString();
      pay = Decimal.mul(pay, thisMonth.discountRate).toString();
      pay = Decimal.mul(pay, 10000).toString();
      pay = Math.ceil(Number(pay));
      pay = Decimal.div(pay, 10000).toString()

      this.countNdx = toFixed(pay, 4);
    },
    // 计算当前等级续费消耗
    handlePayByMonth(month) {
      const thisLv = this.allVipList.find(item => item.level === this.vipInfo.consumeLevel);
      let pay = Decimal.mul(thisLv.ndxConsume, month).toString();
      // const thisMonth = this.periodList.find(v => v.period === month)
      // pay = Decimal.mul(pay, thisMonth.discountRate).toString();
      if (Number(pay) >= 1000) {
        pay = Decimal.div(pay, 1000).toString();
        return `${toFixed(pay, 0)}K`
      }
      return pay
    },
    // 计算总消耗 | 总抵押
    async handleSure() {
      // 判断是否执行下去
      if (!this.handleRegSure()) {
        return;
      }
      const obj = {
        quantity: `${this.countNdx} NDX`,
        memo: `${this.vipInfo.consumeLevel}-${this.chooseMonth}-${this.vipInfo.account}`,
      }
      // 是否是APP打开？
      if (this.$store.state.sys.isAppView) {
        obj.to = 'newdexstaked'; // 接收账户
        obj.contract = 'newdexissuer'; // 转账币种合约
        obj.amount = obj.quantity; // zhuan
        obj.precision = 4; // 币种精度
        obj.coinName = 'NDX'; // 币种名称
        delete obj.quantity;
        AppTransfer(obj)
        return;
      }
      // 合约执行
      const fromName = this.$store.state.app.accountInfo.account;
      const permission = this.$store.state.app.accountInfo.permissions;
      const params = {
        actions: [{ // 切换会员升级状态
          account: 'newdexissuer',
          name: 'transfer',
          authorization: [{
            actor: fromName,
            permission,
          }],
          data: {
            from: fromName,
            to: 'newdexstaked',
            quantity: obj.quantity,
            memo: obj.memo, // 1-3-testa2b12345
          },
        }]
      }
      if (obj.choosemode === 0) {
        const chooseActions = { // 选择消耗方式
          account: 'newdexstaked',
          name: 'choosemode',
          authorization: [{
            actor: fromName,
            permission,
          }],
          data: {
            owner: fromName,
            is_staked: false, // 抵押 - 1 | 0 - 消耗
          },
        }
        params.actions.push(chooseActions)
      }
      const transferParams = {
        params,
        useFreeCpu: false
      }
      const result = await DApp.transactionApi(transferParams);
      if (result && result.code !== 0) {
        DApp.handleScatterErrorBack(result, (type, text) => {
          type === 'lang' ? this.$toast(this.$t(text)) : this.$toast(text);
        });
        return;
      }
      this.$toast({
        message: this.$t('vip.renewalSuccess'),
        position: 'center',
        duration: 2000,
      });
      this.handleGetVipInfo('loop');
      this.handleAfterSure();
      // DApp.consumption(params, (err, res) => {
      //   if (err) {
      //     this.$toast(this.$t('vip.renewalFail'))
      //     return;
      //   }
      //   if (res) {
      //     this.$toast({
      //       message: this.$t('vip.renewalSuccess'),
      //       position: 'center',
      //       duration: 2000,
      //     });
      //   }
      //   this.handleGetVipInfo('loop');
      //   this.handleAfterSure();
      // })
    },
    // 获取到其他账户信息
    handleGetAccount(data) {
      this.vipInfo = data;
      this.hasAccount = true;
    },
    // 获取账户抵押信息
    handleGetAccountStakedInfo() {
      getStakedInfo((err, res) => {
        if (err) {
          return;
        }
        this.stakedInfo = res;
      })
    },
    // 获取账户余额
    async handleGetBalance() {
      try {
        // window.clearTimeout(this.balanceTimer);
        const params = {
          code: 'newdexissuer',
          symbol: 'NDX',
          account: this.$store.state.app.accountInfo.account
        }
        const balance = await DApp.getBalance(params);
        if (balance || balance === 0) {
          this.balance = balance;
          this.handleDealAbleStake();
        } else {
          this.balance = `0.0000 ${params.coin}`;
        }
        // DApp.getCurrencyBalance(params, (err, data) => {
        //   if (err) {
        //     return;
        //   }
        //   this.balance = data;
        //   this.handleDealAbleStake();
        // });
      } catch (error) {
        setTimeout(() => {
          this.handleGetBalance();
        }, 200);
      }
    },
    // 可用余额处理
    handleDealAbleStake() {
      const balance = this.balance.split(' ')[0];
      let ableBalance = Decimal.sub(balance, this.stakedInfo.selfStakedAll || 0).toString();
      if (this.func === 1) {
        ableBalance = Decimal.sub(ableBalance, this.stakedInfo.unstakeing || 0).toString();
      }
      if (Number(ableBalance) < 0) {
        this.ableBalance = '0.0000 NDX';
        return;
      }
      this.ableBalance = `${toFixed(ableBalance, 4)} NDX`;
    },
    // 更换账户
    handleChangeAccount() {
      this.hasAccount = false;
    },
    // 确认验证
    handleRegSure() {
      // 账户已经续费过 - 阻止继续续费
      const isRenew = regIsRenew(this.vipInfo);
      if (isRenew) {
        this.showPopupRenewalDetail = true;
        return false;
      }
      if (!this.chooseMonth) {
        this.$toast(this.$t('vip.chooseCycle'))
        return false;
      }
      if (Number(this.countNdx) > Number(this.ableBalance.split(' ')[0])) {
        this.$toast(this.$t('quotation.low'))
        return false;
      }
      return true;
    },
    // 获取账户会员信息
    handleGetVipInfo(loop) {
      const params = {
        account: this.vipInfo.account,
      }
      // this.$http.post('/account/getAccountInfo', params).then((res) => {
      RequestApi.accountInfo(params, (res) => {
        if (res.code !== 0) {
          return;
        }
        if (loop) {
          if (this.vipInfo.expireTime === res.accountInfo.expireTime) {
            setTimeout(() => {
              this.handleGetVipInfo();
            }, 500);
            return;
          }
        }
        this.vipInfo = res.accountInfo;
      });
    },
  },
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.prominent{
  color: #f6af39;
}
.vip{
  color: #F6C85C !important;
  font-size: .41rem;

  &.vip0{
    color: $color-999 !important;
  }
}

.upgrade{
  font-size: .24rem;
  background: #FFF;

  .tabList{
    display: flex;
    align-items: center;
    height: .94rem;
    background: #FFF;
    padding: 0 .1rem;
    border-bottom: .1rem solid #fafafa;
    &>div{
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      color: $color-999;
      font-size: .27rem;

      &:last-child::before{
        content: '';
        position: absolute;
        border: 1px solid #979797;
        left: 0px;
        height: .27rem;;
      }
    }
    .tabName{
      height: .7rem;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      // padding: 0 .08rem;

      &.actived{
        color: #8B572A;
      }
    }
  }

  .maxLv{
    text-align: center;
    margin-top: .56rem;
    font-size: .25rem;
    color: #F5A623;
  }

  .mainContent{
    padding: .24rem .36rem .5rem;

    .item{
      margin-bottom: .3rem;
    }

    .title{
      margin-bottom: .3rem;
      font-size: .27rem;
      display: flex;
      align-items: center;

      .vipType{
        margin-left: .2rem;
      }

      .action{
        margin-left: .18rem;
        font-size: .24rem;
        color: #8B572A;
      }

      .question{
        font-size: .27rem;
        color: $color-999;
        margin-left: .12rem;
      }
    }
    .icon-box{
        position: relative;
        .icon-text{
          position: absolute;
          white-space: nowrap;
          width:auto;
          font-size: 0.24rem;
          color: #3A3949;
          text-align: center;
          height: 0.5rem;
          line-height: 0.5rem;
          z-index: 10;
          top: 0.44rem;
          right: 50%;
          transform: translateX(50%);
          padding: 0 .27rem;
          background: #F3F3F3;
          border-radius: 0.0369rem;
        }
      }
    .iconTri{
        &::after{
          content: '';
          border: .1rem solid #F3F3F3;
          position: absolute;
          top: 0.4rem;
          right: 0.05rem;
          box-shadow: 0px 0px .07rem rgba(74, 144, 226, .31);
          transform: rotate(45deg);
        }
      }
    .tipDiv{
      margin-top: .24rem;

      .lessMonth{
        color: #F5A623;
      }
      .pay{
        color: $color-999;
      }
    }
    .stakedInfoDiv{
      background: rgba(242,219,164,0.20);
      border-radius: .08rem;

      .unstake{
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 0 .24rem .2rem;

        .back{
          color: #8B572A;
          font-size: .21rem;
        }
      }
    }
    .stakedInfo{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: .24rem;
      // background: rgba(242,219,164,0.20);
      border-radius: .08rem;
      // height: 1.3rem;
      padding: .2rem .24rem;
      font-size: .21rem;

      &>div{
        color: $color-999;
        &>div{
          margin-bottom: .12rem;
          &:last-child{
            margin-bottom: 0rem;
          }
        }
      }
      .back{
        color: #8B572A;
        margin-left: .14rem;
      }
    }
  }

  .accountInfo{
    display: flex;
    align-items: center;
    .account{
      font-size: .32rem;
      margin: 0 .08rem;
    }
    .chain{
      font-size: .21rem;
    }
    .date{
      margin-left: .25rem;
      font-size: .21rem;
      color: $color-999;
    }
  }

  .upFunc{
    display: flex;

    .func{
      background: #FFF;
      border: 1px solid $color-input;
      border-radius: .1rem;
      height: .74rem;
      width: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: .09rem;
      color: $color-999;

      &.funcActived{
        background: rgba(242,219,164,0.40);
        border: 1px solid #FFC78A;
        color: #F5A623;
      }
    }
  }
  .noChange{
    margin-top: .2rem;
    color: $color-999;
  }

  .chooseLv{
    height: 2.35rem;
    overflow: hidden;
    .lists{
      display: flex;
      overflow: auto;
      padding-bottom: .2rem;

      .list{
        max-width: 1.75rem;
        min-width: 1.75rem;
        height: 2.25rem;
        border: 1px solid $color-input;
        border-radius: .0816rem;
        margin-left: .15rem;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        position: relative;
        overflow: hidden;

        &.listActived{
          border: 1px solid #F5A623;
          background: rgba(242,219,164,0.37) !important;
        }

        &.disabled{
          background: rgba(0,0,0,0.06);
        }

        &:first-child{
          margin-left: 0rem;
        }
        .discount{
          position: absolute;
          right: 0px;
          top: 0px;
          height: .27rem;
          // width: .56rem;
          padding: 0 0.05rem;
          font-size: .15rem;
          background: $color-red;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom-left-radius: .08rem;
          color: #FFF;
        }
        .num{
          font-size: .32rem;
          color: #8B572A;
        }
        .perMonth,
        .status{
          margin: .12rem 0;
          font-size: .21rem;
          color: $color-999;
        }
      }
    }
  }

  .balance{
    // margin-top: .16rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .back{
      color: #8B572A;
    }
  }

  .count{
    text-align: center;
    font-size: .27rem;
    margin-top: 0.6rem;
  }
  .btn{
    background: #F6C85C;
    // background-image: linear-gradient(0deg, #E5AE65 0%, #FFEA7A 100%);
    border-radius: .1042rem;
    height: .84rem;
    color: #8B572A;
    font-size: .32rem;
    margin-top: .25rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .tip{
    margin-top: .3rem;
    color: $color-999;
    text-align: center;
  }

}

.popup{
  background: transparent;
}
</style>
