
export var mainmaterialsMixin = {
  data () {
    var pandDom = []
    pandDom = [
      { key: 1, title: 'Tab 1', contentData: [], dialogData: [], closable: false, tableRefDom: 'tableCommonTwo1', dialogRefDom: 'poplurCommonTwo1', saveUpgradArray: [] },
      { key: 2, title: 'Tab 2', contentData: [], dialogData: [], closable: false, tableRefDom: 'tableCommonTwo2', dialogRefDom: 'poplurCommonTwo2', saveUpgradArray: [] }
    ]
    return {
      pandDom, // 一整个大数组
      saveTwoNowTabId: '', // 记录下当前tab切换栏的id(当前tab的id)
      saveNowTabId: '', // 点击表格添加主材时候记录下当前tab切换栏的id(当前tab的id)
    }
  },
  created: function () {
    
  },
  computed: {
    
  },
  methods: {
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.chooseListData = selectedRows
    },
    // 获取施工范围tab数据
    showTabListFn() {
      let sdata = {
        workOrderId: JSON.parse(sessionStorage.orderValue).id
      }
      this.$request.post('/quote/queryQuoteRangeById', sdata).then(response => {
        if (response.code == 0) {
          this.pandDom = []
          response.result.forEach(item => {
            let aobj = {}
            aobj.title = item.rangeName
            aobj.id = item.id
            aobj.quoteId = item.quoteId
            this.pandDom.push(aobj)
          })
          this.pandDom.forEach(rang => {
            rang.key = rang.id
            rang.closable = false
            rang.tableRefDom = `tableCommon${rang.id}`
            rang.contentData = []
            rang.dialogRefDom = `poplurCommonTwo${rang.id}`
            rang.dialogData = []
          })
          // 获取页面信息接口
          this.showListFn()
          this.saveNowTabId = this.pandDom[0].id
        }
      })
    },
    // 切换面板的回调
    tabChange (adata) {
      this.saveTwoNowTabId = adata
      this.saveNowTabId = adata
    },
    // 如果返回的skuChooseItemVoList为空数组的话则调用此接口
    queryQuoteItemsFn() {
      let sdata = {
        workOrderId: JSON.parse(sessionStorage.orderValue).id,
        pageSize: 10000,
        pageNum: 1
      }
      this.$request.post('/quote/queryQuoteItems', sdata).then(res => {
        if (res.code == 0) {
          this.pandDom.forEach(item => {
            let arr = res.result.list.filter(fil => {
              return fil.rangeId == item.id
            })
            item.contentData = arr.map(o => Object.assign({}, o))
          })
          this.pandDom.forEach(pad => {
            pad.contentData.forEach((item,index) => {
              item.key = item.itemId
              item.serial = item.itemId
              item.planNum = 0
              item.reviewNum = 0
              item.orderNum = 0
              if (!item.remark) item.remark = ''
            })
          })
          this.$forceUpdate()
        }
      })
    },
    // 点击添加主材事件
    addScience (sendData) {
      this.saveNowTabId = sendData.key
      this.$refs[sendData.dialogRefDom][0].clearThink()
      this.showPopuleTwoFn('', '', sendData)
      // 获取弹框顶部筛选条件下拉框数据
      let sdata = {}
      this.$request.post('/sku/queryItemCateList', sdata).then(response => {
        if (response.code == 0) {
          if (response.result.list) {
            let sArr = []
            response.result.list.forEach(icon => {
              let asobj = {}
              asobj.value = icon.name
              asobj.tabel = icon.name
              sArr.push(asobj)
            })
            this.mainSearchData.optionData.data = sArr
          } else {
            this.mainSearchData.optionData.data = []
          }
        }
      })
    },
    // 弹框中列表数据接口
    showPopuleTwoFn (category, name, sendData) {
      let adata = {
        pageSize: 10000,
        status: 1
      }
      if (category) adata.category = category
      if (name) adata.name = name
      this.$request.post('/sku/queryItemList', adata).then(response => {
        if (response.code == 0) {
          this.$refs[sendData.dialogRefDom][0].visible = true
          if (response.result.list) {
            let saveAItemId = []
            let saveAItemObj = []
            this.pandDom.forEach(pand => {
              if (pand.key == this.saveNowTabId) {
                pand.dialogData = response.result.list
                pand.dialogData.forEach(item => {
                  item.key = item.id
                  item.itemId = item.id
                  item.planNum = 0
                  item.reviewNum = 0
                  item.orderNum = 0
                  item.itemNum = 1
                  item.amount = Number(item.itemNum) * Number(item.price)
                })

                if (pand.contentData.length !== 0) {
                  pand.contentData.forEach(icon => {
                    saveAItemId.push(icon.itemId)
                    saveAItemObj.push(icon)
                  })
                }
              }
            })
            this.$refs[sendData.dialogRefDom][0].selectedRowKeys = saveAItemId
            this.$refs[sendData.dialogRefDom][0].chooseHoldData = saveAItemObj
          } else {
            this.pandDom.forEach(pand => {
              if (pand.key == this.saveNowTabId) {
                pand.dialogData = []
              }
            })
          }
          this.$forceUpdate()
        }
      })
    },
    // 点击弹框的提交事件
    materialReplaceTwo (adata, sendData) {
      this.$refs[adata.dialogRefDom][0].visible = false
      this.pandDom.forEach(item => {
        if (item.key == this.saveNowTabId) {
          item.contentData = sendData
          item.contentData.forEach(icon => {
            icon.serial = icon.itemId
            icon.rangeName = item.title
          })
        }
      })
      this.$refs[adata.tableRefDom][0].selectedRowKeys = []
      this.$refs[adata.tableRefDom][0].chooseListData = []
      this.$forceUpdate()
    },
    // 弹框中点击搜索事件
    topSearchThinkTwo (data, sendData) {
      this.showPopuleTwoFn(sendData.myCategory, sendData.searchName, data)
    },
    // 弹框取消掉事件
    cannalThinkTwo (adata, sendData) {
      this.$refs[adata.dialogRefDom][0].selectedRowKeys = []
      this.pandDom.forEach(item => {
        if (item.key == this.saveNowTabId) {
          if (item.contentData.length !== 0) {
            item.contentData.forEach(cont => {
              this.$refs[adata.dialogRefDom][0].selectedRowKeys.push(cont.key)
            })
          }
          this.$refs[adata.dialogRefDom][0].chooseHoldData = item.contentData
        }
      })
    },
    remarkChange() {
      this.$forceUpdate()
    },
    // 表格上方点击批量删除事件
    deleteThink (adata, evData) {
      let that = this
      this.pandDom.forEach(pand => {
        if (pand.key == this.saveNowTabId) {
          if (evData.length == pand.contentData.length) {
            that.$message.info('请选择要删除的数据!')
          } else {
            this.$confirm({
              title: '是否确定删除？',
              okText: '确定',
              okType: 'danger',
              cancelText: '取消',
              onOk () {
                pand.contentData = evData
                that.$refs[pand.dialogRefDom][0].chooseHoldData = evData
                that.$refs[pand.dialogRefDom][0].selectedRowKeys = []
                pand.contentData.forEach(iren => {
                  that.$refs[pand.dialogRefDom][0].selectedRowKeys.push(iren.id)
                })
                that.$forceUpdate()
              }
            })
          }
        }
      })
    },
    // 点击下方的保存按钮
    lastTabSubmit() {
      for (const i in this.editInfoFlag) {
        if (this.editInfoFlag[i]) {
          this.$message.info('表单尚有未确认的修改，请完成修改之后在确定保存')
          return
        }
      }
      if (this.holdData.contractNumber == '') {
        this.$message.info('请输入合同号')
        return
      }
      if (this.holdData.purchaseNumber == '') {
        this.$message.info('请选择材料选购日期')
        return
      }
      if (this.holdData.stairsValue == '') {
        this.$message.info('请选择楼梯房/电梯房')
        return
      }
      this.formData.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let sdata = {
            contractNumber: this.holdData.contractNumber,
            skuChooseTime: this.holdData.purchaseNumber,
            address: this.holdData.addressNumber,
            customerName: this.holdData.customerNumber,
            customerPhone: this.holdData.phoneNumber,
            skuMerchandiserName: this.holdData.merchandiserNumber,
            skuMerchandiserPhone: this.holdData.MerchanphoneNumber,
            designerName: this.holdData.designerNumber,
            designerPhone: this.holdData.designphoneNumber,
            housekeeperName: this.holdData.housekeeperNumber,
            housekeeperPhone: this.holdData.housephoneNumber,
            isElevator: this.holdData.stairsValue,
            planStartConstructionTime: this.holdData.CommonStartNumber,
            planEndConstructionTime: this.holdData.CommonEndNumber,
            workOrderNumber: JSON.parse(sessionStorage.orderValue).code,
            progress: 1,
            skuChooseItemVoList: []
          }
          console.log('888', this.pandDom)
          if (this.saveHaveId) sdata.id = this.saveHaveId
          this.pandDom.forEach(pand => {
            pand.contentData.forEach(cont => {
              let sobj = {}
              sobj.id = cont.id
              sobj.rangeId = pand.key
              sobj.spaceId = cont.spaceId || null
              sobj.itemId = cont.itemId
              sobj.itemPrice = cont.itemPrice || cont.price
              sobj.remark = cont.remark || ''
              sobj.planNum = cont.planNum
              sobj.reviewNum = cont.reviewNum
              sobj.orderNum = cont.orderNum
              sdata.skuChooseItemVoList.push(sobj)
            })
          })
          this.$request.post('/choose/updateSkuChoose', sdata).then(response => {
            if (response.code == 0) {
              this.$message.success('保存成功')
              // 获取页面信息接口
              this.showListFn()
            }
          })
          
        }
      })
    }
  }
}
