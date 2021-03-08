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
     src="@/assets/img/activity/christmas2019/sl.png" alt />
    <img class="dmTitle en" v-else src="@/assets/img/activity/christmas2019/slEn.png" alt />
    <img class="dmTitle" style="margin-top: .3rem;" v-if="$store.state.app.language === 'zh-CN' || $store.state.app.language === 'zh-TW'"
     src="@/assets/img/activity/christmas2019/lian.png" alt />
    <img class="dmTitle en" style="margin-top: .3rem;"  v-else src="@/assets/img/activity/christmas2019/lianEn.png" alt />
    <!-- 许愿公告 -->
    <div class="noticeDiv" v-show="noticeList && noticeList.length">
      <div class="notice">
        <img class="noticeImg" src="@/assets/img/activity/jubilee/notice.png" alt="">
        <div class="noticeText" id="trxidNotice">
            <div class="notices" v-for="(item, index) in noticeList" :key="index">
              <div class="noti-item" @click="handleTrxid(item.trxId)">
                {{ $t('christmas.chris69', {account: item.account }) }}&nbsp;&nbsp;>
              </div>
            </div>
          <div class="notices" v-for="(item, index) in noticeList" :key="index + '100'">
            <div class="noti-item" @click="handleTrxid(item.trxId)">
              {{ $t('christmas.chris69', {account: item.account }) }}&nbsp;&nbsp;>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="dmDiv">
      <div class="vue-danmaku">
        <vue-danmaku ref="danmaku"
        :danmus="christmasWishs"
        :config="config"
        @inited="onInit"></vue-danmaku>
      </div>
    </div>
    <div class="dmInputDiv">
      <img class="dmlogo1" src="@/assets/img/activity/christmas2019/dmlogo1.png" alt="" srcset="">
      <img class="dmlogo2" src="@/assets/img/activity/christmas2019/dmlogo2.png" alt="" srcset="">
      <div class="dmInput">
        <h2>{{$t('christmas.chris60')}}</h2>
        <div class="inputDiv">
          <input class="input" type="text" v-model.trim="inputName"  :placeholder="$t('christmas.chris4')" maxlength="10" />
        </div>
        <div class="textareaDiv">
          <img  class="dmIcon" src="@/assets/img/activity/christmas2019/dmIcon.png" alt="">
          <textarea class="textarea" v-model.trim="inputText" :placeholder="$t('christmas.chris5')" maxlength="60" />
        </div>
        <div class="btn" @click="handleAddDanmu">
          {{$t('christmas.chris6')}}
        </div>
      </div>
    </div>
    <div class="tipDiv">
      <div class="tipName">{{$t('christmas.chris7')}}</div>
      <div class="tip">{{$t('christmas.chris8')}}</div>
      <div class="tip">{{$t('christmas.chris9')}}</div>
       <transition name="fade">
        <div v-show="isMoreTips">
          <div class="tip"> {{$t('christmas.chris10')}}</div>
          <div class="tip">{{$t('christmas.chris11')}}</div>
          <div class="tip">{{$t('christmas.chris12')}}</div>
          <div class="tip">{{$t('christmas.chris13')}}</div>
        </div>
       </transition>
    </div>
       <div class="moreTip" @click="isMoreTips = !isMoreTips">
      <!-- {{ isMoreTips?$t('halloween.viewMoreTips1'):$t('christmas.chris58')}} -->
      <span class=" iconfont icon-huaban37 moreTipsIcon" :class="{'on': isMoreTips}"></span>
    </div>
    <!-- 获奖记录 -->
    <mt-popup class="mtPopup" v-model="showPopupWish" popup-transition="popup-fade">
      <PopupWish v-if="showPopupWish" :isState='isState' @listenClose="handleClose" />
    </mt-popup>
  </div>
</template>
<script>
import Language from '@/components/Language';
import { Toast, Popup } from 'mint-ui';
import VueDanmaku from '@/components/Baberrage/Main'
import { accountToSign } from '@/utils/publicApi'
// import { danmus } from '@/components/Baberrage/testData'
import DApp from '@/utils/wallet';
import PopupWish from './PopupWish'

export default {
  components: {
    Language,
    VueDanmaku,
    PopupWish,
    mtPopup: Popup
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
      isMoreTips: false,
      noticeList: [], // 许愿公告
      submitLoading: false,
    }
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.$refs.danmaku.play();
    // });
    this.handleGetLastDrawList()
    this.handleScroll()
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
      Toast(this.$t('christmas.chris62'));
      this.handleChristmasList('find', val);
    },
    // 获取最近100个愿望
    handleChristmasList(val, type) {
      this.$http.post('/christmas/getChristmasWishs').then((res) => {
        if (res.code !== 0) {
          this.submitLoading = false;
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
          this.submitLoading = false;
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
            const trxId = wishs.find(v => v.memo === this.inputText && v.account === this.$store.state.app.accountInfo.account_name);
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
          this.submitLoading = false;
          this.inputName = ''
          this.inputText = '';
        }
      });
    },
    // 添加弹幕
    handleAddDanmu() {
      if (this.submitLoading) return;
      this.submitLoading = true;
      if (!this.inputText) {
        this.submitLoading = false;
        Toast(this.$t('christmas.chris5'));
        return
      }
      if (this.inputText.length < 4) {
        this.submitLoading = false;
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
          this.submitLoading = false;
          return
        }
        if (res.result) {
          this.submitLoading = false;
          Toast(this.$t('christmas.chris63'))
          return
        }
        // 条件一 无账户
        const channelRef = localStorage.getItem('channelRef');
        const accout = this.$store.state.app.accountInfo.account;
        if ((channelRef === 'h5' || !accout) && !this.$store.state.sys.isAppView) {
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
          this.submitLoading = false;
          return
        }
        if (!Number(resp.noAccountWishCount)) {
          this.submitLoading = false;
          // Toast('无剩余无账号许愿数量')
          this.isState = 0
          this.showPopupWish = true
          return
        }
        const params = { nickname: this.inputName, wish: this.inputText }
        this.$http.post('/christmas/makeWish', params).then((responst) => {
          if (responst.code === 1030) {
            this.submitLoading = false;
            this.isState = 0
            this.showPopupWish = true
            return
          }
          if (responst.code !== 0) {
            this.submitLoading = false;
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
          this.handleSubmit();
          return
        }
        if (res.code !== 0) {
          this.submitLoading = false;
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
      // const obj = {
      //   code: 'eosio.token',
      //   toAccount: 'wishcarnival',
      //   quantity: '0.0001 EOS',
      //   memo,
      //   // tp 需要更多的参数
      //   tokenName: 'EOS',
      //   precision: 4,
      // };
      const fromName = this.$store.state.app.accountInfo.account;
      const permission = this.$store.state.app.accountInfo.permissions;
      const transferParams = {
        useFreeCpu: false,
        params: {
          actions: [
            {
              account: 'eosio.token',
              name: 'transfer',
              authorization: [{
                actor: fromName, // 转账者
                permission,
              }],
              data: {
                from: fromName,
                to: 'wishcarnival',
                quantity: '0.0001 EOS',
                memo
              }
            }
          ]
        }
      };
      const result = await DApp.transactionApi(transferParams);
      // 错误信息
      if (result && result.code !== 0) {
        this.submitLoading = false;
        DApp.handleScatterErrorBack(result, (type, text) => {
          type === 'lang' ? this.$toast(this.$t(text)) : this.$toast(text);
        });
        return;
      }
      this.handleSuccess('type2');
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
  // background: url('../../../assets/img/activity/christmas2019/dmbg.png') no-repeat;
  background-size: 100% 6.2rem;
}
input::-webkit-input-placeholder {
  color: #fff !important;
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
    width: 90% !important;
    // height: 1.56rem;
    max-width: 100%;
  }
}
.noticeDiv{
    // height: 3rem;
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    margin: 0.1rem 0 0.3rem;
    overflow: hidden;

    .title{
      // height: 1.44rem;
      width: 100%;
      line-height: 0.8rem;
      display: flex;
      justify-content: center;
      font-size: 0.44rem;
      font-weight: bold;
      text-align: center;
      // color: #f2ba68;
      color:#ffd255;
      margin-top: 0.5rem;
    }
    .notice{
      width: 100%;
      height: 0.6rem;
      margin: 0.1rem auto;
      border-radius: 0.26rem;
      display: flex;
      justify-content: center;
      display: flex;
      align-items: center;
      padding: 0 0.3rem;
      box-sizing: border-box;
      overflow: hidden;
      .noticeImg{
        width: 0.3rem;
        height: 0.3rem;
        margin-right: 0.1rem;

      }
      .noticeText{
        font-size: 0.24rem;
        max-width: 100%;
        height: 0.6rem;
        overflow: hidden;
        .noti-item{
          height: 0.6rem;
          display: flex;
          align-items: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-weight:400;
          color:#f1c89d;
        }
      }
    }
  }
.dmDiv {
  // position: relative;
  margin-top: .5rem;
  height: 6.4rem;
  width: 100%;
  background: url("../../../assets/img/activity/christmas2019/treeFlash.png") no-repeat center;
  background-size: auto 6rem;
  .vue-danmaku{
    height: 5.5rem;
    width: 100%;
    overflow: hidden;
  }
}
.dmInputDiv {
  position: relative;
  padding: 0 0.24rem;
  box-sizing: border-box;
  .dmlogo1{
    position: absolute;
    top: -1.4rem;
    left: .2rem;
    width: 1.8rem;
    max-width: 100%;
  }
  .dmlogo2{
    position: absolute;
    top: -2.1rem;
    // right: .2rem;
    right: 0;
    width: 1.56rem;
    max-width: 100%;
  }
  .dmInput {
    width: 100%;
    background-color: rgba(255, 255, 255, 0.08);
    border-radius: 0.05rem;
    font-size: 0.3rem;
    display: flex;
    flex-direction: column;
    padding: 0 0.24rem;
    box-sizing: border-box;
    h2 {
      height: 0.9rem;
      font-size: 0.3rem;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: 400;
      color: rgba(241, 200, 157, 1);
    }
    .inputDiv {
      position: relative;
      margin-bottom: 0.16rem;
      &::before {
        content: "";
        position: absolute;
        left: 0.22rem;
        top: 0.11rem;
        width: 0.3rem;
        height: 0.4rem;
        display: block;
        background: url("../../../assets/img/activity/christmas2019/dmIcon2.png")
          no-repeat;
        background-size: 0.3rem 0.4rem;
      }
      .input {
        height: 0.65rem;
        width: 100%;
        padding-left: 0.63rem;
        box-sizing: border-box;
        background-color: rgba(255, 255, 255, 0.16);
        border-radius: 0.05rem;
        font-size: 0.24rem;
        color: rgba(255, 255, 255, 1);
      }
    }
    .textareaDiv {
      position: relative;
      margin-bottom: 0.16rem;
      .dmIcon{
         width: 0.3rem;
        height: 0.4rem;
        position: absolute;
        left: 0.22rem;
        top: 0.18rem;
        z-index: 100;
      }
      // &::before {
      //   content: "";
      //   position: absolute;
      //   left: 0.22rem;
      //   top: 0.18rem;
      //   width: 0.3rem;
      //   height: 0.4rem;
      //   display: block;
      //   background: url("../../../assets/img/activity/christmas2019/dmIcon.png") no-repeat;
      //   background-size: 0.3rem 0.4rem;
      // }
      .textarea {
        height: 3rem;
        line-height: 0.36rem;
        width: 100%;
        // padding: .2rem 0 0 .63rem;
        padding: 0.2rem;
        box-sizing: border-box;
        // text-indent: 0.46rem;
        padding-left: 0.64rem;
        background-color: rgba(255, 255, 255, 0.16);
        border-radius: 0.05rem;
        font-size: 0.24rem;
        color: #fff;
        border: none;
        outline: none;
        resize:none;
        &::-webkit-input-placeholder {
          font-size: 0.24rem;
          color:#fff;
        }
      }

    }
    .btn{
        width:2.58rem;
        height:0.58rem;
        background-color: #F0C89E;
        margin: 0 auto .22rem;
        border-radius: .08rem;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size:0.26rem;
        color:rgba(102,60,4,1);
      }
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
      color: #F0C89E;
      font-size: .14rem;
      margin-left: .1rem;
      &.on{
        transform: rotate(180deg);
      }
    }
  }

</style>
