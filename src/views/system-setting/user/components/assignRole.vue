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
      <Form ref="formRef" :model="formValue" :rules="rulesRef">
        <Form.Item label="角色" name="roleId">
          <Select v-model:value="formValue.roleId" mode="multiple" size="large" placeholder="请选择角色">
            <Select.Option v-for="item in roleList" :value="item.id">{{ item.roleName }}</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  </div>
</template>
<script lang="tsx" setup>
import { Modal, Form, Input, Select, TreeSelect, message } from 'ant-design-vue'
import { computed, getCurrentInstance, onMounted, reactive, ref, watch, watchEffect } from 'vue'
import { commonSearch } from '@/api/common'
import { store } from '@/store'
import { userMallocRole } from '@/api/user'
import { queryAllRole } from '@/api/role'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: '分配角色'
  },
  record: {
    type: Object,
    required: true
  }
  // data: {
  //   type: Array,
  //   required: true
  // }
})

const { proxy }: any = getCurrentInstance()

const emit = defineEmits(['update:visible', 'save'])

const roleList = ref([])

const formValue = ref({
  roleId: []
})

const rulesRef = reactive({
  roleId: [
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
      roleId: props.record.roleId || []
    }
  }
)

onMounted(() => {
  search()
})

async function search() {
  const res = await queryAllRole()
  roleList.value = res.data.data
}

async function handleOk() {
  const values = await proxy.$refs.formRef.validate()
  try {
    const res: any = await userMallocRole({ userId: props.record.id }, values.roleId)
    if (res.data.code === 200) {
      message.success('分配成功！')
      emit('update:visible', false)
      emit('save')
    } else {
      message.error('分配失败！' + res.data.message)
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
