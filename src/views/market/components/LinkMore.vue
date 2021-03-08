<template>
  <div class="linkMore" >
    <div :class="{mask: select}" @click="select = false"></div>
    <span class="iconfont icon-huaban128 icon" @click.stop="select = !select"></span>
    <div class="selectMenu" v-if="select">
      <div class="select color-333">
        <div class="selectItem" v-if="$appName === 'eosNewdex' && !$embed" @click.stop="handleSelected(0)">
          <i class="iconfont icon-huaban93 selectIcon"></i>
          <span>{{ $t('lineK.profit') }}</span>
        </div>
        <div class="selectItem" v-if="$appName === 'eosNewdex' && !$embed" @click.stop="handleSelected(1)">
          <i class="iconfont icon-huaban89 selectIcon"></i>
          <span>{{ $t('lineK.dealTip') }}</span>
        </div>
        <div class="selectItem" v-show="website" @click.stop="handleSelected(2)"><i class="iconfont icon-huaban118 selectIcon"></i>
        <span>{{$t('lineK.projectWebsite')}}</span>
        </div>
        <!-- <div class="selectItem" @click.stop="handleToFreeCpu"
          v-if="channelRef !== 'h5' && $store.state.app.accountInfo && $store.state.app.accountInfo.chain === 'eos'">
          <i class="iconfont icon-huaban147 selectIcon"></i>
          <span>{{$t('vip.freeCpu')}}</span>
        </div> -->
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      select: false,
      channelRef: 'dapp',
    }
  },
  props: {
    website: {
      type: String
    }
  },
  mounted() {
    this.channelRef = localStorage.getItem('channelRef');
  },
  methods: {
    handleSelected(type) {
      this.$emit('listenSelected', type)
    },
    // 免费CPU
    handleToFreeCpu() {
      if (this.$store.state.app.accountInfo.chain !== 'eos') {
        return;
      }
      this.$router.push({
        name: 'freeCpu'
      });
    },
  },
}
</script>
<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.linkMore{
  position: relative;
}
.mask{
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  // background: rgba(0,0,0,0.1);
}
.icon{
  font-size: 0.4rem;
  margin-left: 0.3rem;
}
.selectIcon{
  font-size: 0.36rem;
  margin-right: 0.14rem;
  // color: $color-this;
}
.icon-huaban118{
  font-size: 0.3rem;
}
.selectMenu{
  background: white;
  box-shadow: 0px 0px .07rem rgba(74, 144, 226, .31);
  position: absolute;
  right: 0;
  top: .58rem;
  border-radius: .13rem;
  text-align: center;
  box-sizing: border-box;
  z-index: 1055;
  // min-width: 1.6rem;

  &::after{
    content: '';
    border: .1rem solid white;
    position: absolute;
    top: -0.09rem;
    right: .15rem;
    box-shadow: 0px 0px .07rem rgba(74, 144, 226, .31);
    transform: rotate(45deg);
    z-index: 1050;
  }
  .select{
    position: relative;
    z-index: 1055;
    background: #FFF;
    font-size: .25rem;
    border-radius: .13rem;
    padding: 0 .2rem;
    .selectItem{
      display: flex;
      height: .86rem;
      border-bottom: 1px solid $color-e3e3e3;
      align-items: center;
      width: 100%;
      padding: 0rem .1rem;
      box-sizing: border-box;
      &:last-child{
        border-bottom: 0px solid $color-e3e3e3;
      }
      span{
        white-space: nowrap;
        // flex-shrink: 0;
      }
    }
  }
}
</style>
