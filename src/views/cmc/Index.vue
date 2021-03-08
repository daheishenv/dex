<template>
  <div class="content">
    <div class="cmc-content" ref="cmcTop">
      <h1>System Status</h1>
      <div>Supporting {{tableData.length}} assets</div>
      <p>The System Status page is a monitoring tool
        designed by our team that provides near
        real-time information (updates approximately every 5 minutes)
        about availability and performance,
        as well as incoming and outgoing transaction status.
        This is an evolving tool that will include more
        information on the system performance, aiming at
        making our system processes as transparent as possible.</p>
      <p>Our deposit wallets funds are only temporary
        storage until the deposit has been processed.
        Our system regularly batches the inputs from deposit
        transactions into a single transaction sent
        to the withdrawal wallet.</p>
    </div>
    <div class="tablelist" ref="tablesms" :style="{height: tableHeight + 'px'}">
      <div :class="{'fixedTabHead': fiexdShow}">
        <div class="tabhead">
          <div class="wd1">Coin</div>
          <div class="wd2">Asset Type</div>
          <div class="wd3">Deposits</div>
          <div class="wd4">Withdrawals</div>
          <div class="wd5">Trading</div>
          <div class="wd6">Pending Deposits</div>
          <div class="wd7">Pending Withdrawals</div>
          <div class="wd8">2 Week Average Deposit Time</div>
          <div class="wd9">2 Week Average Withdrawal Time</div>
          <div class="wd10">Maintenance Notes</div>
        </div>
        <template v-if="tableData.length > 0">
          <div class="tabbody" v-for="(item, index) in tableData" :key="index">
            <div class="wd1">{{item.currency}}</div>
            <div class="wd2">Token</div>
            <div class="wd3">{{item.status === 0 ? 'Active' : 'Offline'}}</div>
            <div class="wd4">{{item.status === 0 ? 'Active' : 'Offline'}}</div>
            <div class="wd5">{{item.status === 0 ? 'Active' : 'Offline'}}</div>
            <div class="wd6">0</div>
            <div class="wd7">0</div>
            <div class="wd8">0</div>
            <div class="wd9">0</div>
            <div class="wd10">-</div>
          </div>
        </template>
        <template v-else>
          <div style="font-size: 0.3rem; color:#999; text-align:center; padding: 0.5rem">
            Loading...
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Cmc', // 系统币状态
  components: {
  },
  data() {
    return {
      tableData: [],
      loadingTable: true,
      timer: null,
      fiexdShow: false,
    };
  },
  props: {
  },
  watch: {
  },
  created() {
  },
  mounted() {
    this.handleGetApi();
    this.timer = window.setInterval(() => {
      this.handleGetApi();
    }, 300000);
    // const smsTopHeight = this.$refs.cmcTop.offsetHeight;
    // console.log(this.$refs.cmcTop.offsetHeight);
    // window.addEventListener('scroll', () => {
    //   const {
    //     scrollTop
    //   } = document.scrollingElement;
    //   // 当前滚动高度 + 视口高度 >= 文档总高度
    //   // if (scrollTop + clientHeight >= scrollHeight) {
    //   //   console.log("已到达底部");
    //   // }
    //   if (scrollTop >= smsTopHeight) {
    //     this.fiexdShow = true;
    //   } else {
    //     this.fiexdShow = false;
    //   }
    // });
  },
  methods: {
    handleGetApi() {
      const hostName = location.hostname;
      let url = 'https://api.newdex.io/v1/common/symbols';
      // let url = 'http://192.168.8.18:7003/v1/common/symbols';
      if (hostName.indexOf('.vip') >= 0 || hostName.indexOf('340wan') >= 0) {
        url = 'https://api.newdex.vip/v1/common/symbols';
      }
      axios({
        method: 'get',
        url,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }).then((res) => {
        if (res.data.code === 200) {
          const data = res.data.data || [];
          data.sort((a, b) => {
            const sortData = b.currency < a.currency ? 1 : -1;
            return sortData;
          })
          this.tableData = data;
          this.loadingTable = false;

          // this.$nextTick(() => {
          //   setTimeout(() => {
          //     this.tableHeight = this.$refs.tablesms.offsetHeight;
          //   })
          // })
        }
      })
    },
  },
};
</script>

<style lang="scss" scoped>
  .content {
    background: #f9f9f9;
    margin: 0 auto;
    padding: 0.1rem 0.25rem 0.3rem;

    /deep/ .el-table__fixed::before {
      background-color: transparent
    }

    /deep/ .el-table {
      color: #7b8db9
    }

    /deep/ .el-table__body-wrapper {
      &::-webkit-scrollbar {
        width: 5px;
        height: 5px;
        background-color: rgba(0, 0, 0, 0);
        border-radius: 15px;
      }
      /*定义滚动条的轨道，内阴影及圆角*/
      &::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 0 rgba(0, 0, 0, 0);
        border-radius: 0;
        background-color: rgba(0, 0, 0, 0);
        border-radius: 15px;
      }
      /*定义滑块，内阴影及圆角*/
      &::-webkit-scrollbar-thumb {
        /*width: 10px;*/
        /*height: 25px;*/
        -webkit-box-shadow: inset 0 0 0 rgba(255, 255, 255, .1);
        background-color: rgba(255, 255, 255, .1);
        border-radius: 15px;
      }
    }
  }
  .cmc-content {
    padding: 0.2rem 0;

    h1 {
      padding: 0 0 0.2rem;
      font-size: 0.4rem;
    }

    div {
      padding: 0 0 0.2rem;
      margin-bottom: 0.2rem;
      border-bottom: 1px solid #dedede;
      font-size: 0.35rem;
    }

    p {
      font-size: 0.3rem;
      line-height: 1.42857143;
      padding: 0.1rem 0;
      margin-bottom: 0.15rem;
      text-indent: 0;
      color: #666
    }
  }
  .tablelist {
    max-width: 100%;
    // margin: 0 0.1rem;
    overflow: auto;

    // .fixedTabHead {
    //   position: fixed;
    //   top: 0;
    //   left: 0;
    // }
  }
  .tabhead, .tabbody{
    display: flex;

    div {
      font-size: 0.3rem;
      color: #666;
      padding: 0.1rem;
      border-bottom: 1px solid #ddd;
    }

    div.wd1 { min-width: 1.5rem }
    div.wd2 { min-width: 1.6rem }
    div.wd3 { min-width: 1.3rem }
    div.wd4 { min-width: 1.8rem }
    div.wd5 { min-width: 1.3rem }
    div.wd6 { min-width: 2.6rem }
    div.wd7 { min-width: 3.1rem }
    div.wd8 { min-width: 4.4rem }
    div.wd9 { min-width: 4.8rem }
    div.wd10 { min-width: 2.8rem }
  }
  .tabhead {
    div {
      color: #333;
      font-weight: bold;
      padding: 0.1rem 0.1rem 0.2rem;
      border-bottom-color: #ccc;
    }
  }
</style>
