<template>
  <div class="wrapper">
    <div style="margin-bottom: -3rem;">
      <MyHeader />
    </div>
    <div id="draw" class="draw">
      <TurnComp></TurnComp>
    </div>
  </div>
</template>
<script>
import TurnComp from './TurnComp';
import MyHeader from './MyHeader';

export default {
  components: {
    TurnComp,
    MyHeader,
  },
  data() {
    return {
    };
  },
  methods: {
  },
  mounted() {
  },
  beforeDestroy() {
  },
};
</script>
<style lang="scss" scoped>
.draw {
  padding: 0 .2rem 1rem;
  z-index: 2;
}

.moreIcon{
  position: fixed;
  right: .2rem;
  bottom: 1rem;
  font-size: .40rem;
  color: #333;
  padding: .2rem;
  border-radius: .08rem;
  background-color: #FDEFDB;
}
.wrapper {
  display: flex;
  flex-direction: column;
  background: #1a1c21;
  // background-image: linear-gradient(to bottom, #282a2f, #020509);
  min-height: 100vh;
  // overflow: hidden;
}
.anchor {
  position: fixed;
  right: 0.1rem;
  bottom: 1rem;
  background-color: #FDEFDB;
  // padding: .3rem;
  color: #4D3325;
  font-size: 0.26rem;
  border-radius: .15rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  &>div{
     color: #4D3325;
       height: .7rem;
       line-height: .7rem;
       display: block;
       padding: 0 .3rem;
    // a{
    // }
    // margin-bottom: .2rem;
    &:last-child{
      margin-bottom: 0;
    }
  }
  .arrowIcon{
    font-size: .18rem;
  }
}

</style>
