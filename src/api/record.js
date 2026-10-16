import request from '../utils/request'

/**
 * 分页查询风险事件
 * @param {{currentPage: number, pageSize: number, occurredStart?: string, occurredEnd?: string,
 *   gmtCreateStart?: string, gmtCreateEnd?: string, partyName?: string, disputeType?: string, keyword?: string}} params
 *   时间格式：YYYY-MM-DDTHH:mm:ss；currentPage 从 1 开始
 * @returns Promise<{code, data: {currentPage, pageSize, totalSize, dataList: Array}, message, success}>
 */
export function getRecordPage(params) {
  return request.get('/record/page', { params })
}

/**
 * 新增风险事件
 * 必填（后端）：occurredAt、disputeType、problemDescription
 */
export function addRecord(data) {
  return request.post('/record/input', data)
}

/**
 * 编辑风险事件（需要后端 edit 方法参数加 @RequestBody）
 * @param {{id: string}} data id 为字符串（雪花 ID，需后端序列化为字符串）
 */
export function editRecord(data) {
  return request.put('/record/edit', data)
}

/**
 * 删除风险事件（软删除）
 * @param {string} id
 */
export function deleteRecord(id) {
  return request.delete('/record/del', { params: { id } })
}

/**
 * Excel/CSV 导入风险事件（xls / xlsx / csv）
 * 成功无返回内容；校验失败由后端抛 BusinessException，拦截器统一提示，整份文件不入库
 * 同步处理，单独放宽超时到 120 秒
 * @param {File} file 原始文件对象（el-upload 文件的 .raw）
 */
export function importRecord(file) {
  const fd = new FormData()
  fd.append('file', file) // 字段名必须是 file，对应后端 @RequestParam("file")
  return request.post('/record/file_input', fd, {
    timeout: 120000,
    // 显式声明，防止实例默认的 JSON Content-Type 把 FormData 序列化掉
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

/**
 * 下载导入模板（后端生成的 xlsx）
 * 路径为占位，按后端实际接口修改
 * @returns Promise<Blob | AxiosResponse> 取决于 utils/request 拦截器是否解包
 */
export function downloadImportTemplate() {
  return request.get('/record/import_template', {
    responseType: 'blob',
    timeout: 30000,
  })
}