var echarts = require('echarts')

export var reportFnOne = {
  data () {
    return {
      oneSelectList: [],
      oneLeftNoneFlag: true
    }
  },
  created: function () {

  },
  watch: {

  },
  methods: {
    // 第一个报表事件
    showOneReportFn(getaDdata = []) {
      this.oneSelectList = getaDdata
      this.oneSelectList.length == 0 ? this.oneLeftNoneFlag = false : this.oneLeftNoneFlag = true
      let oneNameArr = []
      let oneCountsArr = []
      this.oneSelectList.forEach(item => {
        oneNameArr.push(item.name)
        oneCountsArr.push(item.counts)
      })
      var myChart = echarts.init(document.getElementById('oneReportDom'));
      myChart.setOption({
        title: {
          text: ''
        },
        tooltip: {},
        xAxis: {
          data: oneNameArr
        },
        textStyle: {
          color: '#000000'
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          },
          data: oneCountsArr
        }]
      })
    }
  }
}
