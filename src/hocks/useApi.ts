import request from '@/utils/request'
import qs from 'qs'

export type BaseApiProps = {
  moduleKey: string
  createFunc?: Function
  deleteFunc?: Function
  updateFunc?: Function
  queryFunc?: Function
  batchDeleteFunc?: Function

  createUrl?: string
  deleteUrl?: string
  updateUrl?: string
  queryUrl?: string
  batchDelUrl?: string
  batchDeleteUrl?: string

  queryOptions?: any
  createOptions?: any
  updateOptions?: any
  deleteOptions?: any
}

type UseApi = {
  create: Function
  query: Function
  update: Function
  deleteFunc: Function
  batchDelFunc: Function
}

export default function useApi(props: BaseApiProps): UseApi {
  async function create(data: any): Promise<any> {
    if (props.createFunc) {
      return props.createFunc()
    }
    const url = props.createUrl || `/api/${props.moduleKey}/create`
    return request({
      url: url,
      method: 'post',
      data,
      ...props.createOptions
    })
  }

  async function deleteFunc(data: any): Promise<any> {
    if (props.deleteFunc) {
      return props.deleteFunc()
    }
    const url = props.deleteUrl || `/api/${props.moduleKey}/delete/${data.id}`
    return request({
      url: url,
      method: 'post',
      data,
      ...props.deleteOptions
    })
  }

  async function update(data: any): Promise<any> {
    if (props.updateFunc) {
      return props.updateFunc()
    }
    const url = props.updateUrl || `/api/${props.moduleKey}/update`
    return request({
      url: url,
      method: 'post',
      data,
      ...props.updateOptions
    })
  }

  async function query(params: any): Promise<any> {
    if (props.queryFunc) {
      return props.queryFunc()
    }
    const url = props.queryUrl || `/api/${props.moduleKey}/list`
    return request({
      url: url,
      method: 'get',
      params,
      ...props.queryOptions
    })
  }

  async function batchDelFunc(data: any): Promise<any> {
    if (props.batchDeleteFunc) {
      return props.batchDeleteFunc()
    }
    const url = props.batchDeleteUrl || `/api/${props.moduleKey}/delete`
    return request({
      url: url,
      method: 'post',
      data
    })
  }

  return {
    create,
    query,
    update,
    deleteFunc,
    batchDelFunc
  }
}
