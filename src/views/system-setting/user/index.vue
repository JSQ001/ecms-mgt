<template>
  <div class="searchArea">
    <Row style="width: 100%" :gutter="15">
      <Col :span="6">
        <Input v-model:value="state.searchParams.keyword" placeholder="搜索用户名称" />
      </Col>
      <Col :span="2">
        <Button @click="state.reset" class="searchBtn">搜索</Button>
      </Col>
    </Row>
  </div>
  <div class="column-setting">
    <div class="tableArea">
      <Table rowKey="id" :loading="state.loading" :dataSource="state.dataSource" :columns="columns" />
    </div>
    <CreateOrUpdate v-model:visible="state.visible" :record="state.record" @onSave="state.save" />
    <AssignRole v-model:visible="showAssignRole" :data="editData" :record="state.record" @save="state.query" />
    <ResetPwd v-model:visible="visiblePassword" :data="editData" @save="state.query" />
  </div>
</template>

<script lang="tsx" setup>
import { reactive, ref, toRaw } from 'vue'
import { Form, Input, Divider, Button, Table, Popconfirm, Select, Row, Col, Tooltip, DatePicker } from 'ant-design-vue'
import { UserSwitchOutlined, EditOutlined, DeleteOutlined, LockOutlined } from '@ant-design/icons-vue'
import { commonSearch, commonDelete } from '@/api/common'
import CreateOrUpdate from './components/create-or-update.vue'
import AssignRole from './components/assignRole.vue'
import ResetPwd from './components/resetPwd.vue'

import useCurd from '@/hocks/useCurd.tsx'

const labelCol = { span: 4 }
const wrapperCol = { span: 18 }
const showAssignRole = ref(false)
const visiblePassword = ref(false)
const editData = ref({})
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
    title: '用户名',
    align: 'center',
    width: '20%',
    dataIndex: 'username'
  },
  {
    title: '联系方式',
    align: 'center',
    width: '20%',
    dataIndex: 'contact'
  },
  {
    title: '角色',
    align: 'center',
    width: '25%',
    dataIndex: 'roleName',
    customRender({ record }: any) {
      let str = ''
      if (record.roleList !== undefined && record.roleList.length) {
        record.roleList.forEach((i: any) => (str += '、' + i.roleName))
        str = str.replace('、', '')
      }
      return str
    }
  },
  {
    title: '操作',
    key: 'operation',
    fixed: 'right',
    width: '20%',
    align: 'center',
    customRender: ({ text }: any) => (
      <span class="wrapper-operate">
        <Tooltip title="分配角色">
          <a style="margin-right:10px" onClick={() => mallocRole(text)}>
            <i class="icon iconfont icon-fenpeijiaose" />
          </a>
        </Tooltip>
        <Tooltip title="删除">
          <a onClick={() => state.deleteFunc({ id: text.id })}>
            <i class="icon iconfont icon-shanchu2" />
          </a>
        </Tooltip>
      </span>
    )
  }
]


function mallocRole(record: any) {
  showAssignRole.value = true
  state.record = {
    ...record,
    roleId: record.roleList.map((i: any) => i.id)
  }
}

function cancelPassword(record: any) {
  visiblePassword.value = true
  editData.value = record
}

const state = await useCurd({
  baseApi: {
    moduleKey: 'user'
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
  background: #fff;
  padding: 0.2rem;
  margin-bottom: 10px;

  .searchBtn {
    background: #c22400;
    border-radius: 0;
    color: white;
    letter-spacing: 8px;
  }
}
.column-setting {
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
