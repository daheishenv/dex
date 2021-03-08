<template>
  <div class="market" :class="{'isEmbed': isEmbed}">
    <div :class="{'toolsDiv': Object.keys($store.state.sys.newArea[activeObj.key]).length > 1}">
      <div class="tools">
        <div class="favorite">
          <span class="iconfont icon-huaban21 icon fl"
            @click="$router.push('/selfAreaSetting')"></span>
        </div>
        <div class="topNav">
          <div>
            <span v-for="(item, $key) in $store.state.sys.newArea"
            :key="$key" @click="handleChangeAreaObj($key)"
              :class="{'navActived': activeObj.key === $key}">
              <i v-if="$key === 'self' && activeObj.key !== 'self'" class="iconfont icon-huaban29 favIcon"></i>
              <i v-if="$key === 'self' && activeObj.key === 'self'" class="iconfont icon-huaban29 favIcon"></i>
              <span :class="{'font': $store.state.app.language === 'en' || $store.state.app.language === 'ko'}">
                {{ $t(`navName.${$key}`) }}</span>
            </span>
          </div>
        </div>
        <div class="search">
          <span class="iconfont icon-huaban137 icon fr" @click="handleToSearch"></span>
        </div>
      </div>
      <div class="subNav" v-if="Object.keys($store.state.sys.newArea[activeObj.key]).length > 1">
        <div class="area" ref="areaDiv" @scroll="handleScroll">
          <span class="color-999" v-for="(item, $index) in $store.state.sys.newArea[activeObj.key]"
            :class="{'color-this': activeObj.index === item.index}" :key="$index"
            @click="handleChangeAreaObj(activeObj.key, item.index)">
            <span v-if="item.tabName === 'DEFI'" class="newTag">
              <span>{{$t('marketDistribution.DeFi')}}</span>
              <span class="iconfont icon-huaban60 color-this newTip"></span>
            </span>
            <span v-else-if="item.tabName !== 'resources'" :class="{'usds': $index === 'CUSD'}">
              {{ item.tabName }}
            </span>
            <span v-else>{{ $t(`resources.${item.tabName}`) }}</span>
            <div :class="{'activityArea': activeObj.index === item.index}"></div>
          </span>
        </div>
      </div>
    </div>
    <div class="outTableDiv">
      <table-list
        :activeObj="activeObj" @listenActiveObj="handleActiveObj"/>
    </div>
  </div>
</template>

<script>
import TableList from '@/components/TableListSwiper';

export default {
  data() {
    return {
      activeObj: {
        key: 'EosMain',
        index: 0, // 当前选中排行榜
      },
      activeIndex: 1,
      channelRef: 'dapp',
      showLeft: false,
      showRight: true,
      isEmbed: false,
    };
  },
  components: {
    TableList, // 列表
  },
  watch: {
  },
  created() {
    this.channelRef = localStorage.getItem('channelRef');
    if (this.$appName === 'eosNewdex') {
      this.activeObj = {
        key: 'EosMain',
        index: 0, // 当前选中排行榜
      }
    } else if (this.$appName === 'tronNewdex') {
      const keys = Object.keys(this.$store.state.sys.newArea)[1]
      this.activeObj = {
        key: keys,
        index: 0, // 当前选中排行榜
      }
    }
  },
  mounted() {
    this.isEmbed = !!this.$route.meta.isEmbed;
    const hasFavorite = localStorage.getItem('hasFavorite') ? JSON.parse(localStorage.getItem('hasFavorite')) : false;
    if (hasFavorite) {
      this.activeObj = {
        key: 'self',
        index: 0,
      }
    }
    const historyActIndex = sessionStorage.getItem('historyActIndex') ? JSON.parse(sessionStorage.getItem('historyActIndex')) : null;
    if (historyActIndex) {
      this.activeObj = {
        key: historyActIndex.key,
        index: historyActIndex.index,
      }
    }
    if (this.$appName === 'eosNewdex') {
      this.handleMoutedEos(historyActIndex);
    } else if (this.$appName === 'tronNewdex') {
      this.handleMoutedTron(historyActIndex);
    }
  },
  methods: {
    // Eos项目执行代码
    handleMoutedEos(historyActIndex) {
      if (this.$store.state.app.accountInfo && this.$store.state.app.accountInfo.chain === 'eos' && !historyActIndex) {
        this.activeObj = {
          key: 'EosMain',
          index: 0,
        }
      }
      if (this.$store.state.app.accountInfo && this.$store.state.app.accountInfo.chain !== 'eos' && !historyActIndex) {
        if (this.$store.state.sys.newArea && this.$store.state.sys.newArea.EosSide) {
          const $index = this.$store.state.sys.newArea.EosSide.findIndex(item => item.toLowerCase() === this.$store.state.app.accountInfo.chain);
          this.activeObj = {
            key: 'EosSide',
            index: $index,
          }
        }
      }
      if (this.$route.params.type) {
        this.activeObj = {
          key: 'EosMain',
          index: 0,
        }
        sessionStorage.setItem('historyActIndex', JSON.stringify(this.activeObj)); // 设置离开时选中分区
      }
    },
    handleMoutedTron(historyActIndex) { // Tron项目执行代码
      const keys = Object.keys(this.$store.state.sys.newArea)[1]
      if (this.$store.state.app.accountInfo && this.$store.state.app.accountInfo.chain !== 'eos' && !historyActIndex) {
        if (this.$store.state.sys.newArea.Tron) {
          const $index = this.$store.state.sys.newArea.Tron.findIndex(item => item.toLowerCase() === this.$store.state.app.accountInfo.chain);
          this.activeObj = {
            key: keys,
            index: $index,
          }
        }
      }
      if (this.$route.params.type) {
        this.activeObj = {
          key: keys,
          index: 0,
        }
        sessionStorage.setItem('historyActIndex', JSON.stringify(this.activeObj)); // 设置离开时选中分区
      }
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
      sessionStorage.setItem('historyActIndex', JSON.stringify(this.activeObj)); // 设置离开时选中分区
    },
    // 分区滚动事件
    handleScroll() {
      const scrollWidth = this.$refs.areaDiv.scrollWidth;
      const clientWidth = this.$refs.areaDiv.clientWidth;
      const scrollLeft = this.$refs.areaDiv.scrollLeft;

      if (clientWidth + scrollLeft >= scrollWidth - 1) {
        this.showRight = false;
      } else {
        this.showRight = true;
      }

      if (scrollLeft < 10) {
        this.showLeft = false;
      } else {
        this.showLeft = true;
      }
    },
    // 跳转到搜索
    handleToSearch() {
      this.$router.push({
        name: this.isEmbed ? 'searchEmbed' : 'search'
      })
    }
  },
  beforeDestroy() {
    sessionStorage.setItem('historyActIndex', JSON.stringify(this.activeObj)); // 设置离开时选中分区
  }
}
</script>

<style scoped lang="scss">
@import "../../assets/css/public.scss";

@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .market{
    height: calc(100vh - 1.5rem) !important;

    &.isEmbed{
      height: calc(100vh - .5rem) !important;
    }
  }
}

.hidden{
  visibility: hidden;
}

.icon{
  font-size: .35rem;
}

.market{
  background: #fafafa;
  height: calc(100vh - 1rem);
  overflow: hidden;

  &.isEmbed{
    height: calc(100vh);
  }

  .toolsDiv{
    margin-bottom: .08rem;
  }

  .tools{
    display: flex;
    align-items: center;/*垂直居中*/
    background: #ffffff;
    box-sizing: border-box;
    padding: 0px .36rem;

    .favorite, .search{
      z-index: 11;
    }

    &>div{
      flex: 1;
      font-size: .32rem;
      height: .9rem;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      position: relative;
    }

    .topNav{
      flex: 12;
      display: flex;
      align-items: center;/*垂直居中*/
      justify-content: center;
      position: relative;

      &>div{
        height: .53rem;;
        min-width: 4.28rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: .25rem;
        color: #A9A8AF;

        &>span{
          flex: 1;
          height: 100%;
          min-width: 1.28rem;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1px solid $color-input;
          margin-left: -1px;

          .favIcon{
            font-size: .26rem;
            margin-right: .02rem;
          }

          .font{
            margin-top: .035rem;
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

    .icon{
      font-size: .32rem;
    }

  }

  .subNav{
    background: #FFF;

    .area{
      // width: 5.8rem;
      padding-top: 0.19rem;
      height: .54rem;
      font-size: .27rem;
      margin: auto;
      flex: 12;
      display: flex;
      align-items: center;/*垂直居中*/
      justify-content: space-between;
      position: relative;
      overflow: auto;
      text-align: center;

      .usds{
        font-family: DINPro-Medium, IBMPlexSans-Medium, "Microsoft YaHei", Arial, sans-serif !important;
      }

      .activityArea{
        position: absolute;
        width: .9rem;
        left: 50%;
        bottom: 0px;
        transform: translate(-50%, 0px);
        border-bottom: 2px solid $color-this;
      }

      &>span{
        flex: 1;
        position: relative;
        box-sizing: border-box;
        padding: 0px .3rem;
        white-space: nowrap;
        display: flex;
        height: 100%;
        align-items: center;
        justify-content: center;
      }
      &>span:last-child{
        &::after{
          border: 0px solid $color-e3e3e3;
        }
      }
    }
  }

  .outTableDiv{
    background: #ffffff;
  }
}
// footer 样式
.footer{
  font-size: .21rem;
  text-align: center;
  padding: .35rem 0rem;
}
.newTag {
  position: relative;
}
.newTip {
  position: absolute;
  right: -23px;
  top: -13px;
}
</style>
