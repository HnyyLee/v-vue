<!---->
<template>
  <div class="DistributeLeaflets">
    <div class="btn_Group">
      <a-button class="btn_refshow" v-if="RouterNameFlag[mythat.$route.name] || RouterNameFlag['Leaflets_refresh']"  @click="refresh"><a-icon type="reload"/>刷新</a-button>
      <a-button class="btn_task" type="primary" @click="getTaskFun" :disabled='taskTotal == 0' v-if="paidanBtnFlag && (RouterNameFlag[mythat.$route.name] || RouterNameFlag['Leaflets_task'])">({{taskTotal}})可领取任务</a-button>
      <a-select style="width: 200px;margin-left: 30px;" v-if="identityFlag && (RouterNameFlag[mythat.$route.name] || RouterNameFlag['Leaflets_chooseCustomer'])" v-model="identityCode" placeholder='选择客服人员' allowClear>
        <a-select-option v-for="(opt) in identityList" :key="opt.eid" :value="opt.eid">{{opt.name}}</a-select-option>
      </a-select>
      <a-button style="margin-left: 20px;" @click="refushFn"><a-icon type="sync"/>重置表格条件</a-button>
      <a-button class="btn_add" type="primary" @click="showModal" v-if="RouterNameFlag[mythat.$route.name] || RouterNameFlag['Leaflets_addCustomer']"><a-icon type="plus" />新增客户</a-button>
    </div>
    <div class="table_Dom">
      <div style="margin-bottom: 16px"></div>
      <a-table :bordered='true' :columns="columns" :scroll="{ x: 2200 }" :dataSource="dataSource" :pagination='false' :loading='loading' :locale='locale' @change="handleTableChange">
        <template slot="customerName" slot-scope="text, record">
          <div class="firstBox" :data-num="record.repeatStatus">
            <p>{{text}} </p>
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
          <a-button type="primary" size="small" @click="leaflets(record)" v-if="RouterNameFlag[mythat.$route.name] || RouterNameFlag['Leaflets_tablewait']">派单</a-button>
          <a-divider type="vertical" v-if="RouterNameFlag['Leaflets_tablewait'] && RouterNameFlag['Leaflets_close']" />
          <a-button type="primary" size="small" class="close" @click="closOrder(record)"
          v-if="RouterNameFlag[mythat.$route.name] || RouterNameFlag['Leaflets_close']">
            关闭
          </a-button>
        </span>
      </a-table>
    </div>
    <div class="DistributeLeaflets_pagnin">
      <a-pagination showSizeChanger :pageSize.sync="pageSize" @change="mypagechange" @showSizeChange="onShowSizeChange" :total="total" v-model="current" style="margin-top: 30px;"/>
    </div>
    <!-- 修改；重新自定义modal弹窗样式 -->
    <a-modal
      :title="textMapTitle"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      okText='确定'
      cancelText='取消'
      width="70%"
      :maskClosable='false'
      :okButtonProps="{ props: { loading: okBtnLoading } }">
      <a-form :form="form" >
        <a-row :gutter="24">
          <a-col span='12'>
            <a-form-item v-bind="formItemLayout" label="客户姓名">
              <a-input v-decorator="verify.peopleName" placeholder="请输入姓名" />
            </a-form-item>
          </a-col>
          <a-col span='12'>
            <a-form-item v-bind="formItemLayout" label="手机号码">
              <a-input v-decorator="verify.phoneNumber" placeholder="请输入手机号码" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col span='12'>
            <a-form-item v-bind="formItemLayout" label="省份">
              <a-select v-decorator="verify.province" placeholder="请选择省份" showSearch optionFilterProp='children'
              @change="getCityList" :notFoundContent='notFoundObj.provinceNot' style="width: 100%" >
                <a-select-option v-for="(opt) in ProvinceList" :key="opt.name" :value="opt.code">{{opt.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col span='12'>
            <a-form-item v-bind="formItemLayout" label="城市">
              <a-select v-decorator="verify.city" placeholder="请选择城市" showSearch optionFilterProp='children'
              @change="getAreaList1" :notFoundContent='notFoundObj.cityNot' style="width: 100%" >
                <a-select-option v-for="(opt) in cityList" :key="opt.name" :value="opt.code">{{opt.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col span='12'>
            <a-form-item v-bind="formItemLayout" label="区">
              <a-select v-decorator="verify.area" placeholder="请选择区" showSearch optionFilterProp='children'
              @change="getAddValue" :notFoundContent='notFoundObj.areaNot' style="width: 100%" >
                <a-select-option v-for="(opt) in areaList" :key="opt.name" :value="opt.code">{{opt.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col span='12'>
            <a-form-item v-bind="formItemLayout" label="地址类型">
              <a-radio-group v-model="address" @change="aRadioChangFn">
                <a-radio :value='1'>自定义地址</a-radio>
                <a-radio :value='2'>非自定地址</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col span='12'>
            <a-form-item v-bind="formItemLayout" label="小区">
              <a-select v-decorator="verify.residential" placeholder="请选择小区" showSearch optionFilterProp='children'
              :notFoundContent='notFoundObj.residentialNot' @change="getBuildingList" style="width: 100%" v-if="address == 2" >
                <a-select-option v-for="(opt) in residentialList" :key="opt.name" :value="opt.code">{{opt.name}}</a-select-option>
              </a-select>
              <a-input v-decorator="verify.residenInput" placeholder="请输入小区名" v-if="address == 1"></a-input>
            </a-form-item>
          </a-col>
          <a-col span='12'>
            <a-form-item v-bind="formItemLayout" label="楼栋">
              <a-select v-decorator="verify.ridgepole" placeholder="请选择楼栋" showSearch optionFilterProp='children'
              @change="getRoomNumber" :notFoundContent='notFoundObj.buildinhNot' style="width: 100%" v-if="address == 2" >
                <a-select-option v-for="(opt) in buildinhList" :key="opt.name" :value="opt.code">{{opt.name}}</a-select-option>
              </a-select>
              <a-input v-decorator="verify.ridgepInput" placeholder="请输入楼栋名" v-if="address == 1"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col span='12'>
            <a-form-item v-bind="formItemLayout" label="房号">
              <a-select v-decorator="verify.room" placeholder="请选择房号" showSearch optionFilterProp='children'
              :notFoundContent='notFoundObj.roomNot' @change="getValue" style="width: 100%" v-if="address == 2" >
                <a-select-option v-for="(opt) in roomList" :key="opt.name" :value="opt.code">{{opt.name}}</a-select-option>
              </a-select>
              <a-input v-decorator="verify.roomInput" placeholder="请输入房号" v-if="address == 1"></a-input>
            </a-form-item>
          </a-col>
          <a-col span='12'>
            <a-form-item v-bind="formItemLayout" label="报单来源">
              <a-select v-decorator="verify.source" placeholder="请选择报单来源" :notFoundContent='notFoundObj.sourceNot' @change="getSourceItem" style="width: 100%" >
                <a-select-option v-for="(opt) in sourceList" :key="opt.name" :value="opt.id">{{opt.title}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col span='12'>
            <a-form-item v-bind="formItemLayout" label="报单人" class="baodanDom">
              <a-input v-decorator="verify.personnel" placeholder="请输入报单人"  /> 
              <!-- <a-input v-decorator="verify.personnel" placeholder="请输入报单人手机号码" style="width: 70%;margin-right: 10px;" /> -->
              <!-- <a-button @click="searching" type='primary'>检索</a-button> -->
              <!-- <div v-if="selectSubmit">
                <span v-if="submitterFlag">已选择报单人：{{submitterInfo.name}}</span>
                <span v-if="submitterFlag === false">暂无任何报单人</span>
              </div> -->
            </a-form-item>
          </a-col>
          <a-col span='12'>
            <a-form-item v-bind="formItemLayout" label="装修意向">
              <a-select v-decorator="verify.decorate" mode="multiple" placeholder="请选择装修意向" @change="getdecoarateFun" @focus='getDeoMess'
              :notFoundContent='notFoundObj.decorateNot' style="width: 100%" >
                <a-select-option v-for="(opt) in decorateList" :key="opt.title" :value="opt.id">{{opt.title}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col span='12'>
            <a-form-item v-bind="formItemLayout" label="面积">
              <a-input v-decorator="verify.floorspaceNumber" placeholder="请输入面积" />
            </a-form-item>
          </a-col>
          <a-col span='12'>
            <a-form-item v-bind="formItemLayout" label="户型" class="baodanDom">
              <a-row :gutter='24'>
                <a-col span='6'>
                  <a-select v-decorator="verify.bedroomNumber" placeholder="请选择房间数量" style="width: 85%" >
                    <a-select-option v-for="(opt) in numberList" :key="opt" :value="opt">{{opt}} </a-select-option>
                  </a-select>房
                </a-col>
                <a-col span='6'>
                  <a-select v-decorator="verify.livingNumber" placeholder="请选择厅数量" style="width: 85%" >
                    <a-select-option v-for="(opt) in numberList" :key="opt" :value="opt">{{opt}} </a-select-option>
                  </a-select>厅
                </a-col>
                <a-col span='6'>
                  <a-select v-decorator="verify.kitchensNumber" placeholder="请选择厨房数量" style="width: 85%" >
                    <a-select-option v-for="(opt) in numberList" :key="opt" :value="opt">{{opt}} </a-select-option>
                  </a-select>厨
                </a-col>
                <a-col span='6'>
                  <a-select v-decorator="verify.bathroomsNumber" placeholder="请选择卫生间数量" style="width: 85%" >
                    <a-select-option v-for="(opt) in numberList" :key="opt" :value="opt">{{opt}} </a-select-option>
                  </a-select>卫
                </a-col>
              </a-row>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <a-modal
      title="关闭派单"
      :visible="clos"
      @ok="handleClos"
      @cancel="handleCancel"
      okText='确定'
      cancelText='取消'
      :maskClosable='false'>
      <p>是否关闭派单</p>
    </a-modal>
    <!-- <common-modal ref="commonModalDom" :dialogData="dialogData" :textMapTitle="textMapTitle"/> -->
  </div>
</template>

<script>
import { myPower } from '@/common/utils/power.js'
// import CommonModal from '@/components/CommonModal'
import Api from '@/common/api/api.js'
import verify from '@/common/validate'
import titleArr from './js/index'
import arrList from './js/list'
import { constants } from 'crypto'
export default {
  data () {
    return {
      mythat: this,
      dataSource: [],
      columns: [],
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      textMapTitle: '新增客户',
      visible: false,
      confirmLoading: false,
      verify, // 表单检验规则
      // 列表数据
      ProvinceList: [], // 省份列表
      cityList: [], // 城市列表
      areaList: [], // 城市区域列表
      residentialList: [], // 小区列表
      buildinhList: [], // 楼栋列表
      roomList: [], // 房号列表
      decorateList: [], // 装修意向列表
      sourceList: [], // 报单来源列表
      // 新增临时存储变量
      provinceCode: {}, // 临时存储选中省份数据
      temporaryCityCode: '', // 临时城市编码；用于获取小区接口数据
      districtCode: {}, // 临时区信息
      housingCode: {}, // 临时小区编号；用户获取栋信息
      buildinCode: {}, // 临时楼栋编号
      roomCode: {}, // 临时房号编号
      sourceCode: {}, // 临时存储报单来源信息
      submitterInfo: {}, // 报单人信息
      selectSubmit: false, // 是否有去检验报单人
      // 表单
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 20 }
        }
      },
      taskTotal: 0, // 总数
      clos: false, // 关闭弹窗
      closItem: '', // 关闭派单临时数据
      submitterFlag: false, // 看看是否存在报单人 false 为不存在
      locale: { emptyText: '暂无数据' }, // 无数据显示文案
      notFoundObj: {
        provinceNot: '暂无任何数据', // 省份
        cityNot: '暂无任何数据', // 城市
        areaNot: '暂无任何数据', // 区
        residentialNot: '暂无任何数据', // 小区
        buildinhNot: '暂无任何数据', // 楼栋
        roomNot: '暂无任何数据', // 房号
        decorateNot: '暂无任何数据', // 装修意向
        sourceNot: '暂无任何数据' // 来源
      },
      current: 1, // 页数
      pageSize: 10, // 条数
      btnFlag: false, // 是否允许请求接口
      total: 0, // 总数
      identityFlag: false, // 看看是否客服主管， 默认不是；
      identityCode: undefined, // 选中人员的ID
      identityList: [], // 筛选人员列表（只提供客服主管去筛选客服人员用）
      numberList: ['0', '1', '2', '3', '4', '5', '6'],
      address: 2, // 是否为自定义地址， 1为是，2为否
      okBtnLoading: false, // 新增客户弹框的提交按钮
      paidanBtnFlag: true, // 是否显示可领取任务按钮
      repeatImg: require('@/common/images/repeat.png'),
      FailureImg: require('@/common/images/Failure.png'),
      mypassDataA: '', // 参数对应的数字
      mypassDataB: '', // 正序还是倒叙  ascend：1正序     descend：2倒叙
      myscreenFilterVos: [], // 过滤的数组
    }
  },
  mixins: [myPower],
  components: {
    // CommonModal
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  watch: {
    identityCode () {
      this.getInitializationData(this.mypassDataA, this.mypassDataB, this.myscreenFilterVos)
    }
  },
  created () {
    // 获取1小区/房号、2服务类型、3报单来源、4提单人、5客服
    this.screenStatusOne(1, 'address')
    this.screenStatusOne(2, 'comboTitle')
    this.screenStatusOne(3, 'sourceStr')
    this.screenStatusOne(4, 'submitter')
    this.screenStatusOne(5, 'customerServiceName')

    this.columns = titleArr // 标题数组
    // this.verify = verify // 检验规则
    Api.getSouceList().then(res => {
      if (res.code === 0) {
        this.sourceList = res.result
      }
    })
    this.$request.get('/crm/customer/list').then(res => {
      if (res.code === 0) {
        this.identityFlag = res.result.customerManager
        this.paidanBtnFlag = res.result.show
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
    this.getTaskNumber()
  },
  mounted () {
  },
  methods: {
    // 页码改变事件
    mypagechange(ev) {
      this.current = ev
      this.getInitializationData(this.mypassDataA, this.mypassDataB, this.myscreenFilterVos)
    },
    // 弹框单选按钮——自定义和非自定义选择改变事件
    aRadioChangFn (ev) {
      this.buildinCode = {}
      this.housingCode = {}
      this.roomCode = {}
    },
    onShowSizeChange (current, pageSize) {
      this.pageSize = pageSize
      this.getInitializationData(this.mypassDataA, this.mypassDataB, this.myscreenFilterVos)
    },
    getDeoMess () {
      let col = this.form.getFieldValue('city')
      if (!col) {
        this.$message.warning('请先选择城市')
        return
      }
      if (this.decorateList.length === 0) {
        this.$message.warning('暂无数据,需在小程序管理后台配置装修意向的类型')
      }
    },
    refresh () { // 刷新
      this.getInitializationData(this.mypassDataA, this.mypassDataB, this.myscreenFilterVos)
      this.getTaskNumber()
    },
    // 获取所有过滤集合
    screenStatusOne(typeNum, parameter) {
      this.$request.post('/crm/wait/order/screen/list', { screenStatus: typeNum, pageNum: 1, pageSize: 10000 }).then(res => {
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
    // 刷新页面的方法
    getInitializationData (orderKeyword, orderStatus, myscreenFilterVos = []) { // 获取初始化数据的公用方法
      let obj = { // 获取数据的参数
        pageNum: this.current, // 页数
        pageSize: this.pageSize, // 条数
        isCustomerManager: this.identityFlag, // 是否为客服主管
        customers: this.identityList, // 客服主管
        customerEid: this.identityCode !== 'qb' ? this.identityCode : null // 选中的客服
      }
      if (orderKeyword) obj.orderKeyword = orderKeyword
      if (orderStatus) obj.orderStatus = orderStatus
      if (myscreenFilterVos.length !== 0) obj.screenFilterVos = myscreenFilterVos
      // this.loading = true
      // this.dataSource = []
      this.$request.post('/crm/wait-order', obj).then(res => {
        if (res.code === 0) {
          this.dataSource = []
          if (res.result.list) {
            res.result.list.forEach((e, index) => { // 获取到数据后；循环添加keys
              e.key = index + 1
              this.dataSource.push(e)
            })
          }
          this.total = res.result.total
          // this.loading = false
          this.$nextTick(function() {
            let adon = document.querySelectorAll('.firstBox')
            adon.forEach(idon => {
              if (idon.dataset.num == 1) {
                idon.parentNode.style = 'background: url('+ this.repeatImg +') no-repeat #fff left top; background-size: 60px 60px;;'
              } else if (idon.dataset.num == 0) {
                idon.parentNode.style = 'background: url('+ this.FailureImg +') no-repeat #fff left top; background-size: 60px 60px;;'
              } else {
                idon.parentNode.style = 'background: #fff'
              }
            })
          })
        }
      })
    },
    getTaskFun () { // 领取任务
      this.$request.get('crm/reserve').then(res => {
        if (res.code === 0) {
          this.$message.success('领取成功')
          this.getInitializationData(this.mypassDataA, this.mypassDataB, this.myscreenFilterVos)
          this.getTaskNumber()
        }
      })
    },
    showModal () {
      this.visible = true
      // 厅房厨卫默认都为0
      this.verify.livingNumber[1].initialValue = '0'
      this.verify.bedroomNumber[1].initialValue = '0'
      this.verify.kitchensNumber[1].initialValue = '0'
      this.verify.bathroomsNumber[1].initialValue = '0'
      this.form.resetFields()
      if (this.ProvinceList.length === 0) {
        this.getProvinceList()
      }
    },
    leaflets (event) { // 派单转跳
      this.$router.push({ path: '/DispatchOperation', query: { id: event.id, pageSouce: 'crmdpd', spliceFlag: 'noneHeader' } })
    },
    handleOk (e) { // 弹窗确认按钮事件触发
      this.handleSubmit(e)
    },
    handleCancel () { // 弹窗取消按钮事件触发
      this.form.resetFields()
      this.visible = false
      this.clos = false
      this.okBtnLoading = false
    },
    getProvinceList () { // 获取省份了表数据
      Api.getProvinceList().then(res => {
        this.notFoundObj.provinceNot = '加载中...'
        if (res.code === 0) {
          this.ProvinceList = res.result
          this.notFoundObj.provinceNot = '暂无任何数据'
        }
      })
    },
    getCityList (e) { // 获取城市列表接口
      this.provinceCode = this.forListObj(e, this.ProvinceList) // 选出出选中当前的省份
      this.cityList = []
      Api.getCityList(e).then(res => { // 城市列表
        this.notFoundObj.cityNot = '加载中...'
        if (res.code === 0) {
          this.cityList = res.result
          this.notFoundObj.cityNot = '暂无任何数据'
        }
      })
      this.form.resetFields(['city', 'area', 'residential', 'ridgepole', 'room'])
    },
    getAreaList1 (e) { // 获取城市区域列表数据
      this.temporaryCityCode = this.forListObj(e, this.cityList) // 取出当前的选中的城市
      this.areaList = []
      this.residentialList = []
      this.buildinhList = []
      this.roomList = []
      this.getDecorate(e) // 获取装修意向
      this.getResidentialList() // 获取城市小区信息
      Api.getAreaList(e).then(res => { // 获取城市区域信息
        this.notFoundObj.areaNot = '加载中...'
        if (res.code === 0) {
          this.areaList = res.result
          this.notFoundObj.areaNot = '暂无任何数据'
        }
      })
      this.form.resetFields(['area', 'residential', 'ridgepole', 'room', 'decorate'])
    },
    getAddValue (e) {
      this.districtCode = this.forListObj(e, this.areaList)
    },
    getResidentialList () { // 获取小区列表数据
      Api.getResidentialList(this.temporaryCityCode.code).then(res => {
        this.notFoundObj.residentialNot = '加载中'
        if (res.code === 0) {
          this.residentialList = res.result
          this.notFoundObj.residentialNot = '暂无任何数据'
        }
      })
    },
    getBuildingList (e) { // 获取楼栋信息
      this.housingCode = this.forListObj(e, this.residentialList) // 取出当前的选中小区信息
      this.buildinhList = []
      this.roomList = []
      Api.getBuildingList(this.housingCode.code).then(res => {
        this.notFoundObj.buildinhNot = '加载中...'
        if (res.code === 0) {
          this.buildinhList = res.result
          this.notFoundObj.buildinhNot = '暂无任何数据'
        }
      })
      this.form.resetFields(['ridgepole', 'room'])
    },
    getRoomNumber (e) { // 获取当前房号信息
      this.buildinCode = this.forListObj(e, this.buildinhList) // 取出当前选中楼栋信息
      this.roomList = []
      Api.getRoomNumber(this.buildinCode.code).then(res => {
        this.notFoundObj.roomNot = '加载中...'
        if (res.code === 0) {
          this.roomList = res.result
          this.notFoundObj.roomNot = '暂无任何数据'
        }
      })
    },
    getValue (e) { // 取出当前选中的房号信息
      this.roomCode = this.forListObj(e, this.roomList)
    },
    getDecorate (id) { // 获取装修意向列表数据
      this.decorateList = []
      this.$request.get('/crm/combo/' + id).then(res => {
        this.notFoundObj.decorateNot = '加载中...'
        if (res.code === 0) {
          this.decorateList = res.result
          this.notFoundObj.decorateNot = '暂无任何数据'
        }
      })
    },
    getdecoarateFun (e) { // 选中的装修意向信息
    },
    handleSubmit (e) { // 点击确定；提交所有数据
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.okBtnLoading = true
          if (!values.livingNumber || !values.bedroomNumber || !values.kitchensNumber || !values.bathroomsNumber) {
            this.$message.error('请先完整选择户型!')
          } else {
            let obj = {
              // 含code 都是对象；而不是单个code的number或者string
              province: this.provinceCode, // 省份
              city: this.temporaryCityCode, // 城市
              district: this.districtCode, // 区信息
              project: this.housingCode, // 小区
              building: this.buildinCode, // 楼栋
              house: this.roomCode, // 房号
              comboIds: values.decorate, // 装修意向
              userName: values.peopleName, // 客户名字
              source: this.sourceCode.id, // 报单来源
              phone: values.phoneNumber, // 手机号码
              categoryType: this.address, // 地址类型
              submitter: values.personnel, // 报单人
              // submitter: this.submitterFlag === true ? this.submitterInfo.name : null, // 报单人
              // submitterId: this.submitterFlag === true ? this.submitterInfo.id : null, // 报单人ID
              floorspaceNumber: values.floorspaceNumber, // 面积
              livingNumber: values.livingNumber, // 厅数
              bedroomNumber: values.bedroomNumber, // 房数
              kitchensNumber: values.kitchensNumber, // 厨房数
              bathroomsNumber: values.bathroomsNumber // 卫生间数
            }
            if (this.address === 1) { // 小区房号楼栋信息处理；判断自定义还是为非自定义1自定义 2为不是自定义
              obj.building = { name: values.ridgepInput } // 楼栋
              obj.project = { name: values.residenInput } // 小区
              obj.house = { name: values.roomInput } // 房号
            } else {
              obj.project = this.housingCode // 小区
              obj.building = this.buildinCode // 楼栋
              obj.house = this.roomCode // 房号
            }
            if (this.btnFlag === false) {
              this.btnFlag = true
              this.$request.post('crm/appointment', obj).then(res => {
                if (res.code === 0) {
                  this.okBtnLoading = false
                  this.btnFlag = false
                  this.$message.success('新增成功')
                  this.visible = false
                  this.getInitializationData(this.mypassDataA, this.mypassDataB, this.myscreenFilterVos)
                  this.getTaskNumber()
                }
              }).catch(err => {
                this.okBtnLoading = false
                this.btnFlag = false
              })
            }
          }
        }
      })
    },
    getSourceItem (e) { // 去到到报单来选信息
      this.sourceCode = this.sourceList.find(item => item.id === e)
    },
    forListObj (item, arr) { // 选中对象信息取出的公用方法
      let str = {}
      for (let i = 0; i < arr.length; i++) {
        if (item === arr[i].code) {
          str = arr[i]
          break
        }
      }
      return str
    },
    getTaskNumber () { // 获取可领取任务的数量
      this.$request.get('crm/reserve-count').then(res => {
        if (res.code === 0) {
          this.taskTotal = res.result
        }
      })
    },
    getTask () { // 领取任务
      this.$request.get('/crm/reserve').then(res => {
        if (res.code === 0) {
          this.$message.success('领取成功')
        } else {
          this.$message.error('领取失败')
        }
      })
    },
    closOrder (itme) { // 点击关闭派单
      this.clos = true
      this.closItem = itme.id
    },
    handleClos () {
      this.$request.get('crm/wait-order/close/' + this.closItem).then(res => {
        if (res.code === 0) {
          this.clos = false
          this.$message.success('关闭成功')
          this.getInitializationData(this.mypassDataA, this.mypassDataB, this.myscreenFilterVos)
        }
      })
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
    // searching () { // 检索
    //   let phone = this.form.getFieldsValue(['personnel'])
    //   if (phone.personnel.length !== 11) {
    //     this.$message.error('输入正确的手机号码')
    //     return
    //   }
    //   this.selectSubmit = true
    //   this.$request.get('crm/user/submitter/' + phone.personnel).then(res => {
    //     if (res.code === 0) {
    //       if (res.result.length !== 0) {
    //         this.submitterFlag = true
    //         this.$message.success('报单人检验成功')
    //         this.submitterInfo = res.result[0]
    //       } else {
    //         this.submitterFlag = false
    //         this.$message.error('报单人检索不到任何相关人员')
    //       }
    //     }
    //   })
    // },
  }
}
</script>

<style lang="scss" >
  .DistributeLeaflets {
    padding: 10px;
    &_pagnin {
      display: flex;
      justify-content: flex-end;
    }
    .btn_Group{
      .btn_refshow{
         margin-right: 30px;
      }
      .btn_add{
        background: #85CE61;
        border: 1px solid #85CE61;
        position: absolute;
        right: 30px;
      }
    }
    .table_Dom{
      .close{
        background: #FF5024;
        border: 1px solid #FF5024;
        margin-left: 5px;
      }
    }
    .firstBox{
      text-align: center;
      p{
        margin: 0px;
      }
    }
  }
</style>
