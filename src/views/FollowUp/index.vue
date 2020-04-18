<!---->
<template>
  <div class="FollowUp">
    <common-header :value='infoValue'></common-header>
    <div class="stepDom">
      <a-steps :current="currentValue">
        <a-step v-for="item in setpArr" :key="item.id" :title="item.tagName" :description="item.createTimeStr" />
      </a-steps>
    </div>
    <div>客户跟进</div>
    <div class="follow_content">
      <div class="follow_content_item">
        <div class="follow_content_item_left">历史记录</div>
        <div class="follow_content_item_right">
          <div v-for="item in dataList" :key="item.id" class="follow_list_item">
            {{item.updateTimeStr}}&nbsp;&nbsp;&nbsp;&nbsp;{{item.tag}}
            <br/>
            {{item.content}}
          </div>
        </div>
      </div>
      <div class="follow_content_item">
        <div class="follow_content_item_left">发布</div>
        <div class="follow_content_item_right flex_centern">
          <a-form :form="formTab">
            <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
              <a-select placeholder="请选择流程" style="width: 520px" v-decorator="val.setpSchedule" :disabled='orderStatis == 0'>
                <a-select-option v-for="item in setpList" :key="item.cc" :value="item.tag">{{item.tagName}}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
              <a-textarea :disabled='orderStatis == 0' v-decorator="val.stepValue" placeholder="" :autosize="{ minRows: 2, maxRows: 6 }" style="min-width: 520px;" />
            </a-form-item>
          </a-form>
          <a-button type="primary" @click="threeSubmitThink" style="margin-top: 10px;" v-if="(orderStatis != 0) && (RouterNameFlag[mythat.$route.name] || RouterNameFlag['order_followUp_btn'])" size="large">提交</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CommonHeader from '@/components/CommonHeader/index.vue'
import val from './js/index'

import { myPower } from '@/common/utils/power.js'

export default {
  data () {
    return {
      mythat: this,
      infoValue: {
        index: 1
      },
      formItemLayout: {
        labelCol: { span: 1 },
        wrapperCol: { span: 8 }
      },
      formTab: this.$form.createForm(this), // 客户信息表单
      gdId: '', // 工单ID
      setpList: [], // 进度条筛选数据
      setpArr: [], // 头部标签
      currentValue: 0, // 当前进度位置
      dataList: [], // 标签数据
      orderStatis: '' // 工单ID
    }
  },
  components: {
    CommonHeader
  },
  mixins: [myPower],
  created () {
    this.val = val // 变淡校验
    this.gdId = JSON.parse(sessionStorage.getItem('orderValue')) // 获取工单信息
    this.getFollData()
    this.getSetpTime()
    this.getTagList()
    this.getOrderStatus()
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    getTagList () { // 获取跟进标签
      this.$request.post('/projectWorkOrder/getFollowTagList').then(res => {
        if (res.code === 0) {
          this.setpList = res.result
        }
      })
    },
    getOrderStatus () {
      this.$request.get('/projectWorkOrder/getWorkOrderBasicInfoByCode?workOrderNumber=' + this.gdId.code).then(res => {
        if (res.code === 0) {
          this.orderStatis = res.result.status
        }
      })
    },
    threeSubmitThink () { // 提交
      this.formTab.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let obj = {
            id: this.gdId.id, // 工单ID
            tag: values.setpSchedule, // 跟进标签
            remark: values.stepValue // 跟进备注内容
          }
          this.$request.post('/projectWorkOrder/addFollowUp', obj).then(res => {
            if (res.code === 0) {
              this.$message.success('提交成功')
              this.formTab.resetFields()
              this.getFollData()
              this.getSetpTime()
            }
          }).catch(err => {
            console.log(err)
          })
        }
      })
    },
    getSetpTime () { // 标签进度
      this.$request.get('/projectWorkOrder/findMaxTagCreateTimeList?id=' + this.gdId.id).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.setpArr = res.result
          console.log(this.setpArr)
          res.result.forEach((item, index) => {
            if (item.createTimeStr) {
              this.currentValue = index
            }
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getFollData () { // 历史记录
      this.$request.post('/projectWorkOrder/getFollowUpRecords', { id: this.gdId.id }).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.dataList = res.result
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .FollowUp {
    .stepDom{
      margin-top: 40px;
    }
    .follow_content {
      margin-top: 5px;
      border: 1px solid #eee;
      &_item {
        display: flex;
        border-bottom: 1px solid #eee;
        &_left {
          width: 15%;
          box-sizing: border-box;
          padding: 5px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          border-right: 1px solid #eee;
        }
        &_right {
          display: flex;
          flex-flow: column;
          padding: 10px;
          .follow_list_item {
            margin-top: 8px;
            color: #333;
          }
        }
        .flex_centern {
          align-items: center;
        }
      }
    }
  }
</style>
