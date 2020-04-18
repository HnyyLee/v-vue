let statusList = [
  {
    id: 'qb',
    name: '全部'
  },
  {
    id: 0,
    name: '已关闭'
  },
  {
    id: 100,
    name: '跟进中'
  },
  {
    id: 200,
    name: '已付定金'
  },
  // {
  //   id: 201,
  //   name: '已付一期款'
  // },
  {
    id: 210,
    name: '已签约'
  },
  {
    id: 211,
    name: '已付二期款'
  },
  {
    id: 510,
    name: '结算中'
  },
  {
    id: 513,
    name: '已付全款'
  },
  {
    id: 521,
    name: '已结算'
  }
]

let followList = [
  {
    id: 'qb',
    name: '全部'
  },
  {
    id: 100,
    name: '报单'
  },
  {
    id: 110,
    name: '已分配设计师'
  },
  {
    id: 120,
    name: '未上门'
  },
  {
    id: 121,
    name: '已上门'
  },
  {
    id: 130,
    name: '方案构思'
  },
  {
    id: 140,
    name: '考虑'
  },
  {
    id: 150,
    name: '认可'
  },
  {
    id: 160,
    name: '准备签约'
  }
]

let tableTitle = [
  {
    title: '工单编号',
    dataIndex: 'code',
    align: 'center',
    width: 200,
    sorter: true,
    scopedSlots: { customRender: 'code' }
  },
  {
    title: '工单名称',
    dataIndex: 'title',
    align: 'center',
    sorter: true,
    width: 200
  },
  {
    title: '状态',
    align: 'center',
    width: 100,
    dataIndex: 'status'
  },
  {
    title: '客户电话',
    align: 'center',
    width: 100,
    sorter: true,
    dataIndex: 'customerPhone'
  },
  {
    title: '省份',
    align: 'center',
    width: 100,
    sorter: true,
    dataIndex: 'provinceName'
  },
  {
    title: '城市',
    align: 'center',
    width: 100,
    sorter: true,
    dataIndex: 'cityName'
  },
  {
    title: '区',
    align: 'center',
    width: 120,
    sorter: true,
    dataIndex: 'districtName'
  },
  {
    title: '小区',
    align: 'center',
    width: 150,
    sorter: true,
    dataIndex: 'projectName'
  },
  {
    title: '栋',
    align: 'center',
    width: 180,
    sorter: true,
    dataIndex: 'buildingName'
  },
  {
    title: '单元号房号',
    align: 'center',
    width: 200,
    sorter: true,
    dataIndex: 'house'
  },
  {
    title: '报单时间',
    align: 'center',
    width: 130,
    sorter: true,
    dataIndex: 'declarationTimeStr'
  },
  {
    title: '领取时间',
    align: 'center',
    width: 130,
    sorter: true,
    dataIndex: 'receiveTimeStr'
  },
  {
    title: '派单时间',
    align: 'center',
    width: 130,
    sorter: true,
    dataIndex: 'dispatchDesignerTime'
  },
  {
    title: '签约时间',
    align: 'center',
    width: 130,
    sorter: true,
    dataIndex: 'signedTime'
  },
  {
    title: '预计开工时间',
    align: 'center',
    width: 130,
    sorter: true,
    dataIndex: 'planStartConstructionTimeStr'
  },
  {
    title: '预计竣工时间',
    align: 'center',
    width: 130,
    sorter: true,
    dataIndex: 'planEndConstructionTimeStr'
  },
  {
    title: '真实开工时间',
    align: 'center',
    width: 130,
    sorter: true,
    dataIndex: 'realStartConstructionTime'
  },
  {
    title: '真实竣工时间',
    align: 'center',
    width: 130,
    sorter: true,
    dataIndex: 'realEndConstructionTime'
  },
  {
    title: '跟单天数',
    align: 'center',
    width: 80,
    dataIndex: 'documentaryDays'
  },
  {
    title: '已收定金',
    align: 'center',
    width: 100,
    sorter: true,
    dataIndex: 'earnestMoney'
  },
  {
    title: '签约金额',
    align: 'center',
    width: 100,
    sorter: true,
    dataIndex: 'signedMoney'
  },
  {
    title: '已收款',
    align: 'center',
    width: 100,
    sorter: true,
    dataIndex: 'paidMoney'
  },
  {
    title: '收款比例',
    align: 'center',
    width: 100,
    dataIndex: 'collectionRatio'
  },
  {
    title: '备注',
    align: 'center',
    width: 100,
    sorter: true,
    dataIndex: 'remark'
  },
  {
    title: '报单来源',
    align: 'center',
    width: 110,
    dataIndex: 'source'
  },
  {
    title: '报单人员',
    align: 'center',
    width: 110,
    sorter: true,
    dataIndex: 'submitter'
  },
  {
    title: '客服人员',
    align: 'center',
    width: 110,
    sorter: true,
    dataIndex: 'customerServiceStaffName'
  },
  {
    title: '设计师',
    align: 'center',
    width: 160,
    sorter: true,
    dataIndex: 'designerName'
  }
]

let dataValue = {
  statusList,
  tableTitle,
  followList
}

export default dataValue
