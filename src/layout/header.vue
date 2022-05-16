<template>
  <layout.Header class="header">
    <div style="display: flex">
      <MenuUnfoldOutlined v-if="store.isCollapsed" class="trigger mouseHandStyle" @click="handleClick" />
      <MenuFoldOutlined v-else class="trigger mouseHandStyle" @click="handleClick" />
      <Breadcrumb separator=">" style="margin-left: 20px">
        <Breadcrumb.Item>
          <router-link to="/">首页</router-link>
        </Breadcrumb.Item>
        <Breadcrumb.Item v-for="item in breadList" :key="item.path" :href="item.path">
          <router-link :to="item.redirect ? item.redirect : item.path">{{ item.name }}</router-link>
        </Breadcrumb.Item>
      </Breadcrumb>
    </div>

    <div class="right">
      <div class="tips" @click="handleLinkToPortal" style="margin-right: 15px; cursor: pointer">
        <HomeOutlined /> <span style="margin-left: 5px; margin-right: 15px">返回门户</span>

        <!--        <i class="mouseHandStyle icon iconfont icon-tixing-09"/>-->
        <!--        <div class="circle">{{tipsTotal}}</div>-->
      </div>

      <i class="mouseHandStyle icon iconfont icon-admin-08" />
      <span>{{ userInfo.realname }}</span>
      <Divider style="border-color: #707070" type="vertical" />
      <span class="loginOut" @click="handleLoginOut">{{ loginText }}</span>
    </div>
  </layout.Header>
</template>

<script lang="tsx" setup>
import { ref, computed, watchEffect } from 'vue'
import { Layout, Divider, Breadcrumb, Modal } from 'ant-design-vue'
import { store, setStore } from '@/store'
import { getList } from '@/utils'
import { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined, HomeOutlined, HomeFilled } from '@ant-design/icons-vue'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import { loginOut } from '@/api/user'
const { global_config } = window as any
const breadList = ref([])

function handleClick() {
  setStore({
    isCollapsed: !store.isCollapsed
  })
}
const route = useRoute()

const getBreadList = (routes: any) => {
  let routeList = routes.path.substring(1, routes.path.length)
  routeList = routeList.split('/')
  if (routeList.length === 1 && routeList[0] === '') {
    breadList.value = []
    return
  }
  let list: any = []
  getList(store.userInfo.menuList, 2).forEach((item: any) => {
    if (item.path === '/' + routeList[0]) {
      list.push(item)
      if (routeList.length !== 1 && item.children) {
        item.children.forEach((items: any) => {
          if (items.path === '/' + routeList[0] + '/' + routeList[1]) {
            list.push(items)
          }
          if (items.children && routeList.length !== 2) {
            items.children.forEach((items2: any) => {
              if (items2.path === routes.path) {
                list.push(items2)
              }
            })
          }
        })
      }
    }
  })
  breadList.value = list
}
onBeforeRouteUpdate((next) => {
  getBreadList(next)
})
watchEffect(() => {
  getBreadList(route)
})

//
// watchEffect(()=>{
//   if(!store.menuList.length) return
//   const list = []
//   const current = store.menuList.find(item => item.url === route.path)
//   if(!current) return;
//   const urlList = current.xpath.split("/")
//   urlList.forEach(item=>{
//     if(item){
//       const temp = store.menuList.find(i=> i.id == item)
//       if(temp){
//         list.push(temp)
//       }
//     }
//   })
//   breadList.value = list
// })

const userInfo = computed(() => store.userInfo || {})
const tipsTotal = ref(3)

const loginText = computed(() => (!store.userInfo.id ? '登录' : '退出登录'))

function handleLinkToPortal() {
  window.open(global_config.EPORTAL_WEB)
  return
  Modal.confirm({
    content: <span style={{ fontSize: '.16rem' }}>前往门户?</span>,
    okText: '确认',
    cancelText: '取消',
    onOk: () => {}
  })
}

async function handleLoginOut() {
  store.token = ''
  store.userInfo = {}
  localStorage.removeItem('ecms_token')
  await loginOut()
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.ant-layout-header {
  background: #fff;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.15rem;
  color: #2c3e50;
  font-size: 0.14rem;

  .anticon-menu-fold {
    font-size: 0.2rem;
  }

  .trigger:hover {
    color: rgba(23, 138, 244, 0.992);
    transition: 0.2s color ease;
    cursor: pointer;
  }

  i {
    font-size: 0.2rem;
  }

  #components-layout-demo-custom-trigger .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.3);
    margin: 16px;
  }

  .right {
    height: 100%;
    display: flex;
    align-items: center;
    color: #9f9f9f;

    .tips {
      position: relative;

      .anticon-home {
        font-size: 0.22rem;
      }
      .circle {
        position: absolute;
        top: 0.21rem;
        right: -0.06rem;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 0.13rem;
        height: 0.13rem;
        border-radius: 50%;
        background: #ffb917;
        color: #222222;
        font-size: 0.07rem;
      }
    }

    .loginOut {
      cursor: pointer;
    }

    i {
      color: #c22400;

      &:nth-child(2) {
        margin: 0 0.06rem 0 0.12rem;
      }
    }
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
</style>
