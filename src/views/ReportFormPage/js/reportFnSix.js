var echarts = require('echarts')

export var reportFnSix = {
  data () {
    return {
      saveSixYear: '',
      sixSelectList: [],
      sixNoneFlag: true
    }
  },
  created: function () {

  },
  watch: {

  },
  methods: {
    // 第六个报表事件
    showSixReportFn(getaData = [], myYear) {
      this.sixSelectList = getaData
      this.sixSelectList.length == 0 ? this.sixNoneFlag = false : this.sixNoneFlag = true
      let mountnum = []
      let adaynum = []
      let bdaynum = []
      this.sixSelectList.forEach(item => {
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
            adaynum.push(idom.count)
            bdaynum.push(idom.average)
          })
        }
      })

      let sixReportDom = echarts.init(document.getElementById('sixReportDom'))
      let option = {
        title: {
          text: '',
          subtext: ''
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data:['延期工地数', '平均延期天数']
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            dataView: {readOnly: false},
            magicType: {type: ['line', 'bar']},
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis:  {
          type: 'category',
          boundaryGap: false,
          data: mountnum
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}'
          }
        },
        series: [
          {
            name:'延期工地数',
            type:'line',
            data: adaynum
          },
          {
            name:'平均延期天数',
            type:'line',
            data: bdaynum
          }
        ]
      }
      sixReportDom.setOption(option)
    },
    sixSelectChange(adata) {
      this.saveSixYear = adata
      this.showSixReportFn(this.sixSelectList, adata)
    }
  }
}
