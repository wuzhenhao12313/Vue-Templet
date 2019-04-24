<template>
  <div>
    <Row :gutter="20">
      <i-col :xs="12" :md="8" :lg="4" v-for="(infor, i) in inforCardData" :key="`infor-${i}`"
             style="height: 120px;padding-bottom: 10px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-pie style="height: 300px;" :value="ageRateObj" text="在职员工年龄分布"></chart-pie>
        </Card>
      </i-col>
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-pie style="height: 300px;" :value="workYearRateObj" text="在职员工工龄分布"></chart-pie>
        </Card>
      </i-col>
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-pie style="height: 300px;" :value="manNFemaleRateObj" text="在职员工男女比例"></chart-pie>
        </Card>
      </i-col>
      <!--<i-col :md="24" :lg="16" style="margin-bottom: 20px;">-->
      <!--<Card shadow>-->
      <!--<chart-bar style="height: 300px;" :value="barData" text="每周用户活跃量"/>-->
      <!--</Card>-->
      <!--</i-col>-->
    </Row>
    <Row style="margin-bottom: 10px;">
      <Card shadow >
        <chart-bar style="height:400px;" text="部门人员数量" :value="depEmployeeCountList" :xAxis="{axisLabel:{rotate:45}}"></chart-bar>
      </Card>
    </Row>
    <Row style="margin-top: 20px;">
      <Card shadow >
        <month-chart/>
      </Card>
    </Row>
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar, ChartLine } from '_c/charts'
import MonthChart from './components/monthEmployeeChangeChart.vue'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'home',
  components: { InforCard, CountTo, ChartPie, ChartLine, ChartBar, MonthChart },
  data () {
    return {}
  },
  computed: {
    userCountObj () {
      return this.$store.state.employee.userCountObj
    },
    manNFemaleRateObj () {
      return this.$store.state.employee.manNFemaleRateObj
    },
    ageRateObj () {
      return this.$store.state.employee.ageRateObj
    },
    workYearRateObj () {
      return this.$store.state.employee.workYearRateObj
    },
    depEmployeeCountList () {
      const list = this.$store.state.employee.depEmployeeCountList
      let obj = {}
      list.forEach(x => {
        obj[x.name] = x['value']
      })
      return obj
    },
    inforCardData () {
      const { trial = 0, working = 0, waitingQuit = 0, quit = 0, monthEntry = 0, monthLeave = 0 } = this.userCountObj
      return [
        { title: '试用期', icon: 'md-person-add', count: trial, color: '#2d8cf0' },
        { title: '已转正', icon: 'md-locate', count: working, color: '#19be6b' },
        { title: '待离职', icon: 'md-help-circle', count: waitingQuit, color: '#ff9900' },
        { title: '已离职', icon: 'md-trash', count: quit, color: '#ed3f14' },
        { title: '本月已入职', icon: 'md-person-add', count: monthEntry, color: '#E46CBB' },
        { title: '本月已离职', icon: 'md-trash', count: monthLeave, color: '#9A66E4' }
      ]
    }

  },
  methods: {
    ...mapActions([
      'getUserCount',
      'getManNFemaleRate',
      'getAgeRate',
      'getWorkYearRate',
      'getDepEmployeeCount'
    ])
  },
  created () {
    this.getUserCount()
    this.getWorkYearRate()
    this.getAgeRate()
    this.getManNFemaleRate()
    this.getDepEmployeeCount()
  },
  watch: {
    '$route': function () {
    }
  }
}
</script>

<style lang="less">
  .count-style {
    font-size: 50px;
  }
</style>
