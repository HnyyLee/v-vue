<!---->
<template>
  <div class="package_list">
    <div class="top_stepDom">
      <a-steps :current="stepNumFlag">
        <a-step :class="{'myStepDom': this.$route.query.aFlag == 2}" title="标配设置" @click="stepClickThinkFn(stepNumFlag, 0)" />
        <a-step :class="{'myStepDom': this.$route.query.aFlag == 2}" title="主材升级" @click="stepClickThinkFn(stepNumFlag, 1)" />
        <a-step :class="{'myStepDom': this.$route.query.aFlag == 2}" title="主材选配" @click="stepClickThinkFn(stepNumFlag, 2)" />
        <a-step :class="{'myStepDom': this.$route.query.aFlag == 2}" title="个性化施工" @click="stepClickThinkFn(stepNumFlag, 3)" />
        <a-step :class="{'myStepDom': this.$route.query.aFlag == 2}" title="其他" @click="stepClickThinkFn(stepNumFlag, 4)" />
        <a-step :class="{'myStepDom': this.$route.query.aFlag == 2}" title="报价完成" @click="stepClickThinkFn(stepNumFlag, 5)" />
      </a-steps>
    </div>
    <div class="contentDom">
      <!-- 第一步 -->
      <div v-show="stepNumFlag == 0">
        <a-form :form="form">
          <!-- 方案名称 -->
          <a-form-item label="方案名称" v-bind="formItemLayout">
            <a-input size="large" allowClear v-decorator="stepOneData.schemeName.column" placeholder="请输入方案名称!" :maxlength="50" />
          </a-form-item>
          <!-- 装修类型(暂时隐藏,并直接调用使用套餐的接口) -->
          <!-- <a-form-item label="装修类型" v-bind="formItemLayout">
            <a-select size="large" allowClear v-decorator="stepOneData.decorationType.column" placeholder="请选择装修类型" @select="decoratTypeSelect" @change="decorTypeChange" :disabled="doneChangeDecor">
              <a-select-option v-for="sel in stepOneData.decorationType.option" :key="sel.value">{{sel.label}}</a-select-option>
            </a-select>
          </a-form-item> -->
          <!-- 使用套餐 -->
          <a-form-item label="使用套餐" v-bind="formItemLayout">
            <a-select size="large" notFoundContent="请先选择装修类型" @change="taocanSelectChange" allowClear v-decorator="stepOneData.meal.column" placeholder="请选择使用套餐" @popupScroll="mealPopScrollThink" :disabled="doneChangetaocan">
              <a-select-option v-for="sel in stepOneData.meal.option" :key="sel.id">{{sel.name}}</a-select-option>
            </a-select>
          </a-form-item>
          <!-- 产品系列 -->
          <a-form-item label="产品系列" v-bind="formItemLayout" class="rangSpliceDom">
            <a-table :bordered='true' :columns="areaRangColumns" :dataSource="areaRangDataSource" :pagination="false" :locale="{emptyText: '暂无产品系列'}">
              <span slot="areaMeasure" slot-scope="record, text">
                <!-- <a-input-number style="width: 150px;" step="0.01" :min="0" :maxlength="8" :max="9999" v-model="text.areaNum" @change="e => areaRangChange(e, text.key, text)" /><span style="margin-left: 10px" >{{record}}</span> -->
                <a-input type="number" min="0" step="0.01" style="width: 150px;" v-model="text.areaNum" @change="e => areaRangChange(e.target.value, text.key, text, e)" /><span style="margin-left: 10px" >{{record}}</span>
              </span>
              <span slot="action" slot-scope="record, text">
                <a-button size="small" @click="areaRangOnlyDelete(record, text)" >删除</a-button>
              </span>
            </a-table>
          </a-form-item>
          <a-form-item label="分项合计" v-bind="formItemLayout">
            <a-input size="large" class="holdNumDom" allowClear :disabled="true" v-model="allMount" />元
            <a-button key="submit" class="addConstrDom" type="primary" @click="addConstruction" >新增产品系列</a-button>
          </a-form-item>
        </a-form>
        <common-modal ref="commonModalDom" :dialogData="firstDialogData" :textMapTitle="textMapTitle" @submitThink="firstSubmitThink" />
      </div>
      <!-- 第二步 -->
      <div v-show="stepNumFlag == 1">
        <a-tabs hideAdd type="editable-card" tabPosition="top" :animated="true" @change="twoTabChange">
          <a-tab-pane v-for="aitem in twoPandDom" :tab="aitem.title" :key="aitem.key" :closable="aitem.closable" :forceRender="true">
            <common-offer-table :ref="aitem.tableRefDom" :doubleDate="aitem.contentData" :douColumns="douColumnsOne"  @actionThink="upgradeOne" @numItemChange="numItemChangeOne" :hasCheckFlag="false">
              <a-textarea placeholder="请输入备注" slot="remark" slot-scope="remarkThisData" v-model="remarkThisData.myRemark.remark" v-if="remarkThisData.myRemark.common == 2" maxlength="90" />
            </common-offer-table>
            <common-poplur :dialogColums="dialogColumsOne" :dialogData="aitem.dialogData" :ref="aitem.dialogRefDom" textMapTitle="主材升级" @sumbitPoplur="materialReplaceOne">
              <template slot="common" slot-scope="commonThisData">
                <a-tag color="blue" v-if="commonThisData.myCommon.common == 1">不通用</a-tag>
                <a-tag color="#f50" v-if="commonThisData.myCommon.common == 2">通用</a-tag>
              </template>
            </common-poplur>
          </a-tab-pane>
        </a-tabs>
        <p>总的合计：{{twoAllMount}}</p>
      </div>
      <!-- 第三步 -->
      <div v-show="stepNumFlag == 2">
        <a-tabs hideAdd type="editable-card" tabPosition="top" :animated="true" @change="topTabChange">
          <a-tab-pane v-for="aitem in panesDom" :tab="aitem.title" :key="aitem.key" :closable="aitem.closable" :forceRender="true">
            <common-offer-table :ref="aitem.tableRefDom" :doubleDate="aitem.contentData" :douColumns="douColumnsTwo" @deleteThink="deleteThinkTwo(aitem.contentData, $event)" @actionThink="upgradeTwo(aitem, $event)" addbtnText="添加主材" @addScience="addScienceTwo(aitem)" @numItemChange="numItemChangeTwo" delbtnText="删除所选的主材" :commonDelAbled="aitem.commonDelAbled" :commonAddAbled="aitem.commonAddAbled">
              <a-textarea placeholder="请输入备注" slot="remark" slot-scope="remarkThisData" v-model="remarkThisData.myRemark.remark" v-if="remarkThisData.myRemark.common == 2" maxlength="90" style="min-width: 100px;" />
            </common-offer-table>
            <common-poplur :ref="aitem.dialogRefDom" :dialogColums="dialogColumsTwo" :dialogData="aitem.dialogData" textMapTitle="主材选配" @sumbitPoplur="materialReplaceTwo(aitem, $event)"
            :searchData="searchDataTwo" :rowType='1' @topSearchThink="topSearchThinkTwo(aitem, $event)" @cannalThink="cannalThinkTwo(aitem, $event)" >
              <template slot="common" slot-scope="commonThisData">
                <a-tag color="blue" v-if="commonThisData.myCommon.common == 1">不通用</a-tag>
                <a-tag color="#f50" v-if="commonThisData.myCommon.common == 2">通用</a-tag>
              </template>
            </common-poplur>
          </a-tab-pane>
        </a-tabs>
        <p>总的合计：{{threeAllMount}}</p>
      </div>
      <!-- 第四步 -->
      <div v-show="stepNumFlag == 3">
        <common-offer-table ref="commonTableThree" :doubleDate="doubleDateThree" :douColumns="douColumnsThree" @deleteThink="deleteThinkThree" @actionThink="upgradeThree"
        addbtnText="添加工艺" @addScience="addScienceThree"  @numItemChange="numItemChangeThree" delbtnText="删除所选工艺定额">
          <a-textarea placeholder="请输入备注" slot="remark" slot-scope="remarkThisData" v-model="remarkThisData.myRemark.remark" v-if="remarkThisData.myRemark.common == 2" maxlength="90" />
        </common-offer-table>
        <common-poplur ref="commonPoplurThree" :dialogColums="dialogColumsThree" :dialogData="dialogDataThree" textMapTitle="添加工艺" @sumbitPoplur="materialReplaceThree" :searchData="searchDataThree" :rowType='1' @topSearchThink="topSearchThinkThree" @cannalThink="cannalThinkThree">
          <template slot="common" slot-scope="commonThisData">
            <a-tag color="blue" v-if="commonThisData.myCommon.common == 1">不通用</a-tag>
            <a-tag color="#f50" v-if="commonThisData.myCommon.common == 2">通用</a-tag>
          </template>
        </common-poplur>
      </div>
      <!-- 第五步 -->
      <div v-show="stepNumFlag == 4">
        <common-offer-table ref="commonTableFour" :doubleDate="doubleDateFour" :douColumns="douColumnsFour" @deleteThink="deleteThinkFour" @actionThink="upgradeFour"
        addbtnText="添加其他" @addScience="addScienceFour" @numItemChange="numItemChangeFour" delbtnText="删除所选其他数据">
          <a-textarea placeholder="请输入备注" slot="remark" slot-scope="remarkThisData" v-model="remarkThisData.myRemark.remark" v-if="remarkThisData.myRemark.common == 2" maxlength="90" />
        </common-offer-table>
        <common-poplur ref="commonPoplurFour" :dialogColums="dialogColumsFour" :dialogData="dialogDataFour" textMapTitle="添加其他" @sumbitPoplur="materialReplaceFour" :searchData="searchDataFour" :rowType='1' @topSearchThink="topSearchThinkFour" @cannalThink="cannalThinkFour" >
          <template slot="common" slot-scope="commonThisData">
            <a-tag color="blue" v-if="commonThisData.myCommon.common == 1">不通用</a-tag>
            <a-tag color="#f50" v-if="commonThisData.myCommon.common == 2">通用</a-tag>
          </template>
        </common-poplur>
      </div>
      <!-- 第六步 -->
      <div v-show="stepNumFlag == 5">
          <common-offer-table :doubleDate="doubleDateFive" :douColumns="douColumnsFive" :pagaNumFlag="false" :amountFlag="false" :hasCheckFlag="false">
          </common-offer-table>
          <a-row :gutter="24">

            <a-col :span="16">
              <common-offer-table ref="commonTableSeven" :doubleDate="doubleDateSeven" :douColumns="douColumnsSeven" @deleteThink="deleteThinkSeven"
              @addScience="addScienceSeven" :pagaNumFlag="false" :amountFlag="false" tabTitle="主材折减" addbtnText="增加折减"
              delbtnText="删除折减项" :hasCheckFlag="true" :hasDisbaleFlag="true" @numItemChange="numItemChangeSeven" />
              
              <common-offer-table ref="commonTableSix" :doubleDate="doubleDateSix" :douColumns="douColumnsSix" @deleteThink="deleteThinkSix"
              @addScience="addScienceSix" :pagaNumFlag="false" :amountFlag="false" tabTitle="调整项(优惠等信息)" addbtnText="增加调整项"
              delbtnText="删除调整项" :hasCheckFlag="true" :hasDisbaleFlag="true" @projectNameChange="projectSixChange"  @discountsChange="discountsSixChange"/>

              <div class="lastTabBtnDom">
                <a-button type="primary" @click="lastTabSubmit" :disabled="showDisableFn">提交</a-button>
              </div>
            </a-col>

            <a-col :span="8">
              <div class="orderDom">
                <p class="amount_text">订单总价: {{orderAmount}}元</p>
                <p class="foot_text">总价={{orderTotalFormula}}</p>
              </div>
            </a-col>
          </a-row>
          <common-poplur :dialogColums="dialogColumsSeven" :dialogData="dialogDataSeven" ref="commonPoplurSeven" textMapTitle="添加折减" @sumbitPoplur="materialReplaceSeven" @cannalThink="cannalThinkSeven" :searchData="searchDataSeven" @topSearchThink="topSearchThinkSeven" />
      </div>
      <!-- 上下步骤 -->
      <div class="buttonDom">
        <a-button size="large" class="lastBtnDom" @click="targeGoList" v-if="stepNumFlag == 0">返回列表</a-button>
        <a-button size="large" type="primary" class="lastBtnDom" @click="lasthandleSubmit" v-if="stepNumFlag !== 0">上一步</a-button>
        <a-button size="large" type="primary" class="nextBtnDom" @click="nexthandleSubmit">{{stepName}}</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import CommonModal from '@/components/CommonModal'
import commonOfferTable from './commonOfferTable/commonOfferTable'
import commonPoplur from './commonPoplur/commonPoplur'
import { decorOption, mealOption, areaRangColumns, OPTIONS, douColumnsOne, douColumnsTwo, areaRangDataSource, doubleDateOne, doubleDateTwo, dialogColumsOne, dialogDataOne, searchDataTwo, dialogColumsTwo, dialogDataTwo, doubleDateThree, douColumnsThree, dialogColumsThree, dialogDataThree, searchDataThree, doubleDateFour, douColumnsFour, searchDataFour, dialogColumsFour, dialogDataFour, doubleDateFive, douColumnsFive, doubleDateSix, douColumnsSix, doubleDateSeven, douColumnsSeven, dialogColumsSeven, dialogDataSeven, searchDataSeven } from '@/common/mymock'
import { packageListSchemeName, packageListDecorationType, packageListMeal } from '@/common/validate'
import { mixin } from './js/packageListMixin'
import { packageListOne } from './js/packageListOne'
import { packageListTwo } from './js/packageListTwo'
import { packageListThree } from './js/packageListThree'
import { packageListFour } from './js/packageListFour'
import { packageListFive } from './js/packageListFive'
import { packageListSix } from './js/packageListSix'

export default {
  data () {
    var panesDom = []
    panesDom = [
      { key: 1, title: 'Tab 1', contentData: [], dialogData: [], closable: false, tableRefDom: 'tableCommon1', dialogRefDom: 'poplurCommon1' },
      { key: 2, title: 'Tab 2', contentData: [], dialogData: [], closable: false, tableRefDom: 'tableCommon2', dialogRefDom: 'poplurCommon2' }
    ]
    return {
      doneChangeDecor: false, // 第一步在编辑状态下不允许修改装修类型
      doneChangetaocan: false, // 第一步在编辑状态下不允许修改套餐
      decorPageSize: 10, // 第一步使用套餐下拉框默认每页展示多少条数据
      showNewAddRang: true, // 第一步当装修类型为2整装的时候不显示新增产品系列按钮和删除按钮
      decorSelectNum: 1, // 下拉框页数，开始第一页
      saveDecorType: '', // 保存当前选择的装修类型值
      decoratLastOne: false, // 判断选择套餐里面是否是最后的数据的flag
      areaRangList: [], // 保存第一步调取产品系列列表接口，每个产品系列单独的一行数据
      saveTaocanId: '', // 保存第一步选取的套餐（产品）ID
      saveFirstSuccessId: '', // 保存第一步页面点击下一步时候成功保存信息时候返回的ID（后续步骤需要使用到这个ID）
      saveUpgradId: '', // 点击升级时候保存当前行的id
      orderAmount: '', // 第六步的订单总价
      addTabNumber: 0, // 第六步调整项表格点击添加调整项的key，自增
      LastTabChagneFlag: true, // 判断第六步调整项是否改动，要判断提交校验
      reductionFlag: true, // 判断第六步折减是否改动，要判断提交校验
      spinning: false, // 第六步加载中
      orderTotalFormula: '', // 第六步订单总价下面计算公司
      panesDom, // 第三步tab产品系列的大数组
      saveNowTabId: '', // 第三步点击表格添加主材时候记录下当前tab切换栏的id(当前tab的id)
      threeAllMount: 0, // 第三步总的合计
      threeAllListData: [], // 编辑时候第三步调用queryQuoteItemById接口拿到的总的数据
      saveNewThreeData: true, // 从第三步页面点击上一步到第二步，并且当前是处于新增（url里面aFlag为1）的时候，判断时候要清空第三步的panesDom
      allMount: '',
      stepNumFlag: 0,
      stepOneData: {
        schemeName: { column: packageListSchemeName },
        decorationType: { column: packageListDecorationType, option: decorOption },
        meal: { column: packageListMeal, option: mealOption }
      },
      areaRangColumns,
      areaRangDataSource,
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        }
      },
      textMapTitle: '请选择需新增的产品系列',
      firstDialogData: [
        { label: '', type: 'select', spanNumber: 11, column: ['construction', { rules: [{ required: true, message: '请选择新增的产品系列!' }] }], default: '', value: null, options: OPTIONS }
      ],
      stepName: '下一步',
      doubleDateOne,
      doubleDateTwo,
      douColumnsOne,
      douColumnsTwo,
      dialogColumsOne,
      dialogDataOne,
      searchDataTwo,
      dialogColumsTwo,
      dialogDataTwo,
      doubleDateThree,
      douColumnsThree,
      dialogColumsThree,
      dialogDataThree,
      searchDataThree,
      doubleDateFour,
      douColumnsFour,
      searchDataFour,
      dialogColumsFour,
      dialogDataFour,
      doubleDateFive,
      douColumnsFive,
      doubleDateSix,
      douColumnsSix,
      doubleDateSeven,
      douColumnsSeven,
      dialogColumsSeven,
      dialogDataSeven,
      searchDataSeven
    }
  },
  components: {
    CommonModal,
    commonOfferTable,
    commonPoplur
  },
  props: {
  },
  mixins: [mixin, packageListOne, packageListTwo, packageListThree, packageListFour, packageListFive, packageListSix],
  created () {
    this.form.resetFields()
    this.doubleDateSix = []
    this.areaRangDataSource = []
    this.form.resetFields(['schemeName', 'decorationType', 'meal'])
    this.stepOneData.schemeName.column[1].initialValue = undefined
    this.stepOneData.decorationType.column[1].initialValue = undefined
    this.stepOneData.meal.column[1].initialValue = undefined
    this.stepOneData.meal.option = []
    this.allMount = ''
    if (this.$route.query.aFlag == 2) {
      this.firstStepDataFn()
    }
    if (this.$route.query.aFlag == 2 || this.saveFirstSuccessId !== '') {
      this.doneChangeDecor = true
      this.doneChangetaocan = true
    } else {
      this.doneChangeDecor = false
      this.doneChangetaocan = false
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  computed: {
    myallSping () {
      return this.$store.state.app.allSping
    },
    showDisableFn() {
      if (this.LastTabChagneFlag == false || this.reductionFlag == false) {
        return false
      } else {
        return true
      }
    }
  },
  mounted () {
  },
  methods: {
    // 进来页面第一步，获取第一步数据接口
    firstStepDataFn () {
      this.saveFirstSuccessId = this.$route.query.offerId
      let adata = {
        quoteId: this.$route.query.offerId
      }
      this.nowshowMyData(adata)
    },
    nowshowMyData(adata) {
      this.$request.post('/quote/queryQuoteById', adata).then(async (response) => {
        if (response.code == 0) {
          this.saveTaocanId = response.result.productId
          this.stepOneData.schemeName.column[1].initialValue = response.result.name
          this.stepOneData.decorationType.column[1].initialValue = response.result.decorateType
          this.decorSelectNum = 1
          this.decorPageSize = 10000
          await this.decoratTypeSelect(response.result.decorateType)
          this.stepOneData.meal.column[1].initialValue = response.result.productId
          this.areaRangDataSource = response.result.quoteRangeVoList
          this.areaRangDataSource.forEach((item, index) => {
            item.key = index
            item.areaNum = item.area
            item.myRangeId = item.productRangeId
            item.areaMeasure = 'm²'
            if (item.priceType == 1) {
              item.remark = `${index + 1}、计价方式：一口价。按${item.rangeName}实测面积计价，计价起步面积为${item.startArea}m²，不足${item.startArea}m²按${item.startArea}m²计算，起步价格为${item.startPrice}元；每超出${item.perSquare}m²的部分，加收${item.perSquarePrice}元`
              if (Number(item.area) > Number(item.startArea)) {
                let alnum = [(Number(item.area) - Number(item.startArea)) / Number(item.perSquare)] * Number(item.perSquarePrice) + Number(item.startPrice)
                item.onlyAllMount = alnum
              } else {
                item.onlyAllMount = Number(item.startPrice)
              }
            } else if (item.priceType == 2) {
              item.remark = `${index + 1}、计价方式：按平米计价。${item.rangeName}：${item.perSquarePrice}元/m²；起步面积${item.startArea}m²，低于${item.startArea}m²则按照${item.startArea}m²来计算`
              item.onlyAllMount = Number(item.area) * Number(item.perSquarePrice)
            }
          })
          this.allMount = response.result.rangeFee
        } else {
          this.$message.error(response.message)
        }
      })
    },
    // 下面是编辑事件
    // 新增和编辑的时候从第二部进入到第三步时候拿取产品系列下拉框数据(现在新增也需要调用这个接口)
    showQuoteItemFn (itrue) {
      let sdata = {
        quoteId: this.saveFirstSuccessId
      }
      this.$request.post('/quote/queryQuoteRangeById', sdata).then(response => {
        if (response.code == 0) {
          this.areaRangList = response.result
          this.saveNowTabId = this.areaRangList[0].id
          if (this.saveNewThreeData == true) {
            this.panesDom = []
            this.areaRangList.forEach(rang => {
              let asobj = {}
              asobj.key = rang.id
              asobj.title = rang.rangeName
              asobj.closable = false
              asobj.contentData = []
              asobj.dialogData = []
              asobj.tableRefDom = `tableCommon${rang.id}`
              asobj.dialogRefDom = `poplurCommon${rang.id}`
              // 加入是否操作里面删除按钮和新增按钮是否置灰的判断
              asobj.commonDelAbled = rang.isOption == 1 ? false : true
              asobj.commonAddAbled = rang.isOption == 1 ? false : true
              this.panesDom.push(asobj)
            })
          }
          if (itrue == 'itrue' || this.$route.query.aFlag == 2) {
            // 新增的时候从第二部进入到第三步的时候也要调用接口
            this.showAddQuoteListFn()
          }
        }
      })
    },
    // 新增的时候从第二部进入到第三步时候刷新页面 或者 编辑的时候从第二部进入到第三步时候刷新页面
    showAddQuoteListFn () {
      let sdata = {
        quoteId: this.saveFirstSuccessId,
        itemType: 3,
        pageSize: 10000,
        pageNum: 1
      }
      this.$request.post('/quote/queryQuoteItemById', sdata).then(response => {
        if (response.code == 0) {
          this.panesDom.forEach(item => {
            if (item.key == this.saveNowTabId) {
              item.contentData = []
              this.$refs[item.dialogRefDom][0].chooseHoldData = []
              this.$refs[item.dialogRefDom][0].selectedRowKeys = []
            }
          })
          if (response.result.list) {
            this.panesDom.forEach(item => {
              item.contentData = []
            })

            this.threeAllListData = response.result.list
            this.panesDom.forEach((pand, index) => {
              this.threeAllListData.forEach(all => {
                if (pand.key == all.rangeId) {
                  this.panesDom[index].contentData.push(all)
                }
              })
            })

            this.panesDom.forEach(iden => {
              iden.contentData.forEach(iun => {
                iun.key = iun.itemId
                iun.price = iun.itemPrice
                iun.action = '删除'
                iun.myRangId = iun.rangeId
                iun.type = iun.modelType
                iun.amount = Number(iun.itemNum) * Number(iun.price)
                this.$refs[iden.dialogRefDom][0].selectedRowKeys.push(iun.itemId)
              })
              this.$refs[iden.dialogRefDom][0].chooseHoldData = iden.contentData
            })
            this.changeTabListFn()
          }
        }
      })
    },
    // 编辑的时候从第三部进入到第四步时候刷新页面
    showQuoteCraftsFn () {
      let sdata = {
        quoteId: this.saveFirstSuccessId,
        craftType: '1',
        pageSize: 10000,
        pageNum: 1
      }
      this.$request.post('/quote/queryQuoteCraftById', sdata).then(response => {
        if (response.code == 0) {
          this.doubleDateThree = []
          this.$refs.commonPoplurThree.chooseHoldData = []
          this.$refs.commonPoplurThree.selectedRowKeys = []
          if (response.result.list) {
            this.doubleDateThree = response.result.list
            this.doubleDateThree.forEach(item => {
              item.key = item.craftId
              item.price = item.craftPrice
              item.itemNum = item.craftNum
              item.action = '删除'
              this.$refs.commonPoplurThree.selectedRowKeys.push(item.craftId)
            })
            this.$refs.commonPoplurThree.chooseHoldData = this.doubleDateThree
            this.spliceRangAllMountThree()
          }
        }
      })
    },
    // 编辑的时候从第四部进入到第五步时候刷新页面
    showQuoteOrtherFn () {
      let sdata = {
        quoteId: this.saveFirstSuccessId,
        craftType: '2',
        pageSize: 10000,
        pageNum: 1
      }
      this.$request.post('/quote/queryQuoteCraftById', sdata).then(response => {
        if (response.code == 0) {
          this.doubleDateFour = []
          this.$refs.commonPoplurFour.chooseHoldData = []
          this.$refs.commonPoplurFour.selectedRowKeys = []
          if (response.result.list) {
            this.doubleDateFour = response.result.list
            this.doubleDateFour.forEach(item => {
              item.key = item.craftId
              item.price = item.craftPrice
              item.itemNum = item.craftNum
              item.action = '删除'
              this.$refs.commonPoplurFour.selectedRowKeys.push(item.craftId)
            })
            this.$refs.commonPoplurFour.chooseHoldData = this.doubleDateFour
            this.spliceRangAllMountFour()
          }
        }
      })
    },
    // 编辑的时候从第五部进入到第六步时候刷新页面
    showQuoteAdjustFn () {
      let sdata = {
        quoteId: this.saveFirstSuccessId
      }
      this.$request.post('/quote/queryQuoteAdjustById', sdata).then(response => {
        if (response.code == 0) {
          if (response.result) {
            this.doubleDateSix = []
            this.addTabNumber = 0
            response.result.forEach(item => {
              let obj = {
                key: this.addTabNumber,
                codeName: `调整项${Number(this.addTabNumber) + 1}`,
                name: item.name,
                discounts: item.discounts,
                Nametext: '请输入调整项名称',
                discountText: '请输入金额'
              }
              this.doubleDateSix.push(obj)
              this.addTabNumber = Number(this.addTabNumber) + 1
            })
            this.LastTabChagneFlag = true
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import './css/package_list.scss'
</style>
