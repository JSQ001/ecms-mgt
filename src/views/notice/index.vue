<template>
  <div class="searchArea">
    <Form ref="formRef" layout="inline" @submit="state.reset">
      <Row style="width: 100%" :gutter="15">
        <Col :span="5">
          <Button type="primary" @click="router.push('/notice/create-or-update')">新增通告</Button>
        </Col>
        <Col :span="6">
          <Form.Item label="时间" name="time">
            <DatePicker.RangePicker v-model:value="time" :placeholder="['开始日期', '结束日期']" @change="setTime" />
          </Form.Item>
        </Col>
        <Col :span="7">
          <Form.Item label="标题" name="title">
            <Input allowClear v-model:value="state.searchParams.title" placeholder="标题" />
          </Form.Item>
        </Col>
        <Col :span="2">
          <Button @click="state.reset" class="searchBtn">搜索</Button>
        </Col>
      </Row>
    </Form>
  </div>
  <div class="article">
    <Table
      rowKey="id"
      :pagination="state.pagination"
      :dataSource="state.dataSource"
      :columns="columns"
      :row-class-name="(record, index) => (index % 2 === 1 ? 'table-striped' : null)"
      :loading="state.loading"
    />
  </div>
</template>

<script lang="tsx" setup>
import { ref } from 'vue'
import { DatePicker, Button, Row, Col, Input, Tooltip, Form, Table } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import useCurd from '@/hocks/useCurd'
const { global_config } = window as any

const columnOptions = ref([])
const router = useRouter()
const time = ref()
const time2 = ref()

const columns = [
  {
    title: '序号',
    width: '5%',
    ellipsis: true,
    align: 'center',
    customRender: ({ index }: any) => {
      const { current, pageSize } = state.pagination
      return (current - 1) * pageSize + index + 1
    }
  },
  {
    title: '标题',
    dataIndex: 'title',
    width: '46%',
    //align: 'center',
    ellipsis: true,
    customRender: ({ text, record }: any) => (
      <a title={text} onClick={() => handleDetail(record)} class="column-title">
        {text}
      </a>
    )
  },
  {
    title: '发布人',
    dataIndex: 'publisher',
    key: 'publisher',
    width: '10%',
    ellipsis: true,
    align: 'center'
  },
  {
    title: '状态',
    dataIndex: 'state',
    width: '10%',
    align: 'center',
    customRender: ({ text }: any) => (text === 1 ? '已发布' : '草稿')
  },
  {
    title: '发布时间',
    dataIndex: 'publishTime',
    width: '8%',
    ellipsis: true,
    align: 'center',
    customRender: ({ text }: any) => (text ? dayjs(text).format('YYYY-MM-DD') : '-')
  },
  {
    title: '操作',
    key: 'operation',
    align: 'center',
    width: '10%',
    customRender: ({ text }: any) => (
      <span class="operate wrapper-operate">
        {
          <>
            <Tooltip title="修改">
              <a onClick={() => handleEdit(text.id)}>
                <i class="icon iconfont icon-bianji1" />
              </a>
            </Tooltip>
          </>
        }
        <Tooltip title="删除">
          <a class="delBtn" onClick={() => state.deleteFunc({ id: text.id })}>
            <i class="icon iconfont icon-shanchu2" />
          </a>
        </Tooltip>
      </span>
    )
  }
]
const state: any = await useCurd({
  baseApi: {
    moduleKey: 'notices',
    queryOptions: {
      method: 'post'
    }
  },
  dataField: 'data.records',
  searchParams: {}
})
function setTime(e: any) {
  if (e) {
    state.searchParams.beginPublishTime = dayjs(e[0]).format('YYYY-MM-DD HH:MM:ss')
    state.searchParams.endPublishTime = dayjs(e[1]).format('YYYY-MM-DD HH:MM:ss')
  } else {
    state.searchParams.beginPublishTime = undefined
    state.searchParams.endPublishTime = undefined
  }
}
function handleEdit(id: any) {
  router.push({
    path: '/notice/create-or-update',
    query: { id }
  })
}
function handleDetail(record: any) {
  window.open(global_config.EPORTAL_WEB + `#/focus-news/${record.id}?notice=1`, '_blank')
}
</script>
<style scoped lang="scss">
@import '~@/styles/variables.scss';

.searchArea {
  position: relative;
  margin-bottom: 0.2rem;
  background: #fff;
  padding: 0.2rem;
  .searchBtn {
    background: #c22400;
    border-radius: 0;
    color: white;
    letter-spacing: 8px;
  }
}

.article {
  background: #ffffff;
  padding: 0 0.2rem;
  .create {
    padding: 10px;
    text-align: right;
  }
  :deep(.ant-tabs) {
    .ant-tabs-tab-active {
      .ant-tabs-tab-btn {
        color: #982a23;
      }
    }
    .ant-tabs-ink-bar {
      background: #982a23;
    }
  }
  :deep(.ant-table) {
    .ant-table-cell {
      padding: 5px;
      .column-title {
        float: left;
        width: 100%;
        display: inline-block;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    tr:hover > td,
    tr.hover-row > td {
      background-color: $tableRowHoverBg !important;
      .collectBtn-enabled {
        background: #a51b1b;
        color: white;
      }
    }
    .operate {
      font-size: 14px;
      .editBtn {
        color: #ffb917;
      }

      .delBtn {
        margin-left: 10px;
        color: #c22400;
      }
    }
  }

  :deep(.table-striped) td {
    background: rgb(245, 245, 245);
  }
}
</style>
