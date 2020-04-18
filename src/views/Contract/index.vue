<template>
  <div class="contract">
    <common-header :value='budgetPageValue' v-if="this.$route.query.budgetPageFlag" :routerList="routerList"></common-header>
    <common-header :value='infoValue' v-else></common-header>

    <div class="topTabDom">
      <span :class="{'topTabSplice': mueFlag == true}"  @click="switchover(1)">签约申请</span>
      <span :class="{'topTabSplice': mueFlag == false}" @click="switchover(2)">历史记录</span>
    </div>

    <div class="leftDom" v-show="mueFlag === true && statusFlag === 3">
      <!-- <p class="tit_status">合同状态：<span class="showSplice">未发起</span>-<span class="showSplice">待审核</span>-<span class="showSplice">审核通过</span>-<span class="showSplice">审核不通过</span>-<span class="showSplice">已签字</span></p> -->
      <a-form :form='formData' >
        <table border="1" class="comm">
          <tr>
            <th class="table_th">报价方案</th>
            <td class="table_td commLeft">
              <a-form-item style="margin-bottom: 0;">
                <a-select v-decorator="verify.priceId" placeholder="请选择报价方案" style="width: 420px" @change="proposalSelectChange" :disabled='orderStatis == 0'>
                  <a-select-option v-for="item in priList" :key="item.productId" :value="item.id">{{item.name}}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <th class="table_th">设计方案</th>
            <td class="table_td commLeft">
              <a-form-item style="margin-bottom: 0;">
                <a-select v-decorator="verify.designId" placeholder="请选择设计方案" style="width: 420px" :disabled='orderStatis == 0'>
                  <a-select-option v-for="(item, index) in designList" :key="index" :value="item.id">{{item.designName}}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <th class="table_th">合同范本</th>
            <td class="table_td commLeft">
              <a-form-item style="margin-bottom: 0;">
                <a-select v-decorator="verify.contractTemp" @change="contractTempChangeFn" placeholder="请选择合同范本" style="width: 420px" :disabled='orderStatis == 0'>
                  <a-select-option v-for="(item, index) in ContractTemplateList" :key="index" :value="item.id">{{item.name}}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
          <tr v-show="showContrTempFlag">
            <th class="table_th">合同信息</th>
            <td class="table_td commLeft informationDom">
              <h3>合同抬头</h3>
              <table border="1" class="smallcomm">
                <tr>
                  <th>字段</th>
                  <td class="content">内容</td>
                  <th>字段</th>
                  <td class="content">内容</td>
                </tr>
                <tr>
                  <th>合同编号</th>
                  <td>
                    <div class="tit_text" v-if="!editInfoFlag.infoNumber">
                      <p class="infoText">{{holdData.contractNumber}}</p>
                      <span class="info_icon" @click="editInfoFn(1)"><a-icon type="edit" class="targater" /></span>
                    </div>
                    <div v-else>
                      <a-form-item style="margin-bottom: 0; width: 70%; display: inline-block" >
                        <a-input v-decorator="verify.infoNumber" @change="inputChagneAllFn(1, $event)" placeholder="请输入合同编号!" :maxlength="50" />
                      </a-form-item>
                      <div class="btn_dom">
                        <a-button size="small" type="primary" style="margin-right: 5px;" @click="sureInfoFn(1)">确定</a-button>
                        <a-button size="small" @click="cannalInfoFn(1)">取消</a-button>
                      </div>
                    </div>
                  </td>
                  <th>联系电话</th>
                  <td>
                    <div class="tit_text" v-if="!editInfoFlag.infoPhone">
                      <p class="infoText">{{holdData.customerPhone}}</p>
                      <!-- <span class="info_icon" @click="editInfoFn(2)"><a-icon type="edit" class="targater" /></span> -->
                    </div>
                    <div v-else>
                      <a-form-item style="margin-bottom: 0; width: 70%; display: inline-block" >
                        <a-input v-decorator="verify.infoPhone" @change="inputChagneAllFn(2, $event)" placeholder="请输入联系电话!" :maxlength="50" />
                      </a-form-item>
                      <div class="btn_dom">
                        <a-button size="small" type="primary" style="margin-right: 5px;" @click="sureInfoFn(2)">确定</a-button>
                        <a-button size="small" @click="cannalInfoFn(2)">取消</a-button>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>甲方</th>
                  <td>
                    <div class="tit_text" v-if="!editInfoFlag.infoParty">
                      <p class="infoText">{{holdData.customerName}}</p>
                      <!-- <span class="info_icon" @click="editInfoFn(3)"><a-icon type="edit" class="targater" /></span> -->
                    </div>
                    <div v-else>
                      <a-form-item style="margin-bottom: 0; width: 70%; display: inline-block" >
                        <a-input v-decorator="verify.infoParty" @change="inputChagneAllFn(3, $event)" placeholder="请输入甲方!" :maxlength="50" />
                      </a-form-item>
                      <div class="btn_dom">
                        <a-button size="small" type="primary" style="margin-right: 5px;" @click="sureInfoFn(3)">确定</a-button>
                        <a-button size="small" @click="cannalInfoFn(3)">取消</a-button>
                      </div>
                    </div>
                  </td>
                  <th>房屋地址</th>
                  <td>
                    <div class="tit_text" v-if="!editInfoFlag.infoHome">
                      <p class="infoText">{{holdData.houseAddress}}</p>
                      <span class="info_icon" @click="editInfoFn(4)"><a-icon type="edit" class="targater" /></span>
                    </div>
                    <div v-else>
                      <!-- 省市区 -->
                      <a-row :gutter="24">
                        <a-col span='7'>
                          <a-form-item has-feedback  style="margin-bottom: 0">
                            <a-select v-decorator="verify.province" showSearch optionFilterProp='children'
                            placeholder="请选择省份" :notFoundContent='notFoundObj.provinceNot' @change="getCityList" style="width: 100%" >
                              <a-select-option v-for="(opt) in provinceList" :key="opt.name" :value="opt.code">{{opt.name}} </a-select-option>
                            </a-select>
                          </a-form-item>
                        </a-col>
                        <a-col span='7'>
                          <a-form-item has-feedback  style="margin-bottom: 0">
                            <a-select v-decorator="verify.city" placeholder="请选择城市" showSearch optionFilterProp='children'
                            :notFoundContent='notFoundObj.cityNot' @change="getDistru" style="width: 100%" >
                              <a-select-option v-for="(opt) in cityList" :key="opt.name" :value="opt.code">{{opt.name}}</a-select-option>
                            </a-select>
                          </a-form-item>
                        </a-col>
                        <a-col span='7'>
                          <a-form-item has-feedback  style="margin-bottom: 0">
                            <a-select v-decorator="verify.area" placeholder="请选择区域" showSearch allowClear optionFilterProp='children'
                            :notFoundContent='notFoundObj.areaNot' @change="getAreaFun" style="width: 100%" >
                              <a-select-option v-for="(opt) in areaList" :key="opt.name" :value="opt.code">{{opt.name}}</a-select-option>
                            </a-select>
                          </a-form-item>
                        </a-col>
                      </a-row>
                      <a-radio-group v-model="addressType" @change="addressTypeChangFn">
                        <a-radio :value='1'>自定义地址</a-radio>
                        <a-radio :value='2'>非自定义地址</a-radio>
                      </a-radio-group>
                      <!-- 小区 -->
                      <div style="width: 50%">
                        <a-spin :spinning="mySpingFlagOne">
                          <a-form-item has-feedback v-if="addressType == 2" style="margin-bottom: 0">
                            <a-select v-decorator="verify.residential" placeholder="请选择小区" showSearch optionFilterProp='children'
                            :notFoundContent='notFoundObj.residentialNot' @change="getBuildingList">
                              <a-select-option v-for="(opt) in projectList" :key="opt.name" :value="opt.code">{{opt.name}}</a-select-option>
                            </a-select>
                          </a-form-item>
                        </a-spin>
                        <a-form-item has-feedback v-if="addressType == 1" style="margin-bottom: 0">
                          <a-input v-decorator="verify.residenInput" placeholder="请输入小区" @change="inputChagneAllFn(4, $event, 1)"></a-input>
                        </a-form-item>
                      </div>
                      <!-- 楼栋 -->
                      <div style="width: 50%">
                        <a-spin :spinning="mySpingFlagTwo">
                          <a-form-item has-feedback v-if="addressType == 2" style="margin-bottom: 0">
                            <a-select v-decorator="verify.ridgepole" placeholder="请选择楼栋" showSearch optionFilterProp='children'
                            :notFoundContent='notFoundObj.buildinhNot' @change="getHouseList">
                              <a-select-option v-for="(opt) in buildingList" :key="opt.name" :value="opt.code">{{opt.name}}</a-select-option>
                            </a-select>
                          </a-form-item>
                        </a-spin>
                        <a-form-item has-feedback v-if="addressType == 1" style="margin-bottom: 0">
                          <a-input v-decorator="verify.ridgepInput" placeholder="请输入楼栋" @change="inputChagneAllFn(4, $event, 2)"></a-input>
                        </a-form-item>
                      </div>
                      <!-- 房号 -->
                      <div style="width: 50%">
                        <a-spin :spinning="mySpingFlagThree">
                          <a-form-item has-feedback v-if="addressType == 2" style="margin-bottom: 0">
                            <a-select v-decorator="verify.addroom" placeholder="请选择房号" showSearch optionFilterProp='children'
                            @change="getHouseValue" :notFoundContent='notFoundObj.roomNot'>
                              <a-select-option v-for="(opt) in houseList" :key="opt.name" :value="opt.code">{{opt.name}}</a-select-option>
                            </a-select>
                          </a-form-item>
                        </a-spin>
                        <a-form-item has-feedback v-if="addressType == 1" style="margin-bottom: 0">
                          <a-input v-decorator="verify.roomInput" placeholder="请输入房号" @change="inputChagneAllFn(4, $event, 3)"></a-input>
                        </a-form-item>
                      </div>
                      <!-- <a-form-item style="margin-bottom: 0; width: 70%; display: inline-block" >
                        <a-input v-decorator="verify.infoHome" @change="inputChagneAllFn(4, $event)" placeholder="请输入房屋地址!" :maxlength="50" />
                      </a-form-item> -->
                      <div class="btn_dom">
                        <a-button size="small" type="primary" style="margin-right: 5px;" @click="sureInfoFn(4)">确定</a-button>
                        <a-button size="small" @click="cannalInfoFn(4)">取消</a-button>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>身份证号码</th>
                  <td>
                    <a-form-item style="margin-bottom: 0;" >
                      <a-input v-decorator="verify.IDcard" placeholder="请输入身份证号码!" :maxlength="50" />
                    </a-form-item>
                  </td>
                  <th>实测面积</th>
                  <td>
                    <div class="tit_text" v-if="!editInfoFlag.infoArea">
                      <p class="infoText">{{holdData.measuredArea}}</p>
                      <span class="info_icon" @click="editInfoFn(5)"><a-icon type="edit" class="targater" /></span>
                    </div>
                    <div v-else>
                      <a-form-item style="margin-bottom: 0; width: 70%; display: inline-block" >
                        <a-input type="number" v-decorator="verify.infoArea" @change="inputChagneAllFn(5, $event)" placeholder="请输入实测面积!" :maxlength="13" />
                      </a-form-item>
                      <div class="btn_dom">
                        <a-button size="small" type="primary" style="margin-right: 5px;" @click="sureInfoFn(5)">确定</a-button>
                        <a-button size="small" @click="cannalInfoFn(5)">取消</a-button>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>合同拟定日期</th>
                  <td>
                    <div class="tit_text" v-if="!editInfoFlag.infoDate">
                      <p class="infoText">{{holdData.contractDraftDate}}</p>
                      <span class="info_icon" @click="editInfoFn(6)"><a-icon type="edit" class="targater" /></span>
                    </div>
                    <div v-else>
                      <a-form-item style="margin-bottom: 0; display: inline-block" >
                        <a-date-picker format="YYYY-MM-DD"  v-decorator="verify.infoDate" @change="onDataPickFn" />
                      </a-form-item>
                      <div class="btn_dom">
                        <a-button size="small" type="primary" style="margin-right: 5px;" @click="sureInfoFn(6)">确定</a-button>
                        <a-button size="small" @click="cannalInfoFn(6)">取消</a-button>
                      </div>
                    </div>
                  </td>
                </tr>
              </table>
              <!-- 第二个表格******************************** -->
              <!-- 1——全屋装修施工合同   2——全屋刷新施工合同  3——局部装修Plus施工合同  4——局部装修Mini施工合同   -->
              <h3 style="margin-top: 15px;">工程概况</h3>
              <commoncontr-one v-if="contractType == 1" :verify="verify" :holdData="holdData" :allContrXilieList="allContrXilieList" :seriesListOne="seriesListOne" :seriesListTwo="seriesListTwo" @chooesCheckboxDate="chooesCheckboxDate"></commoncontr-one>
              <commoncontr-two v-if="contractType == 2" :verify="verify" :holdData="holdData" :allContrXilieList="allContrXilieList" :seriesListOne="seriesListOne" :seriesListTwo="seriesListTwo" @chooesCheckboxDate="chooesCheckboxDate"></commoncontr-two>
              <commoncontr-thr v-if="contractType == 3" :verify="verify" :holdData="holdData" :allContrXilieList="allContrXilieList" :seriesListOne="seriesListOne" :seriesListTwo="seriesListTwo" @chooesCheckboxDate="chooesCheckboxDate"></commoncontr-thr>
              <commoncontr-four v-if="contractType == 4" :verify="verify" :holdData="holdData" :allContrXilieList="allContrXilieList" :seriesListOne="seriesListOne" :seriesListTwo="seriesListTwo" @chooesCheckboxDate="chooesCheckboxDate"></commoncontr-four>
            </td>
          </tr>
          <tr>
            <th class="table_th">审批模板</th>
            <td class="table_td commLeft">
              <a-form-item style="margin-bottom: 0;">
                <a-select v-decorator="verify.myapproval" style="width: 420px" :disabled='orderStatis == 0' placeholder="请选择审批模板">
                  <a-select-option v-for="(item, index) in approvalList" :key="index" :value="item.id">{{item.processRangeName}}</a-select-option>
                </a-select>
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>
    </div>
    
    <div class="submitDom" v-show="mueFlag === true && statusFlag === 3">
      <a-button :disabled='orderStatis == 0' style="margin-right:20px; width: 100px" @click="cancel">取消</a-button>
      <a-button :disabled='orderStatis == 0' type="primary" style="width: 100px" @click="submit" v-if="RouterNameFlag[mythat.$route.name] || RouterNameFlag['order_contract_btn']">提交</a-button>
    </div>

    <!-- 当状态不为3时，显示已经签约成功的界面 -->
    <div v-if="mueFlag === true && statusFlag !== 3" class="showNoneDom">
      <div>
        <img src="@/common/images/examine.jpg" alt="" class="none_img" v-if="msgStatus == 1">
        <img src="@/common/images/success_icon.png" alt="" class="none_img" v-if="msgStatus == 2">
        <div class="right">
          <p class="text_tit">{{msgCoyp}}</p>
          <p class="small_tit">点击返回订单详情按钮查看订单详情</p>
        </div>
      </div>
      <a-button class="gobackDom" @click="backDetail">返回订单详情</a-button>
    </div>
    
    <!-- 这里是历史记录表格 -->
    <a-table style="margin-top: 30px;" :columns="historyColumns" :dataSource="dataList"  bordered :locale='locale' :rowKey="record => record.id" v-show="mueFlag === false">
      <div slot="pricingProposalId" slot-scope="pricingProposalId">
        <span class="text_Dom" @click="goToOne(pricingProposalId)">报价方案</span>
      </div>
      <div slot="workOrderDesignId" slot-scope="workOrderDesignId">
        <span class="text_Dom" @click="goToTwo(workOrderDesignId)">设计方案</span>
      </div>
      <div slot="operation" slot-scope="operation, scope">
        <a-tag color="blue" v-if="scope.operation == 1">审核中</a-tag>
        <a-tag color="green" v-if="scope.operation == 2">审核通过</a-tag>
        <a-tag color="red" v-if="scope.operation == 3">审核拒绝</a-tag>
      </div>
      <div slot="contractTemp" slot-scope="contractTemp, scope">
        <span class="text_Dom" @click="goToThr(contractTemp, scope)" v-if="scope.signOnlineId">合同信息</span>
        <span v-else>暂无合同</span>
      </div>
      <div slot="contractPreview" slot-scope="contractPreview, scope">
        <span class="text_Dom" @click="goToFour(contractPreview, scope)" v-if="String(scope.signOnlineId) && scope.operation == 2">预览</span>
        <span v-else>暂无预览</span>
      </div>
      <div slot="contractStatus" slot-scope="contractStatus, scope">
        <a-tag color="#108ee9" v-if="scope.contractStatus == 'UNSIGNED'">未签署</a-tag>
        <a-tag color="#87d068" v-if="scope.contractStatus == 'SIGNED'">已签署</a-tag>
        <a-tag color="#f50" v-if="scope.contractStatus == 'FAILED'">签署失败</a-tag>
        <a-tag color="#B4B4B4" v-if="scope.contractStatus == 'INVALID'">已撤回</a-tag>
        <span v-if="scope.contractStatus == null">暂无</span>
      </div>
      <div slot="action" slot-scope="action, scope">
        <a-button type="primary"  @click="reshefFn(scope)" v-if="ifHaveShowFn(scope)"><a-icon type="undo" />撤回合同</a-button>
        <p v-else>--</p>
      </div>
    </a-table>

    <!-- 这里是详情 -->
    <commoncont-detail ref="comDetailDom" :detailData="detailData"></commoncont-detail>
    <!-- 这是设计方案详情 -->
    <design-detail ref="comDesignDom" :designId="sendDesignId"></design-detail>

  </div>
</template>
<script>
import Api from '@/common/api/api.js'

import CommonHeader from '@/components/CommonHeader/index.vue'
import contTableData from './js/index'
import dayjs from 'dayjs'
import { myPower } from '@/common/utils/power.js'
import { historyColumns } from './js/columns.js'

import commoncontrOne from './common/commonContrOne'
import commoncontrTwo from './common/commonContrTwo'
import commoncontrThr from './common/commonContrThr'
import commoncontrFour from './common/commonContrFour'
import commoncontDetail from './common/commonContDetail'
import designDetail from './common/designDetail'

import { cnotractMixin } from './js/cnotractMixin.js'

import { baseURL } from '@/common/utils/request'

var moment = require('moment')

export default {
  data () {
    return {
      mythat: this,
      budgetPageValue: {
        index: 1
      },
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
      historyColumns,
      infoValue: { index: 4 },
      dataList: [], // 历史记录列表
      locale: { emptyText: '暂无数据,请新增' }, // 无数据显示文案
      mueFlag: true, // 切换
      orderId: '', // 工单信息
      priList: [], // 报价方案列表
      productionList: [], // 施工方案列表
      designList: [], // 设计方案列表
      price: '', // 报价方案
      production: '', // 施工方案
      design: '', // 设计方案
      verify: {}, // 表单绑定数据
      formData: this.$form.createForm(this),
      msgCoyp: '', // 状态文案
      msgStatus: '', // 状态
      flagObj: {}, // 临时
      date1: '', // 开始时间;临时
      date2: '', // 结束时间
      orderStatis: '', // 工单状态,通过接口获取工单状态
      statusFlag: false,
      approvalList: [], // 审批模板的列表
      editInfoFlag: {
        infoNumber: false,
        infoPhone: false,
        infoParty: false,
        infoHome: false,
        infoArea: false,
        infoDate: false
      },
      chooesZhishangList: [], // 选择至善系列的数组ID
      chooesZhishangName: [], // 选择至善系列的数组名称
      chooesJinshangList: [], // 选择尽善系列的数组ID
      chooesJinshangName: [], // 选择尽善系列的数组名称
      firstClick: true, // 首次点击历史记录
      firstQianClick: false, // 撤回之后从历史记录首次回到点击签约申请
      seriesListOne: [], // 产品致善系列的数组
      seriesListTwo: [], // 产品尽善系列的数组
      holdData: {
        pirOne: '',
        pirTwo: '',
        pirThr: ''
      }, // 整个表格的所有数据
      ContractTemplateList: [], // 合同范本列表数据
      saveChangeData: '', // 保存设置合同拟定日期的对象
      ContractTemplateName: '', // 保存合同范本的名称
      allContrXilieList: [], // 保存合同范本中所有的系列
      showContrTempFlag: false, // 是否显示合同信息
      contractType: '', // 合同类型（根据合同范本来选择，目前通过中文名称来判断，后端规定不变...）
      saveProposalId: '', // 保存选择报价方案时候的ID
      detailData: {}, // 查看详情的数据
      sendDesignId: '', // 前往设计方案弹框的ID
    }
  },
  components: {
    CommonHeader,
    commoncontrOne,
    commoncontrTwo,
    commoncontrThr,
    commoncontDetail,
    commoncontrFour,
    designDetail
  },
  mixins: [myPower, cnotractMixin],
  created () {
    this.verify = contTableData
    this.orderId = JSON.parse(sessionStorage.getItem('orderValue'))
    // 获取当前签约状态
    this.getSignStatus()
    // 获取工单信息包括工单状态
    this.getOrderStatus()
    // 获取报价方案列表
    this.getPirceList()
    // 获取设计方案列表
    this.getDesiList()
    // 获取合同信息表格中所有产品系列数据
    this.getProductLine()
    // 获取合同范本列表数据
    this.getContractTemplate()
    // 审批模板选择下拉框的列表数据
    this.approvalFn()
  },
  methods: {
    // 获取当前签约状态
    getSignStatus () {
      this.$request.get('/contract/signing/' + this.orderId.code).then(res => {
        if (res.code === 0) {
          if (res.result) {
            this.statusFlag = res.result.status
            if (res.result.status === 1) {
              this.msgStatus = 1
              this.msgCoyp = '该订单合同正在审核申请中！'
            } else if (res.result.status === 2) {
              this.msgStatus = 2
              this.msgCoyp = '该订单合同已审核通过！'
              if (res.result.contractStatus == 'INVALID') {
                this.statusFlag = 3
              }
            }
          } else {
            this.statusFlag = 3
          }
        }
      })
    },
    // 获取工单信息包括工单状态
    getOrderStatus () {
      this.$request.get('/projectWorkOrder/getWorkOrderBasicInfoByCode?workOrderNumber=' + this.orderId.code).then(res => {
        if (res.code === 0) {
          this.orderStatis = res.result.status
        }
      })
    },
    // 获取报价方案列表
    getPirceList () {
      this.$request.post('/quote/queryQuoteList', { workOrderId: this.orderId.id, status: 1, pageSize: 1000 }).then(res => {
        if (res.code === 0) {
          this.priList = res.result.list
        }
      })
    },
    // 获取设计方案列表
    getDesiList () {
      this.$request.get('/projectWorkOrder/findDesignByWorkOrderId?id=' + this.orderId.id).then(res => {
        if (res.code === 0) {
          this.designList = res.result
        }
      })
    },
    // 获取合同范本列表数据
    getContractTemplate() {
      this.$request.get('/signContractOnLine/getContractTemplateList').then(res => {
        if (res.code == 0) {
          this.ContractTemplateList = res.result
        }
      })
    },
    // 获取合同信息表格中所有产品系列数据
    getProductLine() {
      this.$request.get('/signContractOnLine/getAllProductSeriesList').then(res => {
        if (res.code == 0) {
          this.allContrXilieList = res.result
          this.filterTempFn()
        }
      })
    },
    // 根据所选择的合同模板过滤系列的数据
    filterTempFn() {
      let aArr = []
      this.allContrXilieList.forEach(item => {
        if (this.contractType == 1) {
          if (item.produceCode !== '4' && item.produceCode !== '8') {
            aArr.push(item)
          }
        } else if (this.contractType == 2) {
          if (item.produceCode == '4' || item.produceCode == '8') {
            aArr.push(item)
          }
        } else if (this.contractType == 3 || this.contractType == 4) {
          if (item.produceCode == '1' || item.produceCode == '2' || item.produceCode == '5' || item.produceCode == '6') {
            aArr.push(item)
          }
        }
      })
      this.seriesListOne = []
      this.seriesListTwo = []
      aArr.forEach(item => {
        if (item.produceType == '1') {
          this.seriesListOne.push(item)
        }
        if (item.produceType == '2') {
          this.seriesListTwo.push(item)
        }
      })
      this.$forceUpdate()
    },
    // 获取合同信息表格所有接口数据
    getTableAllDate() {
      this.$request.get('/signContractOnLine/generateContractAboutInfo?workOrderNumber=' + this.orderId.code + '&cityCompanyCode=' + this.orderId.cityCompanyCode + '&contractType=' + this.contractType).then(res => {
        if (res.code == 0) {
          for(let i in res.result) {
            this.holdData[i] = res.result[i]
          }
          this.holdData.contractDraftDate = this.holdData.contractDraftDate.substr(0, 10)
          this.client = res.result
          Object.assign(this.saveOldClient, res.result)
          this.addressType = res.result.categoryType
          this.$forceUpdate()
        }
      })
    },
    // 获取历史记录表
    getHistoryList () {
      this.$request.get('/contract/history-signing/' + this.orderId.code + '?pageNum=1&pageSize=1000').then(res => {
        if (res.code === 0) {
          this.firstClick = false
          this.dataList = res.result.list
          this.dataList.forEach(item => {
            if (!item.signDate) {
              item.signDate = '--'
            }
          })
        }
      })
    },
    // 审批模板选择下拉框的列表数据
    approvalFn() {
      let adata = {
        processCode: 'Signing',
        pageSize: 10000
      }
      this.$request.post('/processTemplate/userList', adata).then(res => {
        if (res.code === 0) {
          this.approvalList = res.result.list
        }
      })
    },
    
    // 顶部切换tab事件
    switchover (i) {
      i == 1 ? this.mueFlag = true : this.mueFlag = false
      if (this.firstClick) {
        this.getHistoryList()
      }
      if (this.firstQianClick) {
        this.firstQianClick = false
        // 获取当前签约状态
        this.getSignStatus()
        // 获取工单信息包括工单状态
        this.getOrderStatus()
        // 获取报价方案列表
        this.getPirceList()
        // 获取设计方案列表
        this.getDesiList()
        // 获取合同信息表格中所有产品系列数据
        this.getProductLine()
        // 获取合同范本列表数据
        this.getContractTemplate()
        // 审批模板选择下拉框的列表数据
        this.approvalFn()
      }
    },
    // 报价方案选择事件
    proposalSelectChange (value) {
      this.saveProposalId = value
      let obj = {}
      this.priList.forEach(item => {
        if (value === item.id) {
          obj = item
        }
      })
      this.getStages(obj)
    },
    // 获取方案报价
    getStages (val) {
      this.flagObj = val
      this.$request.post('/product/queryProductById', { id: val.productId }).then(res => {
        if (res.code === 0) {
          // 换算成整数计算
          let pirOne = (val.totalFee * 100 * res.result.firstPayment / 10000).toFixed(2)
          let pirTwo = (val.totalFee * 100 * res.result.secondPayment / 10000).toFixed(2)
          let ey = (pirOne - 0) * 100 + (pirTwo - 0) * 100 // 计算问题
          let pirThr = ((parseInt(val.totalFee * 100) - ey) / 100).toFixed(2)
          this.holdData.pirOne = pirOne
          this.holdData.pirTwo = pirTwo
          this.holdData.pirThr = pirThr
          this.holdData.totalFee = val.totalFee
          if (Number(this.holdData.pirOne) == 0) this.holdData.pirOne = 0
          if (Number(this.holdData.pirTwo) == 0) this.holdData.pirTwo = 0
          if (Number(this.holdData.pirThr) == 0) this.holdData.pirThr = 0
          this.$forceUpdate()
        }
      })
    },
    // 点击编辑按钮事件
    editInfoFn(num) {
      if (this.saveListProvince.length !== 0) Object.assign(this.provinceList, this.saveListProvince)
      if (this.saveListCity.length !== 0) Object.assign(this.cityList, this.saveListCity)
      if (this.saveListArea.length !== 0) Object.assign(this.areaList, this.saveListArea)
      if (this.saveListResidential.length !== 0) Object.assign(this.projectList, this.saveListResidential)
      if (this.saveListBuilding.length !== 0) Object.assign(this.buildingList, this.saveListBuilding)
      if (this.saveListRoom.length !== 0) Object.assign(this.houseList, this.saveListRoom)
      
      if (num == 1) {
        this.editInfoFlag.infoNumber = true
        this.verify.infoNumber[1].initialValue = this.holdData.contractNumber
      } else if (num == 2) {
        this.editInfoFlag.infoPhone = true
        this.verify.infoPhone[1].initialValue = this.holdData.customerPhone
      } else if (num == 3) {
        this.editInfoFlag.infoParty = true
        this.verify.infoParty[1].initialValue = this.holdData.customerName
      } else if (num == 4) {
        this.verify.province[1].initialValue = this.saveOldClient.provinceCode ? this.saveOldClient.provinceCode : undefined // 省份
        this.verify.city[1].initialValue = this.saveOldClient.cityCode ? this.saveOldClient.cityCode : undefined // 城市
        this.verify.area[1].initialValue = this.saveOldClient.districtCode ? this.saveOldClient.districtCode : undefined // 区

        this.addressType = this.saveOldClient.categoryType
        if (this.addressType == 1) {
          this.verify.residenInput[1].initialValue = this.saveOldClient.project // 自定义小区
          this.verify.ridgepInput[1].initialValue = this.saveOldClient.building // 自定义楼栋
          this.verify.roomInput[1].initialValue = this.saveOldClient.house // 自定义房号
          this.saveOldClient.projectCode = ''
          this.saveOldClient.buildingCode = ''
          this.saveOldClient.houseCode = ''
        } else if (this.addressType == 2){
          this.verify.residential[1].initialValue = this.saveOldClient.projectCode // 非自定义小区
          this.verify.ridgepole[1].initialValue = this.saveOldClient.buildingCode // 非自定义楼栋
          this.verify.addroom[1].initialValue = this.saveOldClient.houseCode // 非自定义房号
        }
        if (this.isOnlyGetShow) {
          this.getProvinList() // 获取省份
          this.getCityList(this.saveOldClient.provinceCode, 1) // 省份选择框的change
          this.getDistru(this.saveOldClient.cityCode, 1) // 城市选择框的change
          this.getAreaFun(this.saveOldClient.districtCode, 1) // 大区选择框的change
          this.getBuildingList(this.saveOldClient.projectCode) // 小区选择框的change
          this.getHouseList(this.saveOldClient.buildingCode) // 楼栋选择框的change
          // this.getHouseValue(this.client.houseCode) // 房号选择框的change
        }

        this.editInfoFlag.infoHome = true
        this.verify.infoHome[1].initialValue = this.holdData.houseAddress
      } else if (num == 5) {
        this.editInfoFlag.infoArea = true
        this.verify.infoArea[1].initialValue = this.holdData.measuredArea
      } else if (num == 6) {
        this.editInfoFlag.infoDate = true
        this.verify.infoDate[1].initialValue = moment(this.holdData.contractDraftDate)
      } 
    },
    // input的change事件
    inputChagneAllFn(num, ev, aflag) {
      if (num == 1) {
        this.verify.infoNumber[1].initialValue = ev.target.value
      } else if (num == 2) {
        this.verify.infoPhone[1].initialValue = ev.target.value
      } else if (num == 3) {
        this.verify.infoParty[1].initialValue = ev.target.value
      } else if (num == 4) {
        if (aflag == 1) {
          this.verify.residenInput[1].initialValue = ev.target.value
        } else if (aflag == 2) {
          this.verify.ridgepInput[1].initialValue = ev.target.value
        } else if (aflag == 3) {
          this.verify.roomInput[1].initialValue = ev.target.value
        }
        // this.verify.infoHome[1].initialValue = ev.target.value
      } else if (num == 5) {
        this.verify.infoArea[1].initialValue = ev.target.value
      }
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
        if (this.verify.infoPhone[1].initialValue == '') {
          this.$message.info('请输入手机号码')
          return
        }
        var aFlag = /^1[0-9]\d{9}$/
        if (!aFlag.test(this.verify.infoPhone[1].initialValue)) {
          this.$message.info('请输入正确的手机号码')
          return
        }
        this.editInfoFlag.infoPhone = false
        this.holdData.customerPhone = this.verify.infoPhone[1].initialValue
      } else if (num == 3) {
        if (this.verify.infoParty[1].initialValue == '') {
          this.$message.info('请输入甲方')
          return
        }
        this.editInfoFlag.infoParty = false
        this.holdData.customerName = this.verify.infoParty[1].initialValue
      } else if (num == 4) {
        if (!this.verify.province[1].initialValue) {
          this.$message.info('请选择省份')
          return
        }
        if (!this.verify.city[1].initialValue) {
          this.$message.info('请选择城市')
          return
        }
        if (!this.verify.area[1].initialValue) {
          this.$message.info('请选择区域')
          return
        }
        if (this.addressType == 1) {
          if (!this.verify.residenInput[1].initialValue) {
            this.$message.info('请输入小区')
            return
          }
          if (!this.verify.ridgepInput[1].initialValue) {
            this.$message.info('请输入楼栋')
            return
          }
          if (!this.verify.roomInput[1].initialValue) {
            this.$message.info('请输入房号')
            return
          }
        } else if (this.addressType == 2) {
          if (!this.verify.residential[1].initialValue) {
            this.$message.info('请选择小区')
            return
          }
          if (!this.verify.ridgepole[1].initialValue) {
            this.$message.info('请选择楼栋')
            return
          }
          if (!this.verify.addroom[1].initialValue) {
            this.$message.info('请选择房号')
            return
          }
        }
        for (let cc in this.pageOne) {
          this.pageOne[cc] = 1
        }
        
        this.editInfoFlag.infoHome = false
        // this.holdData.houseAddress = this.verify.infoHome[1].initialValue
        this.client.categoryType = this.addressType
        this.client.provinceCode = this.verify.province[1].initialValue
        if (this.chineseNameObj.provinceName) this.client.province = this.chineseNameObj.provinceName
        this.client.cityCode = this.verify.city[1].initialValue
        if (this.chineseNameObj.cityName) this.client.city = this.chineseNameObj.cityName
        this.client.districtCode = this.verify.area[1].initialValue
        if (this.chineseNameObj.areaName) {
          this.client.district = this.chineseNameObj.areaName
        }
        if (this.addressType == 1) {
          this.client.projectCode = ''
          this.client.buildingCode = ''
          this.client.houseCode = ''
          this.client.project = this.verify.residenInput[1].initialValue // 自定义小区
          this.client.building = this.verify.ridgepInput[1].initialValue // 自定义楼栋
          this.client.house = this.verify.roomInput[1].initialValue // 自定义房号
        } else if (this.addressType == 2) {
          this.client.projectCode = this.verify.residential[1].initialValue
          this.client.buildingCode = this.verify.ridgepole[1].initialValue
          this.client.houseCode = this.verify.addroom[1].initialValue
          if (this.chineseNameObj.projectName) {
            this.client.project = this.chineseNameObj.projectName
          } else {
            this.client.project = this.saveOldClient.project
          }
          if (this.chineseNameObj.buildingName) {
            this.client.building = this.chineseNameObj.buildingName
          } else {
            this.client.building = this.saveOldClient.building
          }
          if (this.chineseNameObj.houseName) {
            this.client.house = this.chineseNameObj.houseName
          } else {
            this.client.house = this.saveOldClient.house
          }
        }
        Object.assign(this.saveOldClient, this.client)
        Object.assign(this.saveListProvince, this.provinceList)
        Object.assign(this.saveListCity, this.cityList)
        Object.assign(this.saveListArea, this.areaList)
        Object.assign(this.saveListResidential, this.projectList)
        Object.assign(this.saveListBuilding, this.buildingList)
        Object.assign(this.saveListRoom, this.houseList)

        let aName = ''
        if (this.chineseNameObj.provinceName) {
          aName = this.chineseNameObj.provinceName
        } else {
          aName = this.saveOldClient.province
        }
        let bName = ''
        if (this.chineseNameObj.cityName) {
          bName = this.chineseNameObj.cityName
        } else {
          bName = this.saveOldClient.city
        }
        let cName = ''
        if (this.chineseNameObj.areaName) {
          cName = this.chineseNameObj.areaName
        } else {
          cName = this.saveOldClient.district
        }
        let dName = ''
        let eName = ''
        let fName = ''
        if (this.addressType == 1) {
          if (this.saveOldClient.project) dName = this.saveOldClient.project
          if (this.saveOldClient.building) eName = this.saveOldClient.building
          if (this.saveOldClient.house) fName = this.saveOldClient.house
          this.holdData.houseAddress = aName + bName + cName + dName + eName + fName
        } else if (this.addressType == 2) {
          if (this.chineseNameObj.projectName) {
            dName = this.chineseNameObj.projectName
          } else {
            dName = this.saveOldClient.project
          }
          if (this.chineseNameObj.buildingName) {
            eName = this.chineseNameObj.buildingName
          } else {
            eName = this.saveOldClient.building
          }
          if (this.chineseNameObj.houseName) {
            fName = this.chineseNameObj.houseName
          } else {
            fName = this.saveOldClient.house
          }
          this.holdData.houseAddress = aName + bName + cName + fName
        }
      } else if (num == 5) {
        if (!this.verify.infoArea[1].initialValue) {
          this.$message.info('请输入实测面积')
          return
        }
        this.editInfoFlag.infoArea = false
        this.holdData.measuredArea = this.verify.infoArea[1].initialValue
      } else if (num == 6) {
        this.editInfoFlag.infoDate = false
        if (this.saveChangeData) {
          this.holdData.contractDraftDate = this.saveChangeData
        }
      }
      this.$forceUpdate()
    },
    // 点击取消编辑按钮事件
    cannalInfoFn(num) {
      if (num == 1) {
        this.editInfoFlag.infoNumber = false
      } else if (num == 2) {
        this.editInfoFlag.infoPhone = false
      } else if (num == 3) {
        this.editInfoFlag.infoParty = false
      } else if (num == 4) {
        this.editInfoFlag.infoHome = false
        for (let cc in this.pageOne) {
          this.pageOne[cc] = 1
        }
      } else if (num == 5) {
        this.editInfoFlag.infoArea = false
      } else if (num == 6) {
        this.editInfoFlag.infoDate = false
      } 
    },
    // 日期组件change
    onDataPickFn(date, dateString) {
      this.saveChangeData = dateString
    },
    // 合同范本选择框change
    contractTempChangeFn(ev, adata) {
      this.showContrTempFlag = true
      this.ContractTemplateList.forEach(item => {
        if (item.id == ev) {
          this.ContractTemplateName = item.name
        }
      })
      if (this.ContractTemplateName == '全屋装修施工合同') {
        this.contractType = 1
      } else if (this.ContractTemplateName == '全屋刷新施工合同') {
        this.contractType = 2
      } else if (this.ContractTemplateName == '局部装修Plus施工合同') {
        this.contractType = 3
      } else if (this.ContractTemplateName == '局部装修Mini施工合同') {
        this.contractType = 4
      }
      // 获取合同信息表格所有接口数据
      this.getTableAllDate()
      
      if (this.saveProposalId) {
        let obj = {}
        this.priList.forEach(item => {
          if (this.saveProposalId === item.id) {
            obj = item
          }
        })
        this.getStages(obj)
      }
      this.filterTempFn()
    },
    // 返回订单详情
    backDetail () {
      this.$router.push({
        path: '/DispatchOperation',
        query: { id: this.orderId.manageAppointmentId, pageSouce: 'gdxq', userId: this.orderId.customerUserId, gdId: this.orderId.id, status: this.orderId.status }
      })
    },
    // 转跳报价方案
    goToOne (id) {
      this.$request.post('/quote/queryQuoteById', { quoteId: id }).then(res => {
        if (res.code === 0) {
          if (res.result.type === 1) { // 1为报价方案，2位清单，3为自定义
            this.$router.push({ path: '/quote_details', query: { offerId: id, xqSouce: 'xqSouce' } })
          } else if (res.result.type === 2) {
            this.$router.push({ path: '/inventory_details', query: { offerId: id, xqSouce: 'xqSouce' } })
          } else if (res.result.type === 3) {
            this.$router.push({ path: '/customDetailsPage', query: { offerId: id, xqSouce: 'xqSouce' } })
          }
        }
      })
    },
    // 前往设计方案
    goToTwo (id) {
      if (id) {
        this.$refs.comDesignDom.designVisible = true
        this.sendDesignId = id
        this.$refs.comDesignDom.getPictUrlList(id)
      } else {
        this.sendDesignId = id
        this.$refs.comDesignDom.getPictUrlList(id)
      }
    },
    // 查看合同详情
    goToThr(ev, adata) {
      if (adata.signOnlineId) {
        this.$request.get('/signContractOnLine/getContractInfoBySignOnlineId?signOnlineId=' + adata.signOnlineId).then(res => {
          if (res.code === 0) {
            this.detailData = res.result
            this.$refs.comDetailDom.detailVisible = true
          }
        })
      }
    },
    // 历史记录点击预览
    goToFour(ev, adata) {
      window.open(`${baseURL}/signContractOnLine/previewContractOnline/${adata.contractId}`)
    },
    // 组件选择产品系列所返回的数据（系列ID和系列名称）
    chooesCheckboxDate(chooesZhishangList, chooesZhishangName, chooesJinshangList, chooesJinshangName) {
      this.chooesZhishangList = chooesZhishangList
      this.chooesZhishangName = chooesZhishangName
      this.chooesJinshangList = chooesJinshangList
      this.chooesJinshangName = chooesJinshangName
    },
    // 提交
    submit () {
      this.formData.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let sobj = {
            id: this.orderId.id,
            processId: values.myapproval,
            pricingProposalId: values.priceId,
            workOrderDesignId: values.designId,
            signContractOnLineVo: {
              contractTemplateId: values.contractTemp,
              contractName: this.ContractTemplateName,
              contractNumber: this.holdData.contractNumber,
              customerName: this.holdData.customerName,
              customerPhone: this.holdData.customerPhone,
              customerIdCard: values.IDcard,
              // houseAddress: this.holdData.houseAddress,
              measuredArea: this.holdData.measuredArea,
              contractDraftDate: this.holdData.contractDraftDate,
              partBAccountName: this.holdData.partBAccountName,
              partBBankName: this.holdData.partBBankName,
              partBBankAccountNo: this.holdData.partBBankAccountNo,
              firstPayment: this.holdData.pirOne,
              secondPayment: this.holdData.pirTwo,
              thirdPayment: this.holdData.pirThr,
              contractPrice: this.holdData.totalFee,
              planOpenAndDisclosureDate: moment(values.disclosure).format().substr(0, 10),
              planOpenAndCompleteDate: moment(values.dismantling).format().substr(0, 10),
              bedroomNumber: values.room,
              livingNumber: values.office,
              kitchenNumber: values.kitchen,
              bathroomNumber: values.wei,
              balconyNumber: values.balcony,
              constructionContentOther: values.other,
              contractDuration: values.duration,
              actualStartDate: moment(values.commencementDate).format().substr(0, 10),
              actualEndDate: moment(values.completionDate).format().substr(0, 10),
              partAGrantName: values.authorized,
              partAGrantPhone: values.contact,
              perfectProductSeriesCode: this.chooesZhishangList.join(','),
              perfectProductSeriesName: this.chooesZhishangName.join(','),
              tryProductSeriesCode: this.chooesJinshangList.join(','),
              tryProductSeriesName: this.chooesJinshangName.join(','),
              companyName: this.holdData.companyName,
              companyAddress: this.holdData.companyAddress,
              contractType: this.contractType,
              categoryType: this.addressType,
              provinceCode: this.verify.province[1].initialValue || this.saveOldClient.provinceCode,
              cityCode: this.verify.city[1].initialValue || this.saveOldClient.cityCode,
              districtCode: this.verify.area[1].initialValue || this.saveOldClient.districtCode
            }
          }
          if (this.chineseNameObj.provinceName) {
            sobj.signContractOnLineVo.province = this.chineseNameObj.provinceName
          } else {
            sobj.signContractOnLineVo.province = this.saveOldClient.province
          }
          if (this.chineseNameObj.cityName) {
            sobj.signContractOnLineVo.city = this.chineseNameObj.cityName
          } else {
            sobj.signContractOnLineVo.city = this.saveOldClient.city
          }
          if (this.chineseNameObj.areaName) {
            sobj.signContractOnLineVo.district = this.chineseNameObj.areaName
          } else {
            sobj.signContractOnLineVo.district = this.saveOldClient.district
          }
          if (this.addressType == 1) {
            sobj.signContractOnLineVo.project = this.verify.residenInput[1].initialValue || this.saveOldClient.project
            sobj.signContractOnLineVo.building = this.verify.ridgepInput[1].initialValue || this.saveOldClient.building
            sobj.signContractOnLineVo.house = this.verify.roomInput[1].initialValue || this.saveOldClient.house
          } else if (this.addressType == 2) {
            sobj.signContractOnLineVo.projectCode = this.verify.residential[1].initialValue || this.saveOldClient.projectCode
            sobj.signContractOnLineVo.buildingCode = this.verify.ridgepole[1].initialValue || this.saveOldClient.buildingCode
            sobj.signContractOnLineVo.houseCode = this.verify.addroom[1].initialValue || this.saveOldClient.houseCode
            if (this.chineseNameObj.projectName) {
              sobj.signContractOnLineVo.project = this.chineseNameObj.projectName
            } else {
              sobj.signContractOnLineVo.project = this.saveOldClient.project
            }
            if (this.chineseNameObj.buildingName) {
              sobj.signContractOnLineVo.building = this.chineseNameObj.buildingName
            } else {
              sobj.signContractOnLineVo.building = this.saveOldClient.building
            }
            if (this.chineseNameObj.houseName) {
              sobj.signContractOnLineVo.house = this.chineseNameObj.houseName
            } else {
              sobj.signContractOnLineVo.house = this.saveOldClient.house
            }
          }
          if (this.chooesZhishangList.length == 0 && this.chooesJinshangList.length == 0) {
            this.$message.info('请至少选择一个产品系列!')
            return
          }
          if (!sobj.signContractOnLineVo.measuredArea) {
            this.$message.info('请重新编辑实测面积!')
            return
          }
          if (!this.holdData.houseAddress) {
            this.$message.info('请重新编辑房屋地址!')
            return
          }
          if (sobj.signContractOnLineVo.partAGrantPhone) {
            let aFlag = /^1[0-9]\d{9}$/
            if (!aFlag.test(sobj.signContractOnLineVo.partAGrantPhone)) {
              this.$message.info('联系方式手机号码格式有误，请检测并重新输入!')
              return
            }
          }
          this.$request.post('contract/signing', sobj).then(res => {
            if (res.code === 0) {
              this.$message.success('提交成功')
              this.firstClick = true
              this.getSignStatus()
            }
          })
        }
      })
    },
    // 取消
    cancel () {
      this.$router.go(-1)
    },
    // 判断是否显示撤回按钮
    ifHaveShowFn(scope) {
      if (scope.workOrderStatus !== 0) {
        if (String(scope.signOnlineId) && scope.operation == 2 && scope.contractStatus == 'UNSIGNED') {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    // 历史记录点击合同点击撤回按钮
    reshefFn(adata) {
      let that = this
      this.$confirm({
        title: '撤回合同',
        content: '撤回合同后该合同作废，客户将无法查看合同，无法签约，需要设计师重新发起合同审批之后才可继续签约。是否继续撤回合同的操作？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          that.$request.post('/signContractOnLine/revokeSignContractOnLine/' + adata.contractId + '/' + adata.pricingProposalId).then(res => {
            if (res.code === 0) {
              if (res.result == 0) {
                that.$message.success('撤回成功')
                that.firstQianClick = true
                that.getHistoryList()
              } else {
                that.$message.info('撤回失败')
              }
            }
          })
        },
        onCancel() {
          
        },
      })
    }
  }
}
</script>
<style lang="scss">
@import './css/contract.scss';
</style>
