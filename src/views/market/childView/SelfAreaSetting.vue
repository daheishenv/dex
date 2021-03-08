<template>
  <div class="selfArea">
    <div class="topTools">
      <div class="back fl color-999" @click="handleBack">
        <span class="iconfont icon-huaban25 backIcon"></span>
      </div>
      <div>{{ $t('quotation.setSelf') }}</div>
      <div class="ok fr color-this" @click="handleSure()">{{ $t('public.complete') }}</div>
    </div>

    <div class="data">
      <div class="head">
        <div>{{ $t('public.symbol') }}</div>
        <div style="max-width:.7rem;">{{ $t('public.top') }}</div>
        <div>{{ $t('public.delete') }}</div>
      </div>
      <div class="list">
        <!-- loading -->
        <div class="loading" v-if="loading">
          <mt-spinner type="snake" color="#0094d5" class="color-this"></mt-spinner>
        </div>
        <!-- List -->
        <div class="item" v-for="(item, $index) in showData" :key="$index">
          <div style="text-align: left">
            <img class="coinImg" :src="item.coinImgUrl" @error="handleImgError(item)"
              :onerror="errorCoinImg" alt="">
            <span>{{ item.symbol1 }}</span><span class="color-999">/{{ item.symbol2 }}</span>
          </div>
          <div style="max-width:.7rem;">
            <span class="iconfont icon-huaban19 icon"
              @click="handleToTop($index)"
              :class="{'hidden': $index === 0}"></span>
          </div>
          <div>
            <span class="iconfont icon-huaban18 icon" @click="handleDelete($index)"></span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { Spinner } from 'mint-ui';
import { dealSymbolSplit } from '@/utils/public';
import { accountToSign } from '@/utils/publicApi';

export default {
  data() {
    return {
      errorCoinImg: 'this.src="https://ndi.340wan.com/upload/20180919/ed752ac2f6174370bf879620ec821eee.png"',
      allFavoriteData: [],
      showData: [],
      sureFlag: false,
      loading: true,
    }
  },
  props: [
  ],
  components: {
    mtSpinner: Spinner
  },
  watch: {
  },
  created() {
  },
  mounted() {
    this.handleFavorite();
  },
  methods: {
    // 处理图片加载出错
    handleImgError(item) {
      this.$set(item, 'coinImgUrl', 'https://ndi.340wan.com/upload/20180919/ed752ac2f6174370bf879620ec821eee.png')
    },
    // 返回
    handleBack() {
      history.back();
    },
    // 置顶
    handleToTop(index) {
      const top = this.showData[index];
      this.showData.splice(index, 1);
      this.showData.unshift(top)
    },
    // 删除
    handleDelete(index) {
      this.showData.splice(index, 1);
    },
    // 完成
    handleSure(type) {
      if (this.loading) {
        return;
      }
      // 限制只能点击一次
      if (this.sureFlag && !type) {
        return;
      }
      // 无响应后1秒才可以再次点击
      setTimeout(() => {
        this.sureFlag = false;
      }, 1000);

      this.sureFlag = true;
      const token = localStorage.getItem('token');
      if (!token) {
        this.handleGetTimestampJson();
        return;
      }

      const arr = [];
      this.showData.forEach((item) => {
        arr.push(item.symbolId);
      });
      if (arr.length === 0) {
        localStorage.setItem('hasFavorite', false);
      }
      // 取消收藏
      const params = {
        symbolIds: arr.join(','),
        type: 1,
        delAll: 1,
      };
      this.$http.post('/account/favoriteSymbol', params).then((res) => {
        if (res.code === 401) {
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
          this.$toast({
            message: res.msg,
            position: 'center',
            duration: 2000,
          });
          return;
        }
        this.handleBack();
        // if (!type) {
        //   this.handleSure(1)
        //   setTimeout(() => {
        //     this.handleBack();
        //   }, 100);
        //   // return;
        // }
      });
    },
    // 获取收藏
    handleFavorite() {
      try {
        this.loading = true;
        this.showData = [];
        // 异步获取自选交易对 - 进行匹配添加list
        const params = {
          account: this.$store.state.app.accountInfo.account,
        };
        this.$http.post('/account/getFavoriteSymbolList', params).then((res) => {
          this.loading = false;
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
          this.allFavoriteData = res.symbolList;
          this.allFavoriteData.forEach((item) => {
            const obj = dealSymbolSplit(item.symbol, item.chain, item.valuationCoinContract, item.contract, this.$embed);
            this.$set(item, 'coinImgUrl', obj.coinUrl);
            this.$set(item, 'symbol1', obj.symbol1.toUpperCase());
            this.$set(item, 'symbol2', obj.symbol2.toUpperCase());
          });
          const arr = JSON.stringify(this.allFavoriteData);
          this.showData = JSON.parse(arr);
        });
      } catch (error) {
        setTimeout(() => {
          this.handleFavorite();
        }, 200);
      }
    },

    /* -------- 权限校验 start -------- */
    // 获取服务器时间戳
    handleGetTimestampJson() {
      accountToSign(this, () => {
        this.handleSure();
      });
    },
    /* -------- 权限校验 end -------- */
  },
  beforeDestroy() {
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.hidden{
  visibility: hidden;
}

.selfArea{
  font-size: .36rem;

  .topTools{
    display: flex;
    align-items: center;/*垂直居中*/
    // justify-content: center;/*水平居中*/
    text-align: center;
    height: .9rem;
    padding: 0px .24rem;
    background: #FFF;
    margin-bottom: .12rem;

    &>div{
      flex: 7;
    }

    .ok,
    .back{
      flex: 1;
      font-size: .32rem;

      .backIcon{
        left: .3rem;
        font-size: .32rem;
        font-weight: normal;
      }
    }

    .back{
      text-align: left;
    }
  }

  .data{
    background: #FFF;
    padding: 0rem .1rem 0px .3rem;

    .head{
      display: flex;
      align-items: center;/*垂直居中*/
      // justify-content: center;/*水平居中*/
      text-align: center;
      font-size: .28rem;
      color: $color-999;
      height: .75rem;
      border-bottom: 1px solid $color-e3e3e3;

      &>div{
        flex: 1;
      }
      &>div:first-child{
        text-align: left;
        flex: 2;
      }
      // &>div:first-child{
      //   flex: 2
      // }
    }

    .list{
      .loading {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 1rem;
      }
      .item{
        display: flex;
        align-items: center;/*垂直居中*/
        // justify-content: center;/*水平居中*/
        text-align: center;
        height: 1.18rem;
        border-bottom: 1px solid $color-e3e3e3;

        &:last-child{
          border-bottom: 1px solid transparent;
        }

        &>div:first-child{
          flex: 2;
          display: flex;
          align-items: center;/*垂直居中*/
        }

        &>div{
          flex: 1;
        }
        // &>div:first-child{
        //   flex: 2
        // }

        .icon{
          font-size: .36rem;
          color: $color-this;
        }

        .coinImg{
          width: .6rem;
          margin-right: .1rem;
          // margin-left: .1rem;
        }
      }
    }
  }
}
</style>
