/*
 * @Author: yincheng
 * @Date: 2019-01-14 17:46:51
 * @LastEditors: yincheng
 * @LastEditTime: 2019-01-16 11:14:44
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

// 树结构

export const getPhase = () => {
  return axios.request({
    url: '/project/phase/detail',
    method: 'get'
  })
}

export const bindPhase = data => {
  return axios.request({
    url: '/project/phase/bind',
    method: 'post',
    data
  })
}
