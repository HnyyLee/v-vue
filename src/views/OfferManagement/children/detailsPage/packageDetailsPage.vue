<!---->
<template>
  <div class="packageDetailsPage">
    <div class="top_stepDom">
      <a-steps :current="stepNumFlag">
        <a-step title="标配设置" ></a-step>
        <a-step title="主材升级" />
        <a-step title="主材选配" />
        <a-step title="个性化施工" />
        <a-step title="其他" />
        <a-step title="报价完成" />
      </a-steps>
    </div>
    <div class="contentDom">
      <!-- 第一步 -->
      <div v-show="stepNumFlag == 0">
        <a-form :form="form">
          <!-- 方案名称 -->
          <a-form-item label="方案名称" v-bind="formItemLayout">
            <a-input size="large" :value="programmeName" :disabled="true" />
          </a-form-item>
          <!-- 装修类型 -->
          <!-- <a-form-item label="装修类型" v-bind="formItemLayout">
            <a-input size="large" :value="programmeType" :disabled="true" />
          </a-form-item> -->
          <!-- 使用套餐 -->
          <a-form-item label="使用套餐" v-bind="formItemLayout">
            <a-input size="large" :value="programmeDectan" :disabled="true" />
          </a-form-item>
          <!-- 产品系列 -->
          <a-form-item label="产品系列" v-bind="formItemLayout">
            <a-table :bordered='true' :columns="areaRangColumns" :dataSource="areaRangDataSource" :pagination="false" :locale="{emptyText: '暂无产品系列'}">
              <span slot="areaMeasure" slot-scope="record, text">
                <a-input type="number" style="width: 150px;" :value="text.areaNum" :disabled="true" /><span style="margin-left: 10px">{{record}}</span>
              </span>
            </a-table>
          </a-form-item>
          <a-form-item label="分项合计" v-bind="formItemLayout">
            <a-input size="large" class="holdNumDom" :disabled="true" v-model="allMount" />元
          </a-form-item>
        </a-form>
      </div>
      <!-- 第二步 -->
      <div v-show="stepNumFlag == 1">
        <common-offer-table ref="commonTableOne" :doubleDate="detailDoubleDateOne" :douColumns="detailDouColumnsOne" :hasCheckFlag="false">
        </common-offer-table>
      </div>
      <!-- 第三步 -->
      <div v-show="stepNumFlag == 2">
        <common-offer-table ref="commonTableTwo" :doubleDate="detailDoubleDateTwo" :douColumns="detailDouColumnsTwo" :hasCheckFlag="false">
        </common-offer-table>
      </div>
      <!-- 第四步 -->
      <div v-show="stepNumFlag == 3">
        <common-offer-table ref="commonTableThree" :doubleDate="detailDoubleDateThree" :douColumns="detailDouColumnsThree" :hasCheckFlag="false">
        </common-offer-table>
      </div>
      <!-- 第五步 -->
      <div v-show="stepNumFlag == 4">
        <common-offer-table ref="commonTableFour" :doubleDate="detailDoubleDateFour" :douColumns="detailDouColumnsFour" :hasCheckFlag="false">
        </common-offer-table>
      </div>
      <!-- 第六步 -->
      <div v-show="stepNumFlag == 5">
        <a-spin :spinning="spinning">
          <common-offer-table :doubleDate="detailDoubleDateFive" :douColumns="detailDouColumnsFive" :pagaNumFlag="false" :amountFlag="false" :hasCheckFlag="false">
          </common-offer-table>
          <a-row :gutter="24">
            <a-col :span="16">
              <common-offer-table tabTitle="主材折减" ref="commonTableSeven" :doubleDate="detailDoubleDateSeven" :douColumns="detailDouColumnsSeven" :pagaNumFlag="false" :amountFlag="false" :hasCheckFlag="false" :hasDisbaleFlag="true"/>
            </a-col>
            <a-col :span="8">
              <div class="orderDom">
                <p class="amount_text">订单总价: {{orderAmount}}元</p>
                <p class="foot_text">总价={{myOrderVolose}}</p>
              </div>
            </a-col>
            <a-col :span="16">
              <common-offer-table tabTitle="调整项目" ref="commonTableSix" :doubleDate="detailDoubleDateSix" :douColumns="detailDouColumnsSix" :pagaNumFlag="false" :amountFlag="false" :hasCheckFlag="false" :hasDisbaleFlag="true"/>
            </a-col>
          </a-row>
        </a-spin>
      </div>
      <!-- 上下步骤 -->
      <div class="buttonDom">
        <a-button size="large" class="lastBtnDom" @click="targeGoList" v-if="stepNumFlag == 0 &&   pageSouce != 'xqSouce'">返回列表</a-button>
        <a-button size="large" type="primary" class="lastBtnDom" @click="lasthandleSubmit" v-if="stepNumFlag !== 0">上一步</a-button>
        <a-button size="large" type="primary" class="nextBtnDom" @click="nexthandleSubmit" v-if="pageSouce != 'xqSouce' || stepName != '完成'">{{stepName}}</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import commonOfferTable from '../commonOfferTable/commonOfferTable'

import { areaRangColumns, areaRangDataSource, detailDoubleDateOne, detailDouColumnsOne, detailDoubleDateTwo, detailDouColumnsTwo, detailDoubleDateThree, detailDouColumnsThree, detailDoubleDateFour, detailDouColumnsFour, detailDoubleDateFive, detailDouColumnsFive, detailDoubleDateSix, detailDouColumnsSix, detailDouColumnsSeven } from '@/common/mymock'

export default {
  data () {
    return {
      stepNumFlag: 0, // 步骤值
      stepName: '下一步', // 步骤名称
      formItemLayout: { labelCol: { xs: { span: 24 }, sm: { span: 4 } }, wrapperCol: { xs: { span: 24 }, sm: { span: 16 } } },
      areaRangColumns,
      areaRangDataSource,
      detailDoubleDateOne,
      detailDouColumnsOne,
      detailDoubleDateTwo,
      detailDouColumnsTwo,
      detailDoubleDateThree,
      detailDouColumnsThree,
      detailDoubleDateFour,
      detailDouColumnsFour,
      detailDoubleDateFive,
      detailDouColumnsFive,
      detailDoubleDateSix,
      detailDouColumnsSix,
      detailDouColumnsSeven,
      detailDoubleDateSeven: [],
      programmeName: '', // 方案名称
      programmeType: '', // 装修类型
      programmeDectan: '', // 使用套餐
      allMount: 0, // 总价格
      spinning: false, // 第六步加载中
      orderAmount: 0, // 第六步的订单总价
      addTabNumber: 0, // 第六步调整项表格点击添加调整项的key，自增
      totalFee: '', // 第六步工程总价
      directFee: '', // 第六步直接工程费
      manageFee: '', // 第六步管理费
      rateFee: '', // 第六步税费
      pageSouce: '',
      saveMyProductId: '', // 第一步调接口之后保存产品id
      myOrderVolose: '', // 公式
    }
  },
  components: {
    commonOfferTable
  },
  props: {
  },
  created () {
    this.pageSouce = this.$route.query.xqSouce
    this.oneShowFn()
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    // 点击上一步事件
    lasthandleSubmit (ev) {
      if (this.stepNumFlag == 5) {
        this.stepName = '下一步'
      }
      if (this.stepNumFlag > 0) {
        this.stepNumFlag -= 1
      }
    },
    // 点击下一步事件
    nexthandleSubmit (ev) {
      if (this.stepNumFlag < 6) {
        this.stepNumFlag += 1
      }
      if (this.stepNumFlag == 1) {
        this.$refs.commonTableOne.allorMount = 0
        this.twoShowFn()
      } else if (this.stepNumFlag == 2) {
        this.$refs.commonTableTwo.allorMount = 0
        this.threeShowFn()
      } else if (this.stepNumFlag == 3) {
        this.$refs.commonTableThree.allorMount = 0
        this.fourShowFn()
      } else if (this.stepNumFlag == 4) {
        this.$refs.commonTableFour.allorMount = 0
        this.fiveShowFn()
      } else if (this.stepNumFlag == 5) {
        this.spinning = true
        this.sixShowFn()
      } else if (this.stepNumFlag == 6) {
        this.lastShowFn()
      }
      if (this.stepNumFlag == 5) {
        this.stepName = '完成'
      }
    },
    // 第一步页面数据
    oneShowFn () {
      let adata = {
        quoteId: this.$route.query.offerId
      }
      this.$request.post('/quote/queryQuoteById', adata).then(response => {
        if (response.code == 0) {
          this.totalFee = response.result.totalFee
          this.directFee = response.result.directFee
          this.manageFee = response.result.manageFee
          this.rateFee = response.result.rateFee

          // 保存产品id
          this.saveMyProductId = response.result.productId

          this.programmeName = response.result.name
          this.programmeType = response.result.decorateType == 1 ? '局装' : '整装'
          this.programmeDectan = response.result.productName
          this.areaRangDataSource = response.result.quoteRangeVoList
          this.areaRangDataSource.forEach((item, index) => {
            item.key = index
            item.areaNum = item.area
            item.areaMeasure = 'm²'
            if (item.priceType == 1) {
              item.remark = `${index + 1}、计价方式：一口价。按${item.rangeName}实测面积计价，计价起步面积为${item.startArea}m²，不足${item.startArea}m²按${item.startArea}m²计算，起步价格为${item.startPrice}元；每超出${item.perSquare}m²的部分，加收${item.perSquarePrice}元`
            } else if (item.priceType == 2) {
              item.remark = `${index + 1}、计价方式：按平米计价。${item.rangeName}：${item.perSquarePrice}元/m²；起步面积${item.startArea}m²`
            }
          })
          this.allMount = response.result.rangeFee
        } else {
          this.$message.error(response.message)
        }
      })
    },
    // 第二步页面数据
    twoShowFn () {
      let adata = {
        itemType: 2,
        pageNum: 1,
        pageSize: 10000,
        quoteId: this.$route.query.offerId
      }
      this.$request.post('/quote/queryQuoteItemById', adata).then(response => {
        if (response.code == 0) {
          if (response.result.list) {
            this.detailDoubleDateOne = response.result.list
            this.detailDoubleDateOne.forEach((item, index) => {
              item.key = index
              item.price = item.itemPrice
              item.type = item.modelType
              item.amount = (Number(item.itemNum) * Number(item.itemPrice)).toFixed(2)
              this.$refs.commonTableOne.allorMount = (Number(this.$refs.commonTableOne.allorMount) + Number(item.amount)).toFixed(2)
            })
          }
        } else {
          this.$message.error(response.message)
        }
      })
    },
    // 第三步页面数据
    threeShowFn () {
      let adata = {
        itemType: 3,
        pageNum: 1,
        pageSize: 10000,
        quoteId: this.$route.query.offerId
      }
      this.$request.post('/quote/queryQuoteItemById', adata).then(response => {
        if (response.code == 0) {
          if (response.result.list) {
            this.detailDoubleDateTwo = response.result.list
            this.detailDoubleDateTwo.forEach((item, index) => {
              item.key = index
              item.price = item.itemPrice
              item.type = item.modelType
              item.amount = (Number(item.itemNum) * Number(item.itemPrice)).toFixed(2)
              this.$refs.commonTableTwo.allorMount = (Number(this.$refs.commonTableTwo.allorMount) + Number(item.amount)).toFixed(2)
            })
          }
        } else {
          this.$message.error(response.message)
        }
      })
    },
    // 第四步页面数据
    fourShowFn () {
      let sdata = {
        quoteId: this.$route.query.offerId,
        craftType: '1',
        pageSize: 10000,
        pageNum: 1
      }
      this.$request.post('/quote/queryQuoteCraftById', sdata).then(response => {
        if (response.code == 0) {
          if (response.result.list) {
            this.detailDoubleDateThree = response.result.list
            this.detailDoubleDateThree.forEach((item, index) => {
              item.key = index
              item.price = item.craftPrice
              item.itemNum = item.craftNum
              item.amount = (Number(item.craftNum) * Number(item.craftPrice)).toFixed(2)
              this.$refs.commonTableThree.allorMount = (Number(this.$refs.commonTableThree.allorMount) + Number(item.amount)).toFixed(2)
            })
          }
        }
      })
    },
    // 第五部数据
    fiveShowFn () {
      let sdata = {
        quoteId: this.$route.query.offerId,
        craftType: '2',
        pageSize: 10000,
        pageNum: 1
      }
      this.$request.post('/quote/queryQuoteCraftById', sdata).then(response => {
        if (response.code == 0) {
          if (response.result.list) {
            this.detailDoubleDateFour = response.result.list
            this.detailDoubleDateFour.forEach((item, index) => {
              item.key = index
              item.price = item.craftPrice
              item.itemNum = item.craftNum
              item.amount = (Number(item.craftNum) * Number(item.craftPrice)).toFixed(2)
              this.$refs.commonTableFour.allorMount = (Number(this.$refs.commonTableFour.allorMount) + Number(item.amount)).toFixed(2)
            })
          }
        }
      })
    },
    // 第六部数据
    sixShowFn () {
      this.detailDoubleDateFive[0].amount = this.directFee
      this.detailDoubleDateFive[1].amount = this.manageFee
      this.detailDoubleDateFive[2].amount = this.rateFee
      this.orderAmount = this.totalFee
      let sdata = {
        quoteId: this.$route.query.offerId
      }
      this.$request.post('/quote/queryQuoteAdjustById', sdata).then(response => {
        if (response.code == 0) {
          this.spinning = false
          if (response.result) {
            this.detailDoubleDateSix = []
            this.addTabNumber = 0
            response.result.forEach(item => {
              let obj = {
                key: this.addTabNumber,
                codeName: `调整项${Number(this.addTabNumber) + 1}`,
                name: item.name,
                discounts: item.discounts,
                Nametext: '请输入调整项名称',
                discountText: '请输入金额',
                adisabled: true
              }
              this.detailDoubleDateSix.push(obj)
              this.addTabNumber = Number(this.addTabNumber) + 1
            })
          }
        }
      })
      this.getQueryItemFn()
      this.getDiscountsDataFn()
    },
    // 获取第六步说明里面的动态公式
    getQueryItemFn () {
      let adata = {
        id: this.saveMyProductId
      }
      this.$request.post('/product/queryProductById', adata).then(response => {
        if (response.code == 0) {
          let aString = response.result.productCalculationVo
          if (aString) {
            // 直接工程费(A)、管理费(B)、税费(C)、调整项(D)、总价(E)
            if (aString.manageDescription) {
              this.detailDoubleDateFive[1].remark = aString.manageDescription
            } else {
              this.detailDoubleDateFive[1].remark = aString.manageFormula
              this.detailDoubleDateFive[1].remark = this.detailDoubleDateFive[1].remark.replace(/A/g, '直接工程费')
              this.detailDoubleDateFive[1].remark = this.detailDoubleDateFive[1].remark.replace(/B/g, '管理费')
              this.detailDoubleDateFive[1].remark = this.detailDoubleDateFive[1].remark.replace(/C/g, '税费')
              this.detailDoubleDateFive[1].remark = this.detailDoubleDateFive[1].remark.replace(/D/g, '调整项')
              this.detailDoubleDateFive[1].remark = this.detailDoubleDateFive[1].remark.replace(/E/g, '总价')
            }
            if (aString.rateDescription) {
              this.detailDoubleDateFive[2].remark = aString.rateDescription
            } else {
              this.detailDoubleDateFive[2].remark = aString.rateFormula
              this.detailDoubleDateFive[2].remark = this.detailDoubleDateFive[2].remark.replace(/A/g, '直接工程费')
              this.detailDoubleDateFive[2].remark = this.detailDoubleDateFive[2].remark.replace(/B/g, '管理费')
              this.detailDoubleDateFive[2].remark = this.detailDoubleDateFive[2].remark.replace(/C/g, '税费')
              this.detailDoubleDateFive[2].remark = this.detailDoubleDateFive[2].remark.replace(/D/g, '调整项')
              this.detailDoubleDateFive[2].remark = this.detailDoubleDateFive[2].remark.replace(/E/g, '总价')
            }
            if (aString.totalDescription) {
              this.myOrderVolose = aString.totalDescription
            } else {
              this.myOrderVolose = aString.totalFormula
              this.myOrderVolose = this.myOrderVolose.replace(/A/g, '直接工程费')
              this.myOrderVolose = this.myOrderVolose.replace(/B/g, '管理费')
              this.myOrderVolose = this.myOrderVolose.replace(/C/g, '税费')
              this.myOrderVolose = this.myOrderVolose.replace(/D/g, '调整项')
              this.myOrderVolose = this.myOrderVolose.replace(/E/g, '总价')
            }
          }
        }
      })
    },
    // 第六步折减价编辑的时候获取表格数据
    getDiscountsDataFn() {
      var adata = {
        quoteId: this.$route.query.offerId
      }
      this.$request.post('/quote/queryQuoteDiscountsById', adata).then(response => {
        if (response.code == 0) {
          this.detailDoubleDateSeven = []
          if (response.result.list) {
            this.detailDoubleDateSeven = response.result.list
            this.detailDoubleDateSeven.forEach((item, index) => {
              item.key = index
              item.code = Number(index) + 1
              item.itemNum = item.num
              item.item_id = item.itemId
              item.Aoument = -Number(item.itemNum) * Number(item.price)
            })
          }
        }
      })
    },
    // 第七部数据
    lastShowFn () {
      this.$router.push({ path: '/offer' })
    },
    // 返回列表事件
    targeGoList () {
      this.$router.push('/offer')
    }
  }
}
</script>

<style lang="scss">
  @import '../css/packageDetailsPage.scss'
</style>
