let columns = [
  {
    title: '工单编号',
    dataIndex: 'code',
    align: 'center',
    width: 180,
    sorter: true,
    scopedSlots: { customRender: 'code' }
  },
  {
    title: '工单名称',
    align: 'center',
    width: 200,
    sorter: true,
    dataIndex: 'title'
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
    width: 150,
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
    title: '单元号-房号',
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
    title: '报单人员',
    align: 'center',
    width: 120,
    sorter: true,
    dataIndex: 'submitter'
  },
  {
    title: '客服人员',
    align: 'center',
    width: 120,
    sorter: true,
    dataIndex: 'customerServiceStaffName'
  }
]

export default columns
