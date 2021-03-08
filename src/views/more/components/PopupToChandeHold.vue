<template>
  <div class="hold">
    <span class="iconfont icon-huaban17 popupClose" @click="handleClosePopup"></span>
    <div class="title">
      {{ `${chooseItem.symbol1.toUpperCase()}/${chooseItem.symbol2.toUpperCase()}` || '—' }}
      {{ $t('profit.profit') }}
    </div>
    <div class="content">
      <div class="item">
        <div class="subTitle">
          <span @click="showDetail = !showDetail">
            <span>{{ $t('profit.costPrice') }}</span><span
              class="coin">({{ chooseItem.symbol2.toUpperCase() || '—' }})</span>
          </span>
          <span class="iconfont icon-huaban31 detail" @click="showDetail = !showDetail"
            v-if="$route.name === 'linek'">
            <span v-if="showDetail"></span>
          </span>
          <div v-if="showDetail" class="showDetail" @click="showDetail = !showDetail">
            {{ $t('profit.detail') }}
          </div>
        </div>
        <div class="subContent hasInput">
          <div class="changeDiv">
            <div>
              <input v-focus ref="input" v-if="!change" v-model="newPrice" @blur="handleBlur" class="input" type="number">
              <div v-else class="input inputDiv">{{ chooseItem.costPrice || '—' }}</div>
            </div>
            <div @click="handleChangeToSave"
              :class="{'showChange': Number(chooseItem.balance) !== 0}"
              v-if="Number(chooseItem.balance) !== 0" class="changeBtn">
              <span v-if="change">
                <span>{{ $t('profit.change') }}</span><span style="visibility: hidden;">></span>
              </span>
              <span v-else>
                <span>{{ $t('profit.save') }}</span><span style="visibility: hidden;">></span>
              </span>
            </div>
          </div>
          <!-- <div class="num newPrice">
            {{ chooseItem.realTimePrice || handleToFixed(0, chooseItem.priceScale || 4) }}
          </div> -->
        </div>
      </div>

      <div class="item">
        <div class="subTitle">
          <span>
            <span>{{ $t('profit.newPrice') }}</span><span
              class="coin">({{ chooseItem.symbol2.toUpperCase() || '' }})</span>
          </span>
        </div>
        <div class="subContent">
          <div class="newPrice num">
            {{ chooseItem.realTimePrice || handleToFixed(0, chooseItem.priceScale || 4) }}
          </div>
        </div>
      </div>

      <div class="item">
        <div class="subTitle">
          <span>
            <span>{{ $t('profit.balance') }}</span><span
              class="coin">({{ chooseItem.symbol1.toUpperCase() || '' }})</span>
          </span>
        </div>
        <div class="subContent">
          <div class="newPrice num">{{ chooseItem.balance || '—' }}</div>
        </div>
      </div>

      <div class="item">
        <div class="subTitle">{{ $t('profit.profitShort') }}</div>
        <div class="subContent">
          <div class="newPrice num"
            :class="{'color-green': chooseItem.profit > 0, 'color-red': chooseItem.profit < 0}">
            <span v-if="chooseItem.profit > 0">+</span><span>{{ chooseItem.profit || ''}}</span>
            <span class="coin">{{ chooseItem.symbol2.toUpperCase() || ''}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="toAll" @click="handleToAll" v-if="$route.name !== 'profitStatistics'">
      {{ $t('profit.allProfit') }}></div>
  </div>
</template>

<script>
import { toFixed } from '@/utils/public';
import { accountToSign } from '@/utils/publicApi';

export default {
  data() {
    return {
      showDetail: false,
      change: true,
      newPrice: '',
    }
  },
  props: [
    'chooseItem',
  ],
  watch: {
    chooseItem() {
      this.handleMouted();
    },
    newPrice(newVal, oldVal) {
      if (newVal >= 100000000) {
        this.newPrice = oldVal;
      }
    }
  },
  directives: {
    focus: {
      // 指令的定义
      inserted: (el) => {
        el.focus()
      }
    }
  },
  mounted() {
    this.handleMouted();
  },
  methods: {
    handleMouted() {
      this.newPrice = this.chooseItem.costPrice || '';
      this.change = !this.chooseItem.changeType;
      setTimeout(() => {
        if (!this.change) {
          this.$refs.input.focus();
        }
      }, 200);
    },
    // 失去焦点
    handleBlur() {
      if (Number(this.newPrice) < 0) {
        this.newPrice = toFixed(0, this.chooseItem.priceScale);
        return;
      }
      this.newPrice = toFixed(this.newPrice, this.chooseItem.priceScale);
    },
    // 数字格式华
    handleToFixed(n, l) {
      return toFixed(n, l);
    },
    // 关闭弹窗
    handleClosePopup() {
      this.$emit('listenClose', false);
    },
    // 去全部盈亏
    handleToAll() {
      this.$router.push({
        name: 'profitStatistics'
      })
    },
    // 修改保存
    handleChangeToSave() {
      if (this.change) {
        this.change = !this.change;
        return;
      }
      const params = {
        id: this.chooseItem.id,
        costPrice: this.newPrice,
      };
      this.$emit('listenChangeData', params); // 外侧数据改变 - 或者外部重新请求接口
      this.$http.post('/exchangeAccountProfit/updateCostPrice', params).then((res) => {
        if (res.code === 401) {
          this.$toast({
            message: res.msg,
            position: 'center',
            duration: 2000,
          });
          setTimeout(() => {
            accountToSign(this, () => {
              this.handleChangeToSave();
            });
          }, 1000);
          return;
        }
        if (res.code !== 0) {
          this.$toast({
            message: res.msg,
            position: 'center',
            duration: 2000,
          });
          return;
        }
        this.change = !this.change;
      });
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.hold{
  background: #FFF;
  border-radius: .12rem;
  width: 6rem;
  padding: .32rem .55rem;
  box-sizing: border-box;
  position: relative;
  font-size: .25rem;
  text-align: left;

  .popupClose{
    position: absolute;
    right: .3rem;
    top: .3rem;
    color: $color-999;
    font-size: .22rem;
  }
  .title{
    text-align: center;
    font-size: .32rem;
    color: $color-333;
    margin-bottom: .3rem;
  }

  .content{
    .coin{
      font-size: .21rem !important;
    }
    .item{
      margin-bottom: .3rem;

      &:last-child{
        margin-bottom: 0px;
      }
    }
    .num{
      font-size: .3rem !important;
    }

    .subTitle{
      display: flex;
      align-items: center;
      align-items: flex-end;
      padding-left: .1rem;
      color: $color-999;
      position: relative;

      .detail{
        font-size: .25rem;
        position: relative;
        margin-left: .08rem;

        &>span{
          content: '';
          position: absolute;
          border: 10px solid #F3F3F3;
          top: .35rem;
          left: 50%;
          transform: translate(-50%, 0) rotate(-45deg);
        }
      }

      .showDetail{
        position: absolute;
        width: 4.87rem;
        background: #F3F3F3;
        transform: translate(-50%, .32rem);
        padding: .2rem;
        left: 50%;
        top: .12rem;
        border-radius: .04rem;
        color: $color-333;
        z-index: 1000;
      }
    }

    .subContent{
      margin-top: .08rem;

      &.hasInput{
        margin-top: 0rem;
      }
      .changeDiv{
        display: flex;
        margin-bottom: .04rem;

        &>div{
          flex: 1;
          display: flex;
          align-items: center;
        }

        &>div:first-child{
          flex: 4;
          margin-right: .2rem;

          .input{
            margin-top: .08rem;
            width: 100%;
            border: 1px solid $color-input;
            height: .54rem;
            font-size: .3rem;
            border-radius: .08rem;
            padding-left: .07rem;
            box-sizing: border-box;

            &.inputDiv{
              border: 1px solid transparent;
              display: flex;
              align-items: center;
            }
          }
        }

        .changeBtn{
          color: $color-this;
          visibility: hidden;
          justify-content: flex-end;

          &.showChange{
            visibility: visible;
          }
        }
      }

      .newPrice{
        padding-left: .1rem;
      }
    }
  }

  .toAll{
    margin-top: .15rem;
    color: $color-this;
    text-align: right;
  }
}
</style>
