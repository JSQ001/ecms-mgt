<template>
  <div class="searchArea">
    <Row style="width: 100%" :gutter="15">
      <Col :span="5">
        <Button @click="state.handleCreateClick" type="primary">新增角色</Button>
      </Col>
      <Col :span="6">
        <Input v-model:value="state.searchParams.roleName" placeholder="搜索角色名称" />
      </Col>
      <Col :span="2">
        <Button @click="state.reset" class="searchBtn">搜索</Button>
      </Col>
    </Row>
  </div>
  <div class="role-setting">
    <div class="tableArea">
      <Table rowKey="id" :dataSource="state.dataSource" :columns="columns" />
    </div>
    <CreateOrUpdate v-model:visible="state.visible" :record="state.record" @onSave="state.save" />
    <AssignPermission
      v-model:visible="showAssignPermission"
      v-model:selectedRowKeys="selectedRowKeys"
      :record="state.record"
    />
    <AssignMenu v-model:visible="showAssignMenu" :record="state.record" />
  </div>
</template>

<script lang="tsx" setup>
import { reactive, ref, toRaw } from 'vue'
import {
  Form,
  Input,
  Divider,
  Button,
  message,
  Tooltip,
  Table,
  Popconfirm,
  Select,
  Row,
  Col,
  DatePicker
} from 'ant-design-vue'
import { commonSearch, roleAssignPermission } from '@/api/common'
import useCurd from '@/hocks/useCurd.tsx'
import { UserSwitchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import CreateOrUpdate from './components/create-or-update.vue'
// @ts-ignore
import AssignPermission from './components/assignPermission.tsx'
import AssignMenu from './components/assignMenu.vue'
import { queryPermissionByRoleId } from '@/api/role'
import { queryMenuByRoleId } from '@/api/menu'
import { store } from '@/store'

const labelCol = { span: 4 }
const wrapperCol = { span: 18 }

const columns = [
  {
    title: '序号',
    width: '10%',
    ellipsis: true,
    align: 'center',
    customRender: ({ index }: any) => {
      const { current, pageSize } = state.pagination
      return (current - 1) * pageSize + index + 1
    }
  },
  {
    title: '角色代码',
    align: 'center',
    width: '30%',
    dataIndex: 'roleCode'
  },
  {
    title: '角色名',
    align: 'center',
    width: '30%',
    dataIndex: 'roleName'
  },
  {
    title: '操作',
    key: 'operation',
    fixed: 'right',
    width: '10%',
    align: 'center',
    customRender: ({ text }: any) => (
      <span class="wrapper-operate">
        <Tooltip title="编辑">
          <a style="margin-right:10px" onClick={() => state.handleEditClick(text)}>
            <i class="icon iconfont icon-bianji1" />
          </a>
        </Tooltip>
        <Tooltip title="分配菜单">
          <a style="margin-right:10px" class="tableRowEdit" onClick={() => assignMenu(text)}>
            <i class="icon iconfont icon-fenpeiquanxian" />
          </a>
        </Tooltip>
        <Tooltip title="删除">
          <a style="margin-right:10px" onClick={() => state.deleteFunc({ id: text.id })} class="tableRowDel">
            <i class="icon iconfont icon-shanchu2" />
          </a>
        </Tooltip>
      </span>
    )
  }
]

function handleShow(val: any) {
  state.record = {}
  state.visible = true
}

const showAssignPermission = ref(false)
const showAssignMenu = ref(false)
const selectedRowKeys = ref([])

/**
 * 分配菜单
 * */
async function assignMenu(text: any) {
  showAssignMenu.value = true
  state.record = toRaw({ ...text })
}

async function assignPermission(text: any) {
  const res = await queryPermissionByRoleId(text.id)
  showAssignPermission.value = true
  state.record = toRaw(text)
  selectedRowKeys.value = res.data.data.map((item: any) => item.id)
}

async function handleAssign(list: any) {
  let delList: any = [],
    addList: any = []
  if (state.record.permissionList && state.record.permissionList.length) {
    // 找出被删除的
    state.record.permissionList.forEach((item: any) => {
      if (!list.includes(item.permissionId)) {
        delList.push(item.id)
      }
    })
    list.forEach((item: any) => {
      if (!state.record.permissionList.find((i: any) => i.permissionId === item) && list.includes(item)) {
        addList.push({
          roleId: state.record.id,
          permissionId: item
        })
      }
    })
  } else {
    addList = list.map((item: any) => ({
      roleId: state.record.id,
      permissionId: item
    }))
  }
  try {
    const {
      data: { code },
      status
    }: any = await roleAssignPermission({ delList, addList })
    const success = code === 200 && status === 200
    message[success ? 'success' : 'error'](`分配${success ? '成功' : '失败'}!`)
    showAssignPermission.value = false
    state.query()
  } catch (e) {
    console.log(e)
  }
}

const state: any = await useCurd({
  baseApi: {
    moduleKey: 'role'
  },
  dataField: 'data.records',
  searchParams: {
    received: false
  }
})
</script>
<style lang="scss">
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
.searchArea {
  position: relative;
  padding: 0.2rem;
  background: #fff;
  margin-bottom: 10px;

  .searchBtn {
    background: #c22400;
    border-radius: 0;
    color: white;
    letter-spacing: 8px;
  }
}
.role-setting {
  background: #ffffff;

  .tableArea {
    padding: 0.2rem !important;

    .ant-btn {
      margin-bottom: 0.1rem;
    }
  }

  .el-pagination {
    text-align: center;
    padding: 0.2rem 0;
  }
}
</style>
