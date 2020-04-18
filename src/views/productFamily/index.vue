<template>
  <div class="productFamily">
    
    <div class="productFamily_header">
      <div class="productFamily_header_select">
        <span>
          搜索系列名称
          <a-input ref="searchRef"  style="width: 200px;"  v-model="searchText" allowClear placeholder="请输入系列名称"  @pressEnter="searchThink" />
          <a-icon class="removeIcon" v-if="searchText" slot="suffix" type="close-circle" @click="emitEmpty" />
        </span>
        <a-button class="design_btn" type="primary" @click="searchThink" style="margin-left: 10px;">查询</a-button>
      </div>
      <div class="productFamily_header_exc">
        <a-button type="primary" style="background: #85CE61;border: 1px solid #85CE61;" @click="productFamAdd">
          创建新产品系列
        </a-button>
      </div>
    </div>
    <a-table :rowSelection="null" :columns="FamilyColumns" :dataSource="productFamilyData" bordered class="tab_box" :pagination="false" 
    :locale="{ emptyText: '暂无数据' }">
      <template slot="status" slot-scope="reond, text">{{reond == 1 ? '启用' : '禁用'}}
        <a-switch :checked="reond == 1 ? true : false" @change='launch(text, $event)'/>
      </template>
      <template slot="action" slot-scope="text, record">
        <a-button size="small" type="primary" @click="editThink(record)" v-if="record.version !== 1">编辑</a-button>
        <a-button size="small" @click="editThink(record)" v-if="record.version == 1">详情</a-button>
      </template>
    </a-table>

    <!-- 分页功能 -->
    <div class="paginationDom" style="margin: 30px 0px 30px 0px;text-align:right;">
      <a-pagination showSizeChanger @change="pageChange" :pageSize.sync="pageSize" @showSizeChange="onShowSizeChange" :total="total" v-model="current"/>
    </div>
    
  </div>
</template>
<script>
import { myPower } from '@/common/utils/power.js'
import { FamilyColumns } from './js/index'

export default {
  data () {
    return {
      mythat: this,
      FamilyColumns,
      productFamilyData: [],
      visible: false,
      addNextFlag: 1,
      searchText: '',
      categoryList: [{ value: 2, name: '整装' }, { value: 1, name: '局装' }],
      pageNum: 1,
      pageSize: 10,
      current: 1,
      total: 0
    }
  },
  mixins: [myPower],
  created () {
    // 获取列表
    this.showPageFn()
  },
  watch: {
  },
  methods: {
    // 获取列表数据
    showPageFn () {
      let adata = {}
      adata.pageNum = this.pageNum
      adata.pageSize = this.pageSize
      if (this.searchText) adata.name = this.searchText
      this.$request.post('/range/queryRangeList', adata).then(response => {
        if (response.code == 0) {
          if (response.result.list) {
            this.productFamilyData = response.result.list
            this.productFamilyData.forEach((item, index) => {
              item.key = item.id
              if (item.isUpdate == 1) {
                item.isUpdateName = '是'
              } else if (item.isUpdate == 2) {
                item.isUpdateName = '否'
              }
              if (item.isOption == 1) {
                item.isOptionName = '是'
              } else if (item.isOption == 2) {
                item.isOptionName = '否'
              }
              if (item.isDiscount == 1) {
                item.isDiscountName = '是'
              } else if (item.isDiscount == 2) {
                item.isDiscountName = '否'
              }
            })
            this.total = response.result.total
          } else {
            this.productFamilyData = []
            this.total = 0
          }
        }
      })
    },
    // 查询提交
    searchThink () {
      this.pageNum = 1
      this.current = 1
      this.showPageFn()
    },
    // 搜索点击清空
    emitEmpty () {
      this.$refs.searchRef.focus()
      this.searchText = ''
      this.showPageFn()
    },
    // 判断启动禁用是否被报价所绑定，二次确认
    launch (row, checked) {
      let that = this
      if (checked == false) {
        this.$confirm({
          title: '是否确认禁用此产品系列?',
          content: '点击确认禁用',
          okText: '确认',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            that.checkShowFn(row, checked)
          },
          onCancel() {},
        })
      } else {
        that.checkShowFn(row, checked)
      }
    },
    // 启用禁用调用的接口
    checkShowFn (row, checked) {
      let adata = { idList: [], enable: '' }
      adata.idList.push(row.id)
      adata.enable = checked
      this.$request.post('/range/updateRanges', adata).then(response => {
        if (response.code == 0) {
          this.$message.success('修改成功!')
          this.showPageFn()
        }
      })
    },
    // 创建系列
    productFamAdd () {
      this.$router.push('/productAddEditPage')
    },
    // 点击编辑时候
    editThink (adata) {
      if (adata.version == 1) {
        this.$router.push({ path: '/productAddEditPage', query: { pageSouch: 'edit', id: adata.id, version: 1 } })
      } else {
        this.$router.push({ path: '/productAddEditPage', query: { pageSouch: 'edit', id: adata.id } })
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
    }
  }
}
</script>
<style lang="scss">
.productFamily {
  &_header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .technology_p_g {
    margin-top: 10px;
    background: rgba($color: #e1e1e1, $alpha: 0.3);
    padding: 5px 10px;
    width: 350px;
  }
  .removeIcon {
    position: relative; 
    left: -20px;
    cursor: pointer;
  }
}
</style>
