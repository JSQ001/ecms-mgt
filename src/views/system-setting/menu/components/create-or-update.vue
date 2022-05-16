<template>
  <div class="createOrUpdate-menu" ref="recordForm">
    <Modal
      class="createMenuModal"
      :title="title"
      v-model:visible="_visible"
      width="40vw"
      cancelText="取消"
      :getContainer="$refs.recordForm"
      okText="保存"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <Form :model="props.record" ref="formRef" :rules="rulesRef">
        <Row type="flex" :gutter="15">
          <Col :span="12">
            <FormItem label="菜单名称" name="menuName">
              <Input v-model:value="props.record.menuName" placeholder="请输入菜单名称" />
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="访问路径" name="path">
              <Input v-model:value="props.record.path" placeholder="请输入访问路径" />
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="上级菜单" name="parentId">
              <TreeSelect
                v-model:value="props.record.parentId"
                show-search
                style="width: 100%"
                :dropdown-style="{ maxHeight: '4rem', overflow: 'auto' }"
                placeholder="请选择上级菜单"
                allow-clear
                tree-default-expand-all
                :fieldNames="{ key: 'id', label: 'menuName', value: 'id' }"
                :tree-data="menuTree"
              />
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="显示顺序" name="sortOrder">
              <InputNumber
                :min="0"
                :step="1"
                :precision="0"
                v-model:value="props.record.sortOrder"
                placeholder="请输入显示顺序"
              />
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="菜单状态" name="enabled" class="formItem-status">
              <Radio.Group v-model:value="props.record.enabled" name="radioGroup">
                <Radio :value="true">显示</Radio>
                <Radio :value="false">隐藏</Radio>
              </Radio.Group>
              <!--                <Switch checked-children="显示"   un-checked-children="隐藏" :defaultValue="true" v-model:checked="props.record.enabled" />-->
            </FormItem>
          </Col>
          <Col :span="24">
            <FormItem label="图标" name="icon">
              <SelectIcon v-model="props.record.icon" />
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  </div>
</template>

<script setup lang="tsx">
import { reactive, toRaw, ref, computed, getCurrentInstance, watch } from 'vue'
import { Modal, TreeSelect, Form, Switch, Radio, Button, Row, Col, InputNumber, Select, Input } from 'ant-design-vue'
import { commonSearch } from '@/api/common'
// @ts-ignore
import SelectIcon from '@/components/select-icon'
const FormItem = Form.Item
const { proxy }: any = getCurrentInstance()

const emit = defineEmits(['update:visible', 'onSave'])

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  record: {
    type: Object,
    required: true
  },
  menuTree: {
    type: Array,
    required: true
  }
})

const state = reactive({})

const title = computed(() => {
  return (
    <div class="customTitle">
      <div class="tips" />
      <span>{props.record.id ? '编辑菜单' : '添加菜单'}</span>
    </div>
  )
})

watch(
  () => props.visible,
  (val) => {
    if (val) {
      if (!props.record.id) {
        // 设置新建默认值
        if (!props.record.parentId) {
          props.record.parentId = null
        }
        props.record.enabled = true
      } else {
        props.record.status = !!Number(props.record.status)
      }
    }
  }
)

//新建子菜单时不可以修改菜单
const disabled = computed(() => !props.record.id && !!props.record.parentId)

const _visible = computed({
  set: (val) => {
    emit('update:visible', val)
  },
  get: () => props.visible
})
const rulesRef = reactive({
  menuName: [
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
  type: [
    {
      required: true,
      message: ''
    }
  ]
})

function handleClose() {
  emit('update:visible', false)
}

async function handleOk() {
  const values = await proxy.$refs.formRef.validate()
  if (!values.sortOrder) {
    values.sortOrder = 0
  }
  if (props.record.id) {
    values.id = props.record.id
    values.userInfoId = props.record.userInfoId
  }
  values.status = values.status ? 1 : 0
  emit('onSave', values)
}

function handleCancel() {
  handleClose()
}
</script>

<style lang="scss" scoped>
.createOrUpdate-menu {
  :deep(.ant-modal-header) {
    border-bottom: none;
  }
  :deep(.ant-modal-body) {
    padding: 0 0.24rem 0.2rem;
  }
  :deep(.ant-form) {
    display: flex;
    flex-wrap: wrap;
    background: rgb(240, 242, 245);
    padding: 0.15rem;

    .formItem-type-status {
      display: flex;
      width: 100%;

      .formItem-status {
        width: 35%;
      }
    }
    .ant-input-number {
      width: 100%;
    }
    .ant-form-item-label {
      width: 0.8rem;
    }
    .ant-form-item-control {
      width: calc(100% - 0.8rem);
    }

    .ant-form-item {
      width: 100%;
      margin-bottom: 0.15rem;
    }
    .ant-form-item-explain-error {
      display: none;
    }
  }
}
</style>
