let tableTitle = [
  {
    title: '工单编号',
    dataIndex: 'code',
    align: 'center',
    width: 150,
    scopedSlots: { customRender: 'code' }
  },
  {
    title: '工单名称',
    dataIndex: 'name',
    width: 150,
    align: 'title'
  },
  {
    title: '客户电话',
    align: 'center',
    width: 150,
    dataIndex: 'customerPhone'
  },
  {
    title: '省份',
    align: 'center',
    width: 100,
    dataIndex: 'provinceName'
  },
  {
    title: '城市',
    align: 'center',
    width: 100,
    dataIndex: 'cityName'
  },
  {
    title: '区',
    align: 'center',
    width: 100,
    dataIndex: 'districtName'
  },
  {
    title: '小区',
    align: 'center',
    width: 100,
    dataIndex: 'projectName'
  },
  {
    title: '栋',
    align: 'center',
    width: 150,
    dataIndex: 'buildingName'
  },
  {
    title: '单元号房号',
    align: 'center',
    width: 150,
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
    width: 50,
    dataIndex: 'documentaryDays'
  },
  {
    title: '已收定金',
    align: 'center',
    width: 70,
    dataIndex: 'earnestMoney'
  },
  {
    title: '签约金额',
    align: 'center',
    width: 100,
    dataIndex: 'signedMoney'
  },
  {
    title: '已收款',
    align: 'center',
    width: 100,
    dataIndex: 'paidMoney'
  },
  {
    title: '收款比例',
    align: 'center',
    width: 50,
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
    width: 100,
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
    width: 70,
    dataIndex: 'submitter'
  },
  {
    title: '客服人员',
    align: 'center',
    width: 70,
    dataIndex: 'customerServiceStaffName'
  },
  {
    title: '设计师',
    align: 'center',
    width: 70,
    dataIndex: 'designerName'
  }
]
// 工程变更记录列表
const tableTileTwo = [
  {
    title: '序号',
    dataIndex: 'serial',
    width: 50,
    class: 'column-center'
  },
  {
    title: '金额',
    dataIndex: 'changeAmount',
    width: 150,
    class: 'column-center'
  },
  {
    title: '状态',
    width: 150,
    dataIndex: 'toDoStatusName',
    class: 'column-center',
    scopedSlots: { customRender: 'toDoStatusName' }
  },
  {
    title: '变更类型',
    width: 150,
    dataIndex: 'changeTypeName',
    class: 'column-center'
  },
  {
    title: '创建时间',
    width: 150,
    dataIndex: 'createTimeStr',
    class: 'column-center'
  },
  {
    title: '操作',
    dataIndex: 'id',
    width: 150,
    class: 'column-center',
    scopedSlots: { customRender: 'id' }
  }
]
// 新增主材列表
let addTableOne = [
  {
    title: '序号',
    dataIndex: 'serial',
    width: 50,
    class: 'column-center'
  },
  {
    title: '物料编码',
    dataIndex: 'code',
    width: 150,
    class: 'column-center'
  },
  {
    title: '类别',
    width: 150,
    dataIndex: 'category',
    class: 'column-center'
  },
  {
    title: '产品名称',
    width: 150,
    dataIndex: 'name',
    class: 'column-center'
  },
  {
    title: '品牌',
    width: 100,
    dataIndex: 'brand',
    class: 'column-center'
  },
  {
    title: '型号',
    width: 100,
    dataIndex: 'type',
    class: 'column-center'
  },
  {
    title: '规格',
    width: 100,
    dataIndex: 'size',
    class: 'column-center'
  },
  {
    title: '数量',
    width: 120,
    dataIndex: 'num',
    class: 'column-center',
    scopedSlots: { customRender: 'num' }
  },
  {
    title: '单位',
    width: 50,
    dataIndex: 'unit',
    class: 'column-center'
  },
  {
    title: '价格',
    width: 150,
    dataIndex: 'price',
    class: 'column-center'
  },
  {
    title: '折减价',
    width: 150,
    dataIndex: 'mydisprice',
    class: 'column-center'
  },
  {
    title: '备注',
    width: 100,
    dataIndex: 'note',
    class: 'column-center'
  }
]
addTableOne.forEach(item => {
  item.align = 'center'
})
// 新增工艺接口
let addTableTwo = [
  {
    title: '序号',
    dataIndex: 'serial',
    width: 50,
    class: 'column-center'
  },
  {
    title: '物料编码',
    dataIndex: 'code',
    width: 150,
    class: 'column-center'
  },
  {
    title: '类别',
    width: 100,
    dataIndex: 'category',
    class: 'column-center'
  },
  {
    title: '工艺名称',
    width: 150,
    dataIndex: 'name',
    class: 'column-center'
  },
  {
    title: '数量',
    width: 100,
    dataIndex: 'num',
    class: 'column-center',
    scopedSlots: { customRender: 'num' }
  },
  {
    title: '单位',
    dataIndex: 'unit',
    width: 50,
    class: 'column-center'
  },
  {
    title: '价格',
    dataIndex: 'price',
    width: 150,
    class: 'column-center'
  },
  {
    title: '施工说明',
    width: 150,
    dataIndex: 'introduce',
    class: 'column-center'
  }
]
addTableTwo.forEach(item => {
  item.align = 'center'
})
// 弹窗主材列表
let addWindListOne = [
  {
    title: '序号',
    width: 50,
    dataIndex: 'serial',
    align: 'center'
  },
  {
    title: '物料编码',
    dataIndex: 'code',
    width: 150,
    align: 'center'
  },
  {
    title: '类别',
    width: 150,
    dataIndex: 'category',
    align: 'center'
  },
  {
    title: '产品名称',
    width: 150,
    dataIndex: 'name',
    align: 'center'
  },
  {
    title: '品牌',
    width: 150,
    dataIndex: 'brand',
    align: 'center'
  },
  {
    title: '型号',
    width: 100,
    dataIndex: 'type',
    align: 'center'
  },
  {
    title: '规格',
    width: 100,
    dataIndex: 'size',
    align: 'center'
  },
  {
    title: '单位',
    width: 50,
    dataIndex: 'unit',
    align: 'center'
  },
  {
    title: '价格',
    width: 150,
    dataIndex: 'price',
    align: 'center'
  },
  {
    title: '折减价',
    width: 150,
    dataIndex: 'mydisprice',
    align: 'center'
  },
  {
    title: '备注',
    width: 150,
    dataIndex: 'note',
    align: 'center'
  }
]
// 弹窗工艺列表
let addWindListTwo = [
  {
    title: '序号',
    dataIndex: 'serial',
    width: 50,
    class: 'column-center'
  },
  {
    title: '物料编码',
    dataIndex: 'code',
    width: 150,
    class: 'column-center'
  },
  {
    title: '类别',
    dataIndex: 'category',
    width: 100,
    class: 'column-center'
  },
  {
    title: '工艺名称',
    dataIndex: 'name',
    width: 150,
    class: 'column-center'
  },
  {
    title: '单位',
    dataIndex: 'unit',
    width: 50,
    class: 'column-center'
  },
  {
    title: '价格',
    dataIndex: 'price',
    width: 150,
    class: 'column-center'
  },
  {
    title: '施工说明',
    width: 200,
    dataIndex: 'introduce',
    class: 'column-center'
  }
]

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

let list = {
  statusList, // 状态
  tableTitle, // 主材列表（详情）
  tableTileTwo, // 施工列表 （详情）
  addTableOne, // 主材数据列表表头（新增）
  addTableTwo, // 施工列表表头（新增）
  addWindListOne, // 主材弹窗列表表头（新增弹窗）
  addWindListTwo // 施工弹窗列表表头（新增弹窗）
}

export default list

export const myapproval = [ 'myapproval', { rules: [ { required: true, message: '请选择审批模板' } ] } ]
