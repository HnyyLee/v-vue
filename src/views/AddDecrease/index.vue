<template>
  <div class="add_decrease">
    <div style="margin: 10px;">
      <a-input-search placeholder="搜索客户姓名、电话、房屋地址房号等" v-model="keywork" @search="onSearch" enterButton="搜索" style="width: 400px" />
    </div>
    <div class="select_content_status">
      <span class="label" style="margin-right: 10px;">工单状态</span>
      <a-radio-group v-model="value1">
        <a-radio :style="radioStyle" :value="item.id" v-for="(item, index) in options1" :key="index">{{item.name}}</a-radio>
      </a-radio-group>
    </div>
    <a-table :columns="columns" :dataSource="dataList" bordered class="tab_box" :scroll="{ x: 3000 }" :pagination='false' :locale='locale'>
      <template slot="code" slot-scope="text,record">
        <a href="javascript:;" @click="gotoNav1(record)">{{text}}</a>
      </template>
    </a-table>
    <div class="add_decrease_wrap_pagnin">
      <a-pagination showSizeChanger :pageSize.sync="pageSize" @showSizeChange="onShowSizeChange" :total="total" v-model="current" style="margin-top: 30px;"/>
    </div>
  </div>
</template>
<script>
import List from './js/list'

const options1 = ['Apdsple', 'Orsdfasndfge', 'Psdfear', 'Oradsfnge']
const data = []
export default {
  data () {
    return {
      radioStyle: {
        display: 'inline-block',
        height: '30px',
        lineHeight: '30px'
      },
      locale: { emptyText: '暂无数据' }, // 无数据显示文案
      collapsed: false,
      keywork: '', // 关键字
      dataList: [], //
      columns: [], // tabTitle
      options1: [],
      value1: 'qb',
      orderId: '', // 工单信息
      total: 0,
      current: 1,
      pageSize: 10
    }
  },
  created () {
    this.orderId = JSON.parse(sessionStorage.getItem('orderValue'))
    this.columns = List.tableTitle
    this.options1 = List.statusList
    this.getDataList()
  },
  watch: {
    current (val) {
      this.current = val
      this.getDataList()
    }
  },
  methods: {
    onShowSizeChange (current, pageSize) {
      this.pageSize = pageSize
      this.getDataList()
    },
    getDataList () { // 获取列表数据
      let obj = {
        pageNum: this.current,
        pageSize: this.pageSize,
        keyword: this.keywork, // 关键字
        status: this.workOrderStatus === 'qb' ? '' : this.workOrderStatus, // 状态
        addOrDropStatus: 1
      }
      this.$request.post('/projectWorkOrder/getPageWorkOrder', obj).then(res => {
        if (res.code === 0) {
          res.result.list.forEach((item, index) => { // 处理数据；添加key值
            let obj = item
            obj.key = index
            this.dataList.push(obj)
          })
          this.total = res.result.total
        }
      }).catch(err => {
        console.log(err)
      })
    },
    gotoNav1 (val) {
      sessionStorage.setItem('AddDelectValue', JSON.stringify(val))
      this.$router.push('/add-decrease')
    },
    onSearch () {
      this.getDataList()
    }
  }
}
</script>

<style lang="scss">
  .add_decrease_wrap_pagnin {
    display: flex;
    justify-content:flex-end;
  }
</style>
