<!---->
<template>
  <div class="customDetailsPage">

    <div class="top_print">
      <h3 class="top_h3">万科物业装修服务客户报价单</h3>
      <div class="top_printer">
        <a-button size='large' class="printBtnDom" @click="printHtml"><a-icon type="printer" />打印报价书</a-button>
      </div>

      <table border="1" class="comm tabs mySplice">
        <tr>
          <th>合同编号</th>
          <td>{{hetongCode}}</td>
          <th>设计师</th>
          <td>{{designName}}</td>
          <th>工程地址</th>
          <td colspan="3">{{projectAdd}}</td>
        </tr>
        <tr>
          <th>客户姓名</th>
          <td>{{persenName}}</td>
          <th>联系电话</th>
          <td>{{phoneNum}}</td>
          <th>装修面积</th>
          <td>{{dectorionNum}}</td>
          <th>户型格局</th>
          <td>{{huxingType}}</td>
        </tr>
      </table>
    </div>

    <a-form :form="form">
      <!-- 方案名称 -->
      <a-form-item label="方案名称" v-bind="formItemLayout" >
        <a-input size="large" :value="programmeName" :disabled="true" />
      </a-form-item>
      <!-- 装修类型 -->
      <!-- <a-form-item label="装修类型" v-bind="formItemLayout">
        <a-input size="large" :value="programmeType" :disabled="true" />
      </a-form-item> -->
      <!-- 适用产品 -->
      <a-form-item label="适用产品" v-bind="formItemLayout">
        <a-input size="large" :value="programmeDectan" :disabled="true" />
      </a-form-item>
      <!-- 工程直接费 -->
      <a-form-item label="工程直接费" v-bind="formItemLayout">
        <a-input size="large" :value="directFee" :disabled="true" />
      </a-form-item>
      <!-- 主材费用 -->
      <!-- <a-form-item label="主材费" v-bind="formItemLayout">
        <a-input size="large" :value="advocateMaterialFee" :disabled="true" />
      </a-form-item> -->
      <!-- 辅材费用 -->
      <!-- <a-form-item label="辅材费" v-bind="formItemLayout">
        <a-input size="large" :value="auxiliaryMaterialFee" :disabled="true" />
      </a-form-item> -->
      <!-- 人工费用 -->
      <!-- <a-form-item label="人工费用" v-bind="formItemLayout">
        <a-input size="large" :value="personFee" :disabled="true" />
      </a-form-item> -->
      <!-- 其他 -->
      <!-- <a-form-item label="其他" v-bind="formItemLayout">
        <a-input size="large" :value="otherFee" :disabled="true" />
      </a-form-item> -->
      <!-- 税点 -->
      <a-form-item label="税费" v-bind="formItemLayout">
        <a-input size="large" :value="rateFee" :disabled="true" /><span class="aTextDom">元</span>
      </a-form-item>
      <!-- <div class="lineDom">
        <div class="oneOnly">
          <a-form-item label="税点" style="display:flex; flex: 1; margin-left: 6%;">
            <a-input style="width: 200px" size="large" :value="rate" :disabled="true" />
          </a-form-item>
          <a-form-item label="税费" style="display:flex; flex: 1;">
            <a-input style="width: 200px" size="large" :value="rateFee" :disabled="true" />元
          </a-form-item>
        </div>
      </div> -->
      <!-- 管理费点 -->
      <a-form-item label="管理费" v-bind="formItemLayout">
        <a-input size="large" :value="manageFee" :disabled="true" /><span class="aTextDom">元</span>
      </a-form-item>
      <!-- <div class="lineDom">
        <div class="oneOnly">
          <a-form-item label="管理费点" style="display:flex; flex: 1; margin-left: 6%;">
            <a-input style="width: 200px" size="large" :value="manageRate" :disabled="true" />
          </a-form-item>
          <a-form-item label="管理费" style="display:flex; flex: 1;">
            <a-input style="width: 200px" size="large" :value="manageFee" :disabled="true" />元
          </a-form-item>
        </div>
      </div> -->
      <!-- 折扣 -->
      <a-form-item label="其他费用" v-bind="formItemLayout">
        <a-input size="large" :value="discountFee" :disabled="true" /><span class="aTextDom">元</span>
      </a-form-item>
      <!-- <div class="lineDom">
        <div class="oneOnly">
          <a-form-item label="折扣" style="display:flex; flex: 1; margin-left: 6%;">
            <a-input style="width: 200px" size="large" :value="discountRate" :disabled="true" />
          </a-form-item>
          <a-form-item label="金额" style="display:flex; flex: 1;">
            <a-input style="width: 200px" size="large" :value="discountFee" :disabled="true" />元
          </a-form-item>
        </div>
      </div> -->
      <!-- 订单总价 -->
      <div class="orderDom">
        <p class="amount_text">订单总价: {{orderAmount}}元</p>
        <p class="foot_text">总价=工程直接费+税费+管理费+其他费用</p>
      </div>
    </a-form>
    <div class="buttonDom" v-if="pageSouce !== 'xqSouce'">
      <a-button size="large" class="lastBtnDom" @click="targeGoList">返回列表</a-button>
      <a-button size="large" type="primary" class="lastBtnDom" @click="lastThink">完成</a-button>
    </div>
  </div>
</template>

<script>

import { decorOption, mealOption } from '@/common/mymock'
import { packageListSchemeName, packageListDecorationType, packageListMeal, customDirectFee, customAdvocateMaterialFee, customAuxiliaryMaterialFee, customPersonFee, customOtherFee, customAate, customAateFee, customManageRate, customManageFee, customDiscountRate, customDiscountFee } from '@/common/validate'

export default {
  data () {
    return {
      orderAmount: 0, // 订单总价
      decorPageSize: 10, // 第一步使用套餐下拉框默认每页展示多少条数据
      decorSelectNum: 1, // 下拉框页数，开始第一页
      saveDecorType: '', // 保存当前选择的装修类型值
      decoratLastOne: false, // 判断选择套餐里面是否是最后的数据的flag
      formItemLayout: { labelCol: { xs: { span: 24 }, sm: { span: 4 } }, wrapperCol: { xs: { span: 24 }, sm: { span: 16 } } },
      programmeName: '', // 方案名称
      programmeType: '', // 装修类型
      programmeDectan: '', // 使用套餐
      directFee: '',
      advocateMaterialFee: '',
      auxiliaryMaterialFee: '',
      personFee: '',
      otherFee: '',
      rate: '',
      rateFee: '',
      manageRate: '',
      manageFee: '',
      discountRate: '',
      discountFee: '',
      pageSouce: '',
      hetongCode: '', // 合同编号
      designName: '', // 设计师
      projectAdd: '', // 工程地址
      persenName: '', // 客户姓名
      phoneNum: '', // 联系电话
      dectorionNum: '', // 装修面积
      huxingType: '' // 户型格局
    }
  },
  props: {
  },
  components: {
  },
  created () {
    this.form = this.$form.createForm()
    let adata = {
      quoteId: this.$route.query.offerId
    }
    this.pageSouce = this.$route.query.xqSouce
    this.$request.post('/quote/queryQuoteById', adata).then(async (response) => {
      if (response.code == 0) {
        this.programmeName = response.result.name
        this.programmeType = response.result.decorateType == 1 ? '局装' : '整装'
        this.programmeDectan = response.result.productName
        this.directFee = response.result.directFee
        this.advocateMaterialFee = response.result.advocateMaterialFee
        this.auxiliaryMaterialFee = response.result.auxiliaryMaterialFee
        this.personFee = response.result.personFee
        this.otherFee = response.result.otherFee
        this.rate = response.result.rate
        this.rateFee = response.result.rateFee
        this.manageRate = response.result.manageRate
        this.manageFee = response.result.manageFee
        this.discountRate = response.result.discountRate
        this.discountFee = response.result.discountFee
        this.orderAmount = response.result.totalFee
        // 表头信息
        this.designName = response.result.workOrderTitle.designerName
        this.projectAdd = response.result.workOrderTitle.address
        this.persenName = response.result.workOrderTitle.customerName
        this.phoneNum = response.result.workOrderTitle.phone
        this.dectorionNum = response.result.workOrderTitle.floorspaceNumber
        let mybedroomNumber = response.result.workOrderTitle.bedroomNumber ? response.result.workOrderTitle.bedroomNumber : 0
        let mylivingNumber = response.result.workOrderTitle.livingNumber ? response.result.workOrderTitle.livingNumber : 0
        let mykitchensNumber = response.result.workOrderTitle.kitchensNumber ? response.result.workOrderTitle.kitchensNumber : 0
        let mybathroomsNumber = response.result.workOrderTitle.bathroomsNumber ? response.result.workOrderTitle.bathroomsNumber : 0
        this.huxingType = mybedroomNumber + '房' + mylivingNumber + '厅' + mykitchensNumber + '厨' + mybathroomsNumber + '卫'
      } else {
        this.$message.error(response.message)
      }
    })
  },
  beforeCreate () {},
  computed: {
  },
  mounted () {
  },
  methods: {
    // 获取浏览器类型
    getExplorer () {
      var explorer = window.navigator.userAgent
      // ie
      if (explorer.indexOf('MSIE') >= 0) {
        return 'IE'
      } else if (explorer.indexOf('Firefox') >= 0) { // firefox
        return 'Firefox'
      } else if (explorer.indexOf('Chrome') >= 0) { // Chrome
        return 'Chrome'
      } else if (explorer.indexOf('Opera') >= 0) { // Opera
        return 'Opera'
      } else if (explorer.indexOf('Safari') >= 0) { // Safari
        return 'Safari'
      }
    },
    // 去掉页眉和页脚
    pagesetup_null () {
      var hkeyRoot = ''
      var hkeyPath = ''
      var hkeyKey = ''
      hkeyRoot = 'HKEY_CURRENT_USER'
      hkeyPath = '\\Software\\Microsoft\\Internet Explorer\\PageSetup\\'
      try {
        var RegWsh = window.ActiveXObject('WScript.Shell')
        hkeyKey = 'header'
        RegWsh.RegWrite(hkeyRoot + hkeyPath + hkeyKey, '')
        hkeyKey = 'footer'
        RegWsh.RegWrite(hkeyRoot + hkeyPath + hkeyKey, '')
      } catch (e) {
        console.log(e)
      }
    },
    lastThink () {
      this.$router.push({ path: '/offer' })
    },
    // 返回列表事件
    targeGoList () {
      this.$router.push('/offer')
    },
    printHtml () {
      // 获取浏览器类型
      if (this.getExplorer() == 'IE') {
        this.pagesetup_null()
      }
      window.print()
    }
  }
}
</script>

<style lang="scss">
  @import '../css/customDetailsPage.scss'
</style>
