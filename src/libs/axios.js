import axios from 'axios'
import store from '@/store'
import { Spin, Message } from 'iview'
const addErrorLog = errorInfo => {
  const { statusText, status, request: { responseURL } } = errorInfo
  let info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL
  }
  if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}
function checkUrl(url) {
  if (!(/^http:/.test(url))) {
    if (url.indexOf('/api/') <= -1) {
      url = '/api' + url;
    }
  }
  return url;
}

class HttpRequest {
  constructor(baseUrl = baseURL) {
    this.baseUrl = ''
    this.queue = {}
  }
  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        // 'Content-type':'multipart/form-data',
        timeout: 30000,
        'Token': store.state.user.token
      }
    }
    return config
  }
  destroy(url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      const { data, status } = res
      if (data.status !== 200) {
        switch (data.status) {
          case 401:
          case 403:
            //删除token
            store.commit('setUserInfo')
            window.location.href = '/#/login'
            break;
          case 411:
            window.location.href = '/#/403'
            break;
          case 404:
            window.location.href = '/#/404'
            break;
          default:
            break;
        }
        Message.error(data.message)
      }
      return { data, status }
    }, error => {
      this.destroy(url)
      let errorInfo = error.response
      console.log(errorInfo)
      if (errorInfo.status !== 200) {
        switch (errorInfo.status) {
          case 401:
          case 403:
            //删除token
            store.commit('setUserInfo')
            window.location.href = '/#/login'
            break;
          case 411:
            window.location.href = '/#/403'
            break;
          case 404:
            window.location.href = '/#/404'
            break;
          default:
            break;
        }
        Message.error(errorInfo.message)
      }
      if (!errorInfo) {
        const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
        errorInfo = {
          statusText,
          status,
          request: { responseURL: config.url }
        }
      }
      addErrorLog(errorInfo)
      return Promise.reject(error)
    })
  }
  request(options) {
    options.url = checkUrl(options.url)
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
