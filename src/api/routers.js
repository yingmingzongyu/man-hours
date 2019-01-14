import axios from '@/libs/api.request'

export const getRouterReq = (access) => {
  return axios.request({
    url: 'get_router',
    params: {
      access
    },
    method: 'get'
  })
}

// 获取右侧菜单
export const getSlideMenu = ({usability, parentId} = {usability: 1, parentId: 0}) => {
  return axios.request({
    url: '/api/itsm/system/permission/resource/queryResourceByAll',
    params: {
      usability, parentId
    },
    method: 'post'
  })
}