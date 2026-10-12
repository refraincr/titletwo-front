import request from '../utils/request'

/**
 * 查询事件的风险计算依据
 * @param {string} eventId 事件 ID（雪花 ID 字符串，后端为 Long，不要转 Number，避免精度丢失）
 * @returns Promise<{code, data: {keywords: string|null, isSpecialAccount: boolean, partyEventCount: number}, message, success}>
 *   keywords 为 JSON 数组字符串，null 表示未命中
 */
export function getRiskRead(eventId) {
  return request.get('/risk/read', { params: { eventId } })
}