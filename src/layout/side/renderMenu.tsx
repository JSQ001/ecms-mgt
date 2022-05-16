import { Menu, Tooltip } from 'ant-design-vue'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  MailOutlined,
  DesktopOutlined,
  InboxOutlined,
  AppstoreOutlined,
} from '@ant-design/icons-vue';
interface MenuItemProps {
  id: string;
  name: string;
  iconClass: string;
  path?: string;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  children?: Array<MenuItemProps>;
}

interface RenderMenuProps {
  field: MenuItemProps;
}

export default (props: RenderMenuProps): unknown => {
  const { field } = props
  function render (params: MenuItemProps) {
    const {
      id,
      path,
      name,
      children,
      iconClass
    } = params
    if (children && children.length) {
        return (
        <Menu.SubMenu
          key={path}
          class="subMenu"
          v-slots={{
            icon: () =>  <i class={`icon iconfont ${iconClass}`}/>,
            title: () => <span>{name}</span>
          }}
        >
          {children.map(item => render(item))}
        </Menu.SubMenu>
      )
    } else {
      return (
        <router-link to={path || '/'}>
          <Menu.Item
            class="menuItem"
            key={path}
            v-slots={{
                icon: () =>  <i class={`icon iconfont ${iconClass}`}/>,
                title: () => <span>{name}</span>
            }}
          >
           <span>{name}</span>
          </Menu.Item>
        </router-link>
      )
    }
  }

  return render(field)
}
