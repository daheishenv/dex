<template>
  <div class="rules">
    <div class="iconfont icon-huaban17 close" @click="handleClose"></div>
    <div class="title">{{$t('PX.PX12')}}</div>
    <div class="content">
       <div>1{{$t('PX.PX51')}}{{$t('PX.PX13')}}</div>
      <div>2{{$t('PX.PX51')}}{{$t('PX.PX14')}}</div>
      <div v-if="$store.state.app.language === 'zh-CN' || $store.state.app.language === 'zh-TW'">
        <div>3{{$t('PX.PX51')}}<span class="blue">{{$t('PX.PX58')}}</span>{{$t('PX.PX59')}}</div>
      </div>
      <div v-else>
        <div>3{{$t('PX.PX51')}}Users with <span class="blue">{{$t('PX.PX58')}}</span>{{$t('PX.PX59')}}</div>
      </div>
      <div v-if="$store.state.app.language === 'zh-CN' || $store.state.app.language === 'zh-TW'">
        <div>4{{$t('PX.PX51')}}{{$t('PX.PX56')}}<span class="blue">{{$t('PX.PX57')}}</span>{{$t('PX.PX60')}}</div>
      </div>
      <div v-else>
        <div>4{{$t('PX.PX51')}}{{$t('PX.PX56')}} <span class="blue">{{$t('PX.PX57')}}</span> {{$t('PX.PX60')}}</div>
      </div>
      <div>5{{$t('PX.PX51')}}{{$t('PX.PX17')}}</div>
      <div>6{{$t('PX.PX51')}}{{$t('PX.PX18')}}</div>
      <div class="spt">{{$t('PX.PX19')}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'rules',
  methods: {
    handleClose() {
      this.$emit('listenClose', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.rules{
  width: 5.50rem;
  position: relative;
  padding: .25rem .38rem .48rem;
  box-sizing: border-box;
  .close{
    position: absolute;
    right: .2rem;
    top: .2rem;
    font-size: .18rem;
    color: #333;
  }
  .title{
    font-size: .30rem;
    color: #3E57D3;
    text-align: center;
  }
  .content{
    &>div{
      margin-top: .25rem;
    }
    .spt{
      margin-top: .42rem;
      font-size: .24rem;;
      color: #999999;
    }
  }
  .blue{
    color: #5845F5;
  }
}
</style>
