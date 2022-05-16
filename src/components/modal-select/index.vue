<template>
  <div :class="props.class" ref="modalSelect">
    <Modal
      class="modal-select"
      :title="title"
      :visible="props.visible"
      :width="props.width"
      :getContainer="modalSelect"
      :maskClosable="false"
      maskTransitionName=""
      cancelText="取消"
      :ok-button-props="{ loading: state.saveLoading }"
      destroyOnClose
      okText="保存"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <div class="searchArea">
        <Form :model="props.record" ref="formRef">
          <Row style="width: 100%" :gutter="24">
            <Col v-for="item in searchForm" :key="item.key" :span="item.span || 6">
              <FormItem label="权限代码" name="permissionCode">
                <RenderItem :field="item" />
                <!--                <Input size="large" :disabled="disabled" v-model:value="props.record.permissionCode" placeholder="请输入"/>-->
              </FormItem>
            </Col>
            <Button @click="state.query" class="searchBtn">搜索</Button>
          </Row>
        </Form>
      </div>
      <div v-if="props.showSelected" class="selected-area"></div>
      <div class="tableArea">
        <Table
          :rowKey="props.rowKey"
          :dataSource="state.dataSource"
          :columns="props.columns"
          :loading="state.loading"
          :row-selection="{
            selectedRowKeys: state.selectedRowKeys,
            columnWidth: '3%',
            type: props.single ? 'radio' : 'checkbox',
            onChange: onSelectChange
          }"
        />
      </div>
    </Modal>
  </div>
</template>

<script setup lang="tsx">
import { reactive, toRaw, ref, computed, getCurrentInstance, onMounted, watch, watchEffect } from 'vue'
import {
  Modal,
  Form,
  Tree,
  Descriptions,
  Row,
  Col,
  Switch,
  Divider,
  Button,
  Select,
  Input,
  Table,
  message
} from 'ant-design-vue'
import { commonSearch } from '@/api/common'
import { DownOutlined } from '@ant-design/icons-vue'
import FormTree from '@/components/form-tree.vue'
// @ts-ignore
// import { ColumnsProps, RequestOptionsProps } from './type.ts'
import RenderItem from '@/components/render-item'
import request from '@/utils/request'

const FormItem = Form.Item
const { proxy }: any = getCurrentInstance()

const emit = defineEmits(['update:visible', 'update:selectedRowKeys', 'update:selectedRows'])

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  class: {
    type: String,
    default: 'wrapper-modal-select'
  },
  width: {
    type: String,
    default: '56vw'
  },
  columns: {
    type: Array,
    default: () => []
  },
  selectedRowKeys: {
    type: Array,
    default: () => []
  },
  showSelected: {
    type: Boolean
  },
  single: {
    type: Boolean
  },
  requestOptions: {
    type: Object
  },
  requestParams: {
    type: Object,
    default: () => {}
  },
  rowKey: {
    type: String,
    default: 'id'
  },
  handleSave: {
    type: Function,
    required: true
  }
})

const modalSelect = ref()

const state: any = reactive({
  dataSource: [],
  loading: false,
  saveLoading: false,
  expandedKeys: [],
  selectedRowKeys: [],
  selectedRows: []
})

const searchForm = computed(() => props.columns.filter((item: any) => item.showInForm || item.formKey))

const title = computed(() => {
  return (
    <div class="customTitle">
      <div class="tips" />
      <span>分配权限</span>
    </div>
  )
})

watch(
  () => props.visible,
  (val) => {
    if (val) {
      state.selectedRowKeys = props.selectedRowKeys || []
      search()
    } else {
      state.selectedRows = []
      state.selectedRowKeys = []
    }
  }
)

async function search() {
  state.loading = true
  const res = await request({
    ...props.requestOptions
  })
  state.dataSource = res.data.data.records
  state.loading = false
}

function onSelectChange(selectedRowKeys: any[], selected: any[]) {
  state.selectedRowKeys = selectedRowKeys
  state.selectedRows = selected
}

async function handleOk() {
  if (!props.handleSave) return
  state.saveLoading = true
  state.saveLoading = await props.handleSave(state.selectedRowKeys)
}

function handleCancel() {
  emit('update:visible', false)
}
</script>

<style scoped lang="scss">
.modal-select {
  .searchArea {
    padding: 0;
  }
}
</style>
