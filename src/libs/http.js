import axios from 'axios'
import loadingService from './loadingService'
import config from '@/config'
import {
  Message
} from 'iview'

const axiosConfig = {
  timeout: 120000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json'
  },
  withCredentials: true
}

const ajax = axios.create(axiosConfig)
const ajaxApi = axios.create(axiosConfig)

ajax.interceptors.response.use((res) => {
  // return;
  if (res.status === 202) {
    setTimeout(() => {
      // loadingService.done();
      window.location.href = `${config.getUrl('loginApi')}?app=OA&from=${config.getUrl('home')}#/home`
    }, 0)
    return false
  } else {
    if (!res.data.success) {
      if (res.data.errCode === '403') {
        Message.warning(res.data.msg)
      } else {
        if (res.data.msg !== null && res.data.msg !== '') {
          Message.error(res.data.msg)
        }
      }
      // loadingService.done();
      return Promise.resolve(false)
    } else {
      if (res.data.msg && res.data.msg !== '') {
        Message.success(res.data.msg)
      }
      return Promise.resolve(res.data)
    }
  }
}, () => {
  setTimeout(() => {
    // loadingService.done();
    Message.error('服务器错误')
  }, 0)
})

const http = {}

http.autoError = {
  post (url, params) {
    return ajax.post(url, params)
  },
  put (url, params) {
    return ajax.put(url, params)
  },
  delete (url, params) {
    return ajax.delete(url, params)
  },
  get (url, params) {
    if (params === undefined) {
      return ajax.get(url, {})
    }
    return ajax.get(url, {
      params
    })
  }
}

http.base = {
  post (url, params) {
    return ajaxApi.post(url, params)
  },
  put (url, params) {
    return ajaxApi.put(url, params)
  },
  delete (url, params) {
    return ajaxApi.delete(url, params)
  },
  get (url, params) {
    if (params === undefined) {
      return ajaxApi.get(url, {})
    }
    return ajaxApi.get(url, {
      params
    })
  }
}

export default http
