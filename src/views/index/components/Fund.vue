<template>
  <div class="fund">
    <div class="content">
      <!-- Newdex seed基金 -->
      <div class="title">{{ $t('New_home.New_home37') }}</div>
      <!-- 第一个EOS生态DeFi专项发展基金 -->
      <div class="title1">{{ $t('New_home.New_home38') }}</div>
      <div class="list">
        <div class="listItem flexb" v-for="(item, index) in list" :key="index" :style="index === 2 ? 'margin-bottom: 0' :''">
          <div class="leftCont">
            <div class="des">{{ $t(item.des) }}</div>
            <div class="des1">{{ $t(item.des1) }}</div>
          </div>
          <div>
            <img :src="item.imgUrl" alt="" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Fund',
  data() {
    return {
      list: [
        { imgUrl: require('@/assets/img/index/defibox.png'), des: 'New_home.New_home39', des1: 'New_home.New_home40' },
        { imgUrl: require('@/assets/img/index/ogx.png'), des: 'New_home.New_home41', des1: 'New_home.New_home42' },
        { imgUrl: require('@/assets/img/index/dfs.png'), des: 'New_home.New_home43', des1: 'New_home.New_home44' },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.fund {
  background: #fff;
  color: #333;
  padding: .55rem .35rem;
  margin-top: .15rem;
  .content {
    margin: 0 auto;
    .title {
      font-size: .32rem;
    }
    .title1 {
      font-size: .24rem;
      color: #999;
      margin-top: .10rem;
    }
    .list {
      margin-top: .40rem;
      .listItem {
        border-radius: .10rem;
        background: #F6F8FC;
        padding: .45rem;
        margin-bottom: .3rem;
        .leftCont {
          text-align: left;
        }
        img {
          width: .9rem;
          height: .9rem;
        }
        .listTitle {
          font-size: .16rem;
          color: #999;
        }
        .des {
          font-size: .3rem;
          color: #333;
          margin-top: .10rem;
        }
        .des1 {
          font-size: .24rem;
          color: #999;
          margin-top: .10rem;
          width: 90%;
        }
      }
    }
  }
}
</style>
