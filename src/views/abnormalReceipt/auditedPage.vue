<template>
  <div class="auditedPage">
    
    <h1>异常收款-已审批</h1>
    <div class="searchDom">
      <a-input-search
        v-model="auditedSearch"
        placeholder="搜索客户姓名、电话、房屋地址房号等"
        @search="searchAuditedFn"
        style="width: 500px;"
        enterButton="查询" size="large" @pressEnter="getAuditedList" />
    </div>
    <div class="content">
      <a-table :columns="auditedColumns" :dataSource="auditedData"  bordered :rowKey="(record, index) => index" :pagination='false' 
      :locale="{ emptyText: '暂无数据' }" >
        <template slot="detail" slot-scope="scope, text">
          <a href="javascript:;" @click="detailFn(text)">详情</a>
        </template>
        <template slot="action" slot-scope="scope, aitem">
          <a-tag color="#2db7f5" v-if="aitem.approved">{{aitem.approved ? '通过' : '拒绝'}}</a-tag>
          <a-tag color="#B9B9B9" v-else>{{aitem.approved ? '通过' : '拒绝'}}</a-tag>
        </template>
      </a-table>
    </div>
    <!-- 分页 -->
    <div class="auditedPageDom">
      <a-pagination showSizeChanger :pageSize.sync="pageSize" @change="mypagechange" @showSizeChange="onShowSizeChange" :total="total" v-model="pageNum" />
    </div>

    <a-modal
      title="审批"
      :visible="shenpiVisible"
      :maskClosable='false'
      @ok="handleOk"
      @cancel="handleCancel"
      okText="确定"
      cancelText="取消"
      :okButtonProps="{ props: { loading: contractBtnLoading } }">
      <p>{{ModalText}}</p>
    </a-modal>

    <!-- 查看详情的弹框 -->
    <a-modal
      title="查看详情"
      :visible="auditDetailVisible"
      :maskClosable='false'
      @cancel="auditHandleCancel"
      :footer="null"
      width="800px">
      <p>本次异常收款明细：</p>
      <a-table :columns="detailColumns" :dataSource="detailData"  bordered :rowKey="(record, index) => index" :pagination='false' 
      :locale="{ emptyText: '暂无数据' }" >
      </a-table>
      <p style="margin-top: 20px;">收款明细：</p>
      <a-table :columns="AuditeListColumns" :dataSource="AuditeListData"  bordered :rowKey="(record, index) => index" :pagination='false' 
      :locale="{ emptyText: '暂无数据' }" >
      </a-table>
    </a-modal>

  </div>
</template>
<script>

import { auditedColumns, detailColumns, AuditeListColumns } from './js/index'

export default {
  data () {
    return {
      pageSize: 10, // 每页条数
      total: 1,
      pageNum: 1, // 当前
      auditedSearch: '', // 搜索框绑定值
      auditedColumns,
      auditedData: [], // 表格数据
      ModalText: '',
      processInstanceId: '', // 当前流程模板的id
      myisFlag: '', // 通过或者拒绝
      shenpiVisible: false,
      detailColumns,
      detailData: [], // 详情弹框第一个表格绑定数据
      contractBtnLoading: false, // 审批二次确认弹框确定按钮的loading
      auditDetailVisible: false, // 查看详情的弹框
      AuditeListColumns,
      AuditeListData: [], // 详情弹框第二个表格绑定数据
    }
  },
  components: {
  },
  computed: {
    
  },
  created () {
    // 获取表格数据
    this.getAuditedList()
  },
  methods: {
    // 点击顶部搜索事件
    searchAuditedFn(adata) {
      this.auditedSearch = adata
      this.getAuditedList()
    },
    // 获取表格数据
    getAuditedList() {
      let obj = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      if (this.auditedSearch) obj.keyword = this.auditedSearch
      this.$request.post('/processInstance/UnderLine/1/list', obj).then(res => {
        if (res.code === 0) {
          this.auditedData = res.result.list
          this.total = res.result.total
          this.pageNum = res.result.pageNum
          this.pageSize = res.result.pageSize
        }
      })
    },
    // 选择条数
    onShowSizeChange (pageNum, pageSize) {
      this.pageNum = 1
      this.pageSize = pageSize
      this.getAuditedList()
    },
    // 点击详情事件
    detailFn(adata) {
      this.auditDetailVisible = true
      // 调用详情接口
      this.getDitealPageTop(adata)
    },
    getDitealPageTop(adata) {
      let processInstanceId = adata.processInstanceId
      this.$request.get(`/processInstance/UnderLine/${processInstanceId}/detail`).then(res => {
        if (res.code === 0) {
          this.detailData = []
          this.detailData.push(res.result.underLineDetail)
          this.detailData.forEach(idom => {
            idom.paymentTime = idom.paymentTime || '--'
            if (idom.paymentType == 'hundsun_wechatlet') {
              idom.paymentName = '微信支付'
            } else if (idom.paymentType == 'hundsun_nfxpos_act') {
              idom.paymentName = 'POS机支付'
            } else if (idom.paymentType == 'under_line') {
              idom.paymentName = '线下支付'
            }
            if (idom.status == 1) {
              idom.statusName = '未支付'
            } else if (idom.status == 2) {
              idom.statusName = '支付中'
            } else if (idom.status == 3) {
              idom.statusName = '支付成功'
            }
          })
          this.AuditeListData = res.result.receiptDetail
          this.AuditeListData.forEach(item => {
            item.changeAmount = item.changeAmount || '--'
            item.receivedAmount = item.receivedAmount || '--'
            item.paymentTime = item.paymentTime || '--'
            if (item.status == 1) {
              item.statusName = '未支付'
            } else if (item.status == 2) {
              item.statusName = '支付中'
            } else if (item.status == 3) {
              item.statusName = '支付成功'
            }
          })
        }
      })
    },
    handleOk () {
      let obj = {
        processInstanceId: this.processInstanceId
      }
      if (this.myisFlag === 1) {
        obj.approved = true
      } else if (this.myisFlag === 2) {
        obj.approved = false
      }
      this.contractBtnLoading = true
      this.$request.post('/process/approval', obj).then(res => {
        if (res.code === 0) {
          this.contractBtnLoading = false
          this.shenpiVisible = false
          this.getAuditedList()
        }
      }).catch(err => {
        this.contractBtnLoading = false
      })
    },
    handleCancel() {
      this.contractBtnLoading = false
      this.shenpiVisible = false
    },
    // 详情的弹框取消
    auditHandleCancel() {
      this.auditDetailVisible = false
    },
    // 页码改变事件
    mypagechange(ev) {
      this.pageNum = ev
      this.getAuditedList()
    }
  }
}
</script>
<style lang="scss">
  .auditedPage {
    .content{
      margin-top: 20px;
    }
    .auditedPageDom{
      text-align: right;
      margin-top: 30px;
    }
  }
</style>
