let tableTitle = [
  {
    title: '工单编号',
    dataIndex: 'code',
    width: 200,
    align: 'center',
    scopedSlots: { customRender: 'code' }
  },
  {
    title: '工单名称',
    width: 150,
    dataIndex: 'title',
    align: 'center'
  },
  {
    title: '客户电话',
    width: 150,
    align: 'center',
    dataIndex: 'customerPhone'
  },
  {
    title: '省份',
    width: 100,
    align: 'center',
    dataIndex: 'provinceName'
  },
  {
    title: '城市',
    width: 100,
    align: 'center',
    dataIndex: 'cityName'
  },
  {
    title: '区',
    width: 150,
    align: 'center',
    dataIndex: 'districtName'
  },
  {
    title: '小区',
    width: 150,
    align: 'center',
    dataIndex: 'projectName'
  },
  {
    title: '栋',
    width: 150,
    align: 'center',
    dataIndex: 'buildingName'
  },
  {
    title: '单元号房号',
    width: 150,
    align: 'center',
    dataIndex: 'house'
  },
  {
    title: '状态',
    align: 'center',
    width: 100,
    dataIndex: 'status'
  },
  {
    title: '报单时间',
    align: 'center',
    width: 150,
    dataIndex: 'declarationTimeStr'
  },
  {
    title: '领取时间',
    align: 'center',
    width: 150,
    dataIndex: 'receiveTimeStr'
  },
  {
    title: '跟单天数',
    align: 'center',
    width: 100,
    dataIndex: 'documentaryDays'
  },
  {
    title: '已收定金',
    align: 'center',
    width: 150,
    dataIndex: 'earnestMoney'
  },
  {
    title: '签约金额',
    align: 'center',
    width: 150,
    dataIndex: 'signedMoney'
  },
  {
    title: '已收款',
    align: 'center',
    width: 150,
    dataIndex: 'paidMoney'
  },
  {
    title: '收款比例',
    align: 'center',
    width: 100,
    dataIndex: 'collectionRatio'
  },
  {
    title: '预计开工',
    align: 'center',
    width: 150,
    dataIndex: 'planStartConstructionTimeStr'
  },
  {
    title: '预计完工',
    align: 'center',
    width: 150,
    dataIndex: 'planEndConstructionTimeStr'
  },
  {
    title: '备注',
    align: 'center',
    width: 150,
    dataIndex: 'remark'
  },
  {
    title: '报单来源',
    align: 'center',
    width: 100,
    dataIndex: 'source'
  },
  {
    title: '报单人员',
    align: 'center',
    width: 80,
    dataIndex: 'submitter'
  },
  {
    title: '客服人员',
    align: 'center',
    width: 80,
    dataIndex: 'customerServiceStaffName'
  },
  {
    title: '设计师',
    align: 'center',
    width: 100,
    dataIndex: 'designerName'
  }
]

export default tableTitle
