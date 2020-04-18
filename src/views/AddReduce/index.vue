<template>
  <div class="add_reduce_wrap">
    <h1>工程变更-待审核</h1>
    <a-table :columns="columns" :dataSource="dataList" bordered :pagination='false' :locale='locale' :rowKey="record => record.id" :scroll='{ x: 2000 }' >
      <div slot="workOrderAddDropId" slot-scope="id, record">
        <span style="color:#1890ff; cursor: pointer;" @click="goAdd(id, record)">
          点击查看
        </span>
      </div>
      <div slot="pricingProposalId" slot-scope="id">
        <span style="color:#1890ff; cursor: pointer;" @click="goPirce(id)">
          点击查看
        </span>
      </div>
      <template slot="id" slot-scope="text">
        <a-button type="primary" size="small" style="margin-right: 10px" @click="suer(text, 1)" v-if="RouterNameFlag[mythat.$route.name] || RouterNameFlag['addreduce_Agree']">同意</a-button>
        <a-button size="small" @click="refuse(text, 2)" v-if="RouterNameFlag[mythat.$route.name] || RouterNameFlag['addreduce_Refuse']">拒绝</a-button>
      </template>
    </a-table>
    <div class="add_reduce_wrap_pagnin">
      <a-pagination showSizeChanger :pageSize.sync="pageSize" @showSizeChange="onShowSizeChange" :total="total" v-model="current" style="margin-top: 30px;"/>
    </div>
    <a-modal
      title="审批"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      okText="确定"
      cancelText="取消"
      :maskClosable='false'
      :okButtonProps="{ props: { loading: reduceBtnLoading } }">
      <p>{{ModalText}}</p>
    </a-modal>
  </div>
</template>
<script>
import { myPower } from '@/common/utils/power.js'

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
    title: '工程变更类型',
    dataIndex: 'changeTypeName',
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
    title: '操作',
    dataIndex: 'id',
    width: 180,
    align: 'center',
    scopedSlots: { customRender: 'id' }
  }
]
export default {
  data () {
    return {
      mythat: this,
      columns,
      dataList: [],
      visible: false,
      ModalText: '',
      approvedId: '', // 审批的ID
      type: 1, // 1位同意 2位拒绝 的审批
      locale: { emptyText: '暂无数据' }, // 无数据显示文案
      pageSize: 10,
      current: 1,
      total: 0,
      reduceBtnLoading: false // 审批二次确认弹框确定按钮的loading
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
  methods: {
    getList () { // 列表数据
      let obj = {
        pageNum: this.current, // 页数
        pageSize: this.pageSize, // 条数
        userId: 1
      }
      this.$request.post('/processInstance/Change/' + false + '/list', obj).then(res => {
        if (res.code === 0) {
          if (res.result.list) { // 后台可能返回一个null； 这里需要判断一下是否为null；如果为null； 就赋值空数组
            let arr = []
            res.result.list.forEach((item, index) => {
              let obj = item
              obj.serial = index + 1
              if (obj.changeType == '1') {
                obj.changeTypeName = '主材变更'
              } else if (obj.changeType == '2') {
                obj.changeTypeName = '施工变更'
              }
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
    },
    suer (id, type) {
      this.approvedId = id
      this.type = type
      this.visible = true
      this.ModalText = '是否通过当前工程变更审批'
    },
    refuse (id, type) {
      this.approvedId = id
      this.type = type
      this.visible = true
      this.ModalText = '是否拒绝当前工程变更审批'
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
      this.reduceBtnLoading = true
      this.$request.post('/process/approval', obj).then(res => {
        if (res.code === 0) {
          this.reduceBtnLoading = false
          this.visible = false
          this.getList()
        }
      })
    },
    handleCancel () {
      this.reduceBtnLoading = false
      this.visible = false
    },
    goAdd (id, adata) { // 转跳工程变更明细
      console.log('dd', adata)
      // this.$router.push({ path: '/increase', query: { id: id } })
      if (adata.changeType == '1') {
        this.$router.push({ path: '/materialPage', query: { pageSouch: 'examine', id: id } })
      } else if (adata.changeType == '2') {
        this.$router.push({ path: '/alterationPage', query: { pageSouch: 'examine', id: id } })
      } 
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
