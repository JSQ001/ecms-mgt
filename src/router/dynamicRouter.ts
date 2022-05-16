import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router'
import { store } from '@/store'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import path from 'path'

export function getRouter(list: Array<any>) {
  const pathSet = new Set(list.map((item) => item.path))

  const requireAllVueComponents = require.context('@/views', true, /\.vue$/, 'lazy')
  const layoutChildren: Array<RouteRecordRaw> = []

  requireAllVueComponents.keys().forEach((allVueComponentItem) => {
    if (allVueComponentItem.split(path.sep).includes('components')) return

    if (!allVueComponentItem.match(/\.vue$/g)) return
    // 设置不需要加入layout的路径
    if (['./404.vue', './login/index.vue'].includes(allVueComponentItem)) return

    let url = allVueComponentItem.replace('.', '').replace(/\.vue$/g, '')
    const urlList = url.split(path.sep)
    if (urlList[urlList.length - 1] === 'index') {
      urlList.pop()
      url = urlList.join(path.sep)
    }
    if (url && pathSet.has(url)) {
      layoutChildren.push({
        path: url,
        component: () =>
          requireAllVueComponents(allVueComponentItem).default || requireAllVueComponents(allVueComponentItem)
      })
    }
  })
  const router = createRouter({
    history: createWebHashHistory(),
    //history: createWebHistory("ecms-mgt"),
    routes: [
      {
        path: '/',
        name: 'Home',
        component: () => import('@/layout/index.vue'),
        children: [
          {
            path: '/',
            component: () => import('@/views/index.vue')
          },
          ...layoutChildren
        ]
      },
      {
        path: '/:pathMatch(.*)*',
        name: 'notFound',
        redirect: '/'
      }
    ]
  })

  router.onError((error) => {
    console.log(error)
    const pattern = /Loading chunk (\d)+ failed/g
    const isChunkLoadFailed = error.message.match(pattern)
  })

  router.beforeEach(async (to, from) => {
    return true
  })
  return router
}
