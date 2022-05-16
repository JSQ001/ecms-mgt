<template>
  <div class="searchArea">
    <Row style="width: 100%" :gutter="15">
      <Col :span="5">
        <Button @click="state.handleCreateClick" type="primary">新增权限</Button>
      </Col>
      <Col :span="6">
        <Input.Search v-model:value="state.searchParams.name" placeholder="搜索权限名称" />
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
  </div>
</template>

<script lang="tsx" setup>
import { reactive, ref, toRaw, onMounted } from 'vue'
import { Form, Input, Divider, Tooltip, Button, Table, Popconfirm, Select, Row, Col, DatePicker } from 'ant-design-vue'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { commonSearch, commonDelete } from '@/api/common'
import useCurd from '@/hocks/useCurd.tsx'
import CreateOrUpdate from './components/create-or-update.vue'

const columns = [
  {
    title: '权限代码',
    dataIndex: 'permissionCode'
  },
  {
    title: '权限名称',
    dataIndex: 'permissionName'
  },
  {
    title: '操作',
    key: 'operation',
    fixed: 'right',
    width: '10%',
    align: 'center',
    customRender: ({ text }: any) => (
      <span>
        <Tooltip title="编辑">
          <a onClick={() => state.handleEditClick(text)}>
            <EditOutlined />
          </a>
        </Tooltip>
        <Tooltip title="删除">
          <a class="tableRowDel" style="margin-left:10px" onClick={() => state.deleteFunc({ id: text.id })}>
            <DeleteOutlined />
          </a>
        </Tooltip>
      </span>
    )
  }
]

const state = await useCurd({
  baseApi: {
    moduleKey: 'permission'
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
.role-setting {
  background: #ffffff;

  .tableArea {
    padding: 0.15rem 0.2rem;

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
