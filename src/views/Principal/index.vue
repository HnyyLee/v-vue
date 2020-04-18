<template>
  <div class="Principal_box">
    <h3>主材SKU管理</h3>
    <div class="Principal_box_header">
      <div class="Principal_box_header_select">
        <span>
          筛选
          <a-select allowClear style="width: 200px" @change="categoryChange" v-model="categoryValue" placeholder="输选择要筛选的项">
            <a-select-option v-for="(sel, index) in categoryList" :key="index" :value="sel.name">{{sel.name}}</a-select-option>
          </a-select>
        </span>
        <span style="margin: 0 5px 0 30px;">
          搜索产品名称
          <a-input placeholder="输入物料编号或产品名称" ref="searchRef"  style="width: 200px;"  v-model="searchText" @pressEnter="searchThink">
          </a-input>
          <a-icon style="position: relative; left: -20px;" v-if="searchText" slot="suffix" type="close-circle" @click="emitEmpty" />
        </span>
        <a-button class="design_btn" type="primary" @click="searchThink" style="margin-left: 10px;" v-if="RouterNameFlag[mythat.$route.name] || RouterNameFlag['item_SKU_search']" >查询</a-button>
        <a-button class="btn_add" type="primary" @click="addThink"><a-icon type="plus" v-if="RouterNameFlag[mythat.$route.name] || RouterNameFlag['item_SKU_create']" />新增主材SKU</a-button>
      </div>
      <div class="Principal_box_header_exc">
        <a-button @click="statusChange(0)" style="margin-right: 20px;" v-if="RouterNameFlag[mythat.$route.name] || RouterNameFlag['item_SKU_allDown']">批量禁用</a-button>
        <a-button type="primary" @click="statusChange(1)" style="margin-right: 20px;" v-if="RouterNameFlag[mythat.$route.name] || RouterNameFlag['item_SKU_allUp']">批量启用</a-button>
        <a :href="baseURL + '/sku/downloadItemExcel'" class="teampleDom" style="margin-right: 10px;" v-if="RouterNameFlag[mythat.$route.name] || RouterNameFlag['item_SKU_teampleDown']">模板下载</a>
        <a-upload accept=".xlsx,.xls" name="filename" :data="uploadData" :headers="hederToken" :multiple="true" :action="baseURL + '/sku/importItems'" @change="excelChange" v-if="RouterNameFlag[mythat.$route.name] || RouterNameFlag['item_SKU_excelBtn']">
          <a-button>
            excel导入
          </a-button>
        </a-upload>
      </div>
    </div>
    <a-table :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" :columns="columns" :dataSource="thLsit"
    bordered :pagination="false" :locale="{ emptyText: '暂无数据' }" :scroll="{ x: 2500 }">
      <template slot="status" slot-scope="text, record">
        <a-tag color="blue" v-if="record.status == 1">启用</a-tag>
        <a-tag color="#B2B2B2" v-if="record.status == 2">禁用</a-tag>
      </template>
      <template slot="action" slot-scope="text, record">
        <a-button size="small" type="primary" @click="editThink(record)">编辑</a-button>
      </template>
      <template slot="common" slot-scope="text, record">
        <a-tag color="blue" v-if="record.common == 1">不通用</a-tag>
        <a-tag color="#f50" v-if="record.common == 2">通用</a-tag>
      </template>
    </a-table>
    <!-- 分页功能 -->
    <div class="paginationDom">
      <a-pagination showSizeChanger @change="pageChange" :pageSize.sync="pageSize" @showSizeChange="onShowSizeChange" :total="total" v-model="current"/>
    </div>
    <!-- 新增框 -->
    <common-modal ref="commonModalDom" :dialogData="dialogData" :textMapTitle="textMapTitle" dialogWidth="50%" @submitThink="SubmitThink" :commonModalLoading="mySubmitLoading" />
  </div>
</template>
<script>
import { baseURL } from '@/common/utils/request'
import CommonModal from '@/components/CommonModal'
import { principalCode, principalCategory, principalName, principalBrand, principalType, principalSize, principalUnit, principalPrice, principalAttribute, principalStatus, principalCommonStatus } from '@/common/validate'
import { myPower } from '@/common/utils/power.js'

const columns = [
  {
    title: '序号',
    dataIndex: 'key',
    width: 70
  },
  {
    title: '物料编码',
    dataIndex: 'code'
  },
  {
    title: '类别',
    dataIndex: 'category'
  },
  {
    title: '产品名称',
    dataIndex: 'name'
  },
  {
    title: '品牌',
    dataIndex: 'brand'
  },
  {
    title: '型号',
    dataIndex: 'type'
  },
  {
    title: '规格',
    dataIndex: 'size'
  },
  {
    title: '单位',
    dataIndex: 'unit'
  },
  {
    title: '价格',
    dataIndex: 'price',
    width: 70
  },
  {
    title: '是否通用',
    dataIndex: 'common',
    scopedSlots: { customRender: 'common' }
  },
  {
    title: '产品属性',
    dataIndex: 'attribute'
  },
  {
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '备注',
    dataIndex: 'note'
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
columns.forEach(item => {
  item.align = 'center'
})
const statusOptions = [{ value: 1, label: '启用' }, { value: 2, label: '禁用' }]
const commonOptions = [{ value: 1, label: '不通用' }, { value: 2, label: '通用' }]
export default {
  data () {
    return {
      mythat: this,
      columns,
      thLsit: [],
      categoryList: [],
      categoryValue: '',
      searchText: '',
      pageNum: 1,
      pageSize: 10,
      current: 1,
      total: 0,
      uploadData: { city: '深圳' },
      baseURL,
      selectedRowKeys: [],
      textMapTitle: 'SKU新增',
      dialogData: [
        { label: '物料编码', type: 'text', spanNumber: 11, column: principalCode, default: '', value: null, options: null, disabled: false },
        { label: '类别', type: 'text', spanNumber: 11, column: principalCategory, default: '', value: null, options: null },
        { label: '产品名称', type: 'text', spanNumber: 11, column: principalName, default: '', value: null, options: null },
        { label: '品牌', type: 'text', spanNumber: 11, column: principalBrand, default: '', value: null, options: null },
        { label: '型号', type: 'text', spanNumber: 11, column: principalType, default: '', value: null, options: null },
        { label: '规格', type: 'text', spanNumber: 11, column: principalSize, default: '', value: null, options: null, placeholder: '' },
        { label: '单位', type: 'text', spanNumber: 11, column: principalUnit, default: '', value: null, options: null },
        { label: '价格', type: 'number', spanNumber: 11, column: principalPrice, default: '', value: null, options: null, min: 0, max: 999999 },
        { label: '产品属性', type: 'text', spanNumber: 11, column: principalAttribute, default: '', value: null, options: null },
        { label: '状态', type: 'select', spanNumber: 11, column: principalStatus, default: '', value: null, options: statusOptions },
        { label: '是否通用', type: 'select', spanNumber: 11, column: principalCommonStatus, default: '', value: null, options: commonOptions },
        { label: '备注', type: 'textarea', spanNumber: 24, column: ['note'], default: '', value: null, options: null }
      ],
      addOrEditFlag: '',
      saveId: '',
      hederToken: {
        'Authorization': `Bearer ${this.$store.state.user.token}`
      },
      mySubmitLoading: false, // 提交按钮的loading
    }
  },
  components: {
    CommonModal
  },
  created () {
    // 获取下拉框数据
    this.categoryTypeFn()
    // 获取列表
    this.showPageFn()
  },
  mixins: [myPower],
  methods: {
    showPageFn () {
      let adata = {}
      adata.pageNum = this.pageNum
      adata.pageSize = this.pageSize
      if (this.categoryValue) adata.category = this.categoryValue
      if (this.searchText) adata.name = this.searchText
      this.$request.post('/sku/queryItemList', adata).then(response => {
        if (response.code == 0) {
          if (response.result.list) {
            this.thLsit = response.result.list
            this.thLsit.forEach((item, index) => {
              item.key = item.id
            })
            this.total = response.result.total
          } else {
            this.thLsit = []
            this.total = 0
          }
        }
      })
    },
    categoryTypeFn () {
      let adata = {}
      this.$request.post('/sku/queryItemCateList', adata).then(response => {
        if (response.code == 0) {
          this.categoryList = response.result.list
        }
      })
    },
    categoryChange (e) {
    },
    excelChange (response) {
      if (response.file.status == 'done') {
        if (response.file.response.code == 0) {
          this.pageNum = 1
          this.current = 1
          this.pageSize = 10
          this.showPageFn()
        } else {
          this.$message.error(response.file.response.message)
        }
      }
    },
    searchThink () {
      this.pageNum = 1
      this.current = 1
      this.showPageFn()
    },
    onShowSizeChange (current, pageSize) {
      this.pageNum = current
      this.current = current
      this.pageSize = pageSize
      this.showPageFn()
    },
    pageChange (curr) {
      this.pageNum = curr
      this.current = curr
      this.showPageFn()
    },
    emitEmpty () {
      this.$refs.searchRef.focus()
      this.searchText = ''
    },
    // 左侧复选框的事件
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    // 点击新增按钮
    addThink () {
      this.textMapTitle = '新增'
      this.addOrEditFlag = 0
      this.dialogData.forEach(item => {
        if (item.column[0] == 'code') {
          item.disabled = false
        }
      })
      principalCode[1].initialValue = ''
      principalCategory[1].initialValue = ''
      principalName[1].initialValue = ''
      principalBrand[1].initialValue = ''
      principalType[1].initialValue = ''
      principalSize[1].initialValue = ''
      principalUnit[1].initialValue = ''
      principalPrice[1].initialValue = ''
      principalAttribute[1].initialValue = ''
      principalStatus[1].initialValue = ''
      principalCommonStatus[1].initialValue = ''
      this.$refs.commonModalDom.visible = true
      this.$refs.commonModalDom.clearThink()
    },
    // 点击编辑按钮
    editThink (data) {
      this.textMapTitle = '编辑'
      this.saveId = data.id
      this.addOrEditFlag = 1
      this.$refs.commonModalDom.clearThink()
      this.dialogData.forEach(item => {
        if (item.column[0] == 'code') {
          item.disabled = true
        }
      })
      principalCode[1].initialValue = data.code
      principalCategory[1].initialValue = data.category
      principalName[1].initialValue = data.name
      principalBrand[1].initialValue = data.brand
      principalType[1].initialValue = data.type
      principalSize[1].initialValue = data.size
      principalUnit[1].initialValue = data.unit
      principalPrice[1].initialValue = data.price
      principalAttribute[1].initialValue = data.attribute
      principalStatus[1].initialValue = data.status
      principalCommonStatus[1].initialValue = data.common
      this.$refs.commonModalDom.visible = true
    },
    // 提交事件，新增和编辑的提交都在这里
    SubmitThink (sendData) {
      this.mySubmitLoading = true
      if (this.addOrEditFlag == 0) {
        this.$request.post('/sku/insertItem', sendData).then(response => {
          if (response.code == 0) {
            this.mySubmitLoading = false
            this.$message.success('添加成功!')
            this.showPageFn()
            this.$refs.commonModalDom.visible = false
          } else {
            this.mySubmitLoading = false
            this.$message.error('添加失败，请重试!')
          }
        })
      } else if (this.addOrEditFlag == 1) {
        let that = this
        sendData.id = this.saveId
        this.$request.post('/sku/checkQuoteByItemId', sendData).then(response => {
          if (response.code == 0) {
            if (response.result.length == 0) {
              this.changeThisFn(sendData)
            } else {
              this.$confirm({
                title: '该SKU已被报价使用，是否确认更新？',
                content: h => <div style="color:red;">点击确认按钮确认</div>,
                onOk() {
                  that.changeThisFn(sendData)
                },
                onCancel() {
                  that.mySubmitLoading = false
                },
                class: 'test',
              })
            }
          } else {
            this.mySubmitLoading = false
            this.$message.error(response.message)
          }
        })
      }
    },
    changeThisFn(sendData) {
      sendData.id = this.saveId
      this.$request.post('/sku/updateItem', sendData).then(response => {
        if (response.code == 0) {
          this.mySubmitLoading = false
          this.$message.success('更新成功!')
          this.showPageFn()
          this.$refs.commonModalDom.visible = false
        } else {
          this.mySubmitLoading = false
          this.$message.error(response.message)
        }
      })
    },
    // 禁用启用事件
    statusChange (ev) {
      let that = this
      if (this.selectedRowKeys.length !== 0) {
        var sendObj = {}
        sendObj.idList = this.selectedRowKeys
        ev == 0 ? sendObj.enable = 'false' : sendObj.enable = 'true'

        if (ev == 0) {
          this.$request.post('/sku/checkQuoteByItemIds', sendObj).then(response => {
            if (response.code == 0) {
              if (response.result.length == 0) {
                this.changeIptFn(sendObj)
              } else {
                this.$confirm({
                  title: '选择的SKU中有已被报价使用SKU，是否确认更新？',
                  content: h => <div style="color:red;">点击确认按钮确认</div>,
                  onOk() {
                    that.changeIptFn(sendObj)
                  },
                  onCancel() {
                    that.mySubmitLoading = false
                  },
                  class: 'test',
                })
              }
            } else {
              this.mySubmitLoading = false
              this.$message.error(response.message)
            }
          })
        } else if (ev == 1) {
          this.changeIptFn(sendObj)
        }
      } else {
        this.$message.warning('没有选择任何数据！')
      }
    },
    changeIptFn(sendObj) {
      this.$request.post('/sku/updateItems', sendObj).then(response => {
        if (response.code == 0) {
          this.$message.success('修改成功!')
          this.selectedRowKeys = []
          this.showPageFn()
        } else {
          this.$message.error(response.message)
        }
      })
    }
  }
}
</script>
<style lang="scss">
.Principal_box {
  &_header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .paginationDom{
    margin: 30px 0px;
    text-align: right;
  }
  .btn_add{
    background: #85CE61;
    border: 1px solid #85CE61;
    margin-left: 20px;
  }
  .teampleDom{
    cursor: pointer;
  }
  .teampleDom:hover{
    color: #FF861A;
  }
  @media ALL and (max-width: 1480px){
    .Principal_box_header {
      display: block;
      .Principal_box_header_select{
        margin-bottom: 25px;
      }
    }
  }
}
</style>
