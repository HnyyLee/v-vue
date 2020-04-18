export var repertoireListTwo = {
  created: function () {
  },
  methods: {
    // 第二部切换面板的回调
    topTabChange (adata) {
      this.savePrevTabId = this.saveNowTabId
      this.saveNowTabId = adata
      let isFirstFlag = false
      this.panesDom.forEach(item => {
        if (item.key == this.savePrevTabId) {
          if (item.isFirstSet == true) {
            isFirstFlag = true
          }
        }
      })
      if (isFirstFlag == true) {
        this.sendenShowFn(this.savePrevTabId)
      }
      if (this.$route.query.aFlag == 2) {
        // 获取空间信息下面主材信息和工艺信息
        this.panesDom.forEach(pan => {
          if (pan.editShowDataFlag == false) {
            this.getItemListFn()
            this.getCartyListFn()
            pan.editShowDataFlag = true
          }
        })
      }
    },
    // 第二步骤的提交接口事件
    sendenShowFn (mySpaceId) {
      let qutoArr = []
      this.panesDom.forEach(item => {
        if (item.key == mySpaceId) {
          item.contentTop.forEach(con => {
            let qutObj = {}
            qutObj.itemId = con.itemId
            qutObj.itemBasicId = con.itemId
            qutObj.itemNum = con.itemNum
            qutObj.itemPrice = con.price
            qutObj.remark = con.remark
            qutoArr.push(qutObj)
          })
        }
      })
      let carArr = []
      this.panesDom.forEach(item => {
        if (item.key == mySpaceId) {
          item.contentBottom.forEach(btn => {
            let carObj = {}
            carObj.craftId = btn.craftId
            carObj.craftNum = btn.itemNum
            carObj.craftPrice = btn.price
            carObj.remark = btn.remark
            carArr.push(carObj)
          })
        }
      })
      let sdata = {
        id: this.saveFirstSuccessId,
        type: this.$route.query.offerState,
        spaceId: mySpaceId,
        quoteItemVoList: qutoArr,
        quoteCraftVoList: carArr
      }
      this.$request.post('/quote/updateQuoteItems', sdata).then(response => {
        if (response.code == 0) {
          this.$message.success('数据保存成功!')
          this.panesDom.forEach(item => {
            if (item.key == mySpaceId) {
              item.isFirstSet = false
            }
          })
        }
      })
    },
    // 第二部点击新增空间按钮事件
    addSpaceThink () {
      this.$refs.commonModalDom.clearThink()
      this.$refs.commonModalDom.visible = true
    },
    // 第二步骤点击新增空间提交事件
    spaceSubmitThink (adata) {
      let sdata = {
        quoteId: this.saveFirstSuccessId,
        name: adata.spaceName
      }
      this.$request.post('/quote/insertSpace', sdata).then(response => {
        if (response.code == 0) {
          this.$refs.commonModalDom.visible = false
          this.$message.success('新增空间成功')
          let panes = this.panesDom
          panes.push(
            { key: response.result, title: `${adata.spaceName}`, contentTop: [], contentBottom: [], tableRefDom: `tableCommon${response.result}`, dialogRefDom: `poplurCommon${response.result}`, dialogDataTop: [], dialogDataBtm: [], closable: false, isFirstSet: true }
          )
          this.panesDom = panes
          if (this.panesDom.length == 1) {
            this.saveNowTabId = response.result
            this.savePrevTabId = response.result
          } else {
            this.savePrevTabId = this.saveNowTabId
          }
        }
      })
    },
    // 第二步tab标签页点击删除按钮
    onEdit (targetKey, action) {
      this[action](targetKey)
    },
    // 第二部tab移除掉tab事件
    remove (targetKey) {
      let activeKey = this.activeKey
      let lastIndex
      this.panesDom.forEach((pane, i) => {
        if (pane.key === targetKey) {
          lastIndex = i - 1
        }
      })
      const panes = this.panesDom.filter(pane => pane.key !== targetKey)
      if (lastIndex >= 0 && activeKey === targetKey) {
        activeKey = panes[lastIndex].key
      }
      this.panesDom = panes
      this.activeKey = activeKey
    },
    // 第二步骤第一个表格涉及到的事件此处开始。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
    // 第二部第一个表格点击添加主材清单按钮事件
    sendTopAddScience (sendData) {
      this.saveNowTabId = sendData.key
      this.$refs[sendData.dialogRefDom][0].clearThink()
      this.showPopuleTopFn('', '', sendData)
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
            this.searchDataTop.optionData.data = sArr
          } else {
            this.searchDataTop.optionData.data = []
          }
        }
      })
      this.panesDom.forEach(item => {
        if (item.key == this.saveNowTabId) {
          item.isFirstSet = true
          item.editShowDataFlag = false
        }
      })
    },
    // 第二步第一个弹框中点击搜索事件
    topSearchThinkTop (data, sendData) {
      this.showPopuleTopFn(sendData.myCategory, sendData.searchName, data)
    },
    // 第二步第一个弹框中列表数据接口
    showPopuleTopFn (category, name, sendData) {
      let adata = {
        pageSize: 10000,
        status: 1
      }
      if (category !== '') adata.category = category
      if (name !== '') adata.name = name
      this.$request.post('/sku/queryItemList', adata).then(response => {
        if (response.code == 0) {
          this.$refs[sendData.dialogRefDom][0].visible = true
          if (response.result.list) {
            this.panesDom.forEach(pand => {
              if (pand.key == this.saveNowTabId) {
                pand.dialogDataTop = response.result.list
                pand.dialogDataTop.forEach(item => {
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
                pand.dialogDataTop = []
              }
            })
          }
        }
      })
    },
    // 第二步第一个表格点击总的删除按钮事件
    sendTopDeleteThink (adata, keyword) {
      this.panesDom.forEach(item => {
        if (item.key == this.saveNowTabId) {
          if (adata.length == item.contentTop.length) {
            this.$message.info('请选择要删除的数据!')
          } else {
            item.contentTop = adata
            this.$refs[item.dialogRefDom][0].chooseHoldData = adata
            this.$refs[item.dialogRefDom][0].selectedRowKeys = []
            this.$refs[item.tableRefDom][0].allorMount = 0
            item.contentTop.forEach(iren => {
              this.$refs[item.dialogRefDom][0].selectedRowKeys.push(iren.id)
              this.$refs[item.tableRefDom][0].allorMount = (Number(this.$refs[item.tableRefDom][0].allorMount) + Number(iren.amount)).toFixed(2)
            })
          }
        }
      })
    },
    // 第二步第一个弹框点击弹框的提交事件
    materialReplaceTop (adata, sendData) {
      this.$refs[adata.dialogRefDom][0].visible = false
      this.panesDom.forEach(item => {
        if (item.key == this.saveNowTabId) {
          item.contentTop = sendData
        }
      })
      this.$refs[adata.tableRefDom][0].selectedRowKeys = []
      this.$refs[adata.tableRefDom][0].chooseListData = []
      this.spliceRangAllMountTop(adata)
    },
    // 第二步第一个弹框取消掉事件
    cannalThinkTop (adata, sendData) {
      this.$refs[adata.dialogRefDom][0].selectedRowKeys = []
      this.panesDom.forEach(item => {
        if (item.key == this.saveNowTabId) {
          if (item.contentTop.length !== 0) {
            item.contentTop.forEach(cont => {
              this.$refs[adata.dialogRefDom][0].selectedRowKeys.push(cont.key)
            })
          }
          this.$refs[adata.dialogRefDom][0].chooseHoldData = item.contentTop
        }
      })
    },
    // 第二步重新计算allorMount总的值，和循环拿产品系列遍历的事件
    spliceRangAllMountTop (adata) {
      this.$refs[adata.tableRefDom][0].allorMount = 0
      this.panesDom.forEach(item => {
        if (item.key == adata.key) {
          item.contentTop.forEach(con => {
            con.itemId = con.key
            this.$refs[adata.tableRefDom][0].allorMount = (Number(this.$refs[adata.tableRefDom][0].allorMount) + Number(con.amount)).toFixed(2)
          })
        }
      })
    },
    // 第二步第一个表格input框改变事件
    sendTopNumItemChange (adata, value) {
      this.panesDom.forEach(item => {
        if (item.key == this.saveNowTabId) {
          this.$refs[item.tableRefDom][0].allorMount = 0
          item.contentTop.forEach(con => {
            if (con.id == adata) {
              con.itemNum = value
              con.amount = Number(value) * Number(con.price)
            }
            this.$refs[item.tableRefDom][0].allorMount = (Number(this.$refs[item.tableRefDom][0].allorMount) + Number(con.amount)).toFixed(2)
          })
          item.isFirstSet = true
          item.editShowDataFlag = false
        }
      })
    },
    // 第二步骤第二个表格事件开始处。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
    // 第二部第二个表格点击添加工艺清单按钮事件
    sendBtmAddScience (sendData) {
      this.saveNowTabId = sendData.key
      this.$refs[sendData.dialogRefDom][1].clearThink()
      this.showPopuleBtmFn('', '', sendData)
      // 获取弹框顶部筛选条件下拉框数据
      let sdata = {}
      this.$request.post('/sku/queryCraftCateList', sdata).then(response => {
        if (response.code == 0) {
          if (response.result.list) {
            let sArr = []
            response.result.list.forEach(icon => {
              let asobj = {}
              asobj.value = icon.name
              asobj.tabel = icon.name
              sArr.push(asobj)
            })
            this.searchDataBtm.optionData.data = sArr
          } else {
            this.searchDataBtm.optionData.data = []
          }
        }
      })
      this.panesDom.forEach(item => {
        if (item.key == this.saveNowTabId) {
          item.isFirstSet = true
          item.editShowDataFlag = false
        }
      })
    },
    // 第二步第二个表格弹框里面搜索事件
    topSearchThinkBtm (data, sendData) {
      this.showPopuleBtmFn(sendData.myCategory, sendData.searchName, data)
    },
    // 第二步第一个弹框中列表数据接口
    showPopuleBtmFn (category, name, sendData) {
      let adata = {
        pageSize: 10000,
        status: 1
      }
      if (category !== '') adata.category = category
      if (name !== '') adata.name = name
      this.$request.post('/sku/queryCraftList', adata).then(response => {
        if (response.code == 0) {
          this.$refs[sendData.dialogRefDom][1].visible = true
          if (response.result.list) {
            this.panesDom.forEach(pand => {
              if (pand.key == this.saveNowTabId) {
                pand.dialogDataBtm = response.result.list
                pand.dialogDataBtm.forEach(item => {
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
                pand.dialogDataBtm = []
              }
            })
          }
        }
      })
    },
    // 第二步第二个表格点击总的删除按钮事件
    sendBtmDeleteThink (adata, keyword) {
      this.panesDom.forEach(item => {
        if (item.key == this.saveNowTabId) {
          if (adata.length == item.contentBottom.length) {
            this.$message.info('请选择要删除的数据!')
          } else {
            item.contentBottom = adata
            this.$refs[item.dialogRefDom][1].chooseHoldData = adata
            this.$refs[item.dialogRefDom][1].selectedRowKeys = []
            this.$refs[item.tableRefDom][1].allorMount = 0
            item.contentBottom.forEach(iren => {
              this.$refs[item.dialogRefDom][1].selectedRowKeys.push(iren.id)
              this.$refs[item.tableRefDom][1].allorMount = (Number(this.$refs[item.tableRefDom][1].allorMount) + Number(iren.amount)).toFixed(2)
            })
          }
        }
      })
    },
    // 第二步第二表格弹框提交事件
    materialReplaceBtm (adata, sendData) {
      this.$refs[adata.dialogRefDom][1].visible = false
      this.panesDom.forEach(item => {
        if (item.key == this.saveNowTabId) {
          item.contentBottom = sendData
        }
      })
      this.$refs[adata.tableRefDom][1].selectedRowKeys = []
      this.$refs[adata.tableRefDom][1].chooseListData = []
      this.spliceRangAllMountBtm(adata)
    },
    // 第二步第二个表格弹框取消事件
    cannalThinkBtm (adata, sendData) {
      console.log('dier弹框取消事件', adata, sendData)
      this.$refs[adata.dialogRefDom][1].selectedRowKeys = []
      this.panesDom.forEach(item => {
        if (item.key == this.saveNowTabId) {
          if (item.contentBottom.length !== 0) {
            item.contentBottom.forEach(cont => {
              this.$refs[adata.dialogRefDom][1].selectedRowKeys.push(cont.key)
            })
          }
          this.$refs[adata.dialogRefDom][1].chooseHoldData = item.contentBottom
        }
      })
    },
    // 第二步重新计算allorMount总的值，和循环拿产品系列遍历的事件
    spliceRangAllMountBtm (adata) {
      this.$refs[adata.tableRefDom][1].allorMount = 0
      this.panesDom.forEach(item => {
        if (item.key == adata.key) {
          item.contentBottom.forEach(con => {
            con.craftId = con.key
            this.$refs[adata.tableRefDom][1].allorMount = (Number(this.$refs[adata.tableRefDom][1].allorMount) + Number(con.amount)).toFixed(2)
          })
        }
      })
    },
    // 第二步第二个表格input框改变事件
    sendBtmNumItemChange (adata, value) {
      this.panesDom.forEach(item => {
        if (item.key == this.saveNowTabId) {
          this.$refs[item.tableRefDom][1].allorMount = 0
          item.contentBottom.forEach(con => {
            if (con.id == adata) {
              con.itemNum = value
              con.amount = Number(value) * Number(con.price)
            }
            this.$refs[item.tableRefDom][1].allorMount = (Number(this.$refs[item.tableRefDom][1].allorMount) + Number(con.amount)).toFixed(2)
          })
          item.isFirstSet = true
          item.editShowDataFlag = false
        }
      })
    },
    aTextareaFn() {
      this.panesDom.forEach(item => {
        if (item.key == this.saveNowTabId) {
          item.isFirstSet = true
          item.editShowDataFlag = false
        }
      })
    }
  }
}
