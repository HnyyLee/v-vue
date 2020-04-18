<!---->
<template>
  <div class="custom_list">
    <a-spin :spinning="spinning">
      <a-form :form="form">
        <!-- 方案名称 -->
        <a-form-item label="方案名称" v-bind="formItemLayout" >
          <a-input size="large" allowClear v-decorator="stepOneData.schemeName.column" maxlength="50" placeholder="请输入方案名称!" />
        </a-form-item>
        <!-- 装修类型(暂时隐藏,并直接调用使用套餐的接口) -->
        <!-- <a-form-item label="装修类型" v-bind="formItemLayout">
          <a-select size="large" allowClear v-decorator="stepOneData.decorationType.column" placeholder="请选择装修类型" @select="decoratTypeSelect" @change="decorTypeChange" :disabled="doneChangeDecor">
            <a-select-option v-for="sel in stepOneData.decorationType.option" :key="sel.value">{{sel.label}}</a-select-option>
          </a-select>
        </a-form-item> -->
        <!-- 适用产品 -->
        <a-form-item label="适用产品" v-bind="formItemLayout">
          <a-select size="large" notFoundContent="请先选择装修类型" @change="taocanSelectChange" allowClear v-decorator="stepOneData.meal.column" placeholder="请选择适用产品" @popupScroll="mealPopScrollThink" :disabled="doneChangetaocan">
            <a-select-option v-for="sel in stepOneData.meal.option" :key="sel.id">{{sel.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <!-- 工程直接费 -->
        <a-form-item label="工程直接费" v-bind="formItemLayout">
          <a-input size="large" allowClear v-decorator="stepOneData.directFee.column" placeholder="请输入工程直接费!" />
        </a-form-item>
        <!-- 主材费用 -->
        <!-- <a-form-item label="主材费" v-bind="formItemLayout">
          <a-input size="large" allowClear v-decorator="stepOneData.advocateMaterialFee.column" placeholder="请输入主材费!" />
        </a-form-item> -->
        <!-- 辅材费用 -->
        <!-- <a-form-item label="辅材费" v-bind="formItemLayout">
          <a-input size="large" allowClear v-decorator="stepOneData.auxiliaryMaterialFee.column" placeholder="请输入辅材费!" />
        </a-form-item> -->
        <!-- 人工费用 -->
        <!-- <a-form-item label="人工费用" v-bind="formItemLayout">
          <a-input size="large" allowClear v-decorator="stepOneData.personFee.column" placeholder="请输入人工费用!" />
        </a-form-item> -->
        <!-- 其他 -->
        <!-- <a-form-item label="其他" v-bind="formItemLayout">
          <a-input size="large" allowClear v-decorator="stepOneData.otherFee.column" placeholder="请输入其他!" />
        </a-form-item> -->
        <!-- 税点 -->
        <a-form-item label="税费" v-bind="formItemLayout" class="spliceDom">
          <a-input size="large" allowClear v-decorator="stepOneData.rateFee.column" placeholder="请输入方案名称!" /><span class="mySpan">元</span>
        </a-form-item>
        <!-- <div class="lineDom">
          <div class="oneOnly">
            <a-form-item label="税点" style="display:flex; flex: 1; margin-left: 6%;">
              <a-input style="width: 200px" size="large" allowClear v-decorator="stepOneData.rate.column" placeholder="请输入方案名称!" />
            </a-form-item>
            <a-form-item label="税费" style="display:flex; flex: 1;">
              <a-input style="width: 200px" size="large" allowClear v-decorator="stepOneData.rateFee.column" placeholder="请输入方案名称!" />元
            </a-form-item>
          </div>
        </div> -->
        <!-- 管理费点 -->
        <a-form-item label="管理费" v-bind="formItemLayout" class="spliceDom">
          <a-input size="large" allowClear v-decorator="stepOneData.manageFee.column" placeholder="请输入管理费!" /><span class="mySpan">元</span>
        </a-form-item>
        <!-- <div class="lineDom">
          <div class="oneOnly">
            <a-form-item label="管理费点" style="display:flex; flex: 1; margin-left: 6%;">
              <a-input style="width: 200px" size="large" allowClear v-decorator="stepOneData.manageRate.column" placeholder="请输入管理费点!" />
            </a-form-item>
            <a-form-item label="管理费" style="display:flex; flex: 1;">
              <a-input style="width: 200px" size="large" allowClear v-decorator="stepOneData.manageFee.column" placeholder="请输入管理费!" />元
            </a-form-item>
          </div>
        </div> -->
        <!-- 折扣 -->
        <a-form-item label="其他费用" v-bind="formItemLayout" class="spliceDom">
          <a-input size="large" allowClear v-decorator="stepOneData.discountFee.column" placeholder="请输入其他费用!" /><span class="amySpan">元(优惠请使用负数代替)</span>
        </a-form-item>
        <!-- <div class="lineDom">
          <div class="oneOnly">
            <a-form-item label="折扣" style="display:flex; flex: 1; margin-left: 6%;">
              <a-input style="width: 200px" size="large" allowClear v-decorator="stepOneData.discountRate.column" placeholder="请输入折扣!" />
            </a-form-item>
            <a-form-item label="金额" style="display:flex; flex: 1;">
              <a-input style="width: 200px" size="large" allowClear v-decorator="stepOneData.discountFee.column" placeholder="请输入金额!" />元
            </a-form-item>
          </div>
        </div> -->
        <!-- 订单总价 -->
        <div class="orderDom" v-if="orderFlag">
          <p class="amount_text">订单总价: {{orderAmount}}元</p>
          <p class="foot_text">总价=工程直接费+税费+管理费+其他费用</p>
        </div>
      </a-form>
      <div class="buttonDom">
        <a-button size="large" class="lastBtnDom" @click="targeGoList">返回列表</a-button>
        <a-button size="large" type="primary" class="lastBtnDom" @click="handleSubmit">{{submitName}}</a-button>
      </div>
    </a-spin>
  </div>
</template>

<script>

import { decorOption, mealOption } from '@/common/mymock'
import { packageListSchemeName, packageListDecorationType, packageListMeal, customDirectFee, customAdvocateMaterialFee, customAuxiliaryMaterialFee, customPersonFee, customOtherFee, customAate, customAateFee, customManageRate, customManageFee, customDiscountRate, customDiscountFee } from '@/common/validate'

export default {
  data () {
    return {
      doneChangeDecor: false, // 第一步在编辑状态下不允许修改装修类型
      doneChangetaocan: false, // 第一步在编辑状态下不允许修改套餐
      orderAmount: 0, // 订单总价
      decorPageSize: 10, // 第一步使用套餐下拉框默认每页展示多少条数据
      decorSelectNum: 1, // 下拉框页数，开始第一页
      saveDecorType: '', // 保存当前选择的装修类型值
      decoratLastOne: false, // 判断选择套餐里面是否是最后的数据的flag
      saveTaocanId: '', // 保存选取的套餐（产品）ID
      orderFlag: false, // 先点击提交之后才会展示出这个订单总价
      submitName: '提交', // 点击提交之后变为完成
      saveFirstSuccessId: '', // 保存点击提交时候成功保存信息时候返回的ID（后续步骤需要使用到这个ID）
      spinning: false, // 加载中
      addOrEditFlag: false, // 刚开始是新增，提交之后改为编辑
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 16 },
          sm: { span: 8 }
        }
      },
      stepOneData: {
        schemeName: { column: packageListSchemeName },
        decorationType: { column: packageListDecorationType, option: decorOption },
        meal: { column: packageListMeal, option: mealOption },
        directFee: { column: customDirectFee },
        advocateMaterialFee: { column: customAdvocateMaterialFee },
        auxiliaryMaterialFee: { column: customAuxiliaryMaterialFee },
        personFee: { column: customPersonFee },
        otherFee: { column: customOtherFee },
        rate: { column: customAate },
        rateFee: { column: customAateFee },
        manageRate: { column: customManageRate },
        manageFee: { column: customManageFee },
        discountRate: { column: customDiscountRate },
        discountFee: { column: customDiscountFee }
      }
    }
  },
  props: {
  },
  components: {
  },
  created () {
    let that = this
    let aoptions = {
      onValuesChange (adata, value) {
        that.orderFlag = false
        that.spinning = false
        that.submitName = '提交'
      }
    }
    this.form = this.$form.createForm(this, aoptions)
    this.stepOneData.schemeName.column[1].initialValue = undefined
    this.stepOneData.decorationType.column[1].initialValue = undefined
    this.stepOneData.meal.column[1].initialValue = undefined
    this.stepOneData.meal.option = []
    this.stepOneData.directFee.column[1].initialValue = undefined
    this.stepOneData.advocateMaterialFee.column[1].initialValue = undefined
    this.stepOneData.auxiliaryMaterialFee.column[1].initialValue = undefined
    this.stepOneData.personFee.column[1].initialValue = undefined
    this.stepOneData.otherFee.column[1].initialValue = undefined
    this.stepOneData.rate.column[1].initialValue = undefined
    this.stepOneData.rateFee.column[1].initialValue = undefined
    this.stepOneData.manageRate.column[1].initialValue = undefined
    this.stepOneData.manageFee.column[1].initialValue = undefined
    this.stepOneData.discountRate.column[1].initialValue = undefined
    this.stepOneData.discountFee.column[1].initialValue = undefined
    if (this.$route.query.aFlag == 2) {
      this.saveFirstSuccessId = this.$route.query.offerId
      let adata = {
        quoteId: this.$route.query.offerId
      }
      this.$request.post('/quote/queryQuoteById', adata).then(async (response) => {
        if (response.code == 0) {
          this.stepOneData.schemeName.column[1].initialValue = response.result.name
          this.stepOneData.decorationType.column[1].initialValue = response.result.decorateType
          this.decorSelectNum = 1
          this.decorPageSize = 10000
          await this.decoratTypeSelect(response.result.decorateType)
          this.stepOneData.meal.column[1].initialValue = response.result.productId
          this.stepOneData.directFee.column[1].initialValue = response.result.directFee
          this.stepOneData.advocateMaterialFee.column[1].initialValue = response.result.advocateMaterialFee
          this.stepOneData.auxiliaryMaterialFee.column[1].initialValue = response.result.auxiliaryMaterialFee
          this.stepOneData.personFee.column[1].initialValue = response.result.personFee
          this.stepOneData.otherFee.column[1].initialValue = response.result.otherFee
          this.stepOneData.rate.column[1].initialValue = ''
          this.stepOneData.rateFee.column[1].initialValue = response.result.rateFee
          this.stepOneData.manageRate.column[1].initialValue = ''
          this.stepOneData.manageFee.column[1].initialValue = response.result.manageFee
          this.stepOneData.discountRate.column[1].initialValue = ''
          this.stepOneData.discountFee.column[1].initialValue = response.result.discountFee
          this.orderAmount = response.result.totalFee
        } else {
          this.$message.error(response.message)
        }
      })
      this.spinning = false
      this.orderFlag = true
      this.addOrEditFlag = true
      this.submitName = '完成'
    }
    if (this.$route.query.aFlag == 2 || this.saveFirstSuccessId !== '') {
      this.doneChangeDecor = true
      this.doneChangetaocan = true
    } else {
      this.doneChangeDecor = false
      this.doneChangetaocan = false
    }
  },
  beforeCreate () {},
  computed: {
  },
  mounted () {
    this.decoratTypeSelect(1)
  },
  methods: {
    // 装修类型下拉框选择选择事件
    decoratTypeSelect (edata) {
      this.saveDecorType = edata
      this.decoratLastOne = false
      this.stepOneData.meal.option = []
      this.decorSelectNum = 1
      this.decoratTypeFn()
    },
    // 选择使用套餐里面下拉框滚动事件
    mealPopScrollThink (ev) {
      if (ev.target.scrollHeight - ev.target.scrollTop - ev.target.clientHeight == 0) {
        if (this.decoratLastOne) return
        this.decorSelectNum += 1
        this.decoratTypeFn()
      }
    },
    // 获取使用套餐下拉框数据(调用产品列表接口)
    decoratTypeFn () {
      let adata = {
        pageNum: this.decorSelectNum,
        pageSize: this.decorPageSize,
        // decorateType: this.saveDecorType,
        type: this.$route.query.offerState,
        status: 1
      }
      this.$request.post('/product/queryProductList', adata).then(response => {
        if (response.code == 0) {
          if (!response.result.list) {
            this.decoratLastOne = true
            return
          }
          this.stepOneData.meal.option = this.stepOneData.meal.option.concat(response.result.list)
        }
      })
    },
    // 装修类型下拉框选择改变事件
    decorTypeChange () {
      this.form.resetFields(['meal'])
    },
    // 使用套餐下拉框改变事件
    taocanSelectChange (edata, ev) {
      this.saveTaocanId = edata
    },
    // 提交事件
    handleSubmit () {
      if (this.submitName == '提交') {
        this.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            let asendObj = {
              workOrderId: JSON.parse(sessionStorage.orderValue).id,
              type: this.$route.query.offerState,
              name: values.schemeName,
              // decorateType: values.decorationType,
              productId: values.meal,
              directFee: values.directFee,
              // advocateMaterialFee: values.advocateMaterialFee,
              // auxiliaryMaterialFee: values.auxiliaryMaterialFee,
              // personFee: values.personFee,
              // otherFee: values.otherFee,
              advocateMaterialFee: '0',
              auxiliaryMaterialFee: '0',
              personFee: '0',
              otherFee: '0',
              rate: '',
              rateFee: values.rateFee,
              manageRate: '',
              manageFee: values.manageFee,
              discountRate: '',
              discountFee: values.discountFee
            }
            let baseUrl = ''
            if (this.addOrEditFlag == false) {
              baseUrl = '/quote/insertQuoteBasic'
            } else {
              baseUrl = '/quote/updateQuoteBasic'
              asendObj.id = this.saveFirstSuccessId
            }
            this.$request.post(baseUrl, asendObj).then(response => {
              if (response.code == 0) {
                this.$message.success('提交成功')
                this.saveFirstSuccessId = response.result
                let that = this
                this.spinning = true
                this.addOrEditFlag = true
                setTimeout(function () {
                  that.lastOrderShowData()
                }, 1000)
              } else {
                this.$message.error(response.message)
              }
            })
          }
        })
      } else if (this.submitName == '完成') {
        var that = this
        this.$success({
          title: '新增自定义报价成功！',
          content: (
            <div>
              <p>已成功新增自定义报价，点击确认返回报价列表</p>
            </div>
          ),
          okText: '确认',
          onOk: function () {
            that.$router.push({ path: '/offer' })
          }
        })
      }
    },
    // 展示页面订单总价
    lastOrderShowData () {
      var adata = {
        quoteId: this.saveFirstSuccessId
      }
      this.$request.post('/quote/calculateQuote', adata).then(response => {
        if (response.code == 0) {
          this.spinning = false
          this.orderFlag = true
          this.submitName = '完成'
          this.orderAmount = response.result.totalFee
        }
      })
    },
    // 返回列表
    targeGoList () {
      this.$router.push('/offer')
    }
  }
}
</script>

<style lang="scss">
  .custom_list {
    padding: 20px 0px;
    .orderDom{
      width: 35%;
      background: #50ADFF;
      margin: 20px auto;
      color: #fff;
      padding: 20px;
      height: 188px;
      position: relative;
      .amount_text{
        text-align: center;
        font-size: 30px;
        margin-top: 50px;
      }
      .foot_text{
        font-size: 8px;
        text-align: right;
      }
    }
    .buttonDom{
      text-align: center;
      margin-top: 80px;
      .lastBtnDom{
        width: 120px;
        margin-left: 20px;
      }
    }
    .lineDom{
      .oneOnly{
        width: 50%;
        margin: auto;
        display: flex;
        .ant-form-item-label{
          flex: 0.3;
          // display: inline-block;
        }
        .ant-form-item-control-wrapper{
          flex: 1;
          // display: inline-block;
          // margin-left: 70px;
        }
        .ant-form-item-required{
          // position: absolute;
          // top: 0px;
        }
      }
    }
    .spliceDom{
      .ant-form-item-children{
        position: relative;
      }
      .mySpan{
        position: absolute;
        right: -20px;
      }
      .amySpan{
        position: absolute;
        right: -155px;
      }
    }
  }
</style>
