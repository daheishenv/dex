<template>
  <div ref="danmaku"
    class="vue-danmaku"
    @mouseenter="mouseIn"
    @mouseleave="mouseOut">
    <slot></slot>
    <div :class="['danmus', {'show': !hidden}, {'paused': paused}]"
      ref="danmus"></div>

    <section class="operation" v-if="false">
      <p>播放：
        <button class="btn"
          @click="play('play')">开始</button>
        <button class="btn"
          @click="play('pause')">暂停</button>
        <button class="btn"
          @click="play('stop')">停止</button>
      </p>
      <p>显示：
        <button class="btn"
          @click="play('show')">显示</button>
        <button class="btn"
          @click="play('hide')">隐藏</button>
      </p>
      <p>速度：
        <button class="btn"
          @click="speedChange(1)">减速</button>
        <button class="btn"
          @click="speedChange(2)">增速</button>
      </p>
      <p>字号：
        <button class="btn"
          @click="fontChange(1)">缩小</button>
        <button class="btn"
          @click="fontChange(2)">放大</button>
      </p>
      <p>弹道：
        <input class="ipt"
          type="text"
          v-model="config.channels">
        <button class="btn"
          @click="play('reset')">设置</button>
      </p>
      <p>
        发送：
        <input class="ipt"
          type="text"
          v-model="danmu">
        <button class="btn"
          @click="addDanmu">发送</button>
      </p>
      <p>性能：
        <button class="btn"
          @click="performance('show')">显示</button>
        <button class="btn"
          @click="performance('hide')">隐藏</button>
      </p>
    </section>
  </div>
</template>
<script>
/* eslint-disable */
export default {
  props: {
    danmus: {
      type: Array,
      required: true
    },
    config: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      container: null,
      isActive: false,
      timer: null,
      $danmaku: null,
      $danmus: null,
      danmaku: {
        danmus: [],
        width: 0, // danmaku宽度
        channels: 0, // 轨道数量
        loop: false // 是否循环
      },
      danmu: {
        height: 40,
        fontSize: 16,
        speed: 5
      },
      hidden: false,
      paused: false,
      index: 0,
      continue: true,
      danChannel: {},
      colorBg: [
        'rgba(255,238,187,0.3)',
        'rgba(255,238,187,0.3)',
        'rgba(255,238,187,0.3)',
        'rgba(255,238,187,0.3)',
        // 'rgba(255,238,187,0.3)',
        // 'rgba(237,100,202,0.3)',
        // 'rgba(39,225,255,0.3)',
      ]
    }
  },
  computed: {},
  watch: {
    danmus: function change(val){
      // console.log('wath danmus');
      // console.log(this.timer);
      // console.log(this.danmus[this.danmus.length - 1]);
      if (this.timer) {
        this.danmus[(this.index + 1) % this.danmus.length] = this.danmus[this.danmus.length - 1]
      }
    }
  },
  created () { },
  mounted () {
    this.$nextTick(() => {
      this.init()
      this.$emit('inited');
    })
  },
  methods: {
    init () {
      this.initCore()
      this.initConfig()
    },
    reset () {
      this.initConfig()
    },
    mouseIn () {
      this.$emit('mouseIn')
    },
    mouseOut () {
      this.$emit('mouseOut')
    },
    initCore () {
      this.$danmaku = this.$refs.danmaku
      this.$danmus = this.$refs.danmus
    },
    initConfig () {
      this.danmaku.width = this.$danmaku.offsetWidth
      this.danmaku.height = this.$danmaku.offsetHeight
      this.danmaku.danmus = this.danmus
      this.danmaku.channels = this.config.channels || parseInt(this.danmaku.height / this.danmu.height)
      this.danmaku.loop = this.config.loop || this.danmaku.loop
      this.danmu.speed = this.config.speed || this.danmu.speed
      this.danmu.fontSize = this.config.fontSize || this.danmu.fontSize
    },
    play () {
      if (this.paused) {
        this.paused = false
        return
      }
      if (!this.timer) {
        this.draw()
      }
    },
    draw () {
      this.$nextTick(() => {
        this.timer = window.setInterval(() => {
          if (this.index > this.danmus.length - 1) {
            this.config.loop ? this.insert() : this.clear()
          } else {
            this.insert()
          }
        }, 600)
      })
    },
    insert () {
      const index = this.config.loop ? this.index % this.danmus.length : this.index
      const el = document.createElement(`p`)
      if (this.continue) {
        el.classList.add(`dm`)
        el.classList.add(`move`)
        if (this.danmus[index].className) {
          el.classList.add(this.danmus[index].className);
        }
        el.style.animationDuration = `${this.danmu.speed}s`;
        el.style['-webkit-animation-duration'] = `${this.danmu.speed}s`;
        // el.style.fontSize = `${this.danmu.fontSize}px`
        el.style.backgroundColor = this.colorBg[Number(Math.round(Math.random() * 3))]
        el.innerHTML = `<a class="dmtext">${this.danmus[index].nickname}： ${this.danmus[index].memo}</a>`
        el.setAttribute('index', this.index)
        this.$danmus.appendChild(el)
        // 点击事件绑定
        el.addEventListener('click', (e) => {
          if(e.target.classList.contains('dmtext')){
            this.handleDanmuClick(this.index)
          }
        })
      }
      this.$nextTick(() => {
        let channelIndex = this.getChannel(el)
        if (channelIndex >= 0) {
          this.continue = true
          const width = el.offsetWidth
          const height = this.danmu.height > this.danmu.fontSize ? this.danmu.height : this.danmu.fontSize + 4
          el.style.top = channelIndex * height * 0.028 + 'rem'
          el.style.width = (width + 1) * 0.0188  + 'rem';
          // el.style.transform = `translateX(-${this.danmaku.width}px)`;
          el.style.left = `${this.danmaku.width}px`;
          el.addEventListener('animationend', () => {
            this.$danmus.removeChild(el)
          })
          if (el.classList.length > 0) {
            this.index++
          }
        } else {
          if (el.classList.length > 0) {
            this.$danmus.removeChild(el)
          }
        }
      })
    },
    handleDanmuClick(index) {
      // this.$message.success(`${index} waht fack yayayyayayy`);
      window.open(`https://bloks.io/transaction/${this.danmus[index].trxId}`);
    },
    getChannel (el) {
      const tmp = this.$danmus.offsetWidth / ((this.$danmus.offsetWidth + el.offsetWidth) / 6)
      for (let i = 0; i < this.danmaku.channels; i++) {
        const items = this.danChannel[i + '']
        if (items && items.length) {
          for (let j = 0; j < items.length; j++) {
            const danRight = this.getDanRight(items[j]) - 10
            if (danRight <= this.$danmus.offsetWidth - tmp * ((this.$danmus.offsetWidth + parseInt(items[j].offsetWidth)) / 6) || danRight <= 0) {
              break
            }
            if (j === items.length - 1) {
              this.danChannel[i + ''].push(el)
              el.addEventListener('animationend', () => {
                this.danChannel[i + ''].splice(0, 1)
              })
              return i % this.danmaku.channels
            }
          }
        } else {
          this.danChannel[i + ''] = [el]
          el.addEventListener('animationend', () => {
            this.danChannel[i + ''].splice(0, 1)
          })
          return i % this.danmaku.channels
        }
      }
      return -1
    },
    // 弹幕到右侧的距离
    getDanRight (el) {
      const eleWidth = el.offsetWidth || parseInt(el.style.width)
      const eleRight = el.getBoundingClientRect().right || this.$danmus.getBoundingClientRect().right + eleWidth
      return this.$danmus.getBoundingClientRect().right - eleRight
    },
    // 添加弹幕
    add (danmu) {
      const index = this.index % this.danmaku.danmus.length
      this.danmaku.danmus.splice(index, 0, danmu)
    },
    pause () {
      this.paused = true
    },
    stop () {
      this.danChannel = {}
      this.$refs.danmus.innerHTML = ''
      this.paused = false
      this.hidden = false
      this.clear()
    },
    clear () {
      window.clearInterval(this.timer)
      this.timer = null
      this.index = 0
    },
    show () {
      this.hidden = false
    },
    hide () {
      this.hidden = true
    },
    resize () {
      this.initConfig()
      const items = this.$danmaku.getElementsByClassName('dm')
      for (let i = 0; i < items.length; i++) {
        items[i].style.transform = `translateX(-${this.danmaku.width}px);`
      }
    }
  }
}
/* eslint-disable */
</script>
<style lang="scss">
.vue-danmaku {
  // position: relative;       
  // overflow: hidden;
    position: relative;
    height: 5.5rem;
    width: 100%;
    // background-color: #eee;
  .danmus {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
    &.show {
      opacity: 1;
    }
    &.paused {
      .dm.move {
        animation-play-state: paused;
        -webkit-animation-play-state: paused;
      }
    }
    p {
      position: absolute;
      color: #fff;
      // text-shadow: 0.01rem 0.01rem 0.01rem #000;
      margin: 0;
      white-space: pre;
    }
    .dm {
      
      position: absolute;
      color: #fff;
      font-size: 0.18rem;
      // right: 0;
      top: 0.08rem;
      white-space: pre;
      // text-shadow: 0.01rem 0.01rem 0.02rem #001;
      // transform: translateX(100%);
      // -webkit-transform: translateX(100%);
      &.move {
        will-change: transform;
        will-change: -webkit-transform;
        animation-name: danmaku;
        animation-timing-function: linear;
        animation-play-state: running;
        -webkit-animation-name: danmaku;
        -webkit-animation-timing-function: linear;
        -webkit-animation-play-state: running;

        
        background-color: rgba(59, 58, 106,0.9);
        padding: .1rem 0.3rem;
        border-radius: 0.4rem;
        overflow: hidden;

        .dmtext {
          display: flex;
          // flex-direction: column;
          color: #fff;
          font-size: 0.2rem !important;
          // line-height: .2rem;

          span {
            // display: block;
            font-size: 0.18rem !important;
            // line-height: 0.18rem;
            // margin-bottom: .05rem;
          }
        }
      }
      &.wishClass {
        a{
          color: #F1C89D !important;
        }
        color: #F1C89D !important;
        a:hover {
          color: #F1C89D !important;
        }
      }
    }
    @keyframes danmaku {
      from {
        // -webkit-transform: translateX(100%);
        left: 100%;
      }
      to {
        left: -100%;
      }
    }
    @-webkit-keyframes danmaku {
      from {
        // -webkit-transform: translateX(100%);
        left: 100%;
      }
      to {
        left: -100%;
      }
    }
  }
}
</style>
