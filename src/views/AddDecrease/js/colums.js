
export const technoListColumns = [
  {
    title: '序号',
    dataIndex: 'id'
  },
  {
    title: 'SKU编码',
    dataIndex: 'code'
  },
  {
    title: '类别',
    dataIndex: 'category'
  },
  {
    title: '工艺名称',
    dataIndex: 'name'
  },
  {
    title: '单位',
    dataIndex: 'unit'
  },
  {
    title: '单价',
    dataIndex: 'price'
  },
  {
    title: '数量',
    dataIndex: 'itemNum',
    scopedSlots: { customRender: 'itemNum' }
  },
  {
    title: '小计',
    width: 100,
    dataIndex: 'amount'
  },
  {
    title: '施工说明',
    dataIndex: 'introduce'
  }
]
technoListColumns.forEach(item => {
  item.align = 'center'
})

export const technoAddColumns = [
  {
    title: '序号',
    dataIndex: 'id',
    width: 40,
  },
  {
    title: '物料编码',
    dataIndex: 'code',
    width: 120,
  },
  {
    title: '类别',
    dataIndex: 'category',
    width: 80,
  },
  {
    title: '工艺名称',
    dataIndex: 'name',
    width: 150,
  },
  {
    title: '单位',
    dataIndex: 'unit',
    width: 50,
  },
  {
    title: '价格',
    dataIndex: 'price',
    width: 100,
  },
  {
    title: '施工说明',
    width: 250,
    dataIndex: 'introduce',
  }
]
technoAddColumns.forEach(item => {
  item.align = 'center'
})

export const poplurSearchDataOne = {
  flag: true,
  optionData: { column: ['myCategory'], data: [] },
  inputData: { column: ['searchName'] }
}
export const poplurSearchDataTwo = {
  flag: true,
  optionData: { column: ['myCategory'], data: [] },
  inputData: { column: ['searchName'] }
}

export const lastTableColumns = [
  {
    title: '序号',
    dataIndex: 'id',
    width: 40,
  },
  {
    title: '费用类型',
    dataIndex: 'mountType',
    width: 120,
  },
  {
    title: '小计',
    dataIndex: 'amount',
    width: 80,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 150,
  }
]
lastTableColumns.forEach(item => {
  item.align = 'center'
})

// **********************************************************************************************

export const materialListColumns = [
  {
    title: '序号',
    dataIndex: 'id'
  },
  {
    title: 'SKU编码',
    dataIndex: 'code'
  },
  {
    title: '品类',
    dataIndex: 'category'
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
    width: 100,
    dataIndex: 'price'
  },
  {
    title: '数量',
    dataIndex: 'itemNum',
    width: 130,
    scopedSlots: { customRender: 'itemNum' }
  },
  {
    title: '金额',
    width: 100,
    dataIndex: 'amount'
  },
  {
    title: '折减价',
    width: 100,
    dataIndex: 'mydisprice'
  }, 
  {
    title: '空间',
    dataIndex: 'spaceDes',
    width: 180,
    scopedSlots: { customRender: 'spaceDes' }
  },
  {
    title: '备注',
    dataIndex: 'introduce'
  }
]
materialListColumns.forEach(item => {
  item.align = 'center'
})

export const materialAddColumns = [
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
    title: '折减价',
    width: 90,
    dataIndex: 'mydisprice'
  }, {
    title: '产品属性',
    dataIndex: 'attribute'
  }, {
    title: '备注',
    dataIndex: 'note'
  }
]
materialAddColumns.forEach(item => {
  item.align = 'center'
})

export const materialSearchDataOne = {
  flag: true,
  optionData: { column: ['myCategory'], data: [] },
  inputData: { column: ['searchName'] }
}
export const materialSearchDataTwo = {
  flag: true,
  optionData: { column: ['myCategory'], data: [] },
  inputData: { column: ['searchName'] }
}

export const materTableColumns = [
  {
    title: '序号',
    dataIndex: 'id',
    width: 40,
  },
  {
    title: '费用类型',
    dataIndex: 'mountType',
    width: 120,
  },
  {
    title: '小计',
    dataIndex: 'amount',
    width: 80,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 150,
  }
]
materTableColumns.forEach(item => {
  item.align = 'center'
})

// 打印页面的综合计费
const renderContent = (value, row, index) => {
  const obj = {
    children: value,
    attrs: {}
  }
  if (index === 4) {
    obj.attrs.colSpan = 0
  }
  return obj
}
export const printerLastColumns = [
  {
    title: '序号',
    dataIndex: 'id',
    width: 40,
    customRender: (text, row, index) => {
      if (index < 4) {
        return text
      }
      return {
        children: '工作延顺日',
        attrs: {
          colSpan: 1,
        }
      }
    },
  },
  {
    title: '费用类型',
    dataIndex: 'mountType',
    width: 120,
    customRender: (text, row, index) => {
      if (index < 4) {
        return text
      }
      return {
        children: `${row.constructionDelayDays}日`,
        attrs: {
          colSpan: 3,
        }
      }
    },
  },
  {
    title: '小计',
    dataIndex: 'amount',
    width: 80,
    customRender: renderContent,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 150,
    customRender: renderContent,
  }
]
printerLastColumns.forEach(item => {
  item.align = 'center'
})
