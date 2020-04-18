var echarts = require('echarts')

export var reportFnTwo = {
  data () {
    return {
      twoSelectList: [],
      twoLeftNoneFlag: true
    }
  },
  created: function () {

  },
  watch: {

  },
  methods: {
    // 第二个报表事件（左边）
    showTwoReportFnLeft(getaDdata = []) {
      this.twoSelectList = getaDdata
      this.twoSelectList.length == 0 ? this.twoLeftNoneFlag = false : this.twoLeftNoneFlag = true
      let twoLeftNameArr = []
      this.twoSelectList.forEach(item => {
        twoLeftNameArr.push(item.name)
      })
      let twoReportDom_left = echarts.init(document.getElementById('twoReportDom_left'))
      let seriesLabel = {
        normal: {
          show: true,
          textBorderWidth: 1,
          position: 'right',
          color: '#000000'
        }
      }
      let option = {
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: twoLeftNameArr
        },
        grid: {
          left: 100
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
            type: 'value',
            name: '转化率值',
            axisLabel: {
              formatter: '{value}'
            }
        },
        yAxis: {
          type: 'category',
          inverse: true,
          data: ['综合转化率'],
          axisLabel: {
            formatter: function (value) {
              return value
            },
            margin: 20,
            rich: {
              value: {
                lineHeight: 30,
                align: 'center'
              }
            }
          }
        },
        series: []
      }
      option.series = []
      this.twoSelectList.forEach(item => {
        let asaveobj = {}
        asaveobj.name = item.name
        asaveobj.type = 'bar'
        asaveobj.label = seriesLabel
        if (item.radio == 0) {
          asaveobj.data = [item.counts]
        } else {
          asaveobj.data = [item.radio]
        }
        option.series.push(asaveobj)
      })
      twoReportDom_left.setOption(option)
    },
    // 第二个报表事件（右）
    showTwoReportFnRight() {
      let twoReportDom_right = echarts.init(document.getElementById('twoReportDom_right'))
      let seriesLabel = {
        normal: {
          show: true,
          textBorderColor: '#333',
          textBorderWidth: 2
        }
      }
      let option = {
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['装修备案数', '知晓数', '市占数']
        },
        grid: {
          left: 100
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
            type: 'value',
            name: '转化率值',
            axisLabel: {
              formatter: '{value}'
            }
        },
        yAxis: {
          type: 'category',
          inverse: true,
          data: ['市占率'],
          axisLabel: {
            formatter: function (value) {
              return value
            },
            margin: 20,
            rich: {
              value: {
                lineHeight: 30,
                align: 'center'
              }
            }
          }
        },
        series: [
          {
            name: '装修备案数',
            type: 'bar',
            data: [165],
            label: seriesLabel
          },
          {
            name: '知晓数',
            type: 'bar',
            label: seriesLabel,
            data: [150]
          },
          {
            name: '市占数',
            type: 'bar',
            label: seriesLabel,
            data: [220]
          }
        ]
      }
      twoReportDom_right.setOption(option)
    }
  }
}
