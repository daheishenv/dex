<template>
  <div class="model">
    <span class="iconfont icon-huaban17 popupClose" @click="handleClose"></span>
    <div class="title">{{ $t('property.propertyCount') }}</div>
    <!-- net -->
    <div class="item">
      <!-- <div class="item-name">{{$t('property.bandwidth')}}：</div> -->
      <div class="item-content">
        <div>{{$t('property.bandwidth')}}：</div>
        <span :class="{'color-red': allPercent.netPercent >= 80}">{{ $t('property.used') }} {{ allPercent.netPercent }}%</span>
        <span>
          {{$t('property.used')}} {{netUsed?netUsed:'0'}}/{{$t('property.allCount')}} {{netTotal?netTotal:'0'}}
        </span>
        <span class="limit">({{allPercent.netFrozen?allPercent.netFrozen:'0'}} TRX)</span>
      </div>
    </div>
    <!-- energy -->
    <div class="item">
       <!-- <div class="item-name">{{$t('property.energy')}}：</div> -->
      <div class="item-content">
        <div>{{$t('property.energy')}}：</div>
        <span :class="{'color-red': allPercent.energyPercent >= 80}">{{ $t('property.used') }} {{ allPercent.energyPercent }}%</span>
            <span>
              {{$t('property.used')}} {{info.EnergyUsed?info.EnergyUsed:'0'}}/{{$t('property.allCount')}} {{info.EnergyLimit?info.EnergyLimit:'0'}}
            </span>
            <span class="limit">({{allPercent.energyFrozen?allPercent.energyFrozen:'0'}} TRX)</span>
      </div>
    </div>
    <div class="btnDiv">
      <button class="btn"
        @click="handleClose">{{ $t('public.sure') }}</button>
    </div>
  </div>
</template>

<script>

export default {
  computed: {
    netUsed() {
      const net = Number((this.info.freeNetUsed || 0) + (this.info.NetUsed || 0))
      return net
    },
    netTotal() {
      const total = Number((this.info.NetLimit || 0) + (this.info.freeNetLimit || 0))
      return total
    }
  },
  props: ['info', 'allPercent'],
  methods: {
    handleClose() {
      this.$emit('listenClose', false)
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.model{
  padding: .41rem .61rem;
  .popupClose{
    position: absolute;
    right: .2rem;
    top: .2rem;
    font-size: .18rem;
  }
  .title{
    color: $color-this;
    font-size: .36rem;
    text-align: center;
  }

  .item{
    margin-top: .3rem;
    text-align: left;
    line-height: .54rem;
    display: flex;
    font-size: .3rem;
    padding-left: .12rem;
    .item-name{
      width: 1.6rem;
      font-size: .28rem;
      flex-shrink: 0;
      text-align: right;
      margin-right: 0.3rem;
    }
    .item-content{
      display: flex;
      flex-direction: column;
    .limit{
      font-size: 0.25rem;
      color: #3A3949;
      }
    }

  }

  .btnDiv{
    margin-top: .4rem;
    .btn{
      font-size: .25rem;
      background: $color-this;
      color: #fff;
      width: 100%;
      height: .8rem;
      border-radius: .1rem;
    }
  }
}
</style>
