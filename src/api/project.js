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

export const deleteLabel = data => {
  return axios.request({
    url: '/project/label/delete',
    method: 'delete',
    data
  })
}