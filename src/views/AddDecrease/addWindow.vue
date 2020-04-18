<template>
  <div class="add_wind_wrap">
    <div class="add_wind_header">发起工程变更</div>
    <div class="add_table_title">主材变更</div>
    <a-table style="margin-top: 10px;" :columns="columns" :dataSource="dataList" :scroll="{ x: 1600 }" bordered :pagination='false' :locale='locale'>
      <template slot="num" slot-scope="text,record">
        <!-- <a-input type='Number' :disabled='editFlag' v-model="record.num" @change="eidtNumFun(record, 1)" /> -->
        <a-input-number :disabled='editFlag' v-model="record.num" @change="eidtNumFun(record, 1)" />
      </template>
    </a-table>
    <div class="add_button_box">
      <a-button type='primary' @click="addPrincipal" :disabled='editFlag'>新增主材</a-button>
    </div>
    <div class="add_border"></div>
    <div class="add_table_title">施工变更</div>
    <a-table style="margin-top: 10px;" :scroll="{ x: 1600 }" :columns="columnsTwo" :dataSource="dataListTwo" bordered :pagination='false' :locale='locale'>
      <template slot="num" slot-scope="text,record">
        <!-- <a-input v-model="record.num" type='Number' :disabled='editFlag'  @change="eidtNumFun(record, 2)" /> -->
        <a-input-number v-model="record.num" type='Number' :disabled='editFlag'  @change="eidtNumFun(record, 2)" />
      </template>
    </a-table>
    <div class="add_button_box">
      <a-button type='primary' @click="addConstruction" :disabled='editFlag'>新增工艺</a-button>
    </div>
    <div class="add_button_box">
      合计金额：{{totalPirce}}元
    </div>
    <!-- 加入审批模板 -->
    <a-form :form='formData' v-if="this.$route.query.pageSouch !== 'examine'">
      <div class="Contract_box_item">
        <span class="Contract_box_item_title">审批模板</span>
        <a-form-item style="margin-bottom: 0;">
          <a-select v-decorator="verify.myapproval" style="width: 420px" placeholder="请选择审批模板">
            <a-select-option v-for="(item, index) in approvalList" :key="index" :value="item.id">{{item.processRangeName}}</a-select-option>
          </a-select>
        </a-form-item>
      </div>
    </a-form>
    
    <div class="add_footer" v-if='!editFlag'>
      <a-button style="margin-right: 10px" @click="cancelGoBack">取消</a-button>
      <a-button type='primary' @click="submitFun">提交</a-button>
    </div>
    <!-- 主材 -->
    <a-modal
      width="90%"
      :closable='false'
      :maskClosable='false'
      :visible="principalFlag"
      @ok="handleOk"
      @cancel="handleCancel"
      okText="提交"
      cancelText="取消">
      <div class="add_wind_model_header">
        <p>新增主材</p>
        <div class="header_right">
          <a-select style="width: 180px; margin-right: 10px;" v-model="principalName" placeholder="请选择主材">
            <a-select-option v-for="item in selectList" :key="item.id" :value="item.name">{{item.name}}</a-select-option>
          </a-select>
          <a-input-search v-model="keyworkOne" placeholder="产品名称、品牌、型号、物料编码" @search="pirnSearch" style="width: 400px" enterButton="查询" size="default" />
        </div>
      </div>
      <a-table style="margin-top: 10px;" :columns="list.addWindListOne" :scroll="{ x: 1600 }" :dataSource="principalList"  bordered :locale='locale'
        :rowSelection="{selectedRowKeys: selectedRowKeysList, onSelect: onSelectChange, onSelectAll: onSelectAllZc}">
      </a-table>
    </a-modal>
    <!-- 工艺 -->
    <a-modal
      width="90%"
      :closable='false'
      :maskClosable='false'
      :visible="constructionFlag"
      @ok="handleOkCon"
      @cancel="handleCancelCon"
      okText="提交"
      cancelText="取消">
      <div class="add_wind_model_header">
        <p>新增工艺</p>
        <div class="header_right">
          <a-select style="width: 180px; margin-right: 10px;" v-model="conStrName" placeholder="请选择工艺">
            <a-select-option v-for="item in selectListConstr" :key="item.id" :value="item.name">{{item.name}}</a-select-option>
          </a-select>
          <a-input-search v-model="keyworkTwo" placeholder="产品名称、品牌、型号、物料编码" @search="conSeacrch" style="width: 400px" enterButton="查询" size="default" />
        </div>
      </div>
      <a-table style="margin-top: 10px;" :scroll="{ x: 1600 }" :columns="list.addWindListTwo" :dataSource="constructionList"  bordered :locale='locale'
        :rowSelection="{selectedRowKeys: selectedRowKeysListTwo, onSelect: onSelectChangeTwo, onSelectAll: onSelectAllGy}">
      </a-table>
    </a-modal>
  </div>
</template>
<script>
import list from './js/list'
import { myapproval } from './js/list'

export default {
  data () {
    return {
      formData: this.$form.createForm(this),
      verify: {
        myapproval
      }, // 审批模板表单绑定数据
      approvalList: [], // 审批模板下拉框数据
      columns: [], // 主材列表
      columnsTwo: [], // 施工列表
      dataList: [], // 主材列表数据
      dataListTwo: [], // 施工列表数据
      totalPirce: '', // 计算出来的总价格
      principalList: [], // 主材弹窗列表数据
      // addtableTitle: [], // 添加弹窗的数据列表标题头
      selectedRowKeysList: [], // 选中的列表数据
      selectedRowKeysListTwo: [], // 选择的施工材料列表数据
      principalFlag: false, // 是否显示主材SUK库弹窗
      constructionList: [], // 施工弹窗列表数据
      constructionFlag: false, // 是否显示施工材料SUK弹窗
      confirmLoading: false, // 不显示loading
      selectList: [], // 主材下拉筛列表
      selectListConstr: [], // 工艺下拉筛选列表
      list: {}, // 列表表头数据
      principalName: '', // 主材筛选值
      conStrName: '', // 施工搜索值
      keyworkOne: '', // 主材搜索关键字
      keyworkTwo: '', // 施工材料搜索关键字
      prinSelctList: [], // 选中了的数据(主材)
      conSelectList: [], // 选中了的数据(施工)
      orderInfo: {}, // 工单信息
      editFlag: false,
      locale: { emptyText: '暂无数据,请新增' } // 无数据显示文案
    }
  },
  created () {
    this.list = list
    this.columns = list.addTableOne
    this.columnsTwo = list.addTableTwo
    this.orderInfo = JSON.parse(sessionStorage.getItem('orderValue'))
    if (this.$route.query.pageSouch === 'edit') { // 编辑进来
      this.getDataListPir()
    } else if (this.$route.query.pageSouch === 'examine') {
      this.getDataListPir()
      this.editFlag = true
    }
    // 审批模板选择下拉框的列表数据
    this.approvalFn()
  },
  methods: {
    // 审批模板选择下拉框的列表数据
    approvalFn() {
      let adata = {
        processCode: 'Change',
        pageSize: 10000
      }
      this.$request.post('/processTemplate/userList', adata).then(res => {
        if (res.code === 0) {
          this.approvalList = res.result.list
        }
      })
    },
    onSelectAllZc (selected, selectedRows, changeRows) { // 主材全选方法
      this.selectedRowKeysList = []
      this.prinSelctList = []
      if (selected === true) {
        selectedRows.forEach(item => {
          this.selectedRowKeysList.push(item.id)
          this.prinSelctList = selectedRows
        })
      } else {
        this.selectedRowKeysList = []
        this.prinSelctList = []
      }
    },
    onSelectAllGy (selected, selectedRows, changeRows) { // 工艺全选方法
      if (selected === true) {
        selectedRows.forEach(item => {
          this.selectedRowKeysListTwo.push(item.id)
          this.conSelectList = selectedRows
        })
      } else {
        this.selectedRowKeysListTwo = []
        this.conSelectList = []
      }
    },
    cancelGoBack () {
      this.$router.go(-1)
    },
    getDataListPir () { // 获取编辑主材列表
      this.$request.post('/workOrderAddDrop/findIODDetailById', { id: this.$route.query.id }).then(res => {
        if (res.code === 0) {
          if (res.result.key1) { // 处理主材
            res.result.key1.forEach((item, index) => {
              let obj = item
              obj.serial = index + 1
              obj.key = index
              if (item.price !== null) {
                obj.mydisprice = item.price
              } else {
                obj.mydisprice = item.itemPrice
              }
              obj.price = item.itemPrice
              this.dataList.push(obj)
              this.selectedRowKeysList.push(item.id)
              this.prinSelctList.push(obj)
            })
          }
          if (res.result.key2) { // 处理施工
            res.result.key2.forEach((item, index) => {
              let obj = item
              obj.serial = index + 1
              obj.key = index
              this.dataListTwo.push(obj)
              this.selectedRowKeysListTwo.push(item.id)
              this.conSelectList.push(obj)
            })
          }
          let arr = this.prinSelctList.concat(this.conSelectList)
          let totalP = 0
          arr.forEach(item => {
            if (item.mydisprice) {
              totalP = ((totalP - 0) + (item.num * item.mydisprice)).toFixed(2)
            } else {
              totalP = ((totalP - 0) + (item.num * item.price)).toFixed(2)
            }
          })
          this.totalPirce = totalP
        }
      })
    },
    addPrincipal () { // 添加主材
      this.principalFlag = true
      if (this.selectList.length === 0) { // 如果有数据了； 就不重复再次获取；避免过多获取后台接口
        this.$request.post('/sku/queryItemCateList', { city: '深圳' }).then(res => {
          if (res.code === 0) {
            this.selectList = res.result.list
            this.selectList.unshift({ name: '全部品类' })
          }
        }).catch(err => {
          console.log(err)
        })
      }
      this.principalName = undefined
      this.getPrinList()
    },
    getPrinList () { // 获取主材table列表数据
      let obj = {
        city: '深圳',
        category: this.principalName !== '' ? this.principalName !== '全部品类' ? this.principalName : null : null, // 类别
        pageSize: 10000,
        name: this.keyworkOne !== '' ? this.keyworkOne : null, // 关键字
        workOrderId: this.orderInfo.id
      }
      this.$request.post('/sku/queryItemList', obj).then(res => {
        this.principalList = []
        if (res.code === 0) {
          if (res.result.list) {
            this.principalList = res.result.list
            this.principalList.forEach((itme, index) => {
              itme.serial = index + 1
              itme.key = itme.id
              itme.num = 1
              if (itme.discountPrice !== null) {
                itme.mydisprice = itme.discountPrice
              } else {
                itme.mydisprice = itme.price
              }
            })
          }
        }
      })
    },
    getConstrList () { // 获取施工材料列表
      let obj = {
        city: '深圳',
        category: this.conStrName !== '' ? this.conStrName ? this.conStrName : null : null, // 类别
        pageSize: 10000,
        name: this.keyworkTwo !== '' ? this.keyworkTwo : null// 关键字
      }
      this.$request.post('/sku/queryCraftList', obj).then(res => {
        if (res.code === 0) {
          this.constructionList = []
          if (res.result.list) {
            res.result.list.forEach((itme, index) => {
              let obj = itme
              obj.serial = index + 1
              obj.key = obj.id
              obj.num = 1
              this.constructionList.push(obj)
            })
          }
        }
      })
    },
    addConstruction () { // 添加施工材料
      this.constructionFlag = true
      if (this.selectListConstr.length === 0) {
        this.$request.post('/sku/queryCraftCateList', { city: '深圳' }).then(res => {
          if (res.code === 0) {
            this.selectListConstr = res.result.list
            this.selectListConstr.unshift({ name: '全部品类' })
          }
        })
      }
      this.conStrName = undefined
      this.getConstrList()
    },
    handleOk () { // 添加主材确定
      this.dataList = this.prinSelctList
      this.dataList.forEach(item => {
        item.mynewAprice = item.price
      })
      this.principalFlag = false
      let arr = this.prinSelctList.concat(this.conSelectList)
      let totalP = 0
      arr.forEach(item => {
        totalP = (totalP - 0 + (((item.num - 0) * 100) * ((item.price - 0) * 100)) / 10000).toFixed(2)
      })
      this.totalPirce = totalP
    },
    handleCancel () { // 添加主材取消
      this.principalFlag = false
      this.prinSelctList = []
      this.selectedRowKeysList = []
      this.dataList.forEach(item => {
        this.selectedRowKeysList.push(item.id)
        this.prinSelctList.push(item)
      })
    },
    onSelectChange (val, e) { // 主材确认
      if (e === true) {
        this.selectedRowKeysList.push(val.id)
        this.prinSelctList.push(val)
      } else {
        this.selectedRowKeysList = this.selectedRowKeysList.filter(item => {
          return item !== val.id
        })
        this.prinSelctList = this.prinSelctList.filter(item => {
          return item.id !== val.id
        })
      }
    },
    onSelectChangeTwo (val, e) {
      if (e === true) {
        this.selectedRowKeysListTwo.push(val.id)
        this.conSelectList.push(val)
      } else {
        this.selectedRowKeysListTwo = this.selectedRowKeysListTwo.filter(item => {
          return item !== val.id
        })
        this.conSelectList = this.conSelectList.filter(item => {
          return item.id !== val.id
        })
      }
    },
    // getSelctValue (e) {
    //   this.principalName = e
    // },
    pirnSearch () { // 主材搜索提交
      this.getPrinList()
    },
    conSeacrch () {
      this.getConstrList()
    },
    handleOkCon () { // 施工弹窗确认按钮
      this.constructionFlag = false
      this.dataListTwo = this.conSelectList
      let arr = this.prinSelctList.concat(this.conSelectList)
      let totalP = 0
      arr.forEach(item => {
        if (item.mydisprice) {
          totalP = (totalP - 0 + (((item.num - 0) * 100) * ((item.mydisprice - 0) * 100)) / 10000).toFixed(2)
        } else {
          totalP = (totalP - 0 + (((item.num - 0) * 100) * ((item.price - 0) * 100)) / 10000).toFixed(2)
        }
      })
      this.totalPirce = totalP
    },
    handleCancelCon () { // 施工弹窗取消按钮
      this.constructionFlag = false
      this.conSelectList = []
      this.selectedRowKeysListTwo = []
      this.dataListTwo.forEach(item => {
        this.selectedRowKeysListTwo.push(item.id)
        this.conSelectList.push(item)
      })
    },
    // conStrSearch (e) { // 施工搜索提交
    //   this.conStrName = e
    // },
    eidtNumFun (val, type) { // 修改数量；从新计算金额
      let anewVal = Number(String(val.num).replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3'))
      if (anewVal) {
        // let reg = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/
        if (type === 1) { // type=1是主材；2是工艺
          if (anewVal) {
            this.dataList.forEach(item => {
              if (item.id === val.id) {
                item.num = anewVal
              }
            })
          }
        } else if (type === 2) {
          if (anewVal) {
            this.dataListTwo.forEach(item => {
              if (item.id === val.id) {
                item.num = anewVal
              }
            })
          }
        }
        let arr = this.dataList.concat(this.dataListTwo)
        let totalP = 0
        arr.forEach(item => {
          if (item.mydisprice) {
            if (anewVal > 0) {
              totalP = totalP + (((item.num * 100) * (item.price * 100)) / 10000)
            } else {
              totalP = totalP + (((item.num * 100) * (item.mydisprice * 100)) / 10000)
            }
          } else {
            totalP = totalP + (((item.num * 100) * (item.price * 100)) / 10000)
          }
        })
        this.totalPirce = totalP.toFixed(2)
      }
    },
    submitFun () {
      this.formData.validateFieldsAndScroll((err, values) => {
        if (!err) {
          // 循环出数据
          let arr = []
          this.dataList.forEach(item => {
            let iObj = {
              skuId: item.id,
              changeType: 1,
              changeQty: item.num
            }
            if (item.num > 0) {
              iObj.price = item.price
            } else {
              iObj.price = item.mydisprice
            }
            arr.push(iObj)
          })
          this.dataListTwo.forEach(item => {
            let iObj = {
              skuId: item.id,
              changeType: 2,
              price: item.price,
              changeQty: item.num
            }
            arr.push(iObj)
          })
          let achangFlag = true
          arr.forEach(item => {
            if (!item.changeQty) {
              achangFlag = false
            }
          })
          if (!achangFlag) {
            this.$message.info('请输入完整的数量')
            return
          }
          let obj = {
            listAllSku: arr,
            changeAmount: this.totalPirce,
            processId: values.myapproval
          }
          if (this.$route.query.pageSouch === 'add') {
            obj.workOrderId = this.orderInfo.id
          } else {
            obj.id = this.$route.query.id
            obj.workOrderId = this.orderInfo.id
          }
          if (obj.listAllSku.length == 0) {
            this.$message.info('请先添加要变更的项目')
            return
          }
          this.$request.post('/workOrderAddDrop/addOrUpdateIncreaseOrDecrease', obj).then(res => {
            if (res.code === 0) {
              this.$router.push('/add-decrease')
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
.add_wind_wrap {
  .add_wind_header {
    font-size: 16px;
    color: #333;
    font-weight: 700;
  }
  .add_table_title {
    margin: 10px 0;
  }
  .add_button_box {
    display: flex;
    justify-content: flex-end;
    margin: 15px 0
  }
  .add_border {
    border-top: 1px solid #eee;
  }
  .add_footer {
    display: flex;
    justify-content: center;
  }
}
.add_wind_model_header {
  display: flex;
  justify-content: space-between;
  height: 30px;
  align-items: center;
  .header_right {
    display: flex;
  }
}
</style>
