<template>
  <div class="approve_wrap">
    <h1>结算款-待审批</h1>
    <div class="approve_wrap_seach">
      <a-input-search
        v-model="SearchValue"
        placeholder="搜索客户姓名、电话、房屋地址房号等"
        @search="onSearch"
        style="width: 500px;"
        enterButton="查询" size="large"
      />
    </div>
    <a-table :columns="columns" :dataSource="dataList" bordered :scroll="{ x: 3000 }" :rowKey="record => record.processInstanceId" :pagination='false' :locale='locale'>
      <template slot="workOrderNumber" slot-scope="text, item">
        <a href="javascript:;" @click="suer(item, text)">{{text}}</a>
      </template>
    </a-table>
    <div class="approve_wrap_pagnin">
      <a-pagination showSizeChanger :pageSize.sync="pageSize" @showSizeChange="onShowSizeChange" :total="total" v-model="current" style="margin-top: 30px;"/>
    </div>
  </div>
</template>
<script>

const columns = [
  {
    title: '订单编号',
    dataIndex: 'workOrderNumber',
    align: 'center',
    scopedSlots: { customRender: 'workOrderNumber' }
  },
  {
    title: '订单名称',
    dataIndex: 'workOrderTitle',
    align: 'center'
  },
  {
    title: '客户电话',
    align: 'center',
    dataIndex: 'customerPhone'
  },
  {
    title: '省份',
    align: 'center',
    dataIndex: 'province'
  },
  {
    title: '城市',
    align: 'center',
    dataIndex: 'city'
  },
  {
    title: '区',
    align: 'center',
    dataIndex: 'district'
  },
  {
    title: '小区',
    align: 'center',
    dataIndex: 'project'
  },
  {
    title: '栋',
    align: 'center',
    dataIndex: 'building'
  },
  {
    title: '单元号-房号',
    align: 'center',
    dataIndex: 'house'
  },
  {
    title: '状态',
    align: 'center',
    dataIndex: 'status'
  },
  {
    title: '报单时间',
    align: 'center',
    dataIndex: 'declarationTime'
  },
  {
    title: '领取时间',
    align: 'center',
    dataIndex: 'receiveTime'
  },
  {
    title: '跟单天数',
    align: 'center',
    dataIndex: 'documentaryDays'
  },
  {
    title: '已收定金',
    align: 'center',
    dataIndex: 'earnestMoney'
  },
  {
    title: '签约金额',
    align: 'center',
    dataIndex: 'signedMoney'
  },
  {
    title: '已收款',
    align: 'center',
    dataIndex: 'paidMoney'
  },
  {
    title: '收款比例',
    align: 'center',
    dataIndex: 'collectionRatio'
  },
  {
    title: '预计开工',
    align: 'center',
    dataIndex: 'planStartConstructionTime'
  },
  {
    title: '预计完工',
    align: 'center',
    dataIndex: 'planEndConstructionTime'
  },
  {
    title: '备注',
    align: 'center',
    dataIndex: 'remark'
  },
  {
    title: '报单来源',
    align: 'center',
    dataIndex: 'source'
  },
  {
    title: '报单人员',
    align: 'center',
    dataIndex: 'submitter'
  },
  {
    title: '客服人员',
    align: 'center',
    dataIndex: 'customerServiceStaffName'
  },
  {
    title: '设计师',
    align: 'center',
    dataIndex: 'designerName'
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
      SearchValue: '', // 条件搜索
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
    getList () {
      let obj = {
        pageNum: this.current,
        pageSize: this.pageSize,
        keyword: this.SearchValue === '' ? null : this.SearchValue,
        userId: 1
      }
      this.$request.post('/processInstance/Settlement/0/list', obj).then(res => {
        if (res.code === 0) {
          this.dataList = res.result.list
          this.total = res.result.total
        }
      })
    },
    onShowSizeChange (current, pageSize) { // 选择条数
      this.pageSize = pageSize
      this.getList()
    },
    onSearch (e) {
      this.getList()
    },
    suer (item) {
      sessionStorage.setItem('orderInfo', JSON.stringify(item))
      this.$router.push({ path: '/settlement-detail', query: { id: item.processInstanceId, type: 1, pId: item.processInstanceId, souce: 'add' } })
    }
  }
}
</script>
<style lang="scss">
.approve_wrap_seach {
  margin-bottom: 20px;
}
.approve_wrap_pagnin {
  display: flex;
  justify-content: flex-end;
}
</style>
