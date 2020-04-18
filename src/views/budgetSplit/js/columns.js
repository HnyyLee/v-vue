
export const unDismantledColumns = [
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
    dataIndex: 'customerName'
  },
  {
    title: '省',
    dataIndex: 'province'
  },
  {
    title: '市',
    dataIndex: 'city',
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
    title: '房号',
    dataIndex: 'house'
  },
  {
    title: '工地状态',
    dataIndex: 'statusStr',
  },
  {
    title: '报单时间',
    dataIndex: 'declarationTime',
    width: 150
  },
  {
    title: '领取时间',
    dataIndex: 'receiveTime',
    width: 150
  },
  {
    title: '跟单天数',
    dataIndex: 'documentaryDays',
  },
  {
    title: '已收定金',
    dataIndex: 'earnestMoney',
  },
  {
    title: '签约金额',
    dataIndex: 'signedMoney',
  },
  {
    title: '已收款',
    dataIndex: 'paidMoney',
  },
  {
    title: '收款比例',
    dataIndex: 'collectionRatio',
  },
  {
    title: '合同开工日期',
    dataIndex: 'planStartConstructionTime',
  },
  {
    title: '合同完工日期',
    dataIndex: 'planEndConstructionTime',
  },
  {
    title: '实际开工',
    dataIndex: 'realStartConstructionTime',
  },
  {
    title: '预计完工',
    dataIndex: 'estimateEndConstructionTime',
  },
  {
    title: '实际完工',
    dataIndex: 'realEndConstructionTime',
  },
  {
    title: '延期天数',
    dataIndex: 'planDelayDay',
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
  {
    title: '报单来源',
    dataIndex: 'sourceStr',
  },
  {
    title: '报单人员',
    dataIndex: 'submitter',
  },
  {
    title: '客服人员',
    dataIndex: 'customerServiceName',
  },
  {
    title: '设计师',
    dataIndex: 'designName',
  }
]
unDismantledColumns.forEach(item => {
  item.align = 'center'
})

export const budgetColunms = [
  {
    title: '岗位',
    dataIndex: 'jobName',
  },
  {
    title: '预算员',
    dataIndex: 'editor_name'
  },
  {
    title: '操作时间',
    dataIndex: 'createTime'
  },
  {
    title: '预算额度（元）',
    dataIndex: 'budgetPrice'
  },
  {
    title: '操作',
    dataIndex: 'active',
    width: 250,
    scopedSlots: { customRender: 'active' }
  }
]
budgetColunms.forEach(item => {
  item.align = 'center'
})

export const budAddColunms = [
  {
    title: '工艺物料编码',
    dataIndex: 'code',
    width: 120,
  },
  {
    title: '施工项目名称',
    dataIndex: 'name'
  },
  {
    title: '类别',
    dataIndex: 'common'
  },
  {
    title: '人工工费',
    dataIndex: 'personFee'
  },
  {
    title: '材料费',
    dataIndex: 'materialFee',
  },
  {
    title: '综合单价',
    dataIndex: 'price',
  },
  {
    title: '单位',
    dataIndex: 'unit',
  },
  {
    title: '工艺说明',
    dataIndex: 'introduce',
    width: 320,
  },
  {
    title: '计价规则',
    dataIndex: 'rule',
  },
  {
    title: '适用',
    dataIndex: 'applyRange',
  },
  {
    title: '数量',
    dataIndex: 'mynumber',
    scopedSlots: { customRender: 'mynumber' },
  }
]
budAddColunms.forEach(item => {
  item.align = 'center'
})

export const popluerColumns = [
  {
    title: '序号',
    dataIndex: 'key',
    width: 70
  },
  {
    title: '工序',
    dataIndex: 'workProcedure',
    width: 150
  },
  {
    title: '工种',
    dataIndex: 'workType',
    width: 120
  },
  {
    title: '工艺物料编码',
    dataIndex: 'code',
    width: 140
  },
  {
    title: '施工项目名称',
    dataIndex: 'name',
    width: 120
  },
  {
    title: '类别',
    dataIndex: 'commonName',
    width: 70
  },
  {
    title: '人工工费',
    dataIndex: 'personFee',
    width: 100
  },
  {
    title: '材料费',
    dataIndex: 'materialFee',
    width: 100
  },
  {
    title: '综合单价',
    dataIndex: 'price',
    width: 100
  },
  {
    title: '单位',
    dataIndex: 'unit',
    width: 70
  },
  {
    title: '工艺说明',
    dataIndex: 'introduce',
    width: 540
  },
  {
    title: '计价规则',
    dataIndex: 'rule',
    width: 200
  },
  {
    title: '适用',
    dataIndex: 'applyRange',
    width: 100
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
    width: 200
  }
]
popluerColumns.forEach(item => {
  item.align = 'center'
})
