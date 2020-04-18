export var repertoireListOne = {
  created: function () {
    this.decoratTypeSelect(1)
  },
  methods: {
    // 第一步里面装修类型下拉框选择选择事件
    decoratTypeSelect (edata) {
      this.saveDecorType = edata
      this.decoratLastOne = false
      this.stepOneData.meal.option = []
      this.decorSelectNum = 1
      this.decoratTypeFn()
    },
    // 第一步里面装修类型下拉框选择改变事件
    decorTypeChange () {
      this.form.resetFields(['meal'])
      this.stepOneData.meal.column[1].initialValue = undefined
    },
    // 第一步使用套餐下拉框改变事件
    taocanSelectChange (edata, ev) {
      this.saveTaocanId = edata
    },
    // 第一步选择使用套餐里面下拉框滚动事件
    mealPopScrollThink (ev) {
      if (ev.target.scrollHeight - ev.target.scrollTop - ev.target.clientHeight == 0) {
        if (this.decoratLastOne) return
        this.decorSelectNum += 1
        this.decoratTypeFn()
      }
    },
    // 第一步获取使用套餐下拉框数据(调用产品列表接口)
    decoratTypeFn () {
      let adata = {
        pageNum: this.decorSelectNum,
        pageSize: this.decorPageSize,
        // decorateType: this.saveDecorType,
        type: this.$route.query.offerState,
        status: 1
      }
      this.$request.post('/product/queryProductList', adata).then(response => {
        if (response.code == 0) {
          if (!response.result.list) {
            this.decoratLastOne = true
            return
          }
          this.stepOneData.meal.option = this.stepOneData.meal.option.concat(response.result.list)
        }
      })
    }
  }
}
