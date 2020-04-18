<template>
  <div class="CustomReceipt">
    <common-header :value='infoValue'></common-header>
    <!-- 发起收款 -->
    <div class="top_Dom">
      <a-button class="btn_add" type="primary" @click="addReceiptFn" v-if="(orderStatis !== 0 && orderStatis !== 521) && (RouterNameFlag[mythat.$route.name] || RouterNameFlag['order_initiateCollection_btn'])"><a-icon type="plus"/>发起收款</a-button>
    </div>
    <!-- 自定义收款列表 -->
    <div class="list_Dom">
      <a-table :bordered='true' :columns="receiptColumns" :dataSource="receiptDataSource"  :locale="{emptyText: '暂无自定义收款'}" :pagination="false">
        <span slot="action" slot-scope="record">
          <a-button type="primary" size="small" @click="editReceiptFn(record)" v-if="(orderStatis !== 0 && orderStatis !== 521 && record.status !== 3) && (RouterNameFlag[mythat.$route.name] || RouterNameFlag['order_receivables_btn'])">收款</a-button>
        </span>
      </a-table>
    </div>
    <!-- 发起收款弹框 -->
    <a-modal
      title="发起自定义收款"
      :visible="receiptVisible"
      :maskClosable='false'
      @ok="receiptSubmitOk"
      :okButtonProps="{ props: { loading: okBtnLoading } }"
      @cancel="receiptCancel"
      okText="提交"
      cancelText="取消"
      width='750px'>
      <a-form :form='refundForm'>
        <!-- 款项名称 -->
        <a-form-item label="款项名称" v-bind="formItemLayout" >
          <a-input v-decorator="receiptSubObject.receiptName" placeholder="如设计费，主材代购费等" maxlength="50" />
        </a-form-item>
        <!-- 应收金额 -->
        <a-form-item label="应收金额" v-bind="formItemLayout" >
          <a-input-number v-decorator="receiptSubObject.receivableAmount" placeholder="支持2位小数，确定金额谨慎输入" :min="0" :max="999999999" style="width: 100%" />
        </a-form-item>
        <!-- 收款方式 -->
        <a-form-item label="收款方式" v-bind="formItemLayout" >
          <a-radio-group v-decorator="receiptSubObject.receivableCheck">
            <a-radio value="hundsun_nfxpos_act" checked>
              POS机刷卡
            </a-radio>
            <a-radio value="under_line">
              线下支付
            </a-radio>
          </a-radio-group>
          <!-- <a-radio value="18" checked v-decorator="receiptSubObject.receivableCheck">POS机刷卡</a-radio> -->
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 点击收款弹框 -->
    <a-modal 
      title="收款"
      :visible="payVisible"
      :maskClosable='true'
      cancelText="取消"
      :footer="null"
      @cancel="payCancel">
      <a-spin :spinning="payspinning">
        <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
        <div class="img_Dom" style="text-align: center">
          <img :src="paymaneImg" alt="">
        </div>
      </a-spin>
    </a-modal>
    
  </div>
</template>
<script>
import CommonHeader from '@/components/CommonHeader/index.vue'
import { myPower } from '@/common/utils/power.js'

const receiptColumns = [{
  title: '序号',
  dataIndex: 'key',
  width: 80
}, {
  title: '款项',
  dataIndex: 'receiptName'
}, {
  title: '应收金额',
  dataIndex: 'receivableAmount'
}, {
  title: '状态',
  dataIndex: 'statusName'
}, {
  title: '收款方式',
  dataIndex: 'paymentName'
}, {
  title: '时间',
  dataIndex: 'paymentTime'
},{
  title: '操作',
  key: 'action',
  width: 180,
  scopedSlots: { customRender: 'action' }
}]
receiptColumns.forEach(icon => {
  icon.align = 'center'
})

export default {
  data () {
    return {
      mythat: this,
      infoValue: {
        index: 7
      },
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        }
      },
      receiptColumns,
      receiptDataSource: [],
      receiptVisible: false,
      receiptSubObject: {
        receiptName: [
          'receiptName', {
            rules: [{ required: true, message: '请输入款项名称' }, { max: 10, message: '款项名称限制输入10个字符' }]
          }
        ],
        receivableAmount: [
          'receivableAmount', {
            rules: [{ required: true, message: '请输入应收金额' }, { pattern: /^(\d|([1-9]\d+))(\.\d{1,2})?$/, message: '请输入正确应收金额，小数点后保留两位' }]
          }
        ],
        receivableCheck: ['receivableCheck', {initialValue: 'hundsun_nfxpos_act'}]
      },
      orderInfo: {}, // 当前工单信息
      orderStatis: 0, // 工单ID状态
      payVisible: false,
      paymaneImg: '',
      payspinning: false,
      okBtnLoading: false // 发起收款弹框的确定loading
    }
  },
  mixins: [myPower],
  components: {
    CommonHeader
  },
  created () {
    // 刷新页面接口
    this.orderInfo = JSON.parse(sessionStorage.getItem('orderValue'))
    this.getOrderStatus()
    this.showPageFn()
  },
  beforeCreate () {
    this.refundForm = this.$form.createForm(this)
  },
  methods: {
    // 查看当前工单的状态接口
    getOrderStatus () {
      this.$request.get('/projectWorkOrder/getWorkOrderBasicInfoByCode?workOrderNumber=' + this.orderInfo.code).then(res => {
        if (res.code === 0) {
          this.orderStatis = Number(res.result.status)
        }
      })
    },
    // 刷新页面接口
    showPageFn () {
      let adata = {
        workOrderId: JSON.parse(sessionStorage.orderValue).id,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      this.$request.get('/customReceipt/list?workOrderNumber=' + this.orderInfo.code).then(response => {
        if (response.code == 0) {
          if (response.result) {
            this.receiptDataSource = response.result
            this.receiptDataSource.forEach((item,index) => {
              item.key = Number(index) + 1
              if (item.status == 1) {
                item.statusName = '未支付'
              } else if (item.status == 2) {
                item.statusName = '支付中'
              } else if (item.status == 3) {
                item.statusName = '支付成功'
              }
              if (item.paymentType == 'hundsun_nfxpos_act') {
                item.paymentName = 'POS机支付'
              } else if (item.paymentType == 'under_line') {
                item.paymentName = '线下支付'
              }
            })
          }
        }
      })
    },
    // 发起收款显示弹框
    addReceiptFn() {
      this.refundForm.resetFields()
      this.receiptVisible = true
    },
    // 点击收款按钮
    editReceiptFn(adata) {
      if (adata.paymentType == 'under_line') {
        this.$confirm({
          title: '确认使用线下支付',
          content: '确认线下已支付该笔合同款，提交后不可更改',
          okText: '确认',
          centered: true,
          cancelText: '取消',
          onOk: () => {
            let sdata = {
              customReceiptId: adata.id
            }
            this.$request.post('/customReceipt/receipt', sdata).then(response => {
              if (response.code == 0) {
                this.$message.success('收款成功')
                this.getOrderStatus()
                this.showPageFn()
              }
            })
          }
        })
      } else {
        this.payVisible = true
        this.payspinning = true
        let sdata = {
          customReceiptId: adata.id
        }
        this.$request.post('/customReceipt/receipt', sdata).then(response => {
          if (response.code == 0) {
            this.payspinning = false
            this.paymaneImg = response.result
          }
        })
      }
      
    },
    // 点击提交事件
    receiptSubmitOk(e) {
      e.preventDefault()
      this.refundForm.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.okBtnLoading = true
          // 收款方式。hundsun_nfxpos_act：POS机支付；under_line：线下收款
          let adata = {
            receiptName: values.receiptName,
            receivableAmount: values.receivableAmount,
            workOrderNumber: JSON.parse(sessionStorage.orderValue).code,
            paymentType: values.receivableCheck
          }
          this.$request.post('/customReceipt/create', adata).then(response => {
            if (response.code == 0) {
              this.okBtnLoading = false
              this.receiptVisible = false
              this.$message.success('创建成功')
              this.getOrderStatus()
              this.showPageFn()
            }
          }).catch(err => {
            this.okBtnLoading = false
          })
        }
      })
    },
    // 取消弹框事件
    receiptCancel() {
      this.receiptVisible = false
    },
    payCancel() {
      this.paymaneImg = ''
      this.payVisible = false
      this.getOrderStatus()
      this.showPageFn()
    }
  }
}
</script>
<style lang="scss">
  .CustomReceipt {
    .top_Dom{
      margin: 60px 0px 10px 0px;
      text-align: right;
      .btn_add{
        background: #85CE61;
        border: 1px solid #85CE61;
      }
    }
    .img_Dom{
      // height: 120px!important;
    }
  }
</style>
