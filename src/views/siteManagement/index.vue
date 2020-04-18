<template>
  <div class="siteManagement">

    <div class="concent">
      <a-input class="searchDom" placeholder="搜索客户姓名、电话、房屋地址房号等" v-model="searchValue" />
      <a-button class="serchbtn" type="primary" @click="searchFn" v-if="RouterNameFlag[this.$route.name] || RouterNameFlag['site_search']">查询</a-button>
      <div class="filterDom">
        <span class="title">工地状态：</span>
        <a-radio-group @change="filterOnChange" v-model="radioFilterValue">
          <a-radio :value="0">全部</a-radio>
          <a-radio :value="1">待开工</a-radio>
          <a-radio :value="2">施工中</a-radio>
          <a-radio :value="3">已竣工</a-radio>
          <a-radio :value="4">合同终止</a-radio>
        </a-radio-group>
      </div>
      <!-- 表格 -->
      <div class="TableDom">
        <a-table :columns="siteColumns" :dataSource="siteList" bordered :scroll="{ x: 3800 }" :pagination='false' :rowKey='record => record.id' :locale="{ emptyText: '暂无数据' }">
          <template slot="code" slot-scope="text, scope">
            <a href="javascript:;" @click="siteOrderGo(text, scope)">{{text}}</a>
          </template>
        </a-table>
      </div>
      
    </div>
    <div class="sitePageDom">
      <a-pagination showSizeChanger :pageSize.sync="pageSize" @change="mypagechange" @showSizeChange="onShowSizeChange" :total="total" v-model="pageNum" />
    </div>

  </div>
</template>
<script>

import { siteColumns } from './js/index'

import { myPower } from '@/common/utils/power.js'

export default {
  data () {
    return {
      mythat: this,
      searchValue: '', // 搜索框对应的值
      radioFilterValue: 0, // 顶部筛选单选按钮的值
      siteColumns,
      siteList: [],
      pageSize: 10,
      total: 1,
      pageNum: 1,
    }
  },
  components: {
    
  },
  created () {
    this.getSiteDataList()
  },
  mixins: [myPower],
  methods: {
    // 获取列表接口数据
    getSiteDataList () {
      let sdata = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      if (this.radioFilterValue) sdata.status = this.radioFilterValue
      if (this.searchValue) sdata.keyword = this.searchValue
      this.$request.get('/rbs-constr/construction/list', { params: sdata}).then(res => {
        if (res.code === 0) {
          this.siteList = res.result.list
          this.total = res.result.total
          this.pageNum = res.result.pageNum
        }
      })
    },
    // 点击查询事件
    searchFn() {
      this.getSiteDataList()
    },
    // 单选按钮事件
    filterOnChange(data) {
      this.pageNum = 1
      this.radioFilterValue = data.target.value
      this.getSiteDataList()
    },
    // 点击工地列表
    siteOrderGo (text, adata) {
      sessionStorage.setItem('siteOrderData', JSON.stringify(adata))
      let sitePageObj = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      sessionStorage.setItem('sitePageData', JSON.stringify(sitePageObj))
      this.$router.push({ path: '/siteDiteal', query: { id: adata.id } })
    },
    // 页码的事件
    onShowSizeChange(page, pasize) {
      this.pageNum = 1
      this.pageSize = pasize
      this.getSiteDataList()
    },
    // 页码改变事件
    mypagechange(ev) {
      this.pageNum = ev
      this.getSiteDataList()
    }
  }
}
</script>
<style lang="scss">
.siteManagement {
  .concent{
    .searchDom{
      max-width: 400px
    }
    .serchbtn{
      margin-left: 12px;
    }
    .filterDom{
      margin-top: 25px;
      .title{
        margin-right: 15px;
      }
      .ant-radio-wrapper{
        margin-right: 30px;
      }
    }
    .TableDom{
      margin-top: 28px;
    }

  }
  .sitePageDom{
    text-align: right;
    margin-top: 20px;
  }
  
}
</style>
