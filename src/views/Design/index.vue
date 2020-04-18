<template>
  <div class="design_box">
    <div>
      <a-cascader style="width: 400px" notFoundContent="暂无搜索数据" :options="cascaderoptions" :showSearch="{cascaderFilter}" @change="onCascaderChange" placeholder="搜索小区、房号、设计师姓名、客户电话、客户姓名等" >
        <div slot="showSearchRender" slot-scope="{inputValue, path}">
          <span>{{changeNameFn(path)}}</span>
        </div>
        <div slot="displayRender" slot-scope="{labels}">
          {{labels.join(' / ')}}
        </div>
      </a-cascader>
      <a-button class="design_btn" type="primary" @click="submit" v-if="RouterNameFlag[mythat.$route.name] || RouterNameFlag['designallot_search']" >查询</a-button>
      <a-button style="margin-left: 20px;" @click="refushFn"><a-icon type="sync"/>重置表格条件</a-button>

      <a-table :columns="columns" :dataSource="tableList" bordered class="tab_box" :scroll="{ x: 3000 }" :pagination='false' :locale='locale'  @change="handleTableChange">
        <template slot="code" slot-scope="text, record">
          <div class="firstBox" :data-num="record.repeatStatus">
            <a href="javascript:;" @click="goLeaflets(record)">{{text}}</a>
          </div>
        </template>
      </a-table>
    </div>
    <div class="distriBute_wrap_pagnin">
      <a-pagination showSizeChanger :pageSize.sync="pageSize" @change="pageChange" @showSizeChange="onShowSizeChange" :total="total" v-model="current" style="margin-top: 30px;"/>
    </div>
  </div>
</template>
<script>
import { myPower } from '@/common/utils/power.js'
import titleArr from './js/index'

export default {
  data () {
    return {
      mythat: this,
      cascaderoptions: [], // 顶部的搜索框数据
      searchKeyword: '', // 顶部得到的值
      searchKeyStatus: '', // 顶部得到的status
      tableList: [],
      total: 1,
      current: 1,
      pageSize: 10,
      locale: { emptyText: '暂无数据' }, // 无数据显示文案
      columns: [],
      showFlag: true,
      repeatImg: require('@/common/images/repeat.png'),
      FailureImg: require('@/common/images/Failure.png'),
      mypassDataA: '', // 参数对应的数字
      mypassDataB: '', // 正序还是倒叙  ascend：1正序     descend：2倒叙
      myscreenFilterVos: [], // 过滤的数组
    }
  },
  mixins: [myPower],
  created () {
    // 1区、2小区、3栋、4报单人员、5客服人员
    this.screenStatusOne(1, 'districtName')
    this.screenStatusOne(2, 'projectName')
    this.screenStatusOne(3, 'buildingName')
    this.screenStatusOne(4, 'submitter')
    this.screenStatusOne(5, 'customerServiceStaffName')

    this.columns = titleArr // 标题数组
    if (this.$route.name == 'design-allot') {
      this.showFlag = true
    } else if (this.$route.name == 'design-child') {
      this.showFlag = false
    }
    // 获取顶部搜索框的下拉列表
    this.getListOrderFn()
    // 刷新页面接口
    this.getDataFun(this.mypassDataA, this.mypassDataB, this.myscreenFilterVos)
  },
  methods: {
    // 获取所有过滤集合
    screenStatusOne(typeNum, parameter) {
      this.$request.post('/crm/wait/task/screen/list', { screenStatus: typeNum, pageNum: 1, pageSize: 10000 }).then(res => {
        if (res.code === 0) {
          let anewArr = []
          res.result.list.forEach(iden => {
            let aobj = {}
            aobj.text = iden.title
            aobj.value = iden.key
            anewArr.push(aobj)
          })
          titleArr.forEach(item => {
            if (item.dataIndex == parameter) {
              item.filters = anewArr
              item.filteredValue = []
            }
          })
          this.columns = titleArr // 标题数组
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
      this.getDataFun(this.mypassDataA, this.mypassDataB, this.myscreenFilterVos)
    },
    getListOrderFn() {
      this.$request.get('/projectWorkOrder/keyword/list?status=' + '2').then(res => {
        if (res.code === 0) {
          this.cascaderoptions = []
          this.cascaderoptions = [{
            label: '小区',
            value: 'projects',
          },{
            label: '房号',
            value: 'houses',
          },{
            label: '客户电话',
            value: 'customerPhones',
          },{
            label: '客户姓名',
            value: 'customerNames',
          }]
          this.cascaderoptions.forEach(item => {
            item.children = []
            if (item.value == 'projects') {
              res.result.projects.forEach((pro,index) => {
                let aobj = {}
                aobj.label = pro
                aobj.value = index
                item.children.push(aobj)
              })
            } else if (item.value == 'houses') {
              res.result.houses.forEach((pro,index) => {
                let aobj = {}
                aobj.label = pro
                aobj.value = index
                item.children.push(aobj)
              })
            } else if (item.value == 'customerPhones') {
              res.result.customerPhones.forEach((pro,index) => {
                let aobj = {}
                aobj.label = pro
                aobj.value = index
                item.children.push(aobj)
              })
            } else if (item.value == 'customerNames') {
              res.result.customerNames.forEach((pro,index) => {
                let aobj = {}
                aobj.label = pro
                aobj.value = index
                item.children.push(aobj)
              })
            }
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    submit () {
      this.current = 1
      this.getDataFun(this.mypassDataA, this.mypassDataB, this.myscreenFilterVos)
    },
    goLeaflets (e) {
      sessionStorage.setItem('orderValue', JSON.stringify(e))
      this.$router.push({ 
        path: '/DispatchOperation', query: { id: e.manageAppointmentId, pageSouce: 'sjsdpd', gdId: e.id, OrderStatus: e.repeatStatus} 
      })
    },
    getDataFun (orderKeyword, orderStatus, myscreenFilterVos = []) {
      let obj = {
        pageNum: this.current, // 页数
        pageSize: this.pageSize, // 条数
      }
      if (this.searchKeyword){
        obj.keyword = this.searchKeyword
      }
      if (this.searchKeyStatus) {
        let anum = ''
        if (this.searchKeyStatus == 'projects') {
          anum = 3
        } else if (this.searchKeyStatus == 'houses'){
          anum = 4
        } else if (this.searchKeyStatus == 'designerNames'){
          anum = 5
        } else if (this.searchKeyStatus == 'customerPhones'){
          anum = 2
        } else if (this.searchKeyStatus == 'customerNames'){
          anum = 1
        }
        obj.keywordStatus = anum
      }
      if (orderKeyword) obj.orderKeyword = orderKeyword
      if (orderStatus) obj.orderStatus = orderStatus
      if (myscreenFilterVos.length !== 0) obj.screenFilterVos = myscreenFilterVos
      this.$request.post('crm/task/wait-order', obj).then(res => {
        if (res.code === 0) {
          this.tableList = []
          if (res.result.list) {
            res.result.list.forEach((item, index) => { // 处理数据；添加key值
              let obj = item
              obj.key = index
              this.tableList.push(obj)
            })
            this.total = res.result.total

            this.$nextTick(function() {
              let adon = document.querySelectorAll('.firstBox')
              adon.forEach(idon => {
                if (idon.dataset.num == 1) {
                  idon.parentNode.style = 'background: url('+ this.repeatImg +') no-repeat #fff left top; background-size: 60px 60px;'
                } else if (idon.dataset.num == 0) {
                  idon.parentNode.style = 'background: url('+ this.FailureImg +') no-repeat #fff left top; background-size: 60px 60px;'
                }
              })
            })
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    onShowSizeChange (current, pageSize) {
      this.pageSize = pageSize
      this.getDataFun(this.mypassDataA, this.mypassDataB, this.myscreenFilterVos)
    },
    // 下面两个为顶部搜索框事件
    onCascaderChange(value, selectedOptions) {
      if (value.length !== 0 && selectedOptions) {
        this.searchKeyword = selectedOptions[1].label
        this.searchKeyStatus = value[0]
      } else {
        this.searchKeyword = ''
        this.searchKeyStatus = ''
      }
      this.current = 1
      this.getDataFun(this.mypassDataA, this.mypassDataB, this.myscreenFilterVos)
    },
    cascaderFilter(inputValue, path) {
      return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1));
    },
    changeNameFn(adata) {
      return adata[0].label + ' / ' + adata[1].label
    },
    // 改变页码事件
    pageChange (curr) {
      this.current = curr
      this.getDataFun(this.mypassDataA, this.mypassDataB, this.myscreenFilterVos)
    },
    // 重置表格过滤条件
    refushFn() {
      this.columns.forEach(item => {
        item.sortOrder = false
        item.filteredValue = []
      })
      this.$forceUpdate()
      this.mypassDataA = '' 
      this.mypassDataB = ''
      this.myscreenFilterVos = []
      this.getDataFun(this.mypassDataA, this.mypassDataB, this.myscreenFilterVos)
    }
  },
}
</script>
<style lang="scss">
.design_box {
  .design_btn {
    margin-left: 5px;
  }
  .tab_box {
    margin-top: 10px;
  }
  .distriBute_wrap_pagnin {
    display: flex;
    justify-content: flex-end;
  }
  .firstBox{
    text-align: center;
    p{
      margin: 0px;
    }
  }
}

.ant-cascader-menus.ant-cascader-menus-placement-bottomLeft{
  .ant-cascader-menu{
    width: 250px;
    height: 300px;
  }
}
</style>
