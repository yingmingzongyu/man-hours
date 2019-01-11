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