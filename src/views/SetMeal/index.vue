<template>
  <div class="meal_wrap">
    <h3>创建产品</h3>
    <div>
      <a-steps :current='stepNum'>
        <a-step title="基础设置"></a-step>
        <a-step title="主材标配"></a-step>
        <a-step title="主材折减"></a-step>
        <a-step title="计算公式"></a-step>
        <a-step title="完成"></a-step>
      </a-steps>
    </div>
    <basi-meal v-show="stepNum === 0" :oneValue='oneObj' @getStepOneDate="getStepOneDate"></basi-meal>
    <material-selection ref="materialRefDom" :twoValue='twoObj' :productItemId="resultId" @goBackOne="goBackOne"  @goThere="goThere" v-show="stepNum === 1"></material-selection>
    <reduction ref="reductionDom" v-show="stepNum === 2" @goReductionLast="goReductionLast"  @goFour="goFour" ></reduction>
    <calculate :productItemId="resultId" @goBackTwo="goBackTwo" @goStepFrou="goStepFrou" v-show="stepNum === 3"></calculate>
    <accomplish :oldData="secondArr" :theOldData='stepValueOne' :anountData="twoObj" @goBackThree="goBackThree" v-show="stepNum === 4"></accomplish>
  </div>
</template>
<script>
import BasiMeal from '@/views/SetMeal/components/BasiMeal.vue'
import MaterialSelection from '@/views/SetMeal/components/MaterialSelection.vue'
import Reduction from '@/views/SetMeal/components/Reduction.vue'
import Calculate from '@/views/SetMeal/components/Calculate.vue'
import Accomplish from '@/views/SetMeal/components/Accomplish.vue'
import { bus } from '@/main.js'

export default {
  data () {
    return {
      stepNum: 0,
      oneObj: {},
      twoObj: [],
      secondArr: [],
      frouObj: {},
      resultId: 0, // 第一步成功之后返回这个id，这个id将带入下一步,也会带入到后面
      stepValueOne: {}, // setp1的数据
      stepValueTwo: '', // setp2的数据
      threeStepData: '', // 第三步的数据
      stepValueThe: '', // setp3的数据
      stepValueFour: '', // setp3的数据
      allRangeIdList: [], // 产品系列
    }
  },
  components: {
    BasiMeal,
    MaterialSelection,
    Reduction,
    Calculate,
    Accomplish
  },
  methods: {
    getStepOneDate (data, workSpaceList, resultId, myRangeIdList) { // step1的下一步
      bus.$emit('setResultId', resultId)
      this.stepValueOne = data
      this.twoObj = workSpaceList
      this.resultId = resultId
      this.stepNum = this.stepNum + 1
      this.allRangeIdList = myRangeIdList
      // 获取第二步骤页面顶部下拉框数据
      this.$refs.materialRefDom.categoryTypeFn()
      // 获取第二步骤这个产品系列的数据
      this.$refs.materialRefDom.showQueryDataFn(this.resultId, myRangeIdList)
    },
    goBackOne (v) { // step2的上一步
      this.stepValueTwo = v
      this.stepNum = this.stepNum - 1
    },
    goThere (data) { // step2的下一步
      this.secondArr = data
      this.$refs.reductionDom.showReductionData(this.resultId, this.allRangeIdList)
      // bus.$emit('setReductionFn', this.resultId)
      bus.$emit('setFoucesFn', data)
      this.stepNum = this.stepNum + 1
    },
    goFour (data) {
      this.threeStepData = data
      this.stepNum = this.stepNum + 1
    },
    goReductionLast() { // step3的上一步(新插入的页面)
      this.stepNum = this.stepNum - 1
    },
    goBackTwo (v) { // step4的上一步
      this.stepValueThe = v
      this.stepNum = this.stepNum - 1
    },
    goStepFrou (v) { // // step4的下一步
      this.stepValueThe = v
      this.stepNum = this.stepNum + 1
      bus.$emit('setLastFn')
    },
    goBackThree (v) { // step5的上一步
      this.stepValueFour = v
      this.stepNum = this.stepNum - 1
    }
  }
}
</script>
<style lang="scss">
</style>
