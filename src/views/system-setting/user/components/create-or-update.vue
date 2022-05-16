<template>
  <div class="createOrUpdate" ref="recordForm">
    <Modal
      class="createUserModal"
      :title="title"
      :visible="props.visible"
      width="60vw"
      cancelText="取消"
      :getContainer="$refs.recordForm"
      okText="保存"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <Form :model="props.record" ref="formRef" :rules="rulesRef" :label-col="{ style: { width: '100px' } }">
        <FormItem label="用户名" name="username">
          <Input size="large" :disabled="disabled" v-model:value="props.record.username" placeholder="请输入" />
        </FormItem>
        <!--        <FormItem label="密码" name="pwd">-->
        <!--          <Input.Password v-model:value="props.record.pwd" size="large" placeholder="请输入"/>-->
        <!--        </FormItem>-->
        <!--        <FormItem label="确认密码" name="confirmPwd">-->
        <!--          <Input.Password v-model:value="props.record.confirmPwd" size="large" placeholder="请输入"/>-->
        <!--        </FormItem>-->
        <FormItem label="角色" name="roleList">
          <Select mode="multiple" v-model:value="props.record.roleList" size="large" placeholder="请选择">
            <Select.Option v-for="item in roleOptions" :key="item.id" :value="item.id">{{
              item.roleName
            }}</Select.Option>
          </Select>
        </FormItem>
        <FormItem label="联系方式" name="contact">
          <Input v-model:value="props.record.contact" size="large" placeholder="请输入" />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { reactive, toRaw, ref, computed, getCurrentInstance, watch } from 'vue'
import { Modal, Form, Button, InputNumber, Select, Input } from 'ant-design-vue'
import { commonSearch } from '@/api/common'

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

const roleOptions = ref([])
try {
  const {
    data: { code, data },
    status
  }: any = await commonSearch({ _moduleKey: 'role' })
  if (status === 200 && code === 200) {
    roleOptions.value = data.records
  }
} catch (e) {
  console.log(e)
}

const state = reactive({})

const title = computed(() => (props.record.id ? '编辑用户' : '添加用户'))
const disabled = computed(() => !!props.record.id)

const rulesRef = reactive({
  username: [
    {
      required: true,
      message: '请输入用户名'
    }
  ],
  password: [
    {
      required: true,
      message: 'Please select region'
    }
  ],
  type: [
    {
      required: true,
      message: 'Please select type',
      type: 'array'
    }
  ]
})

watch(
  () => props.visible,
  (val) => {
    if (val) {
      if (props.record.roleList && props.record.roleList.length) {
        props.record.roleList = props.record.roleList.map((i: any) => i.id)
      }
    }
  }
)

function handleCancel() {
  emit('update:visible', false)
}

async function handleOk() {
  const values = await proxy.$refs.formRef.validate()
  if (props.record.id) {
    values.id = props.record.id
    values.userInfoId = props.record.userInfoId
  }
  values.roleList = values.roleList.length ? values.roleList.map((i: any) => ({ id: i })) : null

  emit('onSave', values)
}
</script>

<style lang="scss">
.createOrUpdate {
  .createUserModal {
    .ant-form {
      padding: 0.1rem 1rem;
      .ant-form-item-label {
        width: 0.72rem !important;
      }
    }
  }
}

.ant-modal-footer {
}
</style>
