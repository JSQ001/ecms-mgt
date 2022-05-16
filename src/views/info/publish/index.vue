<template>
  <div class="searchArea">
    <Form ref="formRef" layout="inline" @submit="state.reset">
      <Row style="width: 100%" :gutter="15">
        <Col :span="5">
          <Button type="primary" @click="router.push('/info/publish/create-or-update')">新增信息</Button>
        </Col>
        <Col :span="4">
          <Form.Item label="栏目" name="catalogId">
            <TreeSelect
              show-search
              v-model:value="state.searchParams.catalogId"
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              allow-clear
              placeholder="请选择栏目"
              tree-default-expand-all
              filterTreeNode
              treeNodeFilterProp="catalogName"
              :dropdownMatchSelectWidth="false"
              :tree-data="columnOptions"
              :fieldNames="{ key: 'id', label: 'catalogName', value: 'id' }"
            />
          </Form.Item>
        </Col>
        <Col :span="4">
          <Form.Item label="状态" name="state">
            <Select v-model:value="state.searchParams.state" placeholder="请选择状态" allow-clear>
              <Select.Option value="1">待审核</Select.Option>
              <Select.Option value="2">审核通过</Select.Option>
              <Select.Option value="3">审核驳回</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col :span="4">
          <Form.Item label="时间" name="name">
            <Select @change="setTime" placeholder="请选择时间" allow-clear>
              <Select.Option value="1">近1天</Select.Option>
              <Select.Option value="2">近2天</Select.Option>
              <Select.Option value="7">近1周</Select.Option>
              <Select.Option value="14">近2周</Select.Option>
              <Select.Option value="31">近1月</Select.Option>
              <Select.Option value="365">近1年</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col :span="5">
          <Form.Item label="标题" name="name">
            <Input v-model:value="state.searchParams.title" allowClear placeholder="标题" />
          </Form.Item>
        </Col>
        <Col :span="2">
          <Button @click="state.reset" class="searchBtn">搜索</Button>
        </Col>
      </Row>
    </Form>
  </div>
  <div class="article">
    <div class="content">
      <div class="btnArea">
        <Button
          :disabled="!state.selectedRowKeys.length"
          :class="`${state.selectedRowKeys.length ? 'btn-active' : ''}`"
          @click="state.batchDelFunc()"
        >
          批量删除
        </Button>
      </div>
      <Table
        rowKey="id"
        :pagination="state.pagination"
        :dataSource="state.dataSource"
        size="small"
        :columns="columns"
        :row-class-name="(record, index) => (index % 2 === 1 ? 'table-striped' : null)"
        :loading="state.loading"
        :row-selection="{
          selectedRowKeys: state.selectedRowKeys,
          columnWidth: '3%',
          onChange: state.onSelectChange
        }"
      />
    </div>
  </div>
</template>

<script lang="tsx" setup>
import { onMounted, ref, computed } from 'vue'
import {
  Button,
  Checkbox,
  Tooltip,
  Badge,
  Table,
  InputNumber,
  Row,
  Col,
  TreeSelect,
  Input,
  Form,
  Select,
  message,
  Modal
} from 'ant-design-vue'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import { modifyArticle } from '@/api/article'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import useCurd from '@/hocks/useCurd'
import { getColumnTree } from '@/api/column'
const { global_config } = window as any

const columnOptions = ref([])
const changed = ref(false)
const router = useRouter()
const stateList: any = {
  0: { key: 'default', label: '待审核' },
  1: { key: 'processing', label: '待审核' },
  2: { key: 'success', label: '审核通过' },
  3: { key: 'warning', label: '审核驳回' }
}
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
    width: '36%',
    //align: 'center',
    ellipsis: true,
    customRender: ({ text, record }: any) => (
      <a title={text} onClick={() => handleDetail(record)} class="column-title">
        {text}
      </a>
    )
  },
  {
    title: '栏目名称',
    dataIndex: 'catalogName',
    width: '8%',
    align: 'center',
    ellipsis: true
  },
  {
    title: '作者',
    dataIndex: 'author',
    key: 'author',
    width: '5%',
    ellipsis: true,
    align: 'center'
  },
  {
    title: '推荐',
    dataIndex: 'recommended',
    align: 'center',
    ellipsis: true,
    width: '5%',
    customRender: ({ text, record }: any) => {
      return (
        <Checkbox checked={text} onChange={(e) => updateArticle({ id: record.id, recommended: e.target.checked })} />
      )
    }
  },
  {
    title: '置顶',
    dataIndex: 'top',
    align: 'center',
    ellipsis: true,
    width: '5%',
    customRender: ({ text, record }: any) => {
      return <Checkbox checked={text} onChange={(e) => updateArticle({ id: record.id, top: e.target.checked })} />
    }
  },
  {
    title: '焦点图',
    dataIndex: 'focus',
    align: 'center',
    ellipsis: true,
    width: '5%',
    customRender: ({ text, record }: any) => {
      return <Checkbox checked={text} onChange={(e) => updateArticle({ id: record.id, focus: e.target.checked })} />
    }
  },
  {
    title: '排序',
    dataIndex: 'sortOrder',
    align: 'center',
    width: '4%',
    customRender: ({ text, record }: any) => (
      <InputNumber
        class="inputNumber"
        min={0}
        precision={0}
        formatter={(val: any) => getNum(val)}
        onChange={(val: any) => {
          changed.value = true
          record.sortOrder = val || 0
        }}
        onBlur={() => {
          if (!changed.value) return
          state.isEdit = true
          state.save({ id: record.id, sortOrder: record.sortOrder })
        }}
        style="width:100%;text-align:center"
        defaultValue={text}
      />
    )
  },
  {
    title: '点击',
    dataIndex: 'hitNums',
    key: 'hitNums',
    ellipsis: true,
    width: '5%',
    align: 'center',
    customRender: ({ text }: any) => (!text ? 0 : text)
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
    title: '状态',
    width: '1rem',
    dataIndex: 'state', //<a-badge status="success" />
    customRender: ({ text }: any) =>
      text !== null ? <Badge status={stateList[text].key} text={stateList[text].label} /> : ''
  },
  {
    title: (
      <span>
        操作
        <Tooltip title="编辑文章后，文章需重新审核！">
          <QuestionCircleOutlined style="margin-left:5px" />
        </Tooltip>
      </span>
    ),
    key: 'operation',
    align: 'center',
    width: '10%',
    customRender: ({ text }: any) => (
      <span class="operate wrapper-operate">
        {
          <>
            <Tooltip title="编辑">
              <a style="margin-right:10px" onClick={() => handleEdit(text.id)}>
                <i class="icon iconfont icon-bianji1" />
              </a>
            </Tooltip>
          </>
        }
        <Tooltip title="复制">
          <a style="margin-right:10px" onClick={() => handleCopy(text)}>
            <i class="icon iconfont icon-fuzhi1" />
          </a>
        </Tooltip>
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
    moduleKey: 'article',
    queryOptions: {
      method: 'post'
    }
  },
  dataField: 'data.records',
  searchParams: {}
})

onMounted(async () => {
  try {
    // 查询栏目
    const {
      data: { data }
    }: any = await getColumnTree()
    columnOptions.value = data
  } catch (e) {
    console.log(e)
  }
})

async function updateArticle(val: any) {
  const {
    data: { code },
    status
  }: any = await modifyArticle({ ...val })
  console.log(code)
  if (code === 200) {
    message.success('设置成功！')
    state.query()
  } else {
    message.error('设置失败！')
  }
}

//排序
function getNum(val: any) {
  let value = val.replace(/[^\d]/g, '')
  if (value === '') {
    value = 0
  }
  return value
}

const setTime = (e: any) => {
  if (e) {
    const endTime = new Date().getTime()
    const startTime = endTime - 1000 * 60 * 60 * 24 * e
    state.searchParams.beginPublishTime = dayjs(startTime).format('YYYY-MM-DD') + ' 00:00:00'
    state.searchParams.endPublishTime = dayjs(endTime).format('YYYY-MM-DD HH:MM:ss')
  } else {
    state.searchParams.beginPublishTime = undefined
    state.searchParams.endPublishTime = undefined
  }
}

function handleEdit(id: any) {
  router.push({
    path: '/info/publish/create-or-update',
    query: { id }
  })
}

//复制所选项
const handleCopy = (record: any) => {
  router.push({
    path: '/info/publish/create-or-update',
    query: { id: record.id, copy: 1 }
  })
}

function handleDetail(record: any) {
  window.open(global_config.EPORTAL_WEB + `#/focus-news/${record.id}?t=${new Date().getTime()}`, '_blank')
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
  padding: 0.2rem 0.2rem;

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
    .ant-table-thead {
      tr {
        th:nth-child(3) {
          text-align: center;
        }
      }
    }

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
        color: #c22400;
      }
    }
  }

  :deep(.table-striped) td {
    background: rgb(245, 245, 245);
  }

  :deep(.inputNumber) {
    input {
      padding: 0;
      text-align: center;
    }

    .ant-input-number-handler-wrap {
      display: none !important;
    }
  }
}
</style>
