export const decorOption = [{ value: 1, label: '局装' }, { value: 2, label: '整装' }]
export const mealOption = []
export const areaRangColumns = [
  {
    title: '项目',
    dataIndex: 'rangeName',
    align: 'center',
    width: 120
  }, {
    title: '面积',
    dataIndex: 'areaMeasure',
    align: 'center',
    width: 200,
    scopedSlots: { customRender: 'areaMeasure' }
  }, {
    title: '备注',
    dataIndex: 'remark',
    align: 'center',
  }, {
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    width: 80,
    scopedSlots: { customRender: 'action' }
  }
]

export const OPTIONS = [{ value: 1, label: '套餐报价' }, { value: 2, label: '清单报价' }, { value: 3, label: '自定义报价' }]
export let douColumnsOne = [
  {
    title: '编码',
    width: 100,
    dataIndex: 'code'
  }, {
    title: '产品系列（空间）',
    align: 'center',
    dataIndex: 'rangeName'
  }, {
    title: '名称',
    align: 'center',
    dataIndex: 'name'
  }, {
    title: '数量',
    dataIndex: 'itemNum',
    align: 'center',
    scopedSlots: { customRender: 'itemNum' }
  }, {
    title: '单位',
    align: 'center',
    dataIndex: 'unit'
  }, {
    title: '单价',
    align: 'center',
    dataIndex: 'price'
  }, {
    title: '金额',
    dataIndex: 'amount'
  }, {
    title: '品牌',
    align: 'center',
    dataIndex: 'brand'
  }, {
    title: '型号',
    align: 'center',
    dataIndex: 'type'
  }, {
    title: '规格',
    align: 'center',
    dataIndex: 'size'
  }, {
    title: '备注',
    align: 'center',
    dataIndex: 'remark',
    scopedSlots: { customRender: 'spliceRemark' }
  }, {
    title: '介绍',
    width: 150,
    align: 'center',
    dataIndex: 'note'
  }, {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
douColumnsOne.forEach(ref => {
  ref.align = 'center'
})

export const douColumnsTwo = [
  {
    title: '编码',
    align: 'center',
    dataIndex: 'code'
  }, {
    title: '名称',
    align: 'center',
    dataIndex: 'name'
  }, {
    title: '数量',
    align: 'center',
    dataIndex: 'itemNum',
    scopedSlots: { customRender: 'itemNum' }
  }, {
    title: '单位',
    align: 'center',
    dataIndex: 'unit'
  }, {
    title: '单价',
    align: 'center',
    dataIndex: 'price'
  }, {
    title: '金额',
    align: 'center',
    dataIndex: 'amount'
  }, {
    title: '品牌',
    align: 'center',
    dataIndex: 'brand'
  }, {
    title: '型号',
    align: 'center',
    dataIndex: 'type'
  }, {
    title: '规格',
    align: 'center',
    dataIndex: 'size'
  }, {
    title: '介绍',
    align: 'center',
    dataIndex: 'note'
  }, {
    title: '备注',
    align: 'center',
    dataIndex: 'remark',
    scopedSlots: { customRender: 'spliceRemark' }
  }, {
    title: '产品属性',
    align: 'center',
    dataIndex: 'attribute'
  }, {
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }
]
douColumnsTwo.forEach(item => {
  item.align = 'center'
})

export var areaRangDataSource = []
export var doubleDateOne = []
export var doubleDateTwo = []
export var doubleDateThree = []
export var doubleDateFour = []

export var dialogDataOne = []
export var dialogDataTwo = []
export var dialogDataThree = []
export var dialogDataFour = []

export const dialogColumsOne = [
  {
    title: '序号',
    align: 'center',
    dataIndex: 'id'
  }, {
    title: '物料编码',
    align: 'center',
    dataIndex: 'code'
  }, {
    title: '类别',
    align: 'center',
    dataIndex: 'category'
  }, {
    title: '产品名称',
    align: 'center',
    dataIndex: 'name'
  }, {
    title: '品牌',
    align: 'center',
    dataIndex: 'brand'
  }, {
    title: '型号',
    align: 'center',
    dataIndex: 'type'
  }, {
    title: '规格',
    align: 'center',
    dataIndex: 'size'
  }, {
    title: '单位',
    align: 'center',
    dataIndex: 'unit'
  }, {
    title: '价格',
    align: 'center',
    dataIndex: 'price'
  }, {
    title: '是否通用',
    align: 'center',
    dataIndex: 'common',
    scopedSlots: { customRender: 'spliceCommon' }
  }, {
    title: '备注',
    align: 'center',
    width: 150,
    dataIndex: 'note'
  }
]

export const searchDataTwo = {
  flag: true,
  optionData: { column: ['myCategory'], data: [] },
  inputData: { column: ['searchName'] }
}
export const searchDataThree = {
  flag: true,
  optionData: { column: ['myCategory'], data: [] },
  inputData: { column: ['searchName'] }
}
export const searchDataFour = {
  flag: true,
  optionData: { column: ['myCategory'], data: [] },
  inputData: { column: ['searchName'] }
}

export const searchDataSeven = {
  flag: true,
  optionData: { column: ['myCategory'], data: [] },
  inputData: { column: ['searchName'] }
}


export const mainSearchData = {
  flag: true,
  optionData: { column: ['myCategory'], data: [] },
  inputData: { column: ['searchName'], placeholder: '搜索类别、产品名称、物料编码、品牌' }
}

export const dialogColumsTwo = [
  {
    title: '序号',
    align: 'center',
    width: 60,
    dataIndex: 'id'
  }, {
    title: '物料编码',
    align: 'center',
    width: 90,
    dataIndex: 'code'
  }, {
    title: '类别',
    align: 'center',
    dataIndex: 'category'
  }, {
    title: '产品名称',
    align: 'center',
    dataIndex: 'name'
  }, {
    title: '品牌',
    align: 'center',
    dataIndex: 'brand'
  }, {
    title: '型号',
    align: 'center',
    dataIndex: 'type'
  }, {
    title: '规格',
    align: 'center',
    dataIndex: 'size'
  }, {
    title: '单位',
    align: 'center',
    dataIndex: 'unit'
  }, {
    title: '价格',
    align: 'center',
    width: 60,
    dataIndex: 'price'
  }, {
    title: '是否通用',
    align: 'center',
    dataIndex: 'common',
    scopedSlots: { customRender: 'spliceCommon' }
  }, {
    title: '产品属性',
    align: 'center',
    dataIndex: 'attribute'
  }, {
    title: '备注',
    align: 'center',
    dataIndex: 'note'
  }
]
export const dialogColumsThree = [
  {
    title: '序号',
    align: 'center',
    dataIndex: 'id'
  }, {
    title: '物料编码',
    align: 'center',
    dataIndex: 'code'
  }, {
    title: '类别',
    align: 'center',
    dataIndex: 'category'
  }, {
    title: '工艺名称',
    align: 'center',
    dataIndex: 'name'
  }, {
    title: '单位',
    align: 'center',
    dataIndex: 'unit'
  }, {
    title: '价格',
    align: 'center',
    dataIndex: 'price'
  }, {
    title: '是否通用',
    align: 'center',
    dataIndex: 'common',
    scopedSlots: { customRender: 'spliceCommon' }
  }, {
    title: '施工说明',
    align: 'center',
    width: 150,
    dataIndex: 'introduce'
  }
]
export const dialogColumsFour = [
  {
    title: '序号',
    align: 'center',
    dataIndex: 'id'
  }, {
    title: '物料编码',
    align: 'center',
    dataIndex: 'code'
  }, {
    title: '类别',
    align: 'center',
    dataIndex: 'category'
  }, {
    title: '工艺名称',
    align: 'center',
    dataIndex: 'name'
  }, {
    title: '单位',
    align: 'center',
    dataIndex: 'unit'
  }, {
    title: '价格',
    align: 'center',
    dataIndex: 'price'
  }, {
    title: '是否通用',
    align: 'center',
    dataIndex: 'common',
    scopedSlots: { customRender: 'spliceCommon' }
  }, {
    title: '工艺说明',
    width: 150,
    align: 'center',
    dataIndex: 'introduce'
  }, {
    title: '备注',
    align: 'center',
    dataIndex: 'note'
  }
]
export const douColumnsThree = [
  {
    title: '编码',
    align: 'center',
    dataIndex: 'code'
  }, {
    title: '名称',
    align: 'center',
    dataIndex: 'name'
  }, {
    title: '类别',
    align: 'center',
    dataIndex: 'category'
  }, {
    title: '数量',
    dataIndex: 'itemNum',
    align: 'center',
    scopedSlots: { customRender: 'itemNum' }
  }, {
    title: '单位',
    align: 'center',
    dataIndex: 'unit'
  }, {
    title: '单价',
    align: 'center',
    dataIndex: 'price'
  }, {
    title: '金额',
    align: 'center',
    dataIndex: 'amount'
  }, {
    title: '备注',
    align: 'center',
    dataIndex: 'remark',
    scopedSlots: { customRender: 'spliceRemark' }
  }, {
    title: '介绍（工艺说明）',
    width: 150,
    align: 'center',
    dataIndex: 'introduce'
  }, {
    title: '操作',
    align: 'center',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
douColumnsThree.forEach(item => {
  item.align = 'center'
})
export const douColumnsFour = [
  {
    title: '编码',
    align: 'center',
    width: 80,
    dataIndex: 'code'
  }, {
    title: '名称',
    align: 'center',
    width: 150,
    dataIndex: 'name'
  }, {
    title: '类别',
    align: 'center',
    width: 60,
    dataIndex: 'category'
  }, {
    title: '数量',
    align: 'center',
    dataIndex: 'itemNum',
    scopedSlots: { customRender: 'itemNum' }
  }, {
    title: '单位',
    align: 'center',
    width: 60,
    dataIndex: 'unit'
  }, {
    title: '单价',
    align: 'center',
    width: 80,
    dataIndex: 'price'
  }, {
    title: '金额',
    align: 'center',
    width: 80,
    dataIndex: 'amount'
  }, {
    title: '介绍（其他工艺说明）',
    align: 'center',
    dataIndex: 'introduce'
  }, {
    title: '备注',
    align: 'center',
    dataIndex: 'remark',
    scopedSlots: { customRender: 'spliceRemark' }
  }, {
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }
]
douColumnsFour.forEach(item => {
  item.align = 'center'
})

export const douColumnsFive = [
  {
    title: '费用项目',
    dataIndex: 'project'
  }, {
    title: '合计',
    dataIndex: 'amount'
  }, {
    title: '说明',
    dataIndex: 'remark'
  }
]
douColumnsFive.forEach(item => {
  item.align = 'center'
})

export var doubleDateFive = [
  {
    key: 0,
    project: '直接工程费',
    amount: '',
    remark: '直接工程费=标配设置＋主材升级项目+主材选配项目＋基础施工项目＋其它项目'
  },
  {
    key: 1,
    project: '管理费',
    amount: '',
    remark: '按直接工程费的10%计算'
  },
  {
    key: 2,
    project: '税金',
    amount: '',
    remark: '按直接工程费的3.38%计算'
  }
]

export const douColumnsSix = [
  {
    title: '序号',
    dataIndex: 'codeName'
  }, {
    title: '项目名称',
    dataIndex: 'name',
    scopedSlots: { customRender: 'projectName' }
  }, {
    title: '金额',
    dataIndex: 'discounts',
    scopedSlots: { customRender: 'discounts' }
  }
]
douColumnsSix.forEach(item => {
  item.align = 'center'
})
export var doubleDateSix = []

export const douColumnsSeven = [
  {
    title: '序号',
    dataIndex: 'code'
  }, {
    title: '项目名称',
    dataIndex: 'category',
  }, {
    title: '数量',
    dataIndex: 'itemNum',
    width: 250,
    scopedSlots: { customRender: 'itemNum' }
  },  {
    title: '金额',
    width: 280,
    dataIndex: 'Aoument',
  }
]
douColumnsSeven.forEach(item => {
  item.align = 'center'
})
export var doubleDateSeven = []

// 清单式报价的表头
export const sendenTopColums = [
  {
    title: '编码',
    align: 'center',
    dataIndex: 'code'
  }, {
    title: '报价项目',
    align: 'center',
    dataIndex: 'name'
  }, {
    title: '数量',
    dataIndex: 'itemNum',
    align: 'center',
    scopedSlots: { customRender: 'itemNum' }
  }, {
    title: '单位',
    align: 'center',
    dataIndex: 'unit'
  }, {
    title: '单价',
    align: 'center',
    dataIndex: 'price'
  }, {
    title: '金额',
    align: 'center',
    dataIndex: 'amount'
  }, {
    title: '品牌',
    align: 'center',
    dataIndex: 'brand'
  }, {
    title: '型号',
    align: 'center',
    dataIndex: 'type'
  }, {
    title: '规格',
    align: 'center',
    dataIndex: 'size'
  }, {
    title: '备注',
    align: 'center',
    dataIndex: 'remark',
    scopedSlots: { customRender: 'spliceRemark' }
  }, {
    title: '介绍',
    width: 150,
    align: 'center',
    dataIndex: 'note'
  }
]
export const sendenBottomColums = [
  {
    title: '编码',
    align: 'center',
    dataIndex: 'code'
  }, {
    title: '名称',
    align: 'center',
    dataIndex: 'name'
  }, {
    title: '数量',
    align: 'center',
    dataIndex: 'itemNum',
    scopedSlots: { customRender: 'itemNum' }
  }, {
    title: '单位',
    align: 'center',
    dataIndex: 'unit'
  }, {
    title: '单价',
    align: 'center',
    dataIndex: 'price'
  }, {
    title: '金额',
    align: 'center',
    dataIndex: 'amount'
  }, {
    title: '工艺说明',
    align: 'center',
    width: 150,
    dataIndex: 'introduce'
  }, {
    title: '备注',
    align: 'center',
    dataIndex: 'remark',
    scopedSlots: { customRender: 'spliceRemark' }
  }, {
    title: '介绍',
    align: 'center',
    width: 150,
    dataIndex: 'note'
  }
]
export const dialogColumsTop = [
  {
    title: '序号',
    align: 'center',
    width: 60,
    dataIndex: 'id'
  }, {
    title: '物料编码',
    align: 'center',
    dataIndex: 'code'
  }, {
    title: '类别',
    align: 'center',
    dataIndex: 'category'
  }, {
    title: '产品名称',
    align: 'center',
    dataIndex: 'name'
  }, {
    title: '品牌',
    align: 'center',
    dataIndex: 'brand'
  }, {
    title: '型号',
    align: 'center',
    dataIndex: 'type'
  }, {
    title: '规格',
    align: 'center',
    dataIndex: 'size'
  }, {
    title: '单位',
    align: 'center',
    dataIndex: 'unit'
  }, {
    title: '价格',
    align: 'center',
    width: 80,
    dataIndex: 'price'
  }, {
    title: '是否通用',
    align: 'center',
    dataIndex: 'common',
    scopedSlots: { customRender: 'spliceCommon' }
  }, {
    title: '备注',
    align: 'center',
    width: 150,
    dataIndex: 'note'
  }
]
export var dialogDataTop = []
export const searchDataTop = {
  flag: true,
  optionData: { column: ['myCategory'], data: [] },
  inputData: { column: ['searchName'] }
}
export const dialogColumsBtm = [
  {
    title: '序号',
    align: 'center',
    dataIndex: 'id'
  }, {
    title: '编码',
    align: 'center',
    dataIndex: 'code'
  }, {
    title: '名称',
    align: 'center',
    dataIndex: 'name'
  }, {
    title: '类别',
    align: 'center',
    dataIndex: 'category'
  }, {
    title: '数量',
    align: 'center',
    width: 60,
    dataIndex: 'itemNum',
    scopedSlots: { customRender: 'itemNum' }
  }, {
    title: '单位',
    align: 'center',
    dataIndex: 'unit'
  }, {
    title: '单价',
    align: 'center',
    dataIndex: 'price'
  }, {
    title: '金额',
    align: 'center',
    width: 80,
    dataIndex: 'amount'
  }, {
    title: '是否通用',
    align: 'center',
    dataIndex: 'common',
    scopedSlots: { customRender: 'spliceCommon' }
  }, {
    title: '备注（工艺说明）',
    align: 'center',
    width: 150,
    dataIndex: 'introduce'
  }
]
export const searchDataBtm = {
  flag: true,
  optionData: { column: ['myCategory'], data: [] },
  inputData: { column: ['searchName'] }
}
export var doubleDateLastOne = [
  {
    key: 0,
    project: '直接工程费',
    amount: '',
    remark: '直接工程费=标配设置＋主材升级项目+主材选配项目＋基础施工项目＋其它项目'
  },
  {
    key: 1,
    project: '管理费',
    amount: '',
    remark: '按直接工程费的10%计算'
  },
  {
    key: 2,
    project: '税金',
    amount: '',
    remark: '按直接工程费的3.38%计算'
  }
]
export const douColumnsLastOne = [
  {
    title: '费用项目',
    dataIndex: 'project'
  }, {
    title: '合计',
    dataIndex: 'amount'
  }, {
    title: '说明',
    dataIndex: 'remark'
  }
]
douColumnsLastOne.forEach(item => {
  item.align = 'center'
})
export var doubleDateLastTwo = []
export const douColumnsLastTwo = [
  {
    title: '序号',
    dataIndex: 'codeName'
  }, {
    title: '项目名称',
    dataIndex: 'name',
    scopedSlots: { customRender: 'projectName' }
  }, {
    title: '金额',
    dataIndex: 'discounts',
    scopedSlots: { customRender: 'discounts' }
  }
]
douColumnsLastTwo.forEach(item => {
  item.align = 'center'
})

// 套餐详情页面的数据
export const detailDoubleDateOne = []
export const detailDoubleDateTwo = []
export const detailDoubleDateThree = []
export const detailDoubleDateFour = []

export let detailDouColumnsOne = [
  {
    title: '编码',
    align: 'center',
    dataIndex: 'code',
    width: 100,
  }, {
    title: '产品系列（空间）',
    align: 'center',
    dataIndex: 'rangeName',
    width: 100,
  }, {
    title: '名称',
    align: 'center',
    dataIndex: 'name',
  }, {
    title: '数量',
    align: 'center',
    width: 70,
    dataIndex: 'itemNum',
  }, {
    title: '单位',
    align: 'center',
    dataIndex: 'unit',
  }, {
    title: '单价',
    align: 'center',
    width: 80,
    dataIndex: 'price',
  }, {
    title: '金额',
    align: 'center',
    width: 80,
    dataIndex: 'amount',
  }, {
    title: '品牌',
    align: 'center',
    dataIndex: 'brand',
  }, {
    title: '型号',
    align: 'center',
    dataIndex: 'type',
  }, {
    title: '规格',
    align: 'center',
    dataIndex: 'size',
  }, {
    title: '备注',
    align: 'center',
    dataIndex: 'note'
  }
]
detailDouColumnsOne.forEach(ref => {
  ref.align = 'center'
})
export const detailDouColumnsTwo = [
  {
    title: '编码',
    align: 'center',
    dataIndex: 'code',
    width: 100,
  }, {
    title: '名称',
    align: 'center',
    dataIndex: 'name',
  }, {
    title: '数量',
    align: 'center',
    width: 70,
    dataIndex: 'itemNum',
  }, {
    title: '单位',
    align: 'center',
    dataIndex: 'unit',
  }, {
    title: '单价',
    align: 'center',
    width: 80,
    dataIndex: 'price',
  }, {
    title: '金额',
    align: 'center',
    width: 80,
    dataIndex: 'amount',
  }, {
    title: '品牌',
    align: 'center',
    dataIndex: 'brand',
  }, {
    title: '型号',
    align: 'center',
    dataIndex: 'type',
  }, {
    title: '规格',
    align: 'center',
    dataIndex: 'size',
  }, {
    title: '备注',
    align: 'center',
    dataIndex: 'remark',
  }, {
    title: '介绍',
    align: 'center',
    dataIndex: 'note'
  }
]
detailDouColumnsTwo.forEach(item => {
  item.align = 'center'
})
export var detailDouColumnsThree = [
  {
    title: '编码',
    align: 'center',
    dataIndex: 'code',
    width: 100,
  }, {
    title: '名称',
    align: 'center',
    dataIndex: 'name',
  }, {
    title: '类别',
    align: 'center',
    dataIndex: 'category',
  }, {
    title: '数量',
    align: 'center',
    width: 70,
    dataIndex: 'itemNum',
  }, {
    title: '单位',
    align: 'center',
    dataIndex: 'unit',
  }, {
    title: '单价',
    align: 'center',
    width: 80,
    dataIndex: 'price',
  }, {
    title: '金额',
    align: 'center',
    width: 80,
    dataIndex: 'amount',
  }, {
    title: '备注（工艺说明）',
    align: 'center',
    dataIndex: 'introduce'
  }
]
detailDouColumnsThree.forEach(item => {
  item.align = 'center'
})

export var detailDouColumnsFour = [
  {
    title: '编码',
    align: 'center',
    dataIndex: 'code',
    width: 100,
  }, {
    title: '名称',
    align: 'center',
    dataIndex: 'name',
  }, {
    title: '类别',
    align: 'center',
    dataIndex: 'category',
  }, {
    title: '数量',
    align: 'center',
    width: 70,
    dataIndex: 'itemNum',
  }, {
    title: '单位',
    align: 'center',
    dataIndex: 'unit',
  }, {
    title: '单价',
    align: 'center',
    width: 80,
    dataIndex: 'price',
  }, {
    title: '金额',
    align: 'center',
    width: 80,
    dataIndex: 'amount',
  }, {
    title: '备注',
    align: 'center',
    dataIndex: 'remark',
  }, {
    title: '介绍（其他工艺说明）',
    align: 'center',
    dataIndex: 'introduce'
  }
]
detailDouColumnsFour.forEach(item => {
  item.align = 'center'
})

export var detailDoubleDateFive = [
  {
    key: 0,
    project: '直接工程费',
    amount: '',
    remark: '直接工程费=标配设置＋主材升级项目+主材选配项目＋基础施工项目＋其它项目'
  },
  {
    key: 1,
    project: '管理费',
    amount: '',
    remark: '按直接工程费的10%计算'
  },
  {
    key: 2,
    project: '税金',
    amount: '',
    remark: '按直接工程费的3.38%计算'
  }
]

export const detailDouColumnsFive = [
  {
    title: '费用项目',
    dataIndex: 'project'
  }, {
    title: '合计',
    dataIndex: 'amount'
  }, {
    title: '说明',
    dataIndex: 'remark'
  }
]
detailDouColumnsFive.forEach(item => {
  item.align = 'center'
})

export const detailDoubleDateSix = []
export const detailDouColumnsSix = [
  {
    title: '序号',
    dataIndex: 'codeName'
  }, {
    title: '项目名称',
    dataIndex: 'name',
  }, {
    title: '金额',
    dataIndex: 'discounts',
  }
]
detailDouColumnsSix.forEach(item => {
  item.align = 'center'
})

export const detailDouColumnsSeven = [
  {
    title: '序号',
    dataIndex: 'code'
  }, {
    title: '项目名称',
    dataIndex: 'category',
  }, {
    title: '数量',
    dataIndex: 'itemNum',
  },  {
    title: '金额',
    dataIndex: 'Aoument',
  }
]
detailDouColumnsSeven.forEach(item => {
  item.align = 'center'
})

export const detailDoubleDateSeven = []
// 清单报价详情页面数据
export const detailTopColums = [
  {
    title: '编码',
    align: 'center',
    dataIndex: 'code',
    width: 100,
  }, {
    title: '报价项目',
    align: 'center',
    dataIndex: 'name',
  }, {
    title: '数量',
    align: 'center',
    dataIndex: 'itemNum',
  }, {
    title: '单位',
    align: 'center',
    dataIndex: 'unit',
  }, {
    title: '单价',
    align: 'center',
    dataIndex: 'price',
  }, {
    title: '金额',
    align: 'center',
    dataIndex: 'amount',
  }, {
    title: '品牌',
    align: 'center',
    dataIndex: 'brand',
  }, {
    title: '型号',
    align: 'center',
    dataIndex: 'type',
  }, {
    title: '规格',
    align: 'center',
    dataIndex: 'size',
  }, {
    title: '备注',
    align: 'center',
    dataIndex: 'remark'
  }, {
    title: '介绍',
    align: 'center',
    dataIndex: 'note'
  }
]
export const detailBottomColums = [
  {
    title: '编码',
    align: 'center',
    dataIndex: 'code',
    width: 100,
  }, {
    title: '名称',
    align: 'center',
    dataIndex: 'name',
  }, {
    title: '数量',
    dataIndex: 'itemNum',
    align: 'center',
  }, {
    title: '单位',
    align: 'center',
    dataIndex: 'unit',
  }, {
    title: '单价',
    align: 'center',
    dataIndex: 'price',
  }, {
    title: '金额',
    align: 'center',
    dataIndex: 'amount',
  }, {
    title: '工艺说明',
    align: 'center',
    dataIndex: 'introduce',
  }, {
    title: '备注',
    align: 'center',
    dataIndex: 'remark'
  }, {
    title: '介绍',
    align: 'center',
    dataIndex: 'note'
  }
]
export var detailReperThree = [
  {
    key: 0,
    project: '直接工程费',
    amount: '',
    remark: '直接工程费=标配设置＋主材升级项目+主材选配项目＋基础施工项目＋其它项目'
  },
  {
    key: 1,
    project: '管理费',
    amount: '',
    remark: '按直接工程费的10%计算'
  },
  {
    key: 2,
    project: '税金',
    amount: '',
    remark: '按直接工程费的3.38%计算'
  }
]
export const detailReperColum = [
  {
    title: '费用项目',
    dataIndex: 'project'
  }, {
    title: '合计',
    dataIndex: 'amount'
  }, {
    title: '说明',
    dataIndex: 'remark'
  }
]
detailReperColum.forEach(item => {
  item.align = 'center'
})

export const reductionColumns = [
  {
    title: '序号',
    align: 'center',
    dataIndex: 'code',
    width: 80,
  }, {
    title: '主材名称',
    align: 'center',
    dataIndex: 'name',
  }, {
    title: '主材类别',
    align: 'center',
    dataIndex: 'category',
  }, {
    title: '单位',
    dataIndex: 'unit',
    align: 'center',
  }, {
    title: '设置折减价',
    align: 'center',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
  }
]

export const dialogDataSeven = []

export const dialogColumsSeven = [
  {
    title: '序号',
    align: 'center',
    width: 50,
    dataIndex: 'num'
  }, {
    title: '编码',
    align: 'center',
    dataIndex: 'code'
  }, {
    title: '主材类别',
    align: 'center',
    dataIndex: 'category'
  }, {
    title: '主材名称',
    align: 'center',
    dataIndex: 'name'
  }, {
    title: '品牌',
    align: 'center',
    dataIndex: 'brand'
  }, {
    title: '型号',
    align: 'center',
    dataIndex: 'model_type'
  }, {
    title: '规格',
    align: 'center',
    dataIndex: 'size'
  }, {
    title: '单位',
    align: 'center',
    dataIndex: 'unit'
  }, {
    title: '产品属性',
    align: 'center',
    dataIndex: 'attribute'
  }, {
    title: '折减价',
    align: 'center',
    width: 90,
    dataIndex: 'price'
  },
  {
    title: '价格',
    align: 'center',
    width: 90,
    dataIndex: 'item_price'
  }
]
