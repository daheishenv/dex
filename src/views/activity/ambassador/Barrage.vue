<template>
  <div class="barrage">
    <header>
      <i class="iconfont icon-huaban23 logoicon"></i>
      <!-- <i class="iconfont icon-huaban129 moreIcon"></i> -->
      <div class="language">
        <Language/>
      </div>
    </header>
    <!-- 图片标题 -->
    <img class="dmTitle" v-if="$store.state.app.language === 'zh-CN' || $store.state.app.language === 'zh-TW'"
     src="https://nds.340wan.com/static/assets/img/activity/christmas2019/dmTitle.png" alt />
    <img class="dmTitle en" v-else src="https://nds.340wan.com/static/assets/img/activity/christmas2019/dmTitleen.png" alt />
    <!-- 获奖记录 -->
    <mt-popup class="mtPopup" v-model="showPopupWish" popup-transition="popup-fade">
      <PopupWish v-if="showPopupWish" :isState='isState' @listenClose="handleClose" />
    </mt-popup>
  </div>
</template>
<script>
import Language from '@/components/Language';
import { Toast, Popup } from 'mint-ui';
import { accountToSign } from '@/utils/publicApi'
import DApp from '@/utils/wallet';
import PopupWish from './PopupWish';

export default {
  components: {
    Language,
    PopupWish,
    mtPopup: Popup,
  },
  props: ['remainWishCount'],
  data() {
    return {
      config: {
        channels: 4, // 弹道
        loop: true, // 是否循环
        speed: 10, // 速度
        fontSize: 18, // 字体大小
      },
      inputText: '',
      inputName: '',
      // danmus, // 初始化数据
      christmasWishs: [],
      showPopupWish: false,
      isState: 0,
    }
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.$refs.danmaku.play();
    // });
    this.handleGetLastDrawList()
    this.handleScroll()
  },
  beforeDestroy() {
    window.clearTimeout(this.timerout);
  },
  methods: {
    handleTrxid(trxId) {
      window.open(`https://bloks.io/transaction/${trxId}`);
    },
    // 获取最近100条中奖纪录
    handleGetLastDrawList() {
      this.$http.post('/christmas/getGrandPrizeList').then((res) => {
        if (res.code !== 0) return
        this.noticeList = res.grandPrizeList
      })
    },
    // 抽奖公告滚动组件
    handleScroll() {
      const mainTop = document.getElementById('trxidNotice');
      if (!mainTop) {
        return;
      }
      if (this.timer) {
        window.clearInterval(this.timer);
      }
      if (this.timerout) {
        window.clearTimeout(this.timerout);
      }
      this.timerout = window.setTimeout(() => {
        this.timer = window.setInterval(() => {
          mainTop.scrollTop += 1;
          // 错误处理
          if (!mainTop.getElementsByClassName('notices')[0]) {
            return;
          }
          const height = mainTop.getElementsByClassName('notices')[0].scrollHeight;
          if (mainTop.scrollTop > height) {
            mainTop.appendChild(mainTop.getElementsByClassName('notices')[0]);
            mainTop.scrollTop -= height;
            this.handleScroll();
          }
        }, 25);
      }, 1000);
    },
    handleClose() {
      this.showPopupWish = false
    },
    onInit() {
      // this.$refs.danmaku.play()
    },
    onMouseIn() {
      // console.log('in')
    },
    onMouseOut() {
      // console.log('out')
    },
    play(type) {
      switch (type) {
        case 'play':
          this.$refs.danmaku.play()
          break
        case 'pause':
          this.$refs.danmaku.pause()
          break
        case 'stop':
          this.$refs.danmaku.stop()
          break
        case 'show':
          this.$refs.danmaku.show()
          break
        case 'hide':
          this.$refs.danmaku.hide()
          break
        case 'reset':
          this.$refs.danmaku.reset()
          break
        default: break
      }
    },
    // 提交成功
    handleSuccess(val) {
      Toast(this.$t('christmas.chris62'))
      this.handleChristmasList('find', val);
    },
    // 获取最近100个愿望
    handleChristmasList(val, type) {
      this.$http.post('/christmas/getChristmasWishs').then((res) => {
        if (res.code !== 0) {
          return;
        }
        const wishs = res.christmasWishs;
        if (val === 'select') {
          wishs.forEach((v) => {
            const vv = v;
            if (!vv.nickname) {
              vv.nickname = this.$t('christmas.chris61')
              vv.createTs = new Date(vv.createTs).getTime();
            }
          });
          this.christmasWishs = wishs.sort((a, b) => a.createTs - b.createTs);
          this.$refs.danmaku.play();
        } else {
          const params = {
            nickname: this.inputName,
            wish: this.inputText
          }
          if (type === 'type1') {
            this.trxId = wishs[0].trxId;
          }
          if (type === 'type2') {
            const trxId = wishs.find(v => v.memo === this.inputText && v.account === this.$store.state.app.accountInfo.account);
            if (trxId && trxId.trxId) {
              this.trxId = trxId.trxId;
            } else {
              this.trxId = wishs[0].trxId;
            }
          }
          this.christmasWishs.push({
            nickname: params.nickname,
            memo: params.wish,
            createTs: new Date().getTime(),
            trxId: this.trxId,
            className: 'wishClass',
          })
          this.inputName = ''
          this.inputText = '';
        }
      });
    },
    // 添加弹幕
    handleAddDanmu() {
      if (!this.inputText) {
        Toast(this.$t('christmas.chris5'))
        return
      }
      if (this.inputText.length < 4) {
        Toast(this.$t('christmas.chris70'))
        return
      }
      this.inputText = this.inputText.replace(/(\r\n|\n|\r)/gm, ' ')
      if (!this.inputName) {
        this.inputName = this.$t('christmas.chris61')
      }
      const params = { txt: `${this.inputName}${this.inputText}` }
      // 判断敏感词
      this.$http.post('/christmas/checkSensitiveWord', params).then((res) => {
        if (res.code !== 0) {
          return
        }
        if (res.result) {
          Toast(this.$t('christmas.chris63'))
          return
        }
        // 条件一 无账户
        const channelRef = localStorage.getItem('channelRef')
        if (channelRef === 'h5' && !this.$store.state.sys.isAppView) {
          this.handleSubmit()
        } else {
          // 条件二 有账户转账
          this.handleDrawInfo()
        }
      })
    },
    // 无账户许愿
    handleSubmit() {
      this.$http.post('/christmas/getNoAccountWishCount').then((resp) => {
        if (resp.code !== 0) {
          return
        }
        if (!Number(resp.noAccountWishCount)) {
          // Toast('无剩余无账号许愿数量')
          this.isState = 0
          this.showPopupWish = true
          return
        }
        const params = { nickname: this.inputName, wish: this.inputText }
        this.$http.post('/christmas/makeWish', params).then((responst) => {
          if (responst.code === 1030) {
            this.isState = 0
            this.showPopupWish = true
            return
          }
          if (responst.code !== 0) {
            return
          }
          this.handleSuccess('type1');
        })
      })
    },
    // 有账号获取次数限制
    handleDrawInfo() {
      this.$http.post('/christmas/getAccountDrawInfo').then((res) => {
        if (res.code === 401) {
          accountToSign(this, () => {
            this.handleDrawInfo()
          })
        }
        if (res.code === 1028) {
          this.handleSubmit()
          return
        }
        if (res.code !== 0) {
          return;
        }
        if (Number(res.remainWishCount)) {
          this.handleSubmitTransfer();
          return;
        }
        // 超过3次数弹窗
        this.isState = 1
        this.showPopupWish = true
      });
    },
    // 账户转账
    async handleSubmitTransfer() {
      const memo = JSON.stringify({ nickname: this.inputName, wish: this.inputText })
      const obj = {
        code: 'eosio.token',
        toAccount: 'wishcarnival',
        quantity: '0.0001 EOS',
        memo,
        // tp 需要更多的参数
        tokenName: 'EOS',
        precision: 4,
      };
      const params = {
        actions: [
          {
            account: obj.code,
            name: 'transfer',
            authorization: [{
              actor: fromName, // 转账者
              permission,
            }],
            data: {
              from: fromName,
              to: obj.toAccount,
              quantity,
              memo: obj.memo
            }
          }
        ]
      };
      const transferParams = {
        params,
        useFreeCpu: false
      }
      const result = await DApp.transactionApi(message.action);
      // 错误信息
      if (result && result.code !== 0) {
        DApp.handleScatterErrorBack(result, (type, text) => {
          type === 'lang' ? this.$toast(this.$t(text)) : this.$toast(text);
        });
        return;
      }
      this.handleSuccess('type2');
      // DApp.transfer(obj, (err) => {
      //   if (err) {
      //     Toast(this.$t('christmas.chris66'))
      //     return;
      //   }
      //   this.handleSuccess('type2');
      // });
    },
  },
  created() {
    this.handleChristmasList('select')
  }
}
</script>
<style lang="scss" scoped>
.barrage {
  // height: 6.2rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: url('https://nds.340wan.com/static/assets/img/activity/christmas2019/dmbg.png') no-repeat;
  background-size: 100% 6.2rem;
}
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  // font-size: 0.6rem;
  padding: 0.3rem 0.3rem 1rem 0.3rem;
  box-sizing: border-box;
  color: #eecca4;
  position: relative;
  .language{
    position: absolute;
    top: 0.4rem;
    right: 0.2rem;
  }
}
.logoicon {
  font-size: 0.4rem;
}
.moreIcon {
  font-size: 0.3rem;
}
.dmTitle {
  width: 5.54rem;
  max-width: 100%;
  margin: 0 auto;
  &.en{
    height: 1.56rem;
    max-width: 100%;
  }
}
.dmDiv {
  // position: relative;
  margin-top: .5rem;
  height: 6.4rem;
  width: 100%;
  background: url("https://nds.340wan.com/static/assets/img/activity/christmas2019/dmTree.png") no-repeat center;
  background-size: auto 6rem;
  .vue-danmaku{
    height: 5.5rem;
    width: 100%;
    overflow: hidden;
  }
}
.tipDiv{
  padding: .4rem .5rem .2rem;
  box-sizing: border-box;

  .tipName{
    font-size: 0.25rem;
    color: #F1C89D;
    margin-bottom: .15rem;
  }
  .tip{
    // margin: .17rem .36rem;
    font-size: 0.25rem;
    color: #EEC69D;
    // padding-left: .3rem;
    // position: relative;
    margin-bottom: .1rem;

  // &::before{
  //   content: '';
  //   position: absolute;
  //   width: .0916rem;
  //   height: .0916rem;
  //   border-radius: .2rem;
  //   background: #A6B6D7;
  //   left: .15rem;
  //   top: .18rem;
  //   transform: translate(-50%, -50%);
  //  }
  }
}
    /* 动画效果 */
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.3s ease-in-out;
    overflow: hidden;
    visibility: visible;
    opacity: 1;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
    visibility: hidden;
  }
  .moreTip{
    width: 100%;
    height: .7rem;
    font-size: .26rem;
    color: #999;
    display: flex;
    justify-content: center;
    align-items: center;
    // background-color: #999;
    .moreTipsIcon{
      font-size: .14rem;
      margin-left: .1rem;
      &.on{
        transform: rotate(180deg);
      }
    }
  }

</style>
