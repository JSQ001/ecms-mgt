<template>
  <div class="menu-management">
    <div class="searchArea">
      <Form ref="formRef" :model="state.searchParams" :wrapper-col="wrapperCol" layout="inline">
        <Row style="width: 100%">
          <Col :span="5">
            <Button type="primary" @click="state.handleCreateClick">新增菜单</Button>
          </Col>
          <Col :span="6">
            <Input v-model:value="state.searchParams.nameName" placeholder="请输入菜单名称" />
          </Col>
          <Button @click="state.reset" class="searchBtn">搜索</Button>
        </Row>
      </Form>
    </div>
    <div class="tableArea">
      <div class="tableHeader">
        <Button style="margin-left: 0.1rem" :disabled="!state.selectedRowKeys.length">删除菜单</Button>
      </div>
      <Table
        rowKey="id"
        bordered
        :dataSource="state.dataSource"
        :loading="state.loading"
        :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: state.onSelectChange }"
        @expand="handleExpand"
        :columns="columns"
      >
        <template #expandIcon="props">
          <RightOutlined
            @click="props.onExpand(props.record)"
            :class="`${props.record.children && props.record.children.length ? '' : 'table-row-expand-icon-hidden'}
              table-row-expand-icon table-row-expand-icon-${props.expanded ? 'collapsed' : 'expanded'}`"
          />
        </template>
      </Table>
    </div>
    <CreateOrUpdate
      v-model:visible="state.visible"
      :record="state.record"
      :menuTree="state.dataSource"
      @onSave="state.save"
    />
    <AssignRole v-model:visible="showAssign" :defaultValue="selectedKeys" @onSelect="handleAssign" />
  </div>
</template>

<script lang="tsx" setup>
import { watch, ref, toRaw } from 'vue'
import {
  Form,
  Input,
  Divider,
  Button,
  Switch,
  Tooltip,
  Table,
  Popconfirm,
  Select,
  Row,
  Col,
  DatePicker,
  message
} from 'ant-design-vue'
import { resetSort } from '@/utils'
import { menuAssignRole } from '@/api/common'
import { RightOutlined } from '@ant-design/icons-vue'
import useCurd from '@/hocks/useCurd'
import CreateOrUpdate from './components/create-or-update.vue'
import AssignRole from './components/assignRole.vue'

const labelCol = { span: 4 }
const wrapperCol = { span: 18 }

const statusList = [
  {
    key: 1,
    label: '全部'
  },
  {
    key: 2,
    label: '显示'
  },
  {
    key: 3,
    label: '隐藏'
  }
]

const columns = [
  {
    title: '菜单名称',
    dataIndex: 'menuName',
    align: 'center',
    ellipsis: true
  },
  {
    title: '访问路径',
    dataIndex: 'path',
    align: 'center',
    ellipsis: true
  },
  {
    title: '菜单状态',
    dataIndex: 'enabled',
    align: 'center',
    width: '1.2rem',
    customRender: ({ text, record }: any) => (record.enabled ? '显示' : '不显示')
  },
  {
    title: '图标',
    dataIndex: 'icon',
    align: 'center'
  },
  {
    title: '显示顺序',
    dataIndex: 'sortOrder',
    align: 'center',
    width: '1.2rem'
  },
  {
    title: '操作',
    key: 'operation',
    fixed: 'right',
    width: '1.5rem',
    align: 'center',
    customRender: ({ text }: any) => (
      <span class="wrapper-operate">
        <Tooltip v-slots={{ title: () => '添加子菜单' }}>
          <i
            class="icon iconfont icon-jia1"
            style="cursor:pointer"
            onClick={() => {
              state.record = {
                parentId: text.id
              }
              state.visible = true
            }}
          />
        </Tooltip>
        <Tooltip v-slots={{ title: () => '编辑' }}>
          <i
            class="icon iconfont icon-bianji1"
            style="margin-left: .1rem;cursor:pointer"
            onClick={() => state.handleEditClick({ ...text })}
          />
        </Tooltip>
        <Tooltip v-slots={{ title: () => '删除' }}>
          <i
            onClick={() => state.deleteFunc({ id: text.id })}
            style="margin-left: .1rem;cursor:pointer"
            class="icon iconfont icon-shanchu2"
          />
        </Tooltip>
      </span>
    )
  }
]

function handleShow(val: any) {
  state.record = {}
  state.visible = true
}

const showAssign = ref(false)
const selectedKeys = ref([])

async function assignAuthority(text: any) {
  showAssign.value = true
  state.record = toRaw(text)
  selectedKeys.value = (text.roles || []).map((item: any) => item.roleId)
}

async function handleAssign(list: any) {
  let delList: any = [],
    addList: any = []
  if (state.record.roles && state.record.roles.length) {
    // 找出被删除的
    state.record.roles.forEach((item: any) => {
      if (!list.includes(item.roleId)) {
        delList.push(item.id)
      }
    })
    list.forEach((item: any) => {
      if (!state.record.roles.includes(item) && list.includes(item)) {
        addList.push({
          menuId: state.record.id,
          roleId: item
        })
      }
    })
  } else {
    addList = list.map((item: any) => ({
      menuId: state.record.id,
      roleId: item
    }))
  }
  try {
    const {
      data: { code },
      status
    }: any = await menuAssignRole({ delList, addList })
    const success = code === 200 && status === 200
    message[success ? 'success' : 'error'](`分配${success ? '成功' : '失败'}!`)
    showAssign.value = false
    state.query()
  } catch (e) {
    console.log(e)
  }
}

function handleExpand(expanded: any, record: any) {
  // let index = expandedRowKeys.value.findIndex(item=>item === record.id)
  // if(expanded){
  //   expandedRowKeys.value.push(record.id)
  // }else {
  //   expandedRowKeys.value.splice(index)
  // }
}

const state: any = await useCurd({
  baseApi: {
    moduleKey: 'menu',
    queryUrl: '/api/menu/list/tree'
  }
})

watch(
  () => state.dataSource,
  (val) => {
    state.dataSource = resetSort(val)
  }
)
</script>
<style lang="scss" scoped>
.ant-form {
  :vdeep(.ant-form-item) {
    .ant-col {
      background: #0086b3 !important;
      width: 10px;
    }
  }

  //.ant-form-item-label {
  //  display: flex !important;
  //  align-items: center;
  //}
}

.menu-management {
  .searchArea {
    background: white;
    position: relative;
    padding: 0.2rem;
    // box-shadow: 0 2px 12px #0000004d;

    .ant-col {
      &:nth-child(n + 2) {
        //margin-left: .15rem;
      }
    }

    .searchBtn {
      margin-left: 0.25rem;
      background: #c22400;
      border-radius: 0;
      color: white;
      letter-spacing: 8px;
    }
  }

  .tableArea {
    margin-top: 0.1rem;
    padding: 0.15rem 0.2rem;
    background: white;
    //box-shadow: 0 2px 12px #0000004d;

    .tableHeader {
      .ant-btn:nth-child(2) {
        margin: 0 0.15rem;
      }
    }

    .ant-btn {
      margin-bottom: 0.1rem;
    }

    :deep(.ant-table) {
      tbody {
        tr > td {
          padding: 0.06rem;
        }
      }
    }
  }

  .el-pagination {
    text-align: center;
    padding: 0.2rem 0;
  }
}
</style>
