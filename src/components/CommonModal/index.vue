<!---->
<template>
  <div class="CommonModal">
    <a-modal
      :title="textMapTitle"
      :visible="visible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
      :maskClosable='false'
      :width="dialogWidth">
      <a-form :form="form">
        <a-row :gutter="24">
          <a-col v-for="(aItem, index) in popuerData" :key="index" :span="aItem.spanNumber">
            <!-- 普通的文本输入框 -->
            <a-form-item v-bind="formItemLayout" :label="aItem.label" v-if="aItem.type == 'text'">
              <a-input v-decorator="aItem.column" :placeholder="aItem.placeholder" :disabled="aItem.disabled" maxlength="50" />
            </a-form-item>
            <!-- 普通的数字类型输入框 -->
            <a-form-item v-bind="formItemLayout" :label="aItem.label" v-if="aItem.type == 'number'">
              <a-input-number v-decorator="aItem.column" :placeholder="aItem.placeholder" :disabled="aItem.disabled" :min="aItem.min" :max="aItem.max" style="width: 100%" />
            </a-form-item>
            <!-- 普通的文本域 -->
            <a-form-item class="textareaDom" :label="aItem.label" v-if="aItem.type == 'textarea'">
              <a-textarea v-decorator="aItem.column" :placeholder="aItem.placeholder || '最长可以支持100字符'" :disabled="aItem.disabled" maxlength="100" />
            </a-form-item>
            <!-- 普通的下拉框选择单选框 -->
            <a-form-item v-bind="formItemLayout" :label="aItem.label" v-if="aItem.type == 'select'">
              <a-select v-decorator="aItem.column" allowClear :disabled="aItem.disabled" @change="selectChange">
                <a-select-option v-for="(irn) in aItem.options" :key="irn.value">{{irn.label}}</a-select-option>
              </a-select>
            </a-form-item>
            <!-- 下拉框选择单个,加上模糊搜索 -->
            <a-form-item v-bind="formItemLayout" :label="aItem.label" v-if="aItem.type == 'vagueSelect'">
              <a-select v-decorator="aItem.column" :showSearch="true" allowClear :placeholder="aItem.placeholder" @change="vagueChange" style="width: 100%" :disabled="aItem.disabled">
                <a-select-option v-for="(opt) in aItem.options" :key="opt.value" :value="opt.value">
                  {{opt.label}}
                </a-select-option>
              </a-select>
            </a-form-item>
            <!-- 下拉框选择多个，加上模糊搜索 -->
            <a-form-item v-bind="formItemLayout" :label="aItem.label" v-if="aItem.type == 'moreSelect'">
              <a-select v-decorator="aItem.column" allowClear mode="multiple" :placeholder="aItem.placeholder"  @change="multipleChange" style="width: 100%" :disabled="aItem.disabled">
                <a-select-option v-for="(ref) in aItem.options" :key="ref.value" :value="ref.value" >
                  {{ref.label}}
                </a-select-option>
              </a-select>
            </a-form-item>
            <!-- 单选按钮框 -->
            <a-form-item v-bind="formItemLayout" v-if="aItem.type == 'radio'">
              <a-radio-group name="radioGroup" v-decorator="aItem.column">
                <a-radio v-for="(rad) in aItem.options" :key="rad.value" :value="rad.value">{{rad.label}}</a-radio>
              </a-radio-group>
            </a-form-item>
            <!-- 省份城市地区的联动选择 -->
            <a-form-item class="cityAddress" :label="aItem.label" v-if="aItem.type == 'cityAddress'">
              <a-select allowClear style="width: 180px;margin-right: 20px" @change="handleProvinceChange">
                <a-select-option v-for="province in aItem.options.province" :key="province">{{province}}</a-select-option>
              </a-select>
              <a-select allowClear style="width: 180px;margin-right: 20px">
                <a-select-option v-for="city in aItem.options.city" :key="city">{{city}}</a-select-option>
              </a-select>
              <a-select allowClear  style="width: 180px;margin-right: 20px">
                <a-select-option v-for="area in aItem.options.area" :key="area">{{city}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <template slot="footer">
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="commonModalLoading" @click="handleSubmit">
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
      OnlySelecteItem: '',
      ArrSelecteItem: [],
      visible: false,
      confirmLoading: false,
      confirmDirty: false,
      autoCompleteResult: [],
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        }
      }
    }
  },
  props: {
    // 弹框数据
    dialogData: {
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
    // 弹框的宽度
    dialogWidth: {
      type: String,
      default: '75%'
    },
    // 公共弹框中提交按钮的loading，防止连续点击多下连续多次调用接口
    commonModalLoading: {
      type: Boolean,
      default: false
    }
  },
  components: {},
  created () {
  },
  computed: {
    popuerData: {
      get () {
        return this.dialogData // 弹框新增和编辑的对象数据
      },
      set (newPopuerDate) {
        console.log('数据变动', newPopuerDate)
      }
    }
  },
  watch: {
    dialogData: {
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
    // 普通单选框change事件
    selectChange (seledata, value, ev) {
      console.log('单选框', seledata, value, ev)
    },
    multipleChange (ArrSelecteItem, value) {
      this.ArrSelecteItem = ArrSelecteItem
    },
    vagueChange (OnlySelecteItem) {
      this.OnlySelecteItem = OnlySelecteItem
    },
    handleChange (value) {
      console.log(`Selected: ${value}`)
    },
    handleProvinceChange (value) {
      // this.cities = cityData[value]
      // this.secondCity = cityData[value][0]
    },
    handleOk (e) {
      this.confirmLoading = true
      setTimeout(() => {
        this.visible = false
        this.confirmLoading = false
      }, 2000)
    },
    handleCancel (e) {
      this.visible = false
      this.mySubmitLoading = false
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.$emit('submitThink', values)
        }
      })
    },
    clearThink () {
      this.form.resetFields()
    }
  }
}
</script>

<style lang="scss">
  .cityAddress{
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
