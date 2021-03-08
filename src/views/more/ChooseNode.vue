<template>
  <div class="node">
    <div class="tools">
      <span class="iconfont icon-huaban25 back" @click="handleBack"></span>
      <span class="title">{{ $t('more.nodeChoose') }}</span>
    </div>
    <div class="list">
      <div class="item">
        <div>{{ $t('more.nodePosition') }}</div>
        <div>{{ $t('more.netDelay') }}</div>
      </div>
      <!-- 列表 -->
      <div class="item" v-for="(item, $index) in list" :key="$index" @click="handleChooseNode(item)">
        <div>{{ item.area }}</div>
        <div class="nodeTime">
          <mt-spinner v-if="item.loading" type="snake" color="#0094d5" class="color-this"></mt-spinner>
          <span v-if="item.time"
            :class="{'nodeDelay': item.tip === 0, 'mediumLatency': item.tip === 1, 'highLatency': item.tip === 2 || item.tip === 3}">
            <span v-if="item.tip !== 3">{{ item.time }} ms</span>
            <span v-if="item.tip === 3">{{ $t('more.timeOut') }}</span>
          </span>
          <span class="iconfont icon-huaban51 choiceIcon" v-if="item.checked"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Spinner } from 'mint-ui';
import axios from 'axios';

export default {
  data() {
    return {
      active: -1,
      list: [],
    }
  },
  components: {
    mtSpinner: Spinner
  },
  mounted() {
    this.handleNodeInfo();
  },
  methods: {
    // 返回
    handleBack() {
      history.back();
    },
    // 获取节点信息
    handleNodeInfo() {
      this.$http.get('/common/getEosNodeList').then((res) => {
        if (res.code !== 0) {
          this.$toast({
            message: res.msg,
            position: 'center',
            duration: 2000,
          });
          return;
        }
        const nodeList = res.eosNodeList;
        const items = [];
        nodeList.forEach((vv) => {
          const v = vv;
          v.checked = false;
          v.time = '';
          v.tip = -1;
          items.push(v);
        })
        this.list = items;
        this.handleGetNodeTime();
      });
    },
    // 获取节点延时
    handleGetNodeTime() {
      this.list.map((vv) => {
        const v = vv;
        // 获取选中节点
        const storeNode = this.$store.state.sys.nodeList.eosNode;
        if (storeNode.httpEndpoint === v.url) {
          v.checked = true;
        }

        // 接口请求状态
        this.$set(vv, 'loading', true);

        // 查询延时
        let time = new Date().getTime();
        let tip = -1;
        axios.get(`${v.url}/v1/chain/get_info`).then(() => {
          this.$set(vv, 'loading', false);
          time = new Date().getTime() - time;
          v.time = time;
          // tip 0低延迟 1一般延迟 2高延迟 3超时
          if (time < 1000) {
            tip = 0;
          }
          if (time >= 1000 && time <= 3000) {
            tip = 1;
          }
          if (time > 3000 && time <= 9000) {
            tip = 2;
          }
          v.tip = tip;
          // if (i === 0) {
          //   this.time = v.time;
          //   this.tip = v.tip;
          // }
        }).catch(() => {
          this.$set(vv, 'loading', false);
          v.time = '9999+';
          v.tip = 3;
        });
      });
    },
    // 选择节点
    handleChooseNode(item) {
      const node = {
        httpEndpoint: item.url,
        protocol: item.protocol,
        host: item.host,
        port: Number(item.port),
        chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
        area: item.area,
      }
      this.$store.dispatch('setNode', node);
      setTimeout(() => {
        window.location.reload();
      }, 200);
      history.back();
    },
  }
}
</script>

<style scoped lang="scss">
@import "../../assets/css/public.scss";

.node{
  // 头部
  .tools{
    height: .9rem;
    line-height: .9rem;
    font-size: .36rem;
    text-align: center;
    position: relative;
    border-bottom: 1px solid $color-e3e3e3;

    .back{
      position: absolute;
      left: 10px;
      height: .9rem;
      line-height: .9rem;
      width: .4rem;
      font-size: .36rem;
    }
  }
  // 列表
  .list{
    font-size: .3rem;
    padding: 0px .24rem;

    .item{
      height: 1.14rem;;
      display: flex;
      align-items: center;/*垂直居中*/
      border-bottom: 1px solid $color-e3e3e3;

      &:first-child{
        font-size: .32rem;
        height: .7rem;
      }

      &>div{
        flex: 1;
        text-align: left;
      }

      &>div:first-child{
        padding-left: .6rem;
      }

      .nodeTime{
        display: flex;
        align-items: center;/*垂直居中*/
        // justify-content: center;
        position: relative;
      }

      .choiceIcon{
        position: absolute;
        right: .5rem;
        color: $color-blue;
        font-size: .20rem;
      }

      // 延时样式 start
      .nodeDelay {
        color: #67c269;
      }
      .mediumLatency {
        color: #FF9800;
      }
      .highLatency {
        color: #E51C23;
      }
      // 延时样式 end
    }
  }
}
</style>
