<template>
  <!-- 数字滚动组件 -->
  <!-- <span class="number-grow-warp"> -->
    <span ref="numberGrow" :data-time="time" class="number-grow" :data-value="value">0</span>
  <!-- </span> -->
</template>

<script>
import { Decimal } from 'decimal.js';

export default {
  data() {
    return {
      timer: null,
    }
  },
  watch: {
    value(newVal) {
      if (!newVal) {
        return;
      }
      this.numberGrow()
    }
  },
  props: {
    time: {
      type: Number,
      default: 1
    },
    value: {
      type: Number,
      default: 0
    }
  },
  methods: {
    numberGrow() {
      window.clearInterval(this.timer)
      if (isNaN(this.value)) {
        return;
      }
      const ele = this.$refs.numberGrow;
      const step = (this.value * 10) / (this.time * 1000);
      let current = 0;
      let start = 0;
      this.timer = window.setInterval(() => {
        start = Decimal.add(start, step);
        if (start > this.value) {
          window.clearInterval(this.timer)
          start = this.value
          this.timer = null
        }
        if (current === start) {
          return
        }
        current = start
        // ele.innerHTML = current.toString().replace(/(\d)(?=(?:\d{3}[+]?)+$)/g, '$1,')
        ele.innerHTML = current.toFixed(4);
      }, 10)
    }
  },
  mounted() {
    this.numberGrow()
  }
}
</script>

<style scoped lang="scss">
</style>
