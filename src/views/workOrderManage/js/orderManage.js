
export var myorderManage = {
  data () {
    return {
      
    }
  },
  created: function () {
    
  },
  computed: {
    
  },
  methods: {
    // 获取所有过滤集合
    screenStatusOne(typeNum, parameter) {
      this.$request.post('/crm/work/order/screen/list', { screenStatus: typeNum, pageNum: 1, pageSize: 10000 }).then(res => {
        if (res.code === 0) {
          let anewArr = []
          res.result.list.forEach(iden => {
            let aobj = {}
            aobj.text = iden.title
            aobj.value = iden.key
            anewArr.push(aobj)
          })
          this.mydataValue.tableTitle.forEach(item => {
            if (item.dataIndex == parameter) {
              item.filters = anewArr
              item.filteredValue = []
            }
          })
          this.columns = this.mydataValue.tableTitle // 标题数组
        }
      })
    },
    // 排序方法
    handleTableChange(pagination, filters, sorter) {
      this.current = 1
      let screenFilterVos = []
      for(let i in filters){
        if (i == 'districtName' && filters[i].length !== 0) {
          let sobj = {}
          sobj.status = 1
          sobj.values = filters[i]
          screenFilterVos.push(sobj)
        }
        if (i == 'projectName' && filters[i].length !== 0) {
          let sobj = {}
          sobj.status = 2
          sobj.values = filters[i]
          screenFilterVos.push(sobj)
        }
        if (i == 'buildingName' && filters[i].length !== 0) {
          let sobj = {}
          sobj.status = 3
          sobj.values = filters[i]
          screenFilterVos.push(sobj)
        }
        if (i == 'submitter' && filters[i].length !== 0) {
          let sobj = {}
          sobj.status = 4
          sobj.values = filters[i]
          screenFilterVos.push(sobj)
        }
        if (i == 'customerServiceStaffName' && filters[i].length !== 0) {
          let sobj = {}
          sobj.status = 5
          sobj.values = filters[i]
          screenFilterVos.push(sobj)
        }
        if (i == 'status' && filters[i].length !== 0) {
          let sobj = {}
          sobj.status = 6
          sobj.values = filters[i]
          screenFilterVos.push(sobj)
        }
        if (i == 'source' && filters[i].length !== 0) {
          let sobj = {}
          sobj.status = 7
          sobj.values = filters[i]
          screenFilterVos.push(sobj)
        }
        if (i == 'designerName' && filters[i].length !== 0) {
          let sobj = {}
          sobj.status = 8
          sobj.values = filters[i]
          screenFilterVos.push(sobj)
        }
        this.columns.forEach(aitem => {
          if (aitem.dataIndex == i) {
            aitem.filteredValue = filters[i]
          }
          aitem.sortOrder = false
          if (Object.keys(sorter).length != 0) {
            if (aitem.dataIndex == sorter.columnKey) {
              aitem.sortOrder = sorter.order
            }
          } else {
            aitem.sortOrder = false
          }
        })
      }
      this.myscreenFilterVos = screenFilterVos

      if (Object.keys(sorter).length == 0) {
        this.mypassDataA = ''
        this.mypassDataB = ''
        this.getDataFun(this.mypassDataA, this.mypassDataB, this.myscreenFilterVos)
        return
      }
      if (sorter.columnKey == 'code' && sorter.order == 'ascend') {
        this.mypassDataA = 26
        this.mypassDataB = 1
      } else if (sorter.columnKey == 'code' && sorter.order == 'descend') {
        this.mypassDataA = 26
        this.mypassDataB = 2
      }
      if (sorter.columnKey == 'title' && sorter.order == 'ascend') {
        this.mypassDataA = 27
        this.mypassDataB = 1
      } else if (sorter.columnKey == 'title' && sorter.order == 'descend') {
        this.mypassDataA = 27
        this.mypassDataB = 2
      }
      if (sorter.columnKey == 'customerPhone' && sorter.order == 'ascend') {
        this.mypassDataA = 2
        this.mypassDataB = 1
      } else if (sorter.columnKey == 'customerPhone' && sorter.order == 'descend') {
        this.mypassDataA = 2
        this.mypassDataB = 2
      }
      if (sorter.columnKey == 'provinceName' && sorter.order == 'ascend') {
        this.mypassDataA = 3
        this.mypassDataB = 1
      } else if (sorter.columnKey == 'provinceName' && sorter.order == 'descend') {
        this.mypassDataA = 3
        this.mypassDataB = 2
      }
      if (sorter.columnKey == 'cityName' && sorter.order == 'ascend') {
        this.mypassDataA = 4
        this.mypassDataB = 1
      } else if (sorter.columnKey == 'cityName' && sorter.order == 'descend') {
        this.mypassDataA = 4
        this.mypassDataB = 2
      }
      if (sorter.columnKey == 'districtName' && sorter.order == 'ascend') {
        this.mypassDataA = 5
        this.mypassDataB = 1
      } else if (sorter.columnKey == 'districtName' && sorter.order == 'descend') {
        this.mypassDataA = 5
        this.mypassDataB = 2
      }
      if (sorter.columnKey == 'projectName' && sorter.order == 'ascend') {
        this.mypassDataA = 6
        this.mypassDataB = 1
      } else if (sorter.columnKey == 'projectName' && sorter.order == 'descend') {
        this.mypassDataA = 6
        this.mypassDataB = 2
      }
      if (sorter.columnKey == 'buildingName' && sorter.order == 'ascend') {
        this.mypassDataA = 7
        this.mypassDataB = 1
      } else if (sorter.columnKey == 'buildingName' && sorter.order == 'descend') {
        this.mypassDataA = 7
        this.mypassDataB = 2
      }
      if (sorter.columnKey == 'house' && sorter.order == 'ascend') {
        this.mypassDataA = 8
        this.mypassDataB = 1
      } else if (sorter.columnKey == 'house' && sorter.order == 'descend') {
        this.mypassDataA = 8
        this.mypassDataB = 2
      }
      if (sorter.columnKey == 'declarationTimeStr' && sorter.order == 'ascend') {
        this.mypassDataA = 11
        this.mypassDataB = 1
      } else if (sorter.columnKey == 'declarationTimeStr' && sorter.order == 'descend') {
        this.mypassDataA = 11
        this.mypassDataB = 2
      }
      if (sorter.columnKey == 'receiveTimeStr' && sorter.order == 'ascend') {
        this.mypassDataA = 15
        this.mypassDataB = 1
      } else if (sorter.columnKey == 'receiveTimeStr' && sorter.order == 'descend') {
        this.mypassDataA = 15
        this.mypassDataB = 2
      }
      if (sorter.columnKey == 'dispatchDesignerTime' && sorter.order == 'ascend') {
        this.mypassDataA = 25
        this.mypassDataB = 1
      } else if (sorter.columnKey == 'dispatchDesignerTime' && sorter.order == 'descend') {
        this.mypassDataA = 25
        this.mypassDataB = 2
      }
      if (sorter.columnKey == 'signedTime' && sorter.order == 'ascend') {
        this.mypassDataA = 16
        this.mypassDataB = 1
      } else if (sorter.columnKey == 'signedTime' && sorter.order == 'descend') {
        this.mypassDataA = 16
        this.mypassDataB = 2
      }
      if (sorter.columnKey == 'planStartConstructionTimeStr' && sorter.order == 'ascend') {
        this.mypassDataA = 17
        this.mypassDataB = 1
      } else if (sorter.columnKey == 'planStartConstructionTimeStr' && sorter.order == 'descend') {
        this.mypassDataA = 17
        this.mypassDataB = 2
      }
      if (sorter.columnKey == 'planEndConstructionTimeStr' && sorter.order == 'ascend') {
        this.mypassDataA = 18
        this.mypassDataB = 1
      } else if (sorter.columnKey == 'planEndConstructionTimeStr' && sorter.order == 'descend') {
        this.mypassDataA = 18
        this.mypassDataB = 2
      }
      if (sorter.columnKey == 'realStartConstructionTime' && sorter.order == 'ascend') {
        this.mypassDataA = 19
        this.mypassDataB = 1
      } else if (sorter.columnKey == 'realStartConstructionTime' && sorter.order == 'descend') {
        this.mypassDataA = 19
        this.mypassDataB = 2
      }
      if (sorter.columnKey == 'realEndConstructionTime' && sorter.order == 'ascend') {
        this.mypassDataA = 20
        this.mypassDataB = 1
      } else if (sorter.columnKey == 'realEndConstructionTime' && sorter.order == 'descend') {
        this.mypassDataA = 20
        this.mypassDataB = 2
      }
      if (sorter.columnKey == 'earnestMoney' && sorter.order == 'ascend') {
        this.mypassDataA = 21
        this.mypassDataB = 1
      } else if (sorter.columnKey == 'earnestMoney' && sorter.order == 'descend') {
        this.mypassDataA = 21
        this.mypassDataB = 2
      }
      if (sorter.columnKey == 'signedMoney' && sorter.order == 'ascend') {
        this.mypassDataA = 22
        this.mypassDataB = 1
      } else if (sorter.columnKey == 'signedMoney' && sorter.order == 'descend') {
        this.mypassDataA = 22
        this.mypassDataB = 2
      }
      if (sorter.columnKey == 'paidMoney' && sorter.order == 'ascend') {
        this.mypassDataA = 23
        this.mypassDataB = 1
      } else if (sorter.columnKey == 'paidMoney' && sorter.order == 'descend') {
        this.mypassDataA = 23
        this.mypassDataB = 2
      }
      if (sorter.columnKey == 'remark' && sorter.order == 'ascend') {
        this.mypassDataA = 24
        this.mypassDataB = 1
      } else if (sorter.columnKey == 'remark' && sorter.order == 'descend') {
        this.mypassDataA = 24
        this.mypassDataB = 2
      }
      if (sorter.columnKey == 'submitter' && sorter.order == 'ascend') {
        this.mypassDataA = 10
        this.mypassDataB = 1
      } else if (sorter.columnKey == 'submitter' && sorter.order == 'descend') {
        this.mypassDataA = 10
        this.mypassDataB = 2
      }
      if (sorter.columnKey == 'customerServiceStaffName' && sorter.order == 'ascend') {
        this.mypassDataA = 12
        this.mypassDataB = 1
      } else if (sorter.columnKey == 'customerServiceStaffName' && sorter.order == 'descend') {
        this.mypassDataA = 12
        this.mypassDataB = 2
      }
      if (sorter.columnKey == 'designerName' && sorter.order == 'ascend') {
        this.mypassDataA = 14
        this.mypassDataB = 1
      } else if (sorter.columnKey == 'designerName' && sorter.order == 'descend') {
        this.mypassDataA = 14
        this.mypassDataB = 2
      }
      this.getDataFun(this.mypassDataA, this.mypassDataB, this.myscreenFilterVos)
    },
  }
}
