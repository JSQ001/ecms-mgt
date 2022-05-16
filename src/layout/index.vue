<template>
  <Suspense>
    <template #default>
      <Layout>
        <Side />
        <Layout class="layoutRight">
          <Header />
          <Layout.Content class="appMain">
            <router-view />
            <!--            <router-view v-slot="{ Component }">-->
            <!--              <transition name="fade-transform" mode="out-in">-->
            <!--                <component :is="Component" />-->
            <!--&lt;!&ndash;                <keep-alive>&ndash;&gt;-->
            <!--&lt;!&ndash;                 &ndash;&gt;-->
            <!--&lt;!&ndash;                </keep-alive>&ndash;&gt;-->
            <!--              </transition>-->
            <!--            </router-view>-->
          </Layout.Content>
        </Layout>
      </Layout>
    </template>
    <template #fallback>
      <Loading />
    </template>
  </Suspense>
</template>
<script lang="ts" setup>
import { onErrorCaptured, ref, defineAsyncComponent, computed, toRaw } from 'vue'
import { Layout } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const Header = defineAsyncComponent(() => import('@/layout/header.vue'))
const Loading = defineAsyncComponent(() => import('@/components/loading.vue'))
const Side = defineAsyncComponent(() => import('@/layout/side/index.vue'))

onErrorCaptured((err) => {
  console.log(err)
})
// @ts-ignore
const key = computed(() => toRaw(route).path.value)
const cachedViews = []
</script>
<style scoped lang="scss">
.ant-layout {
  .appMain {
    height: calc(100vh - 0.64rem);
    position: relative;
    width: 100%;
    padding: 0.24rem;
    overflow: auto;
  }
}

#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

.logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.3);
  margin: 16px;
}

.site-layout .site-layout-background {
  background: #fff;
}
</style>
