<template>
  <div class="model">
    <span class="iconfont icon-huaban17 popupClose" @click="handleClose"></span>
    <!-- 领取box -->
    <div class="title">{{ $t('db.db17') }}</div>
    <div class="cont">
      <div class="itemTop">
        <div class="itemTwo">
          <!-- 已领取 -->
          <span>{{ $t('db.db4') }}: {{ userBoxInfo.claimed || '0.000000 BOX' }}</span>
        </div>
      </div>
    </div>
    <div class="tip" :class="{ enCls: $store.state.app.language === 'en' || $store.state.app.language === 'ko' }">
      <p>{{ $t('db.db18') }}</p>
      <p style="color:#999">
        {{ $t('db.db16') }} <span class="detail" @click="handleDetail">{{ $t('public.detail1') }}></span>
      </p>
      <!-- <p class="color-this" @click="handleToMortgage">{{$t('merge.stakeNdx')}} ></p> -->
    </div>
  </div>
</template>

<script>
import DApp from '@/utils/wallet';
import { getTableRows } from '@/utils/eosTable';
import { toFixed } from '@/utils/public';
import { Decimal } from 'decimal.js';
import axios from 'axios';
export default {
  data() {
    return {
      userBoxInfo: {
        // 用户 box 币信息
        quantity: null, // 可领取
        claimed: null, // 已领取
      },
      accountSum: '', // 当前账户抵押数量
      thisAllStake: '', // 全站抵押数量
      ratio: '', // 质押占比
    };
  },
  props: ['receiveBoxVisible'],
  watch: {
    receiveBoxVisible: function change(val) {
      if (val) {
        // 获取用户box信息
        this.handlerUserBoxInfo();
      }
    },
  },
  mounted() {
    // 当前账户抵押数量
    this.accountSum = toFixed(this.$store.state.app.vipInfo.ndxStaked, 4);
    // 获取用户box信息
    this.handlerUserBoxInfo();
    // 获取全站抵押数量
    this.handleAllNetStake();
  },
  computed: {},
  methods: {
    // 详情
    handleDetail() {
      const lang = this.$store.state.app.language;
      if (lang === 'ko') {
        window.location.href = 'https://support.newdex.net/hc/ko/articles/360052455232';
        return;
      }
      if (lang === 'zh-CN') {
        window.location.href = 'https://support.newdex.net/hc/zh-cn/articles/360052455232';
        return;
      }
      if (lang === 'zh-TW') {
        window.location.href = 'https://support.newdex.net/hc/zh-tw/articles/360052455232';
        return;
      }
      window.location.href = 'https://support.newdex.net/hc/en-us/articles/360052455232';
    },
    // 领取
    async handlerReceive() {
      // 暂无待领取数量
      if (!parseFloat(this.userBoxInfo.quantity)) {
        this.$toast(this.$t('db.db163'));
        return;
      }
      // 合约执行
      const fromName = this.$store.state.app.accountInfo.account;
      const permission = this.$store.state.app.accountInfo.permissions;
      const params = {
        actions: [
          {
            account: 'box.newdex',
            name: 'claim',
            authorization: [
              {
                actor: fromName, // 转账者
                permission: permission || 'active',
              },
            ],
            data: {
              owner: fromName,
            },
          },
        ],
      };
      const transferParams = {
        params,
        useFreeCpu: false,
      };
      const result = await DApp.transactionApi(transferParams);
      if (result && result.code !== 0) {
        DApp.handleScatterErrorBack(result, (type, text) => {
          type === 'lang' ? this.$toast(this.$t(text)) : this.$toast(text);
        });
        return;
      }
      this.$toast(this.$t('db.db164'));
      this.userBoxInfo.quantity = null;
      setTimeout(this.handlerUserBoxInfo, 2000);
      // DApp.transactionApi(objParams, (err, res) => {
      //   if (err) {
      //     DApp.handleScatterErrorBack(err, this);
      //   }
      //   if (res) {
      //     this.$toast(this.$t('db.db164'));
      //     this.userBoxInfo.quantity = null;
      //     setTimeout(this.handlerUserBoxInfo, 2000);
      //   }
      // });
    },
    // 获取用户BOX币种信息
    async handlerUserBoxInfo() {
      const scatter = this.$store.state.app.accountInfo;
      const formName = scatter.account;
      const params = {
        lower_bound: formName,
        upper_bound: formName,
        boundFormat: true,
        code: 'box.newdex',
        scope: 'box.newdex',
        table: 'dividends',
        limit: 1,
        json: true,
      };
      const items = await getTableRows(params);
      if (items && items.length > 0) {
        this.userBoxInfo = items[0];
      }
    },
    handleClose() {
      this.$emit('listenClose', false);
    },
    handleToMortgage() {
      this.$router.push({
        name: 'stakeNdx',
      });
    },
    // 查询全网抵押数量
    handleAllNetStake() {
      try {
        const params = {
          code: 'newdexstaked',
          table: 'stat',
          scope: 'NDX',
          json: true,
        };
        axios.post(`${this.$store.state.sys.nodeList.eosNode.httpEndpoint}/v1/chain/get_table_rows`, JSON.stringify(params)).then((res) => {
          if (res.data.rows.length !== 0) {
            this.thisAllStake = res.data.rows[0].total_staked;
            const radioNum = Decimal.div(this.accountSum, parseFloat(this.thisAllStake)).toString();
            const ratio = Decimal.mul(radioNum, 100).toString();
            if (ratio < 0.0001 && Number(ratio) !== 0) {
              this.ratio = '<0.0001';
            } else {
              this.ratio = toFixed(ratio, 4);
            }
          }
        });
      } catch (error) {
        setTimeout(() => {
          this.handleAllNetStake();
        }, 200);
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import '../../../assets/css/public.scss';

.model {
  color: #333;
  width: 7rem;
  font-size: 0.25rem;
  box-sizing: border-box;
  padding: 0.41rem 0.3rem;
  .popupClose {
    position: absolute;
    right: 0.2rem;
    top: 0.2rem;
    font-size: 0.18rem;
  }
  .title {
    color: #333;
    font-size: 0.32rem;
    text-align: center;
  }

  .title1 {
    margin: 0.05rem 0 0.08rem;
    font-size: 0.25rem;
    color: #999;
    text-align: center;
  }

  .cont {
    padding: 0.2rem 0.3rem;
    background: rgba(205, 228, 255, 0.42);
    margin-top: 0.2rem;
    .itemBottom {
      padding-top: 0.3rem;
    }
    .itemOne {
      margin-bottom: 0.15rem;
      span:nth-child(1) {
        margin-right: 0.15rem;
      }

      span:nth-child(2) {
        color: $color-blue;
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
    .itemTwo {
      color: #999;
    }
  }

  .tip {
    margin-top: 0.1rem;

    // padding-bottom: .4rem;
    color: #333;
    // height: 2.8rem;
    // overflow: scroll;
    .detail {
      color: $color-this;
    }
    p {
      line-height: 0.5rem;
      margin-bottom: 0.2rem;
    }
    .color-this {
      margin-top: 0.1rem;
    }

    &.enCls {
      p {
        line-height: 0.38rem;
      }
    }
  }

  .btnDiv {
    margin-top: 0.4rem;
    .btn {
      font-size: 0.25rem;
      background: $color-this;
      color: #fff;
      width: 100%;
      height: 0.8rem;
      border-radius: 0.1rem;
    }
  }
}
</style>
