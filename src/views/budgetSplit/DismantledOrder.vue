<!---->
<template>
  <div class="DismantledOrder">

    <h3>已拆单</h3>
    <div class="top_Dom">
      <a-input ref="searchRef"  style="width: 300px;"  v-model="searchText" allowClear placeholder="搜索工单编号、工单名称、客户电话"  @pressEnter="searchThink" />
      <a-icon class="removeIcon" v-if="searchText" slot="suffix" type="close-circle" @click="emitEmpty" />

      <a-select placeholder="按门店筛选" class="dismanSelectDom" allowClear  @change="storeSelectChange">
        <a-select-option v-for="(sel, index) in storeSelectArr" :key="index" :value="sel.name" >{{sel.name}}</a-select-option>
      </a-select>

      <a-button class="disman_btn" type="primary" @click="searchThink">提交</a-button>
    </div>



    <div class="center">
      <a-table :rowSelection="null" :rowKey="(record, index) => index" :columns="unDismantledColumns" :dataSource="dataList" bordered :pagination="false" :locale="{ emptyText: '暂无数据' }" :scroll="{ x: 4000 }">
        <template slot="code" slot-scope="text, scope">
          <a href="javascript:;" @click="dismanOrderGo(text, scope)">{{text}}</a>
        </template>
      </a-table>
    </div>
    <!-- 分页功能 -->
    <div class="paginationDom">
      <a-pagination showSizeChanger @change="pageChange" :pageSize.sync="pageSize" @showSizeChange="onShowSizeChange" :total="total" v-model="current"/>
    </div>

  </div>
</template>

<script>
import { unDismantledColumns } from './js/columns.js'

export default {
  data () {
    return {
      searchText: '', // 顶部搜索绑定的值
      storeSelectArr: [], // 按照门店的数组
      dataList: [], // 表格数据
      unDismantledColumns,
      pageNum: 1,
      pageSize: 10,
      current: 1,
      total: 0,
    }
  },
  props: {
  },
  mixins: [],
  components: {
    
  },
  created () {
    // 获取页面的列表接口
    this.showListDataFn()
  },
  computed: {

  },
  mounted () {
  },
  methods: {
    // 获取页面的列表接口
    showListDataFn() {
      let sdata = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      }
      if (this.searchText) sdata.keyword = this.searchText
      this.$request.get('/rbs-constr/construction/apart/budget/list', { params: sdata}).then(res => {
        if (res.code === 0) {
          this.dataList = res.result.list
          this.total = res.result.total
          this.pageNum = res.result.pageNum
        }
      })
    },
    // 顶部搜索事件
    searchThink() {
      this.showListDataFn()
    },
    // 点击清除文字事件
    emitEmpty () {
      this.$refs.searchRef.focus()
      this.searchText = ''
      this.showListDataFn()
    },
    // 顶部select的chang事件
    storeSelectChange() {

    },
    // 改变页码事件
    pageChange (curr) {
      this.pageNum = curr
      this.current = curr
      this.showListDataFn()
    },
    // 改变每页展示多少条数据 的事件
    onShowSizeChange (current, pageSize) {
      this.pageNum = current
      this.current = current
      this.pageSize = pageSize
      this.showListDataFn()
    },
    // 点击工单
    dismanOrderGo(text, adata) {
      sessionStorage.setItem('orderValue', JSON.stringify(adata))
      this.$router.push({ path: '/budgetSplit_child', query: { id: adata.id } })
    }
  },
  watch: {

  }
}
</script>

<style lang="scss">
.DismantledOrder {
  .dismanSelectDom{
    margin-left: 20px;
    width: 180px;
  }
  .disman_btn{
    margin-left: 20px;
  }
  .center{
    margin-top: 30px;
  }
  .paginationDom{
    text-align: right;
    margin-top: 30px;
  }
}
</style>
