/*
 * @Author: yincheng
 * @Date: 2019-01-23 16:33:54
 * @Last Modified by: yincheng
 * @Last Modified time: 2019-01-23 17:59:08
 */
import axios from '@/libs/api.request'

export const getManHourStatistics = params => {
  return axios.request({
    url: '/statisticAnalysis/manHour/manHourStatistics',
    method: 'get',
    params
  })
}
