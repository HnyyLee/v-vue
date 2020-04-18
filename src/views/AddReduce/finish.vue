<template>
  <div class="add_reduce_wrap">
    <h1>工程变更-已审核</h1>
    <a-table :columns="columns" :dataSource="dataList" bordered :pagination='false' :locale='locale' :scroll='{ x: 2000 }'>
      <div slot="workOrderAddDropId" slot-scope="id">
        <span style="color:#1890ff" @click="goAdd(id)">
          点击查看
        </span>
      </div>
      <div slot="pricingProposalId" slot-scope="id">
        <span style="color:#1890ff" @click="goPirce(id)">
          点击查看
        </span>
      </div>
    </a-table>
    <div class="add_reduce_wrap_pagnin">
      <a-pagination showSizeChanger :pageSize.sync="pageSize" @showSizeChange="onShowSizeChange" :total="total" v-model="current" style="margin-top: 30px;"/>
    </div>
  </div>
</template>
<script>
const columns = [
  {
    title: '订单编号',
    dataIndex: 'workOrderCode',
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
    title: '区',
    dataIndex: 'districtName',
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
    title: '单元-房号',
    dataIndex: 'houseInfo',
    align: 'center'
  },
  {
    title: '设计师',
    dataIndex: 'designName',
    align: 'center'
  },
  {
    title: '工程变更金额',
    dataIndex: 'changeAmount',
    align: 'center'
  },
  {
    title: '工程变更明细',
    dataIndex: 'workOrderAddDropId',
    align: 'center',
    scopedSlots: { customRender: 'workOrderAddDropId' }
  },
  {
    title: '报价方案',
    dataIndex: 'pricingProposalId',
    align: 'center',
    scopedSlots: { customRender: 'pricingProposalId' }
  },
  {
    title: '操作记录',
    dataIndex: 'approved',
    align: 'center'
  },
  {
    title: '审核时间',
    dataIndex: 'approvedTimeStr',
    align: 'center'
  }
]
export default {
  data () {
    return {
      columns,
      dataList: [],
      locale: { emptyText: '暂无数据' }, // 无数据显示文案
      pageSize: 10,
      current: 1,
      total: 0
    }
  },
  created () {
    this.getList()
  },
  watch: {
    current (val) {
      this.current = val
      this.getList()
    }
  },
  methods: {
    goAdd (id) { // 转跳工程变更明细
      this.$router.push({ path: '/increase', query: { id: id } })
    },
    goPirce (id) { // 转跳报价方案明细
      this.$request.post('/quote/queryQuoteById', { quoteId: id }).then(res => {
        if (res.code === 0) {
          if (res.result.type === 1) { // 1为报价方案，2位清单，3为自定义
            this.$router.push({ path: '/quote_details', query: { offerId: id, xqSouce: 'xqSouce' } })
          } else if (res.result.type === 2) {
            this.$router.push({ path: '/inventory_details', query: { offerId: id, xqSouce: 'xqSouce' } })
          } else if (res.result.type === 3) {
            this.$router.push({ path: '/customDetailsPage', query: { offerId: id, xqSouce: 'xqSouce' } })
          }
        }
      })
    },
    getList () { // 列表数据
      let obj = {
        pageNum: this.current, // 页数
        pageSize: this.pageSize, // 条数
        userId: 1
      }
      this.$request.post('/processInstance/Change/' + true + '/list', obj).then(res => {
        if (res.code === 0) {
          if (res.result.list) { // 后台可能返回一个null； 这里需要判断一下是否为null；如果为null； 就赋值空数组
            let arr = []
            res.result.list.forEach((item, index) => {
              let obj = item
              obj.serial = index + 1
              obj.key = index
              arr.push(obj)
            })
            this.dataList = arr
          } else {
            this.dataList = []
          }
          this.total = res.result.total
        }
      })
    },
    onShowSizeChange (current, pageSize) {
      this.pageSize = pageSize
      this.getList()
    }
  }
}
</script>

<style lang="scss">
.add_reduce_wrap_pagnin {
  display: flex;
  justify-content: flex-end;
}
</style>
