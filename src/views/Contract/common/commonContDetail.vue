<!---->
<template>
  <div class="commonContDetail">

    <a-modal title="合同详情" v-model="detailVisible" width="48%" :footer="null">
      <h3>合同抬头</h3>
      <table border="1" class="comm">
        <tr>
          <th>字段</th>
          <td class="content">内容</td>
          <th>字段</th>
          <td class="content">内容</td>
        </tr>
        <tr>
          <th>合同编号</th>
          <td>
            {{detailData.contractNumber}}
          </td>
          <th>联系电话</th>
          <td>
            {{detailData.customerPhone}}
          </td>
        </tr>
        <tr>
          <th>甲方</th>
          <td>
            {{detailData.customerName}}
          </td>
          <th>房屋地址</th>
          <td>
            {{detailData.houseAddress}}
          </td>
        </tr>
        <tr>
          <th>身份证号码</th>
          <td>
            {{detailData.customerIdCard}}
          </td>
          <th>实测面积</th>
          <td>
            {{detailData.measuredArea}}
          </td>
        </tr>
        <tr>
          <th>合同拟定日期</th>
          <td>
            {{detailData.contractDraftDate}}
          </td>
        </tr>
      </table>

      <h3 style="margin-top: 15px;">工程概况</h3>
      <table border="1" class="comm">
        <tr>
          <th>字段</th>
          <td class="content">内容</td>
          <th>字段</th>
          <td class="content">内容</td>
        </tr>
        <tr>
          <th>施工内容</th>
          <td>
            {{showContFn()}}
          </td>
          <th>乙方收款账户开户名</th>
          <td>{{detailData.partBAccountName}}</td>
        </tr>
        <tr>
          <th>产品系列</th>
          <td>
            <p>{{detailData.perfectProductSeriesName}}</p>
            <p>{{detailData.tryProductSeriesName}}</p>
          </td>
          <th>乙方开户银行</th>
          <td>{{detailData.partBBankName}}</td>
        </tr>
        <tr>
          <th>其他</th>
          <td>
            {{detailData.constructionContentOther}}
          </td>
          <th>乙方银行账号</th>
          <td>{{detailData.partBBankAccountNo}}</td>
        </tr>
        <tr>
          <th>合同工期</th>
          <td>
            {{detailData.contractDuration + '天'}}
          </td>
          <th>首期款</th>
          <td>
            {{detailData.firstPayment}}
          </td>
        </tr>
        <tr>
          <th>打拆交底日期</th>
          <td>
            {{detailData.planOpenAndDisclosureDate}}
          </td>
          <th>二期款</th>
          <td>
            {{detailData.secondPayment}}
          </td>
        </tr>
        <tr>
          <th>打拆完成日期</th>
          <td>
            {{detailData.planOpenAndCompleteDate}}
          </td>
          <th>尾款</th>
          <td>
            {{detailData.thirdPayment}}
          </td>
        </tr>
        <tr>
          <th>开工日期</th>
          <td>
            {{detailData.actualStartDate}}
          </td>
          <th>合同含税价</th>
          <td>
            {{detailData.contractPrice}}
          </td>
        </tr>
        <tr>
          <th>竣工日期</th>
          <td>
            {{detailData.actualEndDate}}
          </td>
        </tr>
        <tr>
          <th>甲方授权代表</th>
          <td>
            {{detailData.partAGrantName}}
          </td>
        </tr>
        <tr>
          <th>联系方式</th>
          <td>
            {{detailData.partAGrantPhone}}
          </td>
        </tr>
      </table>
    </a-modal>

    
  </div>
</template>

<script>

export default {
  data () {
    return {
      detailVisible: false,
    }
  },
  props: {
    detailData: {
      type: Object,
      default () {
        return {}
      }
    },
  },
  components: {
  },
  created () {
  },
  computed: {
    
  },
  watch: {
    
  },
  mounted () {
  },
  methods: {
    showContFn() {
      let numa = this.detailData.bedroomNumber ? this.detailData.bedroomNumber : '0'
      let numb = this.detailData.livingNumber ? this.detailData.livingNumber : '0'
      let numc = this.detailData.kitchenNumber ? this.detailData.kitchenNumber : '0'
      let numd = this.detailData.bathroomNumber ? this.detailData.bathroomNumber : '0'
      let nume = this.detailData.balconyNumber ? this.detailData.balconyNumber : '0'
      return numa + '室' + numb + '厅' + numc + '厨' + numd + '卫' + nume + '阳台'
    }
  }
}
</script>

<style lang="scss">
.commonContDetail{
  h3{
    margin: 0px;
  }
}
.comm {
  margin: 10px auto 0px;
  width: 100%;
  p{
    margin: 0px;
  }
  tr {
    th,
    td {
      text-align: center;
      padding: 12px 10px;
      width: 140px;
    }
    th {
      width: 100px;
      background: #FAFAFA;
      border: 1px solid #E8E8E8;
    }
    td {
      border: 1px solid #E8E8E8;
    }
  }
  .content{
    text-align: center;
    background: #FAFAFA;
  }
}
</style>
