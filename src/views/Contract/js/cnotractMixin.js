import Api from '@/common/api/api.js'

export var cnotractMixin = {
  data() {
    return {
      addressType: 2, // 判断地址是自定义还是非自定义；1为自定义，2为非自定义
      notFoundObj: {
        provinceNot: '暂无数据', // 省份
        cityNot: '暂无数据', // 城市
        areaNot: '暂无数据', // 区
        residentialNot: '暂无数据', // 小区
        buildinhNot: '暂无数据', // 楼栋
        roomNot: '暂无数据', // 房号
      },
      provinceList: [], // 省份列表数据
      cityList: [], // 城市列表
      areaList: [], // 区域列表
      projectList: [], // 小区列表
      buildingList: [], // 楼栋列表
      houseList: [], // 房号列表
      client: {}, // 新增时保存获取到的/signContractOnLine/generateContractAboutInfo接口的当前的省市区的信息
      saveOldClient: {}, // 保存原来的数据
      mySpingFlagOne: false,
      mySpingFlagTwo: false,
      mySpingFlagThree: false,
      chineseNameObj: {}, // 中文的名称（省/市/区/小区/楼栋/房号）
      isOnlyGetShow: true, // 第一次点击编辑时候调用接口之后就不在调用
      saveListProvince: [], // 保存原来的省列表
      saveListCity: [], // 保存原来的城市列表
      saveListArea: [], // 保存原来的大区列表
      saveListResidential: [], // 保存原来的大区列表
      saveListBuilding: [], // 保存原来楼栋区列表
      saveListRoom: [], // 保存原来房号区列表
      pageOne: { provn: 1, city: 1, pro: 1, buil: 1 }, // 点开编辑是否第一次获取接口
    }
  },
  created: function () {
    
  },
  methods: {
    // 自定义和非自定义的radio改变事件
    addressTypeChangFn(ev) {
      if (this.saveOldClient.provinceCode) {
        this.provinceList.forEach(item => {
          if (item.code == this.saveOldClient.provinceCode) {
            this.chineseNameObj.provinceName = item.name
          }
        })
      }
      if (this.saveOldClient.cityCode) {
        this.cityList.forEach(item => {
          if (item.code == this.saveOldClient.cityCode) {
            this.chineseNameObj.cityName = item.name
          }
        })
      }
      if (this.saveOldClient.districtCode) {
        this.areaList.forEach(item => {
          if (item.code == this.saveOldClient.districtCode) {
            this.chineseNameObj.areaName = item.name
          }
        })
      }
      if (this.addressType == 1) {
        if (this.saveOldClient.project) this.chineseNameObj.projectName = this.saveOldClient.project
        if (this.saveOldClient.building) this.chineseNameObj.buildingName = this.saveOldClient.building
        if (this.saveOldClient.house) this.chineseNameObj.houseName = this.saveOldClient.house
      } else if (this.addressType == 2) {
        if (this.saveOldClient.projectCode) {
          this.projectList.forEach(item => {
            if (item.code == this.saveOldClient.projectCode) {
              this.chineseNameObj.projectName = item.name
            }
          })
        }
        if (this.saveOldClient.buildingCode) {
          this.buildingList.forEach(item => {
            if (item.code == this.saveOldClient.buildingCode) {
              this.chineseNameObj.buildingName = item.name
            }
          })
        }
        if (this.saveOldClient.houseCode) {
          this.houseList.forEach(item => {
            if (item.code == this.saveOldClient.houseCode) {
              this.chineseNameObj.houseName = item.name
            }
          })
        }
      }
    },
    // 获取省份接口
    getProvinList () {
      this.notFoundObj.provinceNot = '加载中'
      Api.getProvinceList().then(res => {
        if (res.code === 0) {
          this.provinceList = res.result
          this.notFoundObj.provinceNot = '暂无任何数据'
        }
      }).catch(err => {
        this.notFoundObj.provinceNot = '暂无任何数据'
      })
      // 第一次点击编辑时候调用接口之后就不在调用
      this.isOnlyGetShow = false
    },
    // 选中省份获取城市
    getCityList (id, num) {
      // 重置数据
      this.cityList = []
      this.areaList = []
      this.projectList = []
      this.buildingList = []
      this.houseList = []
      this.notFoundObj.cityNot = '加载中...'
      if (typeof(num) == 'object') {
        // 重置区域的值和id
        this.client.district = '' // 区域
        this.client.districtCode = '' // 区域ID
      }
      this.provinceList.forEach(item => {
        if (item.code == id) {
          this.chineseNameObj.provinceName = item.name
        }
      })
      this.verify.province[1].initialValue = id
      
      Api.getCityList(id).then(res => {
        if (res.code === 0) {
          this.cityList = res.result
          this.notFoundObj.cityNot = '暂无任何数据'
        }
      }).catch(err => {
        this.notFoundObj.cityNot = '暂无任何数据'
      })
      if (this.pageOne.provn === 1) { // 是否第一次进入编辑；判断是否清除数据；
        this.pageOne.provn = 2
      } else {
        // 选择值的清空
        this.formData.resetFields(['city', 'area', 'residential', 'ridgepole', 'addroom']) // 设置值 和 选择值需要不同的方法来清空
        // 设置值的清空
        this.verify.city[1].initialValue = undefined
        this.verify.area[1].initialValue = undefined
        this.verify.residential[1].initialValue = undefined
        this.verify.ridgepole[1].initialValue = undefined
        this.verify.addroom[1].initialValue = undefined
      }
    },
    // 选中城市获取区信息
    getDistru (id, num) {
      this.areaList = []
      this.projectList = []
      this.buildingList = []
      this.houseList = []
      if (typeof(num) == 'object') {
        // 重置区域的值和id
        this.client.district = '' // 区域
        this.client.districtCode = '' // 区域ID
      }
      this.cityList.forEach(item => {
        if (item.code == id) {
          this.chineseNameObj.cityName = item.name
        }
      })
      this.verify.city[1].initialValue = id

      Api.getAreaList(id).then(res => {
        if (res.code === 0) {
          this.areaList = res.result
        }
      })
      this.getProjecList(id) // 城市改变；再次获取小区信息
      if (this.pageOne.city === 1) { // 是否第一次进入编辑；判断是否清除数据；
        this.pageOne.city = 2
      } else {
        this.client.projectCode = ''
        this.client.buildingCode = ''
        this.client.houseCode = ''
        this.formData.resetFields(['area', 'residential', 'ridgepole', 'addroom', 'decorate']) // 设置值 和 选择值需要不同的方法来清空
        this.verify.area[1].initialValue = undefined
        this.verify.residential[1].initialValue = undefined
        this.verify.ridgepole[1].initialValue = undefined
        this.verify.addroom[1].initialValue = undefined
      }
      
    },
    // 选中区域改变数据
    getAreaFun (id, num) {
      if (typeof(num) == 'object') {
        // 重置区域的值和id
        this.client.district = '' // 区域
        this.client.districtCode = '' // 区域ID
      }
      this.areaList.forEach(item => {
        if (item.code == id) {
          this.chineseNameObj.areaName = item.name
        }
      })
      this.verify.area[1].initialValue = id
    },
    // 获取小区
    getProjecList (id) {
      this.buildingList = []
      this.houseList = []
      this.notFoundObj.residentialNot = '加载中'

      this.mySpingFlagOne = true
      Api.getResidentialList(id).then(res => {
        if (res.code === 0) {
          this.mySpingFlagOne = false
          this.verify.residential[1].initialValue = this.client.projectCode ? this.client.projectCode : undefined
          this.projectList = res.result
          this.notFoundObj.residentialNot = '暂无任何数据'
        }
      }).catch(err => {
        this.notFoundObj.residentialNot = '暂无任何数据'
      })
    },
    // 选中小区获取楼栋信息
    getBuildingList (id) {
      this.houseList = []
      this.notFoundObj.buildinhNot = '加载中...'
      this.projectList.forEach(item => {
        if (item.code == id) {
          this.chineseNameObj.projectName = item.name
        }
      })

      this.verify.residential[1].initialValue = id

      this.mySpingFlagTwo = true
      Api.getBuildingList(id).then(res => {
        if (res.code === 0) {
          this.mySpingFlagTwo = false
          this.verify.ridgepole[1].initialValue = this.client.buildingCode ? this.client.buildingCode : undefined
          this.buildingList = res.result
          this.notFoundObj.buildinhNot = '暂无任何数据'
        }
      }).catch(err => {
        this.notFoundObj.buildinhNot = '暂无任何数据'
      })

      if (this.pageOne.pro === 1) { // 是否第一次进入编辑；判断是否清除数据；
        this.pageOne.pro = 2
      } else {
        this.client.buildingCode = ''
        this.client.houseCode = ''
        this.formData.resetFields(['ridgepole', 'addroom']) // 设置值 和 选择值需要不同的方法来清空
        this.verify.ridgepole[1].initialValue = undefined
        this.verify.addroom[1].initialValue = undefined
      }
    },
    // 选中楼栋获取房号信息
    getHouseList (id) {
      this.notFoundObj.roomNot = '暂无任何数据'

      this.buildingList.forEach(item => {
        if (item.code == id) {
          this.chineseNameObj.buildingName = item.name
        }
      })
      this.verify.ridgepole[1].initialValue = id
      this.mySpingFlagThree = true
      Api.getRoomNumber(id).then(res => {
        if (res.code === 0) {
          this.mySpingFlagThree = false
          this.verify.addroom[1].initialValue = this.client.houseCode ? this.client.houseCode : undefined
          this.houseList = res.result
          this.notFoundObj.roomNot = '暂无任何数据'
        }
      }).catch(err => {
        this.notFoundObj.roomNot = '暂无任何数据'
      })
      this.formData.resetFields(['addroom']) // 设置值 和 选择值需要不同的方法来清空
      if (this.pageOne.buil === 1) { // 是否第一次进入编辑；判断是否清除数据；
        this.pageOne.buil = 2
      } else {
        this.client.houseCode = ''
        this.verify.addroom[1].initialValue = undefined
      }
      
    },
    // 房号改变时候事件
    getHouseValue (id) {
      this.houseList.forEach(item => {
        if (item.code == id) {
          this.chineseNameObj.houseName = item.name
        }
      })
      this.verify.addroom[1].initialValue = id
    },
  }
}
