<template>
  <div class="clinent_refund_wrap">
    <h1>客户退款-待审核</h1>
    <a-table :columns="columns" :dataSource="dataArr" bordered :rowKey="record => record.processInstanceId" :pagination='false' :locale='locale' :scroll="{ x: 2200 }">
      <template slot="processInstanceId" slot-scope="text">
        <a-button type="primary" style="margin-right: 10px" @click="suer(text, 1)" v-if="RouterNameFlag[mythat.$route.name] || RouterNameFlag['clientrefund_Agree']">同意</a-button>
        <a-button type="primary" @click="refuse(text, 2)" v-if="RouterNameFlag[mythat.$route.name] || RouterNameFlag['clientrefund_Refuse']">拒绝</a-button>
      </template>
      <span slot="continueCooperate" slot-scope='val'>
        {{val == true ? '继续合作': '工单关闭'}}
      </span>
    </a-table>
    <div class="clinent_wrap_pagnin">
      <a-pagination showSizeChanger :pageSize.sync="pageSize" @showSizeChange="onShowSizeChange" :total="total" v-model="current" style="margin-top: 30px;"/>
    </div>
    <a-modal
      title="退款审批"
      :visible="visible"
      :maskClosable='false'
      okText="确定"
      cancelText="取消"
      @ok="handleOk"
      @cancel="handleCancel"
      :okButtonProps="{ props: { loading: clientLoading } }">
      <p>{{ModalText}}</p>
    </a-modal>
  </div>
</template>
<script>
import { myPower } from '@/common/utils/power.js'

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
    title: '订单是否关闭',
    dataIndex: 'continueCooperate',
    align: 'center',
    scopedSlots: { customRender: 'continueCooperate' }
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
    title: '操作',
    dataIndex: 'processInstanceId',
    align: 'center',
    scopedSlots: { customRender: 'processInstanceId' }
  }
]
export default {
  data () {
    return {
      mythat: this,
      columns,
      dataArr: [],
      visible: false,
      locale: { emptyText: '暂无数据' }, // 无数据显示文案
      pageSize: 10,
      current: 1,
      total: 0,
      approvedId: '', // 工作ID
      type: '', // 是否通过 1位通过；2位拒绝
      ModalText: '',
      clientLoading: false // 退款审批弹框按钮的loading
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
    getList () { // 获取列表
      let obj = {
        pageNum: this.current,
        pageSize: this.pageSize,
        userId: 11
      }
      this.$request.post('/processInstance/Refund/0/list', obj).then(res => {
        if (res.code === 0) {
          this.total = res.result.total
          if (res.result.list) {
            this.dataArr = res.result.list
          } else {
            this.dataArr = []
          }
        }
      })
    },
    onShowSizeChange (current, pageSize) { // 选择条数
      this.pageSize = pageSize
      this.getList()
    },
    suer (id, type) {
      this.visible = true
      this.approvedId = id
      this.type = type
      this.visible = true
      this.ModalText = '是否通过当前退款审批'
    },
    refuse (id, type) {
      this.visible = true
      this.approvedId = id
      this.type = type
      this.visible = true
      this.ModalText = '是否拒绝当前退款审批'
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
      this.clientLoading = true
      this.$request.post('/process/approval', obj).then(res => {
        if (res.code === 0) {
          this.clientLoading = false
          this.visible = false
          this.getList()
        }
      })
    },
    handleCancel () {
      this.clientLoading = false
      this.visible = false
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
