<template>
  <div class="productAddEditPage">
    <h2 class="Pro_title">{{prodTitle}}产品系列</h2>
    <h3>产品系列信息</h3>
    <table border="1" class="comm">
      <tr>
        <th>产品系列名称</th>
        <td>
          <a-input v-model="addProductName" allowClear placeholder="请输入产品系列名称" maxlength="50" v-if="!version" />
          <p style="margin: 0px; text-align: left" v-else>{{addProductName}}</p>
        </td>
      </tr>
      <tr>
        <th>是否可升级</th>
        <td class="commLeft">
          <a-radio-group name="radioGroup" v-model="isUpgradeData" @change="myupgradeFn" v-if="!version">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="2">否</a-radio>
          </a-radio-group>
          <p style="margin: 0px; text-align: left" v-else>{{isUpgradeData == 1 ? '是' : '否'}}</p>
        </td>
      </tr>
      <tr>
        <th>是否可选配</th>
        <td class="commLeft">
          <a-radio-group name="radioGroup" v-model="isMatchingData" @change="mymatchingFn" v-if="!version">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="2">否</a-radio>
          </a-radio-group>
          <p style="margin: 0px; text-align: left" v-else>{{isMatchingData == 1 ? '是' : '否'}}</p>
        </td>
      </tr>
      <tr>
        <th>是否可折减</th>
        <td class="commLeft">
          <a-radio-group name="radioGroup" v-model="isReductionData" @change="myreductionFn" v-if="!version">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="2">否</a-radio>
          </a-radio-group>
          <p style="margin: 0px; text-align: left" v-else>{{isReductionData == 1 ? '是' : '否'}}</p>
          <span style="position: absolute;" v-if="!version">(注意：否，则默认不可折减，也无需设置主材折减价格)</span>
        </td>
      </tr>
    </table>

    <div class="prod_Dom">
      <h3 class="prod_tit">标配主材</h3>
      <div class="prod_right">
        <a-button class="del_btn" @click="delProductFn" v-if="!version">删除标配主材</a-button>
        <a-button class="add_btn" type="primary" @click="addProductFn" v-if="!version">添加SKU</a-button>
      </div>
    </div>
    <a-table :rowSelection="haveCheckDom" :columns="StandardColumns" :dataSource="StandardData" bordered class="tab_box" :pagination="true" 
    :locale="{ emptyText: '暂无数据' }">
      <template slot="spliceCommon" slot-scope="text, commonThisData">
        <a-tag color="blue" v-if="commonThisData.common == 1">不通用</a-tag>
        <a-tag color="#f50" v-if="commonThisData.common == 2">通用</a-tag>
      </template>
      <template slot="status" slot-scope="text, commonThisData">
        <a-tag color="blue" v-if="commonThisData.status == 1">启用</a-tag>
        <a-tag color="#f50" v-if="commonThisData.status == 2">禁用</a-tag>
      </template>
    </a-table>
    <!-- 标配主材SKU弹框 -->
    <common-poplur ref="productPagePoplur" :dialogColums="prodAddEditColumns" :dialogData="prodAddEditData" textMapTitle="添加主材" @sumbitPoplur="prodAddEditSubmit" :searchData="prodAddEditSearchData" :rowType='1' @topSearchThink="prodAddEditSearchFn" @cannalThink="prodAddEditCannalFn">
    </common-poplur>

    <div v-if="haveReductDom">
      <div class="prod_Dom">
        <h3 class="prod_tit">主材折减</h3>
        <div class="prod_right">
          <a-button class="del_btn" @click="delReductionFn" v-if="!version">删除主材折减</a-button>
        </div>
      </div>
      <a-table :rowSelection="reductionCheckDom" :columns="ReductionColumns" :dataSource="ReductionData" bordered class="tab_box" :pagination="true" 
      :locale="{ emptyText: '暂无数据' }">
        <template slot="reductPrice" slot-scope="text, reductPrice">
          <a-input type="number" style="text-align: center;" placeholder="请输入折减价" v-model="reductPrice.myreductPrice" @change="reductPriceChange(reductPrice, $event)" v-if="!version" />
          <p style="margin: 0px; text-align: center" v-else>{{reductPrice.myreductPrice}}</p>
        </template>
      </a-table>
    </div>

    <div class="bottom_Btn">
      <a-button class="cannal_btn" @click="myCannalFn">取消</a-button>
      <a-button class="submit_btn" type='primary' @click="mySubmitFn" v-if="!version">提交</a-button>
    </div>

  </div>
</template>
<script>
import { StandardColumns, ReductionColumns, prodAddEditColumns, prodAddEditSearchData } from '../js/index'
import commonPoplur from '@/views/OfferManagement/children/commonPoplur/commonPoplur'

export default {
  data () {
    return {
      prodTitle: '新增',
      addProductName: '',
      StandardColumns,
      StandardData: [],
      isUpgradeData: 1, // 是否可升级
      isMatchingData: 1, // 是否可选配
      isReductionData: 2, // 是否可折减
      prodAddEditColumns,
      prodAddEditData: [],
      prodAddEditSearchData, // 弹框的搜索数据
      ReductionColumns,
      ReductionData: [],
      selectedRowKeys: [],
      chooseListData: [],
      reductionRowKeys: [],
      reductionChooseList: [],
      haveReductDom: false, // 是否显示主材折减模块
      version: '', // 编辑还是详情
    }
  },
  created () {
    if (this.$route.query.pageSouch == 'edit') {
      this.prodTitle = '编辑'
      this.showPageFn()
    }
    if (this.$route.query.version == '1') {
      this.prodTitle = '详情'
    }
    if (this.$route.query.version == '1') {
      this.version = true
    } else {
      this.version = false
    }
  },
  computed: {
    haveCheckDom () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    },
    reductionCheckDom () {
      return {
        selectedRowKeys: this.reductionRowKeys,
        onChange: this.onReductionChange
      }
    },
  },
  components: {
    commonPoplur
  },
  methods: {
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.chooseListData = selectedRows
    },
    onReductionChange(selectedRowKeys, selectedRows) {
      this.reductionRowKeys = selectedRowKeys
      this.reductionChooseList = selectedRows
    },
    // 刷新页面接口（获取清单式产品详情）
    showPageFn () {
      let adata = {
        rangeId: this.$route.query.id,
        pageSize: 10000
      }
      this.$request.post('/range/queryRangeInfo', adata).then(response => {
        if (response.code == 0) {
          this.addProductName = response.result.name
          this.isUpgradeData = response.result.isUpdate
          this.isMatchingData = response.result.isOption
          this.isReductionData = response.result.isDiscount
          this.StandardData = response.result.rangeItemVoList
          this.ReductionData = response.result.rangeDiscountVoList
          if (this.isReductionData == 1) {
            this.haveReductDom = true
          } else if (this.isReductionData == 2) {
            this.haveReductDom = false
          }
          this.StandardData.forEach(item => {
            item.key = item.code
            item.serial = item.itemId || item.id
          })
          this.ReductionData.forEach(iren => {
            iren.key = iren.id
            iren.serial = iren.id
            iren.myreductPrice = iren.price
            iren.reductPrice = iren.price
          })
        }
      })
    },
    // 点击删除主材标配按钮事件
    delProductFn() {
      let that = this
      if (this.selectedRowKeys.length == 0) {
        this.$message.info('请先选择要删除的数据')
        return
      }
      let newArr = this.StandardData.filter(item => {
        return !this.selectedRowKeys.some(ele => {
          return ele == item.code
        })
      })
      this.$confirm({
        title: '是否确认删除所选数据?',
        content: '点击确认删除所选数据',
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          that.StandardData = newArr
          that.prodAddEditCannalFn()
          that.showBtnTableDelDataFn()
        },
        onCancel() {},
      })
    },
    // 点击删除主材折减按钮事件
    delReductionFn() {
      let that = this
      if (this.reductionRowKeys.length == 0) {
        this.$message.info('请选择要删除的主材折减')
        return
      }
      let newArr = this.ReductionData.filter(item => {
        return !this.reductionRowKeys.some(ele => {
          return ele == item.key
        })
      })
      this.$confirm({
        title: '是否确认删除所选数据?',
        content: '点击确认删除所选数据',
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          that.ReductionData = newArr
          that.reductionRowKeys = []
        },
        onCancel() {},
      })
    },
    // 点击添加主材标配按钮事件
    addProductFn() {
      this.$refs.productPagePoplur.clearThink()
      this.prodAddEditCannalFn()
      this.showPopuleFnOne()
      // 获取弹框顶部筛选条件下拉框数据
      let adata = { pageSize: 10000 }
      this.$request.post('/sku/queryItemCateList', adata).then(response => {
        if (response.code == 0) {
          if (response.result.list) {
            let sArr = []
            response.result.list.forEach(icon => {
              let asobj = {}
              asobj.value = icon.name
              asobj.tabel = icon.name
              sArr.push(asobj)
            })
            this.prodAddEditSearchData.optionData.data = sArr
          } else {
            this.prodAddEditSearchData.optionData.data = []
          }
        }
      })
    },
    // 弹框中列表数据接口
    showPopuleFnOne (category, name) {
      let adata = {}
      adata.pageSize = 10000
      adata.status = 1
      if (category) adata.category = category
      if (name) adata.name = name
      this.$request.post('/sku/queryItemList', adata).then(response => {
        if (response.code == 0) {
          this.$refs.productPagePoplur.visible = true
          if (response.result.list) {
            this.prodAddEditData = response.result.list
            this.prodAddEditData.forEach((item, index) => {
              item.key = item.code
              if (item.discountPrice !== null) {
                item.mydisprice = item.discountPrice
              } else {
                item.mydisprice = item.price
              }
              item.itemNum = 1
              item.amount = Number(item.itemNum) * Number(item.price)
            })
          } else {
            this.prodAddEditData = []
          }
        }
      })
    },
    // 是否可升级chagn事件
    myupgradeFn(adata) {

    },
    // 是否可选配chang事件
    mymatchingFn(adata) {

    },
    // 是否可折减单选框chang事件
    myreductionFn(adata) {
      if (this.isReductionData == 1) {
        this.haveReductDom = true
        this.showBtnTableAddDataFn()
      } else if (this.isReductionData == 2) {
        this.haveReductDom = false
      }
    },
    // 下面为弹框组件的一些事件
    prodAddEditSubmit(adata) {
      this.$refs.productPagePoplur.visible = false
      this.StandardData = adata
      this.StandardData.forEach(item => {
        item.serial = item.itemId || item.id
      })
      this.showBtnTableAddDataFn()
    },
    // 添加时候自动赋值主材折减表格（根据产品名称来分类）
    showBtnTableAddDataFn() {
      let obj = {}
      let pen = this.StandardData.reduce((cur, next) => {
        obj[next.name] ? "" : obj[next.name] = true && cur.push(next)
        return cur
      }, [])

      let allArr = pen.filter(item => {
        return !this.ReductionData.some(function(ele) {
          return ele.name == item.name
        })
      })
      let sendArr = []
      allArr.forEach(all => {
        let aobj = {}
        aobj.key = all.id
        aobj.name = all.name
        aobj.category = all.category
        aobj.unit = all.unit
        aobj.serial = all.itemId || all.id
        aobj.myreductPrice = ''
        aobj.reductPrice = all.price
        sendArr.push(aobj)
      })
      this.ReductionData = this.ReductionData.concat(sendArr)
    },
    // 删除时候自动赋值主材折减表格（根据产品名称来分类）
    showBtnTableDelDataFn() {
      let obj = {}
      let pen = this.StandardData.reduce((cur, next) => {
        obj[next.name] ? "" : obj[next.name] = true && cur.push(next)
        return cur
      }, [])

      let allArr = this.ReductionData.filter(item => {
        return pen.some(function(ele) {
          return ele.name == item.name
        })
      })
      this.ReductionData = allArr
    },
    prodAddEditSearchFn(data) {
      this.showPopuleFnOne(data.myCategory, data.searchName)
    },
    // 弹框取消事件
    prodAddEditCannalFn() {
      this.$refs.productPagePoplur.selectedRowKeys = []
      if (this.StandardData.length !== 0) {
        this.StandardData.forEach(item => {
          this.$refs.productPagePoplur.selectedRowKeys.push(item.key)
        })
      }
      this.$refs.productPagePoplur.chooseHoldData = this.StandardData
    },
    // 折减价输入框输入事件
    reductPriceChange(adata, ev) {
      this.ReductionData.forEach(item => {
        if (item.name == adata.name) {
          item.myreductPrice = ev.target.value
        }
      })
      this.$forceUpdate()
    },
    // 提交事件
    mySubmitFn() {
      if (!this.addProductName) {
        this.$message.info('请输入产品系列名称')
        return
      }
      if (this.isReductionData == 1) {
        let aiFlag = true
        this.ReductionData.forEach(idon => {
          if (!idon.myreductPrice) {
            aiFlag = false
          }
        })
        if (!aiFlag) {
          this.$message.info('请完整的输入折减价')
          return
        }
      }
      let rangeItem = []
      this.StandardData.forEach(item => {
        let sobj = {}
        sobj.itemId = item.itemId || item.id
        if (this.$route.query.pageSouch == 'edit' && item.itemId) {
          sobj.id = item.id
        }
        rangeItem.push(sobj)
      })
      let rangeDisconut = []
      if (this.isReductionData == 1) {
        this.ReductionData.forEach(item => {
          let aobj = {}
          aobj.name = item.name
          aobj.category = item.category
          aobj.unit = item.unit
          aobj.price = item.myreductPrice
          if (this.$route.query.pageSouch == 'edit' && item.id) {
            aobj.id = item.id
          }
          rangeDisconut.push(aobj)
        })
      }
      let sdata = {
        name: this.addProductName,
        isUpdate: this.isUpgradeData,
        isOption: this.isMatchingData,
        isDiscount: this.isReductionData,
        rangeItemVoList: rangeItem,
        rangeDiscountVoList: rangeDisconut
      }
      if (this.$route.query.pageSouch == 'edit') {
        sdata.id = this.$route.query.id
        let that = this
        this.$confirm({
          title: '该操作会使报价失效，是否继续操作？',
          content: h => <div style="color:red;">点击确认按钮确认</div>,
          onOk() {
            that.submitAllFn(sdata)
          },
          onCancel() {},
          class: 'test',
        })
      } else {
        this.submitAllFn(sdata)
      }
    },
    submitAllFn(sdata) {
      this.$request.post('/range/updateRange', sdata).then(response => {
        if (response.code == 0) {
          this.$message.success('提交成功')
          this.$router.push('/productFamily')
        }
      })
    },
    myCannalFn() {
      this.$router.push('/productFamily')
    }
  }
}
</script>
<style lang="scss">
@import '../css/productAddEditPage.scss';
</style>
