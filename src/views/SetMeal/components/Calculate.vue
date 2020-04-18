<template>
  <div class="calculate">
    <h3>假设直接工程费为A</h3>

    <div class="TableDom">
      <a-form :form="form">
        <table border="1" class="comm tabs mySplice">
          <tr>
            <th>费用项目</th>
            <th>公式</th>
            <th>备注说明</th>
          </tr>
          <tr>
            <th>管理费(B) = </th>
            <td class="spliceTD">
              <a-form-item>
                <a-input v-decorator="myManageFormula.acolumns" :placeholder="`输入公式，类似${myManageFormula.text}，只允许输入大写字符A-H、数字小数、括号、加减乘，请勿输入百分比和等号`"/>
              </a-form-item>
            </td>
            <td class="spliceTD">
              <!-- <a-form-item>
                <a-textarea v-decorator="myManageFormula.remark" maxlength="100" placeholder="请输入备注说明，最多可输入100字符" :autosize="{ minRows: 2, maxRows: 4 }" />
              </a-form-item> -->
              <p>-</p>
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
              <!-- <a-form-item>
                <a-textarea v-decorator="myAdjustFormula.remark" maxlength="100" placeholder="请输入备注说明，最多可输入100字符" :autosize="{ minRows: 2, maxRows: 4 }" />
              </a-form-item> -->
              <p>调整项可作为打折促销工具，由管理者设置上限，设计师在谈单报价时手动输入，负数代表优惠。</p>
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
              <!-- <a-form-item>
                <a-textarea v-decorator="myRateFormula.remark" maxlength="100" placeholder="请输入备注说明，最多可输入100字符" :autosize="{ minRows: 2, maxRows: 4 }" />
              </a-form-item> -->
              <p>-</p>
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
              <!-- <a-form-item>
                <a-textarea v-decorator="myTotalFormula.remark" maxlength="100" placeholder="请输入备注说明，最多可输入100字符" :autosize="{ minRows: 2, maxRows: 4 }" />
              </a-form-item> -->
              <p>-</p>
            </td>
          </tr>
        </table>
      </a-form>
    </div>

    <div class="calculate_footer">
      <a-button type="primary" @click="stepBack" style="margin-right: 10px;">上一步</a-button>
      <a-button type="primary" @click="nextThink">下一步</a-button>
    </div>
  </div>
</template>
<script>
import { myManageFormula, myRateFormula, myAdjustFormula, myTotalFormula } from '@/common/validate'

export default {
  props: {
    productItemId: {
      type: Number
    }
  },
  data () {
    return {
      saveProductCalculationId: '', // 返回第三步计算公私的id，从第四步回到第三步使用更新接口
      dataArr: '',
      myManageFormula: {
        acolumns: myManageFormula,
        text: 'A*0.01',
        remark: [ 'myManageRemark' ]
      },
      thName: '调整项(D)<',
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
    stepBack () {
      this.$emit('goBackTwo', this.dataArr)
    },
    // 下一步事件
    nextThink () {
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.dataArr = values
          let sendObj = {
            id: this.productItemId,
            productCalculationVo: {}
          }
          sendObj.productCalculationVo.manageFormula = values.myManageFormula
          sendObj.productCalculationVo.rateFormula = values.myRateFormula
          sendObj.productCalculationVo.adjustFormula = values.myAdjustFormula
          sendObj.productCalculationVo.totalFormula = values.myTotalFormula
          if (values.myManageRemark) sendObj.productCalculationVo.manageDescription = values.myManageRemark
          if (values.myRateRemark) sendObj.productCalculationVo.rateDescription = values.myRateRemark
          if (values.myAdjustRemark) sendObj.productCalculationVo.adjustDescription = values.myAdjustRemark
          if (values.myTotalRemark) sendObj.productCalculationVo.totalDescription = values.myTotalRemark
          let baseUrl = ''
          if (this.saveProductCalculationId == '') {
            baseUrl = '/product/insertProductCalculation'
          } else {
            baseUrl = '/product/updateProductCalculation'
            sendObj.productCalculationVo.id = this.saveProductCalculationId
          }
          this.$request.post(baseUrl, sendObj).then(response => {
            if (response.code == 0) {
              this.$message.success('保存成功!')
              if (this.saveProductCalculationId == '') {
                this.saveProductCalculationId = response.result
              }
              this.$emit('goStepFrou', values)
            } else {
              this.$message.error(response.message)
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
.calculate {
  margin-top: 30px;
  &_footer {
    display: flex;
    justify-content: center;
    margin-top: 30px;
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
          width: 30%;
          background: #FAFAFA;
          border: 1px solid #E8E8E8;
        }
        td {
          width: 70%;
          border: 1px solid #E8E8E8;
        }
      }
    }
    .comm.tabs {
      th {
        width: 20%;
      }
      td {
        width: 45%;
      }
    }
    .mySplice{
      th {
        // width: 17%!important;
      }
    }
  }
  .spliceTD{
    padding: 20px 10px 0px 10px!important;
  }
}
</style>
