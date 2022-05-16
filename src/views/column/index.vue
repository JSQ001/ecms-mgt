<template>
  <Row :gutter="15" type="flex">
    <Col :span="5" style="background: #fff">
      <div style="padding: 10px; width: 100%">
        <Tree
          v-if="state.dataSource.length"
          :selectedKeys="selectedKeys"
          :fieldNames="{
            label: 'catalogName',
            value: 'id',
            children: 'children',
            key: 'id'
          }"
          :tree-data="state.dataSource"
          defaultExpandAll
          show-icon
          show-line
          @select="handleSelect"
        >
          <template #title="node">
            <div class="treeItem">
              <div class="title node-title">
                {{ node.catalogName }}
                <span class="ope">
                  <Tooltip title="编辑">
                    <span @click="state.handleEditClick({ ...node })"><FormOutlined /></span>
                  </Tooltip>
                  <Tooltip title="删除">
                    <span @click="state.deleteFunc({ id: node.id })"><DeleteOutlined /></span>
                  </Tooltip>
                </span>
              </div>
            </div>
          </template>
        </Tree>
      </div>
    </Col>
    <Col :span="19">
      <div class="searchArea">
        <Form ref="formRef" :model="state.searchParams" layout="inline">
          <Row style="width: 100%">
            <Col :span="5">
              <Button type="primary" @click="handleAdd">新增栏目</Button>
            </Col>
          </Row>
        </Form>
      </div>
      <div class="column-setting">
        <div class="tableArea">
          <Table
            :columns="columns"
            :dataSource="tableData"
            :loading="state.loading"
            childrenColumnName="_children"
            :pagination="null"
            :row-class-name="(record, index) => (index % 2 === 1 ? 'table-striped' : null)"
            class="no_border"
            rowKey="id"
          >
          </Table>
        </div>
      </div>
    </Col>
  </Row>

  <CreateOrUpdate
    v-model:visible="state.visible"
    :columnList="state.dataSource"
    :columnTypeList="columnTypeList"
    :record="state.record"
    @onSave="state.save"
  />
  <Move v-model:visible="visible" :columnList="state.dataSource" :moveData="moveData" @save="state.query" />
</template>

<script lang="tsx" setup>
import Move from './components/move-modal.vue'
import CreateOrUpdate from './components/create-or-update.vue'
import { computed, ref, watch } from 'vue'
import { Form, Tree, Input, Row, Tooltip, InputNumber, Col, Button, Table } from 'ant-design-vue'
import { DeleteOutlined, FormOutlined } from '@ant-design/icons-vue'
import useCurd from '@/hocks/useCurd.tsx'
import dayjs from 'dayjs'

const columnTypeList = [
  {
    key: 0,
    label: '内部栏目'
  },
  {
    key: 1,
    label: '外部栏目'
  }
]

const selectedKeys = ref<any>([])
const selectedRow = ref<any>({})
const visible = ref(false)
const moveData = ref({})
const list = ref([])
const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    width: '5%',
    align: 'center',
    ellipsis: true,
    customRender: ({ index }: any) => {
      const { pageSize, current } = state.pagination
      return pageSize * (current - 1) + index + 1
    }
  },
  {
    title: '栏目编码',
    dataIndex: 'code',
    width: '10%',
    align: 'center',
    ellipsis: true
  },
  {
    title: '栏目名称',
    dataIndex: 'catalogName',
    width: '10%',
    align: 'center',
    ellipsis: true
  },
  {
    title: '栏目路径',
    dataIndex: 'path',
    ellipsis: true,
    align: 'center',
    width: '10%'
  },
  {
    title: '发布时间',
    dataIndex: 'publishTime',
    align: 'center',
    ellipsis: true,
    width: '10%',
    customRender: ({ text }: any) => (text ? dayjs(text).format('YYYY-MM-DD') : '-')
  },
  {
    title: '排序',
    dataIndex: 'sortOrder',
    align: 'center',
    width: '5%',
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
    title: '操作',
    key: 'operation',
    width: '15%',
    align: 'center',
    customRender: ({ text }: any) => (
      <span class="wrapper-operate">
        <Tooltip title="新增子栏目">
          <a
            style="margin-right:10px"
            onClick={() => {
              state.record = {
                parentId: text.id
              }
              state.visible = true
            }}
          >
            <i class="icon iconfont icon-jia1" />
          </a>
        </Tooltip>
        <Tooltip title="复制">
          <a style="margin-right:10px" onClick={() => handleCopy(text)}>
            <i class="icon iconfont icon-fuzhi1" />
          </a>
        </Tooltip>
        <Tooltip title="编辑">
          <a style="margin-right:10px" onClick={() => state.handleEditClick({ ...text })}>
            <i class="icon iconfont icon-bianji1" />
          </a>
        </Tooltip>
        <Tooltip title="移动">
          <a style="margin-right:10px" onClick={() => handleMove(text)}>
            <i class="icon iconfont icon-yidong" />
          </a>
        </Tooltip>
        <Tooltip title="删除">
          <a style="margin-right:10px" onClick={() => state.deleteFunc({ id: text.id })}>
            <i class="icon iconfont icon-shanchu2" />
          </a>
        </Tooltip>
      </span>
    )
  }
]
const columnList = ref<any>([])
const changed = ref()
const time = ref()
const state = await useCurd({
  baseApi: {
    moduleKey: 'catalog',
    queryUrl: '/api/catalog/tree/parentId'
  },
  dataField: 'data'
})

function getList(data: any): any {
  let list = data
  let index = -1
  for (let i = 0; i < list.length; i++) {
    if (list[i].cannotModify) {
      index = i
      break
    }
  }
  if (index != -1) {
    list.splice(index, 1)
    return getList(list)
  } else {
    return list
  }
}

watch(
  () => state.dataSource,
  (val: any) => {
    state.dataSource = getList(val)
    //默认选中第一项展开
    if (!val.length) return
    if (!selectedKeys.value.length) {
      selectedKeys.value = [val[0].id]
      selectedRow.value = val[0]
    } else {
      getSelectedRow(selectedKeys.value[0], val)
    }
  }
)

const tableData = computed(() => (selectedRow.value || {}).children || [])

function getSelectedRow(targetId: number, source: any) {
  for (let i = 0; i < source.length; i++) {
    if (targetId === source[i].id) {
      selectedRow.value = source[i]
      break
    }
    !!source[i].children.length && getSelectedRow(targetId, source[i].children)
  }
}

function handleAdd() {
  state.record = {
    parentId: selectedKeys.value[0]
  }
  state.visible = true
}

//排序
function getNum(val: any) {
  let value = val.replace(/[^\d]/g, '')
  if (value === '') {
    value = 0
  }
  return value
}

//复制所选项
const handleCopy = (data: any) => {
  state.record = { ...data, id: undefined, copy: true }
  state.visible = true
}

//移动
function handleMove(data: any) {
  moveData.value = data
  visible.value = true
}

function handleSelect(_selectedKeys: any, record: any) {
  if (record.node.id === selectedRow.value.id) return
  selectedKeys.value = _selectedKeys
  selectedRow.value = record.node
}
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';

.searchArea {
  position: relative;
  background: #ffffff;
  padding: 0.2rem;
  margin-bottom: 10px;

  .search-name {
    width: 2.6rem;
  }

  .searchBtn {
    //position: absolute;
    //right: .4rem;
    background: #c22400;
    border-radius: 0;
    color: white;
    letter-spacing: 8px;
  }

  .ant-row {
    align-items: center;
  }
}

.node-title {
  position: relative;
  width: 200px;

  &:hover {
    .ope {
      display: block;
    }
  }

  .ope {
    display: none;
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);

    span {
      margin-left: 5px;
    }
  }
}

.column-setting {
  background: #ffffff;

  .tableArea {
    .wrapper_btn {
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    }

    :deep(.ant-table) {
      tr:hover > td,
      tr.hover-row > td {
        background-color: $tableRowHoverBg !important;

        .collectBtn-enabled {
          background: #a51b1b;
          color: white;
        }
      }
    }

    :deep(.link-btn) {
      margin-right: 5px;
    }

    :deep(.table-row-expand-icon-expanded) {
      display: none;
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

  .el-pagination {
    text-align: center;
    padding: 0.2rem 0;
  }
}
</style>
