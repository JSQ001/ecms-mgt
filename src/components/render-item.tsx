import { Menu, Tooltip, Input } from 'ant-design-vue'

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  MailOutlined,
  DesktopOutlined,
  InboxOutlined,
  AppstoreOutlined
} from '@ant-design/icons-vue'
interface MenuItemProps {
  id: string
  name: string
  iconClass: string
  type: string
  code: string
  width: string
  height: string
  path?: string
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  children?: Array<MenuItemProps>
}

interface RenderMenuProps {
  field: MenuItemProps
}

export default (props: RenderMenuProps): unknown => {
  const {
    field: { type, code, width, height, name, url }
  }: any = props

  switch (String(type)) {
    //自定义组件
    case 'input':
    default:
      return <Input />
  }
}
