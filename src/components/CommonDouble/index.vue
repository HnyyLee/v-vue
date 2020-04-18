<!---->
<template>
  <div class="CommonDouble">
    <div class="top">
      <span class="title">{{textMapTitle}}</span>
      <a-button v-if="showBtnFlag" class="editBtnDom" type="primary" @click="editThink">{{topBtnText}}</a-button>
    </div>
    <div class="table_Dom">
        <a-table size="small" :showHeader="false" :columns="columns" :dataSource="popuerData" bordered :pagination="false" :rowKey="(record, index) => index">
          <template v-for="col in ['rightData']" :slot="col" slot-scope="text, record">
            <a-form :form="form" :key="col" class="commonDoubleForm">
              <!-- {{record}} -->
              <a-input
                v-if="record.editable && record.type === 'input'"
                style="margin: -5px 0"
                :value="record.rightData"
                :placeholder="record.text"
                :disabled='record.disabled'
                @change="e => handleChange(e.target.value, record.key, col, record, text)"/>
              <template v-else>{{record.rightData}}</template>
              <!-- 下面是特殊场景 -->
              <!-- 在右侧栏目中是否显示下拉选择框 -->
              <!-- <a-row type="flex" justify="space-between" v-if="record.editable && record.type === 'select'">
                <a-col span='5'>
                </a-col>
                <a-col span='5'>
                </a-col>
                <a-col span='5'>
                </a-col>
              </a-row> -->
              <a-form-item>
                <a-select v-decorator="record.select.column" allowClear class="selectDom" v-if="record.editable && record.type === 'select'" :placeholder="record.select.text">
                  <a-select-option v-for="sel in record.select.data" :key="sel.value">{{sel.name}}</a-select-option>
                </a-select>
              </a-form-item>
              <!-- 在右侧栏目中是否显示文本区域 -->
              <a-form-item>
                <a-textarea v-decorator="record.textarea.column" v-if="record.textarea" :placeholder="record.textarea.text" class="textareaDom" />
              </a-form-item>
              <!-- 在右侧栏目中是否显示按钮 -->
              <a-form-item>
                <a-button v-if="record.button" size="small" type="primary" class="tempBtnDom" @click="tempBtnThink(record)">{{record.button}}</a-button>
              </a-form-item>
            </a-form>
            <slot :say="record" :name="record.key"></slot>
          </template>
        </a-table>
    </div>
  </div>
</template>

<script>
const columns = [{
  dataIndex: 'leftData',
  align: 'right',
  width: '30%',
  scopedSlots: { customRender: 'leftData' }
}, {
  dataIndex: 'rightData',
  align: 'left',
  width: '70%',
  scopedSlots: { customRender: 'rightData' }
}]

export default {
  data () {
    return {
      columns,
      btnFlag: 0,
      topBtnText: '编辑'
    }
  },
  props: {
    // 数据
    doubleDate: {
      type: Array,
      default () {
        return []
      }
    },
    // 左侧标题
    textMapTitle: {
      type: String,
      default: '标题'
    },
    // 是否显示右侧的按钮
    showBtnFlag: {
      type: Boolean,
      default: true
    }
  },
  components: {
  },
  created () {
  },
  computed: {
    popuerData: {
      get () {
        return this.doubleDate // 弹框新增和编辑的对象数据
      },
      set (newPopuerDate) {
        console.log('数据变动', newPopuerDate)
      }
    }
  },
  watch: {
    doubleDate: {
      handler (newVal, val) {
        this.popuerData = newVal
      },
      deep: true
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  mounted () {
  },
  methods: {
    editThink (event) {
      const newData = [...this.popuerData]
      if (this.btnFlag == 0) {
        this.topBtnText = '保存'
        this.btnFlag = 1
        newData.forEach(item => {
          item.editable = true
        })
        this.popuerData = newData
      } else {
        this.topBtnText = '编辑'
        this.btnFlag = 0
        newData.forEach(item => {
          item.editable = false
        })
        this.$emit('saveEditThink', this.popuerData)
      }
    },
    handleChange (value, key, column, index, text) {
      const newData = [...this.popuerData]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value
        this.popuerData = newData
      }
    },
    tempBtnThink (data) {
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.$emit('btnSendThink', values)
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .CommonDouble {
    padding: 20px;
    .top{
      height: 50px;
    }
    .title{
      margin-top: 20px;
    }
    .editBtnDom{
      float: right;
    }
    .editable-row-operations a {
      margin-right: 8px;
    }
    .tempBtnDom{
      margin: 5px;
    }
    .selectDom{
      width: 200px;
      margin-left: 5px
    }
    .textareaDom{
      margin: 5px;
    }
    .commonDoubleForm{
      .ant-form-item{
        margin: 0px;
      }
    }
  }
</style>
