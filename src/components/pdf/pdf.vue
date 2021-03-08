<template>
  <div id="container" :class="{'show' : show}">
    <a class="close flex" @click="handleClosePdf"><i class="icon-huaban17 iconfont"></i></a>
    <canvas id="the-canvas" style="width: 100%"></canvas>
    <div class="foot" v-if='pdfDoc'>
      <button class='left' v-if="pageNum>1" @click="onPrevPage">上一页</button>
      <button class='right' v-if="pageNum<pdfDoc.numPages" @click="onNextPage">下一页</button>
    </div>
  </div>
</template>

<script>
import PDFJS from 'pdfjs-dist'

export default {
  data() {
    return {
      pdfDoc: null,
      pageNum: 1,
      pageRendering: false,
      pageNumPending: null,
      scale: 0.9,
      show: false,
    }
  },
  methods: {
    showPDF(url) {
      const self = this
      self.show = true;
      PDFJS.getDocument(url).then((pdf) => {
        self.pdfDoc = pdf
        self.renderPage(1)
      })
    },
    renderPage(num) {
      this.pageRendering = true
      const self = this
      this.pdfDoc.getPage(num).then((page) => {
        const viewport = page.getViewport(self.scale)
        const canvas = document.getElementById('the-canvas')
        canvas.height = viewport.height
        canvas.width = viewport.width

        // Render PDF page into canvas context
        const renderContext = {
          canvasContext: canvas.getContext('2d'),
          viewport
        }
        const renderTask = page.render(renderContext)

        // Wait for rendering to finish
        renderTask.promise.then(() => {
          self.pageRendering = false
          if (self.pageNumPending !== null) {
            // New page rendering is pending
            this.renderPage(self.pageNumPending)
            self.pageNumPending = null
          }
        })
      })
    },
    queueRenderPage(num) {
      if (this.pageRendering) {
        this.pageNumPending = num
      } else {
        this.renderPage(num)
      }
    },
    onPrevPage() {
      if (this.pageNum <= 1) {
        return
      }
      this.pageNum--; /* eslint-disable-line */
      this.queueRenderPage(this.pageNum)
    },
    onNextPage() {
      if (this.pageNum >= this.pdfDoc.numPages) {
        return
      }
      this.pageNum++; /* eslint-disable-line */
      this.queueRenderPage(this.pageNum)
    },
    handleClosePdf() {
      this.show = !this.show
    }
  }
}
</script>

<style scoped>
  .show {
    display: block !important;
  }

  .close {
    position: absolute;
    top: 5px;
    right: 10px;
    padding: 8px;
    border-radius: 50%;
    background: #fff;
    color: #333;
    height: 20px;
    line-height: 20px;
  }

  #container {
    background-color: #fff;
    position:fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    text-align: center;
    /* padding: 5px; */
    display: none;
    box-sizing: border-box;
    z-index: 10000;
  }
  .foot {
    position: fixed;
    transform: translate(-50%,0);
    left: 50%;
  }

</style>
