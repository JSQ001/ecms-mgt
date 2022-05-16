import request from '@/utils/request'

export async function getColumnTree(params?: any) {
  return request({
    url: `/api/catalog/tree/parentId`,
    method: 'get',
    params
  })
}
export async function moveColumn(params?: any) {
  return request({
    url: `/api/catalog/move`,
    method: 'post',
    params
  })
}
