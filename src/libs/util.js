import Cookies from 'js-cookie'
import qs from 'qs'
import moment from 'moment'
import numeral from 'numeral'
import linq from './linq'
import dayjs from 'dayjs'

// cookie保存的天数
import config from '@/config'
import { forEach, hasOneOf, objEqual } from '@/libs/tools'

const { title, cookieExpires, useI18n } = config

export const TOKEN_KEY = 'i_token'

export const setToken = (token) => {
  Cookies.set(TOKEN_KEY, token, { expires: cookieExpires || 1 })
}

export const getToken = () => {
  const token = Cookies.get(TOKEN_KEY)
  if (token) return token
  else return false
}

export const hasChild = (item) => {
  return item.children && item.children.length !== 0
}

const showThisMenuEle = (item, access) => {
  if (item.meta && item.meta.access && item.meta.access.length) {
    if (hasOneOf(item.meta.access, access)) return true
    else return false
  } else return true
}
/**
 * @param {Array} list 通过路由列表得到菜单列表
 * @returns {Array}
 */
export const getMenuByRouter = (list, access) => {
  let res = []
  forEach(list, item => {
    if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
      let obj = {
        icon: (item.meta && item.meta.icon) || '',
        name: item.name,
        meta: item.meta,
        code: item.code
      }
      if ((hasChild(item) || (item.meta && item.meta.showAlways)) && showThisMenuEle(item, access)) {
        obj.children = getMenuByRouter(item.children, access)
      }
      if (item.meta && item.meta.href) obj.href = item.meta.href
      if (showThisMenuEle(item, access)) res.push(obj)
    }
  })
  return res
}

/**
 * @param {Array} routeMetched 当前路由metched
 * @returns {Array}
 */
export const getBreadCrumbList = (route, homeRoute) => {
  let homeItem = { ...homeRoute, icon: homeRoute.meta.icon }
  let routeMetched = route.matched
  if (routeMetched.some(item => item.name === homeRoute.name)) return [homeItem]
  let res = routeMetched.filter(item => {
    return item.meta === undefined || !item.meta.hideInBread
  }).map(item => {
    let meta = { ...item.meta }
    if (meta.title && typeof meta.title === 'function') {
      meta.__titleIsFunction__ = true
      meta.title = meta.title(route)
    }
    let obj = {
      icon: (item.meta && item.meta.icon) || '',
      name: item.name,
      meta: meta
    }
    return obj
  })
  res = res.filter(item => {
    return !item.meta.hideInMenu
  })
  return [{ ...homeItem, to: homeRoute.path }, ...res]
}

export const getRouteTitleHandled = (route) => {
  let router = { ...route }
  let meta = { ...route.meta }
  let title = ''
  if (meta.title) {
    if (typeof meta.title === 'function') {
      meta.__titleIsFunction__ = true
      title = meta.title(router)
    } else title = meta.title
  }
  meta.title = title
  router.meta = meta
  return router
}

export const showTitle = (item, vm) => {
  let { title, __titleIsFunction__ } = item.meta
  if (!title) return
  if (useI18n) {
    if (title.includes('{{') && title.includes('}}') && useI18n) title = title.replace(/({{[\s\S]+?}})/, (m, str) => str.replace(/{{([\s\S]*)}}/, (m, _) => vm.$t(_.trim())))
    else if (__titleIsFunction__) title = item.meta.title
    else title = vm.$t(item.name)
  } else title = (item.meta && item.meta.title) || item.name
  return title
}

/**
 * @description 本地存储和获取标签导航列表
 */
export const setTagNavListInLocalstorage = list => {
  localStorage.tagNaveList = JSON.stringify(list)
}
/**
 * @returns {Array} 其中的每个元素只包含路由原信息中的name, path, meta三项
 */
export const getTagNavListFromLocalstorage = () => {
  const list = localStorage.tagNaveList
  return list ? JSON.parse(list) : []
}

/**
 * @param {Array} routers 路由列表数组
 * @description 用于找到路由列表中name为home的对象
 */
export const getHomeRoute = (routers, homeName = 'home') => {
  let i = -1
  let len = routers.length
  let homeRoute = {}
  while (++i < len) {
    let item = routers[i]
    if (item.children && item.children.length) {
      let res = getHomeRoute(item.children, homeName)
      if (res.name) return res
    } else {
      if (item.name === homeName) homeRoute = item
    }
  }
  return homeRoute
}

/**
 * @param {*} list 现有标签导航列表
 * @param {*} newRoute 新添加的路由原信息对象
 * @description 如果该newRoute已经存在则不再添加
 */
export const getNewTagList = (list, newRoute) => {
  const { name, path, meta } = newRoute
  let newList = [...list]
  if (newList.findIndex(item => item.name === name) >= 0) return newList
  else newList.push({ name, path, meta })
  return newList
}

/**
 * @param {*} access 用户权限数组，如 ['super_admin', 'admin']
 * @param {*} route 路由列表
 */
const hasAccess = (access, route) => {
  if (route.meta && route.meta.access) return hasOneOf(access, route.meta.access)
  else return true
}

/**
 * 权鉴
 * @param {*} name 即将跳转的路由name
 * @param {*} access 用户权限数组
 * @param {*} routes 路由列表
 * @description 用户是否可跳转到该页
 */
export const canTurnTo = (name, access, routes) => {
  const routePermissionJudge = (list) => {
    return list.some(item => {
      if (item.children && item.children.length) {
        return routePermissionJudge(item.children)
      } else if (item.name === name) {
        return hasAccess(access, item)
      }
    })
  }

  return routePermissionJudge(routes)
}

/**
 * @param {String} url
 * @description 从URL中解析参数
 */
export const getParams = url => {
  const keyValueArr = url.split('?')[1].split('&')
  let paramObj = {}
  keyValueArr.forEach(item => {
    const keyValue = item.split('=')
    paramObj[keyValue[0]] = keyValue[1]
  })
  return paramObj
}

/**
 * @param {Array} list 标签列表
 * @param {String} name 当前关闭的标签的name
 */
export const getNextRoute = (list, route) => {
  let res = {}
  if (list.length === 2) {
    res = getHomeRoute(list)
  } else {
    const index = list.findIndex(item => routeEqual(item, route))
    if (index === list.length - 1) res = list[list.length - 2]
    else res = list[index + 1]
  }
  return res
}

/**
 * @param {Number} times 回调函数需要执行的次数
 * @param {Function} callback 回调函数
 */
export const doCustomTimes = (times, callback) => {
  let i = -1
  while (++i < times) {
    callback(i)
  }
}

/**
 * @param {Object} file 从上传组件得到的文件对象
 * @returns {Promise} resolve参数是解析后的二维数组
 * @description 从Csv文件中解析出表格，解析成二维数组
 */
export const getArrayFromFile = (file) => {
  let nameSplit = file.name.split('.')
  let format = nameSplit[nameSplit.length - 1]
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.readAsText(file) // 以文本格式读取
    let arr = []
    reader.onload = function (evt) {
      let data = evt.target.result // 读到的数据
      let pasteData = data.trim()
      arr = pasteData.split((/[\n\u0085\u2028\u2029]|\r\n?/g)).map(row => {
        return row.split('\t')
      }).map(item => {
        return item[0].split(',')
      })
      if (format === 'csv') resolve(arr)
      else reject(new Error('[Format Error]:你上传的不是Csv文件'))
    }
  })
}

/**
 * @param {Array} array 表格数据二维数组
 * @returns {Object} { columns, tableData }
 * @description 从二维数组中获取表头和表格数据，将第一行作为表头，用于在iView的表格中展示数据
 */
export const getTableDataFromArray = (array) => {
  let columns = []
  let tableData = []
  if (array.length > 1) {
    let titles = array.shift()
    columns = titles.map(item => {
      return {
        title: item,
        key: item
      }
    })
    tableData = array.map(item => {
      let res = {}
      item.forEach((col, i) => {
        res[titles[i]] = col
      })
      return res
    })
  }
  return {
    columns,
    tableData
  }
}

export const findNodeUpper = (ele, tag) => {
  if (ele.parentNode) {
    if (ele.parentNode.tagName === tag.toUpperCase()) {
      return ele.parentNode
    } else {
      return findNodeUpper(ele.parentNode, tag)
    }
  }
}

export const findNodeUpperByClasses = (ele, classes) => {
  let parentNode = ele.parentNode
  if (parentNode) {
    let classList = parentNode.classList
    if (classList && classes.every(className => classList.contains(className))) {
      return parentNode
    } else {
      return findNodeUpperByClasses(parentNode, classes)
    }
  }
}

export const findNodeDownward = (ele, tag) => {
  const tagName = tag.toUpperCase()
  if (ele.childNodes.length) {
    let i = -1
    let len = ele.childNodes.length
    while (++i < len) {
      let child = ele.childNodes[i]
      if (child.tagName === tagName) return child
      else return findNodeDownward(child, tag)
    }
  }
}

export const showByAccess = (access, canViewAccess) => {
  return hasOneOf(canViewAccess, access)
}

/**
 * @description 根据name/params/query判断两个路由对象是否相等
 * @param {*} route1 路由对象
 * @param {*} route2 路由对象
 */
export const routeEqual = (route1, route2) => {
  const params1 = route1.params || {}
  const params2 = route2.params || {}
  const query1 = route1.query || {}
  const query2 = route2.query || {}
  return (route1.name === route2.name) && objEqual(params1, params2) && objEqual(query1, query2)
}

/**
 * 判断打开的标签列表里是否已存在这个新添加的路由对象
 */
export const routeHasExist = (tagNavList, routeItem) => {
  let len = tagNavList.length
  let res = false
  doCustomTimes(len, (index) => {
    if (routeEqual(tagNavList[index], routeItem)) res = true
  })
  return res
}

export const localSave = (key, value) => {
  localStorage.setItem(key, value)
}

export const localRead = (key) => {
  return localStorage.getItem(key) || ''
}

// scrollTop animation
export const scrollTop = (el, from = 0, to, duration = 500, endCallback) => {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60)
      }
    )
  }
  const difference = Math.abs(from - to)
  const step = Math.ceil(difference / duration * 50)

  const scroll = (start, end, step) => {
    if (start === end) {
      endCallback && endCallback()
      return
    }

    let d = (start + step > end) ? end : start + step
    if (start > end) {
      d = (start - step < end) ? end : start - step
    }

    if (el === window) {
      window.scrollTo(d, d)
    } else {
      el.scrollTop = d
    }
    window.requestAnimationFrame(() => scroll(d, end, step))
  }
  scroll(from, to, step)
}

/**
 * @description 根据当前跳转的路由设置显示在浏览器标签的title
 * @param {Object} routeItem 路由对象
 * @param {Object} vm Vue实例
 */
export const setTitle = (routeItem, vm) => {
  const handledRoute = getRouteTitleHandled(routeItem)
  const pageTitle = showTitle(handledRoute, vm)
  const resTitle = pageTitle ? `${title} - ${pageTitle}` : title
  window.document.title = resTitle
}

/**
 *
 */
export const expandObj = (data) => {
  let obj = {}
  data.forEach(item => {
    const { href, children, code } = item
    obj[code] = {
      href
    }
    if (children) {
      obj = {
        ...obj,
        ...expandObj(children)
      }
    }
  })
  return obj
}

export const expandMenu = (data, objName = 'code') => {
  let list = []
  data.forEach(item => {
    const { children } = item
    list.push(item[objName])
    if (children) {
      list = list.concat(expandMenu(children, objName))
    }
  })
  return list
}

export const matchMenu = (list, userMenuList) => {
  let res = []
  list.forEach(x => {
    if (userMenuList.contains(x.code)) {
      if (x.children) {
        x.children = matchMenu(x.children, userMenuList)
      }
      res.push(x)
    }
  })
  return res
}

function recursionTreeData (originData, targetData, order) {
  if (targetData.length > 0) {
    targetData.forEach(data => {
      const childrenData = linq(originData).where(x => x['parentID'] === data['value'])
      if (order) {
        childrenData.orderBy(order)
      }
      if (childrenData.count() !== 0) {
        data.children = data.children || []
        data.children = data.children.concat(recursionTreeData(originData, childrenData.toList(), order))
      }
    })
    return targetData
  }
  return []
}

export function createTreeData (data, labelColumn, valueColumn, order = 'parentID') {
  data = data || []
  const _data = []
  data.forEach(x => {
    const result = {
      id: x[valueColumn],
      label: x[labelColumn],
      value: x[valueColumn],
      key: x[valueColumn],
      parentID: x.parentID
    }
    _data.push(result)
  })
  const treeData = linq(_data).where(x => x['parentID'] === 0)
  if (order) {
    treeData.orderBy(order)
  }
  return recursionTreeData(_data, treeData.toList(), order)
}

/**
 * url参数取值
 * @param key
 * @returns {null}
 */
export function query (key) {
  const arr = window.location.href.split('?')
  if (arr.length <= 1) {
    return null
  }
  arr.shift()
  const str = arr.join()
  const obj = qs.parse(str)
  return obj[key] === undefined ? null : obj[key]
}

/**
 * 数组洗牌
 * @param arr
 * @returns {*}
 */
export function shuffle (arr) {
  let len = arr.length
  for (let i = 0; i < len - 1; i++) {
    let idx = Math.floor(Math.random() * (len - i))
    let temp = arr[idx]
    arr[idx] = arr[len - i - 1]
    arr[len - i - 1] = temp
  }
  return arr
}

/**
 * 数字转换字母 0 对应 A
 * @param num
 * @returns {string}
 */
export function changeNum2Letter (num) {
  return String.fromCharCode(65 + num)
}

/**
 * 判断字符串为空
 * @param str
 * @returns {boolean}
 */
export function isNullOrEmpty (str) {
  return str === null || str === '' || str === undefined
}

export function isArray (arr) {
  return Object.prototype.toString.call(arr) === '[object Array]'
}

/**
 *  uuid
 * @param len
 * @param radix
 * @returns {string}
 */
export function uuid (len = 8, radix = 16) {
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  let uuid = []
  let i
  radix = radix || chars.length

  if (len) {
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
  } else {
    let r
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16
        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
      }
    }
  }
  return uuid.join('')
}

function supplyZero (num) {
  let str = ''
  for (let i = 0; i < num; i += 1) {
    str += '0'
  }
  return str
}

export function formatMoney (value, num, type) {
  switch (type) {
    case 'rmb':
      return `¥ ${numeral(value).format(`0,0.${supplyZero(num || 2)}`)}`
    case 'dollar':
      return numeral(value).format(`$ 0,0.${supplyZero(num || 2)}`)
  }
}

export function formatNumber (value, num) {
  num = num || 0
  if (num === 0) {
    return numeral(value).format(`0,0`)
  }
  return numeral(value).format(`0,0.${supplyZero(num || 0)}`)
}

export function formatDate (dateObj, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!dateObj) {
    return null
  }
  return moment(dateObj).format(format)
}

export function base64Img2Blob (code) {
  let parts = code.split(';base64,')
  let contentType = parts[0].split(':')[1]
  let raw = window.atob(parts[1])
  let rawLength = raw.length
  let uInt8Array = new Uint8Array(rawLength)
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i)
  }
  return new Blob([uInt8Array], { type: contentType })
}

export function downloadFile (fileName, content) {
  let aLink = document.createElement('a')
  document.body.appendChild(aLink)
  let blob = base64Img2Blob(content) // new Blob([content]);
  let evt = document.createEvent('HTMLEvents')
  evt.initEvent('click', false, false)// initEvent 不加后两个参数在FF下会报错
  aLink.download = fileName
  aLink.href = URL.createObjectURL(blob)
  aLink.click()
  aLink.dispatchEvent(evt)
  aLink.remove()
}

export function exportExcel (JSONData, FileName, ShowLabel) {
  let arrData = typeof JSONData !== 'object' ? JSON.parse(JSONData) : JSONData
  let table = '<table>'
  let row = '<tr>'
  for (let i = 0, l = ShowLabel.length; i < l; i += 1) {
    row += `<th style='text-align:${ShowLabel[i].align || 'left'}'>` + ShowLabel[i].value + '</th>'
  }
  table += row + '</tr>'
  for (let i = 0; i < arrData.length; i += 1) {
    let row = '<tr>'
    for (let index in arrData[i]) {
      let value = arrData[i][index].value === '.' ? '' : arrData[i][index].value
      row += value ? `<td style='${arrData[i][index].style}' ${arrData[i][index].rowspan ? `rowspan=${arrData[i][index].rowspan}` : ''}>` + value + '</td>' : '<td></td>'
    }
    table += row + '</tr>'
  }
  table += '</table>'
  let excelFile = '<html  ' +
    "xmlns:v='urn:schemas-microsoft-com:vml'" +
    "xmlns:o='urn:schemas-microsoft-com:office:office' " +
    "xmlns:x='urn:schemas-microsoft-com:office:excel' " +
    "xmlns:m='http://schemas.microsoft.com/office/2004/12/omml' " +
    "xmlns='http://www.w3.org/TR/REC-html40'>"
  excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">'
  excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel'
  excelFile += '; charset=UTF-8">'
  excelFile += '<head>'
  excelFile += '<!--[if gte mso 9]>'
  excelFile += '<xml>'
  excelFile += '<x:ExcelWorkbook>'
  excelFile += '<x:ExcelWorksheets>'
  excelFile += '<x:ExcelWorksheet>'
  excelFile += '<x:Name>'
  excelFile += '{worksheet}'
  excelFile += '</x:Name>'
  excelFile += '<x:WorksheetOptions>'
  excelFile += '<x:DisplayGridlines/>'
  excelFile += '</x:WorksheetOptions>'
  excelFile += '</x:ExcelWorksheet>'
  excelFile += '</x:ExcelWorksheets>'
  excelFile += '</x:ExcelWorkbook>'
  excelFile += '</xml>'
  excelFile += '<![endif]-->'
  excelFile += '</head>'
  excelFile += '<body>'
  excelFile += table
  excelFile += '</body>'
  excelFile += '</html>'
  let uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(excelFile)
  let link = document.createElement('a')
  link.href = uri
  link.style = 'visibility:hidden'
  link.download = FileName + '.xls'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportCsv (jsonData, label, fileName) {
  // 列标题，逗号隔开，每一个逗号就是隔开一个单元格
  let str = `${label}\n`
  // 增加\t为了不让表格显示科学计数法或者其他格式
  for (let i = 0; i < jsonData.length; i++) {
    for (let item in jsonData[i]) {
      str += `${jsonData[i][item] + '\t'},`
    }
    str += '\n'
  }
  // encodeURIComponent解决中文乱码
  let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str)
  // 通过创建a标签实现
  var link = document.createElement('a')
  link.href = uri
  // 对下载的文件命名
  link.download = `${fileName}.csv`
  document.body.appendChild(link)
  link.click()
}

export function formatSearchTags (options) {
  const arr = []
  Object.keys(options).map(key => {
    const obj = options[key]
    let _value
    let isShow = false
    const { filter, type, format, value, name } = obj
    if (filter !== false) {
      if (type === 'array') {
        isShow = value && value.length > 0
        if (isShow) {
          const arr = []
          value.map(x => {
            arr.push(format ? format[x] : x)
          })
          _value = arr.join(',')
        }
      } else if (type === 'date-range') {
        isShow = value && value.length > 0 && value[0] && value[1]
        if (isShow) {
          _value = `${format ? dayjs(value[0]).format(format) : value[0]} - ${format ? dayjs(value[1]).format(format) : value[1]}`
        }
      } else if (type === 'date') {
        isShow = !!value
        if (isShow) {
          _value = format ? dayjs(value).format(format) : value
        }
      } else {
        isShow = !!value
        if (isShow) {
          _value = format ? format[value] : value
        }
      }
      if (isShow) {
        arr.push({ key, name, value: _value })
      }
    }
  })
  return arr
}

export function initSearchValue (option, key) {
  if (key) {
    if (option[key]) {
      option[key]['value'] = option[key]['initValue']
    }
  } else {
    Object.keys(option).map(_key => {
      const { filter, initValue } = option[_key]
      if (filter !== false) {
        option[_key].value = initValue
      }
    })
  }
}
