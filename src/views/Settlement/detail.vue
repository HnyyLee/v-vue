<template>
  <div class="settlement_detail_wrap">
    <div class="settlement_detail_header settlement_detail_box" v-if='!showType'>
      <span class="header_title">状态:</span>
      <span>{{this.orderInfo[0].approved === true ? '审核通过' : '审核拒绝'}}</span>
      <span class="header_title" style="margin-left: 50px;">审核时间:</span>
      <span>{{this.orderInfo[0].approvalTime}}</span>
    </div>
    <a-table :columns="columns1" :dataSource="orderInfo" :rowKey="record => record.customerPhone" bordered :pagination='false' :locale='locale' />
    <h4 class="settlement_detail_title">客户结算</h4>
    <a-table :columns="columns2" :dataSource="dataList"  bordered :pagination='false' :locale='locale'>
      <div slot="totalAmount" slot-scope="item, text">
        <div v-if="text.receivableType === '尾款'">
          <!-- <a-input v-model="wkPirce" placeholder='输入尾款' v-if="souch === 1" style="width: 200px;" /> -->
          <span>{{text.receivableAmount}}</span>
          +工程变更{{text.changeAmount}}={{text.totalAmount}}
        </div>
        <div v-if="text.receivableType !== '尾款'">
          {{item}}
        </div>
      </div>
    </a-table>
    <p class="apaySplice">注：线下支付金额不计入合计</p>
    <div v-if="showType" class="settlement_detail_footer settlement_detail_box">
      <a-button type="primary" style="margin-right: 10px;" @click="suer" v-if="RouterNameFlag[mythat.$route.name] || RouterNameFlag['settlement_Agree']">通过</a-button>
      <a-button @click="refuse" v-if="RouterNameFlag[mythat.$route.name] || RouterNameFlag['settlement_Refuse']">拒绝</a-button>
    </div>
    <a-modal
      title="结算款审核"
      :visible="visible"
      :maskClosable='false'
      @ok="handleOk"
      @cancel="handleCancel"
      okText='确定'
      cancelText='取消'
      :okButtonProps="{ props: { loading: settDetailLoading } }">
      <p>{{ModalText}}</p>
    </a-modal>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import { type } from 'os'
import { myPower } from '@/common/utils/power.js'

const columns1 = [
  {
    title: '工单名称',
    dataIndex: 'workOrderTitle',
    align: 'center'
  },
  {
    title: '客户电话',
    dataIndex: 'customerPhone',
    align: 'center'
  },
  {
    title: '省',
    dataIndex: 'province',
    align: 'center'
  },
  {
    title: '市',
    dataIndex: 'city',
    align: 'center'
  },
  {
    title: '区',
    dataIndex: 'district',
    align: 'center'
  },
  {
    title: '小区',
    dataIndex: 'project',
    align: 'center'
  },
  {
    title: '栋',
    dataIndex: 'building',
    align: 'center'
  },
  {
    title: '单元号-房号',
    dataIndex: 'house',
    align: 'center'
  }
]
const columns2 = [
  {
    title: '款项',
    dataIndex: 'receivableType',
    align: 'center'
  },
  {
    title: '应收',
    dataIndex: 'totalAmount',
    align: 'center',
    scopedSlots: { customRender: 'totalAmount' }
  },
  {
    title: '实收',
    dataIndex: 'receivedAmount',
    align: 'center'
  },
  {
    title: '收款方式',
    dataIndex: 'paymentName',
    align: 'center'
  },
  {
    title: '日期',
    dataIndex: 'paymentTime',
    align: 'center'
  }
]
export default {
  data () {
    return {
      mythat: this,
      showType: true,
      columns1,
      columns2,
      wkPirce: '',
      dataList: [],
      visible: false,
      type: 0, // 1为结算2位决绝
      souch: 1,
      orderInfo: [], // 头部工单信息
      locale: { emptyText: '暂无数据' }, // 没有数据文案
      totalPrice: 0, // 总价
      lstotalPrice: 0, // 进来时候默认总价
      wkTotal: 0, // 尾款合计
      ModalText: '是否通过客户结算款审核',
      settDetailLoading: false // 通过按钮的loading
    }
  },
  watch: {
    wkPirce (val) {
      this.dataList.forEach((item, index) => {
        if (item.receivableType === '尾款') {
          item.receivableAmount = val - 0
          item.totalAmount = ((((item.receivableAmount - 0) * 100) + ((item.changeAmount - 0) * 100)) / 100).toFixed(2)
          this.wkTotal = item.totalAmount
        }
        if (item.receivableType === '合计') {
          item.receivableAmount = ((((this.lstotalPrice - 0) * 100) + ((val - 0) * 100)) / 100).toFixed(2)
        }
      })
    }
  },
  mixins: [myPower],
  created () {
    if (this.$route.query.type === 2 || this.$route.query.type === '2') {
      this.showType = false
      this.souch = 2
      this.getCloseList()
    } else {
      this.getCloseList()
    }
    this.orderInfo.push(JSON.parse(sessionStorage.getItem('orderInfo')))
  },
  methods: {
    getCloseList () { // 获取未结算清单
      this.$request.get('/settlement/receivable_refund/snapshot/list?processInstanceId=' + this.$route.query.id).then(res => {
        if (res.code === 0) {
          if (res.result.length !== 0) {
            let totalPriced = 0
            res.result.forEach((item, index) => { // 循环出数组的key
              if (item.receivableType === '尾款') {
                let obj = item
                obj.key = index
                obj.totalAmount = ((((obj.changeAmount - 0) * 100) + ((obj.receivableAmount - 0) * 100)) / 100).toFixed(2)
                obj.time = dayjs(item.time).format('YYYY-MM-DD HH:mm:ss')
                this.dataList.push(obj)
                totalPriced = ((((totalPriced - 0) * 100) + ((item.totalAmount - 0) * 100)) / 100).toFixed(2) // 计算出合计的金额
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
            this.dataList.forEach(idom => {
              if (idom.paymentType == 'hundsun_wechatlet') {
                idom.paymentName = '微信支付'
              } else if (idom.paymentType == 'hundsun_nfxpos_act') {
                idom.paymentName = 'POS机支付'
              } else if (idom.paymentType == 'under_line') {
                idom.paymentName = '线下支付'
              }
            })
            // res.result.forEach((item, index) => { // 循环出数组的key
            //   if (item.receivableType === '尾款') {
            //     let obj = item
            //     obj.key = index
            //     obj.totalAmount = (((obj.changeAmount - 0) * 100) + ((obj.receivableAmount - 0) * 100)) / 100
            //     // obj.receivableAmount = (((obj.changeAmount - 0) * 100) + ((obj.totalAmount - 0) * 100)) / 100
            //     obj.time = dayjs(item.time).format('YYYY-MM-DD HH:mm:ss')
            //     this.dataList.push(obj)
            //     totalPriced = (((totalPriced - 0) * 100) + ((item.changeAmount - 0) * 100)) / 100 // 计算出合计的金额
            //   } else {
            //     let obj = item
            //     obj.key = index
            //     obj.time = dayjs(item.time).format('YYYY-MM-DD HH:mm:ss')
            //     this.dataList.push(obj)
            //     totalPriced = (totalPriced - 0) + (item.totalAmount - 0) // 计算出合计的金额
            //   }
            // })
            // 计算总价的时候会需要用着2个总价
            this.totalPrice = totalPriced // 会改变的总价
            this.lstotalPrice = totalPriced // 默认的总价；不改变；需要用作与计算
            let obj2 = {
              key: 'hj',
              receivableType: '合计',
              totalAmount: totalPriced,
              time: ''
            }
            this.dataList.push(obj2)
          }
        }
      })
    },
    suer () {
      this.visible = true
      this.type = 1
      this.ModalText = '是否通过客户结算款审核'
    },
    refuse () {
      this.visible = true
      this.type = 2
      this.ModalText = '是否拒绝客户结算款审核'
    },
    handleOk () {
      let obj = {
        processInstanceId: this.$route.query.id
      }
      if (this.type === 1) {
        obj.approved = true
      } else if (this.type === 2) {
        obj.approved = false
      }
      this.settDetailLoading = true
      this.$request.post('/process/approval', obj).then(res => {
        if (res.code === 0) {
          this.settDetailLoading = false
          this.visible = false
          if (type === 1) {
            this.$message.success('发起结算审批通过')
          } else if (type === 2) {
            this.$message.success('发起结算审批拒绝通过')
          }
          setTimeout(this.$router.push('/settlement'), 2000)
        }
      })
    },
    handleCancel () {
      this.settDetailLoading = false
      this.visible = false
    }
  }
}
</script>
<style lang="scss">
  .settlement_detail_wrap {
    .settlement_detail_box {
      display: flex;
    }
    .settlement_detail_header {
      align-items: center;
      margin: 20px 0;
      span {
        font-size: 14px;
      }
      .header_title {
        font-size: 16px;
        font-weight: 700;
        margin-right: 5px;
      }
    }
    .settlement_detail_title {
      margin: 50px 0 20px 0;
      font-size: 16px;
      font-weight: 700;
    }
    .settlement_detail_footer {
      justify-content: center;
      margin-top: 30px;
    }
  }
  .apaySplice{
    color: #FF2214;
    font-size: 12px;
    margin: 15px 0px 20px 0px; 
  }
</style>
