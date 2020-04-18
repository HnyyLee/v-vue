export var packageListFive = {
  created: function () {
  },
  methods: {
    // 第五步点击添加其他按钮
    addScienceFour () {
      this.$refs.commonPoplurFour.clearThink()
      this.showPopuleFourFn()
      // 获取弹框顶部筛选条件下拉框数据,(现在改为只有一个数据:其它)
      let sArr = [
        { value: '其它', tabel: '其它' }
      ]
      this.searchDataFour.optionData.data = sArr
      // let adata = { }
      // this.$request.post('/sku/queryCraftCateList', adata).then(response => {
      //   if (response.code == 0) {
      //     if (response.result.list) {
      //       let sArr = []
      //       response.result.list.forEach(icon => {
      //         let asobj = {}
      //         asobj.value = icon.name
      //         asobj.tabel = icon.name
      //         sArr.push(asobj)
      //       })
      //       this.searchDataFour.optionData.data = sArr
      //     } else {
      //       this.searchDataFour.optionData.data = []
      //     }
      //   }
      // })
    },
    // 第五步弹框中列表数据接口
    showPopuleFourFn (category, name) {
      let adata = {
        pageSize: 10000,
        craftType: 2,
        status: 1
      }
      if (category) adata.category = category
      if (name) adata.name = name
      this.$request.post('/sku/queryCraftList', adata).then(response => {
        if (response.code == 0) {
          this.$refs.commonPoplurFour.visible = true
          if (response.result.list) {
            this.dialogDataFour = response.result.list
            this.dialogDataFour.forEach(item => {
              item.key = item.id
              item.action = '删除'
              item.itemNum = 1
              item.amount = (Number(item.itemNum) * Number(item.price)).toFixed(2)
            })
          } else {
            this.dialogDataFour = []
          }
        }
      })
    },
    // 第五部弹框中点击搜索事件
    topSearchThinkFour (data) {
      this.showPopuleFourFn(data.myCategory, data.searchName)
    },
    // 第五步添加工艺弹框提交事件
    materialReplaceFour (data) {
      this.$refs.commonPoplurFour.visible = false
      this.doubleDateFour = data
      this.spliceRangAllMountFour()
    },
    // 第五步弹框取消掉事件
    cannalThinkFour (data) {
      this.$refs.commonTableFour.selectedRowKeys = []
      if (this.doubleDateFour.length !== 0) {
        this.doubleDateFour.forEach(item => {
          this.$refs.commonTableFour.selectedRowKeys.push(item.key)
        })
      }
      this.$refs.commonTableFour.chooseHoldData = this.doubleDateFour
      // this.doubleDateFour = data
      // this.spliceRangAllMountFour()
    },
    // 第五步重新计算allorMount总的值，和循环拿产品系列遍历的事件
    spliceRangAllMountFour () {
      this.$refs.commonTableFour.allorMount = 0
      this.doubleDateFour.forEach(item => {
        item.craftId = item.key
        item.amount = (Number(item.itemNum) * Number(item.price)).toFixed(2)
        this.$refs.commonTableFour.allorMount = (Number(this.$refs.commonTableFour.allorMount) + Number(item.amount)).toFixed(2)
      })
    },
    // 第五步表格数量输入框输入事件
    numItemChangeFour (adata, value, lastnum, ev) {
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
      let myValue = asaveNum
      // let myValue = Number(String(value).replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3'))
      const newData = [...this.doubleDateFour]
      const target = newData.filter(item => adata === item.key)[0]
      if (target) {
        target.itemNum = myValue
        this.doubleDateFour = newData
      }

      this.$refs.commonTableFour.allorMount = 0
      this.doubleDateFour.forEach(icen => {
        if (icen.id == adata) {
          icen.itemNum = myValue
          icen.amount = (Number(myValue) * Number(icen.price)).toFixed(2)
          icen.amount = Number(icen.amount).toFixed(2)
        }
        this.$refs.commonTableFour.allorMount = (Number(this.$refs.commonTableFour.allorMount) + Number(icen.amount)).toFixed(2)
      })
    },
    // 第五步表格点击list删除按钮事件
    upgradeFour (data) {
      let that = this
      this.$confirm({
        title: '是否确定删除？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          that.doubleDateFour = that.doubleDateFour.filter(item => {
            return item.id !== data.id
          })
          that.$refs.commonPoplurFour.selectedRowKeys = []
          that.$refs.commonPoplurFour.chooseHoldData = that.doubleDateFour
          that.$refs.commonTableFour.allorMount = 0
          that.doubleDateFour.forEach(iren => {
            that.$refs.commonPoplurFour.selectedRowKeys.push(iren.id)
            that.$refs.commonTableFour.allorMount = (Number(that.$refs.commonTableFour.allorMount) + Number(iren.amount)).toFixed(2)
          })
        }
      })
    },
    // 第五步表格上方点击批量删除事件
    deleteThinkFour (adata, keyword) {
      if (adata.length == this.doubleDateFour.length) {
        this.$message.info('请选择要删除的数据!')
      } else {
        let that = this
        this.$confirm({
          title: '是否确定删除？',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk () {
            that.doubleDateFour = adata
            that.$refs.commonPoplurFour.chooseHoldData = adata
            that.$refs.commonPoplurFour.selectedRowKeys = []
            that.$refs.commonTableFour.allorMount = 0
            that.doubleDateFour.forEach(iren => {
              that.$refs.commonPoplurFour.selectedRowKeys.push(iren.id)
              that.$refs.commonTableFour.allorMount = (Number(that.$refs.commonTableFour.allorMount) + Number(iren.amount)).toFixed(2)
            })
          }
        })
      }
    }
  }
}
