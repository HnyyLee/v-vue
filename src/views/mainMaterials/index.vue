<!---->
<template>
  <div class="mainMaterials">
    <common-header :value='budgetPageValue' v-if="this.$route.query.budgetPageFlag" :routerList="routerList"></common-header>
    <common-header :value='infoValue' v-else></common-header>

    <div class="holdPage" v-if="holdFlagPage && haveShow">
      <div class="mainMater_stepDom">
        <a-steps :current="stepNumFlag">
          <a-step title="主材清单" @click="stepClickThinkFn(stepNumFlag, 0)" />
          <a-step title="主材预算" @click="stepClickThinkFn(stepNumFlag, 1)" />
          <a-step title="工程复核" @click="stepClickThinkFn(stepNumFlag, 2)" />
          <a-step title="采购下单" @click="stepClickThinkFn(stepNumFlag, 3)" />
          <a-step title="配送发货" @click="stepClickThinkFn(stepNumFlag, 4)" />
          <a-step title="到货/安装验收" @click="stepClickThinkFn(stepNumFlag, 5)" />
        </a-steps>
      </div>
      
      <div class="mainMater_center">
        <a-form :form='formData' >
          <table border="1" class="comm">
            <tr>
              <th class="table_th">合同号</th>
              <td class="table_td">
                <div class="tit_text" v-if="!editInfoFlag.infoNumber">
                  <p class="infoText">{{holdData.contractNumber}}</p>
                  <span class="info_icon" @click="editInfoFn(1)"><a-icon type="edit" class="targater" /></span>
                </div>
                <div class="tit_concent" v-else>
                  <a-form-item class="aFormItem">
                    <a-input v-decorator="verify.infoNumber" style="width: 110%" @change="inputChagneAllFn(1, $event)" placeholder="请输入合同编号!" :maxlength="50" />
                  </a-form-item>
                  <div class="btn_dom">
                    <p>
                      <a-icon type="check" class="checkDom" @click="sureInfoFn(1)" />
                      <a-icon type="close" class="checkDom" style="margin-top: 3px;" @click="cannalInfoFn(1)" />
                    </p>
                  </div>
                </div>
              </td>
              <th class="table_th">材料选购日期</th>
              <td class="table_td">
                <div class="tit_text" v-if="!editInfoFlag.infoPurchase">
                  <p class="infoText">{{holdData.purchaseNumber}}</p>
                  <span class="info_icon" @click="editInfoFn(2)"><a-icon type="edit" class="targater" /></span>
                </div>
                <div class="tit_concent" v-else>
                  <a-form-item style="margin-bottom: 0; display: inline-block" >
                    <a-date-picker format="YYYY-MM-DD HH:mm:ss" :showTime="{ defaultValue: mymoment('00:00:00', 'HH:mm:ss') }" v-decorator="verify.infoPurchase" @change="onDataPickFn" />
                  </a-form-item>
                  <div class="btn_dom">
                    <p>
                      <a-icon type="check" class="checkDom" @click="sureInfoFn(2)" />
                      <a-icon type="close" class="checkDom" style="margin: 3px 0px 0px 5px;" @click="cannalInfoFn(2)" />
                    </p>
                  </div>
                </div>
              </td>
              <th class="table_th">送货地址</th>
              <td class="table_td" colspan="3">
                <div class="tit_text" v-if="!editInfoFlag.infoAddress">
                  <p class="infoText">{{holdData.addressNumber}}</p>
                  <span class="info_icon" @click="editInfoFn(3)"><a-icon type="edit" class="targater" /></span>
                </div>
                <div class="tit_concent" v-else>
                  <a-form-item class="aFormItem">
                    <a-input v-decorator="verify.infoAddress" style="width: 110%" @change="inputChagneAllFn(2, $event)" placeholder="请输入送货地址!" :maxlength="100" />
                  </a-form-item>
                  <div class="btn_dom">
                    <p>
                      <a-icon type="check" class="checkDom" @click="sureInfoFn(3)" />
                      <a-icon type="close" class="checkDom" style="margin-top: 3px;" @click="cannalInfoFn(3)" />
                    </p>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th class="table_th">客户姓名</th>
              <td class="table_td">
                <div class="tit_text" v-if="!editInfoFlag.infoCustomer">
                  <p class="infoText">{{holdData.customerNumber}}</p>
                  <span class="info_icon" @click="editInfoFn(4)"><a-icon type="edit" class="targater" /></span>
                </div>
                <div class="tit_concent" v-else>
                  <a-form-item class="aFormItem">
                    <a-input v-decorator="verify.infoCustomer" style="width: 110%" @change="inputChagneAllFn(3, $event)" placeholder="请输入客户姓名!" :maxlength="50" />
                  </a-form-item>
                  <div class="btn_dom">
                    <p>
                      <a-icon type="check" class="checkDom" @click="sureInfoFn(4)" />
                      <a-icon type="close" class="checkDom" style="margin-top: 3px;" @click="cannalInfoFn(4)" />
                    </p>
                  </div>
                </div>
              </td>
              <th class="table_th">联系电话</th>
              <td class="table_td">
                <div class="tit_text" v-if="!editInfoFlag.infoPhone">
                  <p class="infoText">{{holdData.phoneNumber}}</p>
                  <span class="info_icon" @click="editInfoFn(5)"><a-icon type="edit" class="targater" /></span>
                </div>
                <div class="tit_concent" v-else>
                  <a-form-item class="aFormItem">
                    <a-input v-decorator="verify.infoPhone" style="width: 110%" @change="inputChagneAllFn(4, $event)" placeholder="请输入联系电话!" :maxlength="50" />
                  </a-form-item>
                  <div class="btn_dom">
                    <p>
                      <a-icon type="check" class="checkDom" @click="sureInfoFn(5)" />
                      <a-icon type="close" class="checkDom" style="margin-top: 3px;" @click="cannalInfoFn(5)" />
                    </p>
                  </div>
                </div>
              </td>
              <th class="table_th">主材跟单员</th>
              <td class="table_td">
                <div class="tit_text" v-if="!editInfoFlag.infoMerchandiser">
                  <p class="infoText">{{holdData.merchandiserNumber}}</p>
                  <span class="info_icon" @click="editInfoFn(6)"><a-icon type="edit" class="targater" /></span>
                </div>
                <div class="tit_concent" v-else>
                  <a-form-item class="aFormItem">
                    <a-input v-decorator="verify.infoMerchandiser" style="width: 110%" @change="inputChagneAllFn(5, $event)" placeholder="请输入主材跟单员!" :maxlength="50" />
                  </a-form-item>
                  <div class="btn_dom">
                    <p>
                      <a-icon type="check" class="checkDom" @click="sureInfoFn(6)" />
                      <a-icon type="close" class="checkDom" style="margin-top: 3px;" @click="cannalInfoFn(6)" />
                    </p>
                  </div>
                </div>
              </td>
              <th class="table_th">联系电话</th>
              <td class="table_td">
                <div class="tit_text" v-if="!editInfoFlag.infoMerchanphone">
                  <p class="infoText">{{holdData.MerchanphoneNumber}}</p>
                  <span class="info_icon" @click="editInfoFn(7)"><a-icon type="edit" class="targater" /></span>
                </div>
                <div class="tit_concent" v-else>
                  <a-form-item class="aFormItem">
                    <a-input v-decorator="verify.infoMerchanphone" style="width: 110%" @change="inputChagneAllFn(6, $event)" placeholder="请输入联系电话!" :maxlength="50" />
                  </a-form-item>
                  <div class="btn_dom">
                    <p>
                      <a-icon type="check" class="checkDom" @click="sureInfoFn(7)" />
                      <a-icon type="close" class="checkDom" style="margin-top: 3px;" @click="cannalInfoFn(7)" />
                    </p>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th class="table_th">设计师</th>
              <td class="table_td">
                <div class="tit_text" v-if="!editInfoFlag.infoDesigner">
                  <p class="infoText">{{holdData.designerNumber}}</p>
                  <span class="info_icon" @click="editInfoFn(8)"><a-icon type="edit" class="targater" /></span>
                </div>
                <div class="tit_concent" v-else>
                  <a-form-item class="aFormItem">
                    <a-input v-decorator="verify.infoDesigner" style="width: 110%" @change="inputChagneAllFn(7, $event)" placeholder="请输入设计师!" :maxlength="50" />
                  </a-form-item>
                  <div class="btn_dom">
                    <p>
                      <a-icon type="check" class="checkDom" @click="sureInfoFn(8)" />
                      <a-icon type="close" class="checkDom" style="margin-top: 3px;" @click="cannalInfoFn(8)" />
                    </p>
                  </div>
                </div>
              </td>
              <th class="table_th">联系电话</th>
              <td class="table_td">
                <div class="tit_text" v-if="!editInfoFlag.infoDesignphone">
                  <p class="infoText">{{holdData.designphoneNumber}}</p>
                  <span class="info_icon" @click="editInfoFn(9)"><a-icon type="edit" class="targater" /></span>
                </div>
                <div class="tit_concent" v-else>
                  <a-form-item class="aFormItem">
                    <a-input v-decorator="verify.infoDesignphone" style="width: 110%" @change="inputChagneAllFn(8, $event)" placeholder="请输入联系电话!" :maxlength="50" />
                  </a-form-item>
                  <div class="btn_dom">
                    <p>
                      <a-icon type="check" class="checkDom" @click="sureInfoFn(9)" />
                      <a-icon type="close" class="checkDom" style="margin-top: 3px;" @click="cannalInfoFn(9)" />
                    </p>
                  </div>
                </div>
              </td>
              <th class="table_th">装修管家</th>
              <td class="table_td">
                <div class="tit_text" v-if="!editInfoFlag.infoHousekeeper">
                  <p class="infoText">{{holdData.housekeeperNumber}}</p>
                  <span class="info_icon" @click="editInfoFn(10)"><a-icon type="edit" class="targater" /></span>
                </div>
                <div class="tit_concent" v-else>
                  <a-form-item class="aFormItem">
                    <a-input v-decorator="verify.infoHousekeeper" style="width: 110%" @change="inputChagneAllFn(9, $event)" placeholder="请输入装修管家!" :maxlength="50" />
                  </a-form-item>
                  <div class="btn_dom">
                    <p>
                      <a-icon type="check" class="checkDom" @click="sureInfoFn(10)" />
                      <a-icon type="close" class="checkDom" style="margin-top: 3px;" @click="cannalInfoFn(10)" />
                    </p>
                  </div>
                </div>
              </td>
              <th class="table_th">联系电话</th>
              <td class="table_td">
                <div class="tit_text" v-if="!editInfoFlag.infoHousephone">
                  <p class="infoText">{{holdData.housephoneNumber}}</p>
                  <span class="info_icon" @click="editInfoFn(11)"><a-icon type="edit" class="targater" /></span>
                </div>
                <div class="tit_concent" v-else>
                  <a-form-item class="aFormItem">
                    <a-input v-decorator="verify.infoHousephone" style="width: 110%" @change="inputChagneAllFn(10, $event)" placeholder="请输入装修管家!" :maxlength="50" />
                  </a-form-item>
                  <div class="btn_dom">
                    <p>
                      <a-icon type="check" class="checkDom" @click="sureInfoFn(11)" />
                      <a-icon type="close" class="checkDom" style="margin-top: 3px;" @click="cannalInfoFn(11)" />
                    </p>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th class="table_th">楼梯房/电梯房</th>
              <td class="table_td" colspan="3">
                <div class="tit_text" style="display: none;">
                  {{holdData.stairsValue}}
                </div>
                <div class="tit_concent">
                  <a-form-item class="aFormItem">
                    <a-radio-group @change="stairsChange" v-decorator="verify.infoStairs">
                      <a-radio :value="1">楼梯房</a-radio>
                      <a-radio :value="2">电梯房</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </div>
              </td>
              <th class="table_th">开竣工日期</th>
              <td class="table_td" colspan="3">
                <div class="tit_text" v-if="!editInfoFlag.infoCommondate">
                  <p class="infoText">{{holdData.CommonStartNumber}} <span v-if="holdData.CommonStartNumber && holdData.CommonEndNumber">至</span>  {{holdData.CommonEndNumber}}</p>
                  <span class="info_icon" @click="editInfoFn(12)"><a-icon type="edit" class="targater" /></span>
                </div>
                <div class="tit_concent" v-else>
                  <a-form-item class="lastSplice">
                    <a-date-picker format="YYYY-MM-DD HH:mm:ss" :showTime="{ defaultValue: mymoment('00:00:00', 'HH:mm:ss') }"  v-decorator="verify.infoStartData" @change="startTimeFn" :disabledDate="disabledStartDate"/>
                  </a-form-item>
                  <span class="small_center">-</span>
                  <a-form-item class="lastSplice">
                    <a-date-picker format="YYYY-MM-DD HH:mm:ss" :showTime="{ defaultValue: mymoment('00:00:00', 'HH:mm:ss') }"  v-decorator="verify.infoEndData" @change="endTimeFn" :disabledDate="disabledEndDate" />
                  </a-form-item>
                  <div class="btn_dom">
                    <p>
                      <a-icon type="check" class="checkDom" @click="sureInfoFn(12)" />
                      <a-icon type="close" class="checkDom" style="margin-top: 3px;" @click="cannalInfoFn(12)" />
                    </p>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </a-form>
      </div>

      <div class="mainMater_maix">
        <a-tabs hideAdd type="editable-card" tabPosition="top" :animated="true" @change="tabChange">
          <a-tab-pane v-for="aitem in pandDom" :tab="aitem.title" :key="aitem.id" :closable="aitem.closable" :forceRender="true">

            <common-offer-table :ref="aitem.tableRefDom" :doubleDate="aitem.contentData" :douColumns="myColumns" :amountFlag="false" addbtnText="添加主材" @addScience="addScience(aitem)" @deleteThink="deleteThink(aitem.contentData, $event)" delbtnText="删除所选的主材">
              <a-textarea placeholder="请输入备注" slot="remark" slot-scope="remarkThisData" v-model="remarkThisData.myRemark.remark" @change="remarkChange(remarkThisData)" maxlength="90" />
            </common-offer-table>

            <common-poplur :ref="aitem.dialogRefDom" :dialogColums="dialogColumsTwo" :dialogData="aitem.dialogData" textMapTitle="主材选配" @sumbitPoplur="materialReplaceTwo(aitem, $event)" :searchData="mainSearchData" :rowType='1' @topSearchThink="topSearchThinkTwo(aitem, $event)" @cannalThink="cannalThinkTwo(aitem, $event)" >
              <template slot="common" slot-scope="commonThisData">
                <a-tag color="blue" v-if="commonThisData.myCommon.common == 1">不通用</a-tag>
                <a-tag color="#f50" v-if="commonThisData.myCommon.common == 2">通用</a-tag>
              </template>
            </common-poplur>

          </a-tab-pane>
        </a-tabs>
      </div>

      <div class="footer">
        <a-button size="large" class="gobackDom" @click="backDetail">取消</a-button>
        <a-button type="primary" size="large" @click="lastTabSubmit">保存</a-button>
      </div>
    </div>
    <!-- 没有数据则显示暂无数据 -->
    <div class="nonePage" v-if="!holdFlagPage">
      <img src="@/common/images/report_noneData.png" alt="" class="noneImg">
      <p class="none_text">暂未签约, 无法获取主材数据</p>
    </div>
    <div class="nonePage" v-if="holdFlagPage && !haveShow">
      <img src="@/common/images/report_noneData.png" alt="" class="noneImg">
      <p class="none_text">该报价不支持主材选品</p>
    </div>

  </div>
</template>

<script>
import CommonHeader from '@/components/CommonHeader/index.vue'
import contTableData from './js/index'
import { myPower } from '@/common/utils/power.js'
import { mainmaterialsMixin } from './js/mainmaterialsMixin'
import { myColumns } from './js/columns'
import commonOfferTable from '@/views/OfferManagement/children/commonOfferTable/commonOfferTable'
import commonPoplur from '@/views/OfferManagement/children/commonPoplur/commonPoplur'
import { mainSearchData, dialogColumsTwo } from '@/common/mymock'

var moment = require('moment')

export default {
  data () {
    return {
      mymoment: require('moment'),
      mythat: this,
      holdFlagPage: false, // quote/querySignQuote这个接口的result没有返回东西不显示正常的主材选品
      haveShow: false, // quote/querySignQuote这个接口的result有返回东西，并且里面的status为1则显示正常的主材选品
      routerList: [
        {
          name: '详情',
          url: '/DispatchOperation',
          flag: 'workOrderDetail',
          budgetPageFlag: true
        },
        {
          name: '合同',
          url: '/contract',
          flag: 'workOrderContract',
          budgetPageFlag: true
        },
        {
          name: '主材选品',
          url: '/mainMaterials',
          flag: 'SelectionOfMain',
          budgetPageFlag: true
        },
        {
          name: '施工预算拆单',
          url: '/budgetSplit_child',
          flag: 'budgetSplit',
          budgetPageFlag: true
        },
        {
          name: '工程变更',
          url: '/add-decrease',
          flag: 'workOrderChange',
          budgetPageFlag: true
        },
      ],
      budgetPageValue: {
        index: 2,
        orderId: '' // 工单Id
      },
      formData: this.$form.createForm(this),
      infoValue: {
        index: 5,
        orderId: '' // 工单Id
      },
      stepNumFlag: 0,
      editInfoFlag: {
        infoNumber: false,
        infoPurchase: false,
        infoAddress: false,
        infoCustomer: false,
        infoPhone: false,
        infoMerchandiser: false,
        infoMerchanphone: false,
        infoDesigner: false,
        infoDesignphone: false,
        infoHousekeeper: false,
        infoHousephone: false,
        infoCommondate: false
      },
      verify: {}, // 表单绑定数据
      holdData: {
        contractNumber: '', // 合同号
        purchaseNumber: '', // 材料选购日期
        addressNumber: '', // 送货地址
        customerNumber: '', // 客户姓名
        phoneNumber: '', // (客户姓名)联系电话
        merchandiserNumber: '', // 主材跟单员
        MerchanphoneNumber: '', // (主材跟单员)联系电话
        designerNumber: '', // 设计师
        designphoneNumber: '', // (设计师)联系电话
        housekeeperNumber: '', // 装修管家
        housephoneNumber: '', // (装修管家)联系电话
        stairsValue: '', // 楼梯房/电梯房
        CommonStartNumber: '', // 开竣工日期
        CommonEndNumber: '', // 开竣工日期
      }, // 整个表格的所有数据
      saveChangeData: '', // 保存设置材料选购日期的对象
      mystartData: null, // 开竣工日期
      myendData: null, // 开竣工日期
      saveStartDate: '', // 保存设置开竣工日期
      saveEndDate: '', // 保存设置开竣工日期
      myColumns,
      dialogColumsTwo,
      mainSearchData,
      saveHaveId: '', // 保存choose/querySkuChooseInfo这个接口有返回的id
    }
  },
  props: {
  },
  mixins: [myPower, mainmaterialsMixin],
  components: {
    CommonHeader,
    commonOfferTable,
    commonPoplur
  },
  created () {
    this.verify = contTableData
    // 先调用这个接口判断有没有签约，没有签约得话就显示暂未签约 无法获取主材数据
    this.holdPageShowFn()
  },
  computed: {

  },
  mounted () {
  },
  methods: {
    holdPageShowFn() {
      let sdata = {
        workOrderId: JSON.parse(sessionStorage.orderValue).id
      }
      this.$request.post('/quote/querySignQuote', sdata).then(res => {
        if (res.result) {
          // 获取施工范围接口
          this.showTabListFn()
          this.holdFlagPage = true
          if (res.result.status == 1) {
            this.haveShow = true
          } else if (res.result.status == 2) {
            this.haveShow = false
          }
        } else {
          this.holdFlagPage = false
        }
      })
    },
    showListFn() {
      let sdata = {
        workOrderNumber: JSON.parse(sessionStorage.orderValue).code,
        workOrderId: JSON.parse(sessionStorage.orderValue).id
      }
      this.$request.post('/choose/querySkuChooseInfo', sdata).then(res => {
        if (res.code == 0) {
          if (res.result.id) this.saveHaveId = res.result.id
          if (res.result.contractNumber) this.holdData.contractNumber = res.result.contractNumber
          if (res.result.skuChooseTime) this.holdData.purchaseNumber = res.result.skuChooseTime
          if (res.result.address) this.holdData.addressNumber = res.result.address
          if (res.result.customerName) this.holdData.customerNumber = res.result.customerName
          if (res.result.customerPhone) this.holdData.phoneNumber = res.result.customerPhone
          if (res.result.skuMerchandiserName) this.holdData.merchandiserNumber = res.result.skuMerchandiserName
          if (res.result.skuMerchandiserPhone) this.holdData.MerchanphoneNumber = res.result.skuMerchandiserPhone
          if (res.result.designerName) this.holdData.designerNumber = res.result.designerName
          if (res.result.designerPhone) this.holdData.designphoneNumber = res.result.designerPhone
          if (res.result.housekeeperName) this.holdData.housekeeperNumber = res.result.housekeeperName
          if (res.result.housekeeperPhone) this.holdData.housephoneNumber = res.result.housekeeperPhone
          if (res.result.isElevator) {
            this.holdData.stairsValue = res.result.isElevator
            this.verify.infoStairs[1].initialValue = res.result.isElevator
          }
          if (res.result.planStartConstructionTime) this.holdData.CommonStartNumber = res.result.planStartConstructionTime
          if (res.result.planEndConstructionTime) this.holdData.CommonEndNumber = res.result.planEndConstructionTime

          if (res.result.skuChooseItemVoList) {
            if (res.result.skuChooseItemVoList.length == 0) {
              this.queryQuoteItemsFn()
            } else {
              this.pandDom.forEach(item => {
                let arr = res.result.skuChooseItemVoList.filter(fil => {
                  return fil.rangeId == item.id
                })
                item.contentData = arr.map(o => Object.assign({}, o))
              })
              this.pandDom.forEach(pad => {
                pad.contentData.forEach((item,index) => {
                  item.key = item.itemId
                  item.serial = item.itemId
                  if (!item.remark) item.remark = ''
                })
              })
              this.$forceUpdate()
            }
          } else {
            this.queryQuoteItemsFn()
          }
          
        }
      })
    },
    stepClickThinkFn (step, num) {
      
    },
    // 点击编辑按钮事件
    editInfoFn(num) {
      if (num == 1) {
        this.editInfoFlag.infoNumber = true
        this.verify.infoNumber[1].initialValue = this.holdData.contractNumber
      } else if (num == 2) {
        this.editInfoFlag.infoPurchase = true
        if (this.holdData.purchaseNumber) {
          this.verify.infoPurchase[1].initialValue = moment(this.holdData.purchaseNumber)
        }
      } else if (num == 3) {
        this.editInfoFlag.infoAddress = true
        this.verify.infoAddress[1].initialValue = this.holdData.addressNumber
      } else if (num == 4) {
        this.editInfoFlag.infoCustomer = true
        this.verify.infoCustomer[1].initialValue = this.holdData.customerNumber
      } else if (num == 5) {
        this.editInfoFlag.infoPhone = true
        this.verify.infoPhone[1].initialValue = this.holdData.phoneNumber
      } else if (num == 6) {
        this.editInfoFlag.infoMerchandiser = true
        this.verify.infoMerchandiser[1].initialValue = this.holdData.merchandiserNumber
      } else if (num == 7) {
        this.editInfoFlag.infoMerchanphone = true
        this.verify.infoMerchanphone[1].initialValue = this.holdData.MerchanphoneNumber
      } else if (num == 8) {
        this.editInfoFlag.infoDesigner = true
        this.verify.infoDesigner[1].initialValue = this.holdData.designerNumber
      } else if (num == 9) {
        this.editInfoFlag.infoDesignphone = true
        this.verify.infoDesignphone[1].initialValue = this.holdData.designphoneNumber
      } else if (num == 10) {
        this.editInfoFlag.infoHousekeeper = true
        this.verify.infoHousekeeper[1].initialValue = this.holdData.housekeeperNumber
      } else if (num == 11) {
        this.editInfoFlag.infoHousephone = true
        this.verify.infoHousephone[1].initialValue = this.holdData.housephoneNumber
      } else if (num == 12) {
        this.editInfoFlag.infoCommondate = true
        if (this.holdData.CommonStartNumber) {
          this.verify.infoStartData[1].initialValue = moment(this.holdData.CommonStartNumber)
        }
        if (this.holdData.CommonEndNumber) {
          this.verify.infoEndData[1].initialValue = moment(this.holdData.CommonEndNumber)
        }
      }
    },
    // input的change事件
    inputChagneAllFn(num, ev, aflag) {
      if (num == 1) {
        this.verify.infoNumber[1].initialValue = ev.target.value
      } else if (num == 2) {
        this.verify.infoAddress[1].initialValue = ev.target.value
      } else if (num == 3) {
        this.verify.infoCustomer[1].initialValue = ev.target.value
      } else if (num == 4) {
        this.verify.infoPhone[1].initialValue = ev.target.value
      } else if (num == 5) {
        this.verify.infoMerchandiser[1].initialValue = ev.target.value
      } else if (num == 6) {
        this.verify.infoMerchanphone[1].initialValue = ev.target.value
      } else if (num == 7) {
        this.verify.infoDesigner[1].initialValue = ev.target.value
      } else if (num == 8) {
        this.verify.infoDesignphone[1].initialValue = ev.target.value
      } else if (num == 9) {
        this.verify.infoHousekeeper[1].initialValue = ev.target.value
      } else if (num == 10) {
        this.verify.infoHousephone[1].initialValue = ev.target.value
      }
    },
    // 日期组件change
    onDataPickFn(date, dateString) {
      this.saveChangeData = dateString
      this.verify.infoPurchase[1].initialValue = this.saveChangeData
    },
    // 楼梯房电梯房选择
    stairsChange(ev) {
      this.holdData.stairsValue = ev.target.value
    },
    // 点击确定编辑按钮事件
    sureInfoFn(num) {
      if (num == 1) {
        if (this.verify.infoNumber[1].initialValue == '') {
          this.$message.info('请输入合同编号')
          return
        }
        this.editInfoFlag.infoNumber = false
        this.holdData.contractNumber = this.verify.infoNumber[1].initialValue
      } else if (num == 2) {
        if (this.verify.infoPurchase[1].initialValue == '') {
          this.$message.info('请选择材料选购日期')
          return
        }
        this.editInfoFlag.infoPurchase = false
        this.holdData.purchaseNumber = this.saveChangeData || this.holdData.purchaseNumber
      } else if (num == 3) {
        // if (this.verify.infoAddress[1].initialValue == '') {
        //   this.$message.info('请输入送货地址')
        //   return
        // }
        this.editInfoFlag.infoAddress = false
        this.holdData.addressNumber = this.verify.infoAddress[1].initialValue
      } else if (num == 4) {
        // if (this.verify.infoCustomer[1].initialValue == '') {
        //   this.$message.info('请输入客户姓名')
        //   return
        // }
        this.editInfoFlag.infoCustomer = false
        this.holdData.customerNumber = this.verify.infoCustomer[1].initialValue
      } else if (num == 5) {
        // if (this.verify.infoPhone[1].initialValue == '') {
        //   this.$message.info('请输入联系电话')
        //   return
        // }
        this.editInfoFlag.infoPhone = false
        this.holdData.phoneNumber = this.verify.infoPhone[1].initialValue
      } else if (num == 6) {
        // if (this.verify.infoMerchandiser[1].initialValue == '') {
        //   this.$message.info('请输入主材跟单员')
        //   return
        // }
        this.editInfoFlag.infoMerchandiser = false
        this.holdData.merchandiserNumber = this.verify.infoMerchandiser[1].initialValue
      } else if (num == 7) {
        // if (this.verify.infoMerchanphone[1].initialValue == '') {
        //   this.$message.info('请输入联系电话')
        //   return
        // }
        this.editInfoFlag.infoMerchanphone = false
        this.holdData.MerchanphoneNumber = this.verify.infoMerchanphone[1].initialValue
      } else if (num == 8) {
        // if (this.verify.infoDesigner[1].initialValue == '') {
        //   this.$message.info('请输入设计师')
        //   return
        // }
        this.editInfoFlag.infoDesigner = false
        this.holdData.designerNumber = this.verify.infoDesigner[1].initialValue
      } else if (num == 9) {
        // if (this.verify.infoDesignphone[1].initialValue == '') {
        //   this.$message.info('请输入联系电话')
        //   return
        // }
        this.editInfoFlag.infoDesignphone = false
        this.holdData.designphoneNumber = this.verify.infoDesignphone[1].initialValue
      } else if (num == 10) {
        // if (this.verify.infoHousekeeper[1].initialValue == '') {
        //   this.$message.info('请输入装修管家')
        //   return
        // }
        this.editInfoFlag.infoHousekeeper = false
        this.holdData.housekeeperNumber = this.verify.infoHousekeeper[1].initialValue
      } else if (num == 11) {
        // if (this.verify.infoHousephone[1].initialValue == '') {
        //   this.$message.info('请输入联系电话')
        //   return
        // }
        this.editInfoFlag.infoHousephone = false
        this.holdData.housephoneNumber = this.verify.infoHousephone[1].initialValue
      } else if (num == 12) {
        // if (this.verify.infoStartData[1].initialValue == '') {
        //   this.$message.info('请选择开工日期')
        //   return
        // }
        // if (this.verify.infoEndData[1].initialValue == '') {
        //   this.$message.info('请选择竣工日期')
        //   return
        // }
        // if (!this.verify.infoStartData[1].initialValue || !this.verify.infoEndData[1].initialValue) {
        //   this.$message.info('请完整选择开竣工日期')
        //   return
        // }
        this.editInfoFlag.infoCommondate = false
        this.holdData.CommonStartNumber = this.saveStartDate || this.holdData.CommonStartNumber
        this.holdData.CommonEndNumber = this.saveEndDate || this.holdData.CommonEndNumber
      }
    },
    // 点击取消编辑按钮事件
    cannalInfoFn(num) {
      if (num == 1) {
        this.editInfoFlag.infoNumber = false
      } else if (num == 2) {
        this.editInfoFlag.infoPurchase = false
      } else if (num == 3) {
        this.editInfoFlag.infoAddress = false
      } else if (num == 4) {
        this.editInfoFlag.infoCustomer = false
      } else if (num == 5) {
        this.editInfoFlag.infoPhone = false
      } else if (num == 6) {
        this.editInfoFlag.infoMerchandiser = false
      } else if (num == 7) {
        this.editInfoFlag.infoMerchanphone = false
      } else if (num == 8) {
        this.editInfoFlag.infoDesigner = false
      } else if (num == 9) {
        this.editInfoFlag.infoDesignphone = false
      } else if (num == 10) {
        this.editInfoFlag.infoHousekeeper = false
      } else if (num == 11) {
        this.editInfoFlag.infoHousephone = false
      } else if (num == 12) {
        this.editInfoFlag.infoCommondate = false
      }
    },
    // 开竣工的时间日期组件
    disabledStartDate (startValue) {
      const endValue = this.myendData
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf();
    },
    disabledEndDate (endValue) {
      const startValue = this.mystartData
      if (!endValue || !startValue) {
        return false;
      }
      return startValue.valueOf() >= endValue.valueOf();
    },
    startTimeFn(adata, atime) {
      this.mystartData = adata
      this.saveStartDate = atime
      if (atime) {
        this.verify.infoStartData[1].initialValue = atime
      } else {
        this.verify.infoStartData[1].initialValue = ''
      }
    },
    endTimeFn(adata, atime) {
      this.myendData = adata
      this.saveEndDate = atime
      if (atime) {
        this.verify.infoEndData[1].initialValue = atime
      } else {
        this.verify.infoEndData[1].initialValue = ''
      }
    },
    // 返回订单详情
    backDetail () {
      let aline = JSON.parse(sessionStorage.getItem('orderValue'))
      this.$router.push({
        path: '/DispatchOperation',
        query: { id: aline.manageAppointmentId, pageSouce: 'gdxq', userId: aline.customerUserId, gdId: aline.id, status: aline.status }
      })
    },
  },
  watch: {

  }
}
</script>

<style lang="scss">
@import './css/mainMaterials.scss';
</style>
