<template>
  <div class="construc">
    <!-- <div class="construc_header_menu">
      <span @click="goto">待结算工地</span>
      <span class="span_bgcolor">已结算工地</span>
    </div> -->
    <div class="construc_header">
      <a-input style="width: 30%" v-model="keyword" placeholder="搜索客户姓名、电话、房屋地址房号等" />
      <a-button style="margin-left: 10px;" @click="getDataList" type="primary" v-if="RouterNameFlag[mythat.$route.name] || RouterNameFlag['settlement_search']" >查询</a-button>
    </div>
    <a-table :columns="columns" :dataSource="thLsit" bordered class="tab_box" :scroll="{ x: 3200 }" :pagination='false' :locale='locale' :rowKey="record => record.id">
      <template slot="code" slot-scope="text, rconed">
        <a href="javascript:;" @click="go(rconed)">{{text}}</a>
      </template>
    </a-table>
    <div class="construc_pagnin">
      <a-pagination showSizeChanger :pageSize.sync="pageSize" @showSizeChange="onShowSizeChange" :total="total" v-model="current" style="margin-top: 30px;"/>
    </div>
  </div>
</template>
<script>
import titleList from './js/index'
import { myPower } from '@/common/utils/power.js'

export default {
  data () {
    return {
      mythat: this,
      columns: [], // tabList
      thLsit: [], // 表格内容
      keyword: undefined, // 关键字
      current: 1, // 页数
      pageSize: 10, // 条数
      total: 0, // 总数
      locale: { emptyText: '暂无数据' } // 无数据显示文案
    }
  },
  created () {
    this.columns = titleList
    this.getDataList()
  },
  mixins: [myPower],
  watch: {
    current (val) {
      this.current = val
      this.getDataList()
    }
  },
  methods: {
    go (e) { // 转跳
      sessionStorage.setItem('orderValue', JSON.stringify(e))
      this.$router.push({ path: '/totalexpendamount', query: { code: e.code } })
    },
    getDataList () { // 获取数据
      let obj = {
        pageNum: this.current, // 页数
        pageSize: this.pageSize, // 条数
        settlementStatus: 2, // 已结算
        keyword: this.keyword // 关键字
      }
      this.$request.post('/projectWorkOrder/getPageWorkOrder', obj).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.total = res.result.total
          if (res.result.list) {
            this.thLsit = res.result.list
          } else {
            this.thLsit = []
          }
        }
      })
    },
    onShowSizeChange (current, pageSize) { // 分页
      this.pageSize = pageSize
      this.getDataList()
    }
    // goto () {
    //   this.$router.push('/construction')
    // }
  }
}
</script>
<style lang="scss">
  .construc {
    &_header_menu {
      display: flex;
      span {
        width: 100px;
        height: 35px;
        text-align: center;
        line-height: 35px;
        background-color: #87CEEB;
        margin-right: 10px;
        margin-bottom: 20px;
        cursor: pointer;
      }
      .span_bgcolor {
        background-color: #87CEFA;
      }
    }
    &_header {
      display: flex;
      margin-bottom: 30px;
    }
    &_pagnin {
      display: flex;
      justify-content: flex-end;
    }
  }
</style>
