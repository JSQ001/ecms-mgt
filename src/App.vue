<template>
  <ConfigProvider :locale="zhCN">
    <router-view />
  </ConfigProvider>
</template>
<script setup>
import { Transfer, Modal, message, ConfigProvider } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
</script>
