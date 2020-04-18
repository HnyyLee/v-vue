
import { depositColumns, orderColumns, receiptColumns } from './index'
import payVerify from './form'

export var fundMixinNew = {
  data() {
    return {
      depositPoplur: false,
      depositColumns,
      depositFlag: false, // 收取定金按钮的disabled
      depositData: [],
      moneyProject: {},
      orderColumns,
      orderData: [],
      receiptPoplur: false,
      receiptColumns,
      receiptData: [],
      unpaidAmount: false, // 这个值，如果收款单列表里面存在未支付的收款单，那么不可创建收款单
      receivablePoplur: false, // 收款单的弹框值
      receivableData: {},
      saveReceivId: '', // 保存当前收款单的id
      receivableName: '确认线下支付', // 收款弹框线下支付按钮文字展示
      depositName: '确认线下支付', // 收款弹框线下支付按钮文字展示
      undentLineFlag: false, // 收款弹框中线下支付按钮是否置为灰色
      paymentFlagOne: false, // 收款弹框支付方式的切换
      paymentFlagTwo: false, // 收款弹框支付方式的切换
      paymentFlagThree: false, // 收款弹框支付方式的切换
      depositPircUrl: '', // 收取定金选择POS支付时候的图片URL
      depositImgFlag: 1, // 收取定金弹框是否显示收款二维码 1 位不显示 2位loading 3位图片
      depositStatusFlag: 1, // 收取定金弹框1为可以修改支付方式， 2为不可以修改支付方式
      receivlePircUrl: '', // 收款单弹框选择POS支付时候的图片URL
      receivleImgFlag: 1, // 收款单框弹框是否显示收款二维码 1 位不显示 2位loading 3位图片
      receivleStatusFlag: 1, // 收款单弹框弹框1为可以修改支付方式， 2为不可以修改支付方式
      approvalVerify: {
        myapproval: [ 'myapproval', { rules: [ { required: true, message: '请选择审批模板' } ] } ]
      }, // 收取定金弹框支付方式为线下支付（走审批流）时候选择审批模板的下拉框数据
      receivabVerify: {
        myapproval: [ 'receivab', { rules: [ { required: true, message: '请选择审批模板' } ] } ]
      }, // 收取定金弹框支付方式为线下支付（走审批流）时候选择审批模板的下拉框数据
      approvalList: [], // 审批模板的列表
      formData: this.$form.createForm(this),
      myPaymantVisible: false, // 付款弹框的值
      myPaymentForm: this.$form.createForm(this),
      payVerify, // 新页面的付款弹框总值，表单值
      savePayOrderId: '', // 点击付款按钮时候贮存的当前点击的收款单id
      receipForm: this.$form.createForm(this), // 创建收款单弹框的form
      receFormData: this.$form.createForm(this), // 收款单弹框线下支付的form
      receipFormVitiy: {
        createReceiptAmount: [ 'createReceiptAmount', { rules: [ { required: true, message: '请输入金额，金额必须＞0，且总收款额必须≤应收合计' }, { pattern: /^(\d|([1-9]\d+))(\.\d{1,2})?$/, message: '小数点后最多保留两位小数' } ] } ]  // 创建收款单的收款金额
      },
      showTitle: true, // 金额必须＞0，且总收款额必须≤应收合计文字的展示
      posIsLoadingFlag: false, // 确认使用智能POS收款按钮正在加载中
      isPosLoadingFlag: false, // 确认使用智能POS收款按钮正在加载中
    }
  },
  created: function () {
    let orderVersion = JSON.parse(sessionStorage.orderValue).version
    if (orderVersion == '2' || orderVersion == '3'){
      this.getDepositDate()
      this.getReceiptList()
    }
  },
  methods: {
    // 审批模板选择下拉框的列表数据
    approvalFn() {
      let adata = {
        processCode: 'UnderLine',
        pageSize: 10000
      }
      this.$request.post('/processTemplate/userList', adata).then(res => {
        if (res.code === 0) {
          this.approvalList = res.result.list
        }
      })
    },
    // 获取合同收款明细列表数据
    getDepositDate () {
      this.$request.get('/receivable/list?workOrderNumber=' + this.orderId.code).then(res => {
        if (res.code === 0) {
          if (res.result.length == 0) {
            this.depositFlag = true
          }
          this.depositData = res.result
          this.receiptData = res.result
          this.depositData.forEach(item => {
            item.changeAmount = item.changeAmount || '0'
            item.totalAmount = item.totalAmount || '0'
            item.receivedAmount = item.receivedAmount || '0'
            if (item.status == 1) {
              item.statusName = '未支付'
            } else if (item.status == 2) {
              item.statusName = '支付中'
            } else if (item.status == 3) {
              item.statusName = '支付成功'
            } else if (item.status == 4) {
              item.statusName = '支付失败'
            }
            if (item.receivableCode == 'Earnest') {
              this.moneyProject = item
            }
          })
        }
      })
    },
    // 获取收款单列表
    getReceiptList() {
      let myorderId = JSON.parse(sessionStorage.orderValue).id
      this.$request.get(`/receiptOrder/list/${myorderId}`).then(res => {
        if (res.code == 0) {
          if (res.result) {
            this.orderData = res.result
            this.orderData.forEach(item => {
              if (item.status == 1) {
                // 修改unpaidAmount这个值，如果收款单列表里面存在未支付的收款单，那么不可创建收款单
                this.unpaidAmount = true
                item.statusName = '未支付'
              } else if (item.status == 2) {
                // 修改unpaidAmount这个值，如果收款单列表里面存在支付中的收款单，那么不可创建收款单
                this.unpaidAmount = true
                item.statusName = '支付中'
              } else if (item.status == 3) {
                this.depositFlag = true
                item.statusName = '支付成功'
              } else if (item.status == 4) {
                item.statusName = '已删除'
              }
              if (item.paymentType == 'hundsun_wechatlet') {
                item.paymentTypeName = '微信支付'
              } else if (item.paymentType == 'hundsun_nfxpos_act') {
                item.paymentTypeName = 'POS机'
              } else if (item.paymentType == 'under_line') {
                item.paymentTypeName = '线下收款'
              } else {
                item.paymentTypeName = '--'
              }
              item.paymentTime = item.paymentTime || '--'
            })
          }
        }
      })
    },
    // 点击收取定金事件
    depositFn() {
      this.depositPoplur = true
      this.depositPircUrl = ''
      this.depositStatusFlag = 1
      this.depositImgFlag = 1

      if (this.moneyProject.status == 2 || this.moneyProject.status == 3) {
        this.depositName = '线下支付审核中'
      } else {
        this.depositName = '确认线下支付'
      }
      // 审批模板选择下拉框的列表数据
      this.approvalFn()
      
    },
    // 收取定金弹框取消事件
    depositCancel() {
      this.depositPoplur = false
      this.getOrderStatus()
      this.getDepositDate()
      this.getReceiptList()
    },
    // 收款弹框的取消事件
    receivableCancel() {
      this.receivablePoplur = false
      this.getOrderStatus()
      this.getDepositDate()
      this.getReceiptList()
    },
    // 点击创建收款单按钮事件
    createOrder () {
      this.receipForm.resetFields()
      this.showTitle = true
      this.receiptPoplur = true
      this.receivlePircUrl = ''
      this.receivleStatusFlag = 1
      this.receivleImgFlag = 1
    },
    // 创建收款单弹框提交事件
    receiptSubmit () {
      this.receipForm.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let obj = {
            orderAmount: values.createReceiptAmount,
            workOrderId: JSON.parse(sessionStorage.orderValue).id
          }
          this.$request.post('/receiptOrder/create', obj).then(res => {
            if (res.code === 0) {
              this.$message.success('创建收款单成功')
              this.getOrderStatus()
              this.getDepositDate()
              this.getReceiptList()
              this.receiptPoplur = false
            }
          })
        } else {
          this.showTitle = false
        }
      })
    },
    // 判断创建收款单按钮，是否置灰
    createOrderPower () {
      let aFlag = false
      this.depositData.forEach(item => {
        if (item.receivableCode == 'First' || item.receivableCode == 'Second') {
          aFlag = true
        }
      })
      if (aFlag == false) {
        return true
      } else {
        if (this.orderStatis == '0' || this.orderStatis == '211' || this.orderStatis == '510' || this.orderStatis == '513' || this.orderStatis == '521') {
          return true
        } else {
          let hasOrderStatus = false
          this.orderData.forEach(item => {
            if (item.status == 1 || item.status == 2) {
              hasOrderStatus = true
            }
          })
          if (hasOrderStatus) {
            return true
          } else {
            return false
          }
        }
      }
    },
    // 收款单列表里面点击收款按钮事件
    receivablesFn(adata) {
      this.receivablePoplur = true
      this.receivableData = adata
      // 保存当前点击收款时候的收款单id
      this.saveReceivId = adata.id
      if (adata.paymentType == 'under_line' && adata.status == 2 ) {
        this.undentLineFlag = true
        this.receivableName = '线下支付审核中'
      } else if (adata.paymentType == 'under_line' && adata.status == 3) {
        this.undentLineFlag = true
        this.receivableName = '线下支付成功'
      } else {
        this.undentLineFlag = false
        this.receivableName = '确认线下支付'
      }
      if (adata.status == 2) {
        this.paymentFlagOne = true
        this.paymentFlagTwo = true
        this.paymentFlagThree = true
      } else {
        this.paymentFlagOne = false
        this.paymentFlagTwo = false
        this.paymentFlagThree = false
      }
      // 审批模板选择下拉框的列表数据
      this.approvalFn()
    },
    // 收款单列表里面点击删除按钮事件
    receivaDeleteFn (adata) {
      this.$confirm({
        title: '确认删除此收款单',
        content: '确认删除此收款单，点击确认删除',
        okText: '确认',
        centered: true,
        cancelText: '取消',
        onOk: () => {
          let receiptOrderId = adata.id
          this.$request.delete(`/receiptOrder/delete/${receiptOrderId}`).then(res => {
            if (res.code === 0) {
              this.$message.success('删除收款单成功')
              this.getOrderStatus()
              this.getDepositDate()
              this.getReceiptList()
              this.createOrderPower()
            }
          })
        }
      })
    },
    // 使用POS机支付
    depositSure1 (e) {
      e.preventDefault()
      this.depositImgFlag = 2
      let obj = {
        paymentType: this.moneyProject.paymentType,
        receivableId: this.moneyProject.id
      }
      this.posIsLoadingFlag = true
      if (this.moneyProject.receivableCode === 'Earnest') {
        obj.earnestAmount = this.moneyProject.totalAmount
        this.$request.post('/receivable/earnest/receipt', obj).then(res => {
          if (res.code === 0) {
            this.depositImgFlag = 3
            this.depositStatusFlag = 2
            this.depositPircUrl = res.result
          }
          this.posIsLoadingFlag = false
        })
      } else {
        this.$request.post('/receivable/receipt', obj).then(res => {
          if (res.code === 0) {
            this.depositImgFlag = 3
            this.depositStatusFlag = 2
            this.depositPircUrl = res.result
          }
          this.posIsLoadingFlag = false
        })
      }
    },
    // 使用微信付款方式
    depositSure2 (e) {
      e.preventDefault()
      let obj = {
        paymentType: this.moneyProject.paymentType,
        receivableId: this.moneyProject.id
      }
      if (this.moneyProject.receivableCode === 'Earnest') {
        obj.earnestAmount = this.moneyProject.totalAmount
        this.$request.post('/receivable/earnest/receipt', obj).then(res => {
          if (res.code === 0) {
            this.$message.success('操作成功;请通知用户在小程序付款')
            this.depositPoplur = false
            this.getOrderStatus()
            this.getDepositDate()
          }
        })
      } else {
        this.$request.post('/receivable/receipt', obj).then(res => {
          if (res.code === 0) {
            this.$message.success('操作成功;请通知用户在小程序付款')
            this.depositPoplur = false
            this.getOrderStatus()
            this.getDepositDate()
          }
        })
      }
    },
    // 使用线下支付
    depositSure3 (e) {
      e.preventDefault()
      this.formData.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.$confirm({
            title: '确认使用线下支付',
            content: '该笔资金未经过系统！确认线下已收到该笔合同款，提交后需要通知财务审核',
            okText: '确认',
            centered: true,
            cancelText: '取消',
            onOk: () => {
              let obj = {
                paymentType: this.moneyProject.paymentType,
                receivableId: this.moneyProject.id,
                processId: values.myapproval
              }
              if (this.moneyProject.receivableCode === 'Earnest') {
                obj.earnestAmount = this.moneyProject.totalAmount
                this.$request.post('/receivable/earnest/receipt', obj).then(res => {
                  if (res.code === 0) {
                    this.$message.success('操作成功!')
                    this.depositPoplur = false
                    this.getOrderStatus()
                    this.getDepositDate()
                  }
                })
              } else {
                this.$request.post('/receivable/receipt', obj).then(res => {
                  if (res.code === 0) {
                    this.$message.success('操作成功!')
                    this.depositPoplur = false
                    this.getOrderStatus()
                    this.getDepositDate()
                  }
                })
              }
            }
          })
        }
      })
    },
    // 收款弹框的支付方式
    receivableSure (num, e) {
      e.preventDefault()
      let aobj = {}
      aobj.receiptOrderId = this.saveReceivId
      if (num == 1) {
        this.receivleImgFlag = 2
        aobj.paymentType = 'hundsun_nfxpos_act'
        this.receivableFn(aobj, num)
      } else if (num == 2) {
        aobj.paymentType = 'hundsun_wechatlet'
        this.receivableFn(aobj, num)
      } else if (num == 3) {
        this.receFormData.validateFieldsAndScroll((err, values) => {
          if (!err) {
            aobj.paymentType = 'under_line'
            aobj.processId = values.receivab        
            this.$confirm({
              title: '确认使用线下支付',
              content: '该笔资金未经过系统！确认线下已收到该笔合同款，提交后需要通知财务审核',
              okText: '确认',
              centered: true,
              cancelText: '取消',
              onOk: () => {
                this.receivableFn(aobj, num)
              }
            })
          }
        })
      }
    },
    // 判断删除按钮是否可以点击
    receiveDeleteFlag (adata) {
      if (adata.status == 1) {
        return false
      } else {
        return true
      }
    },
    receivableFn(aobj, num) {
      this.isPosLoadingFlag = true
      this.$request.post('/receiptOrder/receipt', aobj).then(res => {
        if (res.code === 0) {
          if (num == 1) {
            this.receivleImgFlag = 3
            this.receivleStatusFlag = 2
            this.receivlePircUrl = res.result
          } else {
            this.$message.success('收款单创建成功')
            this.receivablePoplur = false
            this.getOrderStatus()
            this.getDepositDate()
            this.getReceiptList()
          }
        }
        this.isPosLoadingFlag = false
      })
    },
    // 收款单列表里面点击付款按钮事件
    payMoneyFn(record) {
      this.savePayOrderId = record.id      // 暂时先注释，暂时不得删除这两行，暂时提示付款按钮功能未开通
      this.myPaymantVisible = true         // 暂时先注释，暂时不得删除这两行，暂时提示付款按钮功能未开通
      // this.$warning({
      //   title: '付款功能暂未开通',
      //   content: '付款功能暂未开通...'
      // })
    },
    // 付款弹框点击确定事件
    myPaymentOk () {
      this.myPaymentForm.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let obj = {
            accountName: values.accountName,
            accountNumber: values.accountNumber,
            accountType: values.infoType,
            branchBankCode: values.bankBranch,
            idNumber: values.certificateId,
            idType: values.certificate,
            receiptOrderId: this.savePayOrderId
          }
          this.$request.post('/receiptOrder/payment', obj).then(res => {
            if (res.code === 0) {
              this.$message.success('付款成功')
              this.myPaymantVisible = false
              this.getOrderStatus()
              this.getDepositDate()
              this.getReceiptList()
            }
          })
        }
      })
    },
    myPaymentCancel () {
      this.myPaymantVisible = false
    },
    receAmountNumChange(ev) {
      let aText = /^(\d|([1-9]\d+))(\.\d{1,2})?$/
      if (ev == '' || !aText.test(ev)) {
        this.showTitle = false
      }
    }
  }
}
