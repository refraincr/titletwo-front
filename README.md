# 社会治理数据分析与风险预警系统 — 前端（登录/权限骨架）

## 技术栈
Vue3 + Vite + Element Plus + Vue Router + Pinia（含 persistedstate 持久化）+ axios

## 快速开始
```bash
npm install
npm run dev
```
默认端口 5173，开发环境下 `/api` 会被代理到后端 `http://localhost:8080`
（见 vite.config.js），后端接口地址若变化，改这里的 proxy target 即可。

## 目录结构
```
src/
  api/auth.js               登录 / 注册 / 获取用户信息 接口封装
  utils/request.js          axios 实例，统一处理 token 注入与 401/403/success:false
  utils/role.js             角色常量、角色<->菜单/按钮权限映射表（骨架阶段占位菜单）
  stores/user.js            Pinia 用户状态（token/用户名/角色），持久化到 localStorage
  directives/permission.js  v-permission 按钮级权限指令
  router/index.js           路由与登录/权限守卫
  layout/MainLayout.vue     侧边栏 + 顶部栏主布局，菜单按角色动态渲染
  views/
    Login.vue                登录页
    Register.vue             注册页（含角色选择）
    Home.vue / PriorityReport.vue / AdminPanel.vue / Profile.vue   各角色占位页
    Forbidden.vue / NotFound.vue   403 / 404
```

## 角色映射
| 后端 role | 角色名称 | 对应实施方案文档角色 | 默认登录后跳转 |
|---|---|---|---|
| 1 | 数据分析员 | 其他单位 | /home |
| 2 | 风险上报员 | 重点人群 | /report |
| 3 | 系统管理员 | 县综治中心 | /home |

## 已对接的后端接口
- `POST /login` `{username, password}` → `data` 为 JWT 字符串
- `POST /register` `{username, password, role}`
- `GET /user/info`（需带 `Authorization: Bearer <token>`）→ `{role, username}`

## 权限处理逻辑
- 请求头统一携带 `Authorization: Bearer <token>`（`utils/request.js` 请求拦截器）
- HTTP 401（未登录/token 失效）→ 清除本地登录态，跳转登录页
- HTTP 403（无权限）→ 提示"无权限访问"，停留原页
- 业务失败（`success:false`，如登录密码错误）→ 用 `message` 做 toast 提示
- 退出登录为纯前端行为：清空本地 token/用户信息并跳转登录页（后端未提供 /logout 接口）
- 菜单/按钮权限均为前端按角色写死映射（`utils/role.js`），后续如需后端动态下发菜单，
  替换该文件里 `MENU_MAP`/`BUTTON_PERM_MAP` 的数据来源即可，其余代码无需改动

## 骨架阶段范围说明
当前菜单仅为占位（首页/重点事件录入/系统管理/个人中心），
具体业务页面（数据接入、风险档案、审核池、规则管理、统计分析等）
将在后续对应任务中逐步接入，替换占位页面即可，不影响登录权限骨架结构。
