<template>
  <div class="construc_detail_wrap">
    <!-- <common-header :value='infoValue'></common-header> -->
    <!-- <div class="constru_box_header">
      <span class="constru_box_header_title">总工程款</span>
      <div>
        <a-input placeholder="请输入总款"  style="width: 500px; margin-right: 5px;"/>
        <span>输入完工后的最终工程总额</span>
      </div>
    </div> -->
    <div class="construc_detail_header_tab">
      <span :class="{active: defaltNum === 1}" @click="selectFun(1)">发起结算</span>
      <span :class="{active: defaltNum === 2}" style="border-left: none;" @click="selectFun(2)">历史记录</span>
      <!-- <a-button type="primary">发起结算</a-button>
      <a-button type="primary">历史记录</a-button> -->
    </div>
    <div class="title_header">{{showPage === true ? '客户收款单：' : '结算申请记录'}}</div>
    <a-table v-show="showPage" :columns="columns" :dataSource="dataList" bordered :pagination='false' :locale='locale'>
      <template slot="totalAmount" slot-scope="item, text">
        <div v-if="text.receivableType === '尾款'">
          <a-input v-model="wkPirce" placeholder='输入尾款' v-if="sourch === 'wjs'" style="width: 200px;" />
          <span v-if="sourch === 'yjs'">{{item}}</span>
          +工程变更{{text.changeAmount}}={{text.totalAmount}}
        </div>
        <div v-if="text.receivableType !== '尾款'">
          {{item}}
        </div>
      </template>
    </a-table>
    <a-table v-show="!showPage" :columns="columnsTitle" :dataSource="historyList" bordered :pagination='false' :locale='locale' :rowKey="(record, index) => index" >
      <span slot="status" slot-scope="text">
        {{text == 1 ? '待审核': text == 2 ? '审核通过' : '审核拒绝'}}
      </span>
    </a-table>
    <p class="apaySplice">注：线下支付金额不计入合计</p>
    <!-- 加入审批模板 -->
    <a-form :form='formData'>
      <div class="Contract_box_item">
        <span class="Contract_box_item_title">审批模板</span>
        <a-form-item style="margin-bottom: 0;">
          <a-select v-decorator="verify.myapproval" style="width: 420px" placeholder="请选择审批模板">
            <a-select-option v-for="(item, index) in approvalList" :key="index" :value="item.id">{{item.processRangeName}}</a-select-option>
          </a-select>
        </a-form-item>
      </div>
    </a-form>

    <div v-show="showPage" class="Constru_box_footer" v-if="this.$route.query.sourch === 'wjs'" >
      <a-button type="primary" @click="sure" v-if="RouterNameFlag[mythat.$route.name] || RouterNameFlag['construction_submitBtn']">提交</a-button>
      <a-button style="margin-left: 10px;" @click="cancel">取消</a-button>
    </div>
    <a-modal
      title="发起结算"
      :visible="visible"
      :maskClosable='false'
      @ok="handleOk"
      @cancel="handleCancel"
      okText='确定'
      cancelText='取消'
      :okButtonProps="{ props: { loading: constrBtnLoading } }" >
      <p>是否发起结算</p>
    </a-modal>
  </div>
</template>
<script>
// import CommonHeader from '@/components/CommonHeader/index.vue'
import titleList from './js/index'
import { myapproval } from './js/index'
import dayjs from 'dayjs'

import { myPower } from '@/common/utils/power.js'

export default {
  data () {
    return {
      mythat: this,
      formData: this.$form.createForm(this),
      verify: {
        myapproval
      }, // 审批模板表单绑定数据
      approvalList: [], // 审批模板下拉框数据
      processId: '', // 审批模板贮存的id
      columnsTitle: [
        {
          title: '发起时间',
          dataIndex: 'createTime',
          class: 'column-center'
        },
        {
          title: '定金',
          dataIndex: 'earnestAmount',
          class: 'column-center'
        },
        {
          title: '一期款',
          dataIndex: 'firstAmount',
          class: 'column-center'
        },
        {
          title: '二期款',
          dataIndex: 'secondAmount',
          class: 'column-center'
        },
        {
          title: '退款',
          dataIndex: 'totalRefundAmount',
          class: 'column-center'
        },
        {
          title: '尾款金额',
          dataIndex: 'totalTailAmount',
          class: 'column-center'
        },
        {
          title: '审核状态',
          dataIndex: 'status',
          class: 'column-center',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '审核时间',
          dataIndex: 'updateTime',
          class: 'column-center'
        }
      ],
      historyList: [], // 流水记录
      locale: { emptyText: '暂无数据' }, // 无数据显示文案
      // infoValue: { index: 7 },
      orderId: {}, // 工单信息
      columns: [], // 待结算结算信息列表标题
      dataList: [], // 未结算
      dataSource1: [], // 已结算
      wkPirce: '', // 输入尾款
      wkTotal: 0, // 尾款总计
      totalPrice: 0, // 总计
      lstotalPrice: 0, // 临时存储的总计
      sourch: '', // 来源
      visible: false,
      showPage: true,
      noFlag: '', // 合计金额，用来判断是否可以结算； 小于0不允许结算
      defaltNum: 1,
      btnFlag: false, // 解决重复提交的问题
      count: 100,
      constrBtnLoading: false, // 是否发起结算的弹框里面提交按钮的loading 
    }
  },
  // components: {
  //   CommonHeader
  // },
  created () {
    this.columnsTitle.forEach(item => {
      item.align = 'center'
    })
    this.sourch = this.$route.query.sourch
    this.orderId = JSON.parse(sessionStorage.getItem('orderValue'))
    this.columns = titleList.titleList1
    this.getCloseList()
    // 审批模板选择下拉框的列表数据
    this.approvalFn()
  },
  mixins: [myPower],
  watch: {
    wkPirce (val) {
      if (val != '-') {
        const reg = /(^-?([1-9]\d*|0))(\.\d{0,2}){0,1}$/
        if (reg.test(val)) {
          this.dataList.forEach((item, index) => {
            if (item.receivableType === '尾款') {
              item.totalAmount = (((((val - 0) * 100)) + ((item.changeAmount - 0) * 100)) / 100).toFixed(2)
              this.wkTotal = item.totalAmount
            }
            if (item.receivableType === '合计') {
              item.totalAmount = ((((this.lstotalPrice - 0) * 100) + ((val - 0) * 100)) / 100).toFixed(2)
              this.noFlag = item.totalAmount
            }
          })
        } else {
          this.dataList.forEach((item, index) => {
            if (item.receivableType === '尾款') {
              item.totalAmount = (((((val - 0) * 100)) + ((item.changeAmount - 0) * 100)) / 100).toFixed(2)
            }
            if (item.receivableType === '合计') {
              item.totalAmount = ((((this.lstotalPrice - 0) * 100) + ((val - 0) * 100)) / 100).toFixed(2)
              this.noFlag = item.totalAmount
            }
          })
          this.wkPirce = this.wkPirce.substring(0, val.length - 1)
        }
      }
    }
  },
  methods: {
    // 审批模板选择下拉框的列表数据
    approvalFn() {
      let adata = {
        processCode: 'Settlement',
        pageSize: 10000
      }
      this.$request.post('/processTemplate/userList', adata).then(res => {
        if (res.code === 0) {
          this.approvalList = res.result.list
        }
      })
    },
    getListFun () {
      this.historyList = []
      this.$request.get('/settlement/history/list?workOrderNumber=' + this.orderId.code).then(res => {
        // '/settlement/history/list?workOrderNumber=' + this.orderId.code
        if (res.code === 0) {
          if (res.result) {
            this.historyList = res.result
          }
        }
      })
    },
    selectFun (i) {
      this.defaltNum = i
      if (i === 1) {
        this.showPage = true
      } else {
        this.showPage = false
      }
      this.getListFun()
    },
    getCloseList () { // 获取未结算清单
      this.$request.get('/settlement/receivable_refund/current/list?workOrderNumber=' + this.orderId.code).then(res => {
        // '/settlement/receivable_refund/list?workOrderNumber=' + this.orderId.code
        if (res.code === 0) {
          if (res.result.length !== 0) {
            let totalPriced = 0
            res.result.forEach((item, index) => { // 循环出数组的key
              if (item.receivableType === '尾款') {
                let obj = item
                obj.key = index
                obj.totalAmount = ((((obj.changeAmount - 0) * 100) + ((obj.receivableAmount - 0) * 100)) / 100).toFixed(2)
                // obj.receivableAmount = (((obj.changeAmount - 0) * 100) + ((obj.totalAmount - 0) * 100)) / 100
                obj.time = dayjs(item.time).format('YYYY-MM-DD HH:mm:ss')
                this.dataList.push(obj)
                totalPriced = ((((totalPriced - 0) * 100) + ((item.changeAmount - 0) * 100)) / 100).toFixed(2) // 计算出合计的金额
              } else {
                let obj = item
                obj.key = index
                obj.time = dayjs(item.time).format('YYYY-MM-DD HH:mm:ss')
                this.dataList.push(obj)
                if (item.paymentType == 'under_line') {
                  totalPriced = ((((totalPriced - 0) * 100) + (0 - 0) * 100) / 100).toFixed(2) // 计算出合计的金额
                } else {
                  totalPriced = ((((totalPriced - 0) * 100) + (item.totalAmount - 0) * 100) / 100).toFixed(2) // 计算出合计的金额
                }
              }
            })
            // 计算总价的时候会需要用着2个总价
            this.totalPrice = totalPriced // 会改变的总价
            this.lstotalPrice = totalPriced // 默认的总价；不改变；需要用作与计算
            let obj2 = {
              key: 'hj',
              receivableType: '合计',
              totalAmount: totalPriced,
              time: ''
            }
            this.noFlag = obj2.totalAmount
            this.dataList.push(obj2)

            this.dataList.forEach(idom => {
              if (idom.paymentType == 'hundsun_wechatlet') {
                idom.paymentName = '微信支付'
              } else if (idom.paymentType == 'hundsun_nfxpos_act') {
                idom.paymentName = 'POS机支付'
              } else if (idom.paymentType == 'under_line') {
                idom.paymentName = '线下支付'
              }
            })
          }
        }
      })
    },
    getList () { // 获取已结算列表
      this.$request.get('').then(res => {
        if (res.code === 0) {
          this.dataSource1 = res.result
        }
      })
    },
    onCellChange (key, dataIndex, value) {
      const dataSource1 = [...this.dataSource1]
      const target = dataSource1.find(item => item.key === key)
      if (target) {
        target[dataIndex] = value
        this.dataSource1 = dataSource1
      }
    },
    onDelete (key) {
      const dataSource1 = [...this.dataSource1]
      this.dataSource1 = dataSource1.filter(item => item.key !== key)
    },
    handleOk () {
      let obj = {
        workOrderNumber: this.$route.query.id,
        receivableTailAmount: this.wkPirce - 0,
        totalTailAmount: this.wkTotal,
        processId: this.processId
      }
      if (this.btnFlag === false) {
        this.btnFlag = true
        this.constrBtnLoading = true
        this.$request.post('/settlement/apply', obj).then(res => {
          if (res.code === 0) {
            this.constrBtnLoading = false
            this.btnFlag = false
            this.visible = false
            this.$message.success('发起结算成功')
            setTimeout(this.$router.push('/construction'), 2000)
          }
        }).catch(err => {
          this.btnFlag = false
        })
      }
    },
    handleCancel () {
      this.constrBtnLoading = false
      this.visible = false
    },
    sure () {
      if (!this.wkPirce) {
        this.$message.error('请输入尾款')
        return
      }
      if (this.noFlag < 0) {
        this.$message.error('合计金额不能小于0')
        return
      }
      this.formData.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.processId = values.myapproval
          this.visible = true
        }
      })
    },
    cancel () {
      this.$router.push('/construction')
    }
  }
}
</script>
<style lang="scss">
  .title_header {
    margin: 10px 0px;
  }
  .construc_detail_header_tab {
    display: flex;
    justify-content: center;
    margin: 20px 0;
    span {
      text-align: center;
      padding: 20px;
      color: #fff;
      border: 1px solid #e8e8e8;
      background-color: #6cf;
    }
    .active {
      background-color: #08f
    }
  }
  .Constru_box {
    display: flex;
    justify-content: space-between;
    margin: 40px 0 10px 0
  }
  .Constru_box_footer {
    display: flex;
    justify-content: center;
    margin-top: 30px;
  }
  .constru_box_header {
    display: flex;
    align-items: center;
    margin: 30px 0;
    border: 1px solid #e8e8e8;
    &_title {
      margin-right: 10px;
      padding: 20px;
      border-right: 1px solid #e8e8e8;
    }
  }
  .apaySplice{
    color: #FF2214;
    font-size: 12px;
    margin: 15px 0px 20px 0px; 
  }
</style>
