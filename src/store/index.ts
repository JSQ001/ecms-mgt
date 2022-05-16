/* eslint-disable */
import { reactive } from 'vue'

interface Store {
  token?: string
  userInfo?: any
  [propName: string]: any
  isCollapsed?: boolean
}

export const store = reactive<Store>({
  token: '',
  code: null,
  userInfo: {
    id: 1
  },
  isCollapsed: false
})

export function setStore(data: Store): void {
  for (let field in data) {
    if (data.hasOwnProperty(field) && typeof store[field] !== 'undefined') {
      store[field] = data[field]
    }
  }
}
