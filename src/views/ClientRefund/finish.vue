<template>
  <div class="clinent_refund_wrap">
    <h1>客户退款-已审核</h1>
    <a-table :columns="columns" :dataSource="dataArr" bordered :rowKey="(record, index) => index" :pagination='false' :locale='locale' :scroll="{ x: 2200 }">
      <span slot="approved" slot-scope="val">
        {{val === true ? '同意' : '拒绝'}}
      </span>
    </a-table>
    <div class="clinent_wrap_pagnin">
      <a-pagination showSizeChanger :pageSize.sync="pageSize" @showSizeChange="onShowSizeChange" :total="total" v-model="current" style="margin-top: 30px;"/>
    </div>
  </div>
</template>
<script>
const columns = [
  {
    title: '订单编号',
    dataIndex: 'workOrderNumber',
    align: 'center'
  },
  {
    title: '订单名称',
    dataIndex: 'workOrderTitle',
    align: 'center'
  },
  {
    title: '客户电话',
    dataIndex: 'customerPhone',
    align: 'center'
  },
  {
    title: '省',
    dataIndex: 'province',
    align: 'center'
  },
  {
    title: '市',
    dataIndex: 'city',
    align: 'center'
  },
  {
    title: '区',
    dataIndex: 'district',
    align: 'center'
  },
  {
    title: '小区',
    dataIndex: 'project',
    align: 'center'
  },
  {
    title: '栋',
    dataIndex: 'building',
    align: 'center'
  },
  {
    title: '单元号-房号',
    dataIndex: 'house',
    align: 'center'
  },
  {
    title: '退款金额',
    dataIndex: 'refundAmount',
    align: 'center'
  },
  {
    title: '退款原因',
    dataIndex: 'refundReason',
    align: 'center'
  },
  {
    title: '原因描述',
    dataIndex: 'reasonDesc',
    align: 'center'
  },
  {
    title: '操作记录',
    dataIndex: 'approved',
    align: 'center',
    scopedSlots: { customRender: 'approved' }
  },
  {
    title: '审核时间',
    dataIndex: 'approvalTime',
    align: 'center'
  }
]
export default {
  data () {
    return {
      columns,
      dataArr: [],
      locale: { emptyText: '暂无数据' }, // 无数据显示文案
      pageSize: 10,
      current: 1,
      total: 0
    }
  },
  watch: {
    current (val) {
      this.current = val
      this.getList()
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () { // 获取列表数据
      let obj = {
        pageNum: this.current,
        pageSize: this.pageSize,
        userId: 11
      }
      this.$request.post('/processInstance/Refund/1/list', obj).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.total = res.result.total
          if (res.result.list) {
            this.dataArr = res.result.list
          }
        }
      })
    },
    onShowSizeChange (current, pageSize) { // 选择条数
      this.pageSize = pageSize
      this.getList()
    },
    suer () {
      console.log(2)
    },
    refuse () {
      console.log(1)
    },
    handleOk () {
      console.log('OK')
    },
    handleCancel () {
      console.log('re')
    }
  }
}
</script>
<style lang="scss">
.clinent_wrap_pagnin {
  display: flex;
  justify-content: flex-end
}
</style>
