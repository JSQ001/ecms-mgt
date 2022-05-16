<template>
  <Modal
    class="assignRole"
    title="分配权限"
    v-model:visible="_visible"
    width="40vw"
    cancelText="取消"
    :getContainer="$refs.recordForm"
    okText="保存"
    @ok="handleOk"
    @cancel="emit('update:visible', false)"
  >
    <Transfer
      v-model:target-keys="targetKeys"
      v-model:selected-keys="selectedKeys"
      :data-source="roleOptions"
      :one-way="true"
      :render="(item) => item.title"
      :disabled="disabled"
      :locale="{ itemUnit: '项', itemsUnit: '项', notFoundContent: '列表为空', searchPlaceholder: '请输入搜索内容' }"
    />
  </Modal>
</template>
<script lang="ts" setup>
import { computed, defineComponent, getCurrentInstance, ref, toRaw, toRefs, watch } from 'vue'
import { Transfer, Modal } from 'ant-design-vue'
import { commonSave, commonSearch } from '@/api/common'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'

const { proxy }: any = getCurrentInstance()

const emit = defineEmits(['update:visible', 'onSelect'])

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  defaultValue: {
    type: Array,
    default: () => []
  }
})

const roleOptions = ref([])

try {
  const {
    data: { code, data },
    status
  }: any = await commonSearch({ _moduleKey: 'role' })
  if (code === 200 && status === 200) {
    roleOptions.value = data.records.map((item: any) => ({
      key: item.id,
      title: item.roleName,
      description: item.roleName
    }))
  }
} catch (e) {
  console.log(e)
}

const _visible = computed({
  set: (val) => {
    emit('update:visible', val)
  },
  get: () => {
    return props.visible
  }
})

const disabled = ref<boolean>(false)

const targetKeys = ref<any>([])
const selectedKeys = ref([])

watch(
  () => props.defaultValue,
  (val) => {
    targetKeys.value = props.defaultValue
  }
)

async function handleOk() {
  emit('onSelect', toRaw(targetKeys.value))
}
</script>
<style scoped lang="scss">
.assignRole {
  .ant-transfer {
    display: flex;
    justify-content: center;
  }
}
</style>
