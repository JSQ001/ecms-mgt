<template>
  <div class="searchArea">
    <Form ref="formRef" layout="inline" @submit="state.reset">
      <Row style="width: 100%" :gutter="15">
        <Col :span="4">
          <Form.Item label="栏目" name="catalogId">
            <TreeSelect
              show-search
              :dropdownMatchSelectWidth="false"
              v-model:value="state.searchParams.catalogId"
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              allow-clear
              filterTreeNode
              treeNodeFilterProp="catalogName"
              placeholder="请选择栏目"
              tree-default-expand-all
              :tree-data="columnOptions"
              :fieldNames="{ key: 'id', label: 'catalogName', value: 'id' }"
            />
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
        <Col :span="7">
          <Form.Item label="标题" name="name">
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
    <div class="content">
      <div class="btnArea">
        <Button :disabled="!state.selectedRowKeys.length" type="primary" @click="showApprove"> 批量审核 </Button>
        <Button
          style="margin-left: 10px"
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
  <Audit v-model:visible="visible" :auditData="auditData" @afterAudit="state.query" />
</template>

<script lang="tsx" setup>
import { onMounted, reactive, ref, watch } from 'vue'
import {
  Tabs,
  Button,
  Row,
  Table,
  Col,
  Checkbox,
  Tooltip,
  Badge,
  TreeSelect,
  Input,
  Form,
  Select,
  message
} from 'ant-design-vue'
import WrapperContent from './components/content.vue'
import { commonSave } from '@/api/common'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import useCurd from '@/hocks/useCurd'
import Audit from './components/audit-modal.vue'
import { getColumnTree } from '@/api/column'

const { global_config } = window as any

const columnOptions = ref([])
const router = useRouter()
const visible = ref(false)
const auditData = ref<any>([])
const auditTitle = ref()

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
    title: '发布时间',
    dataIndex: 'publishTime',
    width: '8%',
    ellipsis: true,
    align: 'center',
    customRender: ({ text }: any) => (text ? dayjs(text).format('YYYY-MM-DD') : '-')
  },
  {
    title: '状态',
    width: '8%',
    ellipsis: true,
    align: 'center',
    dataIndex: 'state', //<a-badge status="success" />
    customRender: ({ text }: any) =>
      text ? (
        <Badge status={stateList[text].key} text={<span title={stateList[text].label}>{stateList[text].label}</span>} />
      ) : (
        ''
      )
  },
  {
    title: '操作',
    key: 'operation',
    align: 'center',
    width: '10%',
    customRender: ({ text, record }: any) => (
      <span class="operate wrapper-operate">
        {record.state < 2 && (
          <>
            <Tooltip title="审核">
              <a style="margin-right:10px" onClick={() => showAudit(record)}>
                <i class="icon iconfont icon-xinxishenhe" />
              </a>
            </Tooltip>
          </>
        )}
        <Tooltip title="删除">
          <a onClick={() => state.deleteFunc({ id: record.id })}>
            <i class="icon iconfont icon-shanchu2" />
          </a>
        </Tooltip>
      </span>
    )
  }
]
const stateList: any = {
  0: { key: 'default', label: '待审核' },
  1: { key: 'processing', label: '待审核' },
  2: { key: 'success', label: '已审核' },
  3: { key: 'warning', label: '已驳回' }
}
const contentClass = reactive({
  animate__animated: true,
  animate__backInRight: false,
  animate__backInLeft: false
})

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

function showApprove() {
  visible.value = true
  auditData.value = state.selectedRowKeys
  auditTitle.value = '批量文章审核'
}

function showAudit(text: any) {
  auditData.value = [text.id]
  visible.value = true
}

function handleDetail(record: any) {
  window.open(global_config.EPORTAL_WEB + `#/focus-news/${record.id}?t=${new Date().getTime()}`, '_blank')
}

const state: any = await useCurd({
  baseApi: {
    moduleKey: 'article',
    queryOptions: {
      method: 'post'
    }
  },
  dataField: 'data.records',
  searchParams: {
    state: 1
  }
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
}
</style>
