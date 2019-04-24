import http from '@/libs/http'
import config from '@/config'

const prefix = `${config.getUrl('service')}/User/Config`
const addressPrefix = `${config.getUrl('service')}/OA/InternalAddress`

/**
 * 获取用户信息
 * @param params
 * @returns {Promise<*>}
 */
export async function getUserInfo (params) {
  return http.autoError.get(`${prefix}/GetUserInfo`, params)
}

/**
 * 保持登录
 * @param params
 * @returns {Promise<*>}
 */
export async function stayLogin (params) {
  return http.autoError.get(`${prefix}/StayLogin`, params)
}

/**
 * 获取用户菜单栏
 * @param params
 * @returns {Promise<*>}
 */
export async function getUserMenu (params) {
  return http.autoError.get(`${config.url.prod.service}/User/Config/GetUserMenu`, params)
}

/**
 * 获取通讯录
 * @param params
 * @returns {Promise<*>}
 */
export async function getAddress (params) {
  return http.autoError.get(`${addressPrefix}/Get`, params)
}
