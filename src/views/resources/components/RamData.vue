<template>
  <div class="rexData">
    <div class="list">
      <div class="title"></div>
      <div class="item">
        <div class="tip">
          <span>{{ $t('resources.EOSPool') }}</span>
          <!-- <span @click="rexTotalPool = false" class="iconfont icon-huaban31 question"></span> -->
        </div>
        <div>
          <div class="bigNum" :class="{'down': Number(json.allEosChange) < 0}">
            <span>{{ json.allEos }} EOS</span>
            <span v-if="Number(json.allEosChange) >= 0"
              class="iconfont icon-huaban39 icon"></span>
            <span v-else class="iconfont icon-huaban40 icon"></span>
          </div>
          <div class="color-green" v-if="Number(json.allEosChange) >= 0">+{{ json.allEosChange }} EOS</div>
          <div class="color-red" v-else>{{ json.allEosChange }} EOS</div>
        </div>
      </div>

      <div class="item">
        <div class="tip">{{ $t('resources.Unallocated') }}</div>
        <div>
          <div class="bigNum" :class="{'down': Number(json.allRamChange) < 0}">
            <span>{{ json.allRam }} KB</span>
            <span v-if="Number(json.allRamChange) >= 0"
              class="iconfont icon-huaban39 icon"></span>
            <span v-else class="iconfont icon-huaban40 icon"></span>
          </div>
          <div class="color-green" v-if="Number(json.allRamChange) >= 0">+{{ json.allRamChange }} KB</div>
          <div class="color-red" v-else>{{ json.allRamChange }} KB</div>
        </div>
      </div>

      <div class="item">
        <div class="tip">
          <span @click="priceFormula = true">{{ $t('resources.formula') }}</span>
          <span @click="priceFormula = true" class="iconfont icon-huaban31 question"></span>
        </div>
      </div>
    </div>
    <!-- 价格公式 -->
    <mt-popup
      class="popup"
      v-model="priceFormula">
        <RamPrice v-if="priceFormula" @listenClose="handleClose" />
    </mt-popup>
  </div>
</template>

<script>
import { Popup } from 'mint-ui';
import { getRamData } from '@/utils/publicApi'
import RamPrice from '@/views/resources/popup/RamPrice'; // 价格公式
// import RexTotalPool from '@/views/resources/popup/RexTotalPool'; // 价格公式

export default {
  data() {
    return {
      json: {
        allEos: 0, // EOS池子总量
        allEosChange: '0.0000', // eos增加|减少数量
        allRam: 0, // ram总量
        allRamChange: '0.00'// ram增加|减少数量
      },
      timer: null, // 定时器
      priceFormula: false,
    }
  },
  components: {
    RamPrice,
    mtPopup: Popup,
  },
  mounted() {
    this.handleGetRamData();
    window.clearInterval(this.timer);
    this.timer = window.setInterval(() => {
      this.handleGetRamData();
    }, 10000);
  },
  methods: {
    handleGetRamData() {
      getRamData((err, res) => {
        if (err) {
          return;
        }
        // this.json = res.data;
        const ramBlance = res.data.base.balance;
        const eosBlance = res.data.quote.balance;
        const ThisBalanceRam = (parseFloat(ramBlance, 0) / 1024).toFixed(2);
        // const ThisAllEos = (parseFloat(ramBlance, 0) * price).toFixed(4);
        const ThisAllEos = parseFloat(eosBlance, 0).toFixed(4);
        const balanceRamStorage = Number(sessionStorage.getItem('balanceRamStorage'));
        const allEosStorage = Number(sessionStorage.getItem('allRamEosStorage'));
        if (balanceRamStorage && Number(ThisBalanceRam) !== Number(balanceRamStorage)) {
          const balanceRamChange = (ThisBalanceRam - balanceRamStorage).toFixed(2);
          this.$set(this.json, 'allRamChange', balanceRamChange)
        }
        if (allEosStorage && Number(ThisAllEos) !== Number(allEosStorage)) {
          const allEosChange = (ThisAllEos - allEosStorage).toFixed(4);
          this.$set(this.json, 'allEosChange', allEosChange)
        }
        const balanceRam = ThisBalanceRam;
        const allEos = ThisAllEos;
        this.$set(this.json, 'allRam', balanceRam)
        this.$set(this.json, 'allEos', allEos)
        sessionStorage.setItem('balanceRamStorage', ThisBalanceRam);
        sessionStorage.setItem('allRamEosStorage', ThisAllEos);
      })
    },
    handleClose() {
      this.priceFormula = false;
    },
  },
  beforeDestroy() {
    window.clearInterval(this.timer);
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.rexData{
  padding: .26rem;
  font-size: .25rem;

  .list{
    margin-bottom: .56rem;

    &:last-child{
      margin-bottom: 0rem;
    }

    .item{
      margin-bottom: .26rem;

      &:last-child{
        margin-bottom: 0rem;
      }

      .question{
        font-size: .25rem;
        margin-left: .12rem;
      }
    }

    .title{
      font-size: .27rem;
      margin-bottom: .14rem;
    }

    .tip{
      color: $color-999;
      display: flex;
      align-items: center;
      margin-bottom: .04rem;

      &>span:nth-child(2){
        margin-left: .12rem;
      }
    }

    .bigNum{
      font-size: .32rem;
      color: $color-green;
      display: flex;
      align-items: center;

      &.down{
        color: $color-red;
      }

      .icon{
        font-size: .28rem;
      }
    }
  }
}
.popup{
  background: transparent;
  top: 30%;
  transform: translate(-50%, -30%);
}
</style>
