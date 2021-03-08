/* eslint-disable */
// import echarts from 'echarts';
//引入基本模板
const echarts = require('echarts/lib/echarts');
// 引入饼状图组件
require('echarts/lib/chart/line');
// 引入提示框和title组件，图例
require('echarts/lib/component/tooltip');

import { toFixed, toNonExponential } from '@/utils/public';

export default {
  vueThis: null,
  echartsDepthLeft: null,
  echartsDepthRight: null,
  chartsDepthData: {},
  tradCharts: null,
  bgcolor: '',
  lineTickColor: '',
  labelsColor: '',
  hoveBorderColorLeft: '',
  hoveBorderColorRight: '',
  init (options) {
    this.vueThis = options.self;
    this.chartsDepthData = options.data;
    this.tradCharts = options.trad;

    // 样式配置
    this.bgcolor = options.theme === 'black' ? '#152247' : '#fff';
    this.lineTickColor = options.theme === 'black' ? '#7b8db9' : 'rgb(204, 214, 235)';
    this.lineTickColorx = options.theme === 'black' ? '#7b8db9' : 'RGBA(69, 157, 68, 0.6)';
    this.labelsColor = options.theme === 'black' ? '#7b8db9' : '#999';
    this.hoveBorderColorLeft = options.theme === 'black' ? '#7b8db9' : 'RGBA(2, 118, 1, 0.5)';
    // 数据处理
    const params = this.handleFormatData();
    // 生成图表
    this.echartLeft(params);
    this.echartRight(params);
  },

  // 数据处理
  handleFormatData() {
    const self = this;
    this.chartsDepthData.buy;
    const data = this.chartsDepthData;
    
    let dataY = [];
    data.buy.forEach(ele => {
      dataY.push(ele[1])
    })
    data.sell.forEach(ele => {
      dataY.push(ele[1])
    })
    
    const params = {
      dataY,
    }
    return params;
  },

  // 更新图表
  highChartsUpdate(options) {
    const self = this;
    this.chartsDepthData = options.data;
    this.tradCharts = options.trad;

    const params = this.handleFormatData();

    this.echartLeft(params);
    this.echartRight(params);
  },

  echartLeft(params) {
    const self = this;
    const selfVue = this.vueThis;
    const dataY = params.dataY;

    // 基于准备好的dom，初始化echarts实例
    this.echartsDepthLeft = echarts.init(document.getElementById('containerDepthLeft'));
    // 绘制图表
    this.echartsDepthLeft.setOption({
      grid: { // 图表大小/间距配置
        left: '0',
        right: '0',
        bottom: '8%',
        top: '7%',
        containLabel: true
      },
      animation: false,
      tooltip: { // hove 配置
        trigger: 'axis',
        confine: true,
        axisPointer: {
          type: 'none',
        },
        backgroundColor: '#fff',
        borderColor: 'RGBA(82, 177, 84, 0.5)',
        borderWidth: 2,
        padding: 8,
        hideDelay: 0,
        transitionDuration: 0,
        textStyle: {
          fontSize: 12,
          color: '#666'
        },
        formatter: function (params) { // 格式化hove值
          const valuePrice = params[0].axisValue;
          try {
            const dep = self.chartsDepthData;
            const depthArr = dep.buy.concat(dep.sell);
            const arr = depthArr.find(v => v[0] === valuePrice);
            const html = selfVue.$t('tv.price')+'：'+ toFixed(toNonExponential(arr[0]), self.tradCharts.priceDecimal) +' '+self.tradCharts.symbol2 +
                          '<br/>'+selfVue.$t('tv.addQuantity')+'：'+ toFixed(toNonExponential(arr[1]), self.tradCharts.coinDecimal) +' '+self.tradCharts.symbol1 +
                          '<br/>'+selfVue.$t('tv.addMoney')+'：'+ toFixed(toNonExponential(arr[2]), self.tradCharts.valuationCoinDecimal)+' '+self.tradCharts.symbol2;
            return html;
          } catch (error) {
            console.log(error);
          }
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisTick: { // 轴刻度
          show: false,
        },
        axisLabel: { // 轴数字
          color: self.labelsColor,
          show: false,
          showMinLabel: false,
          formatter: function (val) {
              return toNonExponential(val)
          }
        },
        axisLine: { // 轴线
          lineStyle: {
            color: self.lineTickColor
          }
        },
        splitLine: { // 网格
          show: false,
        },
      },
      yAxis: [
        {
          type: 'value',
          max: Math.max.apply(null, dataY),
          position: 'left',
          minInterval: 1,
          splitNumber: 4, // 刻度个数
          boundaryGap: false,
          axisTick: { // 轴刻度
            show: false,
            inside: true,
          },
          axisLabel: { // 轴数字
            show: false,
            inside: true,
            color: self.labelsColor,
            showMaxLabel: false,
            showMinLabel: false,
            formatter: function(val) {
              const value = val >= 1000 ? val / 1000 + 'k' : val
              return value
            }
          },
          axisLine: { // 轴线
            lineStyle: {
              color: self.lineTickColor
            }
          },
          splitLine: { // 网格
            show: false,
            lineStyle: {
              color: 'RGBA(153, 153, 156, 0.09)'
            }
          },
        }
      ],
      series: [
        {
          data: self.chartsDepthData.buy,
          type: 'line',
          symbol: 'circle',
          showSymbol: false,
          symbolSize: 12,
          itemStyle: {
            color: 'RGBA(82, 177, 84, 0.8)',
            borderColor: 'RGBA(255,255, 255, 1)',
            borderWidth: 2,
            shadowColor: 'RGBA(82, 177, 84, 1)',
            shadowBlur: 10
          },
          lineStyle: { // 面积图边色
            color: '#93C697',
          },
          areaStyle: { // 面积图颜色
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'RGBA(82, 177, 84, 0.8)'
            }, {
                offset: 1,
                color: 'RGBA(82, 177, 84, 0.1)'
            }])
          },
        },
      ]
    });
  },

  echartRight(params) {
    const self = this;
    const selfVue = this.vueThis;
    const dataY = params.dataY;

    // 基于准备好的dom，初始化echarts实例
    this.echartsDepthRight = echarts.init(document.getElementById('containerDepthRight'));
    // 绘制图表
    this.echartsDepthRight.setOption({
      grid: { // 图表大小/间距配置
        left: '0',
        right: '0',
        bottom: '8%',
        top: '7%',
        containLabel: true
      },
      animation: false,
      tooltip: { // hove 配置
        trigger: 'axis',
        confine: true,
        axisPointer: {
          type: 'none',
        },
        backgroundColor: '#fff',
        borderColor: 'RGBA(232, 18, 52, 0.4)',
        borderWidth: 2,
        fontSize: 10,
        padding: 8,
        hideDelay: 0,
        transitionDuration: 0,
        textStyle: {
          fontSize: 12,
          color: '#666'
        },
        formatter: function (params) { // 格式化hove值
          const valuePrice = params[0].axisValue;
          try {
            const dep = self.chartsDepthData;
            const depthArr = dep.buy.concat(dep.sell);
            const arr = depthArr.find(v => v[0] === valuePrice);
            const html = selfVue.$t('tv.price')+'：'+ toFixed(toNonExponential(arr[0]), self.tradCharts.priceDecimal) +' '+self.tradCharts.symbol2 +
                          '<br/>'+selfVue.$t('tv.addQuantity')+'：'+ toFixed(toNonExponential(arr[1]), self.tradCharts.coinDecimal) +' '+self.tradCharts.symbol1 +
                          '<br/>'+selfVue.$t('tv.addMoney')+'：'+ toFixed(toNonExponential(arr[2]), self.tradCharts.valuationCoinDecimal)+' '+self.tradCharts.symbol2;
            return html;
          } catch (error) {
            console.log(error);
          }
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisTick: { // 轴刻度
          show: false,
        },
        axisLabel: { // 轴数字
          color: self.labelsColor,
          show: false,
          showMinLabel: false,
          formatter: function (val) {
              return toNonExponential(val)
          }
        },
        axisLine: { // 轴线
          lineStyle: {
            color: self.lineTickColor
          }
        },
        splitLine: { // 网格
          show: false,
        },
      },
      yAxis: [
        {
          show: true,
          max: Math.max.apply(null, dataY),
          splitNumber: 4, // 刻度个数
          type: 'value',
          position: 'left',
          axisTick: { // 轴刻度
            show: false,
            inside: true,
          },
          axisLabel: { // 轴数字
            show: false,
            color: self.labelsColor,
            inside: true,
            showMinLabel: false,
            formatter: function(val) {
              const value = val >= 1000 ? val / 1000 + 'k' : val
              return value;
            }
          },
          axisLine: { // 轴线
            lineStyle: {
              color: 'RGBA(153, 153, 156, 0.09)'
            }
          },
          splitLine: { // 网格
            show: false,
            lineStyle: {
              color: 'RGBA(153, 153, 156, 0.09)'
            }
          },
        }
      ],
      series: [
        {
          data: self.chartsDepthData.sell,
          type: 'line',
          symbol: 'circle',
          showSymbol: false,
          symbolSize: 12,
          itemStyle: {
            color: 'RGBA(232, 18, 52, 0.7)',
            borderColor: 'RGBA(255,255, 255, 1)',
            borderWidth: 2,
            shadowColor: 'RGBA(232, 18, 52, 1)',
            shadowBlur: 10
          },
          lineStyle: { // 面积图边色
            color: '#ef7686',
          },
          areaStyle: { // 面积图颜色
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'RGBA(232, 18, 52, 0.7)'
            }, {
                offset: 1,
                color: 'RGBA(232, 18, 52, 0.09)'
            }])
          },
        },
      ]
    });
  },

  echartsUpdateSize() {
    this.echartsDepthLeft.resize();
    this.echartsDepthRight.resize();
  }
}