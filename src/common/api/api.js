import request from '@/common/utils/request'

let api = {
  getProvinceList () { // 获取省份列表接了
    return request.get('/battleChartDataAccess/findProvinceChoiceList')
  },
  getCityList (id) { // 获取城市列表接口
    return request.get('/battleChartDataAccess/findCityChoiceList?parentCode=' + id)
  },
  getAreaList (id) { // 获取城市区域列表数据
    return request.get('/battleChartDataAccess/findLargeAreaChoiceList?parentCode=' + id)
  },
  getResidentialList (id) { // 获取小区列表数据(这里接受的ID，或者城市id)
    return request.get('/battleChartDataAccess/findProjectChoiceList?parentCode=' + id)
  },
  getBuildingList (id) { // 获取楼栋信息(这里接受的ID是小区编码 或者小区Id)
    return request.get('/battleChartDataAccess/findBuildingChoiceList?parentCode=' + id)
  },
  getRoomNumber (id) { // 获取当前房号信息(这里接受的ID是楼栋编码,或者楼栋ID)
    return request.get('/battleChartDataAccess/findHouseChoiceList?parentCode=' + id)
  },
  getDecorate (id) { // 获取装修意向列表数据(这里接受的ID是城市ID)
    return request.get('crm/combo/' + id)
  },
  getSouceList () { // 获取来源列表
    return request.get('/crm/source/list')
  },
  getGiveUpReason () { // 放弃原因
    let arr = [ { id: 5, name: '需求不符合' }, { id: 6, name: '外盘' }, { id: 7, name: '异地客户' } ]
    return arr
  },
  forListObj (item, arr) { // 选中对象信息取出的公用方法；
    let str = {}
    for (let i = 0; i < arr.length; i++) {
      if (item === arr[i].id || item === arr[i].code) {
        str = arr[i]
        break
      }
    }
    return str
  },
  getTagList () {
    return request.post('/projectWorkOrder/getFollowTagList')
  },
  getOrderStatus () {
    return request.post('/projectWorkOrder/getWorkOrderStatusList')
  }
}

export default api
