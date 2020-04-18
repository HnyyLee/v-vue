<template>
  <div class="approve_wrap">
    <h1>预付款-已审批</h1>
    <a-table :columns="columns" :dataSource="data" bordered></a-table>
  </div>
</template>
<script>
const columns = [
  {
    title: '供应商名称',
    dataIndex: 'name',
    align: 'center'
  },
  {
    title: '预付款',
    dataIndex: 'price',
    align: 'center'
  },
  {
    title: '预付原因',
    dataIndex: 'yfyy',
    align: 'center'
  },
  {
    title: '申请时间',
    dataIndex: 'time',
    align: 'center'
  },
  {
    title: '操作记录',
    dataIndex: 'czjl',
    align: 'center'
  },
  {
    title: '操作时间',
    dataIndex: 'time2',
    align: 'center'
  }
]
export default {
  data () {
    return {
      columns,
      data: []
    }
  }
}
</script>
