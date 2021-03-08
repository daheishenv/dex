<template>
  <span>
    <span class="iconfont icon-huaban29 icon" :class="{'iconSearch': $route.name === 'search'}" v-if="!isFavorite" @click.stop="handleSelfAdd"></span>
    <span class="iconfont icon-huaban30 icon color-this"
      :class="{'iconSearch': $route.name === 'search'}" v-if="isFavorite" @click.stop="handleSelfCancel"></span>
  </span>
</template>

<script>
// import DApp from '@/utils/wallet';
import { accountToSign } from '@/utils/publicApi';

export default {
  data() {
    return {
      isFavorite: false,
    }
  },
  props: [
    'symbol',
    'id',
    'favoriteList',
  ],
  watch: {
    // symbol: function listhen() {
    //   this.handleGetSelf();
    // },
    id() {
      this.handleGetSelf();
    }
  },
  mounted() {
    this.handleGetSelf();
  },
  methods: {
    /* -------- 交易对收藏 start -------- */
    // 添加收藏
    handleSelfAdd() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.handleGetTimestampJson();
        return;
      }
      this.isFavorite = true;
      const params = {
        symbolIds: this.id,
        type: 1
      };
      this.$http.post('/account/favoriteSymbol', params).then((res) => {
        if (res.code === 401) {
          this.isFavorite = false;
          localStorage.removeItem('token')
          this.$toast({
            message: this.$t('error.token'),
            position: 'center',
            duration: 2000,
          });
          // 延时调用授权
          setTimeout(() => {
            this.handleGetTimestampJson();
          }, 2000);
          return;
        }
        if (res.code !== 0) {
          this.isFavorite = false;
          this.$toast({
            message: res.msg,
            position: 'center',
            duration: 2000,
          });
          return;
        }
        // this.$toast({
        //   message: '操作成功',
        //   position: 'center',
        //   duration: 2000,
        // });
        this.isFavorite = true;
      });
    },
    // 取消收藏
    handleSelfCancel() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.handleGetTimestampJson();
        return;
      }
      if (!this.id) {
        return;
      }
      this.isFavorite = false;
      const params = {
        symbolIds: this.id,
        type: 0
      };
      this.$http.post('/account/favoriteSymbol', params).then((res) => {
        if (res.code === 401) {
          this.isFavorite = true;
          localStorage.removeItem('token')
          this.$toast({
            message: this.$t('error.token'),
            position: 'center',
            duration: 2000,
          });
          // 延时调用授权
          setTimeout(() => {
            this.handleGetTimestampJson();
          }, 2000);
          return;
        }
        if (res.code !== 0) {
          this.isFavorite = true;
          this.$toast({
            message: res.msg,
            position: 'center',
            duration: 2000,
          });
          return;
        }
        this.isFavorite = false;
      });
    },
    // 获取收藏列表
    handleGetSelf() {
      try {
        if (!this.id) {
          return;
        }
        // 有传递收藏列表
        if (this.favoriteList) {
          const symbolIdsArr = this.favoriteList;
          const thisFacorite = symbolIdsArr.find(item => item.symbolId === this.id);
          if (thisFacorite) {
            this.isFavorite = true;
            return;
          }
          this.isFavorite = false;
          return;
        }

        // 没有传递收藏列表
        const params = {
          account: this.$store.state.app.accountInfo.account,
        };
        this.$http.post('/account/getFavoriteSymbolList', params).then((res) => {
          if (res.code !== 0) {
            // this.$toast({
            //   message: res.msg,
            //   position: 'center',
            //   duration: 2000,
            // });
            return;
          }
          // 设置用户是否有自选
          localStorage.setItem('hasFavorite', false);
          if (res.symbolList.length > 0) {
            localStorage.setItem('hasFavorite', true);
          }

          const symbolIdsArr = res.symbolList;
          const thisFacorite = symbolIdsArr.find(item => item.symbolId === this.id);
          if (thisFacorite) {
            this.isFavorite = true;
            return;
          }
          this.isFavorite = false;
        });
      } catch (error) {
        setTimeout(() => {
          this.handleGetSelf();
        }, 200);
      }
    },
    /* -------- 交易对收藏 end -------- */
    /* -------- 权限校验 start -------- */
    // 获取服务器时间戳
    handleGetTimestampJson() {
      accountToSign(this, () => {
        if (this.isFavorite) {
          this.handleSelfCancel();
          return;
        }
        this.handleSelfAdd();
      });
    },
    /* -------- 权限校验 end -------- */
  }
}
</script>

<style scoped lang="scss">
.icon{
  font-size: .38rem;
}
.iconSearch{
  font-size: .35rem;
}
</style>
