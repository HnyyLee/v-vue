<template>
  <div class="capital_wrap">
    <h3>资金管理</h3>
    <div class="capital_header">
      <div class="capital_header_price">
        可提现额度
        <span>{{price}}元</span>
      </div>
      <a-button type='primary' @click="submit" v-if="RouterNameFlag[mythat.$route.name] || RouterNameFlag['capital_Cash']">提现</a-button>
    </div>
    <h4>资金交易流水:</h4>
    <div class="capital_content">
      <a-table :columns="columns" :dataSource="dataArr" bordered :rowKey='record => record.id' :pagination='false' :locale='locale'>
        <span slot="businessType" slot-scope="val">
          {{getType(val)}}
        </span>
        <span slot="orderNo" slot-scope="val, recod">
          {{val ? val : recod.serialNo}}
        </span>
        <a href="javascript:;" slot="workOrderNumber" slot-scope="val, record" @click="gotoWork(record)">{{val}}</a>
      </a-table>
      <div class="capital_pagnin">
        <a-pagination showSizeChanger :pageSize.sync="pageSize" @showSizeChange="onShowSizeChange" :total="total" v-model="current" style="margin-top: 30px;"/>
      </div>
    </div>
    <!-- <a-modal
      title="资金提现"
      :visible="visible"
      okText='提交'
      cancelText='取消'
      :maskClosable='false'
      @ok='handleOk'
      @cancel='cancelFun'>
      <div>
        <span>密码验证</span>
        <a-input v-model="pasword" type='password'></a-input>
      </div>
    </a-modal> -->
    <a-modal
      title="资金提现"
      :visible="visible2"
      :maskClosable='false'
      okText='确定'
      cancelText='取消'
      @ok='handleOk2'
      @cancel='cancelFun'
      :okButtonProps="{ props: { loading: capitalLoading } }">
      <div>
        <span>可提现金额：</span>
        <span style="font-size: 23px;">{{price}}</span>元
      </div>
      <div style="margin-top: 10px;">
        <span>本次提现金额：</span>
        <a-input v-model="submitPirce"></a-input>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { pandRequestUrl } from '@/common/utils/request'
import { myPower } from '@/common/utils/power.js'

export default {
  data () {
    return {
      mythat: this,
      price: '', // 可提现金额
      submitPirce: '', // 提现金额
      pasword: '', // 密码
      visible: false,
      visible2: false,
      dataArr: [], // 数据列表
      current: 1,
      pageSize: 10,
      locale: { emptyText: '暂无数据' },
      commercialInfo: {
        'id': 16,
        'companyName': '深圳市第五空间有限公司11',
        'status': 0,
        'statusName': '已通过'
      }, // 商户信息
      total: 0, // 总数
      btnFlag: false, // 重复提交问题
      columns: [
        {
          title: '时间',
          align: 'center',
          width: 140,
          dataIndex: 'createTime'
        },
        {
          title: '账号',
          align: 'center',
          width: 250,
          dataIndex: 'name'
        },
        {
          title: '金额（元）',
          align: 'center',
          width: 110,
          dataIndex: 'businessAmount'
        },
        {
          title: '交易类型',
          align: 'center',
          width: 90,
          dataIndex: 'businessType',
          scopedSlots: { customRender: 'businessType' }
        },
        {
          title: '操作人',
          align: 'center',
          width: 90,
          dataIndex: 'fullName',
        },
        {
          title: '工单编号',
          align: 'center',
          width: 180,
          dataIndex: 'workOrderNumber',
          scopedSlots: { customRender: 'workOrderNumber' }
        },
        {
          title: '工单名称',
          align: 'center',
          width: 150,
          dataIndex: 'title',
        },
        {
          title: '订单号',
          align: 'center',
          width: 220,
          dataIndex: 'orderNo',
          scopedSlots: { customRender: 'orderNo' }
        }
      ],
      capitalLoading: false // 资金体现弹框确认按钮的loading
    }
  },
  mixins: [myPower],
  watch: {
    current (val) {
      this.current = val
      this.getDataFun()
    },
    submitPirce (val) {
      const reg = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/
      if (!reg.test(val)) {
        this.$message.error('请输入正确的金额,例如1,1.0,0.11')
        this.submitPirce = this.submitPirce.substring(0, val.length - 1)
        // this.submitPirce = ''
      }
    }
  },
  created () {
    // this.getDataFun()
    this.getCommercial()
  },
  methods: {
    getType (val) {
      let str = val - 0
      let name = ''
      if (str === 1) {
        name = '提现'
      } else if (str === 3) {
        name = '售后退款'
      } else if (str === 4) {
        name = '结算'
      } else if (str === 21) {
        name = '预付款'
      } else if (str === 23) {
        name = '营销费结算'
      } else if (str === 12) {
        name = '保证金补充'
      } else if (str === 7) {
        name = '保证金退款抵扣'
      }
      return name
    },
    handleOk () {
      this.visible2 = true
      this.visible = false
    },
    cancelFun () {
      this.capitalLoading = false
      this.visible = false
      this.visible2 = false
    },
    handleOk2 () {
      let obj = {
        businessNumber: 'PUYUN',
        totalFee: (this.submitPirce - 0) * 100,
        // password: this.pasword,
        relatedId: this.commercialInfo.id,
        remark: ''
      }
      if (this.btnFlag === false) {
        this.btnFlag = true
        this.capitalLoading = true
        this.$request.post(pandRequestUrl + '/supplier/trade/withdrawals', obj).then(res => {
          if (res.code === 0) {
            this.capitalLoading = false
            this.btnFlag = false
            this.getDataFun()
            this.getPirceFun()
            this.visible2 = false
          }
        }).catch(err => {
          this.btnFlag = false
        })
      }
    },
    getCommercial () {
      this.$request.get('/merchant/current').then(res => {
        if (res.code === 0) {
          this.commercialInfo = res.result
          this.getPirceFun()
          this.getDataFun()
        }
      })
    },
    submit () {
      this.visible2 = true
      // this.submitPirce = ''
      // this.pasword = ''
    },
    onShowSizeChange (current, pageSize) {
      this.pageSize = pageSize
      this.getDataFun()
    },
    getPirceFun () { // 获取提现金额
      this.$request.get(pandRequestUrl + '/fund/getMerchantInfo?relatedId=' + this.commercialInfo.id + '&businessSource=PUYUN').then(res => {
        if (res.code === 0) {
          if (res.result.info) {
            this.price = res.result.info.accountAmount
          } else {
            this.price = 0
          }
        }
      })
    },
    getDataFun () { // 获取流水列表
      let sdata = {
        relatedId: this.commercialInfo.id,
        pageNum: this.current,
        pageSize: this.pageSize
      }
      this.$request.post('/merchant/cash/withdrawal/list', sdata).then(response => {
        if (response.code == 0) {
          this.dataArr = []
          if (response.result.list) {
            this.total = response.result.total
            response.result.list.forEach((item, index) => {
              let obj = item
              obj.fullName = obj.fullName || '--'
              obj.workOrderNumber = obj.workOrderNumber || '--'
              obj.title = obj.title || '--'
              obj.name = this.commercialInfo.companyName
              this.dataArr.push(obj)
            })
          } else {
            this.dataArr = []
          }
        }
      })
    },
    // 跳转到收款页面
    gotoWork(adata) {
      this.$request.get('/projectWorkOrder/work/order/' + adata.workOrderNumber).then(response => {
        if (response.code == 0) {
          sessionStorage.setItem('orderValue', JSON.stringify(response.result))
          this.$router.push({ path: '/fund' })
        }
      })
    }
  }
}
</script>
<style lang="scss">
.capital_wrap {
  h3 {
    line-height: 40px;
    text-align: left;
    font-size: 18px;
    font-weight: 700;
  }
  .capital_header {
    border: 1px solid #ccc;
    margin-bottom: 30px;
    padding: 20px;
    &_price {
      margin-bottom: 10px;
      font-size: 16px;
      font-weight: 700px;
      display: flex;
      span {
        font-size: 16px;
        margin-left: 10px;
        font-weight: 800;
      }
    }
  }
  .capital_content {
    border: 1px solid #ccc;
    padding: 20px;
  }
  .capital_pagnin {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
