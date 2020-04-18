<!---->
<template>
  <div class="design_Child">
    <common-header :value='infoValue' />
    <common-double :doubleDate="doubleDate" textMapTitle="客户信息" />
    <common-double :doubleDate="informationDate" textMapTitle="拓展信息(来自物业主数据)" />
    <div class="RemarksDom">
      <span>备注</span>
      <a-textarea :autosize="{ minRows: 4, maxRows: 8 }" @change="remarkThink" />
    </div>
    <div class="TabDom">
      <a-tabs @change="callback" type="card" border>
        <a-tab-pane tab="派单" key="1">
          <a-form :form="formOne">
            <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" class="leftLabelDom" label="派单对象">
              <a-select style="width: 200px" @change="selectChang" v-decorator="['username', {rules: [{ required: true, message: '请选择设计负责人' }]}]" placeholder="请选择设计负责人">
                <a-select-option value="123">Jack</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" class="leftLabelDom" label="备注">
              <a-textarea v-decorator="['areaInput']" :autosize="{ minRows: 4, maxRows: 8 }" />
            </a-form-item>
            <a-form-item :label-col="formTailLayout.labelCol" :wrapper-col="formTailLayout.wrapperCol">
              <a-button type="primary" @click="oneSubmitThink" style="width: 100px" size="large">
                提交
              </a-button>
              <a-button @click="cannalThink" style="margin-left: 25px;width: 100px" size="large">
                取消
              </a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import CommonHeader from '@/components/CommonHeader'
import CommonDouble from '@/components/CommonDouble'
const formItemLayout = {
  labelCol: { span: 1 },
  wrapperCol: { span: 8 }
}
const formTailLayout = {
  labelCol: { span: 12 },
  wrapperCol: { span: 4, offset: 2 }
}
export default {
  data () {
    return {
      doubleDate: [
        { key: 'name', leftData: '客户名称', rightData: `刘德华` },
        { key: 'phone', leftData: '手机号码', rightData: `13686885544` },
        { key: 'address', leftData: '省市区', rightData: `广东省深圳市` },
        { key: 'area', leftData: '小区', rightData: `碧海花园` },
        { key: 'loudong', leftData: '楼栋', rightData: `9栋` },
        { key: 'fanghao', leftData: '房号', rightData: `201` },
        { key: 'origin', leftData: '来源', rightData: `助英台` },
        { key: 'perphon', leftData: '报单人', rightData: `老王` },
        { key: 'zhixinag', leftData: '装修意向', rightData: `厨房装修/卫生间装修` }
      ],
      informationDate: [
        { key: 'car', leftData: '车辆', rightData: `1` },
        { key: 'paer', leftData: '宠物', rightData: `1` },
        { key: 'jiating', leftData: '家庭情况', rightData: `2` },
        { key: 'xingqu', leftData: '个人兴趣', rightData: `2` },
        { key: 'shnegfen', leftData: '特殊身份', rightData: `3` }
      ],
      checkNick: false,
      formItemLayout,
      formTailLayout,
      infoValue: {
        workNumber: 20156899,
        name: '刘德华',
        fitment: '厨房/卫生间'
      },
      formOne: this.$form.createForm(this)
    }
  },
  props: {
  },
  components: {
    CommonDouble,
    CommonHeader
  },
  created () {
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    callback (key) {
    },
    remarkThink (ev) {
    },
    oneSubmitThink (e) {
      e.preventDefault()
      this.formOne.validateFieldsAndScroll((err, values) => {
        if (!err) {
        }
      })
    },
    cannalThink () {
    },
    selectChang (value) {
    },
    onOk (value) {
    }
  }
}
</script>

<style lang="scss">
  .design_Child {
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
    .TabDom{
      padding: 20px;
    }
    .leftLabelDom{
      .ant-form-item-label{
        width: 80px;
      }
    }
    .centerLabelDom{
      .ant-form-item-label{
        width: 120px;
      }
    }
    .RemarksDom{
      padding: 20px;
    }
  }
</style>
