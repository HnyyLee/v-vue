<template>
  <div class="distriBute_wrap">
    <div style="margin-bottom: 20px;">
      <a-select style="width: 300px" v-if="identityFlag && (RouterNameFlag[mythat.$route.name] || RouterNameFlag['yet_chooseCustomer'])" v-model="identityCode" placeholder='选择客服人员' allowClear>
        <a-select-option v-for="(opt) in identityList" :key="opt.eid" :value="opt.eid">{{opt.name}}</a-select-option>
      </a-select>

      <a-cascader style="width: 400px; margin-left: 30px;" notFoundContent="暂无搜索数据" :options="cascaderoptions" :showSearch="{cascaderFilter}" @change="onCascaderChange" placeholder="搜索客户姓名、手机号" >
        <div slot="showSearchRender" slot-scope="{inputValue, path}">
          <span>{{changeNameFn(path)}}</span>
        </div>
        <div slot="displayRender" slot-scope="{labels}">
          {{labels.join(' / ')}}
        </div>
      </a-cascader>

      <a-button type="primary" style="margin-left: 20px" @click="cascaderFn">搜索</a-button>
      <a-button style="margin-left: 20px;" @click="refushFn"><a-icon type="sync"/>重置表格条件</a-button>

    </div>
    <a-table :bordered='true' :columns="columns" :scroll="{ x: 2200 }" :dataSource="dataSource" :pagination='false' :locale='locale' :rowKey="(record, index) => index"  @change="handleTableChange">
      <template slot="customerName" slot-scope="text, record">
        <div class="firstBox" :data-num="record.repeatStatus">
          <p>{{text}}</p>
        </div>
      </template>
      <template slot="sourceStr" slot-scope="text, record">
        <a-tooltip placement="top"  v-if="record.source == 2">
          <template slot="title">
            <span>{{text}}</span>
          </template>
          <p style="margin: 0px">{{record.sourceStr.substring(0, 5) + '...'}}</p>
        </a-tooltip>
        <p v-if="record.source !== 2" style="margin: 0px">{{record.sourceStr}}</p>
      </template>
      <span slot="id" slot-scope="record">
        <a-button type="primary" size="small" @click="leaflets(record)" v-if="RouterNameFlag[mythat.$route.name] || RouterNameFlag['yet_CustomerDetail']">查看</a-button>
      </span>
    </a-table>
    <div class="distriBute_wrap_pagnin">
      <a-pagination showSizeChanger :pageSize.sync="pageSize"  @change="pageChange" @showSizeChange="onShowSizeChange" :total="total" v-model="current" style="margin-top: 30px;"/>
    </div>
  </div>
</template>
<script>
import titleArr from './js/index'
import { myPower } from '@/common/utils/power.js'

export default {
  data () {
    return {
      mythat: this,
      columns: [],
      cascaderoptions: [], // 顶部的搜索框数据
      searchKeyword: '', // 顶部得到的值
      searchKeyStatus: '', // 顶部得到的status
      dataSource: [],
      total: 1,
      current: 1,
      pageSize: 10,
      identityFlag: false, // 看看是否客服主管， 默认不是；
      identityCode: undefined, // 选中人员的ID
      identityList: [], // 筛选人员列表（只提供客服主管去筛选客服人员用）
      locale: { emptyText: '暂无数据' }, // 无数据显示文案
      repeatImg: require('@/common/images/repeat.png'),
      FailureImg: require('@/common/images/Failure.png'),
      mypassDataA: '', // 参数对应的数字
      mypassDataB: '', // 正序还是倒叙  ascend：1正序     descend：2倒叙
      myscreenFilterVos: [], // 过滤的数组
    }
  },
  mixins: [myPower],
  created () {
    // 获取1小区/房号、2服务类型、3报单来源、4提单人、5客服
    this.screenStatusOne(1, 'address')
    this.screenStatusOne(2, 'comboTitle')
    this.screenStatusOne(3, 'sourceStr')
    this.screenStatusOne(4, 'submitter')
    this.screenStatusOne(5, 'customerServiceName')
    this.screenStatusOne(6, 'statusName')
    
    this.columns = titleArr
    this.$request.get('/crm/customer/list').then(res => {
      if (res.code === 0) {
        this.identityFlag = res.result.customerManager
        if (res.result.customers) {
          this.identityList = res.result.customers
          let obj = {
            eid: 'qb',
            name: '全部人员'
          }
          this.identityList.unshift(obj)
        }
        this.getInitializationData(this.mypassDataA, this.mypassDataB, this.myscreenFilterVos)
      }
    })
    // 获取顶部搜索框的下拉列表
    this.getListOrderFn()
  },
  watch: {
    identityCode () {
      this.getInitializationData(this.mypassDataA, this.mypassDataB, this.myscreenFilterVos)
    }
  },
  methods: {
    cascaderFn() {
      this.current = 1
      this.getInitializationData(this.mypassDataA, this.mypassDataB, this.myscreenFilterVos)
    },
    // 获取所有过滤集合
    screenStatusOne(typeNum, parameter) {
      this.$request.post('/crm/already/order/screen/list', { screenStatus: typeNum, pageNum: 1, pageSize: 10000 }).then(res => {
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
        if (i == 'address' && filters[i].length !== 0) {
          let sobj = {}
          sobj.status = 1
          sobj.values = filters[i]
          screenFilterVos.push(sobj)
        }
        if (i == 'comboTitle' && filters[i].length !== 0) {
          let sobj = {}
          sobj.status = 2
          sobj.values = filters[i]
          screenFilterVos.push(sobj)
        }
        if (i == 'sourceStr' && filters[i].length !== 0) {
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
        if (i == 'customerServiceName' && filters[i].length !== 0) {
          let sobj = {}
          sobj.status = 5
          sobj.values = filters[i]
          screenFilterVos.push(sobj)
        }
        if (i == 'statusName' && filters[i].length !== 0) {
          let sobj = {}
          sobj.status = 6
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
        this.getInitializationData(this.mypassDataA, this.mypassDataB, this.myscreenFilterVos)
        return
      }
      if (sorter.columnKey == 'customerName' && sorter.order == 'ascend') {
        this.mypassDataA = 1
        this.mypassDataB = 1
      } else if (sorter.columnKey == 'customerName' && sorter.order == 'descend') {
        this.mypassDataA = 1
        this.mypassDataB = 2
      }
      if (sorter.columnKey == 'customerPhone' && sorter.order == 'ascend') {
        this.mypassDataA = 2
        this.mypassDataB = 1
      } else if (sorter.columnKey == 'customerPhone' && sorter.order == 'descend') {
        this.mypassDataA = 2
        this.mypassDataB = 2
      }
      if (sorter.columnKey == 'city' && sorter.order == 'ascend') {
        this.mypassDataA = 4
        this.mypassDataB = 1
      } else if (sorter.columnKey == 'city' && sorter.order == 'descend') {
        this.mypassDataA = 4
        this.mypassDataB = 2
      }
      if (sorter.columnKey == 'address' && sorter.order == 'ascend') {
        this.mypassDataA = 8
        this.mypassDataB = 1
      } else if (sorter.columnKey == 'address' && sorter.order == 'descend') {
        this.mypassDataA = 8
        this.mypassDataB = 2
      }
      if (sorter.columnKey == 'comboTitle' && sorter.order == 'ascend') {
        this.mypassDataA = 9
        this.mypassDataB = 1
      } else if (sorter.columnKey == 'comboTitle' && sorter.order == 'descend') {
        this.mypassDataA = 9
        this.mypassDataB = 2
      }
      if (sorter.columnKey == 'submitter' && sorter.order == 'ascend') {
        this.mypassDataA = 10
        this.mypassDataB = 1
      } else if (sorter.columnKey == 'submitter' && sorter.order == 'descend') {
        this.mypassDataA = 10
        this.mypassDataB = 2
      }
      if (sorter.columnKey == 'declarationTime' && sorter.order == 'ascend') {
        this.mypassDataA = 11
        this.mypassDataB = 1
      } else if (sorter.columnKey == 'declarationTime' && sorter.order == 'descend') {
        this.mypassDataA = 11
        this.mypassDataB = 2
      }
      if (sorter.columnKey == 'customerServiceName' && sorter.order == 'ascend') {
        this.mypassDataA = 12
        this.mypassDataB = 1
      } else if (sorter.columnKey == 'customerServiceName' && sorter.order == 'descend') {
        this.mypassDataA = 12
        this.mypassDataB = 2
      }
      this.getInitializationData(this.mypassDataA, this.mypassDataB, this.myscreenFilterVos)
    },
    getListOrderFn() {
      this.$request.get('/projectWorkOrder/keyword/list?status=' + '1').then(res => {
        if (res.code === 0) {
          this.cascaderoptions = []
          this.cascaderoptions = [{
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
            } else if (item.value == 'designerNames') {
              res.result.designerNames.forEach((pro,index) => {
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
      this.getInitializationData(this.mypassDataA, this.mypassDataB, this.myscreenFilterVos)
    },
    cascaderFilter(inputValue, path) {
      return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1));
    },
    changeNameFn(adata) {
      return adata[0].label + ' / ' + adata[1].label
    },
    getInitializationData (orderKeyword, orderStatus, myscreenFilterVos = []) { // 获取初始化数据的公用方法
      let obj = { // 获取数据的参数
        pageNum: this.current, // 页数
        pageSize: this.pageSize, // 条数
        isCustomerManager: this.identityFlag, // 是否为客服主管
        customers: this.identityList, // 客服主管
        customerEid: this.identityCode !== 'qb' ? this.identityCode : null // 选中的客服
      }
      if (this.searchKeyword){
        obj.keyword = this.searchKeyword
      }
      if (orderKeyword) obj.orderKeyword = orderKeyword
      if (orderStatus) obj.orderStatus = orderStatus
      if (myscreenFilterVos.length !== 0) obj.screenFilterVos = myscreenFilterVos
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
      this.dataSource = [] // 清楚数据
      this.$request.post('crm/already-order', obj).then(res => {
        if (res.code === 0) {
          this.total = res.result.total
          this.current = res.result.pageNum
          this.pageSize = res.result.pageSize
          if (res.result.list) {
            res.result.list.forEach((e, index) => { // 获取到数据后；循环添加keys
              e.key = index + 1
              this.dataSource.push(e)
              if (e.status == 1) {
                e.statusName = '待派单'
              } else if (e.status == 2) {
                e.statusName = '已派单'
              } else if (e.status == 3) {
                e.statusName = '手动关闭'
              } else if (e.status == 4) {
                e.statusName = '定时再联系'
              } else if (e.status == 5) {
                e.statusName = '放弃:需求不符合'
              } else if (e.status == 6) {
                e.statusName = '放弃:外盘'
              } else if (e.status == 7) {
                e.statusName = '放弃:异地客户'
              }
            })

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
    leaflets (e) {
      sessionStorage.setItem('orderValue', JSON.stringify(e))
      this.$router.push({ path: '/DispatchOperation', query: { id: e.id, pageSouce: 'crmypd', spliceFlag: 'noneHeader' } })
    },
    onShowSizeChange (current, pageSize) {
      this.pageSize = pageSize
      this.getInitializationData(this.mypassDataA, this.mypassDataB, this.myscreenFilterVos)
    },
    // 改变页码事件
    pageChange (curr) {
      this.current = curr
      this.getInitializationData(this.mypassDataA, this.mypassDataB, this.myscreenFilterVos)
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
      this.getInitializationData(this.mypassDataA, this.mypassDataB, this.myscreenFilterVos)
    }
  }
}
</script>
<style lang="scss">
.distriBute_wrap{
  .distriBute_wrap_pagnin {
    display: flex;
    justify-content: flex-end;
    margin-top: 30px;
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

.ant-cascader-menu::-webkit-scrollbar{/*滚动条整体样式*/
  width: 10px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 10px;
}
.ant-cascader-menu:hover::-webkit-scrollbar-thumb{
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(168, 168, 168, 0.2);
  -moz-box-shadow: inset 0 0 5px rgba(168, 168, 168, 0.2);
  background: rgba(172, 172, 172, 0.4);
}
.ant-cascader-menu:hover::-webkit-scrollbar-track{/*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(196, 196, 196, 0.185);
  -moz-box-shadow: inset 0 0 5px rgba(196, 196, 196, 0.185);
  border-radius: 0;
  background: rgba(201, 201, 201, 0.4);
}
</style>
