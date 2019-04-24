<template>
  <Card shadow>
    <Row :gutter="24">
      <i-col :span="18">
        <Form ref="searchForm" :model="searchForm" inline style="display:inline-block">
          <FormItem prop="empName">
            <Input style="width:200px" type="text" v-model="searchForm.empName.value" placeholder="填写员工姓名进行模糊搜索"
                   @keyup.enter="getPage(1)"/>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="getPage(1)" icon="md-search">搜索</Button>
          </FormItem>
          <FormItem>
            <Button type="dashed" :icon="`ios-arrow-${isOpenAdvSearch?'up':'down'}`"
                    @click="isOpenAdvSearch=!isOpenAdvSearch">高级搜索
            </Button>
          </FormItem>
          <FormItem prop="isHideQuit">
            <Checkbox v-model="searchForm.isHideQuit.value">隐藏已离职员工</Checkbox>
          </FormItem>
        </Form>
      </i-col>
      <i-col :span="6">
        <div style="float:right">
          <Button type="primary" icon="md-person-add">员工录入</Button>
        </div>
      </i-col>
    </Row>
    <div class="adv-search-wrapper" v-show="isOpenAdvSearch">
      <Form ref="advSearchForm" :model="advSearchForm" label-position="left" :label-width="100">
        <Row :gutter="24">
          <i-col :span="8">
            <FormItem prop="jobNumber" style="width:100%" label="员工工号：">
              <Input type="text" v-model="advSearchForm.jobNumber.value" placeholder="填写员工工号搜索，可多选，用，隔开"/>
            </FormItem>
          </i-col>
          <i-col :span="8">
            <FormItem prop="sex" style="width:100%" label="性别：">
              <Select v-model="advSearchForm.sex.value" placeholder="请选择员工性别" clearable>
                <Option value="man">男</Option>
                <Option value="female">女</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col :span="8">
            <FormItem prop="workStatus" style="width:100%" label="工作状态：">
              <Select v-model="advSearchForm.workStatus.value" placeholder="请选择员工性别" multiple>
                <Option value="working">已转正</Option>
                <Option value="trial">试用期</Option>
                <Option value="waiting-quit">待离职</Option>
                <Option value="quit">已离职</Option>
              </Select>
            </FormItem>
          </i-col>
        </Row>
        <Row :gutter="24">
          <i-col :span="8">
            <FormItem prop="entryDate" style="width:100%" label="入职日期：">
              <DatePicker style="width:100%" type="daterange" v-model="advSearchForm.entryDate.value"
                          placeholder="请选择入职日期区间"/>
            </FormItem>
          </i-col>
          <i-col :span="8">
            <FormItem prop="correctionDate" style="width:100%" label="转正日期：">
              <DatePicker style="width:100%" type="daterange" v-model="advSearchForm.correctionDate.value"
                          placeholder="请选择转正日期区间"/>
            </FormItem>
          </i-col>
          <i-col :span="8">
            <FormItem prop="leaveDate" style="width:100%" label="离职日期：">
              <DatePicker style="width:100%" type="daterange" v-model="advSearchForm.leaveDate.value"
                          placeholder="请选择离职日期区间"/>
            </FormItem>
          </i-col>
        </Row>
        <Row :gutter="24">
          <i-col :span="8">
            <FormItem prop="depID" style="width:100%" label="员工部门：">
              <department-select v-model="advSearchForm.depID.value" :multiple="false" placeholder="请选择员工部门"/>
            </FormItem>
          </i-col>
          <i-col :span="8">
            <FormItem prop="userPosition" style="width:100%" label="员工职位：">
              <position-select v-model="advSearchForm.userPosition.value" :multiple="false" placeholder="请选择员工职位"/>
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <FormItem class="last-form-item">
            <Button type="primary" @click="getPage(1)">提交</Button>
            <Button style="margin-left: 8px" @click="resetAdvSearvhForm">重置</Button>
          </FormItem>
        </Row>
      </Form>
    </div>
    <search-tag-bar :options="searchTags" @clear="clearSearchTag"/>
    <Table :columns="columns" :data="employeeData.list" :loading="loading" stripe>
      <template slot-scope="{ row, index }" slot="img">
        <img :src="row.workPhotoUrl" alt="" style="width:25px;margin-top:5px">
      </template>
      <template slot-scope="{ row, index }" slot="position">
        <div v-for="(item,idx) in row.positionList">
          <Tooltip content="点击标签可查询" placement="top"  :key="`k${idx}`">
            <Tag color="default" @click.native="clickTag(item.position)">{{item.positionName}}</Tag>
          </Tooltip>
        </div>
      </template>
      <template slot-scope="{ row, index }" slot="workStatus">
        <Badge :status="getBadgeInfo(row.workStatus).status" :text="getBadgeInfo(row.workStatus).text"></Badge>
      </template>
      <template slot-scope="{ row, index }" slot="op">
        <a>快速编辑</a>
        <Divider type="vertical"/>
        <Dropdown trigger="click">
          <a href="javascript:void(0)">
            更多
            <Icon type="ios-arrow-down"></Icon>
          </a>
          <DropdownMenu slot="list">
            <DropdownItem>编辑</DropdownItem>
            <DropdownItem>变更职位</DropdownItem>
            <DropdownItem>上传工作照</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </template>
    </Table>
    <div style="float:right;padding:10px 0px">
      <Page
        :total="employeeData.total"
        show-sizer
        show-elevator
        show-total
        :page-size-opts="[10,20,40,60,100,200]"
        @on-change="onChange"
        @on-page-size-change="onSizeChange"
      />
    </div>
    <div style="clear:both"></div>
  </Card>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import moment from 'moment'
import dayjs from 'dayjs'
import DepartmentSelect from '_myc/select/departmentSelect'
import PositionSelect from '_myc/select/positionSelect'
import SearchTagBar from '_myc/common/searchTagBar'
import { fetchApiSync } from '_libs/fetch'
import { formatDate, formatMoney, formatSearchTags, initSearchValue } from '_libs/util'

const departmentData = fetchApiSync({ url: '/Department/Get' })
const positionData = fetchApiSync({ url: '/Position/Get' })
const departmentList = departmentData.data.toObject().list.toObject()
const positionList = positionData.data.toObject().list
const formatter = {
  department: {},
  position: {}
}
departmentList.forEach(department => {
  formatter.department[`${department['depID']}`] = department['depName']
})
positionList.forEach(position => {
  formatter.position[`${position['positionID']}`] = position['positionName']
})
export default {
  name: 'list',
  components: { DepartmentSelect, PositionSelect, SearchTagBar },
  data () {
    return {
      formatter: {
        department: {},
        position: {}
      },
      isOpenAdvSearch: false,
      searchTags: [],
      searchForm: {
        empName: {
          value: null,
          name: '员工姓名'
        },
        isHideQuit: {
          value: true,
          filter: false
        }
      },
      advSearchForm: {
        jobNumber: {
          value: null,
          initValue: null,
          name: '员工工号'
        },
        sex: {
          value: null,
          initValue: null,
          name: '性别',
          format: {
            'man': '男',
            'female': '女'
          }
        },
        workStatus: {
          value: [],
          initValue: [],
          name: '工作状态',
          type: 'array',
          format: {
            'working': '已转正',
            'trial': '试用期',
            'waiting-quit': '待离职',
            'quit': '已离职'
          }
        },
        entryDate: {
          value: [],
          initValue: [],
          name: '入职日期',
          type: 'date-range',
          format: 'YYYY-MM-DD'
        },
        correctionDate: {
          value: [],
          initValue: [],
          name: '转正日期',
          type: 'date-range',
          format: 'YYYY-MM-DD'
        },
        leaveDate: {
          value: [],
          initValue: [],
          name: '离职日期',
          type: 'date-range',
          format: 'YYYY-MM-DD'
        },
        depID: {
          value: null,
          initValue: null,
          name: '员工部门',
          format: {
            ...formatter.department
          }
        },
        userPosition: {
          value: null,
          initValue: null,
          name: '员工职位',
          format: {
            ...formatter.position
          }
        }
      },
      loading: false,
      pageIndex: 1,
      columns: [
        {
          title: '工作照',
          slot: 'img',
          width: 75,
          align: 'center'
        },
        {
          title: '姓名',
          key: 'empName'
        },
        {
          title: '工号',
          key: 'jobNumber'
        },
        {
          title: '性别',
          key: 'sex',
          render: (h, { row }) => {
            return h('span', row.sex === 'man' ? '男' : '女')
          }
        },
        {
          title: '年龄',
          key: 'age',
          render: (h, { row }) => {
            const { birthday } = row
            return h('span', moment().diff(moment(birthday), 'year'))
          }
        },
        {
          title: '部门',
          key: 'depName'
        },
        {
          title: '担任职位',
          key: 'position',
          slot: 'position',
          width: 150
        },
        {
          title: '入职日期',
          key: 'entryDate',
          render: (h, { row }) => {
            return h('span', formatDate(row.entryDate, 'YYYY-MM-DD'))
          }
        },
        {
          title: '转正日期',
          key: 'correctionDate',
          render: (h, { row }) => {
            return h('span', formatDate(row.correctionDate, 'YYYY-MM-DD'))
          }
        },
        {
          title: '工龄',
          key: 'workYear',
          render: (h, { row }) => {
            const { entryDate, workStatus, leaveDate } = row
            if (workStatus === 'retire' || workStatus === 'quit') {
              return h('span', moment(leaveDate).diff(moment(entryDate), 'month'))
            }
            return h('span', moment().diff(moment(entryDate), 'month'))
          }
        },
        {
          title: '基本薪资',
          key: 'salary',
          render: (h, { row }) => {
            return h('span', formatMoney(row.salary, 2, 'rmb'))
          }
        },
        {
          title: '工作状态',
          key: 'workStatus',
          slot: 'workStatus',
          width: 100
        },
        {
          title: '操作',
          slot: 'op',
          width: 150
        }
      ]
    }
  },
  computed: {
    employeeData () {
      return this.$store.state.employee.employeeData
    },
    pageSize () {
      return this.$store.state.app.pageSize
    }
  },
  methods: {
    ...mapActions([
      'getEmployeeData'
    ]),
    ...mapMutations([
      'setPageSize'
    ]),
    resetAdvSearvhForm () {
      this.$refs['advSearchForm'].resetFields()
      this.getPage(1)
    },
    clickTag (position) {
      this.advSearchForm.userPosition.value = position
      this.getPage(1)
    },
    getBadgeInfo (type) {
      const info = {}
      switch (type) {
        case 'working':
          info.status = 'success'
          info.text = '已转正'
          break
        case 'trial':
          info.status = 'processing'
          info.text = '试用期'
          break
        case 'internShip':
          info.status = 'processing'
          info.text = '实习期'
          break
        case 'temporary':
          info.status = 'default'
          info.text = '临时员工'
          break
        case 'retire':
          info.status = 'waring'
          info.text = '已退休'
          break
        case 'waiting-quit':
          info.status = 'warning'
          info.text = '待离职'
          break
        case 'quit':
          info.status = 'error'
          info.text = '已离职'
          break
        default:
          info.status = 'error'
          info.text = '已离职'
          break
      }
      return info
    },
    onChange (pageIndex) {
      this.getPage(pageIndex)
    },
    onSizeChange (pageSize) {
      this.setPageSize(pageSize)
      this.getPage(1)
    },
    getPage (pageIndex) {
      if (pageIndex) {
        this.pageIndex = pageIndex
      }
      const searchs = {}
      Object.keys(this.searchForm).forEach(key => {
        searchs[key] = this.searchForm[key].value
      }),
      Object.keys(this.advSearchForm).forEach(key => {
        searchs[key] = this.advSearchForm[key].value
      })
      const { entryDate } = searchs
      const entryStartDate = entryDate[0] ? dayjs(entryDate[0]).format('YYYY-MM-DD') : null
      const entryEndDate = entryDate[1] ? dayjs(entryDate[1]).format('YYYY-MM-DD') : null
      this.formatSearchTag()
      this.loading = true
      this.getEmployeeData({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        sorterColumn: 'jobNumber',
        sorterType: 'asc',
        ...searchs,
        entryStartDate,
        entryEndDate
      }).then(() => {
        this.loading = false
      })
    },
    clearSearchTag (key) {
      initSearchValue(this.searchForm, key)
      initSearchValue(this.advSearchForm, key)
      this.getPage(1)
    },
    formatSearchTag () {
      const options = {
        ...this.searchForm,
        ...this.advSearchForm
      }
      this.searchTags = formatSearchTags(options)
    }
  },
  created () {
  },
  mounted () {
    this.getPage()
  }
}
</script>

<style lang="less">
  .adv-search-wrapper {
    border: 1px dashed #ccc;
    min-height: 40px;
    margin-top: -12px;
    margin-bottom: 12px;
    padding: 12px;
    .ivu-form-item {
      margin-bottom: 8px;

    }
    .last-form-item {
      margin-bottom: 0px;
    }
  }
</style>
