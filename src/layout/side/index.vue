<template>
  <Layout.Sider v-model:collapsed="store.isCollapsed" :trigger="null" collapsible>
    <div class="logo">
      <i class="icon iconfont icon-wujiaoxing-01" />
      <span :class="titleClass" v-if="!store.isCollapsed">信息发布系统</span>
    </div>
    <Menu
      class="myMenu"
      mode="inline"
      v-model:selectedKeys="selectedKeys"
      v-model:openKeys="openKeys"
      :collapsed="store.isCollapsed"
    >
      <template v-for="item in menuList" :key="item.path">
        <template v-if="!item.children || item.hiddenChildren">
          <Menu.Item @click="router.push(item.path || '/')" :key="item.path">
            <template #icon>
              <span><i :class="`icon iconfont icon-${item.icon}`" /></span>
            </template>
            {{ item.name }}
          </Menu.Item>
        </template>
        <template v-else>
          <SubMenu :key="item.path" :menu-info="item" />
        </template>
      </template>
      <!--      <RenderMenu v-for="item in menuList" :field="item" :key="item.path" />-->
    </Menu>
  </Layout.Sider>
</template>

<script lang="ts" setup>
import { defineComponent, computed, onMounted, ref, watch, toRaw } from 'vue'
import { Layout, Menu } from 'ant-design-vue'
import { store } from '@/store'
import { getList } from '@/utils'
// import { routerList } from '@/router'
// @ts-ignore
import SubMenu from './sub-menu'

import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
const route = useRoute()
const router = useRouter()
const visible = ref(false)
import RenderMenu from './renderMenu'

//const menuList = ref(store.menuList)
const menuList = computed(() => {
  return getList(store.userInfo.menuList)
})

const titleClass = ref('')

const selectedKeys = ref<string[]>([])

const openKeys = ref<string[]>([])

watch(
  () => store.isCollapsed,
  (val) => {
    titleClass.value = !val ? 'animate__animated animate__fadeIn animate__delay-0.2s' : ''
  }
)

try {
  let values: any = toRaw(route).path
  selectedKeys.value = [values.value]
  const currentPathList = values.value.split('/')
  openKeys.value = [currentPathList.slice(0, currentPathList.length - 1).join('/')]
} catch (e) {
  console.log(e)
}
onBeforeRouteUpdate((next) => {
  try {
    selectedKeys.value = [next.path]
    const currentPathList = next.path.split('/')
    openKeys.value = [currentPathList.slice(0, currentPathList.length - 1).join('/')]
  } catch (e) {
    console.log(e)
  }
})

function getSelectedKeys(path: any, list: any) {
  for (let i = 0; i < list.length; i++) {
    //将父节点放入openKeys
    if (openKeys.value.includes(list[i].id) && list[i].parentId) {
      openKeys.value.unshift(list[i].parentId)
    }
    if (list[i].path === path) {
      selectedKeys.value = [list[i].id]
      openKeys.value = [list[i].parentId]
      break
    } else {
      list[i].children && getSelectedKeys(path, list[i].children)
    }
  }
}
</script>

<style lang="scss">
@import '~@/styles/variables.scss';

.ant-layout-sider {
  background: none;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 0.64rem;
  font-size: 0.2rem;
  overflow: hidden;
  margin: 0 1px 0 0;
  background: $logoBg;
  color: white;

  i {
    font-size: 0.3rem;
  }
  span {
    margin-left: 0.1rem;
  }
}
//ant-menu
.myMenu {
  height: calc(100% - 0.64rem);
  background-image: url('~@/assets/images/BG.png');
  background-repeat: no-repeat;
  background-color: $menuBg !important;
  background-size: 100%;
  background-position: bottom;
}
.ant-menu {
  background-color: $menuBg !important;
}

.ant-menu-submenu-title,
.ant-menu-item {
  color: $menuColor;

  &:hover {
    background: $subMenuHoverBg;
    color: $subMenuHoverColor !important;

    .ant-menu-submenu-arrow {
      color: $subMenuHoverColor !important;
    }
  }
}

.ant-menu-submenu-arrow {
  color: $menuColor !important;
}

.ant-menu-item-selected {
  color: $subMenuSelectedColor;
}
.ant-menu-inline .ant-menu-item::after {
  border-right: 1px solid red;
}
</style>
