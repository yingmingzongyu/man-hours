/*
 * @Author: yincheng
 * @Date: 2019-01-14 17:46:51
 * @LastEditors: yincheng
 * @LastEditTime: 2019-01-17 18:04:28
 */
import axios from '@/libs/api.request'

export const getProject = params => {
  return axios.request({
    url: '/project/management/query',
    method: 'get',
    params
  })
}

export const addProject = data => {
  return axios.request({
    url: '/project/management/add',
    method: 'post',
    data
  })
}

export const updateProject = data => {
  return axios.request({
    url: '/project/management/update',
    method: 'post',
    data
  })
}

export const projectDetail = params => {
  return axios.request({
    url: '/project/management/details',
    method: 'get',
    params
  })
}

/*
 * 标签管理
 */
export const getLabel = params => {
  return axios.request({
    url: '/project/label/query',
    method: 'get',
    params
  })
}

export const delLabel = data => {
  return axios.request({
    url: '/project/label/delete',
    method: 'post',
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

// 树结构

export const getPhase = params => {
  return axios.request({
    url: '/project/phase/query',
    method: 'get',
    params
  })
}

export const bindPhase = data => {
  return axios.request({
    url: '/project/management/bindPhase',
    method: 'post',
    data
  })
}
