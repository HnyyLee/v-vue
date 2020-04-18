<template>
  <div class="totalexpen">
    <a-table style="margin-top: 10px;" :columns="columnsTitle" :rowKey="(record, index) => index" :dataSource="dataList" bordered :locale='locale'>
      <span slot="status" slot-scope="text">
        {{text == 1 ? '待审核': text == 2 ? '审核通过' : '审核拒绝'}}
      </span>
    </a-table>
    <!-- <div class="totalexpen_wrap_pagnin">
      <a-pagination showSizeChanger :pageSize.sync="pageSize" @showSizeChange="onShowSizeChange" :total="total" v-model="current" style="margin-top: 30px;"/>
    </div> -->
  </div>
</template>
<script>
export default {
  data () {
    return {
      columnsTitle: [
        {
          title: '发起时间',
          align: 'center',
          dataIndex: 'createTime',
          class: 'column-center'
        },
        {
          title: '定金',
          align: 'center',
          dataIndex: 'earnestAmount',
          class: 'column-center'
        },
        {
          title: '一期款',
          align: 'center',
          dataIndex: 'firstAmount',
          class: 'column-center'
        },
        {
          title: '二期款',
          align: 'center',
          dataIndex: 'secondAmount',
          class: 'column-center'
        },
        {
          title: '退款',
          align: 'center',
          dataIndex: 'totalRefundAmount',
          class: 'column-center'
        },
        {
          title: '尾款金额',
          align: 'center',
          dataIndex: 'totalTailAmount',
          class: 'column-center'
        },
        {
          title: '审核状态',
          dataIndex: 'status',
          align: 'center',
          class: 'column-center',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '审核时间',
          align: 'center',
          dataIndex: 'updateTime',
          class: 'column-center'
        }
      ],
      dataList: [],
      // total: 0,
      // current: 1,
      // pageSize: 10,
      locale: { emptyText: '暂无数据' } // 无数据显示文案
    }
  },
  created () {
    this.getList()
  },
  // watch: {
  //   current (val) {
  //     this.current = val
  //     this.getList()
  //   }
  // },
  methods: {
    // onShowSizeChange (current, pageSize) {
    //   this.pageSize = pageSize
    //   this.getList()
    // },
    getList () {
      this.dataList = []
      this.$request.get('/settlement/history/list?workOrderNumber=' + this.$route.query.code).then(res => {
        // console.log(res)
        if (res.code === 0) {
          if (res.result) {
            this.dataList = res.result
          }
        }
      })
    }
  }
}
</script>
<style lang="scss">
  .totalexpen {
    .totalexpen_wrap_pagnin {
      display: flex;
      justify-content: flex-end;
    }
  }
</style>
