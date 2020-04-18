<template>
  <div class="allot_box">
    <div>
      <div class="allot_box_title">
        <div class="search_left">
          <a-cascader style="width: 400px" notFoundContent="暂无搜索数据" :options="cascaderoptions" :showSearch="{cascaderFilter}" @change="onCascaderChange" placeholder="搜索小区、房号、设计师姓名、客户电话、客户姓名等" >
            <div slot="showSearchRender" slot-scope="{inputValue, path}">
              <span>{{changeNameFn(path)}}</span>
            </div>
            <div slot="displayRender" slot-scope="{labels}">
              {{labels.join(' / ')}}
            </div>
          </a-cascader>
          <!-- <a-input placeholder="搜索小区、房号、设计师姓名、客户电话、客户姓名等" v-model="keywork" @change="getKerwork" style="max-width: 400px"/> -->
          <!-- <a-button class="allot_box_btn" type="primary" @click="submit">查询</a-button> -->
        </div>
        <div class="search_left">
          <span>时间依据：</span>
          <a-select placeholder="请选择时间依据"  style="width: 150px;" allowClear  @change="dateSelectChange">
            <a-select-option v-for="(sel, index) in dateSelectArr" :key="index" :value="sel.timeType" >{{sel.timeTypeName}}</a-select-option>
          </a-select>
          <span style="margin-left: 20px;">开始时间：</span>
          <a-date-picker @change="startTimeFn" v-model="startData" :disabledDate="disabledStartDate" :disabled="isChangePiceFlag" />
          <span style="margin-left: 20px;">结束时间：</span>
          <a-date-picker v-model="endData" @change="endTimeFn" :disabledDate="disabledEndDate" :disabled="isChangePiceFlag" />
          <a-button class="dataSerachBtn" style="margin-left: 20px;" type="primary" @click="submit" v-if="RouterNameFlag[mythat.$route.name] || RouterNameFlag['allotalready_search']">搜索</a-button>
          <a-button style="margin-left: 20px;" @click="refushFn"><a-icon type="sync"/>重置表格条件</a-button>
        </div>
      </div>
      <div class="select_box" v-show="roteType">
        <div class="select_content_status">
          <span class="label">工单状态</span>
          <a-checkbox-group v-model="workOrderStatus" @change="onChange">
            <a-checkbox v-for="item in statusArr" :key="item.id" :value="item.status">{{item.statusName}}</a-checkbox>
          </a-checkbox-group>
        </div>
        <div class="select_content_status">
          <span class="label">跟进标签</span>
          <a-checkbox-group v-model="workOrderTag" @change="onChangeTwo">
            <a-checkbox v-for="item in tagArr" :key="item.id" :value="item.tag">{{item.tagName}}</a-checkbox>
          </a-checkbox-group>
        </div>
      </div>
      <a-table :rowKey="(record, index) => index" :columns="columns" :dataSource="tableList" bordered class="tab_box" :scroll="{ x: 4200 }" :pagination='false' :locale='locale' @change="handleTableChange">
        <template slot="code" slot-scope="text,record">
          <div class="firstBox" :data-num="record.repeatStatus">
            <a href="javascript:;" @click="go(record)">{{text}}</a>
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
import dataValue from './js/index.js'
import Api from '@/common/api/api.js'
import { myPower } from '@/common/utils/power.js'
import { myAllot } from './js/allot.js'

export default {
  data () {
    return {
      mythat: this,
      cascaderoptions: [], // 顶部的搜索框数据
      dateSelectArr: [], // 顶部时间依据的数据
      selectDateType: '', // 顶部时间依据的值
      isChangePiceFlag: true, // 是否可以修改时间选择框
      startData: null,
      endData: null,
      startTime: '', // 时间
      endTime: '', // 时间
      searchKeyword: '', // 顶部得到的值
      searchKeyStatus: '', // 顶部得到的status
      roteType: true, // 判断是否点击高级选择
      tableList: [],
      current: 1,
      pageSize: 10,
      locale: { emptyText: '暂无数据' }, // 无数据显示文案
      radioStyle: {
        display: 'inline-block',
        height: '30px',
        lineHeight: '30px'
      },
      total: 1,
      columns: [],
      workOrderStatus: [], // 工单状态
      workOrderTag: [],
      statusArr: [],
      tagArr: [],
      keywork: '',
      repeatImg: require('@/common/images/repeat.png'),
      FailureImg: require('@/common/images/Failure.png'),
      mydataValue: dataValue,
      mypassDataA: '', // 参数对应的数字
      mypassDataB: '', // 正序还是倒叙  ascend：1正序     descend：2倒叙
      myscreenFilterVos: [], // 过滤的数组
    }
  },
  mixins: [myPower, myAllot],
  created () {
    // 1区、2小区、3栋、4报单人员、5客服人员、6状态、7报单来源、8设计师
    this.screenStatusOne(1, 'districtName')
    this.screenStatusOne(2, 'projectName')
    this.screenStatusOne(3, 'buildingName')
    this.screenStatusOne(4, 'submitter')
    this.screenStatusOne(5, 'customerServiceStaffName')
    this.screenStatusOne(6, 'status')
    this.screenStatusOne(7, 'source')
    this.screenStatusOne(8, 'designerName')

    if (this.$route.name == 'allot-already') {
      this.showFlag = true
    } else if (this.$route.name == 'allot_Child') {
      this.showFlag = false
    }
    this.columns = dataValue.tableTitle
    // this.statusArr = dataValue.statusList
    // this.tagArr = dataValue.followList
    Api.getTagList().then(res => {
      if (res.code === 0) {
        this.tagArr = res.result
      }
    })
    Api.getOrderStatus().then(res => {
      if (res.code === 0) {
        this.statusArr = res.result
      }
    })
    this.getDataFun(this.mypassDataA, this.mypassDataB, this.myscreenFilterVos)
    // 获取顶部搜索框的下拉列表
    this.getListOrderFn()
    // 获取顶部选择时间依据数据下拉列表
    this.getListDateSelectFn()
  },
  methods: {
    // 改变时间选择依据下拉框事件
    dateSelectChange(value) {
      this.selectDateType = value
      if (this.selectDateType) {
        this.isChangePiceFlag = false
      } else {
        this.isChangePiceFlag = true
        this.startData = null
        this.endData = null
      }
    },
    // 获取顶部选择时间依据数据下拉列表
    getListDateSelectFn() {
      this.$request.get('/projectWorkOrder/getTimeTypeList').then(res => {
        if (res.code === 0) {
          this.dateSelectArr = res.result
        }
      })
    },
    // 下面为时间组件事件
    startTimeFn(adata, atime) {
      if (atime) {
        this.startTime = atime
      } else {
        this.startTime = ''
        this.getDataFun(this.mypassDataA, this.mypassDataB, this.myscreenFilterVos)
      }
    },
    endTimeFn(adata, atime) {
      if (atime) {
        this.endTime = atime
      } else {
        this.endTime = ''
        this.getDataFun(this.mypassDataA, this.mypassDataB, this.myscreenFilterVos)
      }
    },
    disabledStartDate (startValue) {
      const endValue = this.endData;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf();
    },
    disabledEndDate (endValue) {
      const startValue = this.startData;
      if (!endValue || !startValue) {
        return false;
      }
      return startValue.valueOf() >= endValue.valueOf();
    },
    getListOrderFn() {
      this.$request.get('/projectWorkOrder/keyword/list?status=' + '5').then(res => {
        if (res.code === 0) {
          this.cascaderoptions = []
          this.cascaderoptions = [{
            label: '小区',
            value: 'projects',
          },{
            label: '房号',
            value: 'houses',
          },{
            label: '设计师姓名',
            value: 'designerNames',
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
    getDataFun (orderKeyword, orderStatus, myscreenFilterVos = []) { // 获取列表数据
      let obj = {
        pageNum: this.current, // 页数
        pageSize: this.pageSize, // 条数
        listStatus: this.workOrderStatus, // 状态
        listTag: this.workOrderTag
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
      if (this.selectDateType) {
        obj.timeType = this.selectDateType
      }
      if (this.startTime) {
        obj.startTime = this.startTime
      }
      if (this.endTime) {
        obj.endTime = this.endTime
      }
      if (orderKeyword) obj.orderKeyword = orderKeyword
      if (orderStatus) obj.orderStatus = orderStatus
      if (myscreenFilterVos.length !== 0) obj.screenFilterVos = myscreenFilterVos
      this.tableList = []
      this.$request.post('crm/task/already-order', obj).then(res => {
        if (res.code === 0) {
          if (res.result.list) {
            res.result.list.forEach((item, index) => { // 处理数据；添加key值
              let obj = item
              obj.key = index
              this.tableList.push(obj)
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
          this.total = res.result.total
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 选中工单状态
    onChange () {
      if (this.current !== 1) {
        this.current = 1
      } else {
        this.getDataFun(this.mypassDataA, this.mypassDataB, this.myscreenFilterVos)
      }
    },
    // 选中跟进标签
    onChangeTwo () {
      if (this.current !== 1) {
        this.current = 1
      } else {
        this.getDataFun(this.mypassDataA, this.mypassDataB, this.myscreenFilterVos)
      }
    },
    // tabble 点击转跳
    go (e) {
      sessionStorage.setItem('orderValue', JSON.stringify(e))
      this.$router.push({
        path: '/DispatchOperation', query: { id: e.manageAppointmentId, pageSouce: 'sjsypd', desiId: e.designerId, desiName: e.designerName, gdId: e.id, desRemake: e.remark }
      })
    },
    // 提交数据
    submit () {
      this.current = 1
      this.getDataFun(this.mypassDataA, this.mypassDataB, this.myscreenFilterVos)
    },
    // 是否显示高级选择
    seletFun () {
      this.roteType = !this.roteType
    },
    onShowSizeChange (current, pageSize) {
      this.pageSize = pageSize
      this.getDataFun(this.mypassDataA, this.mypassDataB, this.myscreenFilterVos)
    },
    getKerwork (e) { // 获取输入框内容
      this.keywrod = e.data
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
  }
}
</script>
<style lang="scss">
.allot_box {
  .allot_box_title{
    width: 100%;
    .search_left{
      display: inline-block;
      margin: 15px 25px 0px 0px;
      .dataSerachBtn{
        background: #85CE61;
        border: 1px solid #85CE61;
      }
    }
  }
  &_btn {
    margin-left: 5px
  }
  &_title {
    position: relative;
    &_select {
      cursor: pointer;
      display: inline-block;
      margin-left: 20px;
      line-height: 100%;
      .title_select_rote {
        display: inline-block;
        transition-duration: 1s
      }
      .rote {
        transform: rotateZ(180deg)
      }
    }
  }
  .tab_box {
    margin-top: 10px
  }
  .select_box {
    margin-top: 20px;
    .select_content_status {
      display: flex;
      .label {
        margin-right: 20px;
      }
    }
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
.ant-checkbox-group {
  .ant-checkbox-wrapper {
    min-width: 100px;
  }
}
.ant-cascader-menus.ant-cascader-menus-placement-bottomLeft{
  .ant-cascader-menu{
    width: 250px;
    height: 300px;
  }
}
</style>
