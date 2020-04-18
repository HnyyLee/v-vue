let columns = [{
  title: '客户姓名',
  align: 'center',
  width: 130,
  dataIndex: 'customerName',
  sorter: true,
  scopedSlots: { customRender: 'customerName' }
}, {
  title: '手机号',
  align: 'center',
  width: 120,
  sorter: true,
  dataIndex: 'customerPhone'
}, {
  title: '城市',
  align: 'center',
  width: 100,
  sorter: true,
  dataIndex: 'city'
}, {
  title: '小区/房号',
  align: 'center',
  width: 200,
  sorter: true,
  dataIndex: 'address'
}, {
  title: '服务类型',
  align: 'center',
  width: 150,
  sorter: true,
  dataIndex: 'comboTitle'
}, {
  title: '报单来源',
  align: 'center',
  width: 130,
  dataIndex: 'sourceStr',
  scopedSlots: { customRender: 'sourceStr' }
}, {
  title: '提单人',
  align: 'center',
  width: 100,
  sorter: true,
  dataIndex: 'submitter'
}, {
  align: 'center',
  width: 130,
  title: '报单时间',
  sorter: true,
  dataIndex: 'declarationTime'
}, {
  align: 'center',
  title: '派单时间',
  width: 130,
  sorter: true,
  dataIndex: 'dispatchTime'
}, {
  title: '客服',
  dataIndex: 'customerServiceName',
  align: 'center',
  sorter: true,
  width: 120
}, {
  title: '派单结果',
  dataIndex: 'statusName',
  align: 'center',
  width: 100
}, {
  title: '操作',
  key: 'id',
  align: 'center',
  width: 80,
  scopedSlots: { customRender: 'id' }
}]

export default columns
