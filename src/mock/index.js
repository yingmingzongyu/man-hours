import Mock from 'mockjs'
import { login, logout, getUserInfo } from './login'
import { getTableData, getDragList, uploadImage, getOrgData } from './data'
import { getMessageInit, getContentByMsgId, hasRead, removeReaded, restoreTrash, messageCount } from './user'

import { addProject, updateProject, projectDetails, queryDetails, addLabel, delLabel, queryLabel, querySystemUser } from './project'

// 配置Ajax请求延时，可用来测试网络延迟大时项目中一些效果
Mock.setup({
  timeout: 1000
})

// 登录相关和获取用户信息
// Mock.mock(/\/login/, login)
// Mock.mock(/\/get_info/, getUserInfo)
// Mock.mock(/\/logout/, logout)
// Mock.mock(/\/get_table_data/, getTableData)
// Mock.mock(/\/get_drag_list/, getDragList)
// Mock.mock(/\/save_error_logger/, 'success')
// Mock.mock(/\/image\/upload/, uploadImage)
// Mock.mock(/\/message\/init/, getMessageInit)
// Mock.mock(/\/message\/content/, getContentByMsgId)
// Mock.mock(/\/message\/has_read/, hasRead)
// Mock.mock(/\/message\/remove_readed/, removeReaded)
// Mock.mock(/\/message\/restore/, restoreTrash)
// Mock.mock(/\/message\/count/, messageCount)
// Mock.mock(/\/get_org_data/, getOrgData)


Mock.mock(/\/project\/management\/add/, addProject)
Mock.mock(/\/project\/management\/update/, updateProject)
Mock.mock(/\/project\/management\/details/, projectDetails)
Mock.mock(/\/project\/management\/query/, queryDetails)
Mock.mock(/\/project\/label\/add/, addLabel)
Mock.mock(/\/project\/label\/delete/, delLabel)
Mock.mock(/\/project\/label\/query/, queryLabel)
Mock.mock(/\/itsm\/system\/sso\/user\/querySystemUser/, querySystemUser)

export default Mock
