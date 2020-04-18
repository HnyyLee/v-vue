<template>
  <div class="billing_box">
    <common-header :value='infoValue'></common-header>
    <h3>客户结算</h3>
    <a-table :columns="columns" :dataSource="thLsit" bordered class="tab_box"></a-table>
    <h3>供应商结算</h3>
    <a-table :columns="columnsT" :dataSource="thLsitT" bordered class="tab_box"></a-table>
  </div>
</template>
<script>
import CommonHeader from '@/components/CommonHeader/index.vue'

const columns = [
  {
    title: '款项',
    dataIndex: 'name',
    align: 'center'
  },
  {
    title: '应收',
    dataIndex: 'receivable',
    align: 'center'
  },
  {
    title: '实收',
    dataIndex: 'receipts',
    align: 'center'
  },
  {
    title: '日期',
    dataIndex: 'date',
    align: 'center'
  }
]

const columnsT = [
  {
    title: '供应商名称',
    dataIndex: 'name',
    align: 'center'
  },
  {
    title: '应付结算款',
    dataIndex: 'receivable',
    align: 'center'
  },
  {
    title: '预付款',
    dataIndex: 'advance',
    align: 'center'
  },
  {
    title: '实付结算款',
    dataIndex: 'receipts',
    align: 'center'
  },
  {
    title: '可提现',
    dataIndex: 'withdraw',
    align: 'center'
  },
  {
    title: '结算汇总时间',
    dataIndex: 'time1',
    align: 'center'
  },
  {
    title: '审核时间',
    dataIndex: 'time2',
    align: 'center'
  },
  {
    title: '划拨可提现时间',
    dataIndex: 'time3',
    align: 'center'
  }
]
export default {
  data () {
    return {
      columns,
      columnsT,
      thLsit: [],
      thLsitT: [],
      infoValue: {
        workNumber: 20156899,
        name: '刘德华',
        fitment: '卧室/墙壁',
        index: 7
      }
    }
  },
  components: {
    CommonHeader
  }
}
</script>
<style lang="scss">
.billing_box {
  h3 {
    margin:20px 0;
  }
}
</style>
