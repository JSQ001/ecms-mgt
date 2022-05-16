<template>
  <Menu.SubMenu v-if="field.children&&field.children.length">
    <template #icon>
      <PieChartOutlined />
    </template>
    <template #title>
      <span>{{field.name}}</span>
    </template>
    <RenderMenu v-for="item in field.children" :field="item" :key="item.id" />
  </Menu.SubMenu>
  <Menu.Item v-else>
    <span>{{field.name}}</span>
  </Menu.Item>
</template>
<script setup lang="ts">
import { Menu} from 'ant-design-vue'
import RenderMenu from './renderMenu1.vue'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  MailOutlined,
  DesktopOutlined,
  InboxOutlined,
  AppstoreOutlined,
} from '@ant-design/icons-vue';

defineProps({
  field: {
    type: Object,
    required: true
  },
})
</script>
