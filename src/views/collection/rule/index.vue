<template>
  <div class="header">
    <Row :gutter="15" style="width: 100%">
      <Col :span="5">
        <Button type="primary" @click="handleAdd">增加节点</Button>
      </Col>
      <Col :span="7">
        <Input allowClear v-model:value="state.searchParams.name" placeholder="请输入采集节点名称" />
      </Col>
      <Col :span="2">
        <Button class="searchBtn" @click="state.reset">搜索</Button>
      </Col>
    </Row>
  </div>
  <div class="publish">
    <Table
      :columns="columns"
      :dataSource="state.dataSource"
      :pagination="state.pagination"
      class="tableArea"
      rowKey="id"
    >
      <template #headerCell="{ column }">
        <template v-if="column.key === 'name'">
          <span>
            节点
            <Tooltip placement="topLeft">
              <template #title>
                <span>点击访问采集页</span>
              </template>
              <InfoCircleFilled style="color: orangered" />
            </Tooltip>
          </span>
        </template>
      </template>
    </Table>
  </div>
</template>

<script lang="tsx" setup>
import { Button, Table, Input, Row, Col, Badge, Divider, Switch, Tooltip, Popconfirm, message } from 'ant-design-vue'
import { InfoCircleFilled } from '@ant-design/icons-vue'
import { ref } from 'vue'
import useCurd from '@/hocks/useCurd.tsx'
import { collectrule } from '@/api/common'
import { useRouter } from 'vue-router'

const router = useRouter()

const state = await useCurd({
  baseApi: {
    moduleKey: 'collect-node',
    queryOptions: {
      method: 'post'
    }
  },
  dataField: 'data.records'
})

const selectedRowKeys = ref([])
const { global_config } = window as any

const timer = ref()

const columns = [
  {
    title: '序号',
    dataIndex: 'code',
    width: '5%',
    align: 'center',
    fixed: 'left',
    customRender: ({ index }: any) => {
      const { current, pageSize } = state.pagination
      return (current - 1) * pageSize + index + 1
    }
  },
  {
    title: '采集节点',
    dataIndex: 'nodeName',
    ellipsis: true,
    align: 'center',
    width: '15%'
  },
  {
    title: '入库栏目',
    dataIndex: 'catalogName',
    width: '10%',
    align: 'center',
    ellipsis: true
  },
  {
    title: '手动采集',
    key: 'state',
    width: '15%',
    align: 'center',
    customRender: ({ text }: any) => {
      let value = '开始采集'
      let disabled = false
      switch (Number(text.state)) {
        case 0:
          break
        case 1:
          value = '采集中'
          disabled = true
          break
      }
      return (
        <Button
          class={`collectBtn ${disabled ? 'collectBtn-disabled' : 'collectBtn-enabled'}`}
          disabled={disabled}
          onClick={() => handleCollection(text)}
        >
          {value}
        </Button>
      )
    }
  },
  {
    title: '定时采集',
    dataIndex: 'cron',
    align: 'center',
    width: '8%',
    customRender: ({ text, record }: any) => {
      return <span>{record.isAuto ? '已开启' : '未开启'}</span>
    }
  },
  {
    title: '状态',
    key: 'state',
    width: '10%',
    align: 'center',
    customRender: ({ text }: any) => {
      let value = '未采集'
      let type: any = 'default'
      switch (Number(text.state)) {
        case 0:
          break
        case 1:
          value = '采集中'
          type = 'processing'
          break
        case 2:
          value = '采集成功'
          type = 'success'
          break
        case 3:
          value = '采集失败'
          type = 'warning'
          break
      }
      return <Badge status={type} text={value} />
    }
  },
  {
    title: '操作',
    key: 'operation',
    width: '10%',
    align: 'center',
    customRender: ({ text }: any) => (
      <span class="operate wrapper-operate">
        <Tooltip title="编辑">
          <a style="margin-right:10px" onClick={() => handleEdit(text)}>
            <i class="icon iconfont icon-bianji1" />
          </a>
        </Tooltip>
        <Tooltip title="复制">
          <a style="margin-right:10px" onClick={() => handleCopy(text)}>
            <i class="icon iconfont icon-fuzhi1" />
          </a>
        </Tooltip>
        {text.state !== 1 && (
          <Tooltip title="删除">
            <a style="margin-right:10px" onClick={() => state.deleteFunc({ id: text.id })}>
              <i class="icon iconfont icon-shanchu2" />
            </a>
          </Tooltip>
        )}
      </span>
    )
  }
]

async function handleCollection(record: any) {
  if (Number(record.state) === 1) return
  try {
    await collectrule(record.id)
    state.query()
  } catch (e) {
    console.log(e)
  }
}

function handleAdd() {
  router.push('/collection/rule/create-or-update')
}

function handleCopy(data: any) {
  router.push({
    path: '/collection/rule/create-or-update',
    query: {
      id: data.id,
      copy: 1
    }
  })
}

function handleEdit(data: any) {
  router.push({
    path: '/collection/rule/create-or-update',
    query: {
      id: data.id
    }
  })
}
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';

.header {
  background: white;
  padding: 0.2rem;
  margin-bottom: 10px;
}

.publish {
  background: white;

  .headerArea {
    .ant-btn {
      background: $menuBg;
      padding: 0.1rem 0.2rem;
      height: auto;
      border-radius: 0;
      color: $commonBtnColor;

      &:nth-child(2) {
        background: $importCollectBtnBg;
        margin-left: 0.23rem;
      }
    }

    .ant-input-search {
      display: inline-flex;
      width: 240px;
      float: right;
    }
  }

  .centerArea {
    display: flex;
    margin: 0.2rem 0;

    .contentItem {
      margin: 0 0.25rem;
      color: #222222;

      span {
        margin-left: 0.1rem;
        font-size: 0.16rem;
      }

      &:active {
        color: #c22400;
      }
    }
  }

  .tableArea {
    background: white;
    padding: 0.1rem 0.2rem;

    :deep(tbody) {
      tr:hover > td,
      tr.hover-row > td {
        background-color: $tableRowHoverBg !important;

        .collectBtn-enabled {
          background: #a51b1b;
          color: white;
        }
      }

      tr {
        &:nth-child(2n-1) {
          td {
            background: white;
          }
        }

        &:nth-child(2n) {
          td {
            background: rgb(245, 245, 245);
          }
        }
      }

      .ant-table-cell {
        padding: 0;

        .collectBtn {
          margin: 0.08rem 0 !important;
          width: 1rem;
        }

        .collectBtn-disabled {
        }

        .collectBtn-enabled {
          background: rgb(247, 245, 246);
          border: 1px solid rgb(244, 227, 223);
          color: rgb(187, 75, 52);
        }
      }

      .operate {
        .editBtn {
          color: #ffb917;
        }

        .delBtn {
          color: #c22400;
        }
      }
    }
  }
}

.searchBtn {
  //position: absolute;
  //right: .4rem;
  background: #c22400;
  border-radius: 0;
  color: white;
  letter-spacing: 8px;
}
</style>
