<template>
  <div class="customPage">
    <h1>自定义产品详情</h1>
    <div class="content_default">
      <span class="title">产品命名</span>
      <div class="data_box">
        <input type="text" style="width:30%" v-model='allData.name' class='name_put' disabled>
      </div>
    </div>
    <div class="content_default">
      <span class="title">适用城市公司</span>
      <div class="data_box">
        <a-select placeholder="请选择适用城市公司" style="width: 250px" allowClear v-model="allData.city" disabled>
          <a-select-option value="深圳">深圳</a-select-option>
        </a-select>
      </div>
    </div>
    <div class="content_default">
      <span class="title">装修类型</span>
      <div class="data_box">
        <a-radio-group  v-model="allData.decorateType" disabled>
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
          <span>主材料费</span>
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
        </div>
        <div class="item_box item_box_two">
          <span>订单合计：</span>
          <a-input placeholder="=A+E+F+G+H" v-model="allAmount" disabled /> 元
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
                  <input type="number" class="name_put" v-model="allData.firstPayment" disabled>
                </span>
            </div>
            <div>
              <span class="aging_title">二期款比例(%)</span>
              <span>
                <input type="number" class="name_put" v-model="allData.secondPayment" disabled>
              </span>
            </div>
            <div>
              <span class="aging_title">三期款比例(%)</span>
              <span>
                <input type="number" class="name_put" v-model="allData.threePayment" disabled>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="customPage_footer">
      <a-button type="primary" @click="areturnPage">返回产品管理页</a-button>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      allData: {},
      allAmount: ''
    }
  },
  created () {
    this.showPageFn()
  },
  methods: {
    // 刷新页面接口（获取清单式产品详情）
    showPageFn () {
      let adata = {
        id: this.$route.query.detail
      }
      this.$request.post('/product/queryProductById', adata).then(response => {
        if (response.code == 0) {
          this.allData = response.result
          this.allAmount = response.result.productCalculationVo.totalFormula
        }
      })
    },
    areturnPage () {
      this.$router.push('/meal')
    }
  }
}
</script>
<style lang="scss">
.customPage {
  padding: 10px;
  h1{
    text-align: center;
  }
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
