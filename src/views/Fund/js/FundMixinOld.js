
import title from './index'
import verify from './form'

export var fundMixinOld = {
  data() {
    return {
      infoValue: {
        index: 6
      },
      pircUrl: '', // 图片路劲
      defaltNum: 1,
      dataArr: [],
      dataArr2: [],
      columns: [],
      columns2: [],
      refunedFlag: false,
      paymentFlag: false, // 是否显示付款弹窗
      value: 1,
      value2: 3,
      visible2: false,
      verify: {}, // 表单检验规则
      receiptStatusArr: [], // 应收款状态
      refundStatusArr: [], // 退款状态
      refundBtnFlag: false,
      orderId: {}, // 工单信息
      EarnestList: ['1000', '2000'], // 定金选择列表
      receipPirceValue: {}, // 应收款的收款信息
      paymentInfo: {}, // 临时存储付款所需信息
      imgFlag: 1, // 是否显示收款二维码 1 位不显示 2位loading 3位图片
      refundForm: this.$form.createForm(this), // 表单 (发起退款)
      paymentForm: this.$form.createForm(this), // 表单 （付款）
      bankList: [], // 银行列表
      cityCode: '', // 获取分行列表用到
      bankTypeCode: '', // 银行类型（获取分行列表用到）
      privonList: [], // 省份
      cityList: [], // 城市
      certificateList: [
        {
          code: 1,
          name: '身份证'
        }
      ], // 证件类型
      statusFlag: 1, // 1为可以修改支付方式， 2为不可以修改支付方式
      orderStatis: '', // 实时的工单状态（最新）
      branchInfo: {}, // 选择银行信息
      branchTypeList: [], // 银行类型
      refunedCauseList: [], // 退款原因
      chooseFirstType: true, // 选择支付方式弹框选择pos支付的时候这个值为false
      refunedBtnLoading: false, // 发起退款的弹框里面提交按钮的loading
      oldReceFormData: this.$form.createForm(this), // 收款页面的选择模板的表单
      oldReceivabVerify: {
        myapproval: [ 'oldReceivab', { rules: [ { required: true, message: '请选择审批模板' } ] } ]
      }, 
      oldApprovalList: [], // 审批模板的列表
    }
  },
  created: function () {
    this.verify = verify
    // 合作是否继续默认为继续合作
    this.verify.continueCooperate[1].initialValue = 1

    this.columns = title.receiptTitle
    this.columns2 = title.refundTitle
    this.receiptStatusArr = title.receiptStatus
    this.refundStatusArr = title.refunStatus
    this.orderId = JSON.parse(sessionStorage.getItem('orderValue'))
    if (this.orderId.status === '结算中' || this.orderId.status === '已结算' || this.orderId.status === '已付全款') {
      this.refundBtnFlag = false
    }
    this.getOrderStatus()
    this.getReceipt()
    this.getList()
    this.getPrivonList()
    this.getBranchTypeList()
  },
  methods: {
    // 老的页面审批模板选择下拉框的列表数据
    oldApprovalFn() {
      let adata = {
        processCode: 'UnderLine',
        pageSize: 10000
      }
      this.$request.post('/processTemplate/userList', adata).then(res => {
        if (res.code === 0) {
          this.oldApprovalList = res.result.list
        }
      })
    },
    // 修改支付方式的时候事件
    receipTypeChange(ev) {
      if (ev.target.value == 'hundsun_nfxpos_act') {
        this.chooseFirstType = false
      } else {
        this.chooseFirstType = true
      }
    },
    myCancelFn() {
      this.getOrderStatus()
      this.getReceipt()
    },
    getOrderStatus () {
      this.$request.get('/projectWorkOrder/getWorkOrderBasicInfoByCode?workOrderNumber=' + this.orderId.code).then(res => {
        if (res.code === 0) {
          if (res.result) {
            this.orderStatis = res.result.status
          }
        }
      })
    },
    btnShowFun (record) {
      if (Number(this.orderStatis) !== 0) {
        if (record.receivableCode === 'Earnest') {
          if (record.totalAmount > 0 && (record.status == 1 || record.status == 2) && (this.orderStatis === '100' || this.orderStatis === 100)) {
            return true
          } else {
            return false
          }
        } else if (record.receivableCode === 'First') {
          if (record.totalAmount > 0 && (record.status == 1 || record.status == 2) && (this.orderStatis === '200' || this.orderStatis === 200 || this.orderStatis === 100 || this.orderStatis === '100')) {
            return true
          } else {
            return false
          }
        } else if (record.receivableCode === 'Second') {
          if (record.totalAmount > 0 && (record.status == 1 || record.status == 2) && (this.orderStatis === '210' || this.orderStatis === 210)) {
            return true
          } else {
            return false
          }
        } else if (record.receivableCode === 'Third') {
          if (record.totalAmount > 0 && (record.status == 1 || record.status == 2) && (this.orderStatis === '511' || this.orderStatis === 511)) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      }
    },
    getBranCode (e) { // 选择银行类型
      this.bankTypeCode = e
      this.refundForm.resetFields(['bankBranch'])
      this.paymentForm.resetFields(['bankBranch'])
      this.bankList = []
      if (this.cityCode !== '' && this.bankTypeCode !== '') {
        this.getBranchList()
      }
    },
    getBanCode (e) { // 选择城市；
      this.refundForm.resetFields(['bankBranch'])
      this.paymentForm.resetFields(['bankBranch'])
      this.bankList = []
      this.cityCode = e
      if (this.cityCode !== '' && this.bankTypeCode !== '') {
        this.getBranchList()
      }
    },
    getBranchTypeList () { // 银行类型
      this.$request.get('/bank/type/list').then(res => {
        this.branchTypeList = []
        if (res.code === 0) {
          if (res.result) {
            res.result.forEach(item => {
              if (!item.code) {
                item.code = 'qt'
                item.type = 'qtcba'
              }
              this.branchTypeList.push(item)
            })
          }
        }
      })
    },
    getBranchList () { // 获取分行列表
      if (this.bankTypeCode === 'qtcba') {
        this.bankTypeCode = ''
      }
      this.$request.get('/bank/branch/list?cityCode=' + this.cityCode + '&bankCode=' + this.bankTypeCode).then(res => {
        if (res.code === 0) {
          this.bankList = res.result
        }
      })
    },
    getCityCode (e) { // 获取城市列表
      this.refundForm.resetFields(['bankCity', 'bankTypeCode', 'bankBranch'])
      this.paymentForm.resetFields(['bankCity', 'bankTypeCode', 'bankBranch'])
      this.cityList = []
      this.bankList = []
      this.$request.get('/region/city/list?provinceCode=' + e).then(res => {
        if (res.code === 0) {
          this.cityList = res.result
        }
      })
    },
    getPrivonList () { // 获取省份
      this.$request.get('/region/province/list').then(res => {
        if (res.code === 0) {
          this.privonList = res.result
        }
      })
    },
    getList () { // 获取退款原因
      this.$request.get('/system/config/2/list').then(res => {
        if (res.code === 0) {
          this.refunedCauseList = []
          if (res.result) {
            this.refunedCauseList = res.result
          }
        }
      })
    },
    paymentOk (e) { // 付款确定重复啊
      e.preventDefault()
      this.paymentForm.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let obj = {
            accountName: values.accountName,
            accountNumber: values.accountNumber,
            accountType: values.infoType,
            branchBankCode: values.bankBranch,
            idNumber: values.certificateId,
            idType: values.certificate,
            receivableId: this.paymentInfo.id
          }
          this.$request.post('/receivable/payment', obj).then(res => {
            if (res.code === 0) {
              this.paymentFlag = false
              this.$message.success('申请付款成功')
              this.getReceipt()
            }
          })
        }
      })
    },
    paymentCancel () { // 付款取消按钮
      this.paymentFlag = false
      this.paymentForm.resetFields()
    },
    getReceipt () { // 收款记录列表信息
      this.$request.get('/receivable/list?workOrderNumber=' + this.orderId.code).then(res => {
        if (res.code === 0) {
          this.dataArr = res.result
          this.dataArr.forEach(item => {
            if (item.paymentType == 'hundsun_wechatlet') {
              item.myPaymentName = '微信支付'
            } else if (item.paymentType == 'hundsun_nfxpos_act') {
              item.myPaymentName = 'POS机支付'
            } else if (item.paymentType == 'under_line') {
              item.myPaymentName = '线下支付'
            }
          })
        }
      })
    },
    getRenfundList () { // 退款列表
      this.$request.get('/refund/list?workOrderNumber=' + this.orderId.code).then(res => {
        if (res.code === 0) {
          this.dataArr2 = res.result
        }
      })
    },
    disposeStatus (i) { // 处理状态；转译中文；应收款
      let str = ''
      this.receiptStatusArr.forEach(item => {
        if (i === item.id) {
          str = item.name
        }
      })
      return str
    },
    disposeStatusRefund (i) { // 处理状态；转译中文；退款
      let str = ''
      this.refundStatusArr.forEach(item => {
        if (i === item.id) {
          str = item.name
        }
      })
      return str
    },
    collection (event) { // 收款操作
      this.visible2 = true
      this.statusFlag = 1
      this.receipPirceValue = event
      this.pircUrl = ''
      this.imgFlag = 1
      this.oldApprovalFn()
    },
    paymentFun (e) { // 付款操作
      this.paymentInfo = e
      this.paymentFlag = true
      this.paymentForm.resetFields([])
    },
    // refundPriceFun () {
    //   this.refunedFlag = true
    // },
    // 退款
    refundFun () {
      this.refunedFlag = true
      this.refundForm.resetFields()
      this.refundForm.setFieldsValue({ refundReason: [] })
    },
    selectFun (i) {
      this.defaltNum = i
      if (i === 1) {
        this.getReceipt()
      } else if (i === 2) {
        this.getRenfundList()
      }
    },
    handleOk (e) {
      e.preventDefault()
      this.refundForm.validateFieldsAndScroll((err, values) => {
        if (!err) {
          if ((values.refundAmount - 0) <= 0) {
            this.$message.error('输入的价钱不能为0或者为负数')
            return
          }
          let obj = {
            workOrderNumber: this.orderId.code,
            refundReason: values.refundReason,
            refundAmount: values.refundAmount,
            reasonDesc: values.reasonDesc,
            idType: values.certificate,
            idNumber: values.certificateId,
            continueCooperate: values.continueCooperate,
            branchBankCode: values.bankBranch,
            accountType: values.infoType,
            accountNumber: values.accountNumber,
            accountName: values.accountName
          }
          this.refunedBtnLoading = true
          this.$request.post('/refund/apply', obj).then(res => {
            if (res.code === 0) {
              this.refunedBtnLoading = false
              this.refunedFlag = false
              this.getRenfundList()
            }
          })
        }
      })
    },
    handleCancel () {
      this.refunedBtnLoading = false
      this.refunedFlag = false
    },
    sure (e) { // 使用POS机支付
      e.preventDefault()
      this.imgFlag = 2
      let obj = {
        paymentType: this.receipPirceValue.paymentType,
        receivableId: this.receipPirceValue.id
      }
      if (this.receipPirceValue.receivableCode === 'Earnest') {
        obj.earnestAmount = this.receipPirceValue.totalAmount
        this.$request.post('/receivable/earnest/receipt', obj).then(res => {
          if (res.code === 0) {
            this.imgFlag = 3
            this.statusFlag = 2
            this.pircUrl = res.result
          }
        })
      } else {
        this.$request.post('/receivable/receipt', obj).then(res => {
          if (res.code === 0) {
            this.imgFlag = 3
            this.statusFlag = 2
            this.pircUrl = res.result
          }
        })
      }
    },
    sure2 (e) { // 使用微信付款方式
      e.preventDefault()
      let obj = {
        paymentType: this.receipPirceValue.paymentType,
        receivableId: this.receipPirceValue.id
      }
      if (this.receipPirceValue.receivableCode === 'Earnest') {
        obj.earnestAmount = this.receipPirceValue.totalAmount
        this.$request.post('/receivable/earnest/receipt', obj).then(res => {
          if (res.code === 0) {
            this.$message.success('操作成功;请通知用户在小程序付款')
            this.visible2 = false
            this.getOrderStatus()
            this.getReceipt()
          }
        })
      } else {
        this.$request.post('/receivable/receipt', obj).then(res => {
          if (res.code === 0) {
            this.$message.success('操作成功;请通知用户在小程序付款')
            this.visible2 = false
            this.getOrderStatus()
            this.getReceipt()
          }
        })
      }
    },
    sure3 (e) { // 使用线下支付
      e.preventDefault()
      this.oldReceFormData.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.$confirm({
            title: '确认使用线下支付',
            content: '确认线下已支付该笔合同款，提交后不可更改',
            okText: '确认',
            centered: true,
            cancelText: '取消',
            onOk: () => {
              let obj = {
                paymentType: this.receipPirceValue.paymentType,
                receivableId: this.receipPirceValue.id,
                processId: values.oldReceivab
              }
              if (this.receipPirceValue.receivableCode === 'Earnest') {
                obj.earnestAmount = this.receipPirceValue.totalAmount
                this.$request.post('/receivable/earnest/receipt', obj).then(res => {
                  if (res.code === 0) {
                    this.$message.success('操作成功!')
                    this.visible2 = false
                    this.getOrderStatus()
                    this.getReceipt()
                  }
                })
              } else {
                this.$request.post('/receivable/receipt', obj).then(res => {
                  if (res.code === 0) {
                    this.$message.success('操作成功!')
                    this.visible2 = false
                    this.getOrderStatus()
                    this.getReceipt()
                  }
                })
              }
            }
          })
        }
      })
    }
  }
}
