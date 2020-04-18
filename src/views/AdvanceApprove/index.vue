<template>
  <div class="approve_wrap">
    <h1>预付款-待审批</h1>
    <a-table :columns="columns" :dataSource="data" bordered>
      <template slot="operation" slot-scope="text, item">
        <a href="javascript:;" @click="suer(item, text)">同意</a>
        <a href="javascript:;" @click="refuse(item)">拒绝</a>
      </template>
    </a-table>
  </div>
</template>
<script>
const columns = [
  {
    title: '工单编号',
    dataIndex: 'number',
    align: 'center'
  },
  {
    title: '工单名称',
    dataIndex: 'name',
    align: 'center'
  },
  {
    title: '客户电话',
    dataIndex: 'iphone',
    align: 'center'
  },
  {
    title: '区',
    dataIndex: 'qu',
    align: 'center'
  },
  {
    title: '小区',
    dataIndex: 'samllq',
    align: 'center'
  },
  {
    title: '栋',
    dataIndex: 'd',
    align: 'center'
  },
  {
    title: '单元号',
    dataIndex: 'dyh',
    align: 'center'
  },
  {
    title: '房号',
    dataIndex: 'fh',
    align: 'center'
  },
  {
    title: '签约金额',
    dataIndex: 'price',
    align: 'center'
  },
  {
    title: '设计师',
    dataIndex: 'sjs',
    align: 'center'
  },
  {
    title: '报价方案',
    dataIndex: 'bjfa',
    align: 'center'
  },
  {
    title: '设计方案',
    dataIndex: 'sjfa',
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    scopedSlots: { customRender: 'operation' }
  }
]
export default {
  data () {
    return {
      columns,
      data: []
    }
  },
  methods: {
    suer (i) {
      console.log(i)
    },
    refuse (i) {
      console.log(i)
    }
  }
}
</script>
