<!---->
<template>
  <div class="houseDecoration">

    <h3>全屋整装</h3>
    <div class="top_Dom">
      <div class="house_left">
        <span>
          <a-input ref="searchRef"  style="width: 250px;"  v-model="searchText" allowClear placeholder="搜索工艺编码、施工项目名称"  @pressEnter="searchThink" />
          <a-icon class="removeIcon" v-if="searchText" slot="suffix" type="close-circle" @click="emitEmpty" />
        </span>
        <a-select placeholder="按工序筛选" class="topSelectDom" allowClear  @change="procedureSelectChange">
          <a-select-option v-for="(sel, index) in procedureSelectArr" :key="index" :value="sel.name" >{{sel.name}}</a-select-option>
        </a-select>
        <a-select placeholder="按工种筛选" class="topSelectDom" allowClear  @change="workTypeSelectChange">
          <a-select-option v-for="(sel, index) in workTypeSelectArr" :key="index" :value="sel.name" >{{sel.name}}</a-select-option>
        </a-select>
        <a-select placeholder="按类别筛选" class="topSelectDom" allowClear  @change="categorySelectChange">
          <a-select-option v-for="(sel, index) in categorySelectArr" :key="index" :value="sel.name" >{{sel.name}}</a-select-option>
        </a-select>
        <a-button class="design_btn" type="primary" @click="searchThink" style="margin-left: 10px;">提交</a-button>
      </div>

      <div class="house_right">
        <a-button type="primary" class="addQutoDom" @click="constructionQuotaAdd">
          新增施工定额
        </a-button>
        <a :href="baseURL + '/budget/downloadItemExcel'" class="teampleDom" style="margin-right: 10px;">模板下载</a>
        <a-upload accept=".xlsx,.xls" name="filename" :data="uploadData" :headers="hederToken" :multiple="true" :action="baseURL + '/rbs-constr/budget/importCrafts'" @change="excelChange" >
          <a-button>
            excel导入
          </a-button>
        </a-upload>
      </div>
    </div>

    <div class="center">
      <a-table :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" :rowKey="(record, index) => index" :columns="houseDecorationColumn" :dataSource="houseDataList" bordered class="tab_box" :pagination="false" :locale="{ emptyText: '暂无数据' }" :scroll="{ x: 2400 }">
        <template slot="action" slot-scope="text, record">
          <a-button size="small" type="primary" @click="editThink(record)">编辑</a-button>
          <a-button size="small" style="margin-left: 15px;" @click="deleteThink(record)">删除</a-button>
        </template>
      </a-table>
    </div>

    <!-- 分页功能 -->
    <div class="paginationDom">
      <a-pagination showSizeChanger @change="pageChange" :pageSize.sync="pageSize" @showSizeChange="onShowSizeChange" :total="total" v-model="current"/>
    </div>

    <!-- 新增框 -->
    <common-modal ref="commonModalDom" :dialogData="dialogData" :textMapTitle="textMapTitle" dialogWidth="58%" @submitThink="SubmitThink" :commonModalLoading="mySubmitLoading" />

  </div>
</template>

<script>
import { myPower } from '@/common/utils/power.js'
import { baseURL } from '@/common/utils/request'
import { houseDecorationColumn } from './js/columns.js'
import CommonModal from '@/components/CommonModal'
import { houseWorkingProcedure, houseWorkType, houseCode, houoseProjectName, houseType, housePersonFee, houseMaterialFee, housePrice, houseUint, houseApplyRange, houseRule, houseIntroduce } from '@/common/validate'

const CommonOptions = [{ value: '通用', label: '通用' }, { value: '例外', label: '例外' }]
var myConstructionBudgetAllId = 1
export default {
  data () {
    return {
      mythat: this,
      searchText: '',
      myworkProcedure: '',
      myworkType: '',
      mycommon: '',
      procedureSelectArr: [],
      workTypeSelectArr: [],
      categorySelectArr: [],
      uploadData: { constructionBudgetId: myConstructionBudgetAllId },
      hederToken: {
        'Authorization': `Bearer ${this.$store.state.user.token}`
      },
      baseURL,
      selectedRowKeys: [],
      houseDecorationColumn,
      houseDataList: [],
      pageNum: 1,
      pageSize: 10,
      current: 1,
      total: 0,
      textMapTitle: '新增施工定额',
      addOrEditFlag: '', // 0是新增， 1是编辑更新
      dialogData: [
        { label: '工序', type: 'text', spanNumber: 11, column: houseWorkingProcedure, default: '', value: null, options: null, disabled: false },
        { label: '工种', type: 'text', spanNumber: 11, column: houseWorkType, default: '', value: null, options: null },
        { label: '工艺物料编码', type: 'text', spanNumber: 11, column: houseCode, default: '', value: null, options: null },
        { label: '施工项目名称', type: 'text', spanNumber: 11, column: houoseProjectName, default: '', value: null, options: null },
        { label: '类别', type: 'select', spanNumber: 11, column: houseType, default: '', value: null, options: CommonOptions },
        { label: '人工工费', type: 'text', spanNumber: 11, column: housePersonFee, default: '', value: null, options: null },
        { label: '材料费', type: 'text', spanNumber: 11, column: houseMaterialFee, default: '', value: null, options: null },
        { label: '综合单价', type: 'text', spanNumber: 11, column: housePrice, default: '', value: null, options: null },
        { label: '单位', type: 'text', spanNumber: 11, column: houseUint, default: '', value: null, options: null },
        { label: '适用', type: 'text', spanNumber: 11, column: houseApplyRange, default: '', value: null, options: null },
        { label: '计价规则', type: 'text', spanNumber: 11, column: houseRule, default: '', value: null, options: null },
        { label: '工艺说明', type: 'textarea', spanNumber: 24, column: houseIntroduce, default: '', value: null, options: null }
      ],
      mySubmitLoading: false, // 提交按钮的loading
      saveId: ''
    }
  },
  props: {
  },
  mixins: [myPower],
  components: {
    CommonModal
  },
  created () {
    // 进入页面获取到拉去那侧边栏四个预算的，获取到各自的id
    this.showBudgetList()
    // 获取顶部筛选框的数据
    this.showTopFilterList(1)
    this.showTopFilterList(2)
    this.showTopFilterList(3)
    // 获取页面的列表接口
    this.showListDataFn()
  },
  computed: {

  },
  mounted () {
  },
  methods: {
    // 获取到各自的id
    showBudgetList () {
      this.$request.post('/rbs-constr/budget/queryConstructionBudgetList', {}).then(response => {
        if (response.code == 0) {
          console.log('成功', response)
        }
      })
    },
    // 获取顶部筛选框的数据
    showTopFilterList (num) {
      let sdata = {
        group: num,
        constructionBudgetId: myConstructionBudgetAllId,
        pageSize: 10000
      }
      this.$request.post('/rbs-constr/budget/queryCraftCateList', sdata).then(response => {
        if (response.code == 0) {
          if (num == 1) {
            this.procedureSelectArr = response.result.list
          } else if (num == 2) {
            this.workTypeSelectArr = response.result.list
          } else if (num == 3) {
            this.categorySelectArr = response.result.list
          }
        }
      })
    },
    // 获取页面的列表接口
    showListDataFn () {
      let sdata = {
        constructionBudgetId: myConstructionBudgetAllId
      }
      sdata.pageNum = this.pageNum
      sdata.pageSize = this.pageSize
      if (this.searchText) sdata.name = this.searchText
      if (this.myworkProcedure) sdata.workProcedure = this.myworkProcedure
      if (this.myworkType) sdata.workType = this.myworkType
      if (this.mycommon) sdata.common = this.mycommon
      this.$request.post('/rbs-constr/budget/queryCraftList', sdata).then(response => {
        if (response.code == 0) {
          if (response.result.list) {
            this.houseDataList = response.result.list
            this.total = response.result.total
            this.houseDataList.forEach((item, index) => {
              item.key = item.id
              if (item.common == 1) {
                item.commonName = '通用'
              } else if (item.common == 2) {
                item.commonName = '例外'
              } else {
                item.commonName = item.common
              }
            })
          } else {
            this.houseDataList = []
            this.total = 0
          }
        }
      })
    },
    // 点击清除文字事件
    emitEmpty () {
      this.$refs.searchRef.focus()
      this.searchText = ''
      this.showListDataFn()
    },
    // 点击搜索按钮事件
    searchThink () {
      this.pageNum = 1
      this.current = 1
      this.showListDataFn()
    },
    // 顶部select下拉筛选框的事件
    procedureSelectChange(adata) {
      this.myworkProcedure = adata
    },
    workTypeSelectChange(adata) {
      this.myworkType = adata
    },
    categorySelectChange(adata) {
      this.mycommon = adata
    }, 
    // 点击新增按钮事件
    constructionQuotaAdd () {
      this.addOrEditFlag = 0
      this.textMapTitle = '新增施工定额'

      houseWorkingProcedure[1].initialValue = ''
      houseWorkType[1].initialValue = ''
      houseCode[1].initialValue = ''
      houoseProjectName[1].initialValue = ''
      houseType[1].initialValue = ''
      housePersonFee[1].initialValue = ''
      houseMaterialFee[1].initialValue = ''
      housePrice[1].initialValue = ''
      houseUint[1].initialValue = ''
      houseApplyRange[1].initialValue = ''
      houseRule[1].initialValue = ''
      houseIntroduce[1].initialValue = ''
      this.$refs.commonModalDom.visible = true
      this.$refs.commonModalDom.clearThink()
    },
    // 导入文档事件
    excelChange (response) {
      if (response.file.status == 'done') {
        if (response.file.response.code == 0) {
          // this.thLsit = response.file.response.result
          // this.thLsit.forEach((item, index) => {
          //   item.key = item.id
          // })
          this.pageNum = 1
          this.current = 1
          this.pageSize = 10
          this.showListDataFn()
        } else {
          this.$message.error(response.file.response.message)
        }
      }
    },
    // 左侧复选框的事件
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
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
    // 点击编辑按钮
    editThink (data) {
      this.saveId = data.id
      this.addOrEditFlag = 1
      this.textMapTitle = 'SKU编辑'
      this.$refs.commonModalDom.clearThink()
      
      houseWorkingProcedure[1].initialValue = data.workProcedure
      houseWorkType[1].initialValue = data.workType
      houseCode[1].initialValue = data.code
      houoseProjectName[1].initialValue = data.name
      houseType[1].initialValue = data.common
      housePersonFee[1].initialValue = data.personFee
      houseMaterialFee[1].initialValue = data.materialFee
      housePrice[1].initialValue = data.price
      houseUint[1].initialValue = data.unit
      houseApplyRange[1].initialValue = data.applyRange
      houseRule[1].initialValue = data.rule
      houseIntroduce[1].initialValue = data.introduce

      this.$refs.commonModalDom.visible = true
    },
    // 点击删除按钮
    deleteThink(adata) {
      let sendObj = {}
      let sArr = []
      sArr.push(adata.id)
      sendObj.idList = sArr
      sendObj.enable = 'false'
      let that = this
      this.$confirm({
        title: '是否确定删除？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          that.$request.post('/rbs-constr/budget/updateCrafts', sendObj).then(response => {
            if (response.code == 0) {
              that.$message.success('删除成功')
              that.showListDataFn()
            }
          })
        }
      })
    },
    // 提交事件，新增和编辑的提交都在这里
    SubmitThink (sendData) {
      this.mySubmitLoading = true
      if (this.addOrEditFlag == 0) {
        let sdata = {
          constructionBudgetId: myConstructionBudgetAllId,
          workProcedure: sendData.houseWorkingProcedure,
          workType: sendData.houseWorkType,
          code: sendData.houseCode,
          name: sendData.houoseProjectName,
          common: sendData.houseType,
          personFee: sendData.housePersonFee,
          materialFee: sendData.houseMaterialFee,
          price: sendData.housePrice,
          unit: sendData.houseUint,
          introduce: sendData.houseIntroduce,
          rule: sendData.houseRule,
          applyRange: sendData.houseApplyRange,
          status: 1
        }
        this.$request.post('/rbs-constr/budget/insertCraft', sdata).then(response => {
          if (response.code == 0) {
            this.mySubmitLoading = false
            this.$message.success('添加成功!')
            this.showListDataFn()
            this.$refs.commonModalDom.visible = false
          } else {
            this.$message.error('添加失败，请重试!')
          }
        })
      } else if (this.addOrEditFlag == 1) {
        let that = this
        let sdata = {
          constructionBudgetId: myConstructionBudgetAllId,
          workProcedure: sendData.houseWorkingProcedure,
          workType: sendData.houseWorkType,
          code: sendData.houseCode,
          name: sendData.houoseProjectName,
          common: sendData.houseType,
          personFee: sendData.housePersonFee,
          materialFee: sendData.houseMaterialFee,
          price: sendData.housePrice,
          unit: sendData.houseUint,
          introduce: sendData.houseIntroduce,
          rule: sendData.houseRule,
          applyRange: sendData.houseApplyRange,
          status: 1
        }
        sdata.id = this.saveId
        this.$request.post('/rbs-constr/budget/updateCraft', sdata).then(response => {
          if (response.code == 0) {
            this.mySubmitLoading = false
            this.$message.success('更新成功!')
            this.showListDataFn()
            this.$refs.commonModalDom.visible = false
          } else {
            this.mySubmitLoading = false
            this.$message.error(response.message)
          }
        })
      }
    }
  },
  watch: {

  }
}
</script>

<style lang="scss">
.houseDecoration {
  .top_Dom{
    display: flow-root;
    margin-bottom: 10px;
    .house_left{
      float: left;
      display: inline-block;
    }
    .removeIcon{
      position: relative; 
      left: -20px;
    }
    .topSelectDom{
      width: 150px;
      margin-left: 20px;
    }
    .house_right{
      display: inline-block;
      float: right;
      .addQutoDom{
        background: #85CE61;
        border: 1px solid #85CE61;
        margin-right: 10px;
      }
      .teampleDom{
        cursor: pointer;
      }
      .teampleDom:hover{
        color: #FF861A;
      }
    }
  }
  .center{
     
  }
  .paginationDom{
    margin: 30px 0px;
    text-align: right;
  }
  @media ALL and (max-width: 1480px){
    .house_right {
      float: left!important;
      margin-top: 10px;
    }
  }
}
</style>
