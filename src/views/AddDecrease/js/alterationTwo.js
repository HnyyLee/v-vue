export var alterationTwo = {
  created: function () {
  },
  methods: {
    // 添加工艺SKU按钮事件
    alteratRedFn() {
      this.$refs.technoCommonPoplurTwo.clearThink()
      this.showPopuleFnTwo()
      // 获取弹框顶部筛选条件下拉框数据
      let adata = { }
      this.$request.post('/sku/queryCraftCateList', adata).then(response => {
        if (response.code == 0) {
          if (response.result.list) {
            let sArr = []
            response.result.list.forEach(icon => {
              let asobj = {}
              asobj.value = icon.name
              asobj.tabel = icon.name
              sArr.push(asobj)
            })
            this.poplurSearchDataTwo.optionData.data = sArr
          } else {
            this.poplurSearchDataTwo.optionData.data = []
          }
        }
      })
    },
    // 弹框中列表数据接口
    showPopuleFnTwo (category, name) {
      let adata = {
        pageSize: 10000,
        craftType: 1,
        status: 1,
        workOrderId: JSON.parse(sessionStorage.getItem('orderValue')).id
      }
      if (category) adata.category = category
      if (name) adata.name = name
      this.$request.post('/sku/queryCraftList', adata).then(response => {
        if (response.code == 0) {
          this.$refs.technoCommonPoplurTwo.visible = true
          if (response.result.list) {
            this.technoPoplurListTwo = response.result.list
            this.technoPoplurListTwo.forEach((item, index) => {
              item.key = item.id
              item.itemNum = 1
              item.amount = Number(item.itemNum) * Number(item.price)
            })
            // 选择当前table已经存在的数据上去弹框中
            this.cannalThinkTwo()
          } else {
            this.technoPoplurListTwo = []
          }
        }
      })
    },
    // 弹框提交事件
    technoSubmitReplaceTwo(adata) {
      this.$refs.technoCommonPoplurTwo.visible = false
      this.technoDataListTwo = adata
      this.spliceRangAllMountTwo()
      this.showHoldLastTable = false
    },
    // 重新计算allorMount总的值
    spliceRangAllMountTwo () {
      this.allAddMountTwo = 0
      this.technoDataListTwo.forEach(item => {
        item.craftId = item.key
        item.amount = (Number(item.itemNum) * Number(item.price)).toFixed(2)
        this.allAddMountTwo = (Number(this.allAddMountTwo) + Number(item.amount)).toFixed(2)
      })
    },
    // 弹框取消事件
    cannalThinkTwo() {
      this.$refs.technoCommonPoplurTwo.selectedRowKeys = []
      if (this.technoDataListTwo.length !== 0) {
        this.technoDataListTwo.forEach(item => {
          this.$refs.technoCommonPoplurTwo.selectedRowKeys.push(item.key)
        })
      }
      this.$refs.technoCommonPoplurTwo.chooseHoldData = this.technoDataListTwo
    },
    // 弹框搜索事件
    topSearchThinkTwo(data) {
      this.showPopuleFnTwo(data.myCategory, data.searchName)
    },
    // 表格数量框change事件
    itemNumChangeTwo(adata, ev, aobj) {
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
      this.allAddMountTwo = 0
      this.technoDataListTwo.forEach(icen => {
        if (icen.id == adata) {
          icen.itemNum = myValue
          icen.amount = Number(myValue) * Number(icen.price)
          icen.amount = Number(icen.amount).toFixed(2)
        }
        this.allAddMountTwo = Number(Number(this.allAddMountTwo) + Number(icen.amount)).toFixed(2)
      })
      this.showHoldLastTable = false
    },
  }
}
