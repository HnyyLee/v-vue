// 老页面的内容数据
let receiptTitle = [
  {
    title: '款项',
    align: 'center',
    dataIndex: 'receivableType'
  },
  {
    title: '应收额',
    align: 'center',
    dataIndex: 'receivableAmount'
  },
  {
    title: '工程变更金额',
    align: 'center',
    dataIndex: 'changeAmount'
  },
  {
    title: '合计',
    align: 'center',
    dataIndex: 'totalAmount'
  },
  {
    title: '状态',
    align: 'center',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '收款方式',
    align: 'center',
    dataIndex: 'myPaymentName'
  },
  {
    title: '时间',
    align: 'center',
    dataIndex: 'paymentTime'
  },
  {
    title: '操作',
    align: 'center',
    dataIndex: 'id',
    scopedSlots: { customRender: 'id' }
  }
]

let refundTitle = [
  {
    title: '款项',
    align: 'center',
    width: 100,
    dataIndex: 'receivableType'
  },
  {
    title: '退款金额',
    align: 'center',
    width: 150,
    dataIndex: 'refundAmount'
  },
  {
    title: '状态',
    align: 'center',
    dataIndex: 'status',
    width: 100,
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '退款时间',
    align: 'center',
    width: 150,
    dataIndex: 'refundTime'
  },
  {
    title: '退款原因',
    align: 'center',
    width: 100,
    dataIndex: 'refundReason'
  },
  {
    title: '原因描述',
    align: 'center',
    width: 200,
    dataIndex: 'reasonDesc'
  }
  // {
  //   title: '操作',
  //   align: 'center',
  //   dataIndex: 'id',
  //   scopedSlots: { customRender: 'id' }
  // }
]

let receiptStatus = [
  {
    id: 1,
    name: '未支付'
  },
  {
    id: 2,
    name: '支付中'
  },
  {
    id: 3,
    name: '支付成功'
  },
  {
    id: 4,
    name: '支付失败'
  }
]

let refunStatus = [
  {
    id: 1,
    name: '审核中'
  },
  {
    id: 2,
    name: '已退款'
  },
  {
    id: 3,
    name: '审核拒绝'
  },
  {
    id: 4,
    name: '付款成功'
  },
  {
    id: 5,
    name: '付款失败'
  }
]

let obj = {
  refundTitle, // 退款
  receiptTitle, // 应收款
  receiptStatus, // 应收款状态
  refunStatus // 退款状态
}

export default obj

// 新页面的内容数据
export const depositColumns = [
  {
    title: '款项',
    align: 'center',
    dataIndex: 'receivableType'
  },
  {
    title: '应收额',
    align: 'center',
    dataIndex: 'receivableAmount'
  },
  {
    title: '工程变更金额',
    align: 'center',
    dataIndex: 'changeAmount'
  },
  {
    title: '应收合计',
    align: 'center',
    dataIndex: 'totalAmount'
  },
  {
    title: '实收合计',
    align: 'center',
    dataIndex: 'receivedAmount'
  },
  {
    title: '状态',
    align: 'center',
    dataIndex: 'statusName',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '完全收款时间',
    align: 'center',
    dataIndex: 'paymentTime'
  }
]
export const orderColumns = [
  {
    title: '订单编号',
    align: 'center',
    dataIndex: 'businessOrderNumber'
  },
  {
    title: '收款金额',
    align: 'center',
    dataIndex: 'orderAmount'
  },
  {
    title: '状态',
    align: 'center',
    dataIndex: 'statusName'
  },
  {
    title: '支付时间',
    align: 'center',
    dataIndex: 'paymentTime'
  },
  {
    title: '收款方式',
    align: 'center',
    dataIndex: 'paymentTypeName'
  },
  {
    title: '操作',
    align: 'center',
    width: 200,
    scopedSlots: { customRender: 'action' }
  },
]
export const receiptColumns = [
  {
    title: '款项',
    align: 'center',
    dataIndex: 'receivableType'
  },
  {
    title: '应收额',
    align: 'center',
    dataIndex: 'receivableAmount'
  },
  {
    title: '工程变更金额',
    align: 'center',
    dataIndex: 'changeAmount'
  },
  {
    title: '应收合计',
    align: 'center',
    dataIndex: 'totalAmount'
  },
  {
    title: '实收合计',
    align: 'center',
    dataIndex: 'receivedAmount'
  },
  {
    title: '状态',
    align: 'center',
    dataIndex: 'statusName',
    scopedSlots: { customRender: 'status' }
  }
]
