export var repertoireListThree = {
  created: function () {
  },
  methods: {
    // 第三步调整项表格点击删除调整项按钮事件
    deleteThinkLastTwo (row, keycode) {
      if (keycode.length == 0) {
        this.$message.info('请选择要删除的调整项')
      } else {
        this.addTabNumber = row.length
        this.doubleDateLastTwo = row
        this.doubleDateLastTwo.forEach((irow, index) => {
          irow.key = index
          irow.codeName = `调整项${index + 1}`
        })
        this.$refs.commonTableLastTwo.selectedRowKeys = []
        this.LastTabChagneFlag = false
      }
    },
    // 第三步调整项点击添加调整项按钮事件
    addScienceLastTwo () {
      let obj = {
        key: this.addTabNumber,
        codeName: `调整项${Number(this.addTabNumber) + 1}`,
        name: '',
        discounts: '',
        Nametext: '请输入调整项名称',
        discountText: '请输入金额'
      }
      this.addTabNumber = Number(this.addTabNumber) + 1
      this.doubleDateLastTwo.push(obj)
      this.LastTabChagneFlag = false
    },
    // 第三步调整项点击提交事件
    lastTabSubmit () {
      let asArr = []
      this.doubleDateLastTwo.forEach(item => {
        let asObj = {}
        asObj.name = item.name
        asObj.discounts = item.discounts
        asArr.push(asObj)
      })
      let adata = {
        id: this.saveFirstSuccessId,
        quoteAdjustVoList: asArr
      }
      let isKong = false
      asArr.forEach(ias => {
        if (ias.discounts == '' || ias.name == '') {
          isKong = true
        }
      })
      if (isKong == false) {
        this.$request.post('/quote/updateQuoteAdjusts', adata).then(response => {
          if (response.code == 0) {
            this.$message.success('提交成功')
            this.LastTabChagneFlag = true
            let that = this
            this.spinning = true
            setTimeout(function () {
              that.lastPageShowData()
            }, 1000)
          }
        })
      } else {
        this.$message.info('请完整的输入项目名称和金额！')
      }
    },
    // 第三步刚展示页面时候获取第一个表格数据（项目费用）的数据
    lastPageShowData () {
      var adata = {
        quoteId: this.saveFirstSuccessId
      }
      this.$request.post('/quote/calculateQuote', adata).then(response => {
        if (response.code == 0) {
          this.spinning = false
          this.doubleDateLastOne[0].amount = response.result.directFee
          this.doubleDateLastOne[1].amount = response.result.manageFee
          this.doubleDateLastOne[2].amount = response.result.rateFee
          this.orderAmount = response.result.totalFee
        }
      })
    },
    // 第三步改变了input
    projectNameChange () {
      this.LastTabChagneFlag = false
    },
    discountsChange () {
      this.LastTabChagneFlag = false
    },
    // 获取第三步说明里面的动态公式
    getQueryItemFn () {
      let adata = {
        id: this.saveTaocanId
      }
      this.$request.post('/product/queryProductById', adata).then(response => {
        if (response.code == 0) {
          let aString = response.result.productCalculationVo
          if (aString) {
            // 直接工程费(A)、管理费(B)、税费(C)、调整项(D)、总价(E)
            if (aString.manageDescription) {
              this.doubleDateLastOne[1].remark = aString.manageDescription
            } else {
              this.doubleDateLastOne[1].remark = aString.manageFormula
              this.doubleDateLastOne[1].remark = this.doubleDateLastOne[1].remark.replace(/A/g, '直接工程费')
              this.doubleDateLastOne[1].remark = this.doubleDateLastOne[1].remark.replace(/B/g, '管理费')
              this.doubleDateLastOne[1].remark = this.doubleDateLastOne[1].remark.replace(/C/g, '税费')
              this.doubleDateLastOne[1].remark = this.doubleDateLastOne[1].remark.replace(/D/g, '调整项')
              this.doubleDateLastOne[1].remark = this.doubleDateLastOne[1].remark.replace(/E/g, '总价')
            }
            if (aString.rateDescription) {
              this.doubleDateLastOne[2].remark = aString.rateDescription
            } else {
              this.doubleDateLastOne[2].remark = aString.rateFormula
              this.doubleDateLastOne[2].remark = this.doubleDateLastOne[2].remark.replace(/A/g, '直接工程费')
              this.doubleDateLastOne[2].remark = this.doubleDateLastOne[2].remark.replace(/B/g, '管理费')
              this.doubleDateLastOne[2].remark = this.doubleDateLastOne[2].remark.replace(/C/g, '税费')
              this.doubleDateLastOne[2].remark = this.doubleDateLastOne[2].remark.replace(/D/g, '调整项')
              this.doubleDateLastOne[2].remark = this.doubleDateLastOne[2].remark.replace(/E/g, '总价')
            }
            if (aString.totalDescription) {
              this.myOrderVolose = aString.totalDescription
            } else {
              this.myOrderVolose = aString.totalFormula
              this.myOrderVolose = this.myOrderVolose.replace(/A/g, '直接工程费')
              this.myOrderVolose = this.myOrderVolose.replace(/B/g, '管理费')
              this.myOrderVolose = this.myOrderVolose.replace(/C/g, '税费')
              this.myOrderVolose = this.myOrderVolose.replace(/D/g, '调整项')
              this.myOrderVolose = this.myOrderVolose.replace(/E/g, '总价')
            }
          }
        }
      })
    },
  }
}
