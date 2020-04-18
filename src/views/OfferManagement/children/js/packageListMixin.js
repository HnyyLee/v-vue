export var mixin = {
  created: function () {
  },
  methods: {
    // 返回列表事件
    targeGoList () {
      this.$router.push('/offer')
    },
    // 点击下一步事件
    nexthandleSubmit (e) {
      e.preventDefault()
      if (this.stepNumFlag == 0) {
        this.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            if (this.areaRangDataSource.length == 0) {
              this.$message.info('请先添加产品系列')
              return
            }
            let aflag = true
            this.areaRangDataSource.forEach(iref => {
              if (!iref.onlyAllMount) aflag = false
            })
            if (aflag) {
              let sendArr = []
              // *****************************************************
              this.areaRangDataSource.forEach(iern => {
                let thatObj = {}
                if (iern.mySpliceAreaRangFlag) {
                  thatObj.id = ''
                } else {
                  thatObj.id = iern.id
                }
                thatObj.area = iern.areaNum
                thatObj.productRangeId = iern.myRangeId
                sendArr.push(thatObj)
              })
              let adata = {
                name: values.schemeName,
                // decorateType: values.decorationType,
                type: this.$route.query.offerState,
                productId: values.meal,
                workOrderId: JSON.parse(sessionStorage.orderValue).id,
                rangeFee: this.allMount,
                quoteRangeVoList: sendArr
              }
              let baseUrl = ''
              if (this.saveFirstSuccessId == '') {
                baseUrl = '/quote/insertQuoteBasic'
              } else {
                baseUrl = '/quote/updateQuoteBasic'
                adata.id = this.saveFirstSuccessId
              }
              // 后续再吧这个代码打开
              // this.twoShowFn()
              // if (this.stepNumFlag < 6) {
              //   this.stepNumFlag += 1
              // }
              this.$request.post(baseUrl, adata).then(response => {
                if (response.code == 0) {
                  if (this.stepNumFlag < 6) {
                    this.stepNumFlag += 1
                  }
                  this.saveFirstSuccessId = response.result
                  this.$message.success('标配设置保存成功')
                  this.twoShowFn()
                } else {
                  this.$message.error(response.message)
                }
              })
            } else {
              this.$message.info('请输入产品系列数值面积')
            }
          }
        })
      } else if (this.stepNumFlag == 1) {
        this.senOrThrShowFn(1)
      } else if (this.stepNumFlag == 2) {
        this.senOrThrShowFn(2)
      } else if (this.stepNumFlag == 3) {
        this.fouOrFivShowFn(1)
      } else if (this.stepNumFlag == 4) {
        this.fouOrFivShowFn(2)
      } else if (this.stepNumFlag == 5) {
        if (this.LastTabChagneFlag == false) {
          this.$message.info('请先提交改动的调整项，再执行操作！')
          return
        }
        if (this.reductionFlag == false) {
          this.$message.info('请先提交改动的折减项，再执行操作！')
          return
        }
        var that = this
        this.$success({
          title: '新增套餐报价成功！',
          content: (
            <div>
              <p>已成功新增套餐报价，点击确认返回报价列表</p>
            </div>
          ),
          okText: '确认',
          onOk: function () {
            that.$router.push({ path: '/offer' })
          }
        })
      }
    },
    // 第二步骤和第三步骤这两个页面点击下一步时候调用的接口（同一个，参数不一样）
    senOrThrShowFn (num) {
      // num为1是第二步，2为第三步
      let sendAder = []
      if (num == 1) {
        this.twoPandDom.forEach(pand => {
          pand.contentData.forEach(irefs => {
            let smaObj = {}
            smaObj.id = irefs.id
            smaObj.rangeId = pand.key
            smaObj.itemId = irefs.itemId
            smaObj.itemBasicId = irefs.itemBasicId
            smaObj.itemNum = irefs.itemNum
            smaObj.itemPrice = irefs.price
            smaObj.remark = irefs.remark
            sendAder.push(smaObj)
          })
        })
        // this.doubleDateOne.forEach(irefs => {
        //   let smaObj = {}
        //   smaObj.id = irefs.id
        //   smaObj.rangeId = irefs.rangeId
        //   smaObj.itemId = irefs.itemId
        //   smaObj.itemBasicId = irefs.itemBasicId
        //   smaObj.itemNum = irefs.itemNum
        //   smaObj.itemPrice = irefs.price
        //   sendAder.push(smaObj)
        // })
      } else if (num == 2) {
        this.threeAllMount = 0
        this.panesDom.forEach(alItem => {
          alItem.contentData.forEach(irefs => {
            let smaObj = {}
            smaObj.rangeId = irefs.myRangId
            smaObj.itemId = irefs.itemId
            smaObj.itemBasicId = irefs.itemId
            smaObj.itemNum = irefs.itemNum
            smaObj.itemPrice = irefs.price
            smaObj.remark = irefs.remark
            sendAder.push(smaObj)
            this.threeAllMount = Number(this.threeAllMount) + Number(irefs.amount)
          })
        })
      }
      let adata = {
        id: this.saveFirstSuccessId,
        type: this.$route.query.offerState,
        quoteItemVoList: sendAder
      }
      num == 1 ? adata.upgradeItemFee = this.twoAllMount : adata.optionItemFee = this.threeAllMount
      num == 1 ? adata.itemType = '2' : adata.itemType = '3'
      // 后续再吧这个代码打开
      // if (this.stepNumFlag < 6) {
      //   this.stepNumFlag += 1
      // }
      this.$request.post('/quote/updateQuoteItems', adata).then(response => {
        if (response.code == 0) {
          if (this.stepNumFlag < 6) {
            this.stepNumFlag += 1
          }
          num == 1 ? this.$message.success('主材升级保存成功') : this.$message.success('主材选配保存成功')

          // 编辑的时候从第二部进入到第三步时候刷新页面
          // 这里是进入到第三步主材选配页面的时候获取所有产品系列，并渲染成tab, 无论是新增还是编辑，都要获取产品系列
          if (num == 1) {
            this.showQuoteItemFn('itrue')
          } else if (this.$route.query.aFlag == 2 && num == 2) { // 编辑的时候从第三部进入到第四步时候刷新页面
            this.showQuoteCraftsFn()
          }
        } else {
          this.$message.error(response.message)
        }
      })
    },
    // 第四步骤和第五步骤这两个页面点击下一步时候调用的接口（同一个，参数不一样）
    fouOrFivShowFn (num) {
      // num为1是第四步，2为第五步
      let sendAder = []
      if (num == 1) {
        this.doubleDateThree.forEach(irefs => {
          let smaObj = {}
          smaObj.craftId = irefs.craftId
          smaObj.craftNum = irefs.itemNum
          smaObj.craftPrice = irefs.price
          smaObj.remark = irefs.remark
          sendAder.push(smaObj)
        })
      } else if (num == 2) {
        this.doubleDateFour.forEach(irefs => {
          let smaObj = {}
          smaObj.craftId = irefs.craftId
          smaObj.craftNum = irefs.itemNum
          smaObj.craftPrice = irefs.price
          smaObj.remark = irefs.remark
          sendAder.push(smaObj)
        })
      }
      let adata = {
        id: this.saveFirstSuccessId,
        quoteCraftVoList: sendAder
      }
      num == 1 ? adata.personCraftFee = this.$refs.commonTableThree.allorMount : adata.otherCraftFee = this.$refs.commonTableFour.allorMount
      num == 1 ? adata.craftType = '1' : adata.craftType = '2'
      // 后续再吧这个代码打开
      // if (this.stepNumFlag < 6) {
      //   this.stepNumFlag += 1
      // }
      // if (num == 2) {
      //   this.doubleDateSix = []
      //   this.addTabNumber = 0
      //   this.stepName = '完成'
      //   this.lastPageShowData()
      // }
      this.$request.post('/quote/updateQuoteCrafts', adata).then(response => {
        if (response.code == 0) {
          if (this.stepNumFlag < 6) {
            this.stepNumFlag += 1
          }
          num == 1 ? this.$message.success('个性化施工保存成功') : this.$message.success('其他保存成功')
          if (num == 2) {
            this.doubleDateSix = []
            this.addTabNumber = 0
            this.stepName = '完成'
            let that = this
            this.spinning = true
            // 获取第六步第一个表格说明里面的动态公式
            this.getQueryItemFn()
            setTimeout(function () {
              that.lastPageShowData()
            }, 1000)
            // 获取折减价的表格数据
            this.getDiscountsDataFn()
          }
          // 编辑的时候从第四部进入到第五步时候刷新页面
          if (this.$route.query.aFlag == 2 && num == 1) {
            this.showQuoteOrtherFn()
          } else if (this.$route.query.aFlag == 2 && num == 2) { // 编辑的时候从第五部进入到第六步时候刷新页面
            this.showQuoteAdjustFn()
          }
        } else {
          this.$message.error(response.message)
        }
      })
    },
    // 点击上一步事件
    lasthandleSubmit (ev) {
      if (this.stepNumFlag == 5) {
        this.stepName = '下一步'
      }
      if (this.stepNumFlag > 0) {
        this.stepNumFlag -= 1
      }
      if (this.stepNumFlag == 1 && this.$route.query.aFlag == 1) {
        this.saveNewThreeData = true
      }
      if (this.stepNumFlag == 0 && this.saveFirstSuccessId !== '') {
        this.doneChangeDecor = true
        this.doneChangetaocan = true
      }
      this.abiaozhi = true
      this.cbiaozhi = true

      // 新增的时候从第二部点击上一步到第一步的时候也要调用接口
      if (this.$route.query.aFlag == 1 && this.stepNumFlag == 0) {
        let adata = {
          quoteId: this.saveFirstSuccessId
        }
        this.nowshowMyData(adata)
      }

      if (this.$route.query.aFlag == 2) {
        let anowNum = this.stepNumFlag
        if (anowNum == 0) {
          this.firstStepDataFn()
        } else if (anowNum == 1) {
          this.twoShowFn()
        } else if (anowNum == 2) {
          this.showQuoteItemFn()
        } else if (anowNum == 3) {
          this.showQuoteCraftsFn()
        } else if (anowNum == 4) {
          this.showQuoteOrtherFn()
        } else if (anowNum == 5) {
          this.doubleDateSix = []
          this.addTabNumber = 0
          this.stepName = '完成'
          let that = this
          this.spinning = true
          // 获取第六步第一个表格说明里面的动态公式
          this.getQueryItemFn()
          setTimeout(function () {
            that.lastPageShowData()
          }, 1000)
          this.showQuoteAdjustFn()
          // 获取折减价的表格数据
          this.getDiscountsDataFn()
        }
      }
    },
    // 点击step上面的步骤任意跳转步骤
    stepClickThinkFn (stepNum, anowNum) {
      if (this.$route.query.aFlag == 2) {
        if (stepNum == 5) {
          this.stepName = '下一步'
        }
        if (stepNum == 0 && this.saveFirstSuccessId !== '') {
          this.doneChangeDecor = true
          this.doneChangetaocan = true
        }
        this.abiaozhi = true
        this.cbiaozhi = true

        if (stepNum == 0) {
          this.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              if (this.areaRangDataSource.length == 0) {
                this.$message.info('请先添加产品系列')
                return
              }
              let aflag = true
              this.areaRangDataSource.forEach(iref => {
                if (!iref.onlyAllMount) aflag = false
              })
              if (aflag) {
                let sendArr = []
                this.areaRangDataSource.forEach(iern => {
                  let thatObj = {}
                  if (iern.mySpliceAreaRangFlag) {
                    thatObj.id = ''
                  } else {
                    thatObj.id = iern.id
                  }
                  thatObj.area = iern.areaNum
                  thatObj.productRangeId = iern.myRangeId
                  sendArr.push(thatObj)
                })
                let adata = {
                  name: values.schemeName,
                  // decorateType: values.decorationType,
                  type: this.$route.query.offerState,
                  productId: values.meal,
                  workOrderId: JSON.parse(sessionStorage.orderValue).id,
                  rangeFee: this.allMount,
                  quoteRangeVoList: sendArr
                }
                let baseUrl = ''
                if (this.saveFirstSuccessId == '') {
                  baseUrl = '/quote/insertQuoteBasic'
                } else {
                  baseUrl = '/quote/updateQuoteBasic'
                  adata.id = this.saveFirstSuccessId
                }
                this.$request.post(baseUrl, adata).then(response => {
                  if (response.code == 0) {
                    this.saveFirstSuccessId = response.result
                    this.$message.success('标配设置保存成功')
                    // 设置当前stepNumFlag位置，并执行当前点击页面要调用的接口
                    this.stepNumFlag = anowNum
                    this.nowTabShowFn(anowNum)
                  } else {
                    this.$message.error(response.message)
                  }
                })
              } else {
                this.$message.info('请输入产品系列数值面积')
              }
            }
          })
        } else if (stepNum == 1) {
          let sendAder = []
          this.twoPandDom.forEach(pand => {
            pand.contentData.forEach(irefs => {
              let smaObj = {}
              smaObj.id = irefs.id
              smaObj.rangeId = pand.key
              smaObj.itemId = irefs.itemId
              smaObj.itemBasicId = irefs.itemBasicId
              smaObj.itemNum = irefs.itemNum
              smaObj.itemPrice = irefs.price
              smaObj.remark = irefs.remark
              sendAder.push(smaObj)
            })
          })
          // this.doubleDateOne.forEach(irefs => {
          //   let smaObj = {}
          //   smaObj.id = irefs.id
          //   smaObj.rangeId = irefs.rangeId
          //   smaObj.itemId = irefs.itemId
          //   smaObj.itemBasicId = irefs.itemBasicId
          //   smaObj.itemNum = irefs.itemNum
          //   smaObj.itemPrice = irefs.price
          //   sendAder.push(smaObj)
          // })
          let adata = {
            id: this.saveFirstSuccessId,
            type: this.$route.query.offerState,
            quoteItemVoList: sendAder
          }
          adata.upgradeItemFee = this.twoAllMount
          adata.itemType = '2'
          this.$request.post('/quote/updateQuoteItems', adata).then(response => {
            if (response.code == 0) {
              this.$message.success('主材升级保存成功')
              // 设置当前stepNumFlag位置，并执行当前点击页面要调用的接口
              this.stepNumFlag = anowNum
              this.nowTabShowFn(anowNum)
            } else {
              this.$message.error(response.message)
            }
          })
        } else if (stepNum == 2) {
          let sendAder = []
          this.threeAllMount = 0
          this.panesDom.forEach(alItem => {
            alItem.contentData.forEach(irefs => {
              let smaObj = {}
              smaObj.rangeId = irefs.myRangId
              smaObj.itemId = irefs.itemId
              smaObj.itemBasicId = irefs.itemId
              smaObj.itemNum = irefs.itemNum
              smaObj.itemPrice = irefs.price
              smaObj.remark = irefs.remark
              sendAder.push(smaObj)
              this.threeAllMount = Number(this.threeAllMount) + Number(irefs.amount)
            })
          })
          let adata = {
            id: this.saveFirstSuccessId,
            type: this.$route.query.offerState,
            quoteItemVoList: sendAder
          }
          adata.optionItemFee = this.threeAllMount
          adata.itemType = '3'
          this.$request.post('/quote/updateQuoteItems', adata).then(response => {
            if (response.code == 0) {
              this.$message.success('主材选配保存成功')
              // 设置当前stepNumFlag位置，并执行当前点击页面要调用的接口
              this.stepNumFlag = anowNum
              this.nowTabShowFn(anowNum)
            } else {
              this.$message.error(response.message)
            }
          })
        } else if (stepNum == 3) {
          let sendAder = []
          this.doubleDateThree.forEach(irefs => {
            let smaObj = {}
            smaObj.craftId = irefs.craftId
            smaObj.craftNum = irefs.itemNum
            smaObj.craftPrice = irefs.price
            smaObj.remark = irefs.remark
            sendAder.push(smaObj)
          })
          let adata = {
            id: this.saveFirstSuccessId,
            quoteCraftVoList: sendAder
          }
          adata.personCraftFee = this.$refs.commonTableThree.allorMount
          adata.craftType = '1'
          this.$request.post('/quote/updateQuoteCrafts', adata).then(response => {
            if (response.code == 0) {
              this.$message.success('个性化施工保存成功')
              // 设置当前stepNumFlag位置，并执行当前点击页面要调用的接口
              this.stepNumFlag = anowNum
              this.nowTabShowFn(anowNum)
            } else {
              this.$message.error(response.message)
            }
          })
        } else if (stepNum == 4) {
          let sendAder = []
          this.doubleDateFour.forEach(irefs => {
            let smaObj = {}
            smaObj.craftId = irefs.craftId
            smaObj.craftNum = irefs.itemNum
            smaObj.craftPrice = irefs.price
            smaObj.remark = irefs.remark
            sendAder.push(smaObj)
          })
          let adata = {
            id: this.saveFirstSuccessId,
            quoteCraftVoList: sendAder
          }
          adata.otherCraftFee = this.$refs.commonTableFour.allorMount
          adata.craftType = '2'
          this.$request.post('/quote/updateQuoteCrafts', adata).then(response => {
            if (response.code == 0) {
              this.$message.success('其他保存成功')
              // 设置当前stepNumFlag位置，并执行当前点击页面要调用的接口
              this.stepNumFlag = anowNum
              this.nowTabShowFn(anowNum)
            } else {
              this.$message.error(response.message)
            }
          })
        } else if (stepNum == 5) {
          if (this.LastTabChagneFlag == false) {
            this.$message.info('请先提交改动的调整项，在执行操作！')
          } else {
            // 设置当前stepNumFlag位置，并执行当前点击页面要调用的接口
            this.stepNumFlag = anowNum
            this.nowTabShowFn(anowNum)
          }
        }
      }
    },
    nowTabShowFn (anowNum) {
      if (anowNum == 0) {
        this.firstStepDataFn()
      } else if (anowNum == 1) {
        this.twoShowFn()
      } else if (anowNum == 2) {
        this.showQuoteItemFn()
      } else if (anowNum == 3) {
        this.showQuoteCraftsFn()
      } else if (anowNum == 4) {
        this.showQuoteOrtherFn()
      } else if (anowNum == 5) {
        this.doubleDateSix = []
        this.addTabNumber = 0
        this.stepName = '完成'
        let that = this
        this.spinning = true
        // 获取第六步第一个表格说明里面的动态公式
        this.getQueryItemFn()
        setTimeout(function () {
          that.lastPageShowData()
        }, 1000)
        this.showQuoteAdjustFn()
        // 获取折减价的表格数据
        this.getDiscountsDataFn()
      }
    }
  }
}
