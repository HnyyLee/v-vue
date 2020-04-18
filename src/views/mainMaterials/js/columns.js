export let myColumns = [
  {
    title: '序号',
    width: 80,
    dataIndex: 'serial'
  }, {
    title: '空间（产品系列）',
    dataIndex: 'rangeName'
  }, {
    title: '物料编码',
    dataIndex: 'code'
  }, {
    title: '类别',
    dataIndex: 'category',
  }, {
    title: '产品名称',
    dataIndex: 'name'
  }, {
    title: '品牌',
    dataIndex: 'brand'
  }, {
    title: '型号',
    dataIndex: 'modelType'
  }, {
    title: '规格',
    dataIndex: 'size'
  }, {
    title: '单位',
    dataIndex: 'unit'
  }, {
    title: '备注(颜色、尺寸等特殊需求)',
    dataIndex: 'remark',
    scopedSlots: { customRender: 'spliceRemark' }
  }, {
    title: '预算量',
    align: 'center',
    dataIndex: 'planNum',
  }, {
    title: '管家复核量',
    dataIndex: 'reviewNum'
  }, {
    title: '下单量',
    dataIndex: 'orderNum',
  }
]
myColumns.forEach(ref => {
  ref.align = 'center'
})