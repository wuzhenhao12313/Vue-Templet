<template>
  <div ref="dom"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'

echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartLine',
  props: {
    value: Array,
    title: Object,
    legend: Object,
    xData: Array,
    series: Array
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
      let option = {
        title: this.title,
        tooltip: {
          trigger: 'axis'
        },
        legend: this.legend,
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.xData
        },
        yAxis: {
          type: 'value'
        },
        series: value
      }
      this.dom.setOption(option)
    },
    init () {
      let option = {
        title: this.title,
        tooltip: {
          trigger: 'axis'
        },
        legend: this.legend,
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.xData
        },
        yAxis: {
          type: 'value'
        },
        series: this.series
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
    series: {
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
      deep: true
    }
  }
}
</script>
