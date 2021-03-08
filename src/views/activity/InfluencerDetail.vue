<template>
  <div class="detail">
    <div class="banner">
      <div>
        <div class="title">{{ $t('ds.ds111') }}</div>
        <div class="subTitle">
          <div>{{ $t('ds.ds112') }}</div>
          <!-- <div v-if="$store.state.app.language === 'en'">{{ $t('ds.subTitle_2') }}</div> -->
        </div>
        <div class="item">
          <div>{{ $t('ds.ds113') }}</div>
          <!-- <span>{{ $t('ds.list1') }}</span> /
          <span>{{ $t('ds.list2') }}</span> /
          <span>{{ $t('ds.list3') }}</span> /
          <span>{{ $t('ds.list4') }}</span> -->
        </div>
      </div>
    </div>
    <div class="content">
      <div class="data">
        <div class="title">{{ $t('ds.ds114') }}</div>
        <div class>{{ $t('ds.ds115') }}</div>
      </div>
      <div class="data">
        <div class="title">{{ $t('ds.ds116') }}</div>
        <div class>{{ $t('ds.ds117') }}</div>
        <div class>{{ $t('ds.ds118') }}</div>
        <div class>{{ $t('ds.ds119') }}</div>
        <div class>{{ $t('ds.ds120') }}</div>
      </div>
      <div class="data">
        <div class="title">{{ $t('ds.ds121') }}</div>
        <div class>{{ $t('ds.ds122') }}</div>
        <div class>{{ $t('ds.ds123') }}</div>
        <div class>{{ $t('ds.ds124') }}</div>
        <div class>{{ $t('ds.ds125') }}</div>
      </div>
      <div class="data">
        <div class="title">{{ $t('ds.ds126') }}</div>
        <div class>{{ $t('ds.ds127') }}</div>
        <div class>{{ $t('ds.ds128') }}</div>
        <div class>{{ $t('ds.ds129') }}</div>
        <div class>{{ $t('ds.ds130') }}</div>
        <div class>{{ $t('ds.ds131') }}</div>
        <div class>{{ $t('ds.ds132') }}</div>
        <div class>{{ $t('ds.ds133') }}</div>
        <div class>{{ $t('ds.ds134') }}</div>
        <div class>{{ $t('ds.ds135') }}</div>
        <div class>{{ $t('ds.ds136') }}</div>
        <div class>{{ $t('ds.ds137') }}</div>
        <div class>{{ $t('ds.ds138') }}</div>
        <div class>{{ $t('ds.ds139') }}</div>
        <div class>{{ $t('ds.ds140') }}</div>
        <div class>{{ $t('ds.ds141') }}</div>
        <div class>{{ $t('ds.ds142') }}</div>
        <div class>{{ $t('ds.ds143') }}</div>
      </div>
    </div>
    <div class="btn" @click="handleToApply">{{ $t('ds.ds3') }}</div>

    <!-- dialog -->
    <mt-popup class="tipPopup" v-model="showDialog" popup-transition="popup-fade">
      <to-app />
    </mt-popup>
  </div>
</template>

<script>
import ToApp from '@/views/market/components/ToApp';
import { Popup } from 'mint-ui';

export default {
  data() {
    return {
      showDialog: false,
      channelRef: 'h5'
    };
  },
  components: {
    ToApp,
    mtPopup: Popup,
  },
  mounted() {
    this.channelRef = localStorage.getItem('channelRef');
  },
  methods: {
    handleToApply() {
      // if (this.channelRef === 'h5') {
      //   this.showDialog = true;
      //   return
      // }
      this.$router.push({
        name: 'apply'
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/public.scss";

.detail {
  font-size: 0.27rem;

  .banner {
    height: 3.14rem;
    background-image: url("/static/img/activity/ambassadors/banner.png");
    background: #020D33;;
    background-repeat: no-repeat;
    background-size: contain;
    color: #fff;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;

    .title {
      font-size: 0.52rem;
    }
    .subTitle {
      font-size: 0.32rem;
      margin-bottom: 0.08rem;
    }
    .item {
      font-size: 0.21rem;
    }
  }

  .content {
    padding: 0.26rem;
    .title {
      color: $color-this;
      margin-bottom: 0.1rem;
      font-weight: bold;
    }
    .data {
      margin-bottom: 0.35rem;
    }
  }
}

.btn {
  width: 6.3rem;
  height: 0.75rem;
  display: flex;
  border-radius: 0.08rem;
  justify-content: center;
  align-items: center;
  background: #5f72ff;
  margin: auto;
  color: #fff;
  margin-bottom: 1rem;
}

.tipPopup {
  width: 80%;
  border-radius: 0.1rem;
  font-size: 0.32rem;
  color: $color-333;
  text-align: center;
}
</style>
