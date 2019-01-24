/*
 * @Author: yincheng
 * @Date: 2019-01-23 16:34:26
 * @Last Modified by: yincheng
 * @Last Modified time: 2019-01-24 16:33:39
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

export const statisticManHour = req => {
  let list = []
  req = JSON.parse(req.body) || {}
  doCustomTimes(req.pageSize || 10, () => {
    list.push(Mock.mock({
      "createDate": "@datetime",
      "projectName": "@cword(3, 10)",
      "elapsedTotal|1-30": 30,
      "recordLog": "@cword(4, 20)",
      "punchId|1-3000": 3000
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

export const manHourStatisticsChart = req => {
  let list = []
  req = JSON.parse(req.body) || {}
  doCustomTimes(10, () => {
    list.push(Mock.mock({
      "projectName": "@cword(3, 10)",
      "elapsedTotal|1-30": 30,
      "recordLog": "@cword(4, 20)"
    }))
  })
  return {
    status: 200,
    data: {
      list,
    }
  }
}

export const queryPunchAccessory = req => {
  let punchAccessoryUrl = []
  doCustomTimes(3, ()=>{
    punchAccessoryUrl.push(Random.dataImage())
  })
  return {
    status: 200,
    data: {
      punchAccessoryUrl,
    }
  }
}

export const queryStatisticProject = req => {
  return {
    status: 200,
    data: {
      businessType: [
        {
          value: 1,
          label: '智能化项目'
        },
        {
          value: 2,
          label: '系统集成项目'
        },
        {
          value: 3,
          label: '多媒体项目'
        }
      ]
    }
  }
}
