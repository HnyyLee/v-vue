
export const siteColumns = [
  {
    title: '订单编号',
    dataIndex: 'code',
    width: 200,
    scopedSlots: { customRender: 'code' }
  },
  {
    title: '订单名称',
    dataIndex: 'title'
  },
  {
    title: '客户电话',
    dataIndex: 'customerPhone'
  },
  {
    title: '客户名称',
    width: 120,
    dataIndex: 'customerName'
  },
  {
    title: '省',
    width: 80,
    dataIndex: 'province'
  },
  {
    title: '市',
    width: 80,
    dataIndex: 'city'
  },
  {
    title: '区',
    width: 120,
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
    title: '房号',
    dataIndex: 'house'
  },
  {
    title: '工地状态',
    dataIndex: 'statusStr'
  },
  {
    title: '报单时间',
    dataIndex: 'declarationTime'
  },
  {
    title: '领取时间',
    dataIndex: 'receiveTime'
  },
  {
    title: '跟单天数',
    dataIndex: 'documentaryDays'
  },
  {
    title: '已收定金',
    dataIndex: 'earnestMoney'
  },
  {
    title: '签约金额',
    dataIndex: 'signedMoney'
  },
  {
    title: '已收款',
    dataIndex: 'paidMoney'
  },
  {
    title: '收款比例',
    dataIndex: 'collectionRatio'
  },
  {
    title: '合同开工日期',
    dataIndex: 'planStartConstructionTime'
  },
  {
    title: '合同完工日期',
    dataIndex: 'planEndConstructionTime'
  },
  {
    title: '实际开工',
    dataIndex: 'realStartConstructionTime'
  },
  {
    title: '预计完工',
    dataIndex: 'estimateEndConstructionTime'
  },
  {
    title: '实际完工',
    dataIndex: 'realEndConstructionTime'
  },
  {
    title: '延期天数',
    dataIndex: 'planDelayDay'
  },
  {
    title: '备注',
    dataIndex: 'remark'
  },
  {
    title: '报单来源',
    dataIndex: 'sourceStr'
  },
  {
    title: '报单人员',
    dataIndex: 'submitter'
  },
  {
    title: '客服人员',
    dataIndex: 'customerServiceName'
  },
  {
    title: '设计师',
    dataIndex: 'designName'
  },
]
siteColumns.forEach(item => {
  item.align = 'center'
})


export const deferColumns = [
  {
    title: '延期原因',
    dataIndex: 'delayReason',
  },
  {
    title: '延期开始时间',
    dataIndex: 'delayStartTime',
  },
  {
    title: '预计延期天数',
    dataIndex: 'planDelayDay',
  },
  {
    title: '申请人',
    dataIndex: 'applierName',
  },
  {
    title: '延期单(点击查看)',
    dataIndex: 'pictures',
    scopedSlots: { customRender: 'pictures' }
  }
]
deferColumns.forEach(item => {
  item.align = 'center'
})

export const aVitery = {
  pickDate:  [ 'pickDate', { rules: [ { required: true, message: '请选择延期开始时间' } ] } ],
  planDelayDay: [ 'planDelayDay', { rules: [ { required: true, message: '请输入预计延期天数' } ] } ],
  reason: [ 'reason', { rules: [ { required: true, message: '请选择延期原因' } ] } ],
}

