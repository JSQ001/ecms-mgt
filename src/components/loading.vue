<template>
  <Spin size="large" />
</template>
<script lang="ts" setup>
import { Spin } from 'ant-design-vue'
</script>
<style scoped lang="scss">
.ant-spin {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  font-size: 0.5rem;
}
</style>
