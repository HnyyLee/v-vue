export var materialOne = {
  created: function () {
  },
  methods: {
    // 添加工艺SKU按钮事件
    alteratAddFn() {
      this.$refs.technoCommonPoplurOne.clearThink()
      this.showPopuleFnOne()
      // 获取弹框顶部筛选条件下拉框数据
      let adata = { }
      this.$request.post('/sku/queryItemCateList', adata).then(response => {
        if (response.code == 0) {
          if (response.result.list) {
            let sArr = []
            response.result.list.forEach(icon => {
              let asobj = {}
              asobj.value = icon.name
              asobj.tabel = icon.name
              sArr.push(asobj)
            })
            this.materialSearchDataOne.optionData.data = sArr
          } else {
            this.materialSearchDataOne.optionData.data = []
          }
        }
      })
    },
    // 弹框中列表数据接口
    showPopuleFnOne (category, name) {
      let adata = {
        pageSize: 10000,
        craftType: 1,
        status: 1,
        workOrderId: JSON.parse(sessionStorage.getItem('orderValue')).id
      }
      if (category) adata.category = category
      if (name) adata.name = name
      this.$request.post('/sku/queryItemList', adata).then(response => {
        if (response.code == 0) {
          this.$refs.technoCommonPoplurOne.visible = true
          if (response.result.list) {
            this.technoPoplurListOne = response.result.list
            this.technoPoplurListOne.forEach((item, index) => {
              item.key = item.id
              if (item.discountPrice !== null) {
                item.mydisprice = item.discountPrice
              } else {
                item.mydisprice = item.price
              }
              item.itemNum = 1
              item.amount = Number(item.itemNum) * Number(item.price)
            })
            // 选择当前table已经存在的数据上去弹框中
            this.cannalThinkOne()
          } else {
            this.technoPoplurListOne = []
          }
        }
      })
    },
    // 弹框提交事件
    technoSubmitReplaceOne(adata) {
      this.$refs.technoCommonPoplurOne.visible = false
      this.technoDataListOne = adata
      this.spliceRangAllMountOne()
      this.showHoldLastTable = false
    },
    // 重新计算allorMount总的值
    spliceRangAllMountOne () {
      this.allAddMountOne = 0
      this.technoDataListOne.forEach(item => {
        item.introduce = item.note
        item.craftId = item.key
        item.amount = (Number(item.itemNum) * Number(item.price)).toFixed(2)
        this.allAddMountOne = (Number(this.allAddMountOne) + Number(item.amount)).toFixed(2)
      })
    },
    // 弹框取消事件
    cannalThinkOne() {
      this.$refs.technoCommonPoplurOne.selectedRowKeys = []
      if (this.technoDataListOne.length !== 0) {
        this.technoDataListOne.forEach(item => {
          this.$refs.technoCommonPoplurOne.selectedRowKeys.push(item.key)
        })
      }
      this.$refs.technoCommonPoplurOne.chooseHoldData = this.technoDataListOne
    },
    // 弹框搜索事件
    topSearchThinkOne(data) {
      this.showPopuleFnOne(data.myCategory, data.searchName)
    },
    // 表格数量框change事件
    itemNumChangeOne(adata, ev, aobj) {
      let value = ev.target.value
      let asaveNum = ''
      if (String(value).split('.')[1]) {
        asaveNum = String(value).split('.')[0] + '.' + String(value).split('.')[1].substring(0, 2)
      } else {
        if (ev.data == '.') {
          asaveNum = value + '.'
        } else {
          asaveNum = value
        }
      }
      if (asaveNum.indexOf('.') !== -1 && String(value).split('.')[1] == undefined) {
        asaveNum = value
      }
      if (asaveNum < 0) {
        this.$message.info('当前数量不可录入负数')
        return
      }
      let myValue = asaveNum
      this.allAddMountOne = 0
      this.technoDataListOne.forEach(icen => {
        if (icen.id == adata) {
          icen.itemNum = myValue
          icen.amount = Number(myValue) * Number(icen.price)
          icen.amount = Number(icen.amount).toFixed(2)
        }
        this.allAddMountOne = Number(Number(this.allAddMountOne) + Number(icen.amount)).toFixed(2)
      })
      this.showHoldLastTable = false
    },
    // 空间输入事件
    spaceChangeOne(adata, ev, aobj) {
      this.technoDataListOne.forEach(icen => {
        if (icen.id == adata) {
          icen.spaceDes = ev.target.value
        }
      })
      this.$forceUpdate()
    },
  }
}
