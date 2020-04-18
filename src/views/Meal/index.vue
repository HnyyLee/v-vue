<template>
  <div class="meal_box">
    <div class="context_Dom" v-if="showFlag">
      <h3>套餐包列表</h3>
      <div class="meal_box_header">
        <div class="meal_box_header_select">
          <span>
            筛选
            <a-select allowClear style="width: 200px"  v-model="categoryValue" placeholder="请输选择要筛选的项">
              <a-select-option v-for="(sel, index) in categoryList" :key="index" :value="sel.value">{{sel.name}}</a-select-option>
            </a-select>
          </span>
          <span style="margin: 0 5px 0 30px;">
            搜索套餐名称
            <a-input ref="searchRef"  style="width: 200px;"  v-model="searchText" placeholder="请输入套餐名称"  @pressEnter="searchThink">
            </a-input>
            <a-icon style="position: relative; left: -20px;" v-if="searchText" slot="suffix" type="close-circle" @click="emitEmpty" />
          </span>
          <a-button class="design_btn" type="primary" @click="searchThink" style="margin-left: 10px;" v-if="RouterNameFlag[mythat.$route.name] || RouterNameFlag['product_search']">查询</a-button>
        </div>
        <div class="meal_box_header_exc">
          <a-button type="primary" style="background: #85CE61;border: 1px solid #85CE61;" @click="foundMeal" v-if="RouterNameFlag[mythat.$route.name] || RouterNameFlag['product_create']">
            创建新产品
          </a-button>
          <!-- <span style="margin-left: 10px;">帮助说明<a-icon type="question-circle" /></span> -->
        </div>
      </div>
      <a-table :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" :columns="columns" :dataSource="thLsit" bordered class="tab_box" :pagination="false" :locale="{ emptyText: '暂无数据' }">
        <div slot="status" slot-scope="reond, text">{{reond == 1 ? '启用' : '禁用'}}
          <a-switch v-if="RouterNameFlag[mythat.$route.name] || RouterNameFlag['product_typeBtn']" :checked="reond == 1 ? true : false" :disabled="text.status == 1 ? false : true" @change='launch(text, $event)'/>
        </div>
        <template slot="action" slot-scope="text, record">
          <a-button size="small" type="primary" @click="editThink(record)" v-if="RouterNameFlag[mythat.$route.name] || RouterNameFlag['product_detail']">详情</a-button>
        </template>
      </a-table>
      <a-modal
        title="创建新产品"
        v-model="visible"
        :maskClosable='false'
        @ok="handleOk"
      >
        <div>
          <a-radio-group @change="selectMeal" v-model="addNextFlag">
            <a-radio :value="1">套餐产品</a-radio>
            <a-radio :value="2">清单产品</a-radio>
            <a-radio :value="3">自定义产品</a-radio>
          </a-radio-group>
        </div>
        <p class="technology_p_g" v-if="addNextFlag == 1">说明：套餐目前支持按平米报价以及一口价两种常见的计价方式。支持配置管理费、税费、打折促销上限等计算公式。</p>
        <p class="technology_p_g" v-if="addNextFlag == 2">说明：清单式报价是最传统适用范围最广的报价方式，根据客户的需求逐一添加定额和材料，可兼容半包和全包。</p>
        <p class="technology_p_g" v-if="addNextFlag == 3">说明：当系统的报价方式不足以支撑业务需要，可选择自定义报价。即：业务团队在线下完成报价计算，将报价书中的关键信息录入系统。</p>
      </a-modal>
      <!-- 分页功能 -->
      <div class="paginationDom" style="margin: 30px 0px 30px 0px;text-align:right;">
        <a-pagination showSizeChanger @change="pageChange" :pageSize.sync="pageSize" @showSizeChange="onShowSizeChange" :total="total" v-model="current"/>
      </div>
    </div>
    <div v-else>
      <router-view />
    </div>
  </div>
</template>
<script>
import { myPower } from '@/common/utils/power.js'

const columns = [
  {
    title: '序号',
    width: 60,
    dataIndex: 'key'
  },
  {
    title: '套餐名称',
    width: 150,
    dataIndex: 'name'
  },
  {
    title: '类别',
    width: 150,
    dataIndex: 'typeName'
  },
  {
    title: '创建时间',
    width: 150,
    dataIndex: 'createTime'
  },
  {
    title: '创建人',
    width: 80,
    dataIndex: 'editorName'
  },
  {
    title: '装修类型',
    width: 150,
    dataIndex: 'decorateTypeName'
  },
  {
    title: '状态',
    width: 80,
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '操作',
    width: 80,
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
columns.forEach(item => {
  item.align = 'center'
})
export default {
  data () {
    return {
      mythat: this,
      showFlag: true,
      columns,
      thLsit: [],
      visible: false,
      addNextFlag: 1,
      categoryValue: '',
      searchText: '',
      categoryList: [{ value: 2, name: '整装' }, { value: 1, name: '局装' }],
      selectedRowKeys: [],
      pageNum: 1,
      pageSize: 10,
      current: 1,
      total: 0
    }
  },
  mixins: [myPower],
  created () {
    // 判断当前路由
    if (this.$route.name == 'meal') {
      this.showFlag = true
    } else if (this.$route.name == 'taiwanPage' || this.$route.name == 'inventoryPage' || this.$route.name == 'customPage') {
      this.showFlag = false
    }
    // 获取列表
    this.showPageFn()
  },
  watch: {
    $route (to, from) {
      if (to.name == 'meal') {
        this.showFlag = true
      } else if (to.name == 'taiwanPage' || this.$route.name == 'inventoryPage' || this.$route.name == 'customPage') {
        this.showFlag = false
      }
    }
  },
  methods: {
    showPageFn () {
      let adata = {}
      adata.pageNum = this.pageNum
      adata.pageSize = this.pageSize
      if (this.categoryValue) adata.decorateType = this.categoryValue
      if (this.searchText) adata.name = this.searchText
      this.$request.post('/product/queryProductList', adata).then(response => {
        if (response.code == 0) {
          if (response.result.list) {
            this.thLsit = response.result.list
            this.thLsit.forEach((item, index) => {
              item.key = item.id
              if (item.type == 1) item.typeName = '套餐产品'
              if (item.type == 2) item.typeName = '清单产品'
              if (item.type == 3) item.typeName = '自定义产品'
              if (item.decorateType == 1) item.decorateTypeName = '局装'
              if (item.decorateType == 2) item.decorateTypeName = '整装'
            })
            this.total = response.result.total
          } else {
            this.thLsit = []
            this.total = 0
          }
        }
      })
    },
    // 左侧复选框的事件
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
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
    },
    // 判断启动禁用是否被报价所绑定，二次确认
    launch (row, checked) {
      let senData = {
        productId: row.id
      }
      let that = this
      if (!checked) {
        this.$request.post('/quote/queryQuoteByProductId', senData).then(response => {
          if (response.code == 0) {
            if (response.result.list) {
              this.$confirm({
                title: '提示',
                content: '此产品已被报价所绑定，禁用之后无法再启用此产品，是否继续禁用？',
                okText: '确认',
                cancelText: '取消',
                onOk: function () {
                  that.checkShowFn(row, checked)
                }
              })
            } else {
              this.$confirm({
                title: '提示',
                content: '禁用之后无法再启用此产品，是否继续禁用？',
                okText: '确认',
                cancelText: '取消',
                onOk: function () {
                  that.checkShowFn(row, checked)
                }
              })
            }
          }
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
      this.$request.post('/product/updateProducts', adata).then(response => {
        if (response.code == 0) {
          this.$message.success('修改成功!')
          this.showPageFn()
        }
      })
    },
    // 创建套餐
    foundMeal () {
      this.visible = true
    },
    // 确定创建套餐的回调
    handleOk () {
      this.visible = false
      if (this.addNextFlag === 1) {
        this.$router.push({ path: '/set-meal', query: { num: this.addNextFlag } })
      } else if (this.addNextFlag === 2) {
        this.$router.push({ path: '/addinventory', query: { num: this.addNextFlag } })
      } else if (this.addNextFlag === 3) {
        this.$router.push({ path: '/addcustomproduct', query: { num: this.addNextFlag } })
      }
    },
    // 选择套餐类型
    selectMeal (e) {
    },
    // 点击详情时候
    editThink (data) {
      if (data.type == 1) {
        this.$router.push({ path: '/meal/taiwanPage', query: { detail: data.id } })
      } else if (data.type == 2) {
        this.$router.push({ path: '/meal/inventoryPage', query: { detail: data.id } })
      } else if (data.type == 3) {
        this.$router.push({ path: '/meal/customPage', query: { detail: data.id } })
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
  .meal_box {
    &_header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }
  }
  .technology_p_g {
    margin-top: 10px;
    background: rgba($color: #e1e1e1, $alpha: 0.3);
    padding: 5px 10px;
    width: 350px;
  }
</style>
