import request from '@/utils/request'
import qs from 'qs'

export async function modifyArticle(data: any) {
  return request({
    url: `/api/article/update/properties`,
    method: 'post',
    data
  })
}

export async function statisticsArticleBaseInfo(params: any = {}) {
  return request({
    url: `/api/article/statistic/compile`,
    method: 'post',
    params
  })
}
export async function getVisitStatisticDays(params: any = {}) {
  return request({
    url: `/api/article/visit/log/statisticDays`,
    method: 'post',
    params
  })
}

export async function getNodeStatistic(params: any = {}) {
  return request({
    url: `/api/collect-article/statistic`,
    method: 'post',
    params
  })
}

export async function getCatalogStatistic(params: any = {}) {
  return request({
    url: `/api/article/statistic/by/catalogCode`,
    method: 'post',
    params
  })
}
