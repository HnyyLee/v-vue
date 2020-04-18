var echarts = require('echarts')

export var reportFnSeven = {
  data () {
    return {
      saveSevenData: [],
      sevenNoneFlag: true
    }
  },
  created: function () {

  },
  watch: {

  },
  methods: {
    // 第七个报表事件
    showSevenReportFn(getaData = []) {
      this.saveSevenData = getaData
      this.saveSevenData.length == 0 ? this.sevenNoneFlag = false : this.sevenNoneFlag = true
      let reasonName = []
      let reasonList = []
      this.saveSevenData.forEach(item => {
        reasonName.push(item.name)
        let asobj = {}
        asobj.value = item.ratio
        asobj.name = item.name
        reasonList.push(asobj)
      })

      let sevenReportDom = echarts.init(document.getElementById('sevenReportDom'))
      let option = {
        title : {
          text: '',
          subtext: '',
          x:'center'
        },
        tooltip : {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: 'horizontal',
          left: 'left',
          data: reasonName
        },
        series : [
          {
            name: '访问来源',
            type: 'pie',
            radius : '75%',
            center: ['50%', '60%'],
            data: reasonList,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      sevenReportDom.setOption(option)
    }
  }
}
