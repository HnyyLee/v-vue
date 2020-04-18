<template>
  <div class="step_four_wrap">
    <h1><a-icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" style="margin-right:20px;" />恭喜您，成功创建套餐包!</h1>
    <div class="step_four_main">
      <table border="1" class="comm">
        <tr>
          <th class="aleft">套餐命名</th>
          <td class="right">{{theOldData.name}}</td>
        </tr>
        <tr>
          <th class="aleft">装修类型</th>
          <td class="right">{{theOldData.decorateType == 1 ? '局装' : '整装'}}</td>
        </tr>
        <tr>
          <th class="aleft">产品系列</th>
          <td class="right">
            <a-tag v-for="(item, index) in anountData" :key="index" style="line-height: 35px;height:35px" color="#2db7f5">{{item.name}}</a-tag>
          </td>
        </tr>
        <tr>
          <th class="aleft">分期比例</th>
          <td class="right">
            <table border="1" class="smallcomm">
              <tr class="smallTr">
                <th class="smallTh">一期款</th>
                <th class="smallTh">二期款</th>
                <th class="smallTh">三期款</th>
              </tr>
              <tr class="smallTr">
                <td class="smallTd">{{theOldData.firstPayment}}</td>
                <td class="smallTd">{{theOldData.secondPayment}}</td>
                <td class="smallTd">{{theOldData.threePayment}}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      <div class="title">套餐计价规则：</div>
      <table border="1" class="comm tabs">
        <tr>
          <th>
            <div>产品系列</div>
            <div>(自动显示上方勾选内容)</div>
          </th>
          <td>计价方式</td>
          <td>规则设置</td>
        </tr>
        <tr v-for="(idom, index) in anountData" :key="index" >
          <th>{{idom.name}}</th>
          <td>{{idom.priceType == 1 ? '一口价' : '按平米计算'}}</td>
          <td>{{anountThink(idom)}}</td>
        </tr>
      </table>
      <div class="title">套餐内标配主材：</div>
      <a-table class="footerTable" :columns="columns" :dataSource="adata" :rowKey="(record,index) => index"  bordered :pagination="true">
      </a-table>

      <div class="jisuanDom">
        <p>字符所表示对应的字段：直接工程费(A)、管理费(B)、税费(C)、调整项(D)、总价(E)</p>
        <table border="1" class="comm tabs mySplice">
          <tr>
            <th>
              <div></div>
            </th>
            <td>计算公式</td>
            <td>备注</td>
          </tr>
          <tr>
            <th>管理费(B):</th>
            <td>{{myManageFormula}}</td>
            <td>{{myManageDescription}}</td>
          </tr>
          <tr>
            <th>调整项(D):</th>
            <td>{{myAdjustFormula}}</td>
            <td>{{myAdjustDescription}}</td>
          </tr>
          <tr>
            <th>税费(C):</th>
            <td>{{myRateFormula}}</td>
            <td>{{myRateDescription}}</td>
          </tr>
          <tr>
            <th>总价(E):</th>
            <td>{{myTotalFormula}}</td>
            <td>{{myTotalDescription}}</td>
          </tr>
        </table>
      </div>

    </div>
    <div class="footer">
      <a-button type="primary" @click="stepBack" style="margin-right: 10px;">上一步</a-button>
      <a-button type="primary" @click="areturnPage">返回产品管理页</a-button>
    </div>
  </div>
</template>

<script>
import { bus } from '@/main.js'
const acolums = [
  {
    title: '序号',
    width: 60,
    dataIndex: 'key'
  },
  {
    title: '物料编码',
    width: 150,
    dataIndex: 'code'
  },
  {
    title: '产品系列（空间）',
    width: 150,
    dataIndex: 'rangeId'
  },
  {
    title: '类别',
    width: 100,
    dataIndex: 'category'
  },
  {
    title: '产品名称',
    width: 150,
    dataIndex: 'name'
  },
  {
    title: '品牌',
    width: 100,
    dataIndex: 'brand'
  },
  {
    title: '型号',
    width: 150,
    dataIndex: 'type'
  },
  {
    title: '规格',
    width: 150,
    dataIndex: 'size'
  },
  {
    title: '单位',
    width: 60,
    dataIndex: 'unit'
  },
  {
    title: '价格',
    width: 150,
    dataIndex: 'price'
  },
  {
    title: '备注',
    width: 150,
    dataIndex: 'note'
  }
]
acolums.forEach(ien => {
  ien.align = 'center'
})
export default {
  props: {
    theOldData: {
      type: Object
    },
    oldData: {
      type: Array
    },
    anountData: {
      type: Array
    }
  },
  data () {
    return {
      columns: acolums,
      adata: [],
      myManageFormula: '',
      myRateFormula: '',
      myAdjustFormula: '',
      myTotalFormula: '',
      saveResultId: '',
      myManageDescription: '',
      myRateDescription: '',
      myAdjustDescription: '',
      myTotalDescription: ''
    }
  },
  created () {
    let that = this
    bus.$on('setFoucesFn', function (data) {
      that.showDataFn(data)
    })
    bus.$on('setLastFn', function (data) {
      that.showGongShiFn()
    })
    bus.$on('setResultId', function (data) {
      that.saveResultId = data
    })
  },
  methods: {
    anountThink (data) {
      if (data.priceType == 1) {
        return `面积${data.oneNum}m²价格${data.twoNum}元; 每超出${data.threeNum}m², 加收${data.fourNum}元`
      } else {
        return `${data.fiveNum}元m², 起步面积${data.sixNum}m²`
      }
    },
    areturnPage () {
      this.$router.push('/meal')
    },
    stepBack () {
      this.$emit('goBackThree', this.adata)
    },
    showGongShiFn () {
      let adata = {
        id: this.saveResultId
      }
      this.$request.post('/product/queryProductById', adata).then(response => {
        if (response.code == 0) {
          if (response.result.productCalculationVo) {
            this.myManageFormula = response.result.productCalculationVo.manageFormula
            this.myRateFormula = response.result.productCalculationVo.rateFormula
            this.myAdjustFormula = response.result.productCalculationVo.adjustFormula
            this.myTotalFormula = response.result.productCalculationVo.totalFormula
            // this.myManageDescription = response.result.productCalculationVo.manageDescription
            this.myManageDescription = '-'
            // this.myRateDescription = response.result.productCalculationVo.rateDescription
            this.myRateDescription = '-'
            // this.myAdjustDescription = response.result.productCalculationVo.adjustDescription
            this.myAdjustDescription = '调整项可作为打折促销工具，由管理者设置上限，设计师在谈单报价时手动输入，负数代表优惠。'
            // this.myTotalDescription = response.result.productCalculationVo.totalDescription
            this.myTotalDescription = '-'
          }
        }
      })
    },
    showDataFn (sdata) {
      let allNewArr = []
      sdata.forEach(pand => {
        pand.contentData.forEach(con => {
          allNewArr.push(con)
        })
      })
      this.adata = allNewArr
      this.adata.forEach(item => {
        this.anountData.forEach(icon => {
          if (item.rangeId == icon.id) {
            item.rangeId = icon.name
          }
        })
      })
    }
  },
  watch: {
    theOldData: {
      handler (newVal, val) {
      },
      deep: true
    },
    oldData: {
      handler (newVal, val) {
        let allNewArr = []
        newVal.forEach(pand => {
          pand.contentData.forEach(con => {
            allNewArr.push(con)
          })
        })
        this.adata = allNewArr
        this.adata.forEach(item => {
          this.anountData.forEach(icon => {
            if (item.rangeId == icon.id) {
              item.rangeId = icon.name
            }
          })
        })
      },
      deep: true
    },
    anountData: {
      handler (newVal, val) {
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
.step_four_wrap {
  h1 {
    margin: 40px 0;
  }
  .tilte {
    font-size: 12px;
  }
  h1 {
    font-size: 30px;
    text-align: center;
  }
  .step_four_main {
    table{
      border: 1px solid #DEDEDE
    }
    .comm {
      margin: 0 auto;
      width: 100%;
      tr {
        th,
        td {
          text-align: center;
          padding: 15px 0;
        }
        th {
          width: 30%;
          background: #C9E8FF;
        }
        td {
          width: 70%;
        }
      }
    }
    .title {
      font-size: 14px;
      padding: 20px 0;
    }
    .comm.tabs {
      th {
        width: 30%;
      }
      td {
        width: 40%;
      }
    }
  }
  .jisuanDom{
    table{
      border: 1px solid #DEDEDE
    }
    .comm {
      margin: 0 auto;
      width: 100%;
      tr {
        th,
        td {
          text-align: center;
          padding: 15px 0;
        }
        th {
          width: 30%;
          background: #C9E8FF;
        }
        td {
          width: 70%;
        }
      }
    }
    .comm.tabs {
      th {
        width: 30%;
      }
      td {
        width: 40%;
      }
    }
    .mySplice{
      th {
        width: 17%!important;
      }
    }
  }
  .footerTable{
    margin: 0px 0px 20px 0px;
  }
  .footer{
    text-align: center;
    margin: 50px 0px 40px 0px;
  }
  .smallcomm {
    margin: 0px auto 0px;
    width: 96%;
    .smallTr {
      height: 42px;
      .smallTh,.smallTd {
        text-align: center;
        padding: 2px 10px;
        width: 140px;
      }
      .smallTh {
        background: #FAFAFA;
        border: 1px solid #E8E8E8;
      }
      .smallTd {
        border: 1px solid #E8E8E8;
      }
    }
  }
}
</style>
