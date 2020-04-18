export var packageListOne = {
  created: function () {
    this.decoratTypeSelect(1)
  },
  methods: {
    // 第一步里面装修类型下拉框选择改变事件
    decorTypeChange (ev) {
      ev == 1 ? this.showNewAddRang = true : this.showNewAddRang = false
      this.form.resetFields(['meal'])
      this.stepOneData.meal.column[1].initialValue = undefined
      this.areaRangDataSource = []
      this.allMount = ''
    },
    // 第一步里面装修类型下拉框选择选择事件
    decoratTypeSelect (edata) {
      this.saveDecorType = edata
      this.decoratLastOne = false
      this.stepOneData.meal.option = []
      this.decorSelectNum = 1
      this.decoratTypeFn()
    },
    // 第一步选择使用套餐里面下拉框滚动事件
    mealPopScrollThink (ev) {
      if (ev.target.scrollHeight - ev.target.scrollTop - ev.target.clientHeight == 0) {
        if (this.decoratLastOne) return
        this.decorSelectNum += 1
        this.decoratTypeFn()
      }
    },
    // 获取使用套餐下拉框数据(调用产品列表接口)
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
    },
    // 第一步里面产品系列面积输入框事件
    areaRangChange (value, key, row, ev) {
      if (value) {
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
        // let myValue = String(value).replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
        const newData = [...this.areaRangDataSource]
        const target = newData.filter(item => key === item.key)[0]
        if (target) {
          target.areaNum = myValue
          this.areaRangDataSource = newData
        }
        if (row.priceType == 1) {
          if (Number(myValue) > Number(row.startArea)) {
            let saneNum = (Number(myValue) - Number(row.startArea)) / Number(row.perSquare)
            // saneNum = saneNum.toFixed(2)
            let alnum = Number(saneNum) * Number(row.perSquarePrice) + Number(row.startPrice)
            row.onlyAllMount = alnum.toFixed(2)
          } else {
            row.onlyAllMount = Number(row.startPrice)
          }
          if (myValue == '') {
            row.onlyAllMount = 0
          }
        } else if (row.priceType == 2) {
          if (Number(myValue) > Number(row.startArea) || Number(myValue) == Number(row.startArea)) {
            row.onlyAllMount = Number(myValue) * Number(row.perSquarePrice)
          } else {
            row.onlyAllMount = Number(row.startArea) * Number(row.perSquarePrice)
          }
          if (myValue == '') {
            row.onlyAllMount = 0
          }
        }

        this.allMount = 0
        this.areaRangDataSource.forEach(icen => {
          if (icen.onlyAllMount) {
            this.allMount = Number(this.allMount) + Number(icen.onlyAllMount)
            this.allMount = Number(String(this.allMount).replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3'))
          }
        })
      } else {
        this.areaRangDataSource.forEach(item => {
          if (item.id == row.id) {
            item.onlyAllMount = ''
          }
        })
      }
    },
    // 第一步使用套餐下拉框改变事件
    taocanSelectChange (edata) {
      this.saveTaocanId = edata
      this.allMount = ''
      this.areaRangDataSource = []
      // 新增时候自动出现所有产品系列list
      if (this.$route.query.aFlag == 1) {
        let sdata = { productId: edata }
        this.$request.post('/product/queryProductRangesById', sdata).then(response => {
          if (response.code == 0) {
            if (response.result) {
              this.areaRangList = response.result
              this.areaRangList.forEach(iref => {
                iref.myRangeId = iref.id
                iref.mySpliceAreaRangFlag = true // （最新改动）用来区分是新增还是编辑，如果新增点击下一步时候{id: '', area: 144, productRangeId: 100} 的id为空
                this.areaRangDataSource.push(iref)
                this.areaRangDataSource.forEach((item, index) => {
                  item.key = index
                  item.areaMeasure = 'm²'
                  if (item.priceType == 1) {
                    item.remark = `${index + 1}、计价方式：一口价。按${item.rangeName}实测面积计价，计价起步面积为${item.startArea}m²，不足${item.startArea}m²按${item.startArea}m²计算，起步价格为${item.startPrice}元；每超出${item.perSquare}m²的部分，加收${item.perSquarePrice}元`
                  } else if (item.priceType == 2) {
                    item.remark = `${index + 1}、计价方式：按平米计价。${item.rangeName}：${item.perSquarePrice}元/m²；起步面积${item.startArea}m²，低于${item.startArea}m²则按照${item.startArea}m²来计算`
                  }
                })
              })
            }
          }
        })
      }
    },
    // 第一步新增产品系列事件
    addConstruction (ev) {
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let adata = {
            productId: values.meal
          }
          this.$refs.commonModalDom.clearThink()
          this.$request.post('/product/queryProductRangesById', adata).then(response => {
            if (response.code == 0) {
              this.$refs.commonModalDom.visible = true
              this.areaRangList = response.result
              let sArr = []
              response.result.forEach(item => {
                let obj = {}
                obj.value = item.id
                obj.label = item.rangeName
                sArr.push(obj)
              })
              this.firstDialogData[0].options = sArr
            }
          })
        }
      })
    },
    // 第一步选择产品系列提交事件
    firstSubmitThink (adata) {
      this.$refs.commonModalDom.visible = false
      this.areaRangList.forEach(iref => {
        iref.myRangeId = iref.id
        if (iref.id == adata.construction) {
          iref.mySpliceAreaRangFlag = true // （最新改动）用来区分是新增还是编辑，如果新增点击下一步时候{id: '', area: 144, productRangeId: 100} 的id为空
          this.areaRangDataSource.push(iref)
          this.areaRangDataSource.forEach((item, index) => {
            item.key = index
            item.areaMeasure = 'm²'
            if (item.priceType == 1) {
              item.remark = `${index + 1}、计价方式：一口价。按${item.rangeName}实测面积计价，计价起步面积为${item.startArea}m²，不足${item.startArea}m²按${item.startArea}m²计算，起步价格为${item.startPrice}元；每超出${item.perSquare}m²的部分，加收${item.perSquarePrice}元`
            } else if (item.priceType == 2) {
              item.remark = `${index + 1}、计价方式：按平米计价。${item.rangeName}：${item.perSquarePrice}元/m²；起步面积${item.startArea}m²，低于${item.startArea}m²则按照${item.startArea}m²来计算`
            }
          })
        }
      })
    },
    // 第一步产品系列表格内点击删除事件
    areaRangOnlyDelete (adata, en) {
      let that = this
      this.$confirm({
        title: '是否确定删除？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          that.areaRangDataSource = that.areaRangDataSource.filter(fil => {
            return fil.key !== en.key
          })
          that.allMount = 0
          that.areaRangDataSource.forEach(icen => {
            if (icen.onlyAllMount) {
              that.allMount = Number(that.allMount) + Number(icen.onlyAllMount)
              that.allMount = Number(String(that.allMount).replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3'))
            }
          })
        }
      })
    }
  }
}
