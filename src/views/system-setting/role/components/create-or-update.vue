<template>
  <div class="createOrUpdateRole" ref="recordForm">
    <Modal
      class="createRoleModal"
      :title="title"
      :visible="props.visible"
      width="40vw"
      cancelText="取消"
      :getContainer="$refs.recordForm"
      okText="保存"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <Form :model="props.record" ref="formRef" :rules="rulesRef">
        <Row type='flex' :gutter='15'>
          <Col :span='12'>
            <FormItem label="角色代码" name="roleCode">
              <Input :disabled="disabled" v-model:value="props.record.roleCode" placeholder="请输入角色代码" />
            </FormItem>
          </Col>
          <Col :span='12'>
            <FormItem label="角色名称" name="roleName">
              <Input v-model:value="props.record.roleName" placeholder="请输入角色名称" />
            </FormItem>
          </Col>
          <Col :span='12'>
            <FormItem label="角色顺序" name="sortOrder">
              <InputNumber v-model:value="props.record.sortOrder" placeholder="请输入角色顺序" />
            </FormItem>
          </Col>
          <Col :span='12'>
            <FormItem label="角色状态" name="enabled">
              <Radio.Group v-model:value="props.record.enabled" name="radioGroup">
                <Radio :value="true">启用</Radio>
                <Radio :value="false">禁用</Radio>
              </Radio.Group>
            </FormItem>
          </Col>

        </Row>
      </Form>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRaw, watch, getCurrentInstance, ref, computed } from 'vue'

import { Modal, Form, Button, InputNumber,Radio, Switch, Select, Row, Col, Input } from 'ant-design-vue'
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
  }
})

const title = computed(() => (props.record.id ? '编辑角色' : '添加角色'))

watch(
  () => props.visible,
  (val) => {
    if (val) {
      props.record.enabled = typeof props.record.enabled != 'undefined' ? props.record.enabled : true
    }
  }
)

const disabled = computed(() => !!props.record.id)

const rulesRef = reactive({
  roleCode: [
    {
      required: true,
      message: '请输入角色代码'
    }
  ],
  roleName: [
    {
      required: true,
      message: '请输入角色名称'
    }
  ]
})

function handleClose() {
  emit('update:visible', false)
}

async function handleOk() {
  const values = await proxy.$refs.formRef.validate()
  if (props.record.id) {
    values.id = props.record.id
  }
  emit('onSave', values)
}

function handleCancel() {
  handleClose()
}
</script>

<style lang="scss" scoped>
.createOrUpdateRole {
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

.ant-modal-footer {
}
</style>
