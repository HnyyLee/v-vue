<template>
  <div class="ReportFormPage">
    
    <div class="topDom">
      <div>
        <span class="top_left">统计周期：</span>
        <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" @change="startTimeFn" v-model="startData" :disabledDate="disabledStartDate" />
        <span style="margin:0px 20px;">至</span>
        <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" @change="endTimeFn" v-model="endData" :disabledDate="disabledEndDate" />

        <!-- <span class="top_right">统计对象：</span>
        <a-select style="width: 220px" v-model="reportaData" @change="onReportChange">
          <a-select-option v-for="item in reportTagList" :key="item.id" :value="item.tag">{{item.reportName}}</a-select-option>
        </a-select> -->
        <a-button type="primary" class="asubmit" @click="searchFn">提交</a-button>
      </div>
    </div>
    <!-- 报表1 -->
    <div class="oneForm">
      <h3>核心关键数据</h3>
      <div class="my_border">
        <div id="oneReportDom" style="width: 100%; height: 400px" v-if="oneLeftNoneFlag"></div>
        <img src="@/common/images/report_noneData.png" alt="" v-if="!oneLeftNoneFlag" class="noneImg">
        <p class="none_text" v-if="!oneLeftNoneFlag">暂无数据</p>
      </div>
    </div>
    <!-- 报表2 -->
    <div class="twoForm">
      <div class="aleft">
        <h3>签单分析</h3>
        <div class="my_border">
          <div id="twoReportDom_left" style="width: 100%; height: 400px" v-if="twoLeftNoneFlag"></div>
          <img src="@/common/images/report_noneData.png" alt="" v-if="!twoLeftNoneFlag" class="noneImg">
          <p class="none_text" v-if="!twoLeftNoneFlag">暂无数据</p>
        </div>
      </div>
      <!-- <div class="aright">
        <h3>市占率分析</h3>
        <div class="showNoneDom">
          <p>暂未实现</p>
        </div>
        <div class="my_border">
          <div id="twoReportDom_right" style="width: 100%; height: 300px"></div>
        </div>
      </div> -->
    </div>
    <!-- 报表3 -->
    <div class="threeForm">
      <h3>效率值：平均跟单天数</h3>
      <div class="threeSelectDom">
        年份：
        <a-select v-model="saveThreeYear" style="width: 120px" @change="threeSelectChange">
          <a-select-option v-for="(item, index) in threeSelectList" :key="index" :value="item.year">{{item.year}}</a-select-option>
        </a-select>
      </div>
      <div class="my_border">
        <div id="threeReportDom" style="width: 100%; height: 400px" v-if="threeNoneFlag"></div>
        <img src="@/common/images/report_noneData.png" alt="" v-if="!threeNoneFlag" class="noneImg">
        <p class="none_text" v-if="!threeNoneFlag">暂无数据</p>
      </div>
    </div>
    <!-- 报表4 -->
    <div class="fourForm">
      <h3>设计师：人均产值</h3>
      <div class="fourPaginationDom">
        <a-pagination showSizeChanger :pageSize.sync="FourPageSize" @change="FourPagechange" @showSizeChange="onFourSizeChange" v-model="FourCurrent" :total="FourTotal" />
      </div>
      <div class="my_border">
        <div id="fourReportDom" style="width: 100%; height: 400px" v-if="fourNoneFlag"></div>
        <img src="@/common/images/report_noneData.png" alt="" v-if="!fourNoneFlag" class="noneImg">
        <p class="none_text" v-if="!fourNoneFlag">暂无数据</p>
      </div>
    </div>
    <!-- 报表5 -->
    <div class="fiveForm">
      <h3>延期<span style="color: #C23531">开</span>工数/延期天数</h3>
      <div class="fiveSelectDom">
        年份：
        <a-select v-model="saveFiveYear" style="width: 120px" @change="fiveSelectChange">
          <a-select-option v-for="(item, index) in fiveSelectList" :key="index" :value="item.year">{{item.year}}</a-select-option>
        </a-select>
      </div>
      <div class="my_border">
        <div id="fiveReportDom" style="width: 100%; height: 400px" v-if="fiveNoneFlag"></div>
        <img src="@/common/images/report_noneData.png" alt="" v-if="!fiveNoneFlag" class="noneImg">
        <p class="none_text" v-if="!fiveNoneFlag">暂无数据</p>
      </div>
    </div>
    <!-- 报表6 -->
    <div class="sixForm">
      <h3>延期<span style="color: #C23531">完</span>工数/延期天数</h3>
      <div class="sixSelectDom">
        年份：
        <a-select v-model="saveSixYear" style="width: 120px" @change="sixSelectChange">
          <a-select-option v-for="(item, index) in sixSelectList" :key="index" :value="item.year">{{item.year}}</a-select-option>
        </a-select>
      </div>
      <div class="my_border">
        <div id="sixReportDom" style="width: 100%; height: 400px" v-if="sixNoneFlag"></div>
        <img src="@/common/images/report_noneData.png" alt="" v-if="!sixNoneFlag" class="noneImg">
        <p class="none_text" v-if="!sixNoneFlag">暂无数据</p>
      </div>
    </div>
    <!-- 报表7 -->
    <div class="sevenForm">
      <h3>延期原因</h3>
      <div class="my_border">
        <div id="sevenReportDom" style="width: 100%; height: 400px" v-if="sevenNoneFlag"></div>
        <img src="@/common/images/report_noneData.png" alt="" v-if="!sevenNoneFlag" class="noneImg">
        <p class="none_text" v-if="!sevenNoneFlag">暂无数据</p>
      </div>
    </div>
  </div>
</template>
<script>

var echarts = require('echarts')

import { reportFnOne } from './js/reportFnOne'
import { reportFnTwo } from './js/reportFnTwo'
import { reportFnThree } from './js/reportFnThree'
import { reportFnFour } from './js/reportFnFour'
import { reportFnFive } from './js/reportFnFive'
import { reportFnSix } from './js/reportFnSix'
import { reportFnSeven } from './js/reportFnSeven'
import moment from 'moment'

export default {
  data () {
    return {
      startData: this.moment(this.getNowDateFn(), 'YYYY/MM/DD h:mm:ss'),
      endData: this.moment(this.showTimeFn(), 'YYYY-MM-DD h:mm:ss'),
      startTime: '', // 时间
      endTime: '', // 时间
      reportaData: '',
      reportTagList: []
    }
  },
  created() {
    this.startTime = this.getNowDateFn()
    this.endTime = this.showTimeFn()
    this.showReportDataFn()
  },
  mounted () {
    // this.showTwoReportFnRight()
  },
  mixins: [ reportFnOne, reportFnTwo, reportFnThree, reportFnFour, reportFnFive, reportFnSix, reportFnSeven ],
  methods: {
    getNowDateFn() {
      let now = new Date()
      let year = now.getFullYear()
      return year + '-01-01 00:00:00'
    },
    showTimeFn() {
      let now = new Date()
      let year = now.getFullYear()
      let month = now.getMonth() + 1
      let day = now.getDate()
      let hh = now.getHours()
      let mm = now.getMinutes()
      let ss = now.getSeconds()
      let clock = year + '-'

      if(month < 10) clock += '0'
      clock += month + '-'
      if(day < 10) clock += '0'
      clock += day + " "
      if(hh < 10) clock += '0'
      clock += hh + ":"
      if (mm < 10) clock += '0'
      clock += mm + ":"
      if (ss < 10) clock += '0'
      clock += ss
      return clock
    },
    moment,
    // 获取整个报表数据接口
    showReportDataFn() {
      let sendData = {}
      if (this.startTime) sendData.beginDate = this.startTime
      if (this.endTime) sendData.endDate = this.endTime
      this.$request.post('/report/queryReportInfo', sendData).then(res => {
        if (res.code === 0) {
          this.showOneReportFn(res.result.reportCoreVoList)
          this.showTwoReportFnLeft(res.result.reportSignVoList)
          
          if (res.result.reportYearFollowList.length !== 0) this.saveThreeYear = res.result.reportYearFollowList[0].year
          this.showThreeReportFn(res.result.reportYearFollowList, this.saveThreeYear)

          this.showFourReportFn(res.result.reportDesignSumVoList)

          if (res.result.reportYearDelayStartList.length !== 0) this.saveFiveYear = res.result.reportYearDelayStartList[0].year
          this.showFiveReportFn(res.result.reportYearDelayStartList, this.saveFiveYear)
          
          if (res.result.reportYearDelayEndList.length !== 0) this.saveSixYear = res.result.reportYearDelayEndList[0].year
          this.showSixReportFn(res.result.reportYearDelayEndList, this.saveSixYear)

          this.showSevenReportFn(res.result.reportDelayReasonList)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 点击提交事件
    searchFn() {
      this.showReportDataFn()
    },
    // 顶部搜索框一些事件
    onReportChange(adata) {
      console.log('打印', adata)
    },
    startTimeFn(adata, atime) {
      if (atime) {
        this.startTime = atime
      } else {
        this.startTime = ''
      }
    },
    endTimeFn(adata, atime) {
      if (atime) {
        this.endTime = atime
      } else {
        this.endTime = ''
      }
    },
    disabledStartDate (startValue) {
      const endValue = this.endData;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf();
    },
    disabledEndDate (endValue) {
      const startValue = this.startData;
      if (!endValue || !startValue) {
        return false;
      }
      return startValue.valueOf() >= endValue.valueOf();
    }
  }
}
</script>
<style lang="scss">
@import '@/views/ReportFormPage/css/index.scss'
</style>
