import request from '@/utils/request'

export async function roleAssignPermission(params: any, data: any) {
  return request({
    url: `/api/role/alloc-permit`,
    method: 'post',
    params,
    data
  })
}
export async function roleAssignMenu(params: any, data: any) {
  return request({
    url: `/api/role/malloc-menu`,
    method: 'post',
    params,
    data
  })
}

export async function queryPermissionByRoleId(id: string) {
  return request({ url: `/api/permission/list/by/roleId?roleId=${id}` })
}

export async function queryAllRole() {
  return request({ url: `/api/role/list-all` })
}
