import http from '@/libs/http'
import config from '@/config'

const prefix = `${config.getUrl('service')}/User/Login`

export async function signOut (params) {
  return http.autoError.post(`${prefix}/SignOut`, params)
}
