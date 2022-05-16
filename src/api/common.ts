import request from '@/utils/request'
import { store } from '@/store'
import { message, Modal } from 'ant-design-vue'
const { global_config } = window as any

interface commonParamsProps {
  _moduleKey?: string
  [key: string]: unknown
}

export function getUploadUrl() {
  return global_config.BASE_URL + '/ueditor/config'
}

export const commonCreate = (params: commonParamsProps): Promise<unknown> => {
  const url = `/api/${params._moduleKey}/create`
  delete params._moduleKey
  return request({
    url,
    method: 'post',
    data: params
  })
}
export const commonUpdate = (params: commonParamsProps): Promise<unknown> => {
  const url = `/api/${params._moduleKey}/update`
  delete params._moduleKey
  return request({
    url,
    method: 'post',
    data: params
  })
}

export const commonSave = (params: commonParamsProps): Promise<unknown> => {
  const url = `/api/${params._moduleKey}/createOrUpdate`
  delete params._moduleKey
  return request({
    url,
    method: 'post',
    data: params
  })
}
export const commonBatchSave = (moduleKey: string, data: commonParamsProps): Promise<unknown> => {
  const url = `/api/${moduleKey}/saveOrUpdateBatch`
  return request({
    url,
    method: 'post',
    data
  })
}

export const commonAdd = (params: commonParamsProps): Promise<unknown> => {
  const moduleKey = params._moduleKey

  delete params._moduleKey

  return request.post(`/${moduleKey}/add`, params)
}

export const commonSearch = (params: commonParamsProps): Promise<unknown> => {
  const url = `/api/${params._moduleKey}/list`
  delete params._moduleKey
  return request({
    url,
    method: 'get',
    params
  })
}

export function commonDelete(moduleKey: string, id: string): Promise<unknown> {
  return request({
    url: `/api/${moduleKey}/delete/${id}`,
    method: 'post'
  })
}

export function getMenu(): Promise<unknown> {
  return request({
    url: '/api/menu/tree',
    method: 'get'
  })
}

export function roleAssignPermission(data: any): Promise<unknown> {
  return request({
    url: `/api/role/assignPermission`,
    method: 'post',
    data
  })
}
export function menuAssignRole(data: any): Promise<unknown> {
  return request({
    url: `/api/menu/assignRole`,
    method: 'post',
    data
  })
}

export function collectionArticle(params: any): Promise<unknown> {
  return request({
    url: `/api/ecms/crawling`,
    params
  })
}
/**
 * 统计文章
 * */
export function getStatistics(params?: any) {
  return request({
    url: `/api/article/statistics`,
    params
  })
}
/**
 * 按栏目统计文章
 * */
export function statisticsByColumn(params?: any) {
  return request({
    url: `/api/article/statisticsByColumn`,
    params
  })
}

export const auditArticle = (data: any): Promise<unknown> => {
  return request({
    url: `/api/article/audit`,
    method: 'post',
    data
  })
}

export const auditCollectArticle = (data: any): Promise<unknown> => {
  return request({
    url: `/api/collect-article/receive`,
    method: 'post',
    data
  })
}

/*
 * 获取选择数据
 *@params
 *
 * */
// export function getData (params) {
//   const { path, methodType } = params
//   return request({
//     url: path,
//     method: methodType
//   })
// }

export async function getInfoById(moduleKey: string, id: any, params = {}) {
  return request({ url: `/api/${moduleKey}/${id}`, params })
}
export async function getRuleById(id: string) {
  return request({
    url: `/api/collect-rule/getInfoById?id=${id}`
  })
}

export function batchDelete(moduleKey: string, data: any[]): Promise<unknown> {
  return request({
    url: `/api/${moduleKey}/batchDel`,
    method: 'post',
    data
  })
}


export async function collectrule(id: number): Promise<unknown> {
  return request({
    url: `/api/collect-node/manual/` + id,
    method: 'post'
  })
}


export async function upload(data: any = {}): Promise<unknown> {
  return request({
    url: `/api/attachment/upload`,
    method: 'post',
    timeout: 1000 * 60 * 2, // request timeout
    data
  })
}
