import ModalSelect from '@/components/modal-select/index.vue'
import { roleAssignPermission } from '@/api/role'
import { message } from 'ant-design-vue'
import { watch } from 'vue'

export default (props: any): unknown => {
  const propsOptions = {
    ...props,
    columns: [
      {
        title: '权限编码',
        dataIndex: 'permissionCode',
        formKey: 'permissionCode',
        showInForm: true
      },
      {
        title: '权限名称',
        dataIndex: 'permissionName'
      }
    ],
    requestOptions: {
      url: '/api/permission/list'
    },
    handleSave: async (data: any) => {
      const res = await roleAssignPermission({ roleId: props.record.id }, data)
      if (res.data.code === 200) {
        message.success('分配成功！')
        props['onUpdate:visible'](false)
      } else {
        message.error(res.data.message)
      }
      return res.data.code === 200
    }
  }

  return (
    <ModalSelect
      {...propsOptions}
      v-models={[
        [props.visible, 'visible'],
        [props.selectedRowKeys, 'selectedRowKeys']
      ]}
    />
  )
}
