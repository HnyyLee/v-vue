export var packageListThree = {
  created: function () {
  },
  methods: {
    // 第三步骤点击添加主材事件
    addScienceTwo (sendData) {
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
            this.searchDataTwo.optionData.data = sArr
          } else {
            this.searchDataTwo.optionData.data = []
          }
        }
      })
    },
    // 第三部弹框中点击搜索事件
    topSearchThinkTwo (data, sendData) {
      this.showPopuleTwoFn(sendData.myCategory, sendData.searchName, data)
    },
    // 第三步弹框中列表数据接口
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
            this.panesDom.forEach(pand => {
              if (pand.key == this.saveNowTabId) {
                pand.dialogData = response.result.list
                pand.dialogData.forEach(item => {
                  item.key = item.id
                  item.action = '删除'
                  item.itemNum = 1
                  item.amount = Number(item.itemNum) * Number(item.price)
                })
              }
            })
          } else {
            this.panesDom.forEach(pand => {
              if (pand.key == this.saveNowTabId) {
                pand.dialogData = []
              }
            })
          }
        }
      })
    },
    // 第三步点击弹框的提交事件
    materialReplaceTwo (adata, sendData) {
      this.$refs[adata.dialogRefDom][0].visible = false
      this.panesDom.forEach(item => {
        if (item.key == this.saveNowTabId) {
          item.contentData = sendData
        }
      })
      this.$refs[adata.tableRefDom][0].selectedRowKeys = []
      this.$refs[adata.tableRefDom][0].chooseListData = []
      this.spliceRangAllMountTwo(adata)
    },
    // 第三步弹框取消掉事件
    cannalThinkTwo (adata, sendData) {
      this.$refs[adata.dialogRefDom][0].selectedRowKeys = []
      this.panesDom.forEach(item => {
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
    // 第三步重新计算allorMount总的值
    spliceRangAllMountTwo (adata) {
      this.$refs[adata.tableRefDom][0].allorMount = 0
      this.panesDom.forEach(item => {
        if (item.key == adata.key) {
          item.contentData.forEach(con => {
            con.itemId = con.key
            con.amount = (Number(con.itemNum) * Number(con.price)).toFixed(2)
            this.$refs[adata.tableRefDom][0].allorMount = (Number(this.$refs[adata.tableRefDom][0].allorMount) + Number(con.amount)).toFixed(2)
          })
        }
      })
      // 循环第一步拿到的产品系列数据this.areaRangList，手动给this.panesDom里面的contentData数组里面对象加上myRangId
      this.panesDom.forEach(pan => {
        if (pan.key == adata.key) {
          pan.contentData.forEach(con => {
            con.myRangId = adata.key
          })
        }
      })
      // 重新计算总的值
      this.threeAllMount = 0
      this.panesDom.forEach(alItem => {
        alItem.contentData.forEach(irefs => {
          this.threeAllMount = (Number(this.threeAllMount) + Number(irefs.amount)).toFixed(2)
        })
      })
    },
    // 第三步表格数量输入框输入事件
    numItemChangeTwo (adata, value, lastnum, ev) {
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
      // let myValue = Number(String(value).replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3'))   // 原始的正则改值
      this.panesDom.forEach(item => {
        if (item.key == this.saveNowTabId) {
          const newData = [...item.contentData]
          const target = newData.filter(item => adata === item.key)[0]
          if (target) {
            target.itemNum = myValue
            item.contentData = newData
          }
        }
      })

      this.panesDom.forEach(item => {
        if (item.key == this.saveNowTabId) {
          this.$refs[item.tableRefDom][0].allorMount = 0
          item.contentData.forEach(con => {
            if (con.id == adata) {
              con.itemNum = myValue
              con.amount = Number(myValue) * Number(con.price)
              con.amount = Number(con.amount).toFixed(2)
            }
            this.$refs[item.tableRefDom][0].allorMount = (Number(this.$refs[item.tableRefDom][0].allorMount) + Number(con.amount)).toFixed(2)
          })
        }
      })
      // 重新计算总的值
      this.threeAllMount = 0
      this.panesDom.forEach(alItem => {
        alItem.contentData.forEach(irefs => {
          this.threeAllMount = (Number(this.threeAllMount) + Number(irefs.amount)).toFixed(2)
        })
      })
    },
    // 第三步表格点击list删除按钮事件
    upgradeTwo (adata, sendData) {
      let that = this
      this.$confirm({
        title: '是否确定删除？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          adata.contentData = adata.contentData.filter(fil => {
            return fil.id !== sendData.id
          })
          that.$refs[adata.dialogRefDom][0].selectedRowKeys = []
          that.$refs[adata.dialogRefDom][0].chooseHoldData = adata.contentData
          that.$refs[adata.tableRefDom][0].allorMount = 0
          adata.contentData.forEach(iren => {
            that.$refs[adata.dialogRefDom][0].selectedRowKeys.push(iren.id)
            that.$refs[adata.tableRefDom][0].allorMount = (Number(that.$refs[adata.tableRefDom][0].allorMount) + Number(iren.amount)).toFixed(2)
          })
          that.changeTabListFn()
          // 重新计算总的值
          that.threeAllMount = 0
          that.panesDom.forEach(alItem => {
            alItem.contentData.forEach(irefs => {
              that.threeAllMount = (Number(that.threeAllMount) + Number(irefs.amount)).toFixed(2)
            })
          })
        }
      })
    },
    // 第三步表格上方点击批量删除事件
    deleteThinkTwo (adata, evData) {
      let that = this
      this.panesDom.forEach(pand => {
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
                that.$refs[pand.tableRefDom][0].allorMount = 0
                pand.contentData.forEach(iren => {
                  that.$refs[pand.dialogRefDom][0].selectedRowKeys.push(iren.id)
                  that.$refs[pand.tableRefDom][0].allorMount = (Number(that.$refs[pand.tableRefDom][0].allorMount) + Number(iren.amount)).toFixed(2)
                })
                // 重新计算总的值
                that.threeAllMount = 0
                that.panesDom.forEach(alItem => {
                  alItem.contentData.forEach(irefs => {
                    that.threeAllMount = (Number(that.threeAllMount) + Number(irefs.amount)).toFixed(2)
                  })
                })
              }
            })
          }
        }
      })
    },
    // 第三部切换面板的回调
    topTabChange (adata) {
      this.saveNowTabId = adata
      this.changeTabListFn()
    },
    // 第三步切换面板时候切换数据的事件
    changeTabListFn () {
      this.panesDom.forEach(item => {
        if (item.key == this.saveNowTabId) {
          this.$refs[item.dialogRefDom][0].chooseHoldData = []
          this.$refs[item.dialogRefDom][0].selectedRowKeys = []
          item.contentData.forEach(con => {
            this.$refs[item.dialogRefDom][0].selectedRowKeys.push(con.itemId)
          })
          this.$refs[item.dialogRefDom][0].chooseHoldData = item.contentData
          this.spliceRangAllMountTwo(item)
        }
      })
    }
  }
}
