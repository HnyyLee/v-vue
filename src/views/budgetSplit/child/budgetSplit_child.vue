<!---->
<template>
  <div class="budgetSplit_child">

    <common-header :value='infoValue' :routerList="routerList"></common-header>

    <!-- 列表页面 -->
    <div class="budget_center" v-if="isListFlag">
      <a-table :rowSelection="null" :rowKey="(record, index) => index" :columns="budgetColunms" :dataSource="dataList" bordered :pagination="true" :locale="{ emptyText: '暂无数据' }">
        <template slot="active" slot-scope="text, scope">
          <a-button type="primary" size="small" @click="addBtnFn(scope)" v-if="scope.isUpdate == 1">新增</a-button>
          <a-button type="primary" size="small" @click="addBtnFn(scope)" v-if="scope.isUpdate == 2">查看</a-button>
          <a-button size="small" class="delBtn" @click="delBtnFn(scope)">删除</a-button>
        </template>
      </a-table>
    </div>

    <!-- 新增编辑页面 -->
    <div class="budget_add" v-if="!isListFlag">
      <h3>工程量及费用{{hTitle}}</h3>
      <div class="active_dom">
        <a-button class="act_del" @click="actDelFn" v-if="myIsAddEdit">删除所选数据</a-button>
        <a-button type="primary" class="act_add" @click="actAddFn" v-if="myIsAddEdit">添加定额</a-button>
      </div>
      <div class="add_table">
        <a-table :rowSelection="{selectedRowKeys: addRowKeys, onChange: addSelectChange}" :rowKey="(record, index) => record.id" :columns="budAddColunms" :dataSource="budAddList" bordered :pagination="true" :locale="{ emptyText: '暂无数据' }">
          <template slot="mynumber" slot-scope="text, scope">
            <a-input style="width:100px;" :disabled="scope.isDisabled" type="number" placeholder="输入数量" @change="mynumberChange(scope, $event)" min="0" step="0.01" v-model="scope.mynumber" />
          </template>
        </a-table>
        <div class="hejiDom">
          小计金额： <span class="amountDom">{{allAmount}}</span>
        </div>
        <div class="submitDom">
          <a-button size="large" class="gobackDom" @click="goback" v-if="!isListFlag">返回</a-button>
          <a-button size="large" type="primary" class="submitbtn" @click="submitFn" v-if="myIsAddEdit">提交</a-button>
        </div>
      </div>
      <!-- 弹框的页面 -->
      <div class="populerDom">
        <a-modal title="添加保护工定额" width="80%" :visible="budVisible" @ok="budHandleOk" :confirmLoading="confirmLoading" @cancel="budHandleCancel">
          <div class="popluer_top" style="margin-bottom: 20px">
            预算库管理
            <a-select placeholder="请选择" class="topSelectDom" allowClear :defaultValue="1" style="width: 200px;"  @change="budTypeSelectChange">
              <a-select-option v-for="(sel, index) in budTypeSelectArr" :key="index" :value="sel.id" >{{sel.name}}</a-select-option>
            </a-select>
          </div>
          <div class="popluer_table">
            <a-table :rowSelection="rowSelection" :rowKey="(record, index) => record.id" :columns="popluerColumns" :dataSource="budPopluerList" bordered :pagination="true" :locale="{ emptyText: '暂无数据' }">
            </a-table>
          </div>
        </a-modal>
      </div>
    </div>

  </div>
</template>

<script>
import CommonHeader from '@/components/CommonHeader/index.vue'
import { budgetColunms, budAddColunms, popluerColumns } from '../js/columns.js'

export default {
  data () {
    return {
      infoValue: {
        index: 3
      },
      routerList: [
        {
          name: '详情',
          url: '/DispatchOperation',
          flag: 'workOrderDetail',
          budgetPageFlag: true
        },
        {
          name: '合同',
          url: '/contract',
          flag: 'workOrderContract',
          budgetPageFlag: true
        },
        {
          name: '主材选品',
          url: '/mainMaterials',
          flag: 'SelectionOfMain',
          budgetPageFlag: true
        },
        {
          name: '施工预算拆单',
          url: '/budgetSplit_child',
          flag: 'budgetSplit',
          budgetPageFlag: true
        },
        {
          name: '工程变更',
          url: '/add-decrease',
          flag: 'workOrderChange',
          budgetPageFlag: true
        },
      ],
      budgetColunms,
      dataList: [],
      isListFlag: true,
      budAddColunms,
      budAddList: [],
      budTypeSelectArr: [],
      budVisible: false,
      popluerColumns,
      budPopluerList: [],
      confirmLoading: false,
      addRowKeys: [], // 左侧选中的所有key
      selectedRowKeys: [], // 弹框左侧选中的所有key
      chooseHoldData: [], // 弹框左侧选中的所有数据
      allAmount: 0, // 小计金额
      saveSubmitId: '', // 提交时候保存的id
      myIsAddEdit: true, // 判断是新增还是编辑
      hTitle: '新增', // 标题
    }
  },
  props: {
  },
  components: {
    CommonHeader,
  },
  created () {
    this.showListFn()
  },
  computed: {
    rowSelection() {
      var that = this
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          that.selectedRowKeys = selectedRowKeys
        },
        onSelect: (record, selected, selectedRows, nativeEvent) => {
          if (selected) {
            let anewArre = []
            anewArre.push(record)
            that.chooseHoldData = that.chooseHoldData.concat(anewArre)
          } else {
            that.chooseHoldData = that.chooseHoldData.filter(item => {
              return item.key !== record.key
            })
          }
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
          if (selected) {
            changeRows.forEach(iden => {
              let bnewArre = []
              bnewArre.push(iden)
              that.chooseHoldData = that.chooseHoldData.concat(bnewArre)
            })
          } else {
            if (selectedRows.length == 0) {
              that.chooseHoldData = that.chooseHoldData.filter(item => {
                return !changeRows.some(ele => {
                  return ele.key == item.key
                })
              })
            } else {
              let senArr = changeRows.filter(icen => {
                return !selectedRows.some(rel => {
                  return rel.key == icen.key
                })
              })
              that.chooseHoldData = that.chooseHoldData.filter(item => {
                return !senArr.some(ele => {
                  return ele.key == item.key
                })
              })
            }
          }
        }
      }
    }
  },
  mounted () {
  },
  methods: {
    // 获取列表接口
    showListFn() {
      let sdata = {
        pageNum: 1,
        pageSize: 10000,
        constructionSiteId: JSON.parse(sessionStorage.orderValue).id,
	      workOrderNumber: JSON.parse(sessionStorage.orderValue).code
      }
      this.$request.post('/rbs-constr/budget/split/queryList', sdata).then(res => {
        if (res.code === 0) {
          this.dataList = res.result.list
          this.dataList.forEach(item => {
            item.editor_name = item.editor_name ? item.editor_name : '--'
            item.createTime = item.createTime ? item.createTime : '--'
          })
        }
      })
    },
    // 左侧复选框的事件
    addSelectChange (selectedRowKeys) {
      this.addRowKeys = selectedRowKeys
    },
    // 点击新增事件
    addBtnFn(adata) {
      this.isListFlag = false
      this.allAmount = 0
      this.showAddListFn(adata, adata.isUpdate)
      this.saveSubmitId = adata.id
      // isUpdate为1新增，2编辑
      if (adata.isUpdate == 1) {
        this.myIsAddEdit = true
        this.hTitle = '新增'
      } else if (adata.isUpdate == 2){
        this.myIsAddEdit = false
        this.hTitle = '详情'
      }
    },
    // 点击新增按钮之后调用接口
    showAddListFn(adata, aflag) {
      let sdata = {
        pageNum: 1,
        pageSize: 10000,
        constructionBudgetSplitId: adata.id
      }
      this.$request.post('/rbs-constr/budget/split/queryCraftList', sdata).then(res => {
        if (res.code === 0) {
          if (res.result.list) {
            if (aflag == 1) {
              this.budAddList = res.result.list
              this.budAddList.forEach(item => {
                item.isDisabled = false
              })
            } else if (aflag == 2) {
              this.budAddList = res.result.list
              this.budAddList.forEach(item => {
                item.myAmount = 0
                if (item.craftPrice) item.price = item.craftPrice
                if (item.craftNum) {
                  item.mynumber = item.craftNum
                }
              })
              this.budAddList.forEach(item => {
                item.isDisabled = true
                item.myAmount = item.myAmount + (Number(item.mynumber) * Number(item.craftPrice))
              })
              this.myAloneFn()
            }
            this.$forceUpdate()
          } else {
            this.budAddList = []
          }
        }
      })
    },
    // 点击删除事件
    delBtnFn(adata) {
      let that = this
      this.$confirm({
        title: '是否删除岗位',
        content: '点击确定按钮删除',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          let sdata = {
            id: adata.id
          }
          that.$request.post('/rbs-constr/budget/split/update', sdata).then(res => {
            if (res.code === 0) {
              that.$message.success('删除成功')
              that.showListFn()
            }
          })
        },
        onCancel() {
          
        },
      })
    },
    // 点击删除所选得定额
    actDelFn() {
      if (this.addRowKeys.length == 0) {
        this.$message.info('请先选择需要删除的数据')
        return
      }
      let that = this
      this.$confirm({
        title: '是否删除所选数据',
        content: '点击确定按钮删除',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          let changArr = []
          changArr = that.budAddList.filter(item => !that.addRowKeys.some(ele => ele == item.id))
          that.budAddList = changArr.map(o => Object.assign({}, o))
          that.addRowKeys = []
        }
      })
    },
    // 点击新增定额
    actAddFn() {
      this.budTypeSelectArr = [
        { id: 1, name: '全屋装修' },
        { id: 2, name: '局装PLUS' },
        { id: 3, name: '局装MINI' },
        { id: 4, name: '刷新' },
      ]
      this.budVisible = true
      this.showpopluerListDataFn(1)
    },
    // 弹框顶部下拉框change事件
    budTypeSelectChange(data) {
      this.showpopluerListDataFn(data)
    },
    // 点击弹框提交按钮事件
    budHandleOk() {
      this.budVisible = false
      this.budAddList = this.chooseHoldData
      this.budAddList.forEach(item => {
        item.myAmount = 0
      })
    },
    // 点击弹框取消按钮事件
    budHandleCancel() {
      this.budVisible = false
    },
    // 弹框左侧复选框的事件
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    // 获取弹框页面的列表接口
    showpopluerListDataFn (num) {
      let sdata = {
        constructionBudgetId: num,
        pageNum: 1,
        pageSize: 10000
      }
      this.$request.post('/rbs-constr/budget/queryCraftList', sdata).then(response => {
        if (response.code == 0) {
          if (response.result.list) {
            this.budPopluerList = response.result.list
            this.budPopluerList.forEach((item, index) => {
              item.key = item.id
              if (item.common == 1) {
                item.commonName = '通用'
              } else if (item.common == 2) {
                item.commonName = '例外'
              } else {
                item.commonName = item.common
              }
            })
            let selectArray = []
            let selectObject = []
            if (this.budAddList.length !== 0) {
              this.budAddList.forEach(bud => {
                selectArray.push(bud.id)
                selectObject.push(bud)
              })
              this.selectedRowKeys = selectArray
              this.chooseHoldData = selectObject
            } else {
              this.selectedRowKeys = []
              this.chooseHoldData = []
            }
          } else {
            this.houseDataList = []
          }
        }
      })
    },
    // 输入数量时候的chagne事件
    mynumberChange(adata, ev) {
      this.budAddList.forEach(item => {
        if (item.id == adata.id) {
          item.myAmount = 0
        }
      })
      this.budAddList.forEach(item => {
        if (item.id == adata.id) {
          item.myAmount = Number(item.myAmount) + (Number(ev.target.value ) * Number(adata.price))
        }
      })
      this.myAloneFn()
    },
    myAloneFn() {
      this.allAmount = 0
      this.budAddList.forEach(item => {
        this.allAmount = this.allAmount + item.myAmount
      })
    },
    // 提交事件
    submitFn() {
      let anumFlag = true
      this.budAddList.forEach(icon => {
        if (!icon.mynumber) {
          anumFlag = false
        }
      })
      if (!anumFlag) {
        this.$message.info('请完整输入数量')
        return
      }
      let sdata = {
        id: this.saveSubmitId,
        budgetPrice: this.allAmount,
        constructionBudgetCraftSplitVoList: []
      }
      this.budAddList.forEach(item => {
        let sobj = {}
        sobj.id = item.id
        sobj.constructionBudgetCraftId = item.constructionBudgetId
        sobj.craftNum = item.mynumber
        sobj.craftPrice = item.price
        sdata.constructionBudgetCraftSplitVoList.push(sobj)
      })
      this.$request.post('/rbs-constr/budget/split/updateCraft', sdata).then(response => {
        if (response.code == 0) {
          this.$message.success('提交成功')
          this.isListFlag = true
          this.showListFn()
        }
      })
    },
    // 返回事件
    goback() {
      this.isListFlag = true
    }
  },
  watch: {
    
  }
}
</script>

<style lang="scss">
.budgetSplit_child {
  .budget_center{
    margin-top: 30px;
    .delBtn{
      margin-left: 20px;
    }
  }
  .budget_add{
    margin-top: 25px;
    .active_dom{
      text-align: right;
      .act_del{
        margin-right: 10px;
      }
      .act_add{
        background: #85CE61;
        border: 1px solid #85CE61;
      }
    }
    .add_table{
      margin-top: 15px;
      .hejiDom{
        margin-top: 20px;
        text-align: right;
        .amountDom{
          font-size: 23px;
          font-weight: bold;
        }
      }
      .submitDom{
        text-align: center;
        margin-top: 40px;
      }
    }
  }
  .gobackDom{
    margin-right: 20px;
  }
}
</style>
