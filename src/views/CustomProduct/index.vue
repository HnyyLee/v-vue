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
    <div class="content_default">
      <span class="title"></span>
      <div class="data_box data_new_style">
        <div class="item_box">
          <span>工程直接费A</span>
          <span class="item_box_put item_box_put_two"></span>
        </div>
        <div class="item_box">
          <span>主材料费B</span>
          <span class="item_box_put item_box_put_two"></span>
        </div>
        <div class="item_box">
          <span>辅材费C</span>
          <span class="item_box_put item_box_put_two"></span>
        </div>
         <div class="item_box">
          <span>人工费D</span>
          <span class="item_box_put item_box_put_two"></span>
        </div>
        <div class="item_box">
          <span>其他E</span>
          <span class="item_box_put item_box_put_two"></span>
        </div>
        <div class="item_box">
          <span>税费F</span>
          <span class="item_box_put item_box_put_two"></span>元
        </div>
        <div class="item_box">
          <span>管理费G</span>
          <span class="item_box_put item_box_put_two"></span>元
        </div>
        <div class="item_box">
          <span>金额H</span>
          <span class="item_box_put item_box_put_two"></span>元(优惠请使用负数代替)
        </div>
        <!-- <div class="item_box">
          <span>税点F</span>
          <span class="item_box_put">%</span>税费
          <span class="item_box_put"></span>元
        </div>
        <div class="item_box">
          <span>管理费点G</span>
          <span class="item_box_put">%</span>管理费
          <span class="item_box_put"></span> 元
        </div>
        <div class="item_box">
          <span>折扣H</span>
          <span class="item_box_put"></span>金额
          <span class="item_box_put"></span> 元(优惠请使用负数代替)
        </div> -->
        <div class="item_box item_box_two">
          <span>订单合计=</span>
          <a-input placeholder="A+F+G+H" v-model="allAmount" disabled /> 元
        </div>
      </div>
    </div>
    <div class="content_default" style="border-bottom: 1px solid #e1e1e1; margin-bottom: 50px;">
      <span class="title">是否分期</span>
      <div class="data_box">
        <div class="data_box_content">
          <div class="sm_table">
            <div>
              <span class="aging_title">一期款比例(%)</span>
                <span>
                  <a-input-number :min="0" :max="100" style="width: 140px;" v-model="firstNumber" @change="myIputFnTest(1, $event)" @blur="stagesBlurThink"/>
                  <!-- <input type="number" class="name_put" v-model="firstNumber" @blur="stagesBlurThink"> -->
                </span>
            </div>
            <div>
              <span class="aging_title">二期款比例(%)</span>
              <span>
                <a-input-number :min="0" :max="100" style="width: 140px;" v-model="sendonNumber" @change="myIputFnTest(2, $event)" @blur="stagesBlurThink"/>
                <!-- <input type="number" class="name_put" v-model="sendonNumber" @blur="stagesBlurThink"> -->
              </span>
            </div>
            <div>
              <span class="aging_title">三期款比例(%)</span>
              <span>
                <a-input-number :min="0" :max="100" style="width: 140px;" v-model="threeNumber" @change="myIputFnTest(3, $event)" @blur="stagesBlurThink"/>
                <!-- <input type="number" class="name_put" v-model="threeNumber" @blur="stagesBlurThink"> -->
              </span>
            </div>
          </div>
          <p class="titText" v-if="showTitText">{{titText}}</p>
        </div>
      </div>
    </div>
    <div class="bias_meal_box_footer">
      <a-button @click="stepBack" style="margin-right: 10px;">返回列表</a-button>
      <a-button type="primary" @click="submintThink">提交</a-button>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      productName: '',
      vilodproduct: false,
      mealType: 1,
      chooseCity: '深圳',
      allAmount: 'A+F+G+H',
      firstNumber: '',
      sendonNumber: '',
      threeNumber: '',
      showTitText: false,
      titText: ''
    }
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
      console.log(22, ev, ev.target.value)
      this.mealType = ev.target.value
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
    // 选择适用城市公司下拉框更改事件
    cityChange () {
      console.log('aaa')
    },
    stepBack () {
      this.$router.push('/meal')
    },
    submintThink () {
      var that = this
      this.productViold()
      this.stagesBlurThink()
      if (!this.productName || this.showTitText) return
      if (this.allAmount !== '') {
        var asObj = {}
        asObj.totalFormula = this.allAmount
        asObj.manageFormula = ''
        asObj.rateFormula = ''
        asObj.adjustFormula = ''
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
              title: '创建自定义产品成功',
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
      } else {
        this.$message.info('必须键入订单合计!')
      }
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
        }
        // 新增的组件数字框
        .ant-input-number{
          padding: 0px!important;
          .ant-input-number-handler-wrap{
            padding: 0px;
          }
        }
        .ant-input-number-input-wrap{
          padding: 0px!important;
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
    .data_new_style {
      flex-flow: column;
      padding: 10px;
      .item_box {
        display: flex;
        align-items: center;
        width: 600px;
        span {
          padding: 5px;
          text-align: right;
          width: 100px;
          margin: 0 5px;
        }
        &_put {
          border: 1px solid #e1e1e1;
          height: 28px;
          background-color: rgba($color: #000, $alpha: 0.1)
        }
        .item_box_put_two {
          width: 300px;
        }
      }
      .item_box_two {
        width: 800px;
        background-color: rgba($color: #ccc, $alpha: 0.3);
        padding: 20px;
        margin-top: 20px;
      }
    }
  }
  &_footer {
    display: flex;
    justify-content: center;
    margin-top:30px;
  }
}
</style>
