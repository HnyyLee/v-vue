<template>
  <div class="common_header_box">
    <header class="common_header" v-if="isShowHeader">
      <a-icon type="book" />
      <span>工单</span>
      <span>{{roderInfo.code}}</span>
      <!-- <span class="common_header_name">{{roderInfo.customerName}}</span>
      <span>-</span> -->
      <span style="padding-left: 10px;">{{roderInfo.title}}</span>
      <span>-</span>
      <span>{{roderInfo.status}}</span>
      <div class="tips_Dom">
        <a-tooltip placement="bottom" v-if="OrderStatusFlag == 1">
          <template slot="title">
            <span>该工单属于二次报单，请谨慎跟进</span>
          </template>
          <img src="@/common/images/Tips.png" alt="">
        </a-tooltip>
        <a-tooltip placement="bottom" v-if="OrderStatusFlag == 0">
          <template slot="title">
            <span>该工单已关闭，无法操作</span>
          </template>
          <img src="@/common/images/close.png" alt="">
        </a-tooltip>
      </div>
    </header>
    <div class="common_header_list">
      <template v-for="(item, index) in routerList">
        <span :key="item.dd" v-if="hasShowFn(item)"  @click="go(item, index)" :class="{bg_Color: index === value.index}" style="margin-bottom:10px">{{item.name}}</span>
      </template>
    </div>
  </div>
</template>
<script>
import { myPower } from '@/common/utils/power.js'

export default {
  props: {
    value: {
      type: Object
    },
    routerList: {
      type: Array,
      default () {
        return [
          {
            name: '详情',
            url: '/DispatchOperation',
            flag: 'workOrderDetail'
          },
          {
            name: '跟进',
            url: '/followUp',
            flag: 'workOrderFollow'
          },
          {
            name: '报价',
            url: '/offer',
            flag: 'workOrderOffer'
          },
          {
            name: '图纸',
            url: '/drawing',
            flag: 'workOrderDrawing'
          },
          {
            name: '合同',
            url: '/contract',
            flag: 'workOrderContract'
          },
          {
            name: '主材选品',
            url: '/mainMaterials',
            flag: 'SelectionOfMain'
          },
          {
            name: '收/退款',
            url: '/fund',
            flag: 'workOrderRefund'
          },
          {
            name: '工程变更',
            url: '/add-decrease',
            flag: 'workOrderChange'
          },
          {
            name: '自定义收款',
            url: '/CustomReceipt',
            flag: 'workOrderCustom'
          }
          // {
          //   name: '结算',
          //   url: '/construction'
          // }
        ]
      }
    },
  },
  data () {
    return {
      roderInfo: {}, // 工单信息
      isShowHeader: true, // 默认显示工单header信息
      OrderStatusFlag: 2
    }
  },
  created () {
    if (sessionStorage.getItem('orderValue')) {
      this.roderInfo = JSON.parse(sessionStorage.getItem('orderValue'))
    }
    if (this.$route.query.spliceFlag == 'noneHeader') {
      this.isShowHeader = false
    } else {
      this.isShowHeader = true
    }
    this.OrderStatusFlag = JSON.parse(sessionStorage.getItem('orderValue')).repeatStatus
  },
  mixins: [myPower],
  methods: {
    // 点击导航转跳到相应的页面去
    go (item) {
      if (item.url === '/DispatchOperation') {
        if (item.budgetPageFlag) {
          this.$router.push({
            path: item.url,
            query: { id: this.roderInfo.manageAppointmentId, pageSouce: 'gdxq', userId: this.roderInfo.customerUserId, gdId: this.roderInfo.id, status: this.roderInfo.status, budgetPageFlag: true }
          })
        } else {
          this.$router.push({
            path: item.url,
            query: { id: this.roderInfo.manageAppointmentId, pageSouce: 'gdxq', userId: this.roderInfo.customerUserId, gdId: this.roderInfo.id, status: this.roderInfo.status }
          })
        }
      } else {
        if (item.budgetPageFlag) {
          this.$router.push(
            {
              path: item.url,
              query: { budgetPageFlag: true }
            }
          )
        } else {
          this.$router.push(item.url)
        }
      }
    },
    hasShowFn (adata) {
      if (this.RouterNameFlag[this.$route.name] || this.RouterNameFlag[adata.flag]) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>
<style lang="scss">
  .common_header_box {
    .common_header_list {
      margin-top: 10px;
      span {
        display: inline-block;
        margin-right: 10px;
        width: 100px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        color: #FFF;
        background: #76BFFF;
        cursor: pointer;
      }
      span:hover{
        background: #1590FF;
      }
      .bg_Color {
        background: #1590FF;
      }
    }
    .common_header {
      display: flex;
      align-items: center;
      .common_header_name {
        margin-left: 20px;
      }
      span {
        margin-left: 5px;
      }
    }
    .tips_Dom{
      margin-left: 15px;
      img{
        width: 30px;
      }
    }
  }
</style>
