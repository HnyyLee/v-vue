<template>
  <div class="contract_approve_wrap">
    <h1>签约合同-已审核</h1>
    <a-table :columns="columns" :dataSource="dataList" bordered :rowKey="record => record.id" :scroll="{ x: 1600 }" :pagination='false' :locale='locale'>
      <template slot="pricingProposalId" slot-scope="hot">
        <a href="javascript:;" @click="go(hot)">报价方案</a>
      </template>
      <template slot="workOrderDesignId" slot-scope="look">
        <a href="javascript:;" @click="go2(look)">设计方案</a>
      </template>
      <template slot="contractData" slot-scope="text, scope">
        <a href="javascript:;" @click="contractFn(text, scope)" v-if="scope.signOnlineId">点击查看</a>
        <span v-else>暂无合同</span>
      </template>
    </a-table>
    <div class="contract_wrap_pagnin">
      <a-pagination showSizeChanger :pageSize.sync="pageSize" @showSizeChange="onShowSizeChange" :total="total" v-model="current" style="margin-top: 30px;"/>
    </div>
    <!-- 这里是详情 -->
    <commoncont-detail ref="comDetailDom" :detailData="detailData"></commoncont-detail>
    <!-- 这是设计方案详情 -->
    <design-detail ref="comDesignDom" :designId="sendDesignId"></design-detail>

  </div>
</template>
<script>
import commoncontDetail from '@/views/Contract/common/commonContDetail'
import designDetail from '@/views/Contract/common/designDetail'

const columns = [
  {
    title: '工单编号',
    dataIndex: 'code',
    align: 'center'
  },
  {
    title: '工单名称',
    dataIndex: 'title',
    align: 'center'
  },
  {
    title: '客户电话',
    dataIndex: 'phone',
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
    title: '单元-房号',
    dataIndex: 'house',
    align: 'center'
  },
  {
    title: '签约金额',
    dataIndex: 'signedMoney',
    align: 'center'
  },
  {
    title: '设计师',
    dataIndex: 'designerName',
    align: 'center'
  },
  {
    title: '报价方案',
    dataIndex: 'pricingProposalId',
    align: 'center',
    scopedSlots: { customRender: 'pricingProposalId' }
  },
  {
    title: '设计方案',
    dataIndex: 'workOrderDesignId',
    align: 'center',
    scopedSlots: { customRender: 'workOrderDesignId' }
  },
  {
    title: '合同信息',
    dataIndex: 'contractData',
    align: 'center',
    scopedSlots: { customRender: 'contractData' }
  },
]
export default {
  data () {
    return {
      columns,
      dataList: [],
      locale: { emptyText: '暂无数据' }, // 无数据显示文案
      pageSize: 10,
      current: 1,
      total: 0,
      detailData: {}, // 查看详情的数据
      sendDesignId: '', // 前往设计方案弹框的ID
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
  components: {
    commoncontDetail,
    designDetail
  },
  methods: {
    getList () { // 列表数据
      let obj = {
        pageNum: this.current, // 页数
        pageSize: this.pageSize, // 条数
        userId: 1
      }
      this.$request.post('/processInstance/Signing/' + true + '/list', obj).then(res => {
        if (res.code === 0) {
          if (res.result.list) { // 后台可能返回一个null； 这里需要判断一下是否为null；如果为null； 就赋值空数组
            this.dataList = res.result.list
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
    },
    go (id) {
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
    go2 (id) {
      if (id) {
        this.$refs.comDesignDom.designVisible = true
        this.sendDesignId = id
        this.$refs.comDesignDom.getPictUrlList(id)
      } else {
        this.sendDesignId = id
        this.$refs.comDesignDom.getPictUrlList(id)
      }
    },
    // 点击查看合同信息
    contractFn(text, scpoe) {
      this.$request.get('/signContractOnLine/getContractInfoBySignOnlineId?signOnlineId=' + scpoe.signOnlineId).then(res => {
        if (res.code == 0) {
          this.detailData = res.result
          this.$refs.comDetailDom.detailVisible = true
        }
      })
    }
  }
}
</script>

<style lang="scss">
.contract_wrap_pagnin {
  display: flex;
  justify-content: flex-end;
}
</style>
