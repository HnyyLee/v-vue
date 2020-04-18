<template>
  <div class="OfferManagement">
    <common-header :value='infoValue'></common-header>
    <div class="contentDom" v-if="showFlag">
      <span>报价方案</span>
      <a-button class="btn_add" type="primary" v-if="(showBtn && orderStatis != 0) && (RouterNameFlag[mythat.$route.name] || RouterNameFlag['order_add_offer'])" @click="showModal"><a-icon type="plus" />新增报价方案</a-button>
      <div class="table_Dom">
        <div style="margin-bottom: 16px">
        </div>
        <a-table :bordered='true' :rowSelection="hasCheckFlag ? haveCheckDom : null" :columns="columns" :dataSource="dataSource"  :locale="{emptyText: '暂无报价方案'}" :pagination="false">
          <a-tag slot="state" slot-scope="text">{{text}}</a-tag>
          <span slot="action" slot-scope="record">
            <a-button type="primary" size="small" v-show="(orderStatis != 0) && (RouterNameFlag[mythat.$route.name] || RouterNameFlag['order_editDetail_btn'])" @click="editThink(record)">{{showEditName(record)}}</a-button>
            <a-button size="small" class="print_btn" v-if="(record.status !== 5) && (RouterNameFlag[mythat.$route.name] || RouterNameFlag['order_printing_btn'])" @click="printThink(record)">打印</a-button>
            
            <a-tooltip placement="bottomRight" v-if="record.status == 5" style="margin-left: 15px;">
              <template slot="title">
                <span>SKU价格有更新，需重新确认后生效</span>
              </template>
              <a-icon type="warning" style="color: #FF830D; font-size: 16px;" />
            </a-tooltip>
          </span>
        </a-table>
        <!-- 分页功能 -->
        <div class="paginationDom" style="margin: 30px 0px 30px 0px;text-align:right;">
          <a-pagination showSizeChanger @change="pageChange" :pageSize.sync="pageSize" @showSizeChange="onShowSizeChange" :total="total" v-model="current"/>
        </div>
      </div>
    </div>
    <div v-else>
      <router-view />
    </div>
    <common-modal ref="commonModalDom" :dialogData="dialogData" :textMapTitle="textMapTitle" dialogWidth="40%" @submitThink="submitThink" />
  </div>
</template>
<script>
import CommonHeader from '@/components/CommonHeader/index.vue'
import CommonModal from '@/components/CommonModal'

import { myPower } from '@/common/utils/power.js'

const columns = [{
  title: '序号',
  dataIndex: 'key',
  width: 80
}, {
  title: '方案名',
  dataIndex: 'name'
}, {
  title: '总价',
  dataIndex: 'totalFee'
}, {
  title: '创建时间',
  dataIndex: 'createTime'
}, {
  title: '报价类型',
  dataIndex: 'typeName'
}, {
  title: '状态',
  dataIndex: 'statusName',
  scopedSlots: { customRender: 'state' }
}, {
  title: '操作',
  key: 'action',
  width: 180,
  scopedSlots: { customRender: 'action' }
}]
columns.forEach(icon => {
  icon.align = 'center'
})
const OPTIONS = [{ value: 1, label: '套餐报价' }, { value: 2, label: '清单报价' }, { value: 3, label: '自定义报价' }]
export default {
  data () {
    return {
      mythat: this,
      showFlag: true,
      infoValue: {
        workNumber: 20156899,
        name: '刘德华',
        fitment: '卧室/墙壁',
        index: 2
      },
      columns,
      dataSource: [],
      textMapTitle: '新增报价方案',
      hasCheckFlag: false, // 控制左侧是否显示复选框
      selectedRowKeys: [],
      dialogData: [
        { label: '客户姓名', type: 'radio', spanNumber: 24, column: ['offerState', { initialValue: 1 }], default: '', value: null, options: OPTIONS }
      ],
      showBtn: true, // 是否现在新增套餐按钮
      pageNum: 1,
      pageSize: 10,
      current: 1,
      total: 0,
      orderInfo: {},
      orderStatis: '' // 工单ID
    }
  },
  components: {
    CommonHeader,
    CommonModal
  },
  mixins: [myPower],
  computed: {
    haveCheckDom () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  created () {
    if (this.$route.name == 'offer') {
      this.showFlag = true
    } else if (this.$route.name == 'offer_Child') {
      this.showFlag = false
    }
    this.orderInfo = JSON.parse(sessionStorage.getItem('orderValue'))
    let str = JSON.parse(sessionStorage.getItem('orderValue'))
    if (str.status === '已签约' || str.status === '已付二期款' || str.status === '结算中' || str.status === '结算审核通过' || str.status === '已付全款' || str.status === '已决算') {
      this.showBtn = false
    }
    // 刷新页面接口
    this.showPageFn()
    this.getOrderStatus()
  },
  methods: {
    getOrderStatus () {
      this.$request.get('/projectWorkOrder/getWorkOrderBasicInfoByCode?workOrderNumber=' + this.orderInfo.code).then(res => {
        if (res.code === 0) {
          this.orderStatis = res.result.status
        }
      })
    },
    // 刷新页面接口
    showPageFn () {
      let adata = {
        workOrderId: JSON.parse(sessionStorage.orderValue).id,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      this.$request.post('/quote/queryQuoteList', adata).then(response => {
        if (response.code == 0) {
          if (response.result.list) {
            this.dataSource = response.result.list
            this.dataSource.forEach(item => {
              item.key = item.id
              if (item.status == 1) {
                item.statusName = '草稿'
              } else if (item.status == 2) {
                item.statusName = '签约'
              } else if (item.status == 4) {
                item.statusName = '失效'
              } else if (item.status == 5) {
                item.statusName = '待激活'
              } else if (item.status == 6) {
                item.statusName = '签约待审核'
              }
              if (item.type == 1) {
                item.typeName = '套餐报价'
              } else if (item.type == 2) {
                item.typeName = '清单报价'
              } else if (item.type == 3) {
                item.typeName = '自定义报价'
              }
            })
          }
          this.total = response.result.total
        }
      })
    },
    showModal () {
      this.$refs.commonModalDom.visible = true
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    submitThink (adata) {
      this.$refs.commonModalDom.visible = false
      this.$router.push({ path: '/offer/offer_Child', query: { offerState: adata.offerState, aFlag: 1 } })
    },
    showEditName(adata) {
      if (adata.status == 1) {
        return '编辑'
      } else if (adata.status == 2 || adata.status == 4 || adata.status == 6) {
        return '详情'
      } else if (adata.status == 5) {
        return '确认并激活'
      }
    },
    editThink (adata) {
      if (adata.status == 1) {
        this.$router.push({ path: '/offer/offer_Child', query: { offerState: adata.type, aFlag: 2, offerId: adata.id } })
      } else if (adata.status == 2 || adata.status == 4 || adata.status == 6) {
        if (adata.type == 1) {
          this.$router.push({ path: '/packageDetailsPage', query: { offerId: adata.id } })
        } else if (adata.type == 2) {
          this.$router.push({ path: '/repertoireDetailsPage', query: { offerId: adata.id } })
        } else if (adata.type == 3) {
          this.$router.push({ path: '/customDetailsPage', query: { offerId: adata.id } })
        }
      } else if (adata.status == 5) {
        this.$router.push({ path: '/offer/offer_Child', query: { offerState: adata.type, aFlag: 2, offerId: adata.id } })
      }
    },
    // 下面是分页功能一些事件
    pageChange (curr) {
      this.pageNum = curr
      this.current = curr
      this.showPageFn()
    },
    onShowSizeChange (current, pageSize) {
      this.pageNum = current
      this.current = current
      this.pageSize = pageSize
      this.showPageFn()
    },
    // 点击打印按钮事件
    printThink (adata) {
      if (adata.type == 1) {
        this.$router.push({ path: '/quote_details', query: { offerId: adata.id, xqSouce: 'xqSouce' } })
      } else if (adata.type == 2) {
        this.$router.push({ path: '/inventory_details', query: { offerId: adata.id, xqSouce: 'xqSouce' } })
      } else if (adata.type == 3) {
        this.$router.push({ path: '/customDetailsPage', query: { offerId: adata.id, xqSouce: 'xqSouce' } })
      }
    }
  },
  watch: {
    $route (to, from) {
      if (to.name == 'offer') {
        this.showFlag = true
        this.showPageFn()
      } else if (to.name == 'offer_Child') {
        this.showFlag = false
      }
    }
  }
}
</script>
<style lang="scss">
.OfferManagement {
  .contentDom{
    margin-top: 25px;
    .btn_add{
      float: right;
      margin-right: 20px;
      background: #85CE61;
      border: 1px solid #85CE61;
    }
    .table_Dom{
      margin-top: 30px;
    }
  }
  .print_btn{
    margin-left: 20px;
  }
}
</style>
