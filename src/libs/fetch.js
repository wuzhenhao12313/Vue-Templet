import http from './http'
import config from '@/config'
import jQuery from 'jquery'

export function fetchApi ({ url, params }) {
  return new Promise((resolve, reject) => {
    http.base.get(config.getUrl('api') + url, params).then(res => {
      const { data } = res
      if (data) {
        resolve(data)
      }
    })
  })
}

export function fetchService ({ url, params }) {
  return new Promise((resolve, reject) => {
    http.autoError.get(config.getUrl('service') + url, params).then(res => {
      const { data } = res
      if (data) {
        resolve(data.toObject())
      }
    })
  })
}

export function fetchProdService ({ url, params }) {
  return new Promise((resolve, reject) => {
    http.autoError.get(config.url.prod.service + url, params).then(res => {
      const { data } = res
      if (data) {
        resolve(data.toObject())
      } else {
        resolve(res)
      }
    })
  })
}

export function postService ({ url, params }) {
  return new Promise((resolve, reject) => {
    http.autoError.post(config.getUrl('service') + url, params).then(res => {
      const { data } = res
      if (data) {
        resolve(data)
      }
    })
  })
}

export function fetchDict ({ typeCode }) {
  return new Promise((resolve, reject) => {
    http.base.get(config.url.prod.service + '/api/dict/item/get', { typeCode }).then(res => {
      const { data } = res
      if (data) {
        const { model } = data
        const res = model.isEmpty() ? [] : model.toObject()
        resolve(res)
      }
    })
  })
}

export function fetchApiSync ({ url, params }) {
  let res = null
  try {
    jQuery.ajax({
      type: 'get',
      url: config.getUrl('api') + url,
      data: {
        ...params
      },
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      async: false,
      success: function (result) {
        res = result
      }
    })
  } catch (ex) {
    console.log(ex)
    return res
  }
  return res
}

export function fetchServiceSync ({ url, params }) {
  let res = null
  try {
    jQuery.ajax({
      type: 'get',
      url: config.getUrl('service') + url,
      data: {
        ...params
      },
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      async: false,
      success: function (result) {
        res = result
      }
    })
  } catch (ex) {
    console.log(ex)
    return res
  }
  return res
}

export function fetchDictSync ({ typeCode, itemCode }) {
  let res = null
  try {
    jQuery.ajax({
      type: 'get',
      url: config.url.prod.service + '/api/dict/item/get',
      data: {
        typeCode,
        itemCode
      },
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      async: false,
      success: function (result) {
        const { model } = result
        res = model.toObject()
      }
    })
  } catch (ex) {
    console.log(ex)
    return res
  }
  return res
}
