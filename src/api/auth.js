import request from '../utils/request'

/**
 * 登录
 * @param {{username: string, password: string}} data
 * @returns Promise<{code, data: string(JWT), message, success}>
 */
export function login(data) {
  return request.post('/login', data)
}

/**
 * 注册
 * @param {{username: string, password: string, role: number}} data
 *   role: 1-数据分析员（其他单位）2-风险上报员（重点人群）3-系统管理员（县综治中心）
 */
export function register(data) {
  return request.post('/register', data)
}

/**
 * 获取当前登录用户信息（角色等）
 * @returns Promise<{code, data: {role: number, username: string}, message, success}>
 */
export function getUserInfo() {
  return request.get('/user/info')
}


/**
 * 查询单位
*/
export function getUnits() {
  return request.get('/auth/units')
}