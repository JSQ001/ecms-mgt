import 'core-js/stable'
import 'regenerator-runtime/runtime'
import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import { getRouter } from './router/dynamicRouter'
import '@/styles/index.scss'

import VueUeditorWrap from 'vue-ueditor-wrap'
import { store } from '@/store'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { getUserResource, isLogin } from '@/api/user'
dayjs.locale('zh-cn')
;(async function () {
  if (await isLogin()) {
    const res = await getUserResource()
    const router = getRouter(res.data.data.menuList)
    if (res.data.code === 200) {
      store.userInfo = res.data.data
      createApp(App).use(router).use(VueUeditorWrap).mount('#app')
    }
  }
})()
