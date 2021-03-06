<template>
  <div ref="dom" class="charts chart-bar"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'

echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartBar',
  props: {
    value: Object,
    text: String,
    subtext: String,
    xAxis: {}
  },
  data () {
    return {
      dom: null
    }
  },
  methods: {
    resize () {
      this.dom.resize()
    },
    setOption (value) {
      let xAxisData = Object.keys(value)
      let seriesData = Object.values(value)
      let option = {
        title: {
          text: this.text,
          subtext: this.subtext,
          x: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: xAxisData,
          ...this.xAxis
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: seriesData,
          type: 'bar'
        }]
      }
      this.dom.setOption(option)
    },
    init () {
      let xAxisData = Object.keys(this.value)
      let seriesData = Object.values(this.value)
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        title: {
          text: this.text,
          subtext: this.subtext,
          x: 'center'
        },
        xAxis: {
          type: 'category',
          data: xAxisData,
          ...this.xAxis
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: seriesData,
          type: 'bar'
        }]
      }
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.init()
    })
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  },
  watch: {
    value: {
      handler (newVal, oldVal) {
        if (this.dom) {
          if (newVal) {
            this.setOption(newVal)
          } else {
            this.setOption(oldVal)
          }
        } else {
          this.init()
        }
      },
      deep: true // 对象内部属性的监听，关键。
    }
  }
}
</script>
