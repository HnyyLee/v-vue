export var packageListSix = {
  created: function () {
  },
  methods: {
    // 获取第六步第一个表格说明里面的动态公式
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
              this.doubleDateFive[1].remark = aString.manageDescription
            } else {
              this.doubleDateFive[1].remark = aString.manageFormula
              this.doubleDateFive[1].remark = this.doubleDateFive[1].remark.replace(/A/g, '直接工程费')
              this.doubleDateFive[1].remark = this.doubleDateFive[1].remark.replace(/B/g, '管理费')
              this.doubleDateFive[1].remark = this.doubleDateFive[1].remark.replace(/C/g, '税费')
              this.doubleDateFive[1].remark = this.doubleDateFive[1].remark.replace(/D/g, '调整项')
              this.doubleDateFive[1].remark = this.doubleDateFive[1].remark.replace(/E/g, '总价')
            }
            if (aString.rateDescription) {
              this.doubleDateFive[2].remark = aString.rateDescription
            } else {
              this.doubleDateFive[2].remark = aString.rateFormula
              this.doubleDateFive[2].remark = this.doubleDateFive[2].remark.replace(/A/g, '直接工程费')
              this.doubleDateFive[2].remark = this.doubleDateFive[2].remark.replace(/B/g, '管理费')
              this.doubleDateFive[2].remark = this.doubleDateFive[2].remark.replace(/C/g, '税费')
              this.doubleDateFive[2].remark = this.doubleDateFive[2].remark.replace(/D/g, '调整项')
              this.doubleDateFive[2].remark = this.doubleDateFive[2].remark.replace(/E/g, '总价')
            }
            if (aString.totalDescription) {
              this.orderTotalFormula = aString.totalDescription
            } else {
              this.orderTotalFormula = aString.totalFormula
              this.orderTotalFormula = this.orderTotalFormula.replace(/A/g, '直接工程费')
              this.orderTotalFormula = this.orderTotalFormula.replace(/B/g, '管理费')
              this.orderTotalFormula = this.orderTotalFormula.replace(/C/g, '税费')
              this.orderTotalFormula = this.orderTotalFormula.replace(/D/g, '调整项')
              this.orderTotalFormula = this.orderTotalFormula.replace(/E/g, '总价')
            }
          }
        }
      })
    },
    // 第六步折减价编辑的时候获取表格数据
    getDiscountsDataFn() {
      var adata = {
        quoteId: this.saveFirstSuccessId
      }
      this.$request.post('/quote/queryQuoteDiscountsById', adata).then(response => {
        if (response.code == 0) {
          this.doubleDateSeven = []
          if (response.result.list) {
            this.doubleDateSeven = response.result.list
            this.doubleDateSeven.forEach((item, index) => {
              item.key = index
              item.code = Number(index) + 1
              item.itemNum = item.num
              item.item_id = item.itemId
              item.Aoument = -Number(item.itemNum) * Number(item.price)
            })
          }
        }
      })
    },
    // 第六步刚展示页面时候获取第一个表格数据（项目费用）的数据
    lastPageShowData () {
      var adata = {
        quoteId: this.saveFirstSuccessId
      }
      this.$request.post('/quote/calculateQuote', adata).then(response => {
        if (response.code == 0) {
          this.spinning = false
          this.doubleDateFive[0].amount = response.result.directFee
          this.doubleDateFive[1].amount = response.result.manageFee
          this.doubleDateFive[2].amount = response.result.rateFee
          this.orderAmount = response.result.totalFee
        }
      })
    },
    // 第六步调整项表格点击删除调整项按钮事件
    deleteThinkSix (row, keycode) {
      if (keycode.length == 0) {
        this.$message.info('请选择要删除的调整项')
      } else {
        let that = this
        this.$confirm({
          title: '是否确定删除？',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk () {
            that.addTabNumber = row.length
            that.doubleDateSix = row
            that.doubleDateSix.forEach((irow, index) => {
              irow.key = index
              irow.codeName = `调整项${index + 1}`
            })
            that.$refs.commonTableSix.selectedRowKeys = []
            that.LastTabChagneFlag = false
            that.lastTabSubmit()
          }
        })
      }
    },
    // 第六步调整项点击添加调整项按钮事件
    addScienceSix () {
      let obj = {
        key: this.addTabNumber,
        codeName: `调整项${Number(this.addTabNumber) + 1}`,
        name: '',
        discounts: '',
        Nametext: '请输入调整项名称',
        discountText: '请输入金额'
      }
      this.addTabNumber = Number(this.addTabNumber) + 1
      this.doubleDateSix.push(obj)
      this.LastTabChagneFlag = false
    },
    // 第六步调整项目改变了input
    projectSixChange () {
      this.LastTabChagneFlag = false
    },
    discountsSixChange () {
      this.LastTabChagneFlag = false
    },
    // 第六步调整项点击提交事件
    lastTabSubmit () {
      if (this.LastTabChagneFlag == false && this.reductionFlag == true) {
        this.zengjianxiangFn()
      } else if (this.LastTabChagneFlag == true && this.reductionFlag == false) {
        this.zhejianxiangFn()
      } else if (this.LastTabChagneFlag == false && this.LastTabChagneFlag == false) {
        this.zengjianxiangFn()
        this.zhejianxiangFn()
      }
    },
    // 折减方法提交的接口调用
    zhejianxiangFn() {
      let adata = {
        id: this.saveFirstSuccessId,
        quoteDiscountVoList: []
      }
      this.doubleDateSeven.forEach(item => {
        let sobj = {}
        sobj.itemId = item.item_id
        sobj.category = item.category
        sobj.num = item.itemNum
        if (item.price) {
          sobj.price = item.price
        } else {
          sobj.price = item.item_price
        }
        adata.quoteDiscountVoList.push(sobj)
      })
      this.$request.post('/quote/updateQuoteDiscounts', adata).then(response => {
        if (response.code == 0) {
          this.$message.success('折减项提交成功')
          this.reductionFlag = true
          let that = this
          setTimeout(function () {
            that.lastPageShowData()
          }, 500)
        }
      })
    },
    // 增减项提交的接口调用
    zengjianxiangFn() {
      let asArr = []
      this.doubleDateSix.forEach(item => {
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
            this.$message.success('调整项添加成功')
            this.LastTabChagneFlag = true
            let that = this
            this.spinning = true
            setTimeout(function () {
              that.lastPageShowData()
            }, 500)
          }
        })
      } else {
        this.$message.info('请完整的输入项目名称和金额！')
      }
    },
    // 第六步添加折减表格点击删除调整项按钮事件
    deleteThinkSeven (row, keycode) {
      if (keycode.length == 0) {
        this.$message.info('请选择要删除的折减项目')
      } else {
        let that = this
        this.$confirm({
          title: '是否确定删除？',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk () {
            that.doubleDateSeven = []
            that.$refs.commonTableSeven.selectedRowKeys = []
            that.reductionFlag = false
            that.lastTabSubmit()
          }
        })
      }
    },
    // 第六步折减项目点击添加调整项按钮事件
    addScienceSeven () {
      // 获取弹框顶部筛选条件下拉框数据
      let bdata = {}
      this.$request.post('/sku/queryItemCateList', bdata).then(response => {
        if (response.code == 0) {
          if (response.result.list) {
            let sArr = []
            response.result.list.forEach(icon => {
              let asobj = {}
              asobj.value = icon.name
              asobj.tabel = icon.name
              sArr.push(asobj)
            })
            this.searchDataSeven.optionData.data = sArr
          } else {
            this.searchDataSeven.optionData.data = []
          }
        }
      })
      this.getPoplurDataFn()
    },
    getPoplurDataFn(myCategory, searchName) {
      let sdata = {
        quoteId: this.saveFirstSuccessId,
        pageSize: 1000000
      }
      if (myCategory) sdata.category = myCategory
      if (searchName) sdata.name = searchName
      this.$request.post('/quote/queryQuoteDiscountItems', sdata).then(response => {
        if (response.code == 0) {
          this.$refs.commonPoplurSeven.visible = true
          this.$refs.commonPoplurSeven.chooseHoldData = []
          this.$refs.commonPoplurSeven.selectedRowKeys = []
          if (response.result.list) {
            this.dialogDataSeven = response.result.list
            this.dialogDataSeven.forEach((item, index) => {
              item.key = index
              item.num = Number(index) + 1
              item.price = item.price !== null ? item.price : item.item_price
            })
          } else {
            this.dialogDataSeven = []
          }
        }
      })
    },
    // 第六步添加折减弹框中，点击提交事件
    materialReplaceSeven(adata) {
      if (adata.length == 0) {
        this.$message.info('请选择一条数据')
        return
      }
      this.doubleDateSeven = adata
      this.doubleDateSeven.forEach((item,index) => {
        item.code = Number(index) + 1
        item.itemNum = 0
        item.Aoument = 0
      })
      this.reductionFlag = false
      this.$refs.commonPoplurSeven.visible = false
      this.$refs.commonPoplurSeven.selectedRowKeys = []
      this.$refs.commonPoplurSeven.chooseHoldData = []
    },
    // 第六步折减项弹框取消事件
    cannalThinkSeven() {
      this.$refs.commonPoplurSeven.selectedRowKeys = []
      this.$refs.commonPoplurSeven.chooseHoldData = []
    },
    // 第六步折减项输入框改变事件
    numItemChangeSeven(adata, value, aobj) {
      this.reductionFlag = false
      this.doubleDateSeven.forEach(item => {
        if (item.code == aobj.code) {
          item.itemNum = value
          if (item.price) {
            item.Aoument = Number(value) * Number(item.price)
            item.Aoument = -Number(item.Aoument).toFixed(2)
          } else {
            item.Aoument = Number(value) * Number(item.item_price)
            item.Aoument = -Number(item.Aoument).toFixed(2)
          }
        }
        this.$refs.commonTableSeven.setShowData = value
      })
    },
    // 折减弹框顶部点击搜索事件
    topSearchThinkSeven(adata) {
      this.getPoplurDataFn(adata.myCategory, adata.searchName)
    }
  }
}
