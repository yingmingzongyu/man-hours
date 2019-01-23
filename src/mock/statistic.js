/*
 * @Author: yincheng
 * @Date: 2019-01-23 16:34:26
 * @Last Modified by: yincheng
 * @Last Modified time: 2019-01-23 17:55:52
 */
import Mock from 'mockjs'
import { doCustomTimes } from '@/libs/util'
const Random = Mock.Random

export const manHourStatistics = req => {
  let list = []
  req = JSON.parse(req.body) || {}
  doCustomTimes(req.pageSize || 10, () => {
    list.push(Mock.mock({
      "userId|1-300000": 300000,
      "userName": "@cname",
      "organizationName|1": ["产品部", "设计部", "开发部", "测试部"],
      "involvedProjectTotal|1-30": 30,
      "workTimeTotal|1-30": 30,
      "punchTotal|1-30": 30
    }))
  })
  return {
    status: 200,
    data: {
      list,
      total: 999,
      pageSize: req.pageSize || 10,
      pageNum: req.pageNum || 1,
      pages: 10,
    }
  }
}
