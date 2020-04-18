<!---->
<template>
  <div class="commonPoplur">
    <a-modal
      :title="textMapTitle"
      :visible="visible"
      :maskClosable='false'
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
      width="70%">
      <!-- 搜索栏目 -->
      <div class="search_Dom" v-if="searchData.flag">
        <a-form :form="form" class="searchForm">
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-item v-bind="formItemLayout" label="筛选">
                <a-select v-decorator="searchData.optionData.column" allowClear class="select_Dom" placeholder="请选择要筛选项">
                  <a-select-option v-for="opt in searchData.optionData.data" :key="opt.value">{{opt.tabel}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item v-bind="formItemLayout" label="搜索">
                <a-input allowClear v-decorator="searchData.inputData.column" @pressEnter="topSearchThink" :placeholder="searchData.inputData.placeholder || '请输入物料编码或名称'" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <!-- 按钮 -->
              <a-form-item>
                <a-button type="primary" class="tempBtnDom" @click="topSearchThink">搜索</a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div class="tab_Dom">
        <a-table bordered :rowSelection="rowSelection" :columns="popuerColumns" :dataSource="popuerData" :pagination="true" :locale="{emptyText: '暂无数据'}" >
          <!-- 公共弹框中table中特殊列，使用插槽来解决 -->
          <template slot="spliceCommon" slot-scope="text, record">
            <slot :myCommon="record" name="common"></slot>
          </template>
        </a-table>
      </div>
      <template slot="footer">
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleSubmit">
          提交
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>

export default {
  data () {
    return {
      visible: false,
      confirmLoading: false,
      loading: false, // 加载
      selectedRowKeys: [],
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        }
      },
      chooseHoldData: [] // 左侧选中的所有数据
    }
  },
  props: {
    // 弹框表格数据
    dialogData: {
      type: Array,
      default () {
        return []
      }
    },
    // 弹框表头的数据
    dialogColums: {
      type: Array,
      default () {
        return []
      }
    },
    // 弹框的标题
    textMapTitle: {
      type: String,
      default: '弹框'
    },
    // 是否展示搜索
    searchData: {
      type: Object,
      default () {
        return {}
      }
    },
    // 左侧的选择框，是否单选或者多选
    rowType: {
      type: Number,
      default: 0
    }
  },
  components: {},
  created () {
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  computed: {
    popuerData: {
      get () {
        return this.dialogData // 弹框新增和编辑的对象数据
      },
      set (newPopuerDate) {}
    },
    // 弹框表头的数据
    popuerColumns: {
      get () {
        return this.dialogColums // 弹框新增和编辑的对象数据
      },
      set (newPopuerDate) {}
    },
    // 左侧的选择框，是否单选或者多选
    leftRowType: {
      get () {
        let str = ''
        this.rowType ? str = 'checkbox' : str = 'radio'
        return str // 弹框新增和编辑的对象数据
      }
    },
    rowSelection () {
      var that = this
      return {
        selectedRowKeys: this.selectedRowKeys,
        type: this.leftRowType,
        onChange: (selectedRowKeys, selectedRows) => {
          that.selectedRowKeys = selectedRowKeys
        },
        onSelect: (record, selected, selectedRows, nativeEvent) => {
          if (this.rowType == 0) that.chooseHoldData = []
          if (selected) {
            // that.chooseHoldData.push(record)
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
              // that.chooseHoldData.push(iden)
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
  watch: {
    dialogData: {
      handler (newVal, val) {
        this.popuerData = newVal
      },
      deep: true
    },
    dialogColums: {
      handler (newVal, val) {
        this.popuerColumns = newVal
      },
      deep: true
    }
  },
  mounted () {

  },
  methods: {
    handleOk (e) {
      this.confirmLoading = true
      setTimeout(() => {
        this.visible = false
        this.confirmLoading = false
      }, 2000)
    },
    handleCancel (e) {
      this.visible = false
      this.$emit('cannalThink', this.chooseHoldData)
    },
    handleSubmit (e) {
      e.preventDefault()
      this.$emit('sumbitPoplur', this.chooseHoldData)
    },
    topSearchThink () {
      this.form.validateFieldsAndScroll((err, values) => {
        this.$emit('topSearchThink', values)
      })
    },
    clearThink () {
      this.form.resetFields()
    }
  }
}
</script>

<style lang="scss">
  .commonPoplur{
    .ant-form-item-label{
      float: left;
      width: 135px;
    }
  }
  .textareaDom{
    display: flex;
    .ant-form-item-label{
      width: 135px;
    }
    .ant-form-item-control{
      width: 38vw;
    }
  }
</style>
