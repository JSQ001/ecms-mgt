<template>
  <div class="searchArea">
    <Row style="width: 100%" :gutter="15">
      <Col :span="6">
        <Input.Search v-model:value="state.searchParams.userName" placeholder="搜索用户名称" />
      </Col>
      <Col :span="2">
        <Button @click="search" class="searchBtn">搜索</Button>
      </Col>
    </Row>
  </div>
  <div class="column-setting">
    <div class="tableArea">
      <Table rowKey="id" :dataSource="state.dataSource" :columns="columns" />
    </div>
  </div>
</template>

<script lang="tsx" setup>
import { reactive, ref, toRaw } from 'vue'
import { Form, Input, Divider, Button, Table, Popconfirm, Select, Row, Col, DatePicker } from 'ant-design-vue'
import useCurd from '@/hocks/useCurd.tsx'

const columns = [
  {
    title: '用户名',
    dataIndex: 'userName'
  },
  {
    title: '操作',
    dataIndex: 'phone',
    key: 'phone'
  },
  {
    title: '操作时间',
    dataIndex: 'roleName',
    key: 'roleName'
  }
]
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
