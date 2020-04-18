var echarts = require('echarts')

export var reportFnThree = {
  data () {
    return {
      saveThreeYear: '',
      threeSelectList: [],
      threeNoneFlag: true
    }
  },
  created: function () {

  },
  watch: {

  },
  methods: {
    // 第三个报表事件
    showThreeReportFn(getaDdata = [], myYear) {
      this.threeSelectList = getaDdata
      this.threeSelectList.length == 0 ? this.threeNoneFlag = false : this.threeNoneFlag = true
      let mountnum = []
      let daynum = []
      this.threeSelectList.forEach(item => {
        if (item.year == myYear) {
          item.reportMonthVoList.forEach(idom => {
            if (idom.monthName == '01')  idom.monthName = '一月份'
            if (idom.monthName == '02')  idom.monthName = '二月份'
            if (idom.monthName == '03')  idom.monthName = '三月份'
            if (idom.monthName == '04')  idom.monthName = '四月份'
            if (idom.monthName == '05')  idom.monthName = '五月份'
            if (idom.monthName == '06')  idom.monthName = '六月份'
            if (idom.monthName == '07')  idom.monthName = '七月份'
            if (idom.monthName == '08')  idom.monthName = '八月份'
            if (idom.monthName == '09')  idom.monthName = '九月份'
            if (idom.monthName == '10')  idom.monthName = '十月份'
            if (idom.monthName == '11')  idom.monthName = '十一月份'
            if (idom.monthName == '12')  idom.monthName = '十二月份'
            mountnum.push(idom.monthName)
            daynum.push(idom.average)
          })
        }
      })

      let threeReportDom = echarts.init(document.getElementById('threeReportDom'))
      let option = {
        color: ['#3398DB'],
        tooltip : {
          trigger: 'axis',
          axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        textStyle: {
          color: '#000000'
        },
        xAxis: [
          {
            type : 'category',
            data : mountnum,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type : 'value'
          }
        ],
        series: [
          {
            name:'天数',
            type:'bar',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            barWidth: '60%',
            data: daynum
          }
        ]
      }
      threeReportDom.setOption(option)
    },
    threeSelectChange(adata) {
      this.saveThreeYear = adata
      this.showThreeReportFn(this.threeSelectList, adata)
    }
  }
}
