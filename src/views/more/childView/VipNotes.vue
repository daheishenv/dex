<template>
  <div class="mainDiv">
    <!-- 标题 start -->
    <div class="title" v-if="this.$store.state.app.vipInfo">{{ $t('more.vipDetail') }}</div>
    <!-- <div class="title" v-if="this.$store.state.app.vipInfo && this.$store.state.app.vipInfo.level === 0">
      {{ $t('luckDraw.VipExclusive') }}</div> -->
    <!-- 标题 end -->
    <!-- 提醒次数 start -->
    <div class="tipList">
      <!-- 非会员 -->
      <!-- <div class="top" v-if="showToOpenVip">
        <div>
          <span>{{ $t('vip.openVip') }}</span>
          <span class="tip">{{ $t('vip.privilege') }}</span>
        </div>
        <div class="btn" @click="handleToVipDetail(false)">{{ $t('vip.openShort') }}</div>
      </div> -->
      <!-- 会员 -->
      <div class="top">
        <div>
          <span>{{ $t('vip.updataVip') }}</span>
          <span class="tip">{{ $t('vip.privilege') }}</span>
        </div>
        <div class="btn" @click="handleToVipDetail(true)">{{ $t('vip.updataShort') }}</div>
      </div>

      <!-- 提醒列表 -->
      <div class="listDetail"
        :class="{'anonymousDiv': $route.params.type === 'anonymous'}">
        <div class="item" :class="{'myLV': $store.state.app.vipInfo.level === $index}" v-for="(item, $index) in lvList"
          :key="$index">
          <div>
            <div>
              <div>VIP {{ item.level }}</div>
              <div class="myLvTip" v-if="$store.state.app.vipInfo.level === $index">{{ $t('vip.myLv') }}</div>
            </div>
          </div>
          <!-- 成交提醒次数列表 -->
          <div v-if="!$route.params.type || $route.params.type === 'transaction'">
            <div>
              <div>
                <span>{{ $t('vip.remindDay1') }}</span><span
                >{{ item.dealRemindCount }}</span><span
                >{{ $t('vip.remindDay2') }}</span>
              </div>
              <!-- <div v-if="$index === 0">{{ $t('vip.noRemind') }}</div> -->
            </div>
          </div>

          <!-- 行情提醒次数列表 -->
          <div v-if="$route.params.type === 'market'">
            <div>
              <div>
                {{ $t('marketTip.howCreate1') }}
                {{ item.marketRemindCount }}
                {{ $t('marketTip.howCreate2') }}
              </div>
              <!-- <div v-if="$index === 0">{{ $t('vip.noRemind') }}</div> -->
            </div>
          </div>

          <!-- 匿名交易 -->
          <div class="anonymous" :class="{'borderbottom': $index === 4}" v-if="$route.params.type === 'anonymous'">
            <div>
              <div v-if="$index === 2">{{ $t('vip.noRemind') }}</div>
              <div v-if="$index === 7">{{ $t('anonymous.ableAnonymous') }}</div>
              <!-- <div v-if="$index === 0">{{ $t('vip.noRemind') }}</div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 会员提醒次数 end -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      showToOpenVip: true,
      lvList: [],
    }
  },
  mounted() {
    if (this.$store.state.app.vipInfo && this.$store.state.app.vipInfo.level) {
      this.showToOpenVip = false;
    } else {
      this.showToOpenVip = true;
    }
    this.handleGetVipLvList();
  },
  methods: {
    // 获取会员等级列表
    handleGetVipLvList() {
      if (this.$appName !== 'eosNewdex') return;
      this.$http.get('/levelRule/list').then((res) => {
        if (res.code !== 0) {
          return;
        }
        this.lvList = res.ruleList;
      });
    },
    // 去vip详情
    handleToVipDetail(type) {
      this.$router.push({
        name: 'vipDetail',
        params: {
          show: type || false,
        }
      });
    },
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.mainDiv{
  font-size: .32rem;
  padding: 0px .3rem;

  .title{
    padding: .35rem .17rem;
    position: relative;

    &::before{
      content: '';
      position: absolute;
      height: .28rem;
      width: 0.04rem;
      background: #F6C85C;
      transform: translate(-50%, -50%);
      top: 50%;
      left: 0px;
    }
  }
}

// 提醒次数列表展示
.tipList{
  border-radius: .08rem;
  overflow: hidden;

  .top{
    padding: 0px .35rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 1.47rem;
    background: url('/static/img/more/vip-bg.png') no-repeat;
    background-size: cover;
    color: #F2DBA4;

    &>div{
      display: flex;
      align-items: center;

      .tip{
        margin-left: .1rem;
        font-size: .25rem;
      }
    }

    .btn{
      width: 1.8rem;
      justify-content: center;
      height: .74rem;;
      background-image: linear-gradient(0deg, #E5AE65 0%, #FFEA7A 100%);
      border-radius: 10px;
      color: #8C633E;
      font-size: .32rem;
    }
  }

  // 等级对应提醒次数列表
  .listDetail{
    font-size: .25rem;
    border: 1px solid $color-input;
    border-bottom-left-radius: .08rem;
    border-bottom-right-radius: .08rem;

    .item{
      display: flex;
      align-items: center;
      text-align: center;
      height: 1rem;

      &.myLV{
        color: #8B572A;
        background: rgba($color: #F2DBA4, $alpha: .2);
      }

      &:last-child{
        border-bottom-left-radius: .08rem;
        border-bottom-right-radius: .08rem;
        overflow: hidden;
      }

      &>div{
        flex: 2;
        height: 100%;
        border-bottom: 1px solid $color-input;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;

        .myLvTip{
          font-size: .21rem;
        }

        &:first-child{
          border-bottom: 1px solid $color-input;
        }

        &:last-child{
          flex: 3;
          display: flex;
          height: 100%;
          align-items: center;
          justify-content: center;
          border-left: 1px solid $color-input;
        }
      }

      &:last-child>div{
        &:last-child,
        &:first-child{
          border-bottom: 1px solid transparent;
        }
      }
    }

    &.anonymousDiv{
      .item{
        &>div:last-child{
          border-bottom: 1px solid transparent;
        }
      }
      .anonymous{
        background: #fafafa;

        &.borderbottom{
          box-sizing: border-box;
          border-bottom: 1px solid $color-input !important;
        }
      }
    }
  }
}
</style>
