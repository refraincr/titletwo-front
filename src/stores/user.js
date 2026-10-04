import { defineStore } from 'pinia'
import { getMenusByRole, getButtonPermsByRole } from '../utils/role'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    username: '',
    role: null, // 1 数据分析员 / 2 风险上报员 / 3 系统管理员
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
    menus: (state) => getMenusByRole(state.role),
    buttonPerms: (state) => getButtonPermsByRole(state.role),
  },
  actions: {
    setToken(token) {
      this.token = token
    },
    setUserInfo({ username, role }) {
      this.username = username
      this.role = role
    },
    clearUser() {
      this.token = ''
      this.username = ''
      this.role = null
    },
  },
  persist: {
    key: 'sgtm-user', // 社会治理(shehui-zhili) 用户态持久化 key
    storage: localStorage,
  },
})
