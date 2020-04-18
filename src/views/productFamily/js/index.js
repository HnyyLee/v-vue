
export const FamilyColumns = [
  {
    title: '序号',
    width: 80,
    dataIndex: 'key'
  },
  {
    title: '产品系列',
    width: 220,
    dataIndex: 'name'
  },
  {
    title: '是否可升级',
    dataIndex: 'isUpdateName'
  },
  {
    title: '是否可选配',
    dataIndex: 'isOptionName'
  },
  {
    title: '是否可折减',
    dataIndex: 'isDiscountName'
  },
  {
    title: '创建人',
    dataIndex: 'editorName'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime'
  },
  {
    title: '状态',
    width: 150,
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '操作',
    width: 120,
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
FamilyColumns.forEach(item => {
  item.align = 'center'
})


export const StandardColumns = [
  {
    title: '序号',
    width: 60,
    dataIndex: 'serial'
  },
  {
    title: '物料编码',
    dataIndex: 'code'
  },
  {
    title: '类别',
    dataIndex: 'category'
  },
  {
    title: '产品名称',
    dataIndex: 'name'
  },
  {
    title: '品牌',
    dataIndex: 'brand'
  },
  {
    title: '型号',
    dataIndex: 'type'
  },
  {
    title: '规格',
    dataIndex: 'size'
  },
  {
    title: '单位',
    dataIndex: 'unit'
  },
  {
    title: '单价',
    width: 90,
    dataIndex: 'price'
  },
  {
    title: '是否通用',
    dataIndex: 'common',
    scopedSlots: { customRender: 'spliceCommon' }
  },
  {
    title: '状态',
    width: 80,
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '备注',
    dataIndex: 'note',
  }
]
StandardColumns.forEach(item => {
  item.align = 'center'
})

export const ReductionColumns = [
  {
    title: '序号',
    dataIndex: 'serial'
  },
  {
    title: '产品名称',
    dataIndex: 'name'
  },
  {
    title: '单位',
    dataIndex: 'unit'
  },
  {
    title: '折减价',
    dataIndex: 'reductPrice',
    scopedSlots: { customRender: 'reductPrice' }
  }
]
ReductionColumns.forEach(item => {
  item.align = 'center'
})


export const prodAddEditColumns = [
  {
    title: '序号',
    width: 60,
    dataIndex: 'id'
  }, {
    title: '物料编码',
    width: 100,
    dataIndex: 'code'
  }, {
    title: '类别',
    dataIndex: 'category'
  }, {
    title: '产品名称',
    dataIndex: 'name'
  }, {
    title: '品牌',
    dataIndex: 'brand'
  }, {
    title: '型号',
    dataIndex: 'type'
  }, {
    title: '规格',
    dataIndex: 'size'
  }, {
    title: '单位',
    dataIndex: 'unit'
  }, {
    title: '价格',
    width: 90,
    dataIndex: 'price'
  }, {
    title: '产品属性',
    dataIndex: 'attribute'
  }, {
    title: '备注',
    dataIndex: 'note'
  }
]
prodAddEditColumns.forEach(item => {
  item.align = 'center'
})

export const prodAddEditSearchData = {
  flag: true,
  optionData: { column: ['myCategory'], data: [] },
  inputData: { column: ['searchName'] }
}
