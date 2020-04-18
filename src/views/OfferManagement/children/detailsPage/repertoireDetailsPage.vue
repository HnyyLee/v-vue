<!---->
<template>
  <div class="repertoireDetailsPage">
    <div class="top_stepDom">
      <a-steps :current="stepNumFlag">
        <a-step title="标配设置" ></a-step>
        <a-step title="空间名" />
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
        </a-form>
      </div>
      <!-- 第二步 -->
      <div v-show="stepNumFlag == 1">
        <a-tabs hideAdd type="editable-card" @change="topTabChange" tabPosition="top" :animated="true">
          <a-tab-pane v-for="pane in panesDom" :tab="pane.title" :key="pane.key" :closable="pane.closable" :forceRender="true">
            <common-offer-table :ref="pane.tableRefDom" :doubleDate="pane.contentTop" :douColumns="detailTopColums" :hasCheckFlag="pageSouce != 'xqSouce'" />
            <common-offer-table :ref="pane.tableRefDom" :doubleDate="pane.contentBottom" :douColumns="detailBottomColums" :hasCheckFlag="pageSouce != 'xqSouce'" :souceFlag='pageSouce == "xqSouce"' />
          </a-tab-pane>
        </a-tabs>
      </div>
      <!-- 第三步 -->
      <div v-show="stepNumFlag == 2">
        <a-spin :spinning="spinning">
          <common-offer-table :doubleDate="detailReperThree" :douColumns="detailReperColum" :pagaNumFlag="false" :amountFlag="false" :hasCheckFlag="pageSouce != 'xqSouce'">
          </common-offer-table>
          <a-row :gutter="24">
            <a-col :span="16">
              <common-offer-table ref="commonTableSix" :doubleDate="detailDoubleDateSix" :douColumns="detailDouColumnsSix" :pagaNumFlag="false" :amountFlag="false" :hasCheckFlag="pageSouce != 'xqSouce'" :hasDisbaleFlag="true" :souceFlag='pageSouce == "xqSouce"' />
            </a-col>
            <a-col :span="8">
              <div class="orderDom">
                <p class="amount_text">订单总价: {{orderAmount}}元</p>
                <p class="foot_text">总价={{myOrderVolose}}</p>
              </div>
            </a-col>
          </a-row>
        </a-spin>
      </div>
      <!-- 上下步骤 -->
      <div class="buttonDom">
        <a-button size="large" class="lastBtnDom" :disabled='pageSouce == "xqSouce"' @click="targeGoList" v-if="stepNumFlag == 0">返回列表</a-button>
        <a-button size="large" type="primary" class="lastBtnDom" @click="lasthandleSubmit" v-if="stepNumFlag !== 0">上一步</a-button>
        <a-button size="large" type="primary" class="nextBtnDom" @click="nexthandleSubmit" v-if="pageSouce != 'xqSouce' || stepName != '完成'">{{stepName}}</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import commonOfferTable from '../commonOfferTable/commonOfferTable'
import { detailTopColums, detailBottomColums, detailReperThree, detailReperColum, detailDoubleDateSix, detailDouColumnsSix } from '@/common/mymock'

export default {
  data () {
    const panesDom = []
    return {
      stepNumFlag: 0, // 步骤值
      stepName: '下一步', // 步骤名称
      formItemLayout: { labelCol: { xs: { span: 24 }, sm: { span: 4 } }, wrapperCol: { xs: { span: 24 }, sm: { span: 16 } } },
      programmeName: '', // 方案名称
      programmeType: '', // 装修类型
      programmeDectan: '', // 使用套餐
      panesDom,
      saveNowTabId: '', // 点击第一个表格添加主材清单时候记录下当前tab切换栏的id(当前tab的id)
      savePrevTabId: '', // 当this.panesDom的length为1的时候，这个值等于saveNowTabId，当大于1的时候保存为上一个tab的id使用
      spinning: false, // 第三步加载中
      orderAmount: 0, // 第六步的订单总价
      addTabNumber: 0, // 第六步调整项表格点击添加调整项的key，自增
      totalFee: '', // 第六步工程总价
      directFee: '', // 第六步直接工程费
      manageFee: '', // 第六步管理费
      rateFee: '', // 第六步税费
      detailTopColums,
      detailBottomColums,
      detailReperThree,
      detailReperColum,
      detailDoubleDateSix,
      detailDouColumnsSix,
      pageSouce: 'xqSouce',
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
    this.oneShowFn()
    this.pageSouce = this.$route.query.xqSouce
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
      if (this.stepNumFlag == 2) {
        this.stepName = '下一步'
      }
      if (this.stepNumFlag > 0) {
        this.stepNumFlag -= 1
      }
    },
    // 点击下一步事件
    nexthandleSubmit (ev) {
      if (this.stepNumFlag < 3) {
        this.stepNumFlag += 1
      }
      if (this.stepNumFlag == 1) {
        this.showSpaceTabFn()
      } else if (this.stepNumFlag == 2) {
        this.threeShowFn()
      } else if (this.stepNumFlag == 3) {
        this.lastShowFn()
      }
      if (this.stepNumFlag == 2) {
        this.stepName = '完成'
      }
    },
    // 第一步刷新页面调用接口
    oneShowFn () {
      let adata = {
        quoteId: this.$route.query.offerId
      }
      this.$request.post('/quote/queryQuoteById', adata).then((response) => {
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
        } else {
          this.$message.error(response.message)
        }
      })
    },
    // 获取tab的空间信息
    showSpaceTabFn () {
      let adata = {
        quoteId: this.$route.query.offerId
      }
      this.panesDom = []
      this.$request.post('/quote/queryQuoteSpaceById', adata).then(response => {
        if (response.code == 0) {
          if (response.result) {
            response.result.forEach(resu => {
              let asobj = {}
              asobj.key = resu.id
              asobj.title = `${resu.name}`
              asobj.contentTop = []
              asobj.contentBottom = []
              asobj.tableRefDom = `tableCommon${resu.id}`
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
    // 第二部切换面板的回调
    topTabChange (adata) {
      this.savePrevTabId = this.saveNowTabId
      this.saveNowTabId = adata
      let isFirstFlag = false
      this.panesDom.forEach(item => {
        if (item.key == this.savePrevTabId) {
          if (item.isFirstSet == true) {
            isFirstFlag = true
          }
        }
      })
      // 获取空间信息下面主材信息和工艺信息
      this.panesDom.forEach(pan => {
        if (pan.editShowDataFlag == false) {
          this.getItemListFn()
          this.getCartyListFn()
          pan.editShowDataFlag = true
        }
      })
    },
    // 获取空间信息下面主材信息
    getItemListFn () {
      let sdata = {
        quoteId: this.$route.query.offerId,
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
                if (response.result.list) {
                  item.contentTop = response.result.list
                  item.contentTop.forEach(icen => {
                    icen.key = icen.itemId
                    icen.price = icen.itemPrice
                    icen.type = icen.modelType
                    icen.amount = Number(icen.itemNum) * Number(icen.price)
                  })
                }
                this.spliceRangAllMountTop(item)
              }
            })
            console.log('这个主材', this.panesDom)
          }
        }
      })
    },
    // 获取空间信息下面工艺信息
    getCartyListFn () {
      let sdata = {
        quoteId: this.$route.query.offerId,
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
                if (response.result.list) {
                  item.contentBottom = response.result.list
                  item.contentBottom.forEach(icen => {
                    icen.key = icen.craftId
                    icen.price = icen.craftPrice
                    icen.itemNum = icen.craftNum
                    icen.amount = Number(icen.craftNum) * Number(icen.price)
                  })
                }
                this.spliceRangAllMountBtm(item)
              }
            })
            console.log('这个工艺', this.panesDom)
          }
        }
      })
    },
    // 第二步重新计算allorMount总的值，和循环拿产品系列遍历的事件
    spliceRangAllMountTop (adata) {
      this.$refs[adata.tableRefDom][0].allorMount = 0
      this.panesDom.forEach(item => {
        if (item.key == adata.key) {
          item.contentTop.forEach(con => {
            con.itemId = con.key
            this.$refs[adata.tableRefDom][0].allorMount = (Number(this.$refs[adata.tableRefDom][0].allorMount) + Number(con.amount)).toFixed(2)
          })
        }
      })
    },
    // 第二步重新计算allorMount总的值，和循环拿产品系列遍历的事件
    spliceRangAllMountBtm (adata) {
      this.$refs[adata.tableRefDom][1].allorMount = 0
      this.panesDom.forEach(item => {
        if (item.key == adata.key) {
          item.contentBottom.forEach(con => {
            con.craftId = con.key
            this.$refs[adata.tableRefDom][1].allorMount = (Number(this.$refs[adata.tableRefDom][1].allorMount) + Number(con.amount)).toFixed(2)
          })
        }
      })
    },
    // 第三步数据
    threeShowFn () {
      this.detailReperThree[0].amount = this.directFee
      this.detailReperThree[1].amount = this.manageFee
      this.detailReperThree[2].amount = this.rateFee
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
                discountText: '请输入金额'
              }
              this.detailDoubleDateSix.push(obj)
              this.addTabNumber = Number(this.addTabNumber) + 1
            })
          }
        }
      })
      this.getQueryItemFn()
    },
    // 获取第三步说明里面的动态公式
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
              this.detailReperThree[1].remark = aString.manageDescription
            } else {
              this.detailReperThree[1].remark = aString.manageFormula
              this.detailReperThree[1].remark = this.detailReperThree[1].remark.replace(/A/g, '直接工程费')
              this.detailReperThree[1].remark = this.detailReperThree[1].remark.replace(/B/g, '管理费')
              this.detailReperThree[1].remark = this.detailReperThree[1].remark.replace(/C/g, '税费')
              this.detailReperThree[1].remark = this.detailReperThree[1].remark.replace(/D/g, '调整项')
              this.detailReperThree[1].remark = this.detailReperThree[1].remark.replace(/E/g, '总价')
            }
            if (aString.rateDescription) {
              this.detailReperThree[2].remark = aString.rateDescription
            } else {
              this.detailReperThree[2].remark = aString.rateFormula
              this.detailReperThree[2].remark = this.detailReperThree[2].remark.replace(/A/g, '直接工程费')
              this.detailReperThree[2].remark = this.detailReperThree[2].remark.replace(/B/g, '管理费')
              this.detailReperThree[2].remark = this.detailReperThree[2].remark.replace(/C/g, '税费')
              this.detailReperThree[2].remark = this.detailReperThree[2].remark.replace(/D/g, '调整项')
              this.detailReperThree[2].remark = this.detailReperThree[2].remark.replace(/E/g, '总价')
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
    // 最后一步
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
  @import '../css/repertoireDetailsPage.scss'
</style>
