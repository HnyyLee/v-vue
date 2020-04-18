<template>
  <div class="alterationPage">
    <div class="alteration_h1">基础施工增加项</div>
    <a-button type='primary' class="addmain_btn" @click="alteratAddFn" v-if="ExamineFlag">添加SKU</a-button>
    <div class="table_Dom">
      <a-table :columns="technoListColumns" :dataSource="technoDataListOne" :rowKey="(record, index) => index" bordered :pagination='true' :locale="{ emptyText: '暂无数据' }">
        <template slot="itemNum" slot-scope="text, record">
          <a-input style="width:80px;" :disabled='!ExamineFlag' :defaultValue="text" type="number" @change="itemNumChangeOne(record.id, $event, record)"  min="0" step="0.01" v-model="record.itemNum"/>
        </template>
      </a-table>
      <div class="hold_Dom">
        <p>合计：<span>{{allAddMountOne}}</span>元</p>
      </div>
    </div>
    <!-- 工艺SKU弹框 -->
    <common-poplur ref="technoCommonPoplurOne" :dialogColums="technoAddColumns" :dialogData="technoPoplurListOne" textMapTitle="添加工艺" @sumbitPoplur="technoSubmitReplaceOne" :searchData="poplurSearchDataOne" :rowType='1' @topSearchThink="topSearchThinkOne" @cannalThink="cannalThinkOne">
    </common-poplur>


    <div class="alteration_h1">基础施工减少项</div>
    <a-button type='primary' class="addmain_btn" @click="alteratRedFn" v-if="ExamineFlag">添加SKU</a-button>
    <div class="table_Dom">
      <a-table :columns="technoListColumns" :dataSource="technoDataListTwo"  bordered :pagination='true' :locale="{ emptyText: '暂无数据' }">
        <template slot="itemNum" slot-scope="text, record">
          <a-input style="width:80px;" :disabled='!ExamineFlag' :defaultValue="text" type="number" @change="itemNumChangeTwo(record.id, $event, record)"  min="0" step="0.01" v-model="record.itemNum"/>
        </template>
      </a-table>
      <div class="hold_Dom">
        <p>合计：<span>{{-allAddMountTwo}}</span>元</p>
      </div>
    </div>
    <!-- 工艺SKU弹框 -->
    <common-poplur ref="technoCommonPoplurTwo" :dialogColums="technoAddColumns" :dialogData="technoPoplurListTwo" textMapTitle="添加工艺" @sumbitPoplur="technoSubmitReplaceTwo" :searchData="poplurSearchDataTwo" :rowType='1' @topSearchThink="topSearchThinkTwo" @cannalThink="cannalThinkTwo">
    </common-poplur>

    <!-- 工期影响，加入审批模板 -->
    <a-form :form="formData">
      <div>
        <div class="alteration_h2">工期影响</div>
        <a-form-item v-bind="formItemLayout">
          工期延顺<a-input v-decorator="verify.myduration" style="width: 120px; margin: 0px 10px 0px 10px" :disabled='!ExamineFlag' type="number" min="0" step="0.1" />个工作日
        </a-form-item>
      </div>
      
      <div v-if="ExamineFlag">
        <div class="alteration_h2">审批模板</div>
        <a-form-item v-bind="formItemLayout">
          <a-select v-decorator="verify.myapproval" style="width: 420px" placeholder="请选择审批模板">
            <a-select-option v-for="(item, index) in approvalList" :key="index" :value="item.id">{{item.processRangeName}}</a-select-option>
          </a-select>
        </a-form-item>
      </div>
    </a-form>

    <div class="footer" v-if="!showHoldLastTable"><a-button type='primary' class="footerBtn" @click="footholdFn">计算综合费用</a-button></div>

    <div class="lastTable_Dom" v-if="showHoldLastTable">
      <div class="alteration_h2">综合计费</div>
      <a-table :columns="lastTableColumns" :dataSource="lastTableData"  bordered :pagination='true' :locale="{ emptyText: '暂无数据' }">
      </a-table>
    </div>

    <div class="bottom_Btn" v-if="showHoldLastTable">
      <a-button type='primary' class="submit_btn" @click="mySubmitFn" v-if="ExamineFlag">提交</a-button>
      <a-button class="cannal_btn" @click="myCannalFn">取消</a-button>
    </div>
    
  </div>
</template>
<script>

import { technoListColumns, technoAddColumns, poplurSearchDataOne, poplurSearchDataTwo, lastTableColumns } from '../js/colums'
import commonPoplur from '@/views/OfferManagement/children/commonPoplur/commonPoplur'
import { alterationOne } from '../js/alterationOne'
import { alterationTwo } from '../js/alterationTwo'

export default {
  data () {
    return {
      formData: this.$form.createForm(this),
      technoListColumns,
      technoAddColumns,
      technoDataListOne: [],
      technoPoplurListOne: [], // table表格的数据
      poplurSearchDataOne, // 弹框的搜索数据
      allAddMountOne: 0, // 增加项的合计
      technoDataListTwo: [],
      technoPoplurListTwo: [], // table表格的数据
      poplurSearchDataTwo, // 弹框的搜索数据
      allAddMountTwo: 0, // 增加项的合计
      lastTableColumns,
      lastTableData: [], // table表格的数据
      showHoldLastTable: false, // 显示最后一个表格
      verify: {
        myapproval: [ 'myapproval', { rules: [ { required: true, message: '请选择审批模板' } ] } ],
        myduration: [ 'myduration', 
          { rules: [ { pattern: /^(0\.\d|[1-9]\d{0,3}(\.?\d)?)$/, message: '请输入正确工期延顺工作日，小数点后保留一位' } ] } 
        ],
      },
      approvalList: [], // 审批模板下拉框数据
      ExamineFlag: true, // 查看页面的falg
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 24 }
        }
      }
    }
  },
  created () {
    if (this.$route.query.pageSouch == 'edit' || this.$route.query.pageSouch == 'examine') {
      this.editAlterFn()
    }
    if (this.$route.query.pageSouch == 'examine') this.ExamineFlag = false
    // 审批模板选择下拉框的列表数据
    this.approvalFn()
  },
  mixins: [alterationOne, alterationTwo],
  components: {
    commonPoplur
  },
  methods: {
    // 审批模板选择下拉框的列表数据
    approvalFn() {
      let adata = {
        processCode: 'Change',
        pageSize: 10000
      }
      this.$request.post('/processTemplate/userList', adata).then(res => {
        if (res.code === 0) {
          this.approvalList = res.result.list
        }
      })
    },
    // 假如当前为编辑页面，编辑事件
    editAlterFn() {
      let sdata = {
        id: this.$route.query.id,
        workOrderId: JSON.parse(sessionStorage.getItem('orderValue')).id,
        changeType: 2
      }
      this.$request.post('/workOrderAddDrop/findNewIODDetailById', sdata).then(res => {
        if (res.code === 0) {
          this.technoDataListOne = res.result.key1
          this.technoDataListOne.forEach(item => {
            item.key = item.id
            item.itemNum = item.num
          })
          this.spliceRangAllMountOne()
          this.technoDataListTwo = res.result.key2
          this.technoDataListTwo.forEach(item => {
            item.key = item.id
            item.itemNum = item.num
          })
          this.spliceRangAllMountTwo()
          this.showHoldLastTable = true

          this.verify.myduration[1].initialValue = res.result.constructionDelayDays
          this.lastTableData = [{
            key: 1,
            id: 1,
            mountType: '基础施工变更总费用',
            amount: res.result.changeVo.directFee,
            remark: '增项合计金额+减项合计金额'
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
          this.changeRemarkFn()
        }
      })
    },
    // 点击计算综合费用事件
    footholdFn() {
      let difference = -(Number(this.allAddMountTwo)) + Number(this.allAddMountOne)
      let adata = {
        workOrderId: JSON.parse(sessionStorage.getItem('orderValue')).id,
        changePrice: difference,
      }
      this.$request.post('/quote/calculateChange', adata).then(response => {
        if (response.code == 0) {
          this.$message.success('计算成功')
          this.showHoldLastTable = true
          this.lastTableData = [{
            key: 1,
            id: 1,
            mountType: '基础施工变更总费用',
            amount: response.result.directFee,
            remark: '增项合计金额+减项合计金额'
          },{
            key: 2,
            id: 2,
            mountType: '管理费',
            amount: response.result.manageFee,
            remark: '按合同管理费收取标准计算'
          },{
            key: 3,
            id: 3,
            mountType: '税金',
            amount: response.result.rateFee,
            remark: '按（基础施工变更总费用+管理费）的3.38%计算'
          },{
            key: 4,
            id: 4,
            mountType: '总价',
            amount: response.result.totalFee,
            remark: '总价=基础施工变更总费用+管理费+税金'
          }]
          this.changeRemarkFn()
        }
      })
    },
    // 动态修改综合计算表格的备注
    changeRemarkFn() {
      this.$request.post('/quote/queryQuoteProductRules', { workOrderId: JSON.parse(sessionStorage.getItem('orderValue')).id }).then(res => {
        if (res.code == 0) {
          // 直接工程费(A)、管理费(B)、税费(C)、调整项(D)、总价(E)
          this.lastTableData.forEach(item => {
            if (item.id == 2) {
              if (res.result.manageDescription) {
                item.remark = res.result.manageDescription
              } else {
                item.remark = res.result.manageFormula
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
              if (res.result.rateDescription) {
                item.remark = res.result.rateDescription
              } else {
                item.remark = res.result.rateFormula
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
              if (res.result.totalDescription) {
                item = res.result.totalDescription
              } else {
                item.remark = res.result.totalFormula
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
        }
      })
    },
    // 提交事件
    mySubmitFn() {
      this.formData.validateFieldsAndScroll((err, values) => {
        if (!err) {
          // 循环出数据
          let arr = []
          this.technoDataListOne.forEach(item => {
            let iObj = {
              skuId: item.id,
              changeQty: item.itemNum,
              itemType: 1,
              changeType: 2,
              price: item.price
            }
            arr.push(iObj)
          })
          this.technoDataListTwo.forEach(item => {
            let iObj = {
              skuId: item.id,
              changeQty: item.itemNum,
              itemType: 2,
              changeType: 2,
              price: item.price
            }
            arr.push(iObj)
          })
          let achangFlag = true
          arr.forEach(item => {
            if (!item.changeQty) {
              achangFlag = false
            }
          })
          if (!achangFlag) {
            this.$message.info('请输入完整的数量')
            return
          }
          if (!values.myduration) values.myduration = 0
          let obj = {
            changeType: 2,
            addAmount: Number(this.allAddMountOne),
            reduceAmount: -Number(this.allAddMountTwo),
            changeAmount: -(Number(this.allAddMountTwo)) + Number(this.allAddMountOne),
            constructionDelayDays: values.myduration,
            listAllSku: arr,
            processId: values.myapproval
          }
          if (this.$route.query.pageSouch === 'add') {
            obj.workOrderId = JSON.parse(sessionStorage.getItem('orderValue')).id
          } else {
            obj.id = this.$route.query.id
            obj.workOrderId = JSON.parse(sessionStorage.getItem('orderValue')).id
          }
          if (obj.listAllSku.length == 0) {
            this.$message.info('请先添加要变更的项目')
            return
          }
          this.$request.post('/workOrderAddDrop/addOrUpdateIncreaseOrDecrease', obj).then(res => {
            if (res.code === 0) {
              this.$message.success('提交成功')
              this.$router.push('/add-decrease')
            }
          })
        }
      })
    },
    // 取消事件
    myCannalFn() {
      history.go(-1)
    }
  }
}
</script>
<style lang="scss">
.alterationPage {
  .alteration_h1{
    margin: 30px 0px 10px 0px;
    font-size: 18px;
    font-weight: bold;
    display: inline-block;
  }
  .alteration_h2{
    margin: 25px 0px 10px 0px;
    font-size: 18px;
    font-weight: bold;
    display: block;
  }
  .addmain_btn{
    background: #85CE61;
    border: 1px solid #85CE61;
    float: right;
    margin-top: 20px
  }
  .hold_Dom{
    margin-top: 5px;
    span{
      font-size: 20px;
      font-weight: bold;
    }
  }
  .footer{
    text-align: center;
    margin: 50px 0px;
    .footerBtn{
      line-height: 55px;
      height: 55px;
    }
  }
  .bottom_Btn{
    text-align: center;
    margin-top: 30px;
    .submit_btn{
      margin-right: 20px;
      height: 38px;
      width: 110px;
    }
    .cannal_btn{
      height: 38px;
      width: 110px;
    }
  }
}
</style>
