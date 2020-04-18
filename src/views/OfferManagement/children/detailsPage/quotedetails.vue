<!---->
<template>
  <div class="quotedetails">
    <div class="contentDom">
      <!-- 第一步 -->
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

      <!-- 第一步报价信息 -->
      <table border="1" class="firstPageForm">
        <tr>
          <th>方案名称</th>
          <td>{{programmeName}}</td>
        </tr>
        <!-- <tr>
          <th>装修类型</th>
          <td>{{programmeType}}</td>
        </tr> -->
        <tr>
          <th>使用套餐</th>
          <td>{{programmeDectan}}</td>
        </tr>
        <tr>
          <th>产品系列</th>
          <td>
            <a-table :bordered='true' :columns="areaRangColumns" :dataSource="areaRangDataSource" :pagination="false" 
            :locale="{emptyText: '暂无产品系列'}">
              <span slot="areaMeasure" slot-scope="record, text">
                <p type="number" style="margin: 0px;">{{text.areaNum}}<span >{{record}}</span></p>
              </span>
            </a-table>
          </td>
        </tr>
        <tr>
          <th>分项合计</th>
          <td>{{allMount}}元</td>
        </tr>
      </table>

      <!-- 第二步 -->
      <div class="box_border">
        <h4>主材升级</h4>
        <common-offer-table ref="commonTableOne" :doubleDate="detailDoubleDateOne" :douColumns="detailDouColumnsOne" :hasCheckFlag="false" :pagaNumFlag="false">
        </common-offer-table>
      </div>
      <!-- 第三步 -->
      <div class="box_border">
        <h4>主材选配</h4>
        <common-offer-table ref="commonTableTwo" :pagaNumFlag="false" :doubleDate="detailDoubleDateTwo" :douColumns="detailDouColumnsTwo" :hasCheckFlag="false">
        </common-offer-table>
      </div>
      <!-- 第四步 -->
      <div class="box_border">
        <h4>个性化施工</h4>
        <common-offer-table ref="commonTableThree" :doubleDate="detailDoubleDateThree" :douColumns="detailDouColumnsThree" :hasCheckFlag="false" :pagaNumFlag="false" >
        </common-offer-table>
      </div>
      <!-- 第五步 -->
      <div class="box_border">
        <h4>其他</h4>
        <common-offer-table ref="commonTableFour" :pagaNumFlag="false" :doubleDate="detailDoubleDateFour" :douColumns="detailDouColumnsFour" :hasCheckFlag="false">
        </common-offer-table>
      </div>
      <!-- 第六步 -->
      <div class="box_border">
        <h4>报价完成</h4>
        <a-spin :spinning="spinning">
          <common-offer-table :doubleDate="detailDoubleDateFive" :douColumns="detailDouColumnsFive" :pagaNumFlag="false" :amountFlag="false" :hasCheckFlag="false">
          </common-offer-table>

          <common-offer-table ref="commonTableSeven" :doubleDate="detailDoubleDateSeven" :douColumns="detailDouColumnsSeven" :pagaNumFlag="false" :amountFlag="false" :hasCheckFlag="false" :hasDisbaleFlag="true" tabTitle="主材折减" style="margin-top: 25px" />
          <common-offer-table ref="commonTableSix" :doubleDate="detailDoubleDateSix" :douColumns="detailDouColumnsSix" :pagaNumFlag="false" :amountFlag="false" :hasCheckFlag="false" :hasDisbaleFlag="true" tabTitle="调整项(优惠等信息)" style="margin-top: 25px" />

          <div>
            <div class="orderDom">
              <p class="amount_text">订单总价: {{totalFee}}元</p>
              <p class="foot_text">总价={{orderTotalFormula}}</p>
            </div>
          </div>
          
        </a-spin>
      </div>
    </div>
  </div>
</template>

<script>
import commonOfferTable from '../commonOfferTable/commonOfferTable'

import { areaRangDataSource, detailDoubleDateOne, detailDouColumnsOne, detailDoubleDateTwo, detailDouColumnsTwo, detailDoubleDateThree, detailDouColumnsThree, detailDoubleDateFour, detailDouColumnsFour, detailDoubleDateFive, detailDouColumnsFive, detailDoubleDateSix, detailDouColumnsSix,
detailDoubleDateSeven, detailDouColumnsSeven } from '@/common/mymock'

const areaRangColumns = [
  {
    title: '项目',
    dataIndex: 'rangeName',
    align: 'center',
  }, {
    title: '面积',
    dataIndex: 'areaMeasure',
    align: 'center',
    scopedSlots: { customRender: 'areaMeasure' }
  }, {
    title: '备注',
    dataIndex: 'remark',
    align: 'center',
  }
]

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
      detailDoubleDateSeven,
      detailDouColumnsSeven,
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
      hetongCode: '', // 合同编号
      designName: '', // 设计师
      projectAdd: '', // 工程地址
      persenName: '', // 客户姓名
      phoneNum: '', // 联系电话
      dectorionNum: '', // 装修面积
      huxingType: '', // 户型格局
      saveTaocanId: '', // 保存第一步选取的套餐（产品）ID
      orderTotalFormula: '', // 第六步订单总价下面计算公司
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
    this.twoShowFn()
    this.threeShowFn()
    this.fourShowFn()
    this.$nextTick(function() {
      console.log('88', )
      document.querySelector('.ant-table-thead tr th[key=remark]').style = 'width: 50%'
    })
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
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
    printHtml () {
      // 获取浏览器类型
      if (this.getExplorer() == 'IE') {
        this.pagesetup_null()
      }
      window.print()
    },
    // 第一步页面数据
    oneShowFn () {
      let adata = {
        quoteId: this.$route.query.offerId
      }
      this.$request.post('/quote/queryQuoteById', adata).then(response => {
        if (response.code == 0) {
          this.saveTaocanId = response.result.productId
          this.totalFee = response.result.totalFee
          this.directFee = response.result.directFee
          this.manageFee = response.result.manageFee
          this.rateFee = response.result.rateFee
          // 表头信息
          if (response.result.workOrderTitle) {
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
          }
          if (response.result.quoteDiscountVoList) {
            this.detailDoubleDateSeven = []
            response.result.quoteDiscountVoList.forEach((item, index) => {
              let aSobj = {}
              aSobj.key = index
              aSobj.code = 1
              aSobj.category = item.category
              aSobj.itemNum = item.num
              aSobj.Aoument = -Number(item.price) * Number(item.num)
              this.detailDoubleDateSeven.push(aSobj)
            })
          }

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
          this.fiveShowFn()
          this.sixShowFn()
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
        quoteId: this.$route.query.offerId,
        numFlag: true
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
        quoteId: this.$route.query.offerId,
        numFlag: true
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
    },
    // 获取第六步第一个表格说明里面的动态公式
    getQueryItemFn () {
      let adata = {
        id: this.saveTaocanId
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
              this.orderTotalFormula = aString.totalDescription
            } else {
              this.orderTotalFormula = aString.totalFormula
              this.orderTotalFormula = this.orderTotalFormula.replace(/A/g, '直接工程费')
              this.orderTotalFormula = this.orderTotalFormula.replace(/B/g, '管理费')
              this.orderTotalFormula = this.orderTotalFormula.replace(/C/g, '税费')
              this.orderTotalFormula = this.orderTotalFormula.replace(/D/g, '调整项')
              this.orderTotalFormula = this.orderTotalFormula.replace(/E/g, '总价')
            }
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
  @import '../css/quotedetails.scss'
</style>
