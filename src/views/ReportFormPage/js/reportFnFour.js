var echarts = require('echarts')

export var reportFnFour = {
  data () {
    return {
      FourTotal: 0, // 总的条数
      FourPageSize: 10, // 每页多少条数
      FourCurrent: 1, // 当前第几页
      saveFourAllList: [], // 保存所有的原来的总数据
      fourNoneFlag: true
    }
  },
  created: function () {

  },
  watch: {

  },
  methods: {
    // 第四个报表事件
    showFourReportFn(getaData = []) {
      this.saveFourAllList = getaData
      this.saveFourAllList.length == 0 ? this.fourNoneFlag = false : this.fourNoneFlag = true
      this.FourTotal = this.saveFourAllList.length
      
      let myNewReportList = this.saveFourAllList.slice( (Number(this.FourCurrent) - 1) * this.FourPageSize,  Number(this.FourCurrent) * this.FourPageSize)
      let designName = []
      let totalAmount = []
      myNewReportList.forEach(item => {
        designName.push(item.designerName)
        totalAmount.push(item.totalAmount)
      })

      let fourReportDom = echarts.init(document.getElementById('fourReportDom'))
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
        xAxis: [
          {
            type : 'category',
            data : designName,
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
        textStyle: {
          color: '#000000'
        },
        series: [
          {
            name:'人均产值',
            type:'bar',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            barWidth: '60%',
            data: totalAmount
          }
        ]
      }
      fourReportDom.setOption(option)
    },
    onFourSizeChange(current, pageSize) {
      this.FourCurrent = current
      this.FourPageSize = pageSize
      this.showFourReportFn(this.saveFourAllList)
    },
    FourPagechange(apage) {
      this.FourCurrent = apage
      this.showFourReportFn(this.saveFourAllList)
    }
  }
}
