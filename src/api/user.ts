import request from '@/utils/request'
import { store } from '@/store'
import { Modal } from 'ant-design-vue'
const { global_config } = window as any

export async function userMallocRole(params: any, data: any) {
  return request({
    url: `/api/user/alloc-role`,
    method: 'post',
    params,
    data
  })
}

export async function getUserResource() {
  return request({ url: `/api/user/resource` })
}

export async function isLogin() {
  const token = localStorage.getItem('ecms_token')
  if (token) {
    store.token = token
    return true
  }
  if (/^(\?code=)[a-zA-Z0-9]{6}$/.test(location.search)) {
    const list = location.search.split('=')
    if (list.length < 1) return false
    const token = await getToken(list[1])
    if (token) {
      store.token = token
      return true
    }
  } else {
    ssoLogin()
  }
  return false
}

export async function getToken(code: String) {
  const res: any = await request({ url: `/api/oauth/getToken?code=${code}` })
  if (res.data.code === 200 && res.data.data) {
    localStorage.setItem('ecms_token', res.data.data)
    return res.data.data
  }
}

export async function validate() {
  if (store.token) return true
  if (/^(\?code=)[a-zA-Z0-9]{6}$/.test(location.search)) {
    const list = location.search.split('=')
    if (list.length < 1) {
      return false
    }
    //通过code获取token
    let flag = await getToken1(list[1])
    // @ts-ignore
    if (!flag) return false
  } else {
    const token = localStorage.getItem('eportal_token')
    const userInfo = localStorage.getItem('userInfo')
    if (token) {
      try {
        store.token = token
        store.userInfo = userInfo
        //拿到token后去除
        return true
      } catch (e) {
        console.log(e)
      }
    } else {
      login()
    }
  }
  return false
}

export async function getToken1(code: String) {
  const res: any = await request({ url: `/api/oauth/getToken?code=${code}` })
  debugger
  if (res.data.code === 200) {
    try {
      if (res.data.data.indexOf('error') !== -1) {
        let result = JSON.parse(res.data.data)
        await Modal.confirm({
          content: `认证失败，${result.error_description},点击确定前往登录页`,
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            window.open(`${global_config.BASE_URL}/oauth/login`, '_parent')
          }
        })
        return false
      } else {
        localStorage.setItem('eportal_token', res.data.data.access_token)
        localStorage.setItem('userInfo', res.data.data.userinfo)
        window.open(location.href.replace(/(\?code=)[a-zA-Z0-9]{6}/, ''), '_parent')
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export function ssoLogin() {
  window.open(global_config.BASE_URL + `/oauth/login`, '_parent')
}

export function login() {
  window.open(global_config.BASE_URL + `/oauth/login`, '_parent')
}

export function loginOut() {
  // @ts-ignore
  store.token = null
  window.open(global_config.BASE_URL +`/oauth/loginOut`, '_parent')
}
