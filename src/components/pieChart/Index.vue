<template>
  <div class="pieChart">
    <div ref="pieChart" class="pieChart"></div>
  </div>
</template>

<script>
let echarts = require('echarts/lib/echarts');
// 引入饼图圖組件
require('echarts/lib/chart/pie');
require('echarts/lib/component/tooltip');

export default {
  name: 'PieChart',
  props: ['pieChartData'],
  watch: {
    pieChartData: function change() {
      this.handleChartInit();
    },
  },
  mounted() {
  },
  methods: {
    handleChartInit() {
      let myCharts = echarts.init(this.$refs.pieChart);
      let options = {
        color: ['#FFC789', '#80CBBF'],
        grid: {
          top: '50px',
          left: '40px',
          right: '40px',
          bottom: '0px',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} ({c}%)',
        },
        series: {
          data: this.pieChartData,
          center: ["50%", "58%"],
          label: {
            normal: {
              show: true,
              position: 'outer', //标签的位置
              alignTo: 'edge',
              formatter: '{b} {c}%',
              color:'#333333',
              margin: 10,
            },
          },
          type: 'pie',
        },
      };
      myCharts.setOption(options);
    }
  },
};
</script>
<style lang="scss" scoped>
.goldColor {
  color: #ff910d !important;
  font-size: 22px;
}

.pieChart {
  margin: 0 auto;
  width: 100%;
  height: 220px;
  // transform: scale(.85);
}

.color333 {
  font-size: 16px;
  color: #333;
}
</style>
