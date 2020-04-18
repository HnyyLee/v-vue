
export const historyColumns = [
  { 
    title: '工单编号', 
    dataIndex: 'code',
    width: 140, 
    align: 'center' 
  },
  { 
    title: '工单名称', 
    dataIndex: 'title', 
    width: 140, 
    align: 'center' 
  },
  { 
    title: '签约金额', 
    dataIndex: 'signedMoney', 
    width: 70, 
    align: 'center' 
  },
  { 
    title: '报价方案', 
    dataIndex: 'pricingProposalId', 
    width: 70, 
    align: 'center', 
    scopedSlots: { customRender: 'pricingProposalId' } 
  },
  { 
    title: '设计方案', 
    dataIndex: 'workOrderDesignId', 
    width: 70, 
    align: 'center', 
    scopedSlots: { customRender: 'workOrderDesignId' } 
  },
  { 
    title: '合同信息', 
    dataIndex: 'contractTemp', 
    width: 80, 
    align: 'center', 
    scopedSlots: { customRender: 'contractTemp' } 
  },
  { 
    title: '合同文本', 
    dataIndex: 'contractPreview', 
    width: 80, 
    align: 'center', 
    scopedSlots: { customRender: 'contractPreview' } 
  },
  { 
    title: '合同状态', 
    dataIndex: 'contractStatus', 
    width: 80, 
    align: 'center', 
    scopedSlots: { customRender: 'contractStatus' } 
  },
  { 
    title: '审核状态', 
    dataIndex: 'operation', 
    width: 80, align: 'center', 
    scopedSlots: { customRender: 'operation' } 
  },
  { 
    title: '审核时间', 
    dataIndex: 'operationTime', 
    width: 110,
    align: 'center' 
  },
  { 
    title: '签署时间', 
    dataIndex: 'signDate', 
    width: 110,
    align: 'center' 
  },
  { 
    title: '操作', 
    dataIndex: 'action', 
    width: 100, 
    align: 'center', 
    scopedSlots: { customRender: 'action' } 
  },
]

