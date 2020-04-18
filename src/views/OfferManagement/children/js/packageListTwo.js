export var packageListTwo = {
  data () {
    var twoPandDom = []
    // twoPandDom里面的saveUpgradArray: 点击升级之后会有个撤回操作，这个对象用来保存被撤回的原来的对象,是个数组，保存整份原来的最开始的数组
    twoPandDom = [
      { key: 1, title: 'Tab 1', contentData: [], dialogData: [], closable: false, tableRefDom: 'tableCommonTwo1', dialogRefDom: 'poplurCommonTwo1', saveUpgradArray: [] },
      { key: 2, title: 'Tab 2', contentData: [], dialogData: [], closable: false, tableRefDom: 'tableCommonTwo2', dialogRefDom: 'poplurCommonTwo2', saveUpgradArray: [] }
    ]
    return {
      twoPandDom, // 第二步骤的大数组
      saveTwoNowTabId: '', // 第三步点击表格添加主材时候记录下当前tab切换栏的id(当前tab的id)
      abiaozhi: true,
      cbiaozhi: true,
      twoAllMount: 0 // 第二步总的合计
    }
  },
  created: function () {

  },
  watch: {

  },
  methods: {
    // 进来第二步骤直接获取tab产品系列的数据
    twoShowFn () {
      let sdata = {
        quoteId: this.saveFirstSuccessId
      }
      this.$request.post('/quote/queryQuoteRangeById', sdata).then(response => {
        if (response.code == 0) {
          this.areaRangList = response.result
          this.saveTwoNowTabId = this.areaRangList[0].id
          this.twoPandDom = []
          this.areaRangList.forEach(rang => {
            let asobj = {}
            asobj.key = rang.id
            asobj.actionFlagAll = rang.isUpdate == 1 ? false : true
            asobj.myproductRangeId = rang.productRangeId
            asobj.title = rang.rangeName
            asobj.closable = false
            asobj.contentData = []
            asobj.dialogData = []
            asobj.tableRefDom = `tableCommonTwo${rang.id}`
            asobj.dialogRefDom = `poplurCommonTwo${rang.id}`
            asobj.saveUpgradArray = []
            this.twoPandDom.push(asobj)
          })
          this.showTableDataFn()
        }
      })
    },
    // 第二步骤获取表格数据的接口
    showTableDataFn () {
      let baseaUrl = ''
      let sdata = {}
      if (this.abiaozhi) {
        baseaUrl = '/quote/queryQuoteItemById'
        sdata.quoteId = this.saveFirstSuccessId
        sdata.itemType = 2
        sdata.pageSize = 10000
        sdata.pageNum = 1
      } else {
        baseaUrl = '/product/queryProductItemsById'
        sdata.productId = this.saveTaocanId
        sdata.pageSize = 10000
      }
      this.$request.post(baseaUrl, sdata).then(response => {
        if (response.code == 0) {
          if (response.result.list) {
            this.twoPandDom.forEach(item => {
              item.contentData = []
              item.contentData = response.result.list.map(o => Object.assign({}, o))
            })
            
            this.twoPandDom.forEach(pand => {
              pand.contentData = []
              this.$refs[pand.tableRefDom][0].allorMount = 0
              pand.contentData = response.result.list
              if (this.abiaozhi) {
                pand.contentData = pand.contentData.filter(fil => {
                  return fil.rangeId == pand.key
                })
              } else {
                pand.contentData = pand.contentData.filter(fil => {
                  return fil.productRangeId == pand.myproductRangeId
                })
              }

              pand.contentData.forEach(cont => {
                cont.key = cont.id
                // 加入是否操作里面升级按钮是否置灰的判断
                cont.actionBtnFlag = pand.actionFlagAll
                
                if (this.$route.query.aFlag == 1) {
                  if (baseaUrl == '/quote/queryQuoteItemById') {
                    cont.price = cont.itemPrice
                    cont.type = cont.modelType
                  }
                }
                if (this.$route.query.aFlag == 2) {
                  if (baseaUrl == '/quote/queryQuoteItemById') {
                    cont.price = cont.itemPrice
                    cont.type = cont.modelType
                  }
                }
                cont.amount = Number(cont.itemNum) * Number(cont.price)
                cont.amount = Number(cont.amount).toFixed(2)
                // cont.myIsItemFlag 表示每个对象里面表示刚进来第二部获取到数据时候，里面是否有撤回按钮，如果有那么这个值为false
                if (cont.itemId == cont.itemBasicId) {
                  cont.showItemNum = false
                  cont.action = '升级'
                  cont.myIsItemFlag = true
                  cont.myAmount = Number(cont.itemNum) * Number(cont.price)
                  cont.myAmount = Number(cont.myAmount).toFixed(2)
                  this.$refs[pand.tableRefDom][0].allorMount = (Number(this.$refs[pand.tableRefDom][0].allorMount) + Number(cont.myAmount)).toFixed(2)
                } else {
                  cont.showItemNum = true
                  cont.action = '撤回'
                  cont.myIsItemFlag = false
                  this.oldItemDataFn(cont).then(refs => {
                    cont.myAmount = (Number(cont.price) - Number(cont.myoldDataPrice)) * Number(cont.itemNum)
                    cont.myAmount = Number(cont.myAmount).toFixed(2)
                    this.$refs[pand.tableRefDom][0].allorMount = (Number(this.$refs[pand.tableRefDom][0].allorMount) + Number(cont.myAmount)).toFixed(2)
                    this.changAllamountFn()
                  })
                }
              })
            })
            this.twoPandDom.forEach(pand => {
              pand.saveUpgradArray = []
            })
            this.twoPandDom.forEach(item => {
              item.contentData.forEach(dou => {
                let asobj = {}
                asobj.productRangeId = dou.productRangeId
                asobj.amount = dou.amount
                asobj.myAmount = dou.amount
                asobj.attribute = dou.attribute
                asobj.brand = dou.brand
                asobj.category = dou.category
                asobj.code = dou.code
                asobj.id = dou.id
                asobj.itemBasicId = dou.itemBasicId
                asobj.itemId = dou.itemId
                asobj.itemNum = dou.itemNum
                asobj.key = dou.key
                asobj.name = dou.name
                asobj.note = dou.note
                asobj.price = dou.price
                asobj.productId = dou.productId
                asobj.rangeId = dou.rangeId
                asobj.rangeName = dou.rangeName
                asobj.size = dou.size
                asobj.status = dou.status
                asobj.type = dou.type
                asobj.unit = dou.unit
                asobj.showItemNum = dou.showItemNum
                item.saveUpgradArray.push(asobj)
              })
            })
          } else {
            this.abiaozhi = false
            if (this.cbiaozhi) this.showTableDataFn()
            this.cbiaozhi = false
          }
        }
      })
    },
    // 假如进入第二部时候数据中已经升级之后的数据（此时的按钮为撤回）那么根据itemBasicId调用queryItemById接口获取原来的数据,然后把原来的price赋值为自定义的myoldDataPrice
    oldItemDataFn (myItem) {
      return new Promise((resolve, reject) => {
        let mydata = {
          id: myItem.itemBasicId
        }
        this.$request.post('/sku/queryItemById', mydata).then(response => {
          if (response.code == 0) {
            this.twoPandDom.forEach(pand => {
              pand.contentData.forEach(old => {
                if (old.id == myItem.id) {
                  old.myoldDataPrice = response.result.price
                  resolve(response.result)
                }
              })
            })
          }
        })
      })
    },
    // 第二步骤table表格中主材数量输入框修改时候触发事件
    numItemChangeOne (adata, value, lastnum, ev) {
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
      let asendArr = []
      this.twoPandDom.forEach(pand => {
        if (pand.key == this.saveTwoNowTabId) {
          pand.contentData.forEach(item => {
            asendArr.push(item)
          })
        }
      })
      const newData = [...asendArr]
      const target = newData.filter(item => adata === item.key)[0]
      if (target) {
        target.itemNum = Number(myValue)
        this.twoPandDom.forEach(pand => {
          if (pand.key == this.saveTwoNowTabId) {
            pand.contentData = newData
          }
        })
      }
      this.twoPandDom.forEach(pand => {
        if (pand.key == this.saveTwoNowTabId) {
          this.$refs[pand.tableRefDom][0].allorMount = 0
          pand.contentData.forEach(icen => {
            if (icen.id == adata) {
              if (icen.action == '升级') {
                icen.itemNum = myValue
                icen.amount = Number(myValue) * Number(icen.price)
                icen.amount = Number(icen.amount).toFixed(2)
                icen.myAmount = Number(myValue) * Number(icen.price)
                icen.myAmount = Number(icen.myAmount).toFixed(2)
              } else if (icen.action == '撤回') {
                if (icen.myIsItemFlag) {
                  icen.itemNum = myValue
                  icen.amount = Number(myValue) * Number(icen.price)
                  icen.amount = icen.amount.toFixed(2)
                  pand.saveUpgradArray.forEach(sav => {
                    if (sav.id == adata) {
                      icen.myAmount = (Number(icen.price) - Number(sav.price)) * Number(myValue)
                    }
                  })
                } else {
                  icen.itemNum = myValue
                  icen.amount = Number(myValue) * Number(icen.price)
                  icen.amount = Number(icen.amount).toFixed(2)
                  icen.myAmount = (Number(icen.price) - Number(icen.myoldDataPrice)) * Number(myValue)
                  icen.myAmount = Number(icen.myAmount).toFixed(2)
                }
              }
            }
            this.$refs[pand.tableRefDom][0].allorMount = (Number(this.$refs[pand.tableRefDom][0].allorMount) + Number(icen.myAmount)).toFixed(2)
          })
        }
      })
      this.changAllamountFn()
    },
    // 第二步骤点击升级时候事件
    upgradeOne (data) {
      // 判断当前是升级还是撤回事件
      if (data.action == '升级') {
        this.twoPandDom.forEach(pand => {
          if (pand.key == this.saveTwoNowTabId) {
            this.$refs[pand.dialogRefDom][0].chooseHoldData = []
          }
        })
        this.saveUpgradId = data.id
        this.twoPandDom.forEach(pand => {
          if (pand.key == this.saveTwoNowTabId) {
            this.$refs[pand.dialogRefDom][0].selectedRowKeys = []
            this.$refs[pand.dialogRefDom][0].selectDom = []
            pand.dialogData = []
          }
        })
        let adata = {
          category: data.category,
          itemPrice: data.price,
          status: 1,
          pageSize: 10000
        }
        this.$request.post('/sku/queryItemList', adata).then(response => {
          if (response.code == 0) {
            this.twoPandDom.forEach(pand => {
              if (pand.key == this.saveTwoNowTabId) {
                this.$refs[pand.dialogRefDom][0].visible = true
              }
            })
            if (response.result.list) {
              this.twoPandDom.forEach(pand => {
                if (pand.key == this.saveTwoNowTabId) {
                  pand.dialogData = response.result.list
                  pand.dialogData.forEach(item => {
                    item.key = item.id
                  })
                }
              })
            }
          }
        })
      } else {
        this.twoPandDom.forEach(pand => {
          if (pand.key == this.saveTwoNowTabId) {
            this.$refs[pand.dialogRefDom][0].chooseHoldData = []
            this.$refs[pand.tableRefDom][0].allorMount = 0
          }
        })
        if (data.myIsItemFlag) {
          this.twoPandDom.forEach(pand => {
            if (pand.key == this.saveTwoNowTabId) {
              pand.contentData.forEach(item => {
                pand.saveUpgradArray.forEach(sav => {
                  if (item.id == data.id && sav.id == data.id) {
                    item.showItemNum = false
                    item.itemNum = 0
                    item.itemId = sav.itemId
                    item.name = sav.name
                    item.code = sav.code
                    item.unit = sav.unit
                    item.price = sav.price
                    item.amount = Number(item.itemNum) * Number(item.price)
                    item.myAmount = Number(item.itemNum) * Number(item.price)
                    item.brand = sav.brand
                    item.type = sav.type
                    item.size = sav.size
                    item.note = sav.note
                    item.common = sav.common
                    item.action = '升级'
                  }
                })
                this.$refs[pand.tableRefDom][0].allorMount = (Number(this.$refs[pand.tableRefDom][0].allorMount) + Number(item.myAmount)).toFixed(2)
              })
            }
          })
        } else {
          let mydata = {
            id: data.itemBasicId
          }
          this.$request.post('/sku/queryItemById', mydata).then(response => {
            if (response.code == 0) {
              this.twoPandDom.forEach(pand => {
                if (pand.key == this.saveTwoNowTabId) {
                  pand.contentData.forEach(item => {
                    if (item.id == data.id) {
                      item.showItemNum = false
                      item.itemNum = 0
                      item.itemId = response.result.id
                      item.name = response.result.name
                      item.code = response.result.code
                      item.unit = response.result.unit
                      item.price = response.result.price
                      item.amount = Number(data.itemNum) * Number(item.price)
                      item.myAmount = Number(data.itemNum) * Number(item.price)
                      item.brand = response.result.brand
                      item.type = response.result.type
                      item.size = response.result.size
                      item.note = response.result.note
                      item.common = response.result.common
                      item.action = '升级'
                    }
                    this.$refs[pand.tableRefDom][0].allorMount = (Number(this.$refs[pand.tableRefDom][0].allorMount) + Number(item.myAmount)).toFixed(2)
                  })
                }
              })
            }
          })
        }
      }
      this.changAllamountFn()
    },
    // 第二步骤点击升级之后弹框中点击提交的事件
    materialReplaceOne (rowData) {
      if (rowData.length == 0) {
        this.$message.info('请先选择要升级的数据!')
        return
      }
      this.twoPandDom.forEach((pand, index) => {
        if (pand.key == this.saveTwoNowTabId) {
          this.$refs[pand.dialogRefDom][0].visible = false
          this.$refs[pand.tableRefDom][0].allorMount = 0
          // 这里是替换的步骤
          pand.contentData.forEach(item => {
            if (item.id == this.saveUpgradId) {
              // 赋值
              item.showItemNum = true
              item.itemNum = 1
              item.code = rowData[0].code
              item.itemId = rowData[0].id
              item.name = rowData[0].name
              item.unit = rowData[0].unit
              item.price = rowData[0].price
              item.amount = Number(item.itemNum) * Number(item.price)
              item.brand = rowData[0].brand
              item.type = rowData[0].type
              item.size = rowData[0].size
              item.note = rowData[0].note
              item.common = rowData[0].common
              item.action = '撤回'
              if (item.myIsItemFlag) {
                pand.saveUpgradArray.forEach(upd => {
                  if (upd.id == this.saveUpgradId) {
                    item.myAmount = Number(item.itemNum) * (Number(item.price) - Number(upd.price))
                  }
                })
              } else {
                item.myAmount = Number(item.itemNum) * (Number(item.price) - Number(item.myoldDataPrice))
              }
            }
            this.$refs[pand.tableRefDom][0].allorMount = (Number(this.$refs[pand.tableRefDom][0].allorMount) + Number(item.myAmount)).toFixed(2)
          })
        }
      })
      this.changAllamountFn()
    },
    // 第二部切换面板的回调
    twoTabChange (adata) {
      this.saveTwoNowTabId = adata
      this.changeTabListFn()
    },
    // 第三步切换面板时候切换数据的事件
    changeTabListFn () {
      this.twoPandDom.forEach(item => {
        if (item.key == this.saveTwoNowTabId) {
          this.$refs[item.dialogRefDom][0].chooseHoldData = []
          this.$refs[item.dialogRefDom][0].selectedRowKeys = []
        }
      })
      this.changAllamountFn()
    },
    // 重新计算总值
    changAllamountFn () {
      this.twoAllMount = 0
      this.twoPandDom.forEach(pand => {
        this.twoAllMount += Number(this.$refs[pand.tableRefDom][0].allorMount)
      })
    }
  }
}
