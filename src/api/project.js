/*
 * @Author: yincheng
 * @Date: 2019-01-14 17:46:51
 * @LastEditors: yincheng
 * @LastEditTime: 2019-01-15 16:03:56
 */
import axios from '@/libs/api.request'

export const getProject = data => {
  return axios.request({
    url: '/project/management/query',
    method: 'get',
    data
  })
}

export const addProject = data => {
  return axios.request({
    url: '/project/management/add',
    method: 'post',
    data
  })
}

export const projectDetail = data => {
  return axios.request({
    url: '/project/management/details',
    method: 'get',
    data
  })
}

/*
 * 标签管理
 */
export const getLabel = data => {
  return axios.request({
    url: '/project/label/query',
    method: 'get',
    data
  })
}

export const delLabel = data => {
  return axios.request({
    url: '/project/label/delete',
    method: 'delete',
    data
  })
}

export const addLabel = data => {
  return axios.request({
    url: '/project/label/add',
    method: 'post',
    data
  })
}
