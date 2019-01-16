import axios from '@/libs/api.request'

/**
 * @description: 获取左侧菜单数据
 * @param {Number} parentId
 * @return: 
 */
export const getTreeList = ({ usability, parentId } = { usability: 1, parentId: 0 }) => {
  return axios.request({
    url: '/api/itsm/system/permission/resource/queryResourceByAll',
    params: {
      usability, parentId
    },
    method: 'post'
  })
}

/**
 * @description: 获取菜单分页数据
 * @param {Object} params
 * @return: 
 */
export const getMenuTable = (params) => {
  return axios.request({
    url: '/api/itsm/system/permission/resource/queryResourceByPage',
    params,
    method: 'post'
  })
}