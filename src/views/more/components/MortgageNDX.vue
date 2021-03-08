<template>
  <div class="mortgage" :class="{'isRoute': isRoute}" @click="select = false;">
    <!-- 关闭按钮 start -->
    <div v-if="!isRoute">
      <span class="iconfont icon-huaban11 back" v-if="tab === 3"
        @click="handleDealTab"></span>
      <span class="iconfont icon-huaban17 close" @click="listenClose"></span>
    </div>
    <!-- 关闭按钮 end -->

    <!-- 抵押赎回页面 start -->
    <div v-if="tab !== 3" ref="stakeDiv">
      <!-- 抵押NDX start -->
      <div class="content" v-if="isMortgageNDX">
        <div class="title" v-if="!isRoute">{{ $t('vip.mortgageNdx') }}</div>
        <div class="tab" v-if="!isRoute">
          <div :class="{'activedTab': tab === 1}" @click="tab = 1">{{ $t('vip.stakedSelf') }}</div>
          <div :class="{'activedTab': tab === 2}" @click="tab = 2">{{ $t('vip.stakedOther') }}</div>
        </div>
        <div class="checkbox" v-else>
          <div :class="{'activedTab': tab === 1}" @click="tab = 1">
            <span class="iconfont checkBox" :class="{'icon-huaban57': tab === 1}"></span>
            <span>{{ $t('vip.stakedSelf') }}</span>
          </div>
          <div :class="{'activedTab': tab === 2}" @click="tab = 2">
            <span class="iconfont checkBox" :class="{'icon-huaban57': tab === 2}"></span>
            <span>{{ $t('vip.stakedOther') }}</span>
          </div>
        </div>
        <div class="tabContent">
          <!-- tab项切换 - 自己 -->
          <div class="mortgageTip" v-if="tab === 1">
            <div class="allStaked">
              <div>{{ $t('vip.alreadyMortgage') }}: </div>
              <div>{{ accountSum }} NDX</div>
            </div>
            <div class="stakedList color-999">
              <div>{{ $t('vip.selfShort') }}: {{ staked }} NDX</div>
              <div>{{ $t('vip.otherShort') }}: {{ otherStaked }} NDX</div>
            </div>
          </div>
          <!-- tab项切换 - 他人 -->
          <div class="mortgageTip" v-if="tab === 2">
            <div class="allStaked">
              <div>{{ $t('vip.stakedOther_1') }}:</div>
              <div>{{ stakedOther }} NDX</div>
            </div>
            <div v-if="Number(stakedOther)">
              <div class="detail" @click="handleToDetail">{{ $t('vip.stakedDetail') }}</div>
            </div>
          </div>
          <!-- 为他人抵押显示选择链账户 -->
          <div class="otherAccount">
            <div>
            <!-- 关闭列表选项 - lcx -->
            <!-- <div @click.stop="select = !select"> -->
              <span>{{ blockchain.toUpperCase() }}{{ $t('newpos.account') }}</span>

              <!-- 隐藏三角图标 - lcx -->
              <!-- <span class="more" :class="{'show': select}"></span> -->
              <!-- 链筛选 start -->
              <div class="selectMenu" v-if="select">
                <div class="select color-333">
                  <div v-for="(item, $index) in coldWallet" :key="$index"
                    @click="handleSelect($index)">
                    {{ $index.toUpperCase() }}
                  </div>
                </div>
              </div>
              <!-- 链筛选 end -->
            </div>
            <div :class="{'error': error && !stakefor}">
              <input class="input" type="text" v-if="tab === 2" v-model="stakefor" :placeholder="$t('vip.toStakedAccount')">
              <div class="input account" v-else>{{ stakefor }}</div>
            </div>
          </div>
          <div class="inputDiv">
            <input class="input" type="number" v-model="num" @blur="hamdleInputBlur" :placeholder="$t('vip.inputTip')">
            <div class="fl color-red" v-if="error && Number(num) < 0.0001"
              style="font-size: .24rem;">>=0.0001 NDX</div>
            <div class="hasNum fr color-999" @click="num = ableBalance.split(' ')[0]">{{ $t('vip.ableMortgage') }}：{{ ableBalance }}</div>
          </div>
          <div class="color-red" v-if="accountError">{{ $t('vip.stakedAccountNull') }}</div>
        </div>

        <!-- 抵押事件 -->
        <div class="btnDiv">
          <button class="btn" :class="{'bgcolor-999': $store.state.app.accountInfo.chain !== 'eos'}"
            @click="handleStakeReg('stake')">{{ $t('vip.sureMortgage') }}</button>
        </div>
        <div class="tip color-999">
          <div class="nodeTipDiv">
            <span>{{ $t('vip.mortgageTip') }}</span>
            <!-- 隐藏BOS账户暂不支持抵押，可通过EOS账户为您抵押。提示 -lcx -->
            <!-- <div class="color-yellow" v-if="$store.state.app.accountInfo.chain !== 'eos'">
              {{ $store.state.app.accountInfo.chain.toUpperCase() }}{{ $t('vip.chainNotStaked') }}
            </div> -->
          </div>
        </div>
        <div class="showNDXDetail">
          <span>{{ $t('vip.circulation') }}</span>
          <!-- <span class="iconfont icon-huaban25 direction"
            :class="{'directionOpen': showInfo}"></span> -->
        </div>
      </div>
      <!-- 抵押NDX end -->

      <!-- 赎回NDX start -->
      <div class="content" :class="{'isUnstakeContent': isRoute}" v-if="!isMortgageNDX">
        <div class="title isUnstake" v-if="!isRoute">{{ $t('vip.redeemNdx') }}</div>
        <!-- 赎回中倒计时 -->
        <div class="unstakedInfo" v-if="Number(unstakeing) !== 0 || releaseNow">
          <span>
            <span>{{ $t('vip.redeeming') }}:</span>
            <span>{{ releaseNow || unstakeing }} NDX</span>
          </span>
          <span v-if="Number(unstakeing) !== 0">
            <span v-if="$store.state.app.language !== 'ko'">
            {{ $t('vip.unstakedLess') }}{{`${countdownTime.hours}:${countdownTime.minutes}:${countdownTime.seconds}`}}</span>
            <span v-else>{{`${countdownTime.hours}:${countdownTime.minutes}:${countdownTime.seconds}`}}{{ $t('vip.unstakedLess') }}</span>
          </span>
          <span v-if="releaseNow">
            <!-- 立即释放 -->
            <span class="releaseNow" @click="handleClickRelease">{{$t('public.release')}}</span>
          </span>
        </div>
        <div class="mortgageTip isUnstakeInfo">
          <div>
          </div>
          <div v-if="Number(stakedOther) !== 0">
            <span class="detail" @click="handleToDetail">{{ $t('vip.leasing') }}</span>
          </div>
        </div>
        <div class="inputDiv">
          <input class="input" type="number" v-model="num" @blur="hamdleInputBlur" :placeholder="$t('vip.inputTipRedeem')">
          <div class="fl color-red" v-if="error && Number(num) < 0.0001"
              style="font-size: .24rem;">>=0.0001 NDX</div>
          <div class="hasNum fr color-999" @click="num = staked">
            <span>{{ $t('vip.ableRedeem') }}：{{ staked }} NDX</span>
          </div>
        </div>
        <div class="btnDiv">
          <button class="btn" :class="{'bgcolor-999': $store.state.app.accountInfo.chain !== 'eos'}"
            @click="handleStakeReg('unstake')">{{ $t('vip.sureRedeem') }}</button>
        </div>
        <div class="tip color-999">
          <div class="nodeTipDiv otherStaked"
            v-if="Number(otherStaked)">
            <span v-if="$store.state.app.language !== 'en'">{{ otherStaked }} {{ $t('vip.notUnstaked') }}</span>
            <span v-else>{{ $t('vip.notUnstaked') }}{{ otherStaked }}{{ $t('vip.notUnstaked1') }}</span>
          </div>
          <div class="nodeTipDiv">
            <!-- <span class="nodeTip" v-if="$store.state.app.language === 'zh-CN' || $store.state.app.language === 'zh-TW'">·</span> -->
            <span>{{ $t('vip.redeemTip') }}</span>
          </div>
        </div>
        <div class="showNDXDetail">
          <span>{{ $t('vip.circulation') }}</span>
          <!-- <span class="iconfont icon-huaban25 direction"
            :class="{'directionOpen': showInfo}"></span> -->
        </div>
      </div>
      <!-- 赎回NDX end -->
      <div class="open">
        <Circulation :allStake="allStake" />
      </div>
    </div>
    <!-- 抵押赎回页面 end -->

    <!-- 抵押详情 start -->
    <div v-if="tab === 3">
      <StakedDetail :height="divHeight" :isRoute="isRoute" />
    </div>
    <mt-popup class="popup" popup-transition="popup-fade" v-model="popupDetail">
      <StakedDetail :height="divHeight" :isRoute="isRoute" @listenClose="handleClose" />
    </mt-popup>
    <!-- 抵押详情 end -->

    <!-- 自定义吐司 -->
    <transition name="fade">
      <div class="myToast" v-if="toast">{{ toastInfo }}</div>
    </transition>
  </div>
</template>

<script>
import Circulation from '@/views/more/components/Circulation';
import StakedDetail from '@/views/more/components/StakedDetail';
import DApp from '@/utils/wallet';
import { toFixed, countdown } from '@/utils/public';
import { AppActions } from '@/utils/publicApi';
import { Popup } from 'mint-ui';
import axios from 'axios';
import moment from 'moment';
import { Decimal } from 'decimal.js';

export default {
  data() {
    return {
      isMortgage: true, // 显示抵押 - true | false - 显示赎回
      showInfo: true, // 显示流通情况 - true | false - 不显示流通情况
      num: '', // 数量
      releaseNow: false, //立即释放
      accountStakedAll: '0.0000', // 账户全部抵押
      staked: '0.0000', // 已抵押数量 - 自己
      stakedOther: '0.0000', // 已抵押数量 - 替他人
      accountSum: '0.0000', // 自己抵押总数 = (已抵押数量 - 替他人) + (已抵押数量 - 自己)
      otherStaked: '0.0000', // 他人替自己抵押数量
      unstakeing: '0.0000', // 赎回中

      balance: '0.0000 NDX', // 账户余额
      ableBalance: '0.0000 NDX', // 账户可抵押余额

      rate: '0.00000000', // 占比
      allStake: '0.0000 NDX', // 全网抵押
      balanceTimer: null, // 余额轮询
      countdownTime: {
        days: 0,
        hours: '00',
        minutes: '00',
        seconds: '00'
      },
      first: true,
      countdownTimer: null, // 赎回定时器

      tab: 1, // 为自己 1 | 2  为他人 (抵押|赎回) | 3 抵押明细
      coldWallet: {},
      select: false,
      blockchain: 'eos',
      stakefor: '',
      error: false,
      toast: false,
      toastInfo: '',
      accountError: false,

      divHeight: 400,
      isRoute: false,
      popupDetail: false,
    }
  },
  props: [
    'isMortgageNDX',
    'controlTab'
  ],
  components: {
    Circulation,
    StakedDetail,
    mtPopup: Popup,
  },
  watch: {
    '$store.state.app.vipInfo': function listen(newVal) {
      this.accountSum = toFixed(newVal.ndxStaked, 4);
      this.handleAllNetStake();
    },
    isMortgageNDX() {
      this.tab = 1;
    },
    unstakeing() {
      this.$emit('listenUnstaking', Number(this.unstakeing) !== 0);
      this.handleDealAbleStake()
    },
    staked() {
      this.handleDealAbleStake()
    },
    num(newVal, oldVal) {
      if (newVal < 0) {
        this.num = oldVal;
      }
    },
    tab() {
      this.select = false;
      this.num = '';
      this.error = false;
      this.accountError = false;
      this.stakefor = this.$store.state.app.accountInfo.account;
      if (this.tab === 2) {
        this.stakefor = '';
      }
      if (this.tab !== 3) {
        setTimeout(() => {
          this.divHeight = this.$refs.stakeDiv.clientHeight;
        }, 200);
      }
    },
    controlTab(newVal) {
      this.tab = newVal;
    }
  },
  mounted() {
    setTimeout(() => {
      this.divHeight = this.$refs.stakeDiv.clientHeight;
      if (this.controlTab) {
        this.tab = this.controlTab;
      }
    }, 200);
    if (this.$route.name === 'stakeNdx') {
      this.isRoute = true;
    }
    this.stakefor = this.$store.state.app.accountInfo.account;
    this.coldWallet = this.$store.state.sys.coldWallet;
    this.accountSum = toFixed(this.$store.state.app.vipInfo.ndxStaked, 4);
    this.handleAllNetStake();
    this.handleGetBalance();
    this.handleStakeInfo();
  },
  methods: {
    //释放NDX
    async handleClickRelease(){
      const scatter = this.$store.state.app.accountInfo;
      const permission = Array.isArray(scatter.permissions)? scatter.permissions[0] : scatter.permissions;
      const formName = scatter.account;
      const params = {
        actions: [
          {
            account: 'newdexstaked',
            name: 'release',
            authorization: [{
              actor: formName, // 转账者
              permission: permission || 'active',
            }],
            data: {
              owner: formName,
            }
          }
        ]
      }
      const objParams = {
        params,
        useFreeCpu: false
      }
      const result = await DApp.transactionApi(objParams);
      // 错误信息
      if (result && result.code !== 0) {
        DApp.handleScatterErrorBack(result, (type, text) => {
          type === 'lang' ? this.$toast(this.$t(text)) : this.$toast(text);
        });
        return;
      }
      this.$toast(this.$t('public.releaseSuccess'));
      this.releaseNow = false;
      // DApp.transactionApi(objParams, (err, res) => {
      //   if (err) {
      //     DApp.handleScatterErrorBack(err, this);
      //   }
      //   if (res) {
      //     this.$toast(this.$t('public.releaseSuccess'));
      //     this.releaseNow = false;
      //   }
      // });
    },
    handleClose() {
      this.popupDetail = false;
    },
    handleToDetail() {
      if (!this.isRoute) {
        this.tab = 3;
        return
      }
      this.popupDetail = true;
    },
    // 筛选
    handleSelect(chain) {
      this.blockchain = chain;
    },
    // 处理明细返回
    handleDealTab() {
      this.handleAllNetStake();
      this.handleGetBalance();
      this.handleStakeInfo();
      if (this.isMortgageNDX) {
        this.tab = 2;
        return;
      }
      this.tab = 1;
    },
    handleDealAbleStake() {
      if (this.first) {
        this.first = false;
        return;
      }
      const balance = this.balance.split(' ')[0];
      let ableBalance = Decimal.sub(balance, this.staked).toString(); // 减掉抵押中的数量
      ableBalance = Decimal.sub(ableBalance, this.stakedOther).toString();
      if (Number(ableBalance) < 0) {
        this.ableBalance = '0.0000 NDX';
        return;
      }
      this.ableBalance = `${toFixed(ableBalance, 4)} NDX`;
    },
    // 关闭按钮
    listenClose() {
      this.$emit('listenClose', false);
    },
    // input 失去焦点处理
    hamdleInputBlur() {
      this.num = toFixed(Math.abs(this.num), 4);
    },
    // 抵押 & 赎回 -- type: stake - 抵押 | unstake - 赎回
    handleStakeReg(type) {
      // 判断当前链
      if (this.$store.state.app.accountInfo.chain !== 'eos') {
        return;
      }
      if (!this.num || !Number(this.num)) {
        this.error = true;
        return;
      }
      if (Number(this.num) <= 0) {
        this.error = true;
        return;
      }
      if (this.tab === 2 && !this.stakefor.trim()) {
        this.error = true;
        return;
      }
      this.handleGetAccount((err) => {
        if (err) {
          this.accountError = true;
          return;
        }
        this.accountError = false;
        // 执行抵押 | 赎回操作
        this.handleStake(type)
      });
    },
    // 抵押赎回操作
    async handleStake(type) {
      const obj = {
        name: type || 'stake',
        quantity: `${this.num} NDX`,
        blockchain: this.blockchain,
        stakefor: this.stakefor
      }
      if (this.tab === 1) {
        obj.blockchain = this.$store.state.app.accountInfo.chain;
        obj.stakefor = this.$store.state.app.accountInfo.account;
      }
      // 是否是APP打开？
      if (this.$store.state.sys.isAppView) {
        const newParams = {
          name: obj.name,
          account: 'newdexstaked',
          data: {
            blockchain: 'eos',
            owner: this.$store.state.app.accountInfo.account,
            quantity: obj.quantity,
            stakefor: obj.stakefor,
          }
        }
        AppActions([newParams])
        return;
      }

      // 合约执行
      const fromName = this.$store.state.app.accountInfo.account;
      const permission = this.$store.state.app.accountInfo.permissions;
      const params = {
        actions: [
          {
            account: 'newdexstaked', // 抵押账户
            name: obj.name || 'stake', // stake - 抵押 | unstake - 赎回
            authorization: [{
              actor: fromName, // 转账者
              permission, // 权限 active | owner
            }],
            data: {
              owner: fromName, // 转账者 - 'testtesttest'
              quantity: obj.quantity, // 数量 - '1.0000 NDX'
              blockchain: obj.blockchain, // 抵押账户所属链
              stakefor: obj.stakefor, // 抵押账户
            }
          }
        ]
      };
      const transferParams = {
        params,
        useFreeCpu: false
      }
      const result = await DApp.transactionApi(transferParams);
      if (result && result.code !== 0) {
        if (!type || type === 'stake') {
          this.toastInfo = this.$t('vip.mortgageError');
          setTimeout(() => {
            this.toast = false;
          }, 2000);
        } else {
          this.toastInfo = this.$t('vip.redeemError');
          setTimeout(() => {
            this.toast = false;
          }, 2000);
        }
        // DApp.handleScatterErrorBack(result, (type, text) => {
        //   type === 'lang' ? this.$toast(this.$t(text)) : this.$toast(text);
        // });
        return;
      }
      // 通知会员中心更新数据
      this.$emit('handleStakeInfo');
      if (this.isRoute) {
        this.$router.push({
          name: 'stakeStatus',
          params: {
            type: !type || type === 'stake',
          }
        })
        return;
      }
      if (!type || type === 'stake') {
        this.$toast({
          message: this.$t('vip.mortgageSuccess'),
          position: 'center',
          duration: 2000,
        });
      } else {
        this.$toast({
          message: this.$t('vip.redeemSuccess'),
          position: 'center',
          duration: 2000,
        });
      }
      this.listenClose();

      // DApp.newdexStaked(params, (err, res) => {
      //   this.toast = true;
      //   if (err) {
      //     if (!type || type === 'stake') {
      //       this.toastInfo = this.$t('vip.mortgageError');
      //       setTimeout(() => {
      //         this.toast = false;
      //       }, 2000);
      //     } else {
      //       this.toastInfo = this.$t('vip.redeemError');
      //       setTimeout(() => {
      //         this.toast = false;
      //       }, 2000);
      //     }
      //     return;
      //   }
      //   if (res) {
      //     // 通知会员中心更新数据
      //     this.$emit('handleStakeInfo');
      //     if (this.isRoute) {
      //       this.$router.push({
      //         name: 'stakeStatus',
      //         params: {
      //           type: !type || type === 'stake',
      //         }
      //       })
      //       return;
      //     }
      //     if (!type || type === 'stake') {
      //       this.$toast({
      //         message: this.$t('vip.mortgageSuccess'),
      //         position: 'center',
      //         duration: 2000,
      //       });
      //     } else {
      //       this.$toast({
      //         message: this.$t('vip.redeemSuccess'),
      //         position: 'center',
      //         duration: 2000,
      //       });
      //     }
      //   }
      //   this.listenClose();
      // })
    },
    // 查询全网抵押数量
    handleAllNetStake() {
      try {
        const params = {
          code: 'newdexstaked',
          table: 'stat',
          scope: 'NDX',
          json: true,
        }
        axios.post(`${this.$store.state.sys.nodeList.eosNode.httpEndpoint}/v1/chain/get_table_rows`, JSON.stringify(params)).then((res) => {
          if (res.data.rows.length !== 0) {
            this.allStake = res.data.rows[0].total_staked;
            let rate = Decimal.div(Number(this.staked), Number(this.allStake.split(' ')[0]));
            rate = Decimal.mul(rate, 100).toString();
            if (rate > 0.001) {
              this.rate = Number(rate).toFixed(4);
              return;
            }
            this.rate = Number(rate).toFixed(8);
          }
        });
      } catch (error) {
        setTimeout(() => {
          this.handleAllNetStake();
        }, 200);
      }
    },
    // 查询账户抵押信息
    handleStakeInfo() {
      try {
        const params = {
          code: 'newdexstaked',
          table: 'stakes',
          scope: this.$store.state.app.accountInfo.encodeName,
          lower_bound: this.$store.state.app.accountInfo.chain,
          upper_bound: this.$store.state.app.accountInfo.chain,
          json: true,
        }
        axios.post(`${this.$store.state.sys.nodeList.eosNode.httpEndpoint}/v1/chain/get_table_rows`, JSON.stringify(params)).then((res) => {
          if (res.data.rows.length !== 0) {
            const row = res.data.rows[0];
            this.accountStakedAll = toFixed(Decimal.div(row.total_staked, 10000), 4); // 账户全部抵押
            this.staked = toFixed(Decimal.div(row.self_staked, 10000), 4); // 已抵押数量 - 自己
            this.stakedOther = toFixed(Decimal.div(row.staked_to_others, 10000), 4); // 已抵押数量 - 他人
            this.unstakeing = toFixed(Decimal.div(row.refunding, 10000), 4); // 赎回中
            this.otherStaked = toFixed(Decimal.sub(this.accountSum, this.staked), 4); // 他人替自己抵押数量
            // this.accountSum = toFixed(Decimal.add(this.staked, this.stakedOther), 4);

            const zone = moment().zone() / 60; // 计算时区
            const redeemTime = moment(res.data.rows[0].release_time).add(0 - zone, 'hours').format('YYYY/MM/DD HH:mm:ss'); // 赎回时间
            if (new Date(redeemTime) > new Date()) {
              this.handleRedeemTimer(redeemTime)
            } else if (parseFloat(this.unstakeing) > 0) {
              this.releaseNow = this.unstakeing; //立即释放
              this.unstakeing = 0;
            }
          }
        });
      } catch (error) {
        setTimeout(() => {
          this.handleStakeInfo();
        }, 200);
      }
    },
    // 获取账户余额
    async handleGetBalance() {
      if (!this.isMortgageNDX) {
        this.handleStakeInfo();
        return;
      }
      try {
        window.clearTimeout(this.balanceTimer);
        const params = {
          code: 'newdexissuer',
          symbol: 'NDX',
          account: this.$store.state.app.accountInfo.account
        }
        const balance = await DApp.getBalance(params);
        if (balance || balance === 0) {
          this.balance = balance;
          this.handleDealAbleStake();
          this.handleStakeInfo();
        } else {
          this.balance = `0.0000 ${params.coin}`;
        }
        this.balanceTimer = window.setTimeout(() => {
          this.handleGetBalance();
        }, 3000);
        // DApp.getCurrencyBalance(params, (err, data) => {
        //   this.balance = data;

        //   this.handleDealAbleStake();
        //   this.handleStakeInfo();

        //   this.balanceTimer = window.setTimeout(() => {
        //     this.handleGetBalance();
        //   }, 3000);
        // });
      } catch (error) {
        setTimeout(() => {
          this.handleGetBalance();
        }, 200);
      }
    },
    // 赎回倒计时
    handleRedeemTimer(date) {
      window.clearTimeout(this.countdownTimer);
      this.countdownTime = countdown(date);
      if (new Date(date) <= new Date()) {
        this.releaseNow = this.unstakeing; //立即释放
        this.unstakeing = '0.0000';
        return;
      }
      this.countdownTimer = window.setTimeout(() => {
        this.handleRedeemTimer(date)
      }, 1000);
    },
    // 账户存在判断
    handleGetAccount(callback) {
      // 非替他人抵押 - 不查询
      if (this.tab !== 2) {
        callback(null)
        return;
      }
      // 替他人抵押 - 验证账户存在
      const chainNode = `${this.blockchain}Node`;
      const params = {
        account_name: this.stakefor,
      }
      axios.post(`${this.$store.state.sys.nodeList[chainNode].httpEndpoint}/v1/chain/get_account`, JSON.stringify(params)).then((result) => {
        const res = result.data;
        if (res.account_name === this.stakefor) {
          callback(null);
          return;
        }
        callback('error');
      }).catch(() => {
        callback('error');
      });
    },
  },
  beforeDestroy() {
    window.clearTimeout(this.balanceTimer);
    window.clearTimeout(this.countdownTimer);
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

input::-webkit-input-placeholder{
  color: $color-999;
}

.nodeTipDiv{
  // display: flex;
  // align-items: center;
  font-size: .21rem;

  &.otherStaked{
    margin-bottom: .1rem;
    color: $color-yellow;
  }

  .nodeTip{
    font-size: .4rem;
    margin-right: .05rem;
  }
}

.mortgage{
  border-radius: .12rem;
  position: relative;
  width: 6.5rem;
  margin: auto;
  padding: .25rem .45rem;
  background: #fff;
  box-sizing: border-box;

  .back{
    position: absolute;
    left: .2rem;
    top: .2rem;
    transform: rotate(180deg);
    font-size: .25rem;
  }

  .close{
    position: absolute;
    right: .24rem;
    top: .24rem;
    color: $color-333;
    font-size: .21rem;
  }

  .content{
    font-size: .25rem;
    // overflow: hidden;

    &.isUnstakeContent{
      padding-top: .3rem;
    }

    .title{
      text-align: center;
      color: $color-this;
      font-size: .32rem;
      padding-bottom: .3rem;

      &.isUnstake{
        padding-bottom: .21rem;
      }
    }

    // 赎回信息
    .unstakedInfo{
      background: rgba(242,219,164,0.35);
      border-radius: .04rem;
      height: .55rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 .22rem;
      color: #F5A623;
      font-size: .21rem;
    }

    .tab{
      display: flex;
      text-align: center;
      font-size: .24rem;

      &>div{
        flex: 1;
        box-sizing: border-box;
        height: .6rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #F2F2F2;
        color: $color-999;
        border: 1px solid transparent;
        border-radius: .05rem 0 0 .05rem;

        &:nth-child(2){
          border-radius: 0 .05rem .05rem 0;
        }
      }

      .activedTab{
        background: #FFF;
        border: 1px solid #4A90E2;
        color: $color-this;
      }
    }

    .mortgageTip{
      padding-bottom: .2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: .21rem;
      padding: .17rem .2rem;
      height: 1.1rem;
      box-sizing: border-box;

      &.isUnstakeInfo{
        font-size: .25rem;
        height: auto;
      }

      &>div>div:last-child{
        margin-top: .04rem;
      }

      .allStaked{
        &>div:last-child{
          font-size: .25rem;
        }
      }

      .stakedList{
        text-align: right;
      }

      .detail{
        color: $color-this;
        font-size: .24rem;
      }
    }

    .inputDiv{
      overflow: hidden;
      margin-bottom: .3rem;

      .hasNum{
        padding-right: .2rem;
      }

      .input{
        box-sizing: border-box;
        border: 1px solid $color-input;
        width: 100%;
        height: .73rem;
        border-radius: .0417rem;
        padding-left: .2rem;
        font-size: .28rem;
        margin-bottom: .1rem;
      }
    }

    .otherAccount{
      margin-top: .13rem;
      display: flex;
      border: 1px solid $color-input;
      margin-bottom: .21rem;
      border-radius: .0417rem;
      overflow: hidden;

      &>div{
        display: flex;
        align-items: center;
        justify-content: center;
        height: .7rem;
        box-sizing: border-box;
        position: relative;
        background-color: #F2F2F2;

        &.error{
          border: 1px solid $color-red;
        }

        &:nth-child(1) {
          margin-right: .06rem;
          padding: 0rem .2rem;

          .more{
            display: block;
            border: .1rem solid transparent;
            border-top: .1rem solid $color-333;
            margin-left: .12rem;
            transform: translate(0, .05rem);

            &.show{
              transform: translate(0, -.05rem) rotate(180deg);
            }
          }

          .selectMenu{
            background: white;
            box-shadow: 0px 0px .07rem rgba(74, 144, 226, .31);
            width: 1.72rem;
            position: absolute;
            left: 0rem;
            top: .85rem;
            border-radius: .13rem;
            padding: 0rem 0rem;
            text-align: center;
            box-sizing: border-box;
            z-index: 1000;

            &::after{
              content: '';
              border: .1rem solid white;
              position: absolute;
              top: -.1rem;
              right: 50%;
              box-shadow: 0px 0px .07rem rgba(74, 144, 226, .31);
              transform: translate(50%, 0) rotate(45deg);
            }

            .select{
              position: relative;
              z-index: 10;;
              background: #FFF;
              font-size: .25rem;
              border-radius: .13rem;
              max-height: 3rem;
              overflow: auto;
              padding: 0px .13rem;

              &>div{
                // line-height: .86rem;
                height: .86rem;
                border-bottom: 1px solid $color-e3e3e3;
                display: flex;
                justify-content: center;
                align-items: center;

                &:last-child{
                  border-bottom: 0px solid $color-e3e3e3;
                }
              }
            }
          }
        }
        &:nth-child(2) {
          flex: 1;
          overflow: hidden;

          &>.input{
            width: 100%;
            height: 100%;
            font-size: .28rem;
            padding-left: .14rem;

            &.account{
              display: flex;
              align-items: center;
              background: #FFF;
              color: #9B9B9B;
            }
          }
        }
      }
    }

    .btnDiv{
      margin-top: .1rem;
      margin-bottom: .24rem;

      .btn{
        width: 100%;
        background: #4A90E2;
        border-radius: .1rem;
        font-size: .27rem;
        height: .8rem;
        color: #FFF;

        &.bgcolor-999{
          background: $color-999;
        }
      }
    }

    .showNDXDetail{
      margin-top: .15rem;
      color: $color-this;
      display: flex;
      align-items: center;
      // justify-content: flex-end;

      .direction{
        float: right;
        font-size: .23rem;
        transform: rotate(-90deg);
        margin-left: .08rem;
        font-weight: bold;
      }

      .directionOpen{
        transform: rotate(90deg);
      }
    }
  }

  .open{
    padding: .36rem 0px .25rem 0px;
  }

  // 路由页面样式
  &.isRoute{
    width: 100%;
    padding: 0rem .4rem;
    background: transparent;

    .checkbox{
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: .78rem;
      margin-bottom: .2rem;
      font-size: .27rem;

      &>div{
        display: flex;
        align-items: center;
        .checkBox{
          height: .3rem;
          width: .3rem;
          border: 1px solid $color-input;
          border-radius: .0412rem;
          margin-right: .12rem;
        }
        .icon-huaban57{
          font-size: .3rem;
          color: $color-this;
          border: 1px solid transparent;
        }
      }
    }

    .mortgageTip{
      margin-bottom: .2rem;
      font-size: .25rem;
    }
    .showNDXDetail{
      margin-top: .54rem;
      color: $color-333;
    }
    .open{
      padding-top: .2rem;
    }
    .nodeTipDiv{
      font-size: .24rem;
    }
    .isUnstakeInfo{
      margin-bottom: 0;
    }
    .isUnstakeContent{
      padding-top: .09rem;

      .unstakedInfo{
        background: #faf3df;
        height: .7rem;
        font-size: .25rem;
      }
    }
    .checkbox{
      padding: 0 .5rem;
    }
  }
}
.myToast {
  position: absolute;
  top: 50%;
  left: 50%;
  background: rgba(0, 0, 0, .75);
  padding: .12rem .25rem;
  transform: translate(-50%, -50%);
  border-radius: .08rem;
  color: #FFF;
  font-size: .18rem;
  max-width: 5rem;
}
// vue过渡动画
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to{
  opacity: 0;
}

.popup{
  border-radius: .18rem;
}
</style>
