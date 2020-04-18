<!---->
<template>
  <div class="quotedetails">
    <div class="contentDom">
      <!-- 第一步 -->
      <h3 class="top_h3">万科物业装修服务中心基础施工变更单</h3>
      <div class="top_printer">
        <a-button size='large' class="printBtnDom" @click="printHtml"><a-icon type="printer" />打印变更单</a-button>
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
          <th>变更日期</th>
          <td>{{changeDate}}</td>
        </tr>
      </table>

      <!-- 基础施工减少项目 -->
      <h3 class="center_Title">基础施工减少项目</h3>
      <a-table :columns="alteraColumns" :dataSource="alteraAddData" bordered :pagination="false">
      </a-table>

      <!-- 基础施工增加项目 -->
      <h3 class="center_Title">基础施工增加项目</h3>
      <a-table :columns="alteraColumns" :dataSource="alteraRedData" bordered :pagination="false">
      </a-table>
      <!-- 综合计费 -->
      <h3 class="center_Title">综合计费</h3>
      <a-table :columns="printerLastColumns" :dataSource="lastTableData"  bordered :pagination='false' :locale="{ emptyText: '暂无数据' }">
      </a-table>

      <!-- 底部 -->
      <div class="footer">
        <div class="top">
          <p>客户:</p>
          <p></p>
          <p>设计师:</p>
          <p></p>
          <p>阵地经理(主管):</p>
          <p></p>
          <p>工程部:</p>
          <p></p>
        </div>
        <div class="bottom">
          <p>日期:</p>
          <p></p>
          <p>日期:</p>
          <p></p>
          <p>日期:</p>
          <p></p>
          <p>日期:</p>
          <p></p>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import commonOfferTable from '@/views/OfferManagement/children/commonOfferTable/commonOfferTable'
import { printerLastColumns } from '../js/colums'

const alteraAddData = []
const alteraRedData = []

export default {
  data () {
    const renderContent = (value, row, index) => {
      const obj = {
        children: value,
        attrs: {}
      }
      if (index === this.anumber(row)) {
        obj.attrs.colSpan = 0
      }
      return obj
    }
    const alteraColumns = [
      {
        title: 'SKU编码',
        width: 100,
        dataIndex: 'code',
        customRender: (text, row, index) => {
          if (index < this.anumber(row)) {
            return text
          }
          return {
            children: '合计',
            attrs: {
              colSpan: 1,
            }
          }
        },
      },
      {
        title: '类别',
        dataIndex: 'category',
        customRender: (text, row, index) => {
          if (index < this.anumber(row)) {
            return text;
          }
          return {
            children: this.calculationAmount(row),
            attrs: {
              colSpan: 7,
            },
          }
        },
      },
      {
        title: '工艺名称',
        dataIndex: 'name',
        width: 120,
        customRender: renderContent,
      },
      {
        title: '单位',
        dataIndex: 'unit',
        customRender: renderContent,
      },
      {
        title: '单价',
        width: 80,
        dataIndex: 'price',
        customRender: renderContent,
      },
      {
        title: '数量',
        width: 70,
        dataIndex: 'itemNum',
        customRender: renderContent,
      },
      {
        title: '金额',
        width: 80,
        dataIndex: 'amount',
        customRender: renderContent,
      },
      {
        title: '备注（工艺说明）',
        dataIndex: 'introduce',
        customRender: renderContent,
      },
    ]
    alteraColumns.forEach(item => {
      item.align = 'center'
    })
    return {
      hetongCode: '', // 合同编号
      designName: '', // 设计师
      projectAdd: '', // 工程地址
      persenName: '', // 客户姓名
      phoneNum: '', // 联系电话
      dectorionNum: '', // 装修面积
      changeDate: '', // 变更日期
      alteraColumns,
      alteraAddData,
      alteraRedData,
      reduceAmount: 0, // 当前打印页面减少项的合计
      addAmount: 0, // 当前打印页面增加项的合计
      printerLastColumns,
      lastTableData: [], // table表格的数据
    }
  },
  components: {
    commonOfferTable
  },
  props: {
  },
  created () {
    this.pageSouce = this.$route.query.xqSouce
    this.showPrinterData()
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    // 获取打印页面所有数据
    showPrinterData() {
      let sdata = {
        id: this.$route.query.id,
        workOrderId: JSON.parse(sessionStorage.getItem('orderValue')).id,
        changeType: 2
      }
      this.$request.post('/workOrderAddDrop/findNewIODDetailById', sdata).then(res => {
        if (res.code === 0) {
          this.designName = res.result.workOrderTitle.designerName
          this.projectAdd = res.result.workOrderTitle.address
          this.persenName = res.result.workOrderTitle.customerName
          this.phoneNum = res.result.workOrderTitle.phone
          this.dectorionNum = res.result.workOrderTitle.floorspaceNumber
          this.changeDate = res.result.changeDate
          // 第一个表格减项的赋值
          this.alteraAddData = res.result.key2
          if (this.alteraAddData) {
            if (this.alteraAddData.length !== 0) {
              this.alteraAddData.push({
                num: 0,
                price: 0
              })
              this.alteraAddData.forEach((item, index) => {
                item.key = index
                item.itemNum = item.num
                item.isAddRedFlag = 1 // 代表这个是减的
                item.amount = (Number(item.itemNum) * Number(item.price)).toFixed(2)
              })
            }
          }
          this.reduceAmount = res.result.reduceAmount
          // 第二个表格增项的赋值
          this.alteraRedData = res.result.key1
          if (this.alteraRedData) {
            if (this.alteraRedData.length !== 0) {
              this.alteraRedData.push({
                num: 0,
                price: 0
              })
              this.alteraRedData.forEach((item, index) => {
                item.key = index
                item.itemNum = item.num
                item.isAddRedFlag = 2 // 代表这个是增加的
                item.amount = (Number(item.itemNum) * Number(item.price)).toFixed(2)
              })
            }
          }
          this.addAmount = res.result.addAmount
          // 最后综合计费的数据
          this.lastTableData = [{
            key: 1,
            id: 1,
            mountType: '基础施工变更总费用',
            amount: res.result.changeVo.directFee,
            remark: '增项合计金额+减项合计金额',
          },{
            key: 2,
            id: 2,
            mountType: '管理费',
            amount: res.result.changeVo.manageFee,
            remark: '按合同管理费收取标准计算'
          },{
            key: 3,
            id: 3,
            mountType: '税金',
            amount: res.result.changeVo.rateFee,
            remark: '按（基础施工变更总费用+管理费）的3.38%计算'
          },{
            key: 4,
            id: 4,
            mountType: '总价',
            amount: res.result.changeVo.totalFee,
            remark: '总价=基础施工变更总费用+管理费+税金'
          }]
          this.lastTableData.push({
            key: 5,
            constructionDelayDays: res.result.constructionDelayDays
          })
          this.changeLastMarkFn(res.result.productCalculationVo)
        }
      })
    },
    changeLastMarkFn(adata) {
      // 直接工程费(A)、管理费(B)、税费(C)、调整项(D)、总价(E)
      this.lastTableData.forEach(item => {
        if (item.id == 2) {
          if (adata.manageDescription) {
            item.remark = adata.manageDescription
          } else {
            item.remark = adata.manageFormula
            item.remark = item.remark.replace(/A/g, '直接工程费')
            item.remark = item.remark.replace(/B/g, '管理费')
            item.remark = item.remark.replace(/C/g, '税费')
            item.remark = item.remark.replace(/D/g, '调整项')
            item.remark = item.remark.replace(/E/g, '总价')
            item.remark = item.remark.replace(/F/g, '税费')
            item.remark = item.remark.replace(/G/g, '管理费')
            item.remark = item.remark.replace(/H/g, '折扣费')
          }
        }
        if (item.id == 3) {
          if (adata.rateDescription) {
            item.remark = adata.rateDescription
          } else {
            item.remark = adata.rateFormula
            item.remark = item.remark.replace(/A/g, '直接工程费')
            item.remark = item.remark.replace(/B/g, '管理费')
            item.remark = item.remark.replace(/C/g, '税费')
            item.remark = item.remark.replace(/D/g, '调整项')
            item.remark = item.remark.replace(/E/g, '总价')
            item.remark = item.remark.replace(/F/g, '税费')
            item.remark = item.remark.replace(/G/g, '管理费')
            item.remark = item.remark.replace(/H/g, '折扣费')
          }
        }
        if (item.id == 4) {
          if (adata.totalDescription) {
            item = adata.totalDescription
          } else {
            item.remark = adata.totalFormula
            item.remark = item.remark.replace(/A/g, '直接工程费')
            item.remark = item.remark.replace(/B/g, '管理费')
            item.remark = item.remark.replace(/C/g, '税费')
            item.remark = item.remark.replace(/D/g, '调整项')
            item.remark = item.remark.replace(/E/g, '总价')
            item.remark = item.remark.replace(/F/g, '税费')
            item.remark = item.remark.replace(/G/g, '管理费')
            item.remark = item.remark.replace(/H/g, '折扣费')
          }
        }
      })
    },
    // 计算属性
    anumber(row) {
      if (row.isAddRedFlag == 1) {
        return this.alteraAddData.length - 1
      } else {
        return this.alteraRedData.length - 1
      }
    },
    calculationAmount(row) {
      if (row.isAddRedFlag == 1) {
        return this.reduceAmount
      } else {
        return this.addAmount
      }
    },
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
    // 打印事件
    printHtml () {
      // 获取浏览器类型
      if (this.getExplorer() == 'IE') {
        this.pagesetup_null()
      }
      window.print()
    },
    // 返回列表事件
    targeGoList () {
      this.$router.push('/offer')
    }
  }
}
</script>

<style lang="scss">
  @import '../css/alteraPrinter.scss'
</style>
