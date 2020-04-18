<!---->
<template>
  <div class="repertoire_list">
    <div class="top_stepDom">
      <a-steps :current="stepNumFlag">
        <a-step :class="{'myStepDom': this.$route.query.aFlag == 2}" title="标配设置" @click="stepClickThinkFn(stepNumFlag, 0)" />
        <a-step :class="{'myStepDom': this.$route.query.aFlag == 2}" title="空间名" @click="stepClickThinkFn(stepNumFlag, 1)" />
        <a-step :class="{'myStepDom': this.$route.query.aFlag == 2}" title="报价完成" @click="stepClickThinkFn(stepNumFlag, 2)" />
      </a-steps>
    </div>
    <div class="contentDom">
      <!-- 第一步 -->
      <div v-show="stepNumFlag == 0">
        <a-form :form="form">
          <!-- 方案名称 -->
          <a-form-item label="方案名称" v-bind="formItemLayout">
            <a-input size="large" allowClear v-decorator="stepOneData.schemeName.column" placeholder="请输入方案名称!" />
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
        </a-form>
      </div>
      <!-- 第二步 -->
      <div v-show="stepNumFlag == 1">
        <div :style="{ marginBottom: '16px' }">
          <a-button @click="addSpaceThink">新增空间</a-button>
        </div>
        <a-tabs hideAdd type="editable-card" @edit="onEdit" @change="topTabChange" tabPosition="top" :animated="true">
          <a-tab-pane v-for="pane in panesDom" :tab="pane.title" :key="pane.key" :closable="pane.closable">
            <!-- 第一个表格 -->
            <common-offer-table :ref="pane.tableRefDom" :doubleDate="pane.contentTop" :douColumns="sendenTopColums" delbtnText="删除所选主材清单" @deleteThink="sendTopDeleteThink" addbtnText="添加主材清单" @addScience="sendTopAddScience(pane)" @numItemChange="sendTopNumItemChange">
              <a-textarea placeholder="请输入备注" slot="remark" slot-scope="remarkThisData" v-model="remarkThisData.myRemark.remark" v-if="remarkThisData.myRemark.common == 2" @change="aTextareaFn" maxlength="90" />
            </common-offer-table>
            <!-- 第二个表格 -->
            <common-offer-table :ref="pane.tableRefDom" :doubleDate="pane.contentBottom" :douColumns="sendenBottomColums" delbtnText="删除所选工艺清单" @deleteThink="sendBtmDeleteThink" addbtnText="添加工艺清单" @addScience="sendBtmAddScience(pane)" @numItemChange="sendBtmNumItemChange">
              <a-textarea placeholder="请输入备注" slot="remark" slot-scope="remarkThisData" v-model="remarkThisData.myRemark.remark" v-if="remarkThisData.myRemark.common == 2" @change="aTextareaFn" maxlength="90" />
            </common-offer-table>
            <!-- 第一个表格的弹框 -->
            <common-poplur :ref="pane.dialogRefDom" :rowType='1' :dialogData="pane.dialogDataTop" :dialogColums="dialogColumsTop" textMapTitle="主材清单" @sumbitPoplur="materialReplaceTop(pane, $event)" :searchData="searchDataTop" @topSearchThink="topSearchThinkTop(pane, $event)"
            @cannalThink="cannalThinkTop(pane, $event)">
              <template slot="common" slot-scope="commonThisData">
                <a-tag color="blue" v-if="commonThisData.myCommon.common == 1">不通用</a-tag>
                <a-tag color="#f50" v-if="commonThisData.myCommon.common == 2">通用</a-tag>
              </template>
            </common-poplur>
            <!-- 第二个表格的弹框 -->
            <common-poplur :ref="pane.dialogRefDom" :rowType='1' :dialogData="pane.dialogDataBtm" :dialogColums="dialogColumsBtm" textMapTitle="工艺清单" @sumbitPoplur="materialReplaceBtm(pane, $event)" :searchData="searchDataBtm" @topSearchThink="topSearchThinkBtm(pane, $event)"
            @cannalThink="cannalThinkBtm(pane, $event)">
              <template slot="common" slot-scope="commonThisData">
                <a-tag color="blue" v-if="commonThisData.myCommon.common == 1">不通用</a-tag>
                <a-tag color="#f50" v-if="commonThisData.myCommon.common == 2">通用</a-tag>
              </template>
            </common-poplur>
          </a-tab-pane>
        </a-tabs>
        <!-- 点击新增空间的弹框，使用的是全局弹框模块 -->
        <common-modal ref="commonModalDom" :dialogData="spaceDialogData" :textMapTitle="spaceTextMapTitle" @submitThink="spaceSubmitThink" />
        <div v-if="panesDom.length == 0" class="sendTitText">请新增空间</div>
      </div>
      <!-- 第三步 -->
      <div v-show="stepNumFlag == 2">
        <common-offer-table :doubleDate="doubleDateLastOne" :douColumns="douColumnsLastOne" :pagaNumFlag="false" :amountFlag="false" :hasCheckFlag="false">
        </common-offer-table>
        <a-row :gutter="24">
          <a-col :span="16">
            <common-offer-table ref="commonTableLastTwo" :doubleDate="doubleDateLastTwo" :douColumns="douColumnsLastTwo" @deleteThink="deleteThinkLastTwo"
            @addScience="addScienceLastTwo" :pagaNumFlag="false" :amountFlag="false" tabTitle="调整项(优惠等信息)" addbtnText="增加调整项"
            delbtnText="删除调整项" :hasCheckFlag="true" :hasDisbaleFlag="true" @projectNameChange="projectNameChange" @discountsChange="discountsChange" />
            <div class="lastTabBtnDom">
              <a-button type="primary" @click="lastTabSubmit" :disabled="LastTabChagneFlag">提交</a-button>
            </div>
          </a-col>
          <a-col :span="8">
            <div class="orderDom">
              <p class="amount_text">订单总价: {{orderAmount}}元</p>
              <p class="foot_text">总价={{myOrderVolose}}</p>
            </div>
          </a-col>
        </a-row>
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
import { decorOption, mealOption, sendenTopColums, sendenBottomColums, dialogColumsTop, searchDataTop, dialogColumsBtm, searchDataBtm, doubleDateLastOne, douColumnsLastOne, doubleDateLastTwo, douColumnsLastTwo } from '@/common/mymock'
import { packageListSchemeName, packageListDecorationType, packageListMeal } from '@/common/validate'

import { repertoireListOne } from './js/repertoireListOne'
import { repertoireListTwo } from './js/repertoireListTwo'
import { repertoireListThree } from './js/repertoireListThree'

export default {
  data () {
    const panesDom = []
    // const panesDom = [
    //   { key: 1, title: 'Tab 1', contentTop: [], contentBottom: [], tableRefDom: 'tableCommon1', dialogRefDom: 'poplurCommon1', dialogDataTop: [], dialogDataBtm: [], closable: false, isFirstSet: true },
    //   { key: 2, title: 'Tab 2', contentTop: [], contentBottom: [], tableRefDom: 'tableCommon2', dialogRefDom: 'poplurCommon2', dialogDataTop: [], dialogDataBtm: [], closable: false, isFirstSet: true },
    //   { key: 3, title: 'Tab 3', contentTop: [], contentBottom: [], tableRefDom: 'tableCommon3', dialogRefDom: 'poplurCommon3', dialogDataTop: [], dialogDataBtm: [], closable: false, isFirstSet: true }
    // ]
    return {
      doneChangeDecor: false, // 第一步在编辑状态下不允许修改装修类型
      doneChangetaocan: false, // 第一步在编辑状态下不允许修改套餐
      decorPageSize: 10, // 第一步使用套餐下拉框默认每页展示多少条数据
      stepNumFlag: 0,
      decorSelectNum: 1, // 下拉框页数，开始第一页
      saveDecorType: '', // 保存当前选择的装修类型值
      decoratLastOne: false, // 判断选择套餐里面是否是最后的数据的flag
      saveTaocanId: '', // 保存第一步选取的套餐（产品）ID
      saveFirstSuccessId: '', // 保存第一步页面点击下一步时候成功保存信息时候返回的ID（后续步骤需要使用到这个ID）
      saveNowTabId: '', // 点击第一个表格添加主材清单时候记录下当前tab切换栏的id(当前tab的id)
      savePrevTabId: '', // 当this.panesDom的length为1的时候，这个值等于saveNowTabId，当大于1的时候保存为上一个tab的id使用
      orderAmount: '', // 第三步的订单总价
      addTabNumber: 0, // 第三步调整项表格点击添加调整项的key，自增
      LastTabChagneFlag: true, // 判断第三步调整项是否改动，要判断提交校验
      stepOneData: {
        schemeName: { column: packageListSchemeName },
        decorationType: { column: packageListDecorationType, option: decorOption },
        meal: { column: packageListMeal, option: mealOption }
      },
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
      stepName: '下一步',
      spaceTextMapTitle: '请输入空间名称',
      spaceDialogData: [
        { label: '', type: 'text', spanNumber: 11, column: ['spaceName', { rules: [{ required: true, message: '请输入空间名称!' }] }], default: '', value: null, options: null }
      ],
      activeKey: 0,
      panesDom,
      sendenTopColums,
      sendenBottomColums,
      dialogColumsTop,
      searchDataTop,
      dialogColumsBtm,
      searchDataBtm,
      doubleDateLastOne,
      douColumnsLastOne,
      doubleDateLastTwo,
      douColumnsLastTwo,
      myOrderVolose: '', // 公式
    }
  },
  components: {
    commonOfferTable,
    commonPoplur,
    CommonModal
  },
  props: {
  },
  mixins: [repertoireListOne, repertoireListTwo, repertoireListThree],
  created () {
    this.doubleDateLastTwo = []
    this.form.resetFields(['schemeName', 'decorationType', 'meal'])
    this.stepOneData.schemeName.column[1].initialValue = undefined
    this.stepOneData.decorationType.column[1].initialValue = undefined
    this.stepOneData.meal.column[1].initialValue = undefined
    this.stepOneData.meal.option = []
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
  },
  mounted () {
  },
  methods: {
    nexthandleSubmit (e) {
      e.preventDefault()
      if (this.stepNumFlag == 0) {
        this.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            let adata = {
              name: values.schemeName,
              // decorateType: values.decorationType,
              type: this.$route.query.offerState,
              productId: values.meal,
              workOrderId: JSON.parse(sessionStorage.orderValue).id
            }
            // 后续再吧这个代码打开
            // if (this.stepNumFlag < 3) {
            //   this.stepNumFlag += 1
            // }
            let baseUrl = ''
            if (this.saveFirstSuccessId == '') {
              baseUrl = '/quote/insertQuoteBasic'
            } else {
              baseUrl = '/quote/updateQuoteBasic'
              adata.id = this.saveFirstSuccessId
            }
            this.$request.post(baseUrl, adata).then(response => {
              if (response.code == 0) {
                if (this.stepNumFlag < 3) {
                  this.stepNumFlag += 1
                }
                this.saveFirstSuccessId = response.result
                this.$message.success('标配设置保存成功')
                // 编辑状态下从第一部进入第二部获取第二部信息
                if (this.$route.query.aFlag == 2) {
                  this.showSpaceTabFn()
                }
              } else {
                this.$message.error(response.message)
              }
            })
          }
        })
      } else if (this.stepNumFlag == 1) {
        if (this.panesDom.length !== 0) {
          if (this.stepNumFlag < 3) {
            this.stepNumFlag += 1
          }
          this.panesDom.forEach(item => {
            if (item.isFirstSet == true) {
              this.sendenShowFn(item.key)
            }
          })
          // 编辑的时候从第二部进入到第三步时候刷新页面
          if (this.$route.query.aFlag == 2) {
            this.showQuoteAdjustFn()
          }
          let that = this
          setTimeout(function () {
            that.lastPageShowData()
          }, 1000)
          this.stepName = '完成'

          // 获取蓝色订单下面总价公式
          this.getQueryItemFn()
        } else {
          this.$message.info('至少新增一个空间!')
        }
      } else if (this.stepNumFlag == 2) {
        if (this.LastTabChagneFlag == false) {
          this.$message.info('请先提交改动的调整项，在执行操作！')
          return
        }
        var that = this
        this.$success({
          title: '新增清单报价成功！',
          content: (
            <div>
              <p>已成功新增清单报价，点击确认返回报价列表</p>
            </div>
          ),
          okText: '确认',
          onOk: function () {
            that.$router.push({ path: '/offer' })
          }
        })
      }
    },
    lasthandleSubmit (ev) {
      if (this.stepNumFlag == 2) {
        this.stepName = '下一步'
        this.showSpaceTabFn()
      }
      if (this.stepNumFlag > 0) {
        this.stepNumFlag -= 1
      }
      if (this.stepNumFlag == 0 && this.saveFirstSuccessId !== '') {
        this.doneChangeDecor = true
        this.doneChangetaocan = true
      }
    },
    // 编辑时候进来页面第一步，获取第一步数据接口
    firstStepDataFn () {
      this.saveFirstSuccessId = this.$route.query.offerId
      let adata = {
        quoteId: this.$route.query.offerId
      }
      this.$request.post('/quote/queryQuoteById', adata).then(async (response) => {
        if (response.code == 0) {
          this.saveTaocanId = response.result.productId
          this.stepOneData.schemeName.column[1].initialValue = response.result.name
          this.stepOneData.decorationType.column[1].initialValue = response.result.decorateType
          this.decorSelectNum = 1
          this.decorPageSize = 10000
          await this.decoratTypeSelect(response.result.decorateType)
          this.stepOneData.meal.column[1].initialValue = response.result.productId
        } else {
          this.$message.error(response.message)
        }
      })
    },
    // 下面是编辑事件
    // 获取tab的空间信息
    showSpaceTabFn () {
      let adata = {
        quoteId: this.saveFirstSuccessId
      }
      this.panesDom = []
      this.$request.post('/quote/queryQuoteSpaceById', adata).then(response => {
        if (response.code == 0) {
          if (response.result && response.result.length !== 0) {
            response.result.forEach(resu => {
              let asobj = {}
              asobj.key = resu.id
              asobj.title = `${resu.name}`
              asobj.contentTop = []
              asobj.contentBottom = []
              asobj.tableRefDom = `tableCommon${resu.id}`
              asobj.dialogRefDom = `poplurCommon${resu.id}`
              asobj.dialogDataTop = []
              asobj.dialogDataBtm = []
              asobj.closable = false
              asobj.isFirstSet = false
              this.panesDom.push(asobj)
            })
            this.saveNowTabId = response.result[0].id
            this.savePrevTabId = response.result[0].id
            this.panesDom.forEach(pan => {
              pan.editShowDataFlag = false
            })
            // 获取空间信息下面主材信息和工艺信息
            this.getItemListFn()
            this.getCartyListFn()
          }
        }
      })
    },
    // 获取空间信息下面主材信息
    getItemListFn () {
      let sdata = {
        quoteId: this.saveFirstSuccessId,
        spaceId: this.saveNowTabId,
        pageSize: 10000,
        pageNum: 1
      }
      this.$request.post('/quote/queryQuoteItemById', sdata).then(response => {
        if (response.code == 0) {
          if (response.result) {
            this.panesDom.forEach(item => {
              if (item.key == this.saveNowTabId) {
                this.$refs[item.tableRefDom][0].selectedRowKeys = []
                this.$refs[item.tableRefDom][0].chooseListData = []
                this.$refs[item.dialogRefDom][0].selectedRowKeys = []
                this.$refs[item.dialogRefDom][0].chooseHoldData = []
                if (response.result.list) {
                  item.contentTop = response.result.list
                  item.contentTop.forEach(icen => {
                    icen.key = icen.itemId
                    icen.price = icen.itemPrice
                    icen.type = icen.modelType
                    icen.amount = Number(icen.itemNum) * Number(icen.price)
                    this.$refs[item.dialogRefDom][0].selectedRowKeys.push(icen.itemId)
                    this.$refs[item.dialogRefDom][0].chooseHoldData.push(icen)
                  })
                }
                this.spliceRangAllMountTop(item)
              }
            })
          }
        }
      })
    },
    // 获取空间信息下面工艺信息
    getCartyListFn () {
      let sdata = {
        quoteId: this.saveFirstSuccessId,
        spaceId: this.saveNowTabId,
        pageSize: 10000,
        pageNum: 1
      }
      this.$request.post('/quote/queryQuoteCraftById', sdata).then(response => {
        if (response.code == 0) {
          if (response.result) {
            this.panesDom.forEach(item => {
              if (item.key == this.saveNowTabId) {
                this.$refs[item.tableRefDom][1].selectedRowKeys = []
                this.$refs[item.tableRefDom][1].chooseListData = []
                this.$refs[item.dialogRefDom][1].selectedRowKeys = []
                this.$refs[item.dialogRefDom][1].chooseHoldData = []
                if (response.result.list) {
                  item.contentBottom = response.result.list
                  item.contentBottom.forEach(icen => {
                    icen.key = icen.craftId
                    icen.price = icen.craftPrice
                    icen.itemNum = icen.craftNum
                    icen.amount = Number(icen.craftNum) * Number(icen.price)
                    this.$refs[item.dialogRefDom][1].selectedRowKeys.push(icen.craftId)
                    this.$refs[item.dialogRefDom][1].chooseHoldData.push(icen)
                  })
                }
                this.spliceRangAllMountBtm(item)
              }
            })
          }
        }
      })
    },
    // 编辑的时候从第二部进入到第三步时候刷新页面
    showQuoteAdjustFn () {
      let sdata = {
        quoteId: this.saveFirstSuccessId
      }
      this.$request.post('/quote/queryQuoteAdjustById', sdata).then(response => {
        if (response.code == 0) {
          if (response.result) {
            this.doubleDateLastTwo = []
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
              this.doubleDateLastTwo.push(obj)
              this.addTabNumber = Number(this.addTabNumber) + 1
            })
            this.LastTabChagneFlag = true
          }
        }
      })
    },
    // 返回列表事件
    targeGoList () {
      this.$router.push('/offer')
    },
    // 点击步骤条任意跳转
    stepClickThinkFn (stepNum, anowNum) {
      if (this.$route.query.aFlag == 2) {
        if (this.stepNumFlag == 2) {
          this.stepName = '下一步'
        }
        if (this.stepNumFlag == 0 && this.saveFirstSuccessId !== '') {
          this.doneChangeDecor = true
          this.doneChangetaocan = true
        }
        
        if (stepNum == 0) {
          this.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              let adata = {
                name: values.schemeName,
                // decorateType: values.decorationType,
                type: this.$route.query.offerState,
                productId: values.meal,
                workOrderId: JSON.parse(sessionStorage.orderValue).id
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
                  if (this.stepNumFlag < 3) {
                    this.stepNumFlag += 1
                  }
                  this.saveFirstSuccessId = response.result
                  this.$message.success('标配设置保存成功')
                  // 设置当前stepNumFlag位置，并执行当前点击页面要调用的接口
                  this.stepNumFlag = anowNum
                  this.nowTabShowFn(anowNum)
                } else {
                  this.$message.error(response.message)
                }
              })
            }
          })
        } else if (stepNum == 1) {
          if (this.panesDom.length !== 0) {
            this.panesDom.forEach(item => {
              if (item.isFirstSet == true) {
                this.sendenShowFn(item.key)
              }
            })
            // 设置当前stepNumFlag位置，并执行当前点击页面要调用的接口
            this.stepNumFlag = anowNum
            this.nowTabShowFn(anowNum)
          } else {
            this.$message.info('至少新增一个空间!')
          }
        } else if (stepNum == 2) {
          if (this.LastTabChagneFlag == false) {
            this.$message.info('请先提交改动的调整项，在执行操作！')
          } else {
            // 设置当前stepNumFlag位置，并执行当前点击页面要调用的接口
            this.stepNumFlag = anowNum
            this.nowTabShowFn(anowNum)
          }
        }
        if (anowNum == 2) {
          this.getQueryItemFn()
        }
      }
    },
    nowTabShowFn (anowNum) {
      if (anowNum == 0) {
        this.firstStepDataFn()
      } else if (anowNum == 1) {
        this.showSpaceTabFn()
      } else if (anowNum == 2) {
        this.showQuoteAdjustFn()
        let that = this
        setTimeout(function () {
          that.lastPageShowData()
        }, 1000)
        this.stepName = '完成'
      }
    }
  }
}
</script>

<style lang="scss">
@import './css/repertoire_list.scss';
</style>
