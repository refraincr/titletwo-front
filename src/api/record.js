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
  return request.post('/record/add', data)
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