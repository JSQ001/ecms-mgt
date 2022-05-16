<template>
  <div class="audit" ref="audit">
    <Modal
      :title="props.title"
      :visible="props.visible"
      width="32vw"
      cancelText="取消"
      centered
      :getContainer="$refs.audit"
      okText="保存"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <Form ref="formRef" :model="formValue" :rules="rulesRef" :label-col="{ style: { width: '100px' } }">
        <Form.Item label="新密码" name="newPassword">
          <Input.Password v-model:value="formValue.pwd" size="large" placeholder="请输入" />
        </Form.Item>
        <Form.Item label="确认新密码" name="newPwd">
          <Input.Password v-model:value="formValue.newPwd" size="large" placeholder="请输入" />
        </Form.Item>
      </Form>
    </Modal>
  </div>
</template>
<script lang="tsx" setup>
import { Modal, Form, Input, Select, TreeSelect, message } from 'ant-design-vue'
import { computed, getCurrentInstance, reactive, ref, watch, watchEffect } from 'vue'
import { store } from '@/store'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: '修改密码'
  }
})

const { proxy }: any = getCurrentInstance()

const emit = defineEmits(['update:visible', 'save'])

const formValue = ref({
  pwd: '',
  newPwd: ''
})

const rulesRef = reactive({
  parentId: [
    {
      required: true,
      message: '请选择'
    }
  ]
})

watch(
  () => props.visible,
  (val) => {
    formValue.value = {
      pwd: '',
      newPwd: ''
    }
  }
)

async function handleOk() {
  const values = await proxy.$refs.formRef.validate()
  // try{
  //   const res:any = await auditArticle(params)
  //   if(res.data.code === 200){
  //     message.success("审核成功！")
  //     emit('update:visible', false)
  //     emit('afterAudit')
  //   }else {
  //     message.error("审核失败！"+ res.data.message)
  //   }
  // }catch (e){
  //   console.log(e)
  // }
}

function handleCancel() {
  emit('update:visible', false)
}
</script>
<style scoped lang="scss"></style>
