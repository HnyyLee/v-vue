<!---->
<template>
  <div class="commonContrOne">
    <table border="1" class="smallcomm">
      <tr>
        <th>字段</th>
        <td class="content">内容</td>
        <th>字段</th>
        <td class="content">内容</td>
      </tr>
      <tr>
        <th>产品系列</th>
        <td>
          <a-checkbox-group @change="seriesOnChange" style="width: 100%;">
            <a-row :gutter="24" style="width: 100%; margin: 0px;">
              <div>
                <span class="type_text">致善</span>
                <p class="alineOne">
                  <a-col :span="8" v-for="item in seriesListOne" :key="item.produceCode"><a-checkbox :value="item.produceCode">{{item.produceName}}</a-checkbox></a-col>
                </p>
              </div>
              <div>
                <span class="type_text">尽善</span>
                <p class="alineOne">
                  <a-col :span="8" v-for="item in seriesListTwo" :key="item.produceCode"><a-checkbox :value="item.produceCode">{{item.produceName}}</a-checkbox></a-col>
                </p>
              </div>
            </a-row>
          </a-checkbox-group>
        </td>
        <th>乙方收款账户开户名</th>
        <td>{{holdData.partBAccountName}}</td>
      </tr>
      <tr>
        <th>其他</th>
        <td>
          <a-form-item style="margin-bottom: 0;">
            <a-input v-decorator="verify.other" :maxlength="50" />
          </a-form-item>
        </td>
        <th>乙方开户银行</th>
        <td>{{holdData.partBBankName}}</td>
      </tr>
      <tr>
        <th>合同工期</th>
        <td>
          <a-form-item style="margin-bottom: 0;">
            <a-input type="number" v-decorator="verify.duration" placeholder="请输入合同工期!" :maxlength="8" />
          </a-form-item>
        </td>
        <th>乙方银行账号</th>
        <td>{{holdData.partBBankAccountNo}}</td>
      </tr>
      <tr>
        <th>开工日期</th>
        <td>
          <a-form-item style="margin-bottom: 0;" >
            <a-date-picker @change="startTimeFn" v-decorator="verify.commencementDate" :disabledDate="disabledStartDate" />
          </a-form-item>
        </td>
        <th>首期款</th>
        <td>
          {{holdData.pirOne}}
        </td>
      </tr>
      <tr>
        <th>竣工日期</th>
        <td>
          <a-form-item style="margin-bottom: 0;" >
            <a-date-picker @change="endTimeFn" v-decorator="verify.completionDate" :disabledDate="disabledEndDate" />
          </a-form-item>
        </td>
        <th>二期款</th>
        <td>
          {{holdData.pirTwo}}
        </td>
      </tr>
      <tr>
        <th>合同含税价</th>
        <td>
          {{holdData.totalFee}}
        </td>
        <th>尾款</th>
        <td>
          {{holdData.pirThr}}
        </td>
      </tr>
      <tr>
        <th>甲方授权代表</th>
        <td>
          <a-form-item style="margin-bottom: 0;">
            <a-input v-decorator="verify.authorized" :maxlength="20" />
          </a-form-item>
        </td>
      </tr>
      <tr>
        <th>联系方式</th>
        <td>
          <a-form-item style="margin-bottom: 0;">
            <a-input type="number" v-decorator="verify.contact" :maxlength="50" />
          </a-form-item>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>

export default {
  data () {
    return {
      chooesZhishangList: [], // 选择至善系列的数组ID
      chooesZhishangName: [], // 选择至善系列的数组名称
      chooesJinshangList: [], // 选择尽善系列的数组ID
      chooesJinshangName: [], // 选择尽善系列的数组名称
      startTime: '', // 时间
      endTime: '', // 时间
    }
  },
  props: {
    // 表单绑定数据
    verify: {
      type: Object,
      default () {
        return {}
      }
    },
    // 主页所有数据
    holdData: {
      type: Object,
      default () {
        return {}
      }
    },
    // 保存合同范本中所有的系列
    allContrXilieList: {
      type: Array,
      default () {
        return []
      }
    },
    // 产品致善系列的数组
    seriesListOne: {
      type: Array,
      default () {
        return []
      }
    },
    // 产品尽善系列的数组
    seriesListTwo: {
      type: Array,
      default () {
        return []
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
    // 合同信息表格产品系列CheckBox的change事件
    seriesOnChange(checkedValues) {
      let saveArr = []
      this.allContrXilieList.forEach(item => {
        checkedValues.forEach(icon => {
          if (item.produceCode == icon) {
            saveArr.push(item)
          }
        })
      })
      this.chooesZhishangList = []
      this.chooesZhishangName = []
      this.chooesJinshangList = []
      this.chooesJinshangName = []
      saveArr.forEach(save => {
        if (save.produceType == 1) {
          this.chooesZhishangList.push(save.produceCode)
          this.chooesZhishangName.push(save.produceName)
        } else if (save.produceType == 2) {
          this.chooesJinshangList.push(save.produceCode)
          this.chooesJinshangName.push(save.produceName)
        }
      })
      this.$emit('chooesCheckboxDate', this.chooesZhishangList, this.chooesZhishangName, this.chooesJinshangList, this.chooesJinshangName)
    },
    // 开工日期和竣工日期的change事件
    startTimeFn(adata, atime) {
      if (atime) {
        this.startTime = adata
      } else {
        this.startTime = ''
      }
    },
    endTimeFn(adata, atime) {
      if (atime) {
        this.endTime = adata
      } else {
        this.endTime = ''
      }
    },
    // 开工日期和竣工日期的日期组件限制条件
    disabledStartDate (startValue) {
      const endValue = this.endTime;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf();
    },
    disabledEndDate (endValue) {
      const startValue = this.startTime;
      if (!endValue || !startValue) {
        return false;
      }
      return startValue.valueOf() >= endValue.valueOf();
    },
  }
}
</script>

<style lang="scss">

</style>
