<template>
  <div class="AddressBook">
    <!-- 地址薄 -->
    <div class="tools">
      {{ $t('address.ls1') }}
    </div>
    <div class="addressCont" v-if="addressList.length > 0">
      <div class="addressList"
      v-for="(item, index) in addressList"
      :key="index">
        <div class="flexb account">
          <span @click="handleCheckAccount(item)">{{item.name}} ({{item.addressChain.toUpperCase()}}{{$t('exchange.chain')}})</span>
          <i class="iconfont icon-huaban17" @click="handleDelete(item)"></i>
        </div>
        <div class="address" @click="handleCheckAccount(item)">
          {{item.address}}
        </div>
      </div>
    </div>
    <div class="noaddress-tip" v-else>
      <span>{{ $t('address.ls18') }}</span>
    </div>
    <!-- 添加新地址 -->
    <div class="addNewAddress"  @click="handleAddAddress">
      +{{ $t('address.ls2') }}
    </div>
    <!-- 删除地址薄 -->
    <mt-popup
      v-model="deleAddressVisible"
      class="addAddress deleAddress"
      popup-transition="popup-fade">
      <div class="popupCancel">
        <span class="iconfont icon-huaban17 popupClose" @click.stop="deleAddressVisible = false;"></span>
        <div class="title">{{ $t('public.tip') }}</div>
        <div class="content" v-if="checkItem.addressChain">
          <span>{{ $t('address.ls3', {address: checkItem.address, chain: checkItem.addressChain.toUpperCase()}) }}</span>
        </div>
        <div class="btnDiv">
          <div class="btn" @click="deleAddressVisible = false">{{ $t('public.cancel') }}</div>
          <div class="btn" @click="handleDeleteAddress">{{ $t('public.sure') }}</div>
        </div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import { Popup } from 'mint-ui';

export default {
  name: 'AddressBook', // 地址簿
  data() {
    return {
      addressList: [],
      deleAddressVisible: false, // 删除地址
      query: {},
      checkItem: {}
    }
  },
  components: {
    mtPopup: Popup,
  },
  props: {
  },
  watch: {},
  computed: {},
  created() {
  },
  mounted() {
  },
  activated() {
    this.query = this.$route.params;
    this.handleGetAddressList();
  },
  beforeDestroy() {},
  methods: {
    // 获取地址列表
    handleGetAddressList() {
      const params = this.query;
      this.$http.get('/accountAddress/list', { params }).then((res) => {
        if (res.code !== 0) {
          return;
        }
        this.addressList = res.list;
      })
    },
    // 删除地址
    handleDelete(item) {
      this.checkItem = item;
      this.deleAddressVisible = true;
    },
    // 删除
    handleDeleteAddress() {
      const params = {
        id: this.checkItem.id
      };
      this.$http.post('/accountAddress/delete', params).then((res) => {
        if (res.code !== 0) {
          return;
        }
        this.$toast(this.$t('toastTip.success'));
        const index = this.addressList.findIndex(v => v.id === params.id);
        if (index >= 0) {
          this.addressList.splice(index, 1);
        }
        this.deleAddressVisible = false;
      })
    },

    // 选择地址
    handleCheckAccount(item) {
      const obj = this.addressList.find(v => v.id === item.id);
      if (obj) {
        obj.checked = true;
      }
      this.$store.dispatch('setAccountBook', this.addressList).then(() => {
        if (this.$route.query && this.$route.query.backpath) {
          this.$router.push({ path: this.$route.query.backpath });
          return;
        }
        this.$router.back()
      });
    },
    // 添加地址
    handleAddAddress() {
      this.$router.push({
        name: 'addAddress',
        params: this.query,
        query: {
          backpath: this.$route.fullPath
        }
      });
    },
  },
}
</script>
<style lang="scss" scoped>
@import "@/assets/css/public.scss";
.AddressBook {
  .hidden {
    display: none;
  }
  // 工具栏样式
  .tools{
    padding: .2rem .24rem;
    background: #FFF;
    position: relative;
    text-align: center;
    margin-bottom: .1rem;
    font-size: .36rem;
  }

  .addressCont {
    .addressList {
      padding: .3rem .46rem;
      background: #fff;
      border-bottom: 1px solid #fafafa;

      &:last-child {
        border: 0;
      }

      .account {
        span {
          font-size: .25rem;
          color: #999;
          word-break: break-all;
          padding-right: .2rem;
        }

        i {
          flex-shrink: 0;
          font-size: .2rem;
          color: #999;
        }
      }

      .address {
        margin-top: .05rem;
        font-size: .3rem;
        word-break: break-all;
      }
    }
  }
  .noaddress-tip {
    padding: 1rem 0;
    font-size: .26rem;
    color: #606266;
    text-align: center;
  }
  .addNewAddress {
    padding: .4rem 0;
    margin-top: .12rem;
    background: #fff;
    font-size: .27rem;
    color: #4A90E2;
    text-align: center;
  }
}

.addressBookCls {
  background: #fafafa !important;
  width: 100%;
  height: 100%;
}

.deleAddress {
  background: rgba(0, 0, 0 , .5) !important;
}

.popupCancel{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  font-size: .28rem;
  padding: .4rem .32rem .53rem;
  width: 6.21rem;
  box-sizing: border-box;
  border-radius: .1rem;
  z-index: 100000;
  .popupClose{
    position: absolute;
    right: .2rem;
    top: .2rem;
    color: $color-999;
    font-size: .25rem;
  }

  .title{
    font-size: .36rem;
    color: $color-this;
    text-align: center;
  }

  .content {
    margin: .4rem 0 .2rem;
    text-align: center;
    word-break: break-all;
  }

  .btnDiv{
    display: flex;
    align-items: center;
    justify-content: space-between;

    .btn{
      flex: 1;
      height: .83rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #c7c7c7;
      color: white;
      border-radius: .1042rem;
      border-color: #c7c7c7;
      &:last-child{
        margin-left: .1rem;
        background: $color-this;
        border-color: $color-this;
      }
    }
  }
}
</style>
