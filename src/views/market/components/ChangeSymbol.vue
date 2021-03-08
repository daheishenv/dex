<template>
  <div class="changeSymbol">
    <div class="area">
      <div class="topNav">
        <div>
          <span v-for="(item, $key) in $store.state.sys.newArea"
          :key="$key" @click="handleChangeAreaObj($key)"
            :class="{'navActived': activeObj.key === $key}">
            <i v-if="$key === 'self' && activeObj.key !== 'self'" class="iconfont icon-huaban29 favIcon"></i>
            <i v-if="$key === 'self' && activeObj.key === 'self'" class="iconfont icon-huaban29 favIcon"></i>
            <span :class="{'font': $store.state.app.language === 'en' || $store.state.app.language === 'ko'}">{{ $t(`navName.${$key}`) }}</span>
          </span>
        </div>
      </div>
      <div class="subNav" v-if="Object.keys($store.state.sys.newArea[activeObj.key]).length > 1">
        <div class="area" ref="areaDiv">
          <span class="color-999" v-for="(item, $index) in $store.state.sys.newArea[activeObj.key]"
            :class="{'color-this': activeObj.index === item.index}" :key="$index"
            @click="handleChangeAreaObj(activeObj.key, item.index)">
            <span class="textHidden">
              <span v-if="item.tabName === 'DEFI'">
                {{$t('marketDistribution.DeFi')}}
              </span>
              <span v-else-if="item.tabName !== 'resources'" :class="{'usds': $index === 'CUSD'}">{{ item.tabName }}</span>
              <span v-else>{{ $t(`resources.${item.tabName}`) }}</span>
            </span>
            <div :class="{'activityArea': activeObj.index === item.index}"></div>
          </span>
        </div>
      </div>
    </div>
    <div class="showDiv" :class="{'iosVh': isIOS, 'noSubNav': Object.keys($store.state.sys.newArea[activeObj.key]).length <= 1}">
      <div class="outTableDiv">
        <table-list @listenClose="listenClose"
          :activeObj="activeObj" @listenActiveObj="handleActiveObj"/>
      </div>
    </div>
  </div>
</template>

<script>
import TableList from '@/components/TableList';

export default {
  data() {
    return {
      isIOS: false,
      showRight: true,
      showLeft: true,

      activeObj: {
        key: 'EosMain',
        index: 0, // 当前选中排行榜
      },
    }
  },
  components: {
    TableList,
  },
  watch: {
  },
  created() {
    const keys = Object.keys(this.$store.state.sys.newArea)[1]
    if (this.$appName === 'eosNewdex') {
      this.activeObj = {
        key: 'EosMain',
        index: 0, // 当前选中排行榜
      }
    } else if (this.$appName === 'tronNewdex') {
      this.activeObj = {
        key: keys,
        index: 0, // 当前选中排行榜
      }
    }
  },
  mounted() {
    // 判断是否为ios
    const u = navigator.userAgent;
    this.isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端

    this.handlePositionSymbol();
  },
  methods: {
    listenClose() {
      this.$emit('listenClose', false);
    },
    // 处理跳转
    handleActiveObj(obj) {
      this.activeObj = obj;
    },
    // 切换分区
    handleChangeAreaObj($key, index) {
      this.activeObj = {
        key: $key,
        index: index || 0
      }
    },
    // 定位交易对分区位置
    handlePositionSymbol() {
      try {
        // 获取当前交易对所属分区
        let nowAreaKey = '';
        const symbolArr = this.$route.params.symbol;
        const allSymbolData = this.$store.state.app.allSymbolData;
        const keys = Object.keys(allSymbolData);
        keys.forEach((key) => {
          if (key === 'change') {
            return;
          }
          allSymbolData[key].forEach((item) => {
            if (symbolArr === item.symbol) {
              if (nowAreaKey !== 'self') {
                nowAreaKey = key;
              }
            }
          });
        });
        // 获取分区所属链
        const newArea = this.$store.state.sys.newArea;
        const allAreaKeys = Object.keys(newArea);
        allAreaKeys.forEach(($key) => {
          const subArr = Object.keys(newArea[$key]);
          subArr.forEach((item, $index) => {
            if (item.toLowerCase() === nowAreaKey) {
              this.activeObj = {
                key: $key,
                index: $index, // 当前选中分区
              }
            }
          });
        });
      } catch (error) {
        setTimeout(() => {
          this.handlePositionSymbol();
        }, 200);
      }
    }
  },
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .changeSymbol{
    // height: calc(100vh) !important;

    .showDiv{
      height: calc(100% - 1.5rem);
      overflow-y: auto;

      &.noSubNav{
        height: calc(100vh - 1rem);
      }
    }
  }
}

.fs{
  font-size: .32rem !important;
}

.changeSymbol{
  height: 100vh;
  width: 6.4rem;
  // overflow: auto;
  background: #fafafa;

  .showDiv{
    height: calc(100% - 1.5rem);
    overflow-y: auto;

    &.noSubNav{
      height: calc(100vh - 1rem);
    }
  }

  // .iosVh{
  //   height: calc(100% - 1.9rem);
  // }

  .area{
    font-size: .3rem;
    margin-bottom: .08rem;
    background: #FFF;

    .topNav{
      flex: 12;
      display: flex;
      align-items: center;/*垂直居中*/
      justify-content: center;
      position: relative;
      height: .9rem;

      &>div{
        height: .53rem;;
        min-width: 4.48rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: .25rem;
        color: #A9A8AF;

        &>span{
          flex: 1;
          height: 100%;
          min-width: 1.48rem;
          display: flex;
          justify-content: center;
          align-items: center;
          border-right: 1px solid $color-input;
          border: 1px solid $color-input;
          margin-left: -1px;

          .favIcon{
            font-size: .26rem;
            margin-right: .02rem;
          }

          .font{
            margin-top: .05rem;
          }

          &:first-child{
            border-top-left-radius: .05rem;
            border-bottom-left-radius: .05rem;
          }

          &:last-child{
            border-top-right-radius: .05rem;
            border-bottom-right-radius: .05rem;
          }

          &.navActived{
            background: $color-this;
            color: #fff;
            border: 1px solid $color-this;
            z-index: 10;
          }
        }
      }
    }

    .subNav{
      background: #FFF;

      .area{
        // width: 5.8rem;
        height: .52rem;
        font-size: .27rem;
        margin: auto;
        flex: 12;
        display: flex;
        align-items: center;/*垂直居中*/
        justify-content: space-between;
        position: relative;
        overflow: auto;
        text-align: center;

        .activityArea{
          position: absolute;
          width: .9rem;
          left: 50%;
          bottom: 0px;
          transform: translate(-50%, 0px);
          border-bottom: 2px solid $color-this;
        }

        &>span{
          width: 1.22rem;
          flex: 1;
          text-overflow: ellipsis;
          position: relative;
          box-sizing: border-box;
          padding: 0px .1rem;
          white-space: nowrap;
          display: flex;
          height: 100%;
          align-items: center;
          justify-content: center;

          .textHidden{
            width: 1.22rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            .usds{
              font-family: DINPro-Medium, IBMPlexSans-Medium, "Microsoft YaHei", Arial, sans-serif !important;
            }
          }
        }
        &>span:last-child{
          &::after{
            border: 0px solid $color-e3e3e3;
          }
        }
      }
    }

    .icon{
      font-size: .3rem;
      padding-right: .05rem;
    }
  }
}
.outTableDiv{
  background: #FFF;
}
</style>
