<template>
  <div class="member">
    <div class="content">
      <!-- Newdex会员权益 -->
      <div class="title">{{ $t('New_home.New_home23') }}</div>
      <!-- 消耗/抵押NDX，尊享会员权益 -->
      <div class="word">
        {{ $t('New_home.New_home24') }}
      </div>
      <div class="main">
        <div class="list" v-for="(item, index) in list" :key="index">
          <div class="iconfont" :class="item.icon"></div>
          <div class="top flexc">
            <span>{{ $t(`New_home.${item.title}`) }}</span>
          </div>
          <div class="bottom">{{ $t(`New_home.${item.word}`) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'member', // 会员
  data() {
    return {
      list: [
        {
          id: 1,
          icon: 'icon-youhui',
          title: 'New_home25', // 手续费折扣
          word: 'New_home26',
        },
        {
          id: 2,
          icon: 'icon-tangguo',
          title: 'New_home31', // 糖果空投
          word: 'New_home32',
        },
        {
          id: 3,
          icon: 'icon-choujiang-2',
          title: 'New_home33', // 每日抽奖
          word: 'New_home34',
        },
        {
          id: 4,
          icon: 'icon-huaban2131',
          title: 'New_home27', // 免CPU下单
          word: 'New_home28',
        },
        {
          id: 5,
          icon: 'icon-niming-2',
          title: 'New_home29', // 匿名交易
          word: 'New_home30',
        },
        {
          id: 6,
          icon: 'icon-quanyi-4',
          title: 'New_home35', // 更多权益
          word: 'New_home36',
        },
      ],
    };
  },
  components: {},
  props: {},
  watch: {},
  computed: {},
  created() {},
  mounted() {},
  beforeDestroy() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.member {
  margin-top: .15rem;
  background: #F7F9FF;
  padding: .35rem .36rem;
  .content {
    margin: auto;

    .title {
      font-size: .32rem;
      color: #333333;
      margin-bottom: .10rem;
    }

    .word {
      font-size: .24rem;
      color: #999999;
    }

    .main {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      padding-top: .70rem;

      .list {
        margin-bottom: .3rem;
        width: 40%;
        background: #fff;
        padding: .4rem .27rem;
      }

      .iconfont {
        font-size: .55rem;
        color: #1652f0;
        opacity: 0.65;
      }

      .top {
        margin: .10rem 0;

        span {
          font-size: .28rem;
          color: #333;
          margin-left: .08rem;
        }
      }

      .bottom {
        font-size: .24rem;
        color: #999999;
        text-align: left;
      }
    }
  }
}
</style>
