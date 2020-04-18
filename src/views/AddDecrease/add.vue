<template>
  <div class="add_decrease_wrap">
    <common-header :value='budgetPageValue' v-if="this.$route.query.budgetPageFlag" :routerList="routerList"></common-header>
    <common-header :value='infoValue' v-else></common-header>

    <a-table style="margin-top: 10px;" :columns="columns" :dataSource="dataList" bordered :pagination='false' :locale='locale'>
      <template slot="title">
        <div>
          <span>工程变更记录</span>
          <!-- <a-button type="primary" v-if="(orderStatis != 0) && (RouterNameFlag[mythat.$route.name] || RouterNameFlag['order_add_Engineering'])" @click="addFun">发起工程变更</a-button> -->
          <a-button class="DecreaseAdd" type="primary" v-if="(orderStatis != 0) && (RouterNameFlag[mythat.$route.name] || RouterNameFlag['order_add_Engineering'])" @click="alterationFn" style="margin-left: 25px">施工变更</a-button>
          <a-button class="DecreaseAdd" type="primary" v-if="(orderStatis != 0) && (RouterNameFlag[mythat.$route.name] || RouterNameFlag['order_add_Engineering'])" @click="materialFn">主材变更</a-button>
        </div>
      </template>
      <template slot="toDoStatusName" slot-scope="text, record">
        <a-tag color="blue" v-if="record.toDoStatus == '1'">{{text}}</a-tag>
        <a-tag color="green" v-if="record.toDoStatus == '2'">{{text}}</a-tag>
        <a-tag color="red" v-if="record.toDoStatus == '3'">{{text}}</a-tag>
      </template>
      <template slot="id" slot-scope="text,record">
        <!-- 当工单状态不为关闭的时候：不显示编辑按钮，当数据审批拒绝和审批中的时候显示编辑按钮，审批通过也不显示编辑按钮 -->
        <a href="javascript:;" class="decr_btn" @click="gotoEdit(record)" v-if="showEditBtn(record) && (RouterNameFlag[mythat.$route.name] || RouterNameFlag['order_edit_Engineering'])">编辑</a>
        <!-- 只有当审批通过的时候才显示查看按钮 -->
        <a href="javascript:;" class="decr_btn" @click="gotoNav(record)" v-if="showlookDetails(record) && (RouterNameFlag[mythat.$route.name] || RouterNameFlag['order_see_Engineering'])">查看</a>
        <!-- 显示打印按钮 -->
        <a href="javascript:;" class="decr_btn" @click="addPrinterFn(record)" v-if="showPrinterBtn(record) && (RouterNameFlag[mythat.$route.name] || RouterNameFlag['order_edit_Engineering'])">打印</a>
      </template>
    </a-table>
    <div class="add_decrease_wrap_pagnin">
      <a-pagination showSizeChanger :pageSize.sync="pageSize" @showSizeChange="onShowSizeChange" :total="total" v-model="current" style="margin-top: 30px;"/>
    </div>
  </div>
</template>
<script>
import list from './js/list'
import CommonHeader from '@/components/CommonHeader/index.vue'
import { myPower } from '@/common/utils/power.js'

export default {
  data () {
    return {
      mythat: this,
      budgetPageValue: {
        index: 4
      },
      routerList: [
        {
          name: '详情',
          url: '/DispatchOperation',
          flag: 'workOrderDetail',
          budgetPageFlag: true
        },
        {
          name: '合同',
          url: '/contract',
          flag: 'workOrderContract',
          budgetPageFlag: true
        },
        {
          name: '主材选品',
          url: '/mainMaterials',
          flag: 'SelectionOfMain',
          budgetPageFlag: true
        },
        {
          name: '施工预算拆单',
          url: '/budgetSplit_child',
          flag: 'budgetSplit',
          budgetPageFlag: true
        },
        {
          name: '工程变更',
          url: '/add-decrease',
          flag: 'workOrderChange',
          budgetPageFlag: true
        },
      ],
      infoValue: {
        index: 7
      },
      collapsed: false,
      locale: { emptyText: '暂无数据' }, // 无数据显示文案
      dataList: [],
      columns: [],
      current: 1,
      pageSize: 10,
      total: 0,
      orderStatis: '', // 工单
      addInfo: {} // 信息
    }
  },
  components: {
    CommonHeader
  },
  mixins: [myPower],
  created () {
    this.columns = list.tableTileTwo
    this.addInfo = JSON.parse(sessionStorage.getItem('orderValue'))
    this.getDataList()
    this.getOrderStatus()
  },
  watch: {
    current (val) {
      this.current = val
      this.getDataList()
    }
  },
  methods: {
    getOrderStatus () {
      this.$request.get('/projectWorkOrder/getWorkOrderBasicInfoByCode?workOrderNumber=' + this.addInfo.code).then(res => {
        if (res.code === 0) {
          this.orderStatis = res.result.status
        }
      })
    },
    onShowSizeChange (current, pageSize) {
      this.pageSize = pageSize
      this.getDataList()
    },
    getDataList () { // 获取列表数据
      let obj = {
        pageNum: this.current,
        pageSize: this.pageSize,
        workOrderId: this.addInfo.id
      }
      this.$request.post('/workOrderAddDrop/getPageIncreaseOrDecreaseItem', obj).then(res => {
        if (res.code === 0) {
          this.total = res.result.total
          if (res.result.list) {
            this.dataList = []
            res.result.list.forEach((item, index) => {
              let obj = item
              obj.key = index
              obj.serial = index + 1
              if (obj.changeType == 1) {
                obj.changeTypeName = '主材变更'
              } else if (obj.changeType == 2) {
                obj.changeTypeName = '施工变更'
              } else {
                obj.changeTypeName = '--'
              }
              this.dataList.push(obj)
            })
          } else {
            this.dataList = []
          }
        }
      })
    },
    // 判断是否显示编辑按钮事件
    showEditBtn(adata) {
      if (this.orderStatis != 0 ) {
        if (adata.toDoStatus == '3') {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    // 判断是否显示查看按钮事件
    showlookDetails(adata) {
      if (adata.toDoStatus == '2') {
        return true
      } else {
        return false
      }
    },
    // 判断是否显示打印按钮事件
    showPrinterBtn(adata) {
      return true
    },
    // 点击编辑按钮事件
    gotoEdit(adata) {
      if (adata.changeType == '1') {
        this.$router.push({ path: '/materialPage', query: { pageSouch: 'edit', id: adata.id } })
      } else if (adata.changeType == '2') {
        this.$router.push({ path: '/alterationPage', query: { pageSouch: 'edit', id: adata.id } })
      }
    },
    // 点击查看按钮事件
    gotoNav (adata, type) {
      if (adata.changeType == '1') {
        this.$router.push({ path: '/materialPage', query: { pageSouch: 'examine', id: adata.id } })
      } else if (adata.changeType == '2') {
        this.$router.push({ path: '/alterationPage', query: { pageSouch: 'examine', id: adata.id } })
      }
    },
    // 施工变更按钮事件
    alterationFn() {
      this.$router.push({ path: '/alterationPage', query: { pageSouch: 'add' } })
    },
    // 主材变更按钮事件
    materialFn() {
      this.$router.push({ path: '/materialPage', query: { pageSouch: 'add' } })
    },
    // 打印事件
    addPrinterFn(adata) {
      if (adata.changeType == '1') {
        this.$router.push({ path: '/materPrinter', query: { id: adata.id } })
      } else if (adata.changeType == '2') {
        this.$router.push({ path: '/alteraPrinter', query: { id: adata.id } })
      }
      // 
    },
    // 原先的发起工程变更按钮
    addFun () {
      this.$router.push({ path: '/add-wind', query: { pageSouch: 'add' } })
    },
  }
}
</script>
<style lang="scss">
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color .3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255,255,255,.2);
  margin: 16px;
}
th.column-center,
td.column-center {
  text-align: center !important;
}
.add_decrease_wrap{
  .add_decrease_wrap_pagnin {
    display: flex;
    justify-content:flex-end;
  }
  .DecreaseAdd{
    float: right;
  }
}
.decr_btn{
  margin-right: 5px;
  margin-left: 5px;
}

</style>
