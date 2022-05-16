<template>
  <div class="audit" ref="audit">
    <Modal
      :title="props.title"
      :visible="props.visible"
      width="24vw"
      cancelText="取消"
      centered
      :getContainer="$refs.audit"
      :maskClosable="false"
      okText="保存"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <Form ref="formRef" :model="formValue" :rules="rulesRef">
        <Form.Item label="栏目" name="targetId">
          <TreeSelect
            placeholder="请选择栏目"
            v-model:value="formValue.targetId"
            show-search
            style="width: 100%"
            :dropdownMatchSelectWidth="false"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            allow-clear
            tree-default-expand-all
            :tree-data="props.columnList"
            :fieldNames="{ label: 'catalogName', value: 'id' }"
          />
        </Form.Item>
      </Form>
    </Modal>
  </div>
</template>
<script lang="tsx" setup>
import { Modal, Form, Input, Select, TreeSelect, message } from 'ant-design-vue'
import { getCurrentInstance, reactive, ref, watch } from 'vue'
import { store } from '@/store'
import { moveColumn } from '@/api/column'

const { proxy }: any = getCurrentInstance()

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  columnList: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: '栏目移动'
  },
  moveData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:visible', 'save'])
const formValue = ref()

const rulesRef = reactive({
  targetId: [
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
      targetId: '',
      columnCode: ''
    }
  },
  {
    deep: true
  }
)

async function handleOk() {
  const params = {
    parentId: formValue.value.targetId,
    id: props.moveData.id
  }
  if (formValue.value.targetId == props.moveData.id) {
    message.error('不能移动到自身！')
    return
  }
  try {
    const res: any = await moveColumn(params)
    if (res.data.code === 200) {
      message.success('移动成功！')
      emit('update:visible', false)
      emit('save')
    } else {
      message.error('移动失败！' + res.data.message)
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
