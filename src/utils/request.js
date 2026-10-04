import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '../router'
import { useUserStore } from '../stores/user'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// 请求拦截器：自动附带 Authorization: Bearer <token>
request.interceptors.request.use((config) => {
  const userStore = useUserStore()
  if (userStore.token) {
    config.headers.Authorization = `Bearer ${userStore.token}`
  }
  return config
})

// 响应拦截器：统一处理后端约定的响应格式 { code, data, message, success }
// 与 HTTP 层面的 401 / 403
request.interceptors.response.use(
  (response) => {
    const res = response.data
    // 后端约定：success !== true 视为业务失败，用 message 提示，交由调用方 catch 处理
    if (res && res.success === false) {
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(res)
    }
    return res
  },
  (error) => {
    const status = error.response?.status

    if (status === 401) {
      // token 缺失/失效：清除本地登录状态，跳转登录页
      const userStore = useUserStore()
      const onLoginPage = router.currentRoute.value.path === '/login'
      userStore.clearUser()
      if (!onLoginPage) {
        ElMessage.error('登录状态已失效，请重新登录')
        router.push('/login')
      }
    } else if (status === 403) {
      // 有登录态但无权限：停留原页，仅提示
      ElMessage.error('无权限访问该功能')
    } else {
      ElMessage.error(error.message || '网络错误，请稍后重试')
    }
    return Promise.reject(error)
  }
)

export default request
