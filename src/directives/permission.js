import { useUserStore } from '../stores/user'

/**
 * v-permission="'user:create'"
 * 当前角色的按钮权限标识列表中不包含该值时，直接移除该元素（不可见，而非仅禁用）。
 */
export default {
  mounted(el, binding) {
    const userStore = useUserStore()
    const required = binding.value
    if (!required) return
    const has = userStore.buttonPerms.includes(required)
    if (!has) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  },
}
