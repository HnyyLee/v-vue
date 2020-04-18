<template>
  <div class="material_selection_wrap">
    <a-tabs v-if="panesDom.length !== 0" hideAdd type="editable-card" tabPosition="top" :animated="true" @change="topTabChange" class="pageTabsDom">
      <a-tab-pane v-for="aitem in panesDom" :tab="aitem.title" :key="aitem.key" :closable="aitem.closable" :forceRender="true">
        <!-- 头部 -->
        <div class="material_selection_wrap_header">
          <span>筛选
            <a-select allowClear style="width: 320px" @change="topSelectChange(aitem)" v-model="aitem.topSelectData" placeholder="请选择要筛选的东西">
              <a-select-option v-for="(cat, index) in aitem.screenData" :key="index" :value="cat.value">{{cat.tabel}}</a-select-option>
            </a-select>
          </span>
          <div class="mybtnDom">
            <!-- <a-button class="del_btn" @click="alldelMaterial(aitem)">删除所选标配主材</a-button>
            <a-button type="primary" @click="addMaterial(aitem)">选择标配主材</a-button> -->
          </div>
        </div>
        <!-- 表格 -->
        <a-table :columns="tableColumns" :rowSelection="{selectedRowKeys: aitem.myselectedRowKeys, onChange: myonSelectChange}" :dataSource="aitem.contentData" bordered :locale="{emptyText: '暂时没有选择的主材数据'}" :pagination="true">
          <!-- <template slot="delete" slot-scope="text, rend">
            <a-button size="small" @click="deleteFun(text, rend)">删除</a-button>
          </template> -->
        </a-table>
        <!-- 弹框 -->
        <common-poplur :ref="aitem.dialogRefDom" :dialogColums="doaligColumns" :dialogData="aitem.dialogData" textMapTitle="选择标配主材" @sumbitPoplur="doaligOkThink(aitem, $event)" :searchData="searchDataTwo" :rowType='1' @topSearchThink="doaligSearchThink(aitem, $event)" @cannalThink="handleCancel(aitem, $event)" />
      </a-tab-pane>
    </a-tabs>

    <div class="noneRangData" v-else>暂无产品系列</div>

    <div class="material_selection_footer">
      <a-button type="primary" @click="stepBack" style="margin-right: 10px;">上一步</a-button>
      <a-button type="primary" @click="nextThink">下一步</a-button>
    </div>
  </div>
</template>
<script>
import commonPoplur from '@/views/OfferManagement/children/commonPoplur/commonPoplur'
import { searchDataTwo } from '@/common/mymock'
const tableColumns = [
  {
    title: '序号',
    width: 60,
    dataIndex: 'key'
  },
  {
    title: '物料编码',
    width: 150,
    dataIndex: 'code'
  },
  {
    title: '类别',
    width: 150,
    dataIndex: 'category'
  },
  {
    title: '产品名称',
    width: 150,
    dataIndex: 'name'
  },
  {
    title: '品牌',
    width: 150,
    dataIndex: 'brand'
  },
  {
    title: '型号',
    width: 150,
    dataIndex: 'type'
  },
  {
    title: '规格',
    width: 150,
    dataIndex: 'size'
  },
  {
    title: '单位',
    width: 60,
    dataIndex: 'unit'
  },
  {
    title: '价格',
    width: 150,
    dataIndex: 'price'
  },
  {
    title: '备注',
    width: 150,
    dataIndex: 'note'
  },
  // {
  //   title: '操作',
  //   width: 60,
  //   dataIndex: 'delete',
  //   scopedSlots: { customRender: 'delete' }
  // }
]
tableColumns.forEach(item => { item.align = 'center' })
const doaligColumns = [
  {
    title: '序号',
    dataIndex: 'key'
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
    dataIndex: 'price'
  },
  {
    title: '备注',
    dataIndex: 'note'
  }
]
doaligColumns.forEach(item => { item.align = 'center' })
export default {
  props: {
    twoValue: {
      type: Array
    },
    productItemId: {
      type: Number
    }
  },
  data () {
    var panesDom = []
    return {
      tableColumns,
      doaligColumns,
      searchDataTwo,
      panesDom,
      saveTabId: '' // 保存当前tab的id，也是产品系列的id
    }
  },
  components: {
    commonPoplur
  },
  created () {

  },
  watch: {
    twoValue: {
      handler (newVal, val) {
        this.panesDom = []
        newVal.forEach(aval => {
          let asobj = {}
          asobj.key = aval.id // tab的id，也表示产品系列的id
          asobj.title = aval.name // tab的标题，也是产品系列的标题
          asobj.closable = false // tab是否显示关闭按钮
          asobj.contentData = [] // 每个tab内表格数据数组
          asobj.dialogData = [] // 每个tab内弹框数据数组
          asobj.screenData = [] // 每个tab内筛选下拉框数据数组
          asobj.tableRefDom = `tableCommon${aval.id}` // 每个tab内表格ref，用来获取元素
          asobj.dialogRefDom = `poplurCommon${aval.id}` // 每个tab内弹框ref，用来获取元素
          asobj.topSelectData = '' // 每个tab顶部筛选框绑定的数据
          asobj.myselectedRowKeys = [] // 每个tab内table的左侧选择框选择的数据key
          asobj.mychooseListData = [] // 每个tab内table的左侧选择框选择的数据list
          this.panesDom.push(asobj)
        })
        this.saveTabId = newVal[0].id
      },
      deep: true
    }
  },
  computed: {

  },
  methods: {
    // 获取产品产品系列的数据接口，进来这个页面第二步骤立马调用
    showQueryDataFn(adata, myRangeIdList) {
      let sendObj = {
        pageSize: 100000,
        productId: adata
        // rangeIdList: myRangeIdList
      }
      this.$request.post('/product/queryProductItemsById', sendObj).then(response => {
        if (response.code == 0) {
          if (response.result.list) {
            this.panesDom.forEach(pand => {
              pand.contentData = response.result.list
            })
            this.panesDom.forEach(apand => {
              apand.contentData = apand.contentData.filter(item => {
                return item.rangeId == apand.key
              })
            })
            this.panesDom.forEach(pand => {
              pand.contentData.forEach((item, index) => {
                item.key = item.itemId
              })
            })
          }
        }
      })
    },
    // table选择框选择事件
    myonSelectChange (selectedRowKeys, selectedRows) {
      this.panesDom.forEach(pand => {
        if (pand.key == this.saveTabId) {
          pand.myselectedRowKeys = selectedRowKeys
          pand.mychooseListData = selectedRows
        }
      })
    },
    // tab切换事件
    topTabChange (idev, adata) {
      this.saveTabId = idev
    },
    // 顶部筛选框改变事件
    topSelectChange (adata) {
      this.panesDom.forEach(item => {
        if (item.key == this.saveTabId) {
          item.contentData = this.$refs[adata.dialogRefDom][0].chooseHoldData
        }
      })
      this.panesDom.forEach(pand => {
        if (pand.key == this.saveTabId) {
          let sArr = []
          if (!pand.topSelectData) {
            pand.contentData = this.$refs[pand.dialogRefDom][0].chooseHoldData
          } else {
            if (pand.contentData.length !== 0) {
              pand.contentData.forEach(doa => {
                if (doa.category == pand.topSelectData) {
                  sArr.push(doa)
                }
              })
              pand.contentData = sArr
            } else {
              this.$message.info('未选择任何数据，无法做出筛选')
            }
          }
        }
      })
    },
    // 列表table下拉框改变事件
    centerSelectChange (data, rangeId) {
      data.rangeId = rangeId
    },
    // 弹框顶部点击搜索框的清空小按钮
    emitEmpty () {
      this.panesDom.forEach(pand => {
        if (pand.key == this.saveTabId) {
          this.$refs[pand.popluerSearchRef][0].focus()
          pand.doaligSearchText = ''
        }
      })
    },
    // 删除
    deleteFun (text, rend) {
      let that = this
      this.$confirm({
        title: '是否确定删除？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          that.panesDom.forEach(pand => {
            if (pand.key == that.saveTabId) {
              let newArr = ''
              newArr = pand.contentData.filter(refs => {
                return refs.id !== rend.id
              })
              pand.contentData = newArr
              that.$refs[pand.dialogRefDom][0].chooseHoldData = newArr
              that.$refs[pand.dialogRefDom][0].selectedRowKeys = []
              pand.contentData.forEach(aim => {
                that.$refs[pand.dialogRefDom][0].selectedRowKeys.push(aim.id)
              })
            }
          })
        }
      })
    },
    // 批量删除
    alldelMaterial (adata) {
      this.panesDom.forEach(pand => {
        if (pand.key == adata.key) {
          if (pand.myselectedRowKeys.length == 0) {
            this.$message.info('请选择要删除的数据!')
          } else {
            let that = this
            this.$confirm({
              title: '是否确定删除？',
              okText: '确定',
              okType: 'danger',
              cancelText: '取消',
              onOk () {
                let newArr = ''
                newArr = pand.contentData.filter(fil => {
                  return !pand.myselectedRowKeys.some(ele => {
                    return ele === fil.key
                  })
                })
                pand.contentData = newArr
                pand.myselectedRowKeys = []
                pand.mychooseListData = []
                that.$refs[pand.dialogRefDom][0].chooseHoldData = newArr
                that.$refs[pand.dialogRefDom][0].selectedRowKeys = []
                pand.contentData.forEach(aim => {
                  that.$refs[pand.dialogRefDom][0].selectedRowKeys.push(aim.id)
                })
              }
            })
          }
        }
      })
    },
    // 刷新弹框里面table数据
    showDoaligPageFn (category, name) {
      let adata = {}
      adata.pageSize = 10000
      adata.status = 1
      if (category) adata.category = category
      if (name) adata.name = name
      this.$request.post('/sku/queryItemList', adata).then(response => {
        if (response.code == 0) {
          if (response.result.list) {
            this.panesDom.forEach(pand => {
              if (pand.key == this.saveTabId) {
                pand.dialogData = response.result.list
                pand.dialogData.forEach((item, index) => {
                  item.key = item.id
                })
              }
            })
          } else {
            this.panesDom.forEach(pand => {
              if (pand.key == this.saveTabId) {
                pand.dialogData = []
              }
            })
          }
        }
      })
    },
    // 点击选择标配主材按钮事件
    addMaterial (sendData) {
      this.$refs[sendData.dialogRefDom][0].clearThink()
      this.categoryTypeFn()
      this.showDoaligPageFn()
      this.panesDom.forEach(pand => {
        if (pand.key == this.saveTabId) {
          this.$refs[pand.dialogRefDom][0].visible = true
        }
      })
    },
    // 弹框顶部搜索事件
    doaligSearchThink (data, sendData) {
      this.showDoaligPageFn(sendData.myCategory, sendData.searchName)
    },
    // 点击弹框的添加确认事件
    doaligOkThink (adata, sendData) {
      this.$refs[adata.dialogRefDom][0].visible = false
      this.panesDom.forEach(pand => {
        if (pand.key == this.saveTabId) {
          pand.contentData = sendData
          pand.topSelectData = ''
        }
      })
      this.panesDom.forEach(rang => {
        rang.contentData.forEach(icon => {
          icon.rangeId = rang.key
        })
      })
    },
    // 弹框取消掉事件
    handleCancel (adata, sendData) {
      this.panesDom.forEach(pand => {
        if (pand.key == this.saveTabId) {
          pand.contentData = sendData
          pand.topSelectData = ''
        }
      })
      this.panesDom.forEach(rang => {
        rang.contentData.forEach(icon => {
          icon.rangeId = rang.key
        })
      })
    },
    // 获取主材标配筛选里面的下拉框数据
    categoryTypeFn () {
      let adata = {
        pageSize: 10000
      }
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
            this.searchDataTwo.optionData.data = sArr
            this.panesDom.forEach(pand => {
              pand.screenData = sArr
            })
          } else {
            this.searchDataTwo.optionData.data = []
          }
        }
      })
    },
    // 上一步
    stepBack () {
      this.$emit('goBackOne', this.dataList)
    },
    // 下一步
    nextThink () {
      let sendObj = {
        id: this.productItemId,
        productItemVoList: []
      }
      this.panesDom.forEach(rang => {
        rang.contentData.forEach(icon => {
          icon.rangeId = rang.key
        })
      })
      this.panesDom.forEach(pand => {
        pand.contentData.forEach(cont => {
          let sobj = {}
          sobj.rangeId = cont.rangeId
          sobj.itemId = cont.key
          sendObj.productItemVoList.push(sobj)
        })
      })
      this.$emit('goThere', this.panesDom)
      // this.$request.post('/product/updateProductItems', sendObj).then(response => {
      //   if (response.code == 0) {
      //     this.$message.success('保存成功!')
      //     this.$emit('goThere', this.panesDom)
      //   } else {
      //     this.$message.error(response.message)
      //   }
      // })
    }
  }
}
</script>
<style lang="scss">
.material_selection_wrap {
  &_header {
    display: flex;
    justify-content: space-between;
    margin: 20px 0;
  }
  .material_selection_footer {
    display: flex;
    justify-content: center;
    margin: 20px;
  }
  .pageTabsDom{
    margin-top: 50px;
  }
  .mybtnDom{
    .del_btn{
      margin-right: 20px;
    }
  }
}
.material_modal_header {
  // display: flex;
  widows: 600px;
  margin: 20px 0
}
.noneRangData{
  line-height: 300px;
  text-align: center;
  color: #ccc;
}
</style>
