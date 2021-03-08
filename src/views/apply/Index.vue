<template>
  <div class="apply" @click="select = false">
    <!-- 申请表 - 合并 & 需登录 -->
    <div class="banner">
      <div class="title">{{ $t('apply.appleTitle') }}</div>
    </div>

    <div class="item">
      <div class="subTitle">
        <span>{{ $t('apply.applyType') }}</span>
        <span class="tip"></span>
      </div>
      <div class="inputDiv">
        <div class="input typeInput" @click.stop="select = !select">
          <template v-for="(item, $index) in typeList">
            <span :key="$index" v-if="item.type === type">
              {{ $t(`apply.${item.value}`) }}
            </span>
          </template>
          <span class="down" :class="{'up': select}"></span>
        </div>
        <!-- 币种浮动窗口 start -->
        <div class="selectMenu" v-if="select">
          <div class="scroll">
            <div class="select color-333">
              <div class="type" v-for="(item, $index) in typeList" :key="$index"
                @click="handleSelect(item.type)">{{ $t(`apply.${item.value}`) }}</div>
            </div>
          </div>
        </div>
        <!-- 币种浮动窗口 end -->
      </div>
    </div>

    <!-- 各类型申请表组件 start -->
    <div class="comp">
      <Coin v-if="type === 1" ref="applyComp" />
      <Candy v-if="type === 2" ref="applyComp" />
    </div>
    <!-- 各类型申请表组件 end -->

    <!-- 提交按钮 -->
    <!-- <div class="btn" @click="handleSure" :type="type">{{ $t('influencer.shortSubmit') }}</div> -->
  </div>
</template>

<script>
import Coin from './components/Coin'
import Candy from './components/Candy'

export default {
  data() {
    return {
      select: false,
      type: 2,
      typeList: [{
        type: 1,
        value: 'applyCoin'
      },
      {
        type: 2,
        value: 'applyCandy'
      }],
    }
  },
  components: {
    Coin,
    Candy,
  },
  watch: {},
  mounted() {
    if (typeof this.$route.params.type !== 'undefined') {
      this.type = this.$route.params.type;
    }
  },
  methods: {
    // 选择
    handleSelect(index) {
      this.type = index;
      this.select = false;
    },
    // 提交
    handleSure() {
      this.$refs.applyComp.handleApply();
    },
  },
  beforeDestroy() {
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/public.scss";

.apply{
  position: relative;
  font-size: .32rem;
  background: #FFF;
  padding: .21rem .25rem;

  &.androidFocus{
    padding-bottom: 5rem;
  }

  .banner{
    height: 2.28rem;
    width: 7rem;
    background-image: linear-gradient(133deg, #426BFF 0%, #3D9EFF 100%);
    border-radius: .11rem;
    color: #FFF;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
    font-size: .64rem;
    letter-spacing: .0503rem;
  }

  .item{
    .subTitle{
      margin-top: .2rem;
      margin-bottom: .2rem;
    }

    .inputDiv{
      position: relative;

      // 筛选框
      .selectMenu{
        background: white;
        box-shadow: 0px 0px .07rem rgba(74, 144, 226, .31);
        width: 100%;
        position: absolute;
        left: 0rem;
        top: 1rem;
        border-radius: .13rem;
        box-sizing: border-box;
        z-index: 1000;

        &::after{
          content: '';
          border: .1rem solid white;
          position: absolute;
          top: -.1rem;
          box-shadow: 0px 0px .07rem rgba(74, 144, 226, .31);
          transform: rotate(45deg);
          right: .3rem;
        }

        .scroll{
          z-index: 1000;
          position: relative;
          max-height: 4.6rem;
          overflow: auto;
          padding: 0rem .33rem;
          background: white;
          border-radius: .13rem;
        }

        .select{
          position: relative;
          z-index: 10;;
          background: #FFF;
          font-size: .25rem;

          &>div{
            font-size: .27rem;
            position: relative;
            height: .9rem;
            border-bottom: 1px solid $color-e3e3e3;
            display: flex;
            align-items: center;
            box-sizing: border-box;

            &:last-child{
              border-bottom: 0px solid $color-e3e3e3;
            }
          }
        }
      }
    }
    .input{
      width: 100%;
      height: .8rem;
      border: 1px solid $color-input;
      background: #FFFFFF;
      border-radius: .0694rem;
      font-size: .3rem;
      padding-left: .21rem;
      box-sizing: border-box;

      &.notNull{
        border: 1px solid red;
      }
    }
    .typeInput{
      display: flex;
      align-items: center;
      justify-content: space-between;

      .down{
        border: .1rem solid transparent;
        border-top: .1rem solid $color-333;
        position: absolute;
        right: .3rem;
        top: 50%;
        transform: translate(0, -25%);

        &.up{
          top: 30%;
          transform: translate(0, 0%) rotate(180deg);
        }
      }
    }
  }

  .comp{
    padding-top: .3rem;
  }

  .btn{
    margin: auto;
    width: 7rem;
    margin-top: .3rem;
    background: $color-this;
    border-radius: .08rem;
    color: #FFF;
    height: .8rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
