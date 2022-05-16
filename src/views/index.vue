<template>
  <div class="box">
    <Row :gutter="10" class="count-list" type="flex">
      <Col :span="6">
        <Card title="网站访问量">
          <template #extra>
            <Tag color="green">月</Tag>
          </template>
          <h4>
            {{ tabData.monthDate.visitLogNum }}
            <FundFilled class="icon" style="color: green" />
          </h4>
          <p>
            网站总访问量 <span>{{ tabData.allDate.visitLogNum }}</span>
          </p>
        </Card>
      </Col>
      <Col :span="6">
        <Card title="发布信息数">
          <template #extra>
            <Tag color="blue">月</Tag>
          </template>
          <h4>
            {{ tabData.monthDate.allNum }}
            <EditFilled class="icon" style="color: blue" />
          </h4>
          <p>
            总发布信息数<span>{{ tabData.allDate.allNum }}</span>
          </p>
        </Card>
      </Col>
      <Col :span="6">
        <Card title="通过信息数">
          <template #extra>
            <Tag color="orange">月</Tag>
          </template>
          <h4>
            {{ tabData.monthDate.approvedNum }}
            <CheckCircleFilled class="icon" style="color: orange" />
          </h4>
          <p>
            总通过信息数<span>{{ tabData.allDate.approvedNum }}</span>
          </p>
        </Card>
      </Col>
      <Col :span="6">
        <Card title="驳回信息数">
          <template #extra>
            <Tag color="purple">月</Tag>
          </template>
          <h4>
            {{ tabData.monthDate.rejectNum }}
            <CloseCircleFilled class="icon" style="color: purple" />
          </h4>
          <p>
            总驳回信息数<span>{{ tabData.allDate.rejectNum }}</span>
          </p>
        </Card>
      </Col>
    </Row>
    <Row :gutter="10" class="count-list" type="flex">
      <Col :span="8">
        <Card title="栏目发表信息排行">
          <div class="wrapperColumnCanvas">
            <div v-if="articleData.column.length !== 0" ref="column" class="columnCanvas" />
            <Empty v-else :image="simpleImage" description="暂无排行信息" />
          </div>
        </Card>
      </Col>
      <Col :span="8">
        <Card title="用户发表信息排行">
          <div class="wrapperColumnCanvas">
            <div v-if="articleData.user.length !== 0" ref="user" class="columnCanvas" />
            <Empty v-else :image="simpleImage" description="暂无排行信息" />
          </div>
        </Card>
      </Col>
      <Col :span="8">
        <Card title="节点采集信息排行">
          <div class="wrapperColumnCanvas">
            <div v-if="articleData.point.length !== 0" ref="node" class="columnCanvas" />
            <Empty v-else :image="simpleImage" description="暂无排行信息" />
          </div>
        </Card>
      </Col>
      <Col :span="12">
        <Card title="近十天网站浏览量">
          <div class="wrapperColumnCanvas">
            <div ref="history" class="columnCanvas" />
          </div>
        </Card>
      </Col>
      <Col :span="12">
        <Card title="栏目浏览量排行">
          <div class="wrapperColumnCanvas">
            <div v-if="articleData.columnViews.length !== 0" ref="columnViews" class="columnCanvas" />
            <Empty v-else :image="simpleImage" description="暂无排行信息" />
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script setup>
import { getVisitStatisticDays, getNodeStatistic, getCatalogStatistic, statisticsArticleBaseInfo } from '@/api/article'
import { nextTick, ref, reactive, onMounted } from 'vue'
import { Card, Empty, Row, Col, Tag } from 'ant-design-vue'
import { FundFilled, CloseCircleFilled, CheckCircleFilled, EditFilled } from '@ant-design/icons-vue'
import * as echarts from 'echarts'
import dayjs from 'dayjs'

const elementResizeDetectorMaker = require('element-resize-detector')
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE

const tabData = reactive({
  monthDate: {},
  allDate: {}
})
const articleData = reactive({
  point: [],
  user: [],
  column: [],
  columnViews: [],
  history: {}
})
//监听元素变化
const erd = elementResizeDetectorMaker()
const column = ref()
const node = ref()
const user = ref()
const columnViews = ref()
const history = ref()

onMounted(() => {
  try {
    staticsArticleBaseInfo()
    staticsVisitDays()
    staticsColumnData()
    staticsNodeDays()
  } catch (e) {
    console.log(e)
  }
})

async function staticsArticleBaseInfo() {
  const time = new Date()
  let year = time.getFullYear()
  let month = time.getMonth()
  let day = time.getDate()

  if (month < 10) {
    month = '0' + month
  }
  const params = {
    startTime: `${year}-${month}-${day} 00:00:00`,
    endTime: dayjs(time).format('YYYY-MM-DD HH:MM:ss')
  }
  const { data: res } = await statisticsArticleBaseInfo(params)
  tabData.monthDate = res.data
  const { data: res2 } = await statisticsArticleBaseInfo()
  tabData.allDate = res2.data
}

async function staticsVisitDays() {
  const time = new Date().getTime()
  const startTime = time - 24 * 60 * 60 * 1000 * 10
  const params = {
    startTime: dayjs(startTime).format('YYYY-MM-DD'),
    endTime: dayjs(time).format('YYYY-MM-DD')
  }
  try {
    const { data: res } = await getVisitStatisticDays(params)
    articleData.history = res.data
    nextTick(() => {
      drawColumn3(history, res.data)
    })
  } catch (e) {
    console.log(e)
  }
}

async function staticsColumnData() {
  const time = new Date()
  const params = {
    startTime: dayjs(time).format('YYYY-MM') + '-01 00:00:00',
    endTime: dayjs(time).format('YYYY-MM-DD HH:MM:ss')
  }
  try {
    const { data: res } = await getCatalogStatistic(params)
    let visitList = []
    let columnList = []
    res.data.forEach((item) => {
      if (!!item.visitLogNum) {
        visitList.push({
          label: item.catalogName,
          value: item.visitLogNum
        })
      }
      if (!!item.allNum) {
        columnList.push({
          label: item.catalogName,
          value: item.allNum
        })
      }
    })
    columnList = columnList.sort((a, b) => b.value - a.value)
    visitList = visitList.sort((a, b) => b.value - a.value)
    if (columnList.length > 8) {
      columnList.splice(8, columnList.length - 8)
    }
    if (visitList.length > 8) {
      visitList.splice(8, visitList.length - 8)
    }
    articleData.column = columnList
    articleData.columnViews = visitList
    nextTick(() => {
      drawColumn(column, articleData.column)
      drawColumn(columnViews, articleData.columnViews)
    })
  } catch (e) {
    console.log(e)
  }
}

async function staticsNodeDays() {
  const time = new Date()
  const params = {
    startTime: dayjs(time).format('YYYY-MM') + '-01 00:00:00',
    endTime: dayjs(time).format('YYYY-MM-DD HH:MM:ss')
  }
  try {
    const { data: res } = await getNodeStatistic(params)
    let list = []
    res.data.forEach((item) => {
      list.push({
        label: item.collectNodeName,
        value: item.allNum
      })
    })
    articleData.point = list
    nextTick(() => {
      drawColumn(node, list)
    })
  } catch (e) {
    console.log(e)
  }
}

function drawColumn(dom, data) {
  if (data.length === 0 || data == 0) return
  const myChart = echarts.init(dom.value, 'light', {
    renderer: 'svg'
  })
  let label = []
  let value = []
  data.forEach((item) => {
    label.push(item.label)
    value.push(item.value)
  })
  // 绘制图表
  myChart.setOption({
    title: { text: '' },
    legend: {
      show: false,
      right: 0
    },
    grid: {
      top: 20, // 距上边距
      left: 0,
      right: 0,
      bottom: 50
    },
    tooltip: {},
    xAxis: {
      data: label,
      axisLabel: {
        interval: 0,

        // rotate:-30,
        formatter: (params) => resetName(params)
      }
    },
    yAxis: {
      show: false
    },
    series: [
      {
        type: 'bar',
        label: {
          show: true,
          position: 'top'
        },
        barWidth: 18,
        data: value
      }
    ]
  })

  window.onresize = function () {
    myChart.resize()
  }
  erd.listenTo(dom.value, () => nextTick(() => myChart.resize()))
}

function drawColumn2(dom, data) {
  if (data.length === 0 && data == 0) return
  const myChart = echarts.init(dom.value, 'light', {
    renderer: 'svg'
  })
  let newData = []
  data.forEach((item) => {
    newData.push({
      name: item.name,
      value: item.allData
    })
  })
  // 绘制图表
  myChart.setOption({
    title: { text: '' },
    legend: {
      show: false
    },
    grid: {
      top: 0, // 距上边距
      left: 0,
      right: 0,
      bottom: 50
    },
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        type: 'pie',
        radius: '50%',
        label: {
          show: true,
          position: 'top'
        },
        data: newData
      }
    ]
  })

  window.onresize = function () {
    myChart.resize()
  }
  erd.listenTo(dom.value, () => nextTick(() => myChart.resize()))
}

function drawColumn3(dom, data) {
  if (data.length === 0 && data == 0) return
  const myChart = echarts.init(dom.value, 'light', {
    renderer: 'svg'
  })
  let label = []
  let value = []
  data.forEach((item) => {
    label.push(item.day)
    value.push(item.visitNum)
  })
  // 绘制图表
  myChart.setOption({
    xAxis: {
      data: label,
      axisLabel: {
        interval: 0,
        rotate: -45
      }
    },
    yAxis: {
      type: 'value'
    },
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        type: 'line',
        smooth: true,
        label: {
          show: true,
          position: 'top'
        },
        data: value
      }
    ]
  })

  window.onresize = function () {
    myChart.resize()
  }
  erd.listenTo(dom.value, () => nextTick(() => myChart.resize()))
}

function resetName(params) {
  let newParamsName = ''
  const paramsNameNumber = params.length
  const provideNumber = 3
  const rowNumber = Math.ceil(paramsNameNumber / provideNumber)
  if (paramsNameNumber > provideNumber) {
    for (let p = 0; p < rowNumber; p++) {
      let tempStr = ''
      let start = p * provideNumber
      let end = start + provideNumber
      if (p == rowNumber - 1) {
        tempStr = params.substring(start, paramsNameNumber)
      } else {
        tempStr = params.substring(start, end) + '\n\n'
      }
      newParamsName += tempStr
    }
  } else {
    newParamsName = params
  }
  return newParamsName
}
</script>

<style lang="scss" scoped>
.box {
  :deep(.ant-col) {
    margin-bottom: 10px;

    .ant-card-head {
      min-height: 28px;
      padding: 0 16px;
      font-size: 14px;

      .ant-card-head-title,
      .ant-card-extra {
        padding: 8px 0;
      }
    }

    .ant-card-body {
      padding: 10px 16px;
    }

    h4 {
      height: 50px;
      line-height: 50px;
      position: relative;
      font-size: 26px;
      margin: 0;

      .icon {
        font-size: 30px;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 0;
      }
    }

    p {
      font-size: 12px;
      line-height: 30px;
      margin: 0;
      color: #666;

      span {
        color: #333;
        float: right;
        font-size: 14px;
      }
    }
  }

  .wrapperColumnCanvas {
    width: 100%;
    position: relative;
    padding: 1px;
    height: 220px;
    display: flex;
    justify-content: center;
    align-items: center;

    .columnCanvas {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
