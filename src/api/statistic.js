/*
 * @Author: yincheng
 * @Date: 2019-01-23 16:33:54
 * @Last Modified by: yincheng
 * @Last Modified time: 2019-01-24 16:43:05
 */
import axios from '@/libs/api.request'

export const getManHourStatistics = params => {
  return axios.request({
    url: '/statisticAnalysis/manHour/manHourStatistics',
    method: 'get',
    params
  })
}

export const getStatisticManHour = params => {
  return axios.request({
    url: '/statisticAnalysis/manHour/statisticManHour',
    method: 'post',
    params
  })
}


export const manHourStatisticsChart = params => {
  return axios.request({
    url: '/statisticAnalysis/manHour/manHourStatisticsChart',
    method: 'post',
    params
  })
}

export const queryPunchAccessory = params => {
  return axios.request({
    url: '/statisticAnalysis/manHour/queryPunchAccessory',
    method: 'post',
    params
  })
}

export const queryStatisticProject = params => {
  return axios.request({
    url: '/statisticAnalysis/manHour/queryStatisticProjectType',
    method: 'post',
    params
  })
}
