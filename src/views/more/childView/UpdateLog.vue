<template>
  <div class="updateLog">
    <div class="item" v-for="(item, $index) in data" :key="$index"
      :class="{'open': item.openDetail}">
      <div class="show" @click="handleShowDetail($index)">
        <div class="left">
          <div class="title">
            <span v-if="$store.state.app.language !== 'en'">
              <span>V{{ item.version }}</span>
              <span>{{ $t('more.version') }}</span>
            </span>
            <span v-else>
              <span>{{ $t('more.version') }}</span>
              <span>{{ item.version }}</span>
            </span>
          </div>
          <div class="time">{{ item.localTime }}</div>
        </div>
        <div class="right">
          <div class="iconfont icon-huaban11 rightIcon"
            :class="{'open': item.openDetail}"></div>
        </div>
      </div>
      <div class="hide" v-if="item.openDetail">
        <pre class="list">{{ item.updateLog.trim() }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import { toLocalTime } from '@/utils/public';

export default {
  data() {
    return {
      data: []
    }
  },
  mounted() {
    this.handleGetVersion();
  },
  methods: {
    handleGetVersion() {
      this.$http.get('/version/history?type=3').then((res) => {
        if (res.code !== 0) {
          return;
        }
        const arr = res.walletVersion;
        arr.forEach((item) => {
          this.$set(item, 'openDetail', false);
          this.$set(item, 'localTime', toLocalTime(item.releaseTs).substr(0, 10));
        });
        this.data = arr;
      });
    },
    handleToLocalTime(time) {
      return toLocalTime(time)
    },
    handleShowDetail(index) {
      this.data[index].openDetail = !this.data[index].openDetail;
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.updateLog{
  font-size: .3rem;
  background: #FFF;
  padding: .1rem 0px;

  .item{
    width: 7.02rem;
    margin: auto;
    border-bottom: 1px solid $color-input;

    &.open{
      border-bottom: 1px solid transparent;
    }

    &:last-child{
      border-bottom: 1px solid transparent;
    }

    .show{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: .22rem .1rem;

      .time{
        font-size: .24rem;
        color: $color-999;
        margin-top: .06rem;
      }

      .rightIcon{
        font-size: .24rem;
        transform: rotate(90deg);

        &.open{
          transform: rotate(-90deg);
        }
      }
    }

    .hide{
      font-size: .27rem;
      background: rgba($color: #F3F3F3, $alpha: .56);
      border-radius: .04rem;
      padding: .2rem .4rem;

      .list{
        line-height: .46rem;
      }
    }
  }
}

</style>
