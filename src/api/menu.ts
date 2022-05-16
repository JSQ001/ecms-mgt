import request from '@/utils/request'

export async function queryMenuByRoleId(id: string) {
  return request({ url: `/api/menu/list/by/roleId?roleId=${id}` })
}
export async function queryMenuTree() {
  return request({ url: `/api/menu/tree` })
}
