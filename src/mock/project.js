/*
 * @Author: yincheng
 * @Date: 2019-01-10 15:10:26
 * @LastEditors: yincheng
 * @LastEditTime: 2019-01-17 13:59:30
 */
import Mock from 'mockjs'
import { doCustomTimes } from '@/libs/util'
const Random = Mock.Random

export const addProject = () => {
  return {
    status: 200,
    message: '新增成功'
  }
}

export const updateProject = () => {
  return {
    status: 200,
    message: '修改成功'
  }
}

export const projectDetails = () => {
  const user = []
  doCustomTimes(3, () => {
    user.push(Mock.mock({
      "userCode|1-1000": 1000,
      "id|1-1000": 1000,
      "userName|1": "@cname()",
      "loginName|1": "@first()",
    }))
  })
  const project = Mock.mock({
    "projectNumber|1-300000": 3,
    "projectAttribution|1": ["ZHX", "GX", "PT"],
    "projectType|1-3": 3,
    "businessType|1-8": 8,
    "projectName": "@cword(3, 10)",
    "timeEvaluation|1-100": 100,
    "labelId|1": ["1", "2", "5", "1,3,5", "1,2,4"],
    "summarize": "@cword(4, 20)",
    "startTime": "@datetime",
    "endTime": "@datetime"
  })
  return {
    status: 200,
    data: {
      project,
      user
    }
  }
}
export const queryDetails = req => {
  let list = []
  req = JSON.parse(req.body) || {}
  doCustomTimes(req.pageSize || 10, () => {
    list.push(Mock.mock({
      "projectNumber|1-300000": 300000,
      "projectName": "@cword(3, 10)",
      "projectAttribution|1": ["ZHX", "GX", "PT"],
      "id|1-300000": 300000,
      "labelList": [
        {
          "labelId": 1,
          "labelName": "test1"
        }, {
          "labelId": 2,
          "labelName": "test2"
        }
      ],
      "phaseId|1": ["4","5","4,5","6","4,5,6"],
      "summarize": "@cword(4, 20)",
      "createTime": "@datetime",
      "createUser": "@cname"
    }))
  })
  return {
    status: 200,
    data: {
      list,
      total: 999,
      pageSize: 10,
      pageNum: req.pageNum || 1,
      pages: 10,
    }
  }
}
export const addLabel = () => {
  return {
    "status": 200,
    "message": "标签绑定成功"
  }
}
export const delLabel = () => {
  return {
    "status": 200,
    "message": "标签删除成功"
  }
}
export const queryLabel = req => {
  let list = []
  req = JSON.parse(req.body) || {}
  doCustomTimes(req.pageSize || 10, () => {
    list.push(Mock.mock({
      "relatedProjectsCount|1-30": 30,
      "id|1-30": 30,
      "labelName|1": "@cword(1, 8)",
    }))
  })
  return {
    status: 200,
    data: {
      list,
      total: 23,
      pageSize: 10,
      pageNum: req.pageNum || 1,
      pages: 2,
    }
  }
}

export const querySystemUser = req => {
  let list = []
  req = JSON.parse(req.body) || {}
  doCustomTimes(req.pageSize || 10, () => {
    list.push(Mock.mock({
      "userCode|1-1000": 1000,
      "id|1-1000": 1000,
      "userName|1": "@cname()",
      "loginName|1": "@first()",
    }))
  })
  return {
    status: 200,
    data: {
      list,
      total: 23,
      pageSize: 10,
      pageNum: req.pageNum || 1,
      pages: 2,
    }
  }
}

export const getPhase = () => {
  return {
    status: 200,
    data: [
      {
        "id": 1,
        "phaseName": "需求阶段",
        "parentId": 0,
        "parentFlag": 1,
        "status": 0,
        "childList": [
          {
            "id": 3,
            "phaseName": "需求对接",
            "parentId": 1,
            "parentFlag": 0,
            "status": 0,
            "childList": null
          }
        ]
      },
      {
        "id": 2,
        "phaseName": "方案设计阶段",
        "parentId": 0,
        "parentFlag": 1,
        "status": 0,
        "childList": [
          {
            "id": 4,
            "phaseName": "需求评审",
            "parentId": 1,
            "parentFlag": 0,
            "status": 0,
            "childList": null
          },
          {
            "id": 5,
            "phaseName": "原型设计",
            "parentId": 1,
            "parentFlag": 0,
            "status": 0,
            "childList": null
          }
        ]
      },
      {
        "id": 6,
        "phaseName": "方案设计阶段",
        "parentId": 0,
        "parentFlag": 1,
        "status": 0,
        "childList": null
      }
    ]
  }
}
export const bindPhase = () => {
  return {
    "status": 200,
    "message": "流程绑定成功"
  }
}
// export const getMessageInit = () => {
//   let unreadList = []
//   doCustomTimes(3, () => {
//     unreadList.push(Mock.mock({
//       title: Random.cword(10, 15),
//       create_time: '@date',
//       msg_id: Random.increment(100)
//     }))
//   })
//   let readedList = []
//   doCustomTimes(4, () => {
//     readedList.push(Mock.mock({
//       title: Random.cword(10, 15),
//       create_time: '@date',
//       msg_id: Random.increment(100)
//     }))
//   })
//   let trashList = []
//   doCustomTimes(2, () => {
//     trashList.push(Mock.mock({
//       title: Random.cword(10, 15),
//       create_time: '@date',
//       msg_id: Random.increment(100)
//     }))
//   })
//   return {
//     unread: unreadList,
//     readed: readedList,
//     trash: trashList
//   }
// }

// export const getContentByMsgId = () => {
//   return `<divcourier new',="" monospace;font-weight:="" normal;font-size:="" 12px;line-height:="" 18px;white-space:="" pre;"=""><div>&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size: medium;">这是消息内容，这个内容是使用<span style="color: rgb(255, 255, 255); background-color: rgb(28, 72, 127);">富文本编辑器</span>编辑的，所以你可以看到一些<span style="text-decoration-line: underline; font-style: italic; color: rgb(194, 79, 74);">格式</span></span></div><ol><li>你可以查看Mock返回的数据格式，和api请求的接口，来确定你的后端接口的开发</li><li>使用你的真实接口后，前端页面基本不需要修改即可满足基本需求</li><li>快来试试吧</li></ol><p>${Random.csentence(100, 200)}</p></divcourier>`
// }

// export const hasRead = () => {
//   return true
// }

// export const removeReaded = () => {
//   return true
// }

// export const restoreTrash = () => {
//   return true
// }

// export const messageCount = () => {
//   return 3
// }
