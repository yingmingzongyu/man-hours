/*
 * @Author: yincheng
 * @Date: 2019-01-23 16:33:54
 * @Last Modified by: yincheng
 * @Last Modified time: 2019-01-29 14:37:03
 */
import axios from '@/libs/api.request'

export const getManHourStatistics = params => {
  return axios.request({
    url: '/statistic/manHour/manHourStatistics',
    method: 'get',
    params
  })
}

export const getProjectHourStatistics = (params) => {
  return axios.request({
    url: '/statistic/projectTime/projectTimeStatistics',
    params,
    method: 'post'
  })
}

export const getStatisticManHour = params => {
  return axios.request({
    url: '/statistic/manHour/statisticManHour',
    method: 'post',
    params
  })
}


export const manHourStatisticsChart = params => {
  return axios.request({
    url: '/statistic/manHour/manHourStatisticsChart',
    method: 'post',
    params
  })
}

export const queryPunchAccessory = params => {
  return axios.request({
    url: '/statistic/manHour/queryPunchAccessory',
    method: 'post',
    params
  })
}

export const queryStatisticProject = params => {
  return axios.request({
    url: '/statistic/manHour/queryStatisticProjectType',
    method: 'post',
    params
  })
}
