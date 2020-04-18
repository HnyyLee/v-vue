<template>
  <div class="contract_approve_wrap">
    <h1>签约合同-待审核</h1>
    <a-table :columns="columns" :dataSource="dataList" bordered :rowKey="record => record.id" :scroll="{ x: 1600 }" :pagination='false' :locale='locale'>
      <template slot="pricingProposalId" slot-scope="hot">
        <a href="javascript:;" @click="go(hot)">报价方案</a>
      </template>
      <template slot="workOrderDesignId" slot-scope="look">
        <a href="javascript:;" @click="go2(look)">设计方案</a>
      </template>
      <template slot="id" slot-scope="text">
        <a-button size="small" type="primary" style="margin-right: 10px" @click="suer(text, 1)" v-if="RouterNameFlag[mythat.$route.name] || RouterNameFlag['contractapprove_Agree']" >同意</a-button>
        <a-button size="small" @click="refuse(text, 2)" v-if="RouterNameFlag[mythat.$route.name] || RouterNameFlag['contractapprove_Refuse']">拒绝</a-button>
      </template>
      <template slot="contractData" slot-scope="text, scope">
        <a href="javascript:;" @click="contractFn(text, scope)" v-if="scope.signOnlineId">点击查看</a>
        <span v-else>暂无合同</span>
      </template>
    </a-table>
    <div class="contract_wrap_pagnin">
      <a-pagination showSizeChanger :pageSize.sync="pageSize" @showSizeChange="onShowSizeChange" :total="total" v-model="current" style="margin-top: 30px;"/>
    </div>
    <a-modal
      title="审批"
      :visible="visible"
      :maskClosable='false'
      @ok="handleOk"
      @cancel="handleCancel"
      okText="确定"
      cancelText="取消"
      :okButtonProps="{ props: { loading: contractBtnLoading } }">
      <p>{{ModalText}}</p>
    </a-modal>

    <!-- 这里是详情 -->
    <commoncont-detail ref="comDetailDom" :detailData="detailData"></commoncont-detail>
    <!-- 这是设计方案详情 -->
    <design-detail ref="comDesignDom" :designId="sendDesignId"></design-detail>

  </div>
</template>
<script>
import { myPower } from '@/common/utils/power.js'

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
  {
    title: '操作',
    width: 180,
    dataIndex: 'id',
    align: 'center',
    scopedSlots: { customRender: 'id' }
  }
]
export default {
  data () {
    return {
      mythat: this,
      columns,
      dataList: [], // 列表数据
      visible: false,
      ModalText: '',
      approvedId: '', // 审批的ID
      type: 1, // 1位同意 2位拒绝 的审批
      locale: { emptyText: '暂无数据' }, // 无数据显示文案
      pageSize: 10,
      current: 1,
      total: 0,
      contractBtnLoading: false, // 审批二次确认弹框确定按钮的loading
      detailData: {}, // 查看详情的数据
      sendDesignId: '', // 前往设计方案弹框的ID
    }
  },
  created () {
    this.getList()
  },
  mixins: [myPower],
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
      this.$request.post('/processInstance/Signing/' + false + '/list', obj).then(res => {
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
    suer (id, type) {
      this.approvedId = id
      this.type = type
      this.visible = true
      this.ModalText = '是否通过当前合同审批'
    },
    refuse (id, type) {
      this.approvedId = id
      this.type = type
      this.visible = true
      this.ModalText = '是否拒绝当前合同审批'
    },
    handleOk () {
      let obj = {
        processInstanceId: this.approvedId
      }
      if (this.type === 1) {
        obj.approved = true
      } else if (this.type === 2) {
        obj.approved = false
      }
      this.contractBtnLoading = true
      this.$request.post('/process/approval', obj).then(res => {
        if (res.code === 0) {
          this.contractBtnLoading = false
          this.visible = false
          this.getList()
        }
      })
    },
    handleCancel () {
      this.contractBtnLoading = false
      this.visible = false
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
