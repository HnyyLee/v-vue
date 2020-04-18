<template>
  <div class="bias_meal_box">
    <h3>创建产品</h3>
    <div class="content_default">
      <span class="title">产品命名</span>
      <div class="data_box">
        <input type="text" style="width:30%" v-model='productName' class='name_put' @blur="productViold" maxlength="50">
        <p class="vilodproduct" v-if="vilodproduct">请输入产品名称</p>
      </div>
    </div>
    <!-- <div class="content_default">
      <span class="title">适用城市公司</span>
      <div class="data_box">
        <a-select placeholder="请选择适用城市公司"  style="width: 250px" allowClear @change="cityChange" v-model="chooseCity">
          <a-select-option value="深圳">深圳</a-select-option>
        </a-select>
      </div>
    </div> -->
    <div class="content_default">
      <span class="title">装修类型</span>
      <div class="data_box">
        <a-radio-group @change="decorMethodChang" v-model="mealType">
          <a-radio :value="1">局装</a-radio>
          <a-radio :value="2">整装</a-radio>
        </a-radio-group>
      </div>
    </div>
    <div class="content_default" style="border-bottom: 1px solid #e1e1e1; margin-bottom: 50px;">
      <span class="title">分期设置</span>
      <div class="data_box">
        <div class="data_box_content">
          <div class="sm_table">
            <div>
              <span class="aging_title">一期款比例(%)</span>
                <span>
                  <a-input-number :min="0" :max="100" style="width: 140px;" v-model="firstNumber" @change="myIputFnTest(1, $event)" @blur="stagesBlurThink"/>
                </span>
            </div>
            <div>
              <span class="aging_title">二期款比例(%)</span>
              <span>
                <a-input-number :min="0" :max="100" style="width: 140px;" v-model="sendonNumber" @change="myIputFnTest(2, $event)" @blur="stagesBlurThink"/>
              </span>
            </div>
            <div>
              <span class="aging_title">三期款比例(%)</span>
              <span>
                <a-input-number :min="0" :max="100" style="width: 140px;" v-model="threeNumber" @change="myIputFnTest(3, $event)" @blur="stagesBlurThink"/>
              </span>
            </div>
          </div>
          <p class="titText" v-if="showTitText">{{titText}}</p>
        </div>
      </div>
    </div>

    <div class="TableDom">
      <a-form :form="form">
        <table border="1" class="comm tabs mySplice">
          <tr>
            <th>费用项目</th>
            <th style="width: 45%">公式</th>
            <th>备注说明</th>
          </tr>
          <tr>
            <th>直接工程费(A)</th>
            <td>默认为所有定额和材料费用的总和</td>
            <td>定额库和材料库中的所有SKU均可选取</td>
          </tr>
          <tr>
            <th>管理费(B) = </th>
            <td class="spliceTD">
              <a-form-item>
                <a-input v-decorator="myManageFormula.acolumns" :placeholder="`输入公式，类似${myManageFormula.text}，只允许输入大写字符A-H、数字小数、括号、加减乘，请勿输入百分比和等号`"/>
              </a-form-item>
            </td>
            <td class="spliceTD">
              <a-form-item>
                <a-textarea v-decorator="myManageFormula.remark" placeholder="请输入备注说明" :autosize="{ minRows: 1, maxRows: 1 }" />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <th>{{thName}} </th>
            <td class="spliceTD">
              <a-form-item>
                <a-input v-decorator="myAdjustFormula.acolumns" :placeholder="`输入公式，类似${myAdjustFormula.text}，只允许输入大写字符A-H、数字小数、括号、加减乘，请勿输入百分比和等号`"/>
              </a-form-item>
            </td>
            <td class="spliceTD">
              <a-form-item>
                <a-textarea v-decorator="myAdjustFormula.remark" placeholder="请输入备注说明" :autosize="{ minRows: 1, maxRows: 1 }" />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <th>税费(C) = </th>
            <td class="spliceTD">
              <a-form-item>
                <a-input v-decorator="myRateFormula.acolumns" :placeholder="`输入公式，类似${myRateFormula.text}，只允许输入大写字符A-H、数字小数、括号、加减乘，请勿输入百分比和等号`"/>
              </a-form-item>
            </td>
            <td class="spliceTD">
              <a-form-item>
                <a-textarea v-decorator="myRateFormula.remark" placeholder="请输入备注说明" :autosize="{ minRows: 1, maxRows: 1 }" />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <th>总价(E) = </th>
            <td class="spliceTD">
              <a-form-item>
                <a-input v-decorator="myTotalFormula.acolumns" :placeholder="`输入公式，类似${myTotalFormula.text}，只允许输入大写字符A-H、数字小数、括号、加减乘，请勿输入百分比和等号`"/>
              </a-form-item>
            </td>
            <td class="spliceTD">
              <a-form-item>
                <a-textarea v-decorator="myTotalFormula.remark" placeholder="请输入备注说明" :autosize="{ minRows: 1, maxRows: 1 }" />
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>
    </div>

    <div class="bias_meal_box_footer">
      <a-button @click="stepBack" style="margin-right: 10px;">返回列表</a-button>
      <a-button type="primary" @click="submitThink">提交</a-button>
    </div>
  </div>
</template>
<script>
import { myManageFormula, myRateFormula, myAdjustFormula, myTotalFormula } from '@/common/validate'

export default {
  data () {
    return {
      thName: '调整项(D) <',
      productName: '',
      mealType: 1,
      vilodproduct: false,
      chooseCity: '深圳',
      firstNumber: '',
      sendonNumber: '',
      threeNumber: '',
      showTitText: false,
      titText: '',
      myManageFormula: {
        acolumns: myManageFormula,
        text: 'A*0.01',
        remark: [ 'myManageRemark' ]
      },
      myRateFormula: {
        acolumns: myRateFormula,
        text: '(A+B+D)*0.0338',
        remark: [ 'myRateRemark' ]
      },
      myAdjustFormula: {
        acolumns: myAdjustFormula,
        text: '(A+B)*0.1',
        remark: [ 'myAdjustRemark' ]
      },
      myTotalFormula: {
        acolumns: myTotalFormula,
        text: 'A+B+C+D',
        remark: [ 'myTotalRemark' ]
      }
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  methods: {
    // 校验产品名称是否为空
    productViold () {
      if (this.productName == '') {
        this.vilodproduct = true
      } else {
        this.vilodproduct = false
      }
    },
    // 装修方式更改事件
    decorMethodChang (ev) {
      this.mealType = ev.target.value
    },
    // 选择适用城市公司下拉框更改事件
    cityChange () {
    },
    // 填写分期设置每期的比例失去焦点事件
    stagesBlurThink (ev) {
      var allNum = Number(this.firstNumber) + Number(this.sendonNumber) + Number(this.threeNumber)
      if (this.firstNumber === '' || this.firstNumber == undefined) {
        this.showTitText = true
        this.titText = '一期款的比例不能为空'
      } else if (this.sendonNumber === '' || this.sendonNumber == undefined) {
        this.showTitText = true
        this.titText = '二期款的比例不能为空'
      } else if (this.threeNumber === '' || this.threeNumber == undefined) {
        this.showTitText = true
        this.titText = '三期款的比例不能为空'
      } else if (allNum !== 100) {
        this.showTitText = true
        this.titText = '三期比例总和必须为100%,请重新设置'
      } else {
        this.showTitText = false
      }
    },
    stepBack () {
      this.$router.push('/meal')
    },
    // 点击提交事件
    submitThink () {
      var that = this
      this.productViold()
      this.stagesBlurThink()
      if (this.showTitText || this.productName == '') return
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          var asObj = {}
          asObj.manageFormula = values.myManageFormula
          asObj.rateFormula = values.myRateFormula
          asObj.adjustFormula = values.myAdjustFormula
          asObj.totalFormula = values.myTotalFormula
          if (values.myManageRemark) asObj.manageDescription = values.myManageRemark
          if (values.myRateRemark) asObj.rateDescription = values.myRateRemark
          if (values.myAdjustRemark) asObj.adjustDescription = values.myAdjustRemark
          if (values.myTotalRemark) asObj.totalDescription = values.myTotalRemark
          let sendObj = {
            name: this.productName,
            city: this.chooseCity,
            type: this.$route.query.num,
            decorateType: this.mealType,
            rangeStr: '',
            paymentMethod: 2,
            firstPayment: this.firstNumber,
            secondPayment: this.sendonNumber,
            threePayment: this.threeNumber,
            productCalculationVo: asObj
          }
          this.$request.post('/product/insertProduct', sendObj).then(response => {
            if (response.code == 0) {
              this.$success({
                title: '创建清单式产品成功',
                content: (
                  <div>
                    <p>点击确定之后将返回产品列表页面</p>
                  </div>
                ),
                okText: '确定',
                onOk: function () {
                  that.$router.push('/meal')
                }
              })
            } else {
              this.$message.error(response.message)
            }
          })
        }
      })
    },
    // 验证小数点
    myIputFnTest (num, data) {
      if (data) {
        if (num == 1) {
          this.firstNumber = String(data).replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
        } else if (num == 2) {
          this.sendonNumber = String(data).replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
        } else if (num == 3) {
          this.threeNumber = String(data).replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
        }
      }
    }
  }
}
</script>
<style lang="scss">
.bias_meal_box {
  padding: 10px;
  .content_default {
    display: flex;
    .title {
      display: flex;
      min-width: 200px;
      min-height: 40px;
      justify-content: center;
      align-items: center;
      background-color: #e1e1e1;
      border: 1px solid #CCC;
      border-bottom: none;
    }
    .default_two_title {
      flex-flow: column;
    }
    .data_box {
      display: flex;
      width: 100%;
      align-items: center;
      border: 1px solid #e1e1e1;
      border-left: none;
      border-bottom: none;
      padding-left: 10px;
      .vilodproduct{
        margin: 0px;
        color: #FF363B;
        font-size: 11px;
      }
      .name_put {
        border: none;
        outline: none;
      }
      .data_box_content {
        position: relative;
        .sm_table{
          display: flex;
          .name_put{
            text-align: center;
          }
          // 新增的组件数字框
          .ant-input-number{
            padding: 0px!important;
            .ant-input-number-handler-wrap{
              padding: 0px;
            }
            .ant-input-number-input-wrap{
              padding: 0px;
            }
          }
          .ant-input-number-input{
            text-align: center;
          }
        }
        .titText{
          position: absolute;
          bottom: 0px;
          margin: 0px;
          font-size: 11px;
          color: #FF363B;
        }
        div {
          padding: 10px 0;
          span {
            display: block;
            border: 1px solid #e1e1e1;
            padding: 5px;
          }
          .aging_title {
            text-align: center;
            line-height: 24px;
            border-bottom: none;
          }
        }
      }
    }
    .data_box2 {
      justify-content: space-between;
      padding: 0 10px;
    }
  }
  &_footer {
    display: flex;
    justify-content: center;
    margin-top:30px;
  }
  .remarkInput{
    border: none;
    width: 100%;
    outline: 0;
    caret-color: orange;
    line-height: 40px;
  }
  .TableDom{
    margin: 30px 0px;
    .comm {
      margin: 0 auto;
      width: 100%;
      tr {
        th,
        td {
          text-align: center;
          padding: 20px 10px;
        }
        th {
          // width: 30%;
          background: #FAFAFA;
          border: 1px solid #E8E8E8;
        }
        td {
          // width: 70%;
          border: 1px solid #E8E8E8;
        }
      }
    }
    .comm.tabs {
      th {
        // width: 20%;
      }
      td {
        // width: 45%;
      }
    }
    .mySplice{
      th {
        // width: 17%!important;
      }
    }
    .spliceTD{
      padding: 20px 10px 0px 10px!important;
    }
  }
}
</style>
