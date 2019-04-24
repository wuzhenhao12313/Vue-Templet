<template>
  <div ref="dom" style="height: 400px;"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from '_c/charts/theme.json'
import { on, off } from '@/libs/tools'
import { mapActions, mapState } from 'vuex'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'MonthEmployeeChangeChart',
  data () {
    return {
      dom: null
    }
  },
  computed: {
    monthEmployeeChangeData () {
      const data = this.$store.state.employee.monthEmployeeChangeData
      const obj = {
        entryList: data && data.length > 0 ? data[0].data : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        leaveList: data && data.length > 0 ? data[1].data : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }
      return obj
    }
  },
  methods: {
    ...mapActions([
      'getMonthEmployeeChangeData'
    ]),
    resize () {
      this.dom.resize()
    },
    setOption (value) {
      let option = {
        title: {
          text: '年度人员入职离职情况'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['员工入职', '员工离职']
        },
        toolbox: {
          show: true,
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '员工入职',
            type: 'bar',
            data: value.entryList,
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            }
          },
          {
            name: '员工离职',
            type: 'bar',
            data: value.leaveList,
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            }
          }
        ]
      }
      this.dom.setOption(option)
    },
    init () {
      let option = {
        title: {
          text: '年度人员入职离职情况'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['员工入职', '员工离职']
        },
        toolbox: {
          show: true,
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '员工入职',
            type: 'bar',
            data: this.monthEmployeeChangeData.entryList,
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            }
          },
          {
            name: '员工离职',
            type: 'bar',
            data: this.monthEmployeeChangeData.leaveList,
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            }
          }
        ]
      }
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(option)
    }
  },
  mounted () {
    this.getMonthEmployeeChangeData()
    this.$nextTick(() => {
      this.init()
      on(window, 'resize', this.resize)
    })
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  },
  watch: {
    monthEmployeeChangeData: {
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
