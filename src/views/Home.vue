<template>
  <div class="page">
    <!-- 筛选区 -->
    <el-card shadow="never" class="block">
      <el-form :model="query" inline @submit.prevent="onSearch">
        <el-form-item label="发生时间">
          <el-date-picker
            v-model="occurredRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始"
            end-placeholder="结束"
            :value-format="TIME_FORMAT"
          />
        </el-form-item>
        <el-form-item label="上报时间">
          <el-date-picker
            v-model="createRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始"
            end-placeholder="结束"
            :value-format="TIME_FORMAT"
          />
        </el-form-item>
        <el-form-item label="当事人">
          <el-input v-model="query.partyName" placeholder="姓名" clearable style="width: 140px" />
        </el-form-item>
        <el-form-item label="部门">
          <el-input v-model="query.department" placeholder="部门" clearable style="width: 140px" />
        </el-form-item>
        <el-form-item label="纠纷类型">
          <el-input v-model="query.disputeType" placeholder="纠纷类型" clearable style="width: 160px" />
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="query.keyword" placeholder="关键词" clearable style="width: 160px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit">查询</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="canEdit" type="primary" @click="openForm()">手动录入</el-button>
          <el-button v-if="canEdit" type="primary" @click="openForm()">Excel导入</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 列表 -->
    <el-card shadow="never" class="block">
      <div class="toolbar">
        <span class="title">风险事件</span>
        <!-- <el-button v-if="canEdit" type="primary" @click="openForm()">新增事件</el-button> -->
      </div>

      <el-table :data="list" v-loading="loading" border row-key="id">
        <el-table-column label="发生时间" width="170">
          <template #default="{ row }">{{ fmtTime(row.occurredAt) }}</template>
        </el-table-column>
        <el-table-column prop="partyName" label="当事人" width="110" show-overflow-tooltip />
        <el-table-column prop="disputeType" label="纠纷类型" width="130" show-overflow-tooltip />
        <el-table-column prop="problemDescription" label="具体问题" min-width="220" show-overflow-tooltip />
        <el-table-column label="风险等级" width="90" align="center">
          <template #default="{ row }">
            <el-tag v-if="RISK_MAP[row.eventRiskLevel]" size="small" :type="RISK_MAP[row.eventRiskLevel].type">
              {{ RISK_MAP[row.eventRiskLevel].label }}
            </el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="处理期限" width="170">
          <template #default="{ row }">
            <span :class="{ overdue: isOverdue(row) }">{{ fmtTime(row.handlingDeadline) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否办结" width="90" align="center">
          <template #default="{ row }">
            <el-tag size="small" :type="row.isCompleted === 1 ? 'success' : 'info'">
              {{ row.isCompleted === 1 ? '已办结' : '未办结' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="复核状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag size="small" :type="row.reviewStatus === 1 ? 'success' : 'warning'">
              {{ row.reviewStatus === 1 ? '已复核' : '待复核' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="上报时间" width="170">
          <template #default="{ row }">{{ fmtTime(row.gmtCreate) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="170" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openDetail(row)">详情</el-button>
            <template v-if="canEdit">
              <el-button link type="primary" @click="openForm(row)">编辑</el-button>
              <el-button link type="danger" @click="onDelete(row)">删除</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>

      <div class="pager">
        <el-pagination
          v-model:current-page="page.currentPage"
          v-model:page-size="page.pageSize"
          :total="page.total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="fetchList"
          @size-change="onSearch"
        />
      </div>
    </el-card>

    <!-- 新增 / 编辑 -->
    <el-dialog
      v-model="formVisible"
      :title="form.id ? '编辑事件' : '新增事件'"
      width="720px"
      :close-on-click-modal="false"
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="96px">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="当事人姓名" prop="partyName">
              <el-input v-model="form.partyName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="partyPhone">
              <el-input v-model="form.partyPhone" placeholder="手机号或座机号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号" prop="partyIdCard">
              <el-input v-model="form.partyIdCard" maxlength="18" placeholder="选填" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系地址" prop="partyAddress">
              <el-input v-model="form.partyAddress" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发生时间" prop="occurredAt">
              <el-date-picker v-model="form.occurredAt" type="datetime" :value-format="TIME_FORMAT" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经办人" prop="handlerName">
              <el-input v-model="form.handlerName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="事件来源" prop="eventSource">
              <el-select v-model="form.eventSource" filterable allow-create clearable default-first-option placeholder="选填，可手动输入" style="width: 100%">
                <el-option v-for="o in SOURCE_OPTIONS" :key="o" :label="o" :value="o" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="事件类别" prop="eventCategory">
              <el-select v-model="form.eventCategory" filterable allow-create clearable default-first-option placeholder="选填，可手动输入" style="width: 100%">
                <el-option v-for="o in CATEGORY_OPTIONS" :key="o" :label="o" :value="o" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="纠纷类型" prop="disputeType">
              <el-select v-model="form.disputeType" filterable allow-create default-first-option placeholder="请选择或输入" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="处理期限" prop="handlingDeadline">
              <el-date-picker v-model="form.handlingDeadline" type="datetime" :value-format="TIME_FORMAT" placeholder="选填" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否办结" prop="isCompleted">
              <el-radio-group v-model="form.isCompleted">
                <el-radio :value="0">未办结</el-radio>
                <el-radio :value="1">已办结</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="具体问题" prop="problemDescription">
              <el-input v-model="form.problemDescription" type="textarea" :rows="3" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="处理情况" prop="handlingDescription">
              <el-input v-model="form.handlingDescription" type="textarea" :rows="3" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="选填" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="onSave">保存</el-button>
      </template>
    </el-dialog>

    <!-- 详情 -->
    <el-drawer v-model="detailVisible" title="事件详情" size="560px" @closed="onDetailClosed">
      <template v-if="detail">
        <!-- 风险依据：独立加载，不影响下方主表格 -->
        <div class="risk-basis">
          <div class="risk-basis__head">
            <span class="risk-basis__title">风险依据</span>
            <el-tag v-if="RISK_MAP[detail.eventRiskLevel]" size="small" :type="RISK_MAP[detail.eventRiskLevel].type">
              {{ RISK_MAP[detail.eventRiskLevel].label }}
            </el-tag>
            <span v-else class="risk-basis__muted">-</span>
          </div>
          <div v-loading="riskLoading" class="risk-basis__body">
            <div v-if="riskForbidden" class="risk-basis__tip">无权查看风险依据</div>
            <div v-else-if="riskError" class="risk-basis__tip">
              依据加载失败
              <el-button link type="primary" @click="loadRisk(detail.id)">重试</el-button>
            </div>
            <el-descriptions v-else-if="risk" :column="1" border label-width="190px">
              <el-descriptions-item label="命中关键词（影响风险等级）">
                <template v-if="riskKeywords.length">
                  <el-tag v-for="(k, i) in riskKeywords" :key="i" size="small" type="danger" class="risk-basis__tag">
                    {{ k }}
                  </el-tag>
                </template>
                <span v-else class="risk-basis__muted">未命中风险关键词</span>
              </el-descriptions-item>
              <el-descriptions-item label="是否特殊账号">
                <el-tag v-if="riskSpecial === true" size="small" type="danger">特殊账号</el-tag>
                <el-tag v-else-if="riskSpecial === false" size="small" type="info">否</el-tag>
                <span v-else>-</span>
              </el-descriptions-item>
              <el-descriptions-item label="当事人关联事件次数">
                {{ risk.partyEventCount != null ? `${risk.partyEventCount} 次` : '-' }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </div>

        <el-descriptions :column="1" border label-width="110px">
          <el-descriptions-item label="发生时间">{{ fmtTime(detail.occurredAt) }}</el-descriptions-item>
          <el-descriptions-item label="具体问题">{{ detail.problemDescription || '-' }}</el-descriptions-item>
          <el-descriptions-item label="当事人姓名">{{ detail.partyName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="身份证号">{{ detail.partyIdCard || '-' }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ detail.partyPhone || '-' }}</el-descriptions-item>
          <el-descriptions-item label="联系地址">{{ detail.partyAddress || '-' }}</el-descriptions-item>
          <el-descriptions-item label="经办人">{{ detail.handlerName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="处理情况">{{ detail.handlingDescription || '-' }}</el-descriptions-item>
          <el-descriptions-item label="事件来源">{{ detail.eventSource || '-' }}</el-descriptions-item>
          <el-descriptions-item label="事件类别">{{ detail.eventCategory || '-' }}</el-descriptions-item>
          <el-descriptions-item label="纠纷类型">{{ detail.disputeType || '-' }}</el-descriptions-item>
          <el-descriptions-item label="风险等级">{{ RISK_MAP[detail.eventRiskLevel]?.label || '-' }}</el-descriptions-item>
          <el-descriptions-item label="处理期限">{{ fmtTime(detail.handlingDeadline) }}</el-descriptions-item>
          <el-descriptions-item label="是否办结">{{ detail.isCompleted === 1 ? '已办结' : '未办结' }}</el-descriptions-item>
          <el-descriptions-item label="复核状态">{{ detail.reviewStatus === 1 ? '已复核' : '待复核' }}</el-descriptions-item>
          <el-descriptions-item label="提取关键词">{{ detail.keywordTags || '-' }}</el-descriptions-item>
          <el-descriptions-item label="匹配状态">{{ detail.matchStatus ?? '-' }}</el-descriptions-item>
          <el-descriptions-item label="匹配人员档案">{{ detail.matchedPersonId ?? '-' }}</el-descriptions-item>
          <el-descriptions-item label="匹配时间">{{ fmtTime(detail.matchedAt) }}</el-descriptions-item>
          <el-descriptions-item label="备注">{{ detail.remark || '-' }}</el-descriptions-item>
          <el-descriptions-item label="上报人">{{ detail.createdBy || '-' }}</el-descriptions-item>
          <el-descriptions-item label="上报时间">{{ fmtTime(detail.gmtCreate) }}</el-descriptions-item>
          <el-descriptions-item label="最后修改人">{{ detail.modifiedBy || '-' }}</el-descriptions-item>
          <el-descriptions-item label="最后修改时间">{{ fmtTime(detail.gmtModified) }}</el-descriptions-item>
        </el-descriptions>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '../stores/user'
import { getRecordPage, addRecord, editRecord, deleteRecord } from '../api/record'
import { getRiskRead } from '../api/risk'

// 角色：2-风险上报员，3-系统管理员 可新增/编辑/删除；1-数据分析员只读
// 仅用于控制按钮显示，真正的权限以后端校验为准
const EDIT_ROLES = ['ANALYST', 'REPORTER', 'ADMIN']

const TIME_FORMAT = 'YYYY-MM-DD[T]HH:mm:ss'
const RISK_MAP = {
  LOW: { label: '低', type: 'success' },
  NORMAL: { label: '中', type: 'warning' },
  HIGH: { label: '高', type: 'danger' },
}
const SOURCE_OPTIONS = ['群众上报', '12345热线', '网格巡查']
const CATEGORY_OPTIONS = ['民事纠纷', '劳动纠纷', '邻里纠纷']

const userStore = useUserStore()
const canEdit = computed(() => EDIT_ROLES.includes(userStore.role))

const fmtTime = (v) => (v ? String(v).replace('T', ' ') : '-')
const isOverdue = (row) =>
  row.isCompleted !== 1 && row.handlingDeadline && new Date(row.handlingDeadline) < new Date()

// ---------- 列表 ----------
const query = reactive({ partyName: '', disputeType: '', keyword: '',department: '' })
const occurredRange = ref(null)
const createRange = ref(null)
const page = reactive({ currentPage: 1, pageSize: 10, total: 0 })
const list = ref([])
const loading = ref(false)

function buildParams() {
  const params = { currentPage: page.currentPage, pageSize: page.pageSize }
  Object.entries(query).forEach(([k, v]) => {
    if (v) params[k] = v
  })
  if (occurredRange.value) {
    params.occurredStart = occurredRange.value[0]
    params.occurredEnd = occurredRange.value[1]
  }
  if (createRange.value) {
    params.gmtCreateStart = createRange.value[0]
    params.gmtCreateEnd = createRange.value[1]
  }
  return params
}

async function fetchList() {
  loading.value = true
  try {
    const res = await getRecordPage(buildParams())
    list.value = res.data?.dataList || []
    page.total = Number(res.data?.totalSize) || 0
  } catch {
    // 错误提示已由 request 拦截器统一处理
  } finally {
    loading.value = false
  }
}

function onSearch() {
  page.currentPage = 1
  fetchList()
}

function onReset() {
  Object.assign(query, { partyName: '', disputeType: '', keyword: '' })
  occurredRange.value = null
  createRange.value = null
  onSearch()
}

// ---------- 新增 / 编辑 ----------
const emptyForm = () => ({
  id: undefined,
  partyName: '',
  partyPhone: '',
  partyIdCard: '',
  partyAddress: '',
  occurredAt: '',
  handlerName: '',
  handlingDescription: '',
  eventSource: '',
  eventCategory: '',
  disputeType: '',
  eventRiskLevel: '',
  handlingDeadline: '',
  isCompleted: 0,
  problemDescription: '',
  remark: '',
})

const formVisible = ref(false)
const saving = ref(false)
const formRef = ref()
const form = reactive(emptyForm())

const req = (msg) => ({ required: true, message: msg, trigger: ['blur', 'change'] })
const PHONE_RE = /^(1[3-9]\d{9}|0\d{2,3}-?\d{7,8})$/
const IDCARD_RE = /^\d{17}[\dXx]$/

const rules = {
  partyName: [req('请输入当事人姓名')],
  partyPhone: [
    req('请输入联系电话'),
    { pattern: PHONE_RE, message: '请输入正确的手机号或座机号', trigger: 'blur' },
  ],
  // 选填：为空不校验，填了才校验格式
  partyIdCard: [{ pattern: IDCARD_RE, message: '请输入18位身份证号', trigger: 'blur' }],
  partyAddress: [req('请输入联系地址')],
  occurredAt: [req('请选择发生时间')],
  handlerName: [req('请输入经办人姓名')],
  handlingDescription: [req('请输入处理情况')],
  disputeType: [req('请选择或输入纠纷类型')],
  isCompleted: [req('请选择是否办结')],
  problemDescription: [req('请输入具体问题')],
}

function openForm(row) {
  Object.assign(form, emptyForm())
  if (row) {
    // 只带入可编辑字段；复核/匹配等系统字段不提交，避免误覆盖
    Object.keys(emptyForm()).forEach((k) => {
      if (row[k] !== null && row[k] !== undefined) form[k] = row[k]
    })
  }
  formVisible.value = true
}

function resetForm() {
  Object.assign(form, emptyForm())
  formRef.value?.clearValidate()
}

async function onSave() {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  saving.value = true
  try {
    const payload = { ...form }
    if (form.id) {
      await editRecord(payload)
      ElMessage.success('保存成功')
    } else {
      delete payload.id
      await addRecord(payload)
      ElMessage.success('新增成功')
    }
    formVisible.value = false
    if (!form.id) page.currentPage = 1
    fetchList()
  } catch {
    // 错误提示已由 request 拦截器统一处理
  } finally {
    saving.value = false
  }
}

// ---------- 详情 ----------
const detailVisible = ref(false)
const detail = ref(null)

// 风险依据：每次打开抽屉都重新请求，不缓存
const risk = ref(null)
const riskLoading = ref(false)
const riskError = ref(false)
const riskForbidden = ref(false)
let riskSeq = 0 // 请求序号：响应回来时序号已变，说明抽屉已切换/关闭，丢弃结果

// keywords 为 JSON 数组字符串：null / [] 视为未命中；解析失败则原样作为一个标签显示，不吞掉异常数据
function parseKeywords(raw) {
  if (raw === null || raw === undefined || raw === '') return []
  try {
    const arr = JSON.parse(raw)
    if (Array.isArray(arr)) return arr.map(String).filter((s) => s !== '')
  } catch {
    // 落到下面的原样显示
  }
  return [String(raw)]
}

const riskKeywords = computed(() => parseKeywords(risk.value?.keywords))

// 兼容 true/1、false/0；其他（null/undefined）返回 null 显示“-”
const riskSpecial = computed(() => {
  const v = risk.value?.isSpecialAccount
  if (v === true || v === 1) return true
  if (v === false || v === 0) return false
  return null
})

async function loadRisk(eventId) {
  const seq = ++riskSeq
  risk.value = null
  riskError.value = false
  riskForbidden.value = false
  riskLoading.value = true
  try {
    const res = await getRiskRead(eventId)
    if (seq !== riskSeq) return
    risk.value = res.data || {}
  } catch (err) {
    if (seq !== riskSeq) return
    // 403：无权限，不提供重试；其余（业务失败/网络错误）允许重试。toast 已由拦截器统一弹出
    if (err?.response?.status === 403) riskForbidden.value = true
    else riskError.value = true
  } finally {
    if (seq === riskSeq) riskLoading.value = false
  }
}

function openDetail(row) {
  detail.value = row
  detailVisible.value = true
  loadRisk(row.id)
}

function onDetailClosed() {
  riskSeq++ // 作废仍在途的请求
  risk.value = null
  riskLoading.value = false
  riskError.value = false
  riskForbidden.value = false
}

// ---------- 删除（软删除） ----------
async function onDelete(row) {
  try {
    await ElMessageBox.confirm(
      `确定删除【${row.partyName || '未命名'}】${fmtTime(row.occurredAt)} 的这条记录吗？`,
      '删除确认',
      { type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消' }
    )
  } catch {
    return
  }
  try {
    await deleteRecord(row.id)
    ElMessage.success('删除成功')
    // 删除当前页最后一条时回到上一页
    if (list.value.length === 1 && page.currentPage > 1) page.currentPage -= 1
    fetchList()
  } catch {
    // 错误提示已由 request 拦截器统一处理
  }
}

onMounted(fetchList)
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.block {
  border: 1px solid var(--color-line);
}
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.title {
  font-size: 16px;
  font-weight: 600;
}
.pager {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
.overdue {
  color: var(--el-color-danger);
  font-weight: 600;
}

/* 风险依据 */
.risk-basis {
  margin-bottom: 20px;
}
.risk-basis__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.risk-basis__title {
  font-size: 15px;
  font-weight: 600;
}
.risk-basis__body {
  min-height: 56px;
}
.risk-basis__tip,
.risk-basis__muted {
  color: var(--el-text-color-secondary);
}
.risk-basis__tip {
  padding: 16px 0;
  text-align: center;
}
.risk-basis__tag {
  margin: 0 6px 4px 0;
}
</style>