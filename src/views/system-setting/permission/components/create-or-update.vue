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
        <FormItem label="权限代码" name="permissionCode">
          <Input size="large" :disabled="disabled" v-model:value="props.record.permissionCode" placeholder="请输入" />
        </FormItem>
        <FormItem label="权限名称" name="permissionName">
          <Input size="large" v-model:value="props.record.permissionName" placeholder="请输入" />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRaw, watch, getCurrentInstance, ref, computed } from 'vue'

import { Modal, Form, Button, InputNumber, Select, Row, Col, Input } from 'ant-design-vue'

const FormItem = Form.Item
const useForm = Form.useForm

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

const title = computed(() => (props.record.id ? '编辑权限' : '添加权限'))

const disabled = computed(() => !!props.record.id)

const rulesRef = reactive({
  permissionCode: [
    {
      required: true,
      message: '请输入权限代码'
    }
  ],
  permissionName: [
    {
      required: true,
      message: '请输入权限名称'
    }
  ]
})

function handleCancel() {
  emit('update:visible', false)
}

async function handleOk() {
  const values = await proxy.$refs.formRef.validate()
  if (props.record.id) {
    values.id = props.record.id
  }
  emit('onSave', values)
}
</script>

<style lang="scss">
.createOrUpdateRole {
  .createRoleModal {
    .ant-form {
      padding: 0.1rem 1rem;
      .ant-form-item-label {
        width: 0.8rem !important;
      }
    }
  }
}

.ant-modal-footer {
}
</style>
