<template>
  <Menu.SubMenu :key="props.menuInfo.path">
    <template #icon>
      <i :class="`icon iconfont icon-${props.menuInfo.icon}`"/>
    </template>
    <template #title>{{ props.menuInfo.name }}</template>
    <template v-for="item in props.menuInfo.children" :key="item.path">
      <template v-if="!item.children||item.hiddenChildren">
        <Menu.Item @click="router.push(item.path || '/')" :key="item.path">
          <template #icon>
            <span><i :class="`icon iconfont icon-${item.icon}`"/></span>
          </template>
          {{ item.name }}
        </Menu.Item>
      </template>
      <template v-else>
        <SubMenu :menu-info="item" :key="item.path"/>
      </template>
    </template>
  </Menu.SubMenu>
</template>

<script setup lang="ts">
import {Menu} from 'ant-design-vue'
import SubMenu from './sub-menu.vue'
import { PieChartFilled} from '@ant-design/icons-vue'
import {useRouter} from "vue-router";
const router = useRouter()
const props = defineProps({
  menuInfo: {
    type: Object
  }
})
</script>