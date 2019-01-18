import axios from '@/libs/api.request'

/**
 * @description: 获取左侧菜单数据
 * @param {Number} parentId
 * @return: 
 */
export const getTreeList = ({ usability, parentId } = { usability: 1, parentId: 0 }) => {
  return axios.request({
    url: '/itsm/system/permission/resource/queryResourceByAll',
    params: {
      usability, parentId
    },
    method: 'post'
  })
}

/************ 菜单管理 ************/

/**
 * @description: 获取菜单分页数据
 * @param {Object} params
 * @return: 
 */
export const getMenuTable = (params) => {
  return axios.request({
    url: '/itsm/system/permission/resource/queryResourceByPage',
    params,
    method: 'post'
  })
}

/**
 * @description: 删除 启用 禁用菜单
 * @param {String} ids：删除菜单的id集合
 * @param {String} status：-1删除 1启用 0禁用
 * @return: 
 */
 export const batchDeleteMenu = (ids,status) => {
  return axios.request({
    url: '/itsm/system/permission/resource/batchDeleteChildResourceById',
    params:{
      ids,status
    },
    method: 'post'
  })
}

/**
 * @description: 排序菜单
 * @param {String} ids：删除菜单的id集合
 * @param {String} sortType 1上移 2下移
 * @return: 
 */
export const sortMenuFun = (ids,status) => {
  return axios.request({
    url: '/itsm/system/permission/resource/updateResourceBySort',
    params:{
      ids,status
    },
    method: 'post'
  })
}

/**
 * @description: 新增菜单
 * @param {Object} params: 新增菜单数据 
 * @return: 
 */
export const addMenuFun = (params) => {
  return axios.request({
    url: '/itsm/system/permission/resource/addResource',
    params,
    method: 'post'
  })
}

/**
 * @description: 编辑菜单
 * @param {Object} params: 新增菜单数据 
 * @return: 
 */
export const editMenuFun = (params) => {
  return axios.request({
    url: '/itsm/system/permission/resource/updateResource',
    params,
    method: 'post'
  })
}

/************ 用户管理 ************/
/**
 * @description: 获取用户分页数据
 * @param {Object} params
 * @return: 
 */
export const getUserTable = (params) => {
  return axios.request({
    url: '/itsm/system/sso/user/queryUserPageByCondition',
    params,
    method: 'post'
  })
}

/**
 * @description: 新增用户
 * @param {Object} params: 新增用户数据 
 * @return: 
 */
export const addUserFun = (params) => {
  return axios.request({
    url: '/itsm/system/sso/user/saveUser',
    params,
    method: 'post'
  })
}

/**
 * @description: 编辑用户
 * @param {Object} params: 编辑用户数据 
 * @return: 
 */
export const editUserFun = (params) => {
  return axios.request({
    url: '/itsm/system/sso/user/updateUser',
    params,
    method: 'post'
  })
}
/*
 * 部门管理
 */
export const getDepartmentTree = ({ parentId } = { parentId: 0 }) => {
  return axios.request({
    url: '/itsm/system/permission/organization/queryAll',
    params: {
      parentId
	},
    method: 'post'
  })
}

export const getDepartmentTable = (params) => {
  return axios.request({
    url: '/itsm/system/permission/organization/queryOrganizationByPage',
    params,
    method: 'post'
  })
}

export const addDepartment = (params) => {
  return axios.request({
    url: '/itsm/system/permission/organization/addOrganization',
    params,
    method: 'post'
  })
}

export const editDepartment = (params) => {
  return axios.request({
    url: '/itsm/system/permission/organization/updateOrganization',
    params,
    method: 'post'
  })
}

export const delDepartment = (params) => {
  return axios.request({
    url: '/itsm/system/permission/organization/deleteOrganization',
    params,
    method: 'post'
  })
}

export const changeDepartmentFlag = (params) => {
  return axios.request({
    url: '/itsm/system/permission/organization/updateOpenFlagOrganization',
    params,
    method: 'post'
  })
}

/*
 * 角色管理
 */
export const getRole = (params) => {
  return axios.request({
    url: '/itsm/system/permission/role/queryRoleByPage',
    params,
    method: 'post'
  })
}

export const delRole = (params) => {
  return axios.request({
    url: '/itsm/system/permission/role/deleteRole',
    params,
    method: 'post'
  })
}

export const addRole = (params) => {
  return axios.request({
    url: '/itsm/system/permission/role/addRole',
    params,
    method: 'post'
  })
}

export const detailRole = (params) => {
  return axios.request({
    url: '/itsm/system/permission/role/queryRoleInfo',
    params,
    method: 'post'
  })
}

export const editRole = (params) => {
  return axios.request({
    url: '/itsm/system/permission/role/updateRole',
    params,
    method: 'post'
  })
}