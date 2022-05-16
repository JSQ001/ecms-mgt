<template>
  <div>
    {{ result }}
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  async setup() {
    // promise 语法糖  返回之后也是promise对象
    const result = await new Promise((resolve) => {
      setTimeout(() => resolve(123), 2000)
    })

    return {
      result
    }
  }
})
</script>
