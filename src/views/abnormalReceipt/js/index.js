
export const auditedColumns = [
  {
    title: '订单名称',
    dataIndex: 'workOrderTitle'
  },
  {
    title: '客户电话',
    dataIndex: 'customerPhone'
  },
  {
    title: '区',
    dataIndex: 'district'
  },
  {
    title: '小区',
    dataIndex: 'project'
  },
  {
    title: '栋',
    dataIndex: 'building'
  },
  {
    title: '单元-房号',
    dataIndex: 'house'
  },
  {
    title: '设计师',
    dataIndex: 'designerName'
  },
  {
    title: '合同额',
    dataIndex: 'signedMoney'
  },
  {
    title: '本次异常收款额',
    dataIndex: 'underLineAmount'
  },
  {
    title: '收款方式',
    dataIndex: 'status'
  },
  {
    title: '实收合计',
    dataIndex: 'receivedAmount'
  },
  {
    title: '查看详情',
    dataIndex: 'detail',
    scopedSlots: { customRender: 'detail' }
  },
  {
    title: '是否通过',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
auditedColumns.forEach(item => {
  item.align = 'center'
})

export const detailColumns = [
  {
    title: '收款金额',
    dataIndex: 'underLineAmount'
  },
  {
    title: '状态',
    dataIndex: 'statusName'
  },
  {
    title: '支付时间',
    dataIndex: 'paymentTime'
  },
  {
    title: '收款方式',
    dataIndex: 'paymentName'
  },
]
detailColumns.forEach(item => {
  item.align = 'center'
})

export const AuditeListColumns = [
  {
    title: '款项',
    dataIndex: 'receivableType'
  },
  {
    title: '应收',
    dataIndex: 'receivableAmount'
  },
  {
    title: '工程变更应收',
    dataIndex: 'changeAmount'
  },
  {
    title: '应收合计',
    dataIndex: 'totalAmount'
  },
  {
    title: '实收合计',
    dataIndex: 'receivedAmount'
  },
  {
    title: '状态',
    dataIndex: 'statusName'
  },
  {
    title: '完全收款时间',
    dataIndex: 'paymentTime'
  },
]
AuditeListColumns.forEach(item => {
  item.align = 'center'
})

