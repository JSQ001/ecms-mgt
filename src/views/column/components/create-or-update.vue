<template>
  <div ref="recordForm" class="createOrUpdate_column">
    <Modal
      :getContainer="$refs.recordForm"
      :title="title"
      :visible="props.visible"
      :width="props.width"
      cancelText="取消"
      class="recordFormModal"
      :maskClosable="false"
      destroyOnClose
      okText="保存"
      @cancel="handleCancel"
      @ok="handleOk"
    >
      <Form ref="formRef" :label-col="{ style: { width: '100px' } }" :model="props.record" :rules="rulesRef">
        <Form.Item class="formItem-width-half" label="栏目编码" name="code">
          <Input
            v-model:value="props.record.code"
            :disabled="!!props.record.id && !props.record.copy"
            placeholder="请输入栏目编码"
          />
        </Form.Item>
        <Form.Item class="formItem-width-half" label="栏目名称" name="catalogName">
          <Input v-model:value="props.record.catalogName" placeholder="请输入栏目名称" />
        </Form.Item>
        <Form.Item class="formItem-width-half" label="栏目路径" name="path">
          <Input v-model:value="props.record.path" placeholder="请输入栏目路径" />
        </Form.Item>
        <Form.Item class="formItem-width-half" label="栏目类型" name="type">
          <Select v-model:value="props.record.type" :defaultValue="0" placeholder="请选择栏目类型">
            <Select.Option v-for="item in props.columnTypeList" :key="item.key" :value="item.key">
              {{ item.label }}
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item class="formItem-width-half" label="上级栏目" name="parentId">
          <TreeSelect
            v-model:value="props.record.parentId"
            :dropdown-style="{ maxHeight: '500px', overflow: 'auto' }"
            :fieldNames="{ label: 'catalogName', value: 'id' }"
            :dropdownMatchSelectWidth="false"
            :tree-data="props.columnList"
            filterTreeNode
            treeNodeFilterProp="catalogName"
            v-model:searchValue="treeSearchValue"
            allow-clear
            placeholder="请选择栏目"
            show-search
            style="width: 100%"
            tree-default-expand-all
          />
        </Form.Item>

        <Form.Item class="formItem-width-half" label="自定义链接" name="customUrl">
          <Input v-model:value="props.record.customUrl" placeholder="请输入自定义链接" />
        </Form.Item>

        <Form.Item class="formItem-width-half" label="上线时间" name="publishTime">
          <DatePicker
            v-model:value="props.record.publishTime"
            :locale="locale"
            placeholder="请选择上线时间"
            style="width: 100%"
          />
        </Form.Item>
        <Form.Item class="formItem-width-half" label="关键字" name="keyword">
          <Input v-model:value="props.record.keyword" placeholder="请输入关键字" />
        </Form.Item>
        <Form.Item class="formItem-width-half" label="排序" name="sortOrder">
          <InputNumber
            v-model:value="props.record.sortOrder"
            :min="0"
            :precision="0"
            placeholder="请输入排序"
            style="width: 60%"
          />
        </Form.Item>
        <Form.Item label="描述" name="remarks">
          <Input.TextArea v-model:value="props.record.remarks" placeholder="请输入描述" />
        </Form.Item>
      </Form>
    </Modal>
  </div>
</template>

<script lang="tsx" setup>
import { reactive, toRaw, ref, computed, onMounted, getCurrentInstance, watchEffect, watch } from 'vue'

import {
  Modal,
  TreeSelect,
  Form,
  Button,
  InputNumber,
  Select,
  DatePicker,
  Col,
  Row,
  Input,
  message
} from 'ant-design-vue'
import dayjs from 'dayjs'

const { proxy }: any = getCurrentInstance()
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'

const emit = defineEmits(['update:visible', 'onSave'])

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  columnList: {
    type: Object,
    required: true
  },
  record: {
    type: Object,
    required: true
  },
  columnTypeList: Array,
  width: {
    type: String,
    default: '40vw'
  }
})

const columnCode = ref('')
const treeSearchValue = ref('')
const state = reactive({})
const rulesRef = reactive({
  code: [
    {
      required: true,
      message: ''
    }
  ],
  name: [
    {
      required: true,
      message: ''
    }
  ],
  path: [
    {
      required: true,
      message: ''
    }
  ],
  url: [
    {
      required: true,
      message: ''
    }
  ]
})

const treeData = ref<any>([])

const title = computed(() => {
  return (
    <div class="customTitle">
      <div class="tips" />
      <span>{props.record.copy ? '复制栏目' : props.record.id ? '修改栏目' : '添加栏目'}</span>
    </div>
  )
})

watch(
  () => props.visible,
  (val) => {
    if (val) {
      // 设置编辑值
      // 设置编辑时，时间类型
      props.record.publishTime = props.record.publishTime ? dayjs(props.record.publishTime) : null
    }
  }
)

async function handleOk() {
  const values = await proxy.$refs.formRef.validate()
  if (props.record.id) {
    if (props.record.id == props.record.parentId) {
      message.error('不能移动到自身！')
      return
    }
    values.id = props.record.id
  }
  if (props.record.copy) {
    delete values.id
  }if (props.record.copy) {
    delete values.id
  }
  values.publishTime = values.publishTime ? dayjs(values.publishTime).format('YYYY-MM-DD HH:MM:ss') : null
  emit('onSave', values)
}

function handleCancel() {
  columnCode.value = ''
  emit('update:visible', false)
}
</script>

<style lang="scss" scoped>
.createOrUpdate_column {
  :deep(.ant-form) {
    // padding: 0 .9rem;
    .ant-form-item {
      display: inline-flex;
      width: 100%;
      margin-bottom: 0.15rem;
    }

    .formItem-width-half {
      width: 50% !important;
    }

    .ant-form-item-label {
      width: 0.9rem;
    }
  }
}

.ant-modal-footer {
  text-align: center !important;
}
</style>
