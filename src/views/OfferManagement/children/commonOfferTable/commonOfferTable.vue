<!---->
<template>
  <div class="commonOfferTable">
    <div class="btn_Dom" v-if="thisDomNoneFlag">
      <span class="top_text" v-if="tabTitle">{{tabTitle}}</span>
      <a-button class="del_btn" v-if="delbtnText" @click="delScience" :disabled="commonDelAbled || false">{{delbtnText}}</a-button>
      <a-button class="add_btn" type="primary" v-if="addbtnText" @click="addScience" :disabled="commonAddAbled || false">{{addbtnText}}</a-button>
    </div>
    <a-table bordered :rowSelection="hasCheckFlag ? haveCheckDom : null" :columns="TableHeader" :dataSource="TableData" :pagination="pagaNumFlag" :locale="{emptyText: '暂无数据'}">
      <template slot="space" slot-scope="text, record">
        <a-select style="width: 150px" allowClear @change="itemSelectChange(record.id, $event)" :defaultValue="record.rangeId">
          <a-select-option  v-for="(irn) in record.space" :key="irn.value">{{irn.label}}</a-select-option>
        </a-select>
      </template>
      <template slot="itemNum" slot-scope="text, record">
        <a-input style="width:80px;" :disabled='souceFlag' v-if="record.showItemNum == false ? false : true" :defaultValue="text" type="number" :placeholder="record.text" @change="itemNumChange(record.id, $event, record)"  min="0" step="0.01" v-model="record.itemNum" />
        <p v-if="record.showItemNum == false ? true : false">-</p>
      </template>
      <template slot="projectName" slot-scope="text, record">
        <input class="SpliceDom" style="width:100%;" v-model="record.name" :placeholder="record.Nametext" @input="projectNameChange(record, $event)" :disabled="record.adisabled || null || souceFlag" />
      </template>
      <template slot="discounts" slot-scope="text, record">
        <input class="SpliceDom" style="width:100%;" v-model="record.discounts" :placeholder="record.discountText" @input="discountsChange(record, $event)" :disabled="record.adisabled || null || souceFlag" />
      </template>
      <template slot="action" slot-scope="text, record">
        <!-- actionBtnFlag:  是否要禁用启用处于表格action列里面的按钮的disabled属性 -->
        <a-button type="primary" @click="actionThink(record)" :disabled="record.actionBtnFlag || false">{{record.action}}</a-button>
        <!-- 这个是插槽,可以处理某些独立的特殊的list列 -->
        <slot :offer="record" :name="record.id"></slot>
      </template>
      <!-- 套餐报价和清单报价中主材选配、其他的特殊备注 -->
      <template slot="spliceRemark" slot-scope="text, record">
        <slot :myRemark="record" name="remark"></slot>
      </template>
    </a-table>
    <div class="all_numDom" v-if="amountFlag">
      <span>分项合计&nbsp;&nbsp;<a-input size="large" class="holdNumDom" allowClear :disabled="true" v-model="allorMount" />元</span>
    </div>
    <!-- 用来给input设置值的时候，页面不会变化，弄一个影藏的值在这里来更新视图 -->
    <span v-show="false">{{setShowData}}</span>
  </div>
</template>

<script>

export default {
  data () {
    return {
      selectedRowKeys: [],
      loading: false,
      chooseListData: [],
      allorMount: 0,
      setShowData: 0, // 随便设置,组件的坑，用来给input设置值的时候，页面不会变化，弄一个影藏的值在这里来更新视图
    }
  },
  props: {
    // 表格数据
    doubleDate: {
      type: Array,
      default () {
        return []
      }
    },
    // 表头数据和配置
    douColumns: {
      type: Array,
      default () {
        return []
      }
    },
    // 显示表格上方删除按钮
    delbtnText: {
      type: String,
      default () {
        return ''
      }
    },
    // 显示表格上方添加按钮
    addbtnText: {
      type: String,
      default () {
        return ''
      }
    },
    // 显示表格上方文字
    tabTitle: {
      type: String,
      default () {
        return ''
      }
    },
    // 表格是否显示分页
    pagaNumFlag: {
      type: Boolean,
      default: true
    },
    // 表格下方是否显示分项合计
    amountFlag: {
      type: Boolean,
      default: true
    },
    // 是否显示左侧框
    hasCheckFlag: {
      type: Boolean,
      default: true
    },
    // 是否要使用禁用表格check为disable功能, 默认不使用
    hasDisbaleFlag: {
      type: Boolean,
      default: false
    },
    souceFlag: {
      type: Boolean,
      default: false
    },
    // 是否要禁用这个组件右边两个按钮的删除按钮功能，默认启用
    commonDelAbled: {
      type: Boolean,
      default: false
    },
    // 是否要禁用这个组件右边两个按钮的增加按钮功能，默认启用
    commonAddAbled: {
      type: Boolean,
      default: false
    }
  },
  components: {
  },
  created () {
  },
  computed: {
    TableData: {
      get () {
        return this.doubleDate
      },
      set (newPopuerDate) {
        this.$forceUpdate()
      }
    },
    TableHeader: {
      get () {
        return this.douColumns
      },
      set (newPopuerDate) {
        this.$forceUpdate()
      }
    },
    haveCheckDom () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    },
    // class为btn_Dom的元素设置显示影藏
    thisDomNoneFlag() {
      if (this.tabTitle || this.delbtnText || this.addbtnText) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    doubleDate: {
      handler (newVal, val) {
        this.TableData = newVal
      },
      deep: true
    },
    douColumns: {
      handler (newVal, val) {
        this.TableHeader = newVal
      },
      deep: true
    }
  },
  mounted () {
  },
  methods: {
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.chooseListData = selectedRows
    },
    delScience () {
      let filterData = this.TableData.filter(item => !this.chooseListData.some(ele => item.key === ele.key))
      this.$emit('deleteThink', filterData, this.selectedRowKeys)
    },
    addScience () {
      this.$emit('addScience')
    },
    actionThink (data) {
      this.$emit('actionThink', data)
    },
    itemNumChange (data, ev, aobj) {
      this.$emit('numItemChange', data, ev.target.value, aobj, ev)
    },
    itemSelectChange (data, thisId) {
      this.$emit('itemSelectChange', data, thisId)
    },
    projectNameChange (data, ev) {
      this.$emit('projectNameChange', data, ev)
    },
    discountsChange (data, ev) {
      this.$emit('discountsChange', data, ev)
    }
  }
}
</script>

<style lang="scss">
  .commonOfferTable {
    padding: 20px;
    .btn_Dom{
      margin: 0px 0px 15px 0px;
      height: 25px!important;
      text-align: right;
      position: relative;
      .top_text{
        position: absolute;
        left: 0px;
      }
      .del_btn{
        margin-right: 20px;
      }
    }
    .all_numDom{
      margin-top:25px;
    }
    .SpliceDom{
      border: none;
      outline: none;
      line-height: 40px;
      text-align: center;
    }
    .SpliceDom:focus{
      outline: none;
    }
    .SpliceDom::-webkit-input-placeholder{
      color: #DBDBDB;
    }
  }
</style>
