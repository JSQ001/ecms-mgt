<template>
  <div class="audit" ref="audit">
    <Modal
      :title="props.title"
      :visible="props.visible"
      width="30vw"
      cancelText="取消"
      :getContainer="$refs.audit"
      okText="保存"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <Form ref="formRef" :model="formValue" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rulesRef">
        <Form.Item label="审核" name="state">
          <Select size="large" v-model:value="formValue.state" placeholder="请选择">
            <Select.Option :value="2">审核通过</Select.Option>
            <Select.Option :value="3">审核不通过</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  </div>
</template>
<script lang="tsx" setup>
import { Modal, Form, Select, message } from 'ant-design-vue'
import { getCurrentInstance, reactive, ref, watch } from 'vue'
import { auditArticle } from '@/api/common'
import { store } from '@/store'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: '文章审核'
  },
  auditData: {
    type: Array,
    required: true
  }
})

const { proxy }: any = getCurrentInstance()

const emit = defineEmits(['update:visible', 'afterAudit'])

const formValue = ref()

const rulesRef = reactive({
  state: [
    {
      required: true,
      message: '请选择'
    }
  ]
})

const labelCol = { style: { width: '1rem' } }
const wrapperCol = { span: 16 }

watch(
  () => props.visible,
  (val) => {
    formValue.value = {
      state: 2,
      auditComments: ''
    }
  }
)

async function handleOk() {
  const values = await proxy.$refs.formRef.validate()
  const params = {
    auditUserId: store.userInfo.id,
    articleIds: props.auditData,
    ...values
  }
  try {
    const res: any = await auditArticle(params)
    if (res.data.code === 200) {
      message.success('审核成功！')
      emit('update:visible', false)
      emit('afterAudit')
    } else {
      message.error('审核失败！' + res.data.message)
    }
  } catch (e) {
    console.log(e)
  }
}

function handleCancel() {
  emit('update:visible', false)
}
</script>
<style scoped lang="scss"></style>
