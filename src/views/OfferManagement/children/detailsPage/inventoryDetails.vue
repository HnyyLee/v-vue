<!---->
<template>
  <div class="inventoryDetails">
    <div class="contentDom">

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
      </table>

      <div class="box_border" v-for="pane in panesDom" :key="pane.key" >
        <h3>{{pane.title}}</h3>
        <common-offer-table :ref="pane.tableRefDom" :doubleDate="pane.contentTop" :douColumns="detailTopColums" :hasCheckFlag="pageSouce != 'xqSouce'" :pagaNumFlag="false"/>
        <common-offer-table :ref="pane.tableRefDom" :doubleDate="pane.contentBottom" :douColumns="detailBottomColums" :hasCheckFlag="pageSouce != 'xqSouce'" :souceFlag='pageSouce == "xqSouce"' :pagaNumFlag="false" />
      </div>

      <div class="box_border">
        <h4>报价完成</h4>
        <a-spin :spinning="spinning">
          <common-offer-table :doubleDate="detailReperThree" :douColumns="detailReperColum" :pagaNumFlag="false" :amountFlag="false" :hasCheckFlag="pageSouce != 'xqSouce'">
          </common-offer-table>

          <common-offer-table ref="commonTableSix" :doubleDate="detailDoubleDateSix" :douColumns="detailDouColumnsSix" :pagaNumFlag="false" :amountFlag="false" :hasCheckFlag="pageSouce != 'xqSouce'" :hasDisbaleFlag="true" :souceFlag='pageSouce == "xqSouce"' tabTitle="调整项(优惠等信息)" style="margin-top: 25px" />

          <div class="orderDom">
            <p class="amount_text">订单总价: {{totalFee}}元</p>
            <p class="foot_text">总价=直接工程费+管理费＋税金+调整项</p>
          </div>
        </a-spin>
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
      hetongCode: '', // 合同编号
      designName: '', // 设计师
      projectAdd: '', // 工程地址
      persenName: '', // 客户姓名
      phoneNum: '', // 联系电话
      dectorionNum: '', // 装修面积
      huxingType: '' // 户型格局
    }
  },
  components: {
    commonOfferTable
  },
  props: {
  },
  created () {
    this.oneShowFn()
    this.showSpaceTabFn()
    this.threeShowFn()
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

          this.programmeName = response.result.name
          this.programmeType = response.result.decorateType == 1 ? '局装' : '整装'
          this.programmeDectan = response.result.productName

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
              // 获取空间信息下面主材信息和工艺信息
              this.getItemListFn(resu.id)
              this.getCartyListFn(resu.id)
            })
            this.saveNowTabId = response.result[0].id
            this.savePrevTabId = response.result[0].id
            this.panesDom.forEach(pan => {
              pan.editShowDataFlag = false
            })
          }
        }
      })
    },
    // 第二部切换面板的回调
    // topTabChange (adata) {
    //   this.savePrevTabId = this.saveNowTabId
    //   this.saveNowTabId = adata
    //   let isFirstFlag = false
    //   this.panesDom.forEach(item => {
    //     if (item.key == this.savePrevTabId) {
    //       if (item.isFirstSet == true) {
    //         isFirstFlag = true
    //       }
    //     }
    //   })
    //   // 获取空间信息下面主材信息和工艺信息
    //   this.panesDom.forEach(pan => {
    //     if (pan.editShowDataFlag == false) {
    //       this.getItemListFn()
    //       this.getCartyListFn()
    //       pan.editShowDataFlag = true
    //     }
    //   })
    // },
    // 获取空间信息下面主材信息
    getItemListFn (sandId) {
      let sdata = {
        quoteId: this.$route.query.offerId,
        // spaceId: this.saveNowTabId,
        spaceId: sandId,
        pageSize: 10000,
        pageNum: 1
      }
      this.$request.post('/quote/queryQuoteItemById', sdata).then(response => {
        if (response.code == 0) {
          if (response.result) {
            this.panesDom.forEach(item => {
              if (item.key == sandId) {
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
          }
        }
      })
    },
    // 获取空间信息下面工艺信息
    getCartyListFn (sandId) {
      let sdata = {
        quoteId: this.$route.query.offerId,
        // spaceId: this.saveNowTabId,
        spaceId: sandId,
        pageSize: 10000,
        pageNum: 1
      }
      this.$request.post('/quote/queryQuoteCraftById', sdata).then(response => {
        if (response.code == 0) {
          if (response.result) {
            this.panesDom.forEach(item => {
              if (item.key == sandId) {
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
  @import '../css/inventoryDetails.scss'
</style>
