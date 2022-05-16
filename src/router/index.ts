import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { store } from '@/store'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import path from 'path'
import { getToken, login, validate } from '@/api/user'

const requireAllVueComponents = require.context('@/views', true, /\.vue$/, 'lazy')
const layoutChildren: Array<RouteRecordRaw> = []

requireAllVueComponents.keys().forEach((allVueComponentItem) => {
  if (allVueComponentItem.split(path.sep).includes('components')) return
  // console.log(allVueComponentItem)

  if (!allVueComponentItem.match(/\.vue$/g)) return
  // 设置不需要加入layout的路径
  if (['./404.vue', './login/index.vue'].includes(allVueComponentItem)) return

  let url = allVueComponentItem.replace('.', '').replace(/\.vue$/g, '')
  const urlList = url.split(path.sep)
  if (urlList[urlList.length - 1] === 'index') {
    urlList.pop()
    url = urlList.join(path.sep)
  }
  if (url) {
    layoutChildren.push({
      path: url,
      component: () =>
        requireAllVueComponents(allVueComponentItem).default || requireAllVueComponents(allVueComponentItem)
    })
  }
  // const pathList = allVueComponentItem.split(path.sep)
})

const router = createRouter({
  history: createWebHashHistory(),
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
  // debugger
  // alert(123123)
  console.log(error)
  const pattern = /Loading chunk (\d)+ failed/g
  const isChunkLoadFailed = error.message.match(pattern)
  // const targetPath = router.history.pending.fullPath
  // console.log(targetPath)
  // if (isChunkLoadFailed) {
  //   router.replace(targetPath)
  // }
})

router.beforeEach(async (to, from) => {
  return true
  // ...
  // 返回 false 以取消导航
  if (!store.token) {
    try {
      return await validate()
    } catch (e) {}
    //getToken();
    return false
  }

  return true
})

export default router
