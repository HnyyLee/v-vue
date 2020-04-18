export var packageListFour = {
  created: function () {
  },
  methods: {
    // 第四步点击添加工艺按钮
    addScienceThree () {
      this.$refs.commonPoplurThree.clearThink()
      this.showPopuleThreeFn()
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
            this.searchDataThree.optionData.data = sArr
          } else {
            this.searchDataThree.optionData.data = []
          }
        }
      })
    },
    // 第四步弹框中列表数据接口
    showPopuleThreeFn (category, name) {
      let adata = {
        pageSize: 10000,
        craftType: 1,
        status: 1
      }
      if (category) adata.category = category
      if (name) adata.name = name
      this.$request.post('/sku/queryCraftList', adata).then(response => {
        if (response.code == 0) {
          this.$refs.commonPoplurThree.visible = true
          if (response.result.list) {
            this.dialogDataThree = response.result.list
            this.dialogDataThree.forEach(item => {
              item.key = item.id
              item.action = '删除'
              item.itemNum = 1
              item.amount = Number(item.itemNum) * Number(item.price)
            })
          } else {
            this.dialogDataThree = []
          }
        }
      })
    },
    // 第四部弹框中点击搜索事件
    topSearchThinkThree (data) {
      this.showPopuleThreeFn(data.myCategory, data.searchName)
    },
    // 第四步添加工艺弹框提交事件
    materialReplaceThree (data) {
      this.$refs.commonPoplurThree.visible = false
      this.doubleDateThree = data
      this.spliceRangAllMountThree()
    },
    // 第四步弹框取消掉事件
    cannalThinkThree (data) {
      this.$refs.commonPoplurThree.selectedRowKeys = []
      if (this.doubleDateThree.length !== 0) {
        this.doubleDateThree.forEach(item => {
          this.$refs.commonPoplurThree.selectedRowKeys.push(item.key)
        })
      }
      this.$refs.commonPoplurThree.chooseHoldData = this.doubleDateThree
      // this.doubleDateThree = data
      // this.spliceRangAllMountThree()
    },
    // 第四步重新计算allorMount总的值，和循环拿产品系列遍历的事件
    spliceRangAllMountThree () {
      console.log('dsadf', this.doubleDateThree)
      this.$refs.commonTableThree.allorMount = 0
      this.doubleDateThree.forEach(item => {
        item.craftId = item.key
        item.amount = (Number(item.itemNum) * Number(item.price)).toFixed(2)
        this.$refs.commonTableThree.allorMount = (Number(this.$refs.commonTableThree.allorMount) + Number(item.amount)).toFixed(2)
      })
    },
    // 第四步表格数量输入框输入事件
    numItemChangeThree (adata, value, lastnum, ev) {
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
      const newData = [...this.doubleDateThree]
      const target = newData.filter(item => adata === item.key)[0]
      if (target) {
        target.itemNum = myValue
        this.doubleDateThree = newData
      }
      this.$refs.commonTableThree.allorMount = 0
      this.doubleDateThree.forEach(icen => {
        if (icen.id == adata) {
          icen.itemNum = myValue
          icen.amount = Number(myValue) * Number(icen.price)
          icen.amount = Number(icen.amount).toFixed(2)
        }
        this.$refs.commonTableThree.allorMount = Number(Number(this.$refs.commonTableThree.allorMount) + Number(icen.amount)).toFixed(2)
      })
    },
    // 第四步表格点击list删除按钮事件
    upgradeThree (data) {
      let that = this
      this.$confirm({
        title: '是否确定删除？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          that.doubleDateThree = that.doubleDateThree.filter(item => {
            return item.id !== data.id
          })
          that.$refs.commonPoplurThree.selectedRowKeys = []
          that.$refs.commonPoplurThree.chooseHoldData = that.doubleDateThree
          that.$refs.commonTableThree.allorMount = 0
          that.doubleDateThree.forEach(iren => {
            that.$refs.commonPoplurThree.selectedRowKeys.push(iren.id)
            that.$refs.commonTableThree.allorMount = (Number(that.$refs.commonTableThree.allorMount) + Number(iren.amount)).toFixed(2)
          })
        }
      })
    },
    // 第四步表格上方点击批量删除事件
    deleteThinkThree (adata, keyword) {
      let that = this
      if (adata.length == that.doubleDateThree.length) {
        that.$message.info('请选择要删除的数据!')
      } else {
        this.$confirm({
          title: '是否确定删除？',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk () {
            that.doubleDateThree = adata
            that.$refs.commonPoplurThree.chooseHoldData = adata
            that.$refs.commonPoplurThree.selectedRowKeys = []
            that.$refs.commonTableThree.allorMount = 0
            that.doubleDateThree.forEach(iren => {
              that.$refs.commonPoplurThree.selectedRowKeys.push(iren.id)
              that.$refs.commonTableThree.allorMount = (Number(that.$refs.commonTableThree.allorMount) + Number(iren.amount)).toFixed(2)
            })
          }
        })
      }
    }
  }
}
