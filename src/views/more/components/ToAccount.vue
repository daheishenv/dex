<template>
  <div class="account">
    <div class="title">Newdex{{ $t('more.toAccount') }}</div>
    <div class="listDiv">
      <div class="input" @click.stop="select = !select">
        <span class="accountName fl">{{ handleDealLongStr(exchangeEosAccount) }}</span>
        <span class="tip chainChoose">
          <span>{{ accountChain }}{{ $t('more.main') }}</span>
          <span class="iconfont icon-huaban11 toShow" :class="{'toHidden': select}"></span>
        </span>
      </div>
      <div class="selectMenu" v-if="select">
        <div class="select" v-if="select">
          <div class="input" v-for="(item, $index) in coldWallet" :key="$index" @click="handleChoose($index)">
            <span class="accountName fl">{{ handleDealLongStr(newAccountList[$index] || '') }}</span>
            <span class="tip chainChoose">
              <span style="margin-right: .37rem">{{ $index.toUpperCase() }}{{ $t('more.main') }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="what color-999">
      <div class="whatTitle" @click="show = !show">
        <span class="color-this">{{ $t('more.what') }}</span>
      </div>
      <div class="content color-333" v-if="show && accountChain !== 'EOS'">
        {{ $t('more.content1') }}{{ accountChain }}{{ $t('more.content1_1') }}
        {{ $t('more.content2') }}
        {{ $t('more.content3') }}
        {{ coldWallet[accountChain.toLowerCase()] ? $t('more.content4') : '' }}
        <p v-if="coldWallet[accountChain.toLowerCase()]"><a
          class="color-this"
          @click="handleToBrowser(coldWallet[accountChain.toLowerCase()], accountChain.toLowerCase(), 'account')">
          {{ coldWallet[accountChain.toLowerCase()] }}
          </a>
        </p>
      </div>
      <div class="content color-333" v-if="show && accountChain === 'EOS'">
        {{ $t('more.contentEos') }}
        <p v-if="coldWallet[accountChain.toLowerCase()] && accountChain.toLowerCase() !== 'eos'"><a
          class="color-this"
          @click="handleToBrowser(coldWallet[accountChain.toLowerCase()], accountChain.toLowerCase(), 'account')">
          {{ coldWallet[accountChain.toLowerCase()] }}
          </a>
        </p>
      </div>
    </div>
    <div class="btnDiv">
      <button class="btn" @click="handleSearchAction">{{ $t('public.detail') }}</button>
      <button class="btn close" @click="handleClose">{{ $t('public.close') }}</button>
    </div>
    <a :href="`https://eospark.com/account/${coldWallet[accountChain.toLowerCase()]}`" ref="lotion"></a>
  </div>
</template>

<script>
import { toBrowser, dealLongStr } from '@/utils/public';

export default {
  data() {
    return {
      exchangeEosAccount: '', // 账户
      accountChain: 'EOS',
      show: true,
      select: false,
      coldWallet: {
        eos: 'newdexiocold',
        bos: '',
        meetone: '',
        enu: '',
      },
      newAccountList: {},
    }
  },
  props: [
    'showAccount'
  ],
  created() {
    this.coldWallet = this.$store.state.sys.coldWallet;
    const obj = this.$store.state.sys.toAccountList;
    const keys = Object.keys(obj);
    keys.forEach((item) => {
      if (obj[item] && obj[`chain-${item}`]) {
        obj[item] = obj[`chain-${item}`];
      }
    })
    this.newAccountList = obj;
  },
  mounted() {
    this.accountChain = this.$store.state.app.accountInfo.chain.toUpperCase();
    this.exchangeEosAccount = this.newAccountList[this.$store.state.app.accountInfo.chain];
  },
  methods: {
    handleDealLongStr(str) {
      return dealLongStr(str)
    },
    handleToBrowser(id, chain, type) {
      toBrowser(id, chain, type, this.$embed)
    },
    // 选择收款账户
    handleChoose(key) {
      this.exchangeEosAccount = this.newAccountList[key];
      this.accountChain = key.toUpperCase();
      this.select = !this.select;
    },
    // 关闭弹窗
    handleClose() {
      this.$emit('listenCloseAccount', false);
    },
    // 查看详情
    handleSearchAction() {
      const chain = this.accountChain.toLowerCase();
      const account = this.newAccountList[chain];
      toBrowser(account, chain, 'account', this.$embed);
    },
  },
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.account{
  font-size: .32rem;
  width: 6.42rem;
  // height: 3.03rem;
  border-radius: .12rem;
  text-align: center;
  padding: .32rem;
  box-sizing: border-box;

  .title{
    color: $color-this;
    margin-bottom: .32rem;
  }

  .listDiv{
    position: relative;
  }

  .input{
    border: 1px solid $color-e3e3e3;
    height: .73rem;
    display: flex;
    align-items: center;/*垂直居中*/
    justify-content: center;/*水平居中*/
    padding: 0px .17rem;
    border-radius: .05rem;

    .accountName{
      flex: 1;
      text-align: left;
    }

    .tip{
      font-size: .3rem;
      flex: 1;
      text-align: right;
      color: $color-999;
    }

    .chainChoose{
      display: flex;
      align-items: center;/*垂直居中*/
      justify-content: flex-end;

      &>span:nth-child(1){
        margin-right: .1rem;
      }

      .toShow{
        font-size: .25rem;
        transform: rotate(90deg);
      }

      .toHidden{
        transform: rotate(-90deg);
      }
    }
  }

  .selectMenu{
    width: 100%;
    background: white;
    box-shadow: 0px 0px .07rem rgba(74, 144, 226, .31);
    position: absolute;
    top: .95rem;
    border-radius: .13rem;
    padding: 0rem .1rem;
    text-align: center;
    box-sizing: border-box;

    &::after{
      content: '';
      // border: 10px solid transparent;
      border: .1rem solid white;
      position: absolute;
      top: -.1rem;
      right: .25rem;
      box-shadow: 0px 0px .07rem rgba(74, 144, 226, .31);
      transform: rotate(45deg);
    }
  }
  .select{
    position: relative;
    background: #FFF;
    z-index: 1;
    width: 100%;
    border-radius: .15rem;
    border-bottom: 1px solid $color-e3e3e3;
    overflow: hidden;
    background: #FFF;
    box-sizing: border-box;

    &.mt20{
      margin-top: .1rem;
    }

    .input{
      padding: 0px .07rem;;
      border-radius: .0rem;
      border: 0px;
      border-bottom: 1px solid $color-e3e3e3;

      &:last-child{
        border-bottom: 0px solid $color-e3e3e3;
      }
    }
  }

  .what{
    text-align: left;
    font-size: .28rem;
    padding: 0px .17rem;

    .whatTitle{
      display: flex;
      align-items: center;/*垂直居中*/
      height: .8rem;

      .icon{
        margin-left: .1rem;
        font-size: .14rem;
      }
    }

    .content{
      margin-bottom: .3rem;
    }
  }

  .btnDiv{
    margin-top: .2rem;
    display: flex;

    .btn{
      flex: 1;
      height: .68rem;
      line-height: .68rem;
      border-radius: .12rem;
      font-size: .25rem;
      color: white;
      background: $color-blue;
    }

    .close{
      margin-left: .1rem;
      background: $color-999;
    }
  }
}
</style>
