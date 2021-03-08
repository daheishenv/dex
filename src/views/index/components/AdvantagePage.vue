<template>
  <div class="advantage">
    <div class="content">
      <!-- 我们的优势 -->
      <div class="title">{{ $t('New_home.New_home89') }}</div>
      <div class="list">
        <div class="listItem" v-for="(item, index) in list" :key="index">
          <img :src="item.imgUrl" alt="" />
          <div class="listTitle">{{ $t(item.title) }}</div>
          <div class="des">{{ $t(item.des) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Advantage',
  data() {
    return {
      list: [
        { imgUrl: require('@/assets/img/index/ayoushi-ic.png'), title: 'New_home.New_home90', des: 'New_home.New_home91' },
        { imgUrl: require('@/assets/img/index/byoushi-ic.png'), title: 'New_home.New_home92', des: 'New_home.New_home93' },
        { imgUrl: require('@/assets/img/index/cyoushi-ic.png'), title: 'New_home.New_home94', des: 'New_home.New_home95' },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.advantage {
  background: #fff;
  color: #333;
  padding: .60rem 1rem;
  margin-top: .15rem;
  .content {
    margin: 0 auto;
    .title {
      font-size: .32rem;
    }
    .title1 {
      font-size: .16rem;
      color: #999;
      margin-top: .10rem;
    }
    .list {
      margin-top: .60rem;
      .listItem {
        text-align: center;
        margin-bottom: .8rem;

        img {
          width: .70rem;
          height: .70rem;
        }
        .listTitle {
          font-size: .28rem;
          margin-top: .15rem;
        }
        .des {
          font-size: .24rem;
          color: #999;
          margin-top: .2rem;
          line-height: .4rem;
        }
      }
    }
  }
}
</style>
