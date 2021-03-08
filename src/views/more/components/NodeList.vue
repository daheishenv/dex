<template>
  <div class="popupLang">
    <span class="iconfont icon-huaban17 popupClose" @click="handleClosePopup"></span>
    <div class="title btnNoBdColor">{{ $t('more.switchNode') }}</div>
    <div class="langList">
      <template v-if="options.length > 0">
        <div class="list" v-for="(item, index) in options" :key="index" @click="listenNodeChange(item)">
          <span>
            <span class="flex">
              <span>{{ item.area }}</span>
              <span style="padding-left: 5px;">
                <span class="nodeDelay" v-if="item.tip === 0"> {{ item.time }}ms </span>
                <span class="mediumLatency" v-if="item.tip === 1"> {{ item.time }}ms </span>
                <span class="highLatency" v-if="item.tip === 2"> {{ item.time }}ms </span>
                <span class="highLatency" v-if="item.tip === 3">
                  > 5s
                </span>
              </span>
            </span>
            <span style="color:#999">{{ item.url }}</span>
          </span>
          <span class="lang" :class="{ checked: nodeChecked.host === item.host && nodeChecked.port == item.port }">
            <span
              v-if="nodeChecked.host === item.host && nodeChecked.port == item.port"
              class="iconfont icon-icon"
              style="font-size:.36rem; margin-bottom:.02rem;color:#4a90e2"
            ></span>
          </span>
        </div>
      </template>
      <div style="padding: 100px 0; text-align:center" v-else>
        Loading...
      </div>
    </div>
    <div class="btn btnBack" @click="handleChangeNodeSubmit">{{ $t('public.sure') }}</div>
  </div>
</template>

<script>
import { Indicator } from 'mint-ui';
import axios from 'axios';

export default {
  name: 'NodeList', // 节点切换列表
  data() {
    return {
      options: [], // 选择框列表值
      passNode: ['https://api.eossweden.se', 'https://eos.greymass.com', 'https://api.eosn.io'], // 过滤不需要请求的节点
      comfirmShow: false, // 确定节点按钮
      loading: true,
      nodeChecked: {
        url: '',
        host: '',
        protocol: '',
        port: '',
        area: '', // 选中地区
        time: '', // 选中时间
        tip: -1, // 选中延迟状态
      },
      noData: false,
      optionsIndex: 0,
      optionsTimer: null,
    };
  },
  props: ['nodeListVisible'],
  watch: {
    nodeListVisible: function change(val) {
      if (val) {
        this.handleGetNodeInfo();
        this.comfirmShow = false;
      }
    },
  },
  components: {},
  created() {
    // 获取节点
    let node = localStorage.getItem('nodeChecked');
    if (node) {
      this.nodeChecked = JSON.parse(node);
    }
    this.handleGetNodeInfo();
  },
  mounted() {},
  beforeDestroy() {
    this.optionsIndex = this.options.length;
    this.optionsTimer && window.clearTimeout(this.optionsTimer);
  },
  methods: {
    // 选择节点
    listenNodeChange(item) {
      this.nodeChecked = item;
    },
    // 获取节点
    handleGetNodeInfo() {
      this.loading = true;
      this.$http.get('/common/getNodeList').then((res) => {
        this.loading = false;
        if (res.code !== 0) {
          this.$message.error(res.msg);
          this.loading = false;
          return;
        }
        const items = [];
        let checkedIndex = 0;
        const chain = this.$store.state.sys.urlChain;
        const storeNodeChecked = this.$store.state.sys.nodeList[`${chain}Node`];
        res.nodeList.forEach((vv, i) => {
          const v = vv;
          v.checked = storeNodeChecked.url === v.url;
          v.time = '';
          v.tip = -1;
          items.push(v);
          if (v.checked) {
            this.nodeChecked = v;
            checkedIndex = i;
          }
        });
        items.unshift(items.splice(checkedIndex, 1)[0]);
        this.options = items;
        this.loading = false;
        this.handleGetNodeTime();
      });
    },
    // 计算节点请求时间
    async handleGetNodeTime() {
      // 递归方式获取节点请求时间
      const optionsLength = this.options.length;
      if (this.optionsIndex === optionsLength) return;
      const v = this.options[this.optionsIndex];
      let time = new Date().getTime();
      let tip = 3;
      if (this.passNode.find(p => p === v.url)) {
        v.time = Math.floor(Math.random() * (2000 - 1800) + 1800);
        v.tip = 1;
      } else {
        try {
          await axios.get(`${v.url}/v1/chain/get_info`);
          time = new Date().getTime() - time;
          // tip 0低延迟 1一般延迟 2高延迟 3超时
          if (time < 1000) {
            tip = 0;
          }
          if (time >= 1000 && time <= 2000) {
            tip = 1;
          }
          if (time > 2000) {
            tip = 2;
          }
          v.time = time;
          v.tip = tip;
        } catch (error) {
          v.time = Math.floor(Math.random() * (3000 - 2000) + 2000);
          v.tip = 3;
        }
      }
      this.optionsTimer && window.clearTimeout(this.optionsTimer);
      this.optionsTimer = window.setTimeout(this.handleGetNodeTime, 500);
      this.optionsIndex += 1;
    },


    // 计算节点请求时间
    // handleGetNodeTime() {
    //   this.options.forEach(async (vv) => {
    //     const v = vv;
    //     let time = new Date().getTime();
    //     let tip = 3;
    //     if (this.passNode.find(p => p === v.url)) {
    //       v.time = Math.floor(Math.random() * (3000 - 2000) + 2000);
    //       v.tip = 1;
    //       return;
    //     }
    //     try {
    //       await axios.get(`${v.url}/v1/chain/get_info`);
    //       time = new Date().getTime() - time;
    //       // tip 0低延迟 1一般延迟 2高延迟 3超时
    //       if (time < 1000) {
    //         tip = 0;
    //       }
    //       if (time >= 1000 && time <= 3000) {
    //         tip = 1;
    //       }
    //       if (time > 3000) {
    //         tip = 2;
    //       }
    //       v.time = time;
    //       v.tip = tip;
    //     } catch (error) {
    //       v.time = 10000;
    //       v.tip = 3;
    //     }
    //   });
    // },

    // 更换节点
    handleChangeNodeSubmit() {
      this.handleClosePopup();
      Indicator.open('');
      const nodeCheckedObj = JSON.parse(localStorage.getItem('nodeChecked') || '{}');
      const chain = this.$store.state.sys.urlChain;
      nodeCheckedObj[`${chain}Node`] = this.nodeChecked;
      localStorage.setItem('nodeChecked', JSON.stringify(nodeCheckedObj));
      // this.$store.dispatch('setNodeException', 0) // 更换节点提示, 清空统计
      this.$router.replace('/');
      setTimeout(() => {
        location.reload();
      }, 200);
    },
    // 关闭弹窗
    handleClosePopup() {
      this.$emit('listenNodeList', false);
    },
  },
};
</script>
<style lang="scss" scoped>
.popupLang {
  background: #fff;
  border-radius: 20px;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  padding: 0.36rem 0.36rem 0.5rem;
  color: #333;

  .popupClose {
    position: absolute;
    right: 0.2rem;
    top: 0.2rem;
    font-size: 0.25rem;
  }

  .title {
    font-size: 0.4rem;
    color: #333;
    margin-bottom: 0.33rem;
    text-align: center;
  }

  .langList {
    .list {
      height: 1.14rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e8e8e8;
      padding: 0 0.1rem;
      font-size: 0.33rem;
      &:last-child {
        border-bottom: 0px solid #e8e8e8;
      }

      .lang {
        height: 0.36rem;
        width: 0.36rem;
        font-size: 0.36rem;
        color: #333;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #999;
        border-radius: 1rem;
        box-sizing: border-box;

        &.checked {
          font-size: 0.38rem;
          border: 0px solid transparent;
        }
      }
    }
  }

  .btn {
    margin: auto;
    margin-top: 0.45rem;
    width: 3.2rem;
    font-size: 0.28rem;
    background: #4a90e2;
    border-radius: 0.12rem;
    height: 0.82rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
  }
}

.langList {
  max-height: 5.28rem;
  overflow: auto;
}

.nodeDelay {
  color: #67c269;
}
.mediumLatency {
  color: #ff9800;
}
.highLatency {
  color: #e51c23;
}
</style>
