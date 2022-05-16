<template>
  <Modal
    class="menu-authority"
    :title="title"
    :visible="props.visible"
    width="6rem"
    :maskClosable="false"
    maskTransitionName=""
    cancelText="取消"
    :ok-button-props="{ loading }"
    destroyOnClose
    okText="保存"
    @ok="handleOk"
    @cancel="handleClose"
  >
    <Row>
      <Col :span="8" :offset="1" class="left">
        <Descriptions title="" :column="1">
          <Descriptions.Item v-for="item in fieldsList" :label="item.label">{{
            props.record[item.key]
          }}</Descriptions.Item>
        </Descriptions>
      </Col>
      <Col :span="14" :offset="1">
        <Form :model="props.record" ref="formRef" :rules="rulesRef">
          <FormItem label="" class="formItem-row" name="menuList">
            <Tree
              v-model:checkedKeys="selectedKeys"
              defaultExpandAll
              :expandAction="false"
              @check="getCheck"
              checkable
              :fieldNames="fieldNames"
              :tree-data="menuList"
            >
              <template #switcherIcon><DownOutlined @click="handleClick" /></template>
            </Tree>
          </FormItem>
        </Form>
      </Col>
    </Row>
  </Modal>
</template>

<script setup lang="tsx">
import { reactive, toRaw, ref, computed, getCurrentInstance, onMounted, watch } from 'vue'
import {
  Modal,
  Form,
  Tree,
  Descriptions,
  Row,
  Col,
  Switch,
  Divider,
  Button,
  Select,
  Input,
  message
} from 'ant-design-vue'
import { resetSort } from '@/utils'
import { commonSearch } from '@/api/common'
import { DownOutlined } from '@ant-design/icons-vue'
import FormTree from '@/components/form-tree.vue'
import { queryMenuByRoleId, queryMenuTree } from '@/api/menu'
import { roleAssignMenu, roleAssignPermission } from '@/api/role'

const FormItem = Form.Item
const { proxy }: any = getCurrentInstance()

const emit = defineEmits(['update:visible', 'afterSave'])

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  record: {
    type: Object,
    required: true
  },
  selectedMenuKeys: {
    type: Array,
    default: () => []
  }
})

//菜单数据
const menuList = ref([])
const loading = ref(false)
const fieldNames = { title: 'menuName', key: 'id' }
const expandedKeys = ref<string[]>([])
const selectedKeys = ref<any[]>([])
const halfCheckedKeys = ref<any>([])
onMounted(() => {
  getMenuData()
})

function getList(data: any) {
  const list: any = []
  const selectKeys: any = []
  const halfKeys: any = []
  data.forEach((item: any) => {
    if (!item.parentId) {
      list.push(item)
    } else {
      selectKeys.push(item.id)
    }
  })
  list.forEach((item: any) => {
    let children = data.filter((data: any) => String(item.id) === String(data.parentId))
    if (children.length !== 0) {
      halfKeys.push(item.id)
    } else {
      selectKeys.push(item.id)
    }
  })
  return { halfKeys, selectKeys }
}

function getCheck(keys: any, e: any) {
  console.log(e)
  halfCheckedKeys.value = e.halfCheckedKeys
  console.log(keys, e)
}

async function getMenuData() {
  const res: any = await queryMenuTree()
  menuList.value = resetSort(res.data.data)
}

const title = computed(() => {
  return (
    <div class="customTitle">
      <div class="tips" />
      <span>分配菜单</span>
    </div>
  )
})
const fieldsList = [
  { key: 'roleCode', label: '角色编码' },
  { key: 'roleName', label: '角色名称' }
]

const rulesRef = reactive({
  code: [{ required: true }]
})

watch(
  () => props.visible,
  async () => {
    if (props.visible) {
      const res = await queryMenuByRoleId(props.record.id)
      let list: any = getList(res.data.data)
      selectedKeys.value = list.selectKeys
      halfCheckedKeys.value = list.halfKeys
    }
  }
)

function handleClose() {
  emit('update:visible', false)
}

async function handleOk() {
  const res = await roleAssignMenu({ roleId: props.record.id }, [...selectedKeys.value, ...halfCheckedKeys.value])
  if (res.data.code === 200) {
    message.success('分配成功！')
    emit('update:visible', false)
  } else {
    message.error(res.data.message)
  }
}

function handleClick(e: any) {
  e.stopPropagation()
  e.preventDefault()
}
</script>

<style scoped lang="scss">
.menu-authority {
  .left {
    border-right: 1px solid #f0f0f0;
  }
}
</style>
