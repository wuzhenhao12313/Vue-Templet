import http from '@/libs/http'
import config from '@/config'

const prefix = `${config.getUrl('service')}/OA/Hr/Employee`

export async function getCount (params) {
  return http.autoError.get(`${prefix}/GetCount`, params)
}

export async function getManNFemaleRate (params) {
  return http.autoError.get(`${prefix}/GetManNFemaleRate`, params)
}

export async function getAgeRate (params) {
  return http.autoError.get(`${prefix}/GetAgeRate`, params)
}

export async function getWorkYearRate (params) {
  return http.autoError.get(`${prefix}/GetWorkYearRate`, params)
}

export async function getDepEmployeeCount (params) {
  return http.autoError.get(`${prefix}/GetDepEmployeeCount`, params)
}

export async function getMonthEmployeeChangeData (params) {
  return http.autoError.get(`${prefix}/GetMonthEmployeeChangeData`, params)
}

export async function getEmployeeList (params) {
  return http.autoError.get(`${prefix}/Get`, params)
}
