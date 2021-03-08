<template>
  <div class="candyRules">
    <span class="iconfont icon-huaban17 popupClose" @click="handleClosePopup"></span>
    <div class="popupTitle">{{ $t('candyAirDrop.airRules') }}</div>
    <div class="content">
      <div class="tip">{{ $t('candyAirDrop.newRules1') }}</div>
      <div class="tip">{{ $t('candyAirDrop.newRules2') }}</div>
      <div class="tip">{{ $t('candyAirDrop.newRules3') }}</div>
      <div class="tip">{{ $t('candyAirDrop.newRules4') }}</div>
    </div>
    <div class="lists" v-if="list.length">
      <div class="title">
        <div>{{ $t('candyAirDrop.vipLv') }}</div>
        <div>{{ $t('candyAirDrop.vipWeight') }}</div>
      </div>
      <div class="auto">
        <div>
          <div class="list" v-for="(item, index) in list" :key="index">
            <div>VIP {{ item.level }}</div>
            <div>{{ item.weight }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'candyRules',
  data() {
    return {
      list: [],
    }
  },
  mounted() {
    this.handleGetVipList()
  },
  methods: {
    // 关闭弹窗
    handleClosePopup() {
      this.$emit('listenClose', false)
    },
    // 获取会员列表
    handleGetVipList() {
      if (this.$appName !== 'eosNewdex') return;
      this.$http.get('/levelRule/list').then((res) => {
        if (res.code !== 0) {
          return
        }
        const arr = res.ruleList;
        const newArr = arr.filter(item => item.level >= 1)
        // const newArr = arr.filter(item => item.level >= 3)
        this.list = newArr;
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.candyRules{
  padding: .41rem;
  box-sizing: border-box;
  background: #FFF;
  border-radius: .17rem;
  width: 6.21rem;
  text-align: center;
  position: relative;

  .popupClose{
    position: absolute;
    right: .2rem;
    top: .2rem;
    color: $color-333;
    font-size: .25rem;
  }

  .popupTitle{
    font-size: .36rem;
    color: $color-this;
    margin-bottom: .33rem;
  }

  .content{
    text-align: left;
    font-size: .28rem;
    color: $color-333;

    .tip{
      margin-bottom: .09rem;
    }
  }

  .lists{
    font-size: .25rem;
    border-radius: .15rem;
    overflow: hidden;
    border: 0.02rem solid #4A90E2;
    margin-top: .3rem;
    box-sizing: border-box;

    .title{
      height: .7rem;
      background: #E9F2FF;
      color: $color-this;
      display: flex;
       border-bottom: 1px solid #A8D0FF;
      &>div{
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;

        &:last-child{
          border-left: 1px solid #A8D0FF;
        }
      }
    }
    .auto{
      overflow: hidden;
      // height: 100%;
      margin: 0 0.06rem;
      &>div{
        overflow: auto;
        height: 4rem;
        .list{
          height: .7rem;
          font-size: .28rem;
          background: #FFF;
          color: $color-333;
          display: flex;
          border-bottom: 1px solid #A8D0FF;
          &>div{
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            &:last-child{
              border-left: 1px solid #A8D0FF;
            }
          }
          &:last-child{
            border-bottom: 0px solid #A8D0FF;
          }
        }
      }

    }

    // .list{
    //   font-size: .28rem;
    //   background: #FFF;
    //   color: $color-333 !important;
    // }
  }
}
</style>
