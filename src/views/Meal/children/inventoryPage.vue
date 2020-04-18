<template>
  <div class="inventoryPage">
    <h1>清单式产品详情</h1>
    <div class="content_default">
      <span class="title">产品命名</span>
      <div class="data_box">
        <input type="text" style="width:30%" v-model='allData.name' class='name_put' disabled>
      </div>
    </div>
    <!-- <div class="content_default">
      <span class="title">适用城市公司</span>
      <div class="data_box">
        <a-select placeholder="请选择适用城市公司" disabled style="width: 250px" allowClear v-model="allData.city">
          <a-select-option value="深圳">深圳</a-select-option>
        </a-select>
      </div>
    </div> -->
    <div class="content_default">
      <span class="title">装修类型</span>
      <div class="data_box">
        <a-radio-group v-model="allData.decorateType" disabled>
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
    <a-table :columns="columns" :dataSource="tabData" bordered :pagination="false">
      <template slot="num" slot-scope="text, rond" >
        <a-input v-if="rond.key !== 1" v-model="rond.num" disabled />
        <span v-if="rond.key === 1">{{text}}</span>
      </template>
      <template slot="remark" slot-scope="text, socpe">
        <input type="text" class="remarkInput" v-model="socpe.remark" v-if="socpe.key !== 1" disabled>
        <span v-if="socpe.key === 1">{{text}}</span>
      </template>
    </a-table>
    <div class="inventoryPage_footer">
      <a-button type="primary" @click="areturnPage">返回产品管理页</a-button>
    </div>
  </div>
</template>
<script>

const columns = [
  {
    title: '费用项',
    dataIndex: 'name',
    align: 'center'
  },
  {
    title: '公式',
    dataIndex: 'num',
    align: 'center',
    scopedSlots: { customRender: 'num' }
  },
  {
    title: '备注说明',
    dataIndex: 'remark',
    align: 'center',
    scopedSlots: { customRender: 'remark' }
  }
]
const addInvData = [
  {
    name: '直接工程费(A)',
    num: '默认为所有定额和材料费用的总和',
    key: 1,
    remark: '定额库和材料库中的所有SKU均可选取'
  },
  {
    name: '管理费(B)',
    num: '',
    key: 2,
    remark: ''
  },
  {
    name: '税费(C)',
    num: '',
    key: 3,
    remark: ''
  },
  {
    name: '调整项(D)',
    num: '',
    key: 4,
    remark: '调整项可作为打折促销工具，由管理者设置上限，设计师在谈单报价时手动输入，负数代表优惠。'
  },
  {
    name: '总价(E)',
    num: '',
    key: 5,
    remark: ''
  }
]
export default {
  data () {
    return {
      columns,
      tabData: addInvData,
      allData: {}
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
          this.tabData[1].num = this.allData.productCalculationVo.manageFormula
          this.tabData[1].remark = this.allData.productCalculationVo.manageDescription
          this.tabData[2].num = this.allData.productCalculationVo.rateFormula
          this.tabData[2].remark = this.allData.productCalculationVo.rateDescription
          this.tabData[3].num = this.allData.productCalculationVo.adjustFormula
          this.tabData[3].remark = this.allData.productCalculationVo.adjustDescription
          this.tabData[4].num = this.allData.productCalculationVo.totalFormula
          this.tabData[4].remark = this.allData.productCalculationVo.totalDescription
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
.inventoryPage {
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
}
</style>
