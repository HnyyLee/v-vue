
// 所有检验
// 此处工艺SKU字段和检验的开始
export let technologyCode = [
  'code', { rules: [{ required: true, message: '请输入物料编码!' }] }
]
export let technologyCategory = [
  'category', { rules: [{ required: true, message: '请输入类别!' }] }
]
export let technologyName = [
  'name', { rules: [{ required: true, message: '请输入工艺名称!' }] }
]
export let technologyUnit = [
  'unit', { rules: [{ required: true, message: '请输入单位!' }] }
]
export let technologyPrice = [
  'price', { rules: [{ required: true, message: '请输入价格!' }] }
]
export let technologyStatus = [
  'status', { rules: [{ required: true, message: '请选择状态!' }] }
]
export let technologyCommonStatus = [
  'common', { rules: [{ required: true, message: '请选择是否为通用!' }] }
]
// 此处主材SKU字段和检验开始
export let principalCode = [
  'code', { rules: [{ required: true, message: '请输入物料编码!' }] }
]
export let principalCategory = [
  'category', { rules: [{ required: true, message: '请输入类别!' }] }
]
export let principalName = [
  'name', { rules: [{ required: true, message: '请输入产品名称!' }] }
]
export let principalBrand = [
  'brand', { rules: [{ required: true, message: '请输入品牌!' }] }
]
export let principalType = [
  'type', { rules: [{ required: true, message: '请输入型号!' }] }
]
export let principalSize = [
  'size', { rules: [{ required: true, message: '请输入价格!' }] }
]
export let principalUnit = [
  'unit', { rules: [{ required: true, message: '请输入单位!' }] }
]
export let principalPrice = [
  'price', { rules: [{ required: true, message: '请输入价格!' }] }
]
export let principalAttribute = [
  'attribute', { rules: [{ required: true, message: '请输入产品属性!' }] }
]
export let principalStatus = [
  'status', { rules: [{ required: true, message: '请选择状态!' }] }
]
export let principalCommonStatus = [
  'common', { rules: [{ required: true, message: '请选择是否为通用!' }] }
]

// 此处为报价的新增模块校验开始
export let packageListSchemeName = [
  'schemeName', { rules: [{ required: true, message: '请输入方案名称' }] }
]
export let packageListDecorationType = [
  'decorationType', { rules: [{ required: true, message: '请选择装修类型' }] }
]
export let packageListMeal = [
  'meal', { rules: [{ required: true, message: '请选择使用套餐' }] }
]
// 清单式报价新增校验
export let customDirectFee = [
  'directFee', { rules: [{ required: true, message: '请输入工程直接费用' }, { validator: testNumItem }] }
]
export let customAdvocateMaterialFee = [
  'advocateMaterialFee', { rules: [{ required: true, message: '请输入主材费' }, { validator: testNumItem }] }
]
export let customAuxiliaryMaterialFee = [
  'auxiliaryMaterialFee', { rules: [{ required: true, message: '请输入辅材费' }, { validator: testNumItem }] }
]
export let customPersonFee = [
  'personFee', { rules: [{ required: true, message: '请输入人工费' }, { validator: testNumItem }] }
]
export let customOtherFee = [
  'otherFee', { rules: [{ required: true, message: '请输入其他' }, { validator: testNumItem }] }
]
export let customAate = [
  'rate', { rules: [{ required: true, message: '请输入税点' }, { validator: testNumItem }] }
]
export let customAateFee = [
  'rateFee', { rules: [{ required: true, message: '请输入税费' }, { validator: testNumItem }] }
]
export let customManageRate = [
  'manageRate', { rules: [{ required: true, message: '请输入管理费点' }, { validator: testNumItem }] }
]
export let customManageFee = [
  'manageFee', { rules: [{ required: true, message: '请输入管理费' }, { validator: testNumItem }] }
]
export let customDiscountRate = [
  'discountRate', { rules: [{ required: true, message: '请输入折扣' }, { validator: testNumItem }] }
]
export let customDiscountFee = [
  'discountFee', { rules: [{ required: true, message: '请输入其他费用' }, { pattern: /^-?(\d|([1-9]\d+))(\.\d{1,2})?$/, message: '请输入正确的值，值只保留小数点后两位' } ] }
]

function testNumItem (rule, value, callback) {
  let aFlag = /^[0-9]+([.]{1}[0-9]{1,2})?$/.test(value)
  if (!aFlag) {
    let str = '只能输入整数小数,并且只保留小数点后两位，请重新输入!'
    callback(str)
  } else {
    callback()
  }
}

// 套餐产品的校验
export let myManageFormula = [
  'myManageFormula', { rules: [ { required: true, message: '请输入管理费(B)' }, { pattern: /^[()*+-0123456789A-H]+$/g, message: '管理费(B)输入有误' } ] }
]
export let myRateFormula = [
  'myRateFormula', { rules: [ { required: true, message: '请输入税费(C)' }, { pattern: /^[()*+-0123456789A-H]+$/g, message: '税费(C)输入有误' } ] }
]
export let myAdjustFormula = [
  'myAdjustFormula', { rules: [ { required: true, message: '请输入调整项(D)' }, { pattern: /^[()*+-0123456789A-H]+$/g, message: '调整项(D)输入有误' } ] }
]
export let myTotalFormula = [
  'myTotalFormula', { rules: [ { required: true, message: '请输入总价(E)' }, { pattern: /^[()*+-0123456789A-H]+$/g, message: '总价(E)输入有误' } ] }
]

// 此处施工预算管理——任务包模板——全屋整装的检验
export let houseWorkingProcedure = [
  'houseWorkingProcedure', { rules: [{ required: true, message: '请输入工序!' }] }
]
export let houseWorkType = [
  'houseWorkType', { rules: [{ required: true, message: '请输入工种!' }] }
]
export let houseCode = [
  'houseCode', { rules: [{ required: true, message: '请输入工艺物料编码!' }] }
]
export let houoseProjectName = [
  'houoseProjectName', { rules: [{ required: true, message: '请输入施工项目名称!' }] }
]
export let houseType = [
  'houseType', { rules: [{ required: true, message: '请选择类别!' }] }
]
export let housePersonFee = [
  'housePersonFee', { rules: [{ validator: testHouseNumberFnOne }] }
]
export let houseMaterialFee = [
  'houseMaterialFee', { rules: [{ validator: testHouseNumberFnTwo }] }
]
export let housePrice = [
  'housePrice', { rules: [{ validator: testHouseNumberFnThree }] }
]
export let houseUint = [
  'houseUint', { rules: [{ required: true, message: '请输入单位!' }] }
]
export let houseApplyRange = [
  'houseApplyRange', { rules: [{ required: true, message: '请选择适用!' }] }
]
export let houseRule = [
  'houseRule', { rules: [{ required: true, message: '请选择计价规则!' }] }
]
export let houseIntroduce = [
  'houseIntroduce', { rules: [{ required: true, message: '请输入工艺说明!' }] }
]
function testHouseNumberFnOne (rule, value, callback) {
  if (value == '') {
    callback('请输入人工公费')
  } else {
    let numTest = /^[0-9]+\.?[0-9]*$/
    if (!numTest.test(value)) {
      callback('请输入数字类型')
    } else {
      let aFlag = /^(\d|([1-9]\d+))(\.\d{1,2})?$/.test(value)
      if (!aFlag) {
        callback('小数点后最多保留两位小数')
      } else {
        callback()
      }
    }
  }
}
function testHouseNumberFnTwo (rule, value, callback) {
  if (value == '') {
    callback('请输入材料费')
  } else {
    let numTest = /^[0-9]+\.?[0-9]*$/
    if (!numTest.test(value)) {
      callback('请输入数字类型')
    } else {
      let aFlag = /^(\d|([1-9]\d+))(\.\d{1,2})?$/.test(value)
      if (!aFlag) {
        callback('小数点后最多保留两位小数')
      } else {
        callback()
      }
    }
  }
}
function testHouseNumberFnThree (rule, value, callback) {
  if (value == '') {
    callback('请输入综合单价')
  } else {
    let numTest = /^[0-9]+\.?[0-9]*$/
    if (!numTest.test(value)) {
      callback('请输入数字类型')
    } else {
      let aFlag = /^(\d|([1-9]\d+))(\.\d{1,2})?$/.test(value)
      if (!aFlag) {
        callback('小数点后最多保留两位小数')
      } else {
        callback()
      }
    }
  }
}


// 所有检验;修改了检验的格式；用对象赋值方法
let peopleName = [
  'peopleName', {
    rules: [
      { max: 15, min: 2, message: '请输入正确的姓名!' },
      { pattern: /^[\u0391-\uFFE5A-Za-z]+$/, message: '请输入正确用户名' },
      { required: true, message: '请输入客户姓名!' }
    ]
  }
]

let phoneNumber = [
  'phoneNumber', { rules: [{ len: 11, message: '请输入正确的手机号码!' }, { required: true, message: '请输入手机号码!' }] }
]

let buildingNum = [
  'buildingNum', { rules: [ { required: true, message: '请选择' } ] }
]

let province = [
  'province', { rules: [ { required: true, message: '请选择省份' } ] }
]

let city = [
  'city', { rules: [ { required: true, message: '请选择城市' } ] }
]

let area = [
  'area', { rules: [ { required: false, message: '请选择区' } ] }
]

let residential = [
  'residential', { required: false, message: '请选择小区' }
]

let ridgepole = [
  'ridgepole', { required: false, message: '请选择楼栋' }
]

let room = [
  'room', { required: false, message: '请选择房号' }
]

let decorate = [
  'decorate', { rules: [ { required: true, message: '请选择装修意向' } ] }
]

let source = [
  'source', { rules: [ { required: true, message: '请选择报单来源' } ] }
]

let personnel = [
  'personnel', { rules: [{ required: false, message: '请输入报单人' }] }
]

function myRegTestFn (rule, value, callback) {
  const aTest = /^(\d|([1-9]\d+))(\.\d{1,2})?$/
  const bTest = /^-?((([1-9]+(\d+)?)(\.\d+)?)|(0\.\d+))$/
  if (value.length > 10) {
    callback('长度不能大于10位')
  }
  if (aTest.test(value) && bTest.test(value)) {
    callback()
  } else if (!aTest.test(value)) {
    callback('请输入正确的面积, 面积的值小数点后面保留两位数')
  } else if (!bTest.test(value)) {
    callback('面积不能为0')
  } else if (!aTest.test(value) || !bTest.test(value)) {
    callback('请输入正确的面积')
  }
}
let floorspaceNumber = [ 'floorspaceNumber', { rules: [{ required: false, message: '请输入面积' }, { pattern: /^(\d|([1-9]\d+))(\.\d{1,2})?$/, message: '请输入正确面积' }] } ] // 面积

let livingNumber = [ 'livingNumber', { rules: [ { required: false, message: '' } ] } ] // 厅数

let bedroomNumber = [ 'bedroomNumber', { rules: [ { required: false, message: '' } ] } ] // 房数

let kitchensNumber = [ 'kitchensNumber', { rules: [ { required: false, message: '' } ] } ] // 厨房数

let bathroomsNumber = [ 'bathroomsNumber', { rules: [ { required: false, message: '' } ] } ] // 卫生间数

let residenInput = [
  'residenInput',
  { rules: [{ max: 50, message: '小区名字不得大于50个字符' }] }
  // { pattern: /^[\u0391-\uFFE5A-Za-z]+$/, message: '请输入正确用户名' },
]
let ridgepInput = [
  'ridgepInput',
  { rules: [{ max: 50, message: '楼栋名字不得大于50个字符' }] }
  // { pattern: /^[\u0391-\uFFE5A-Za-z]+$/, message: '请输入正确用户名' },
]
let roomInput = [
  'roomInput',
  { rules: [{ max: 50, message: '房号名字不得大于50个字符' }] }
  // { pattern: /^[\u0391-\uFFE5A-Za-z]+$/, message: '请输入正确用户名' },
]

let verify = {
  peopleName: peopleName,
  phoneNumber: phoneNumber,
  buildingNum: buildingNum,
  province: province,
  city: city,
  area: area,
  residential: residential,
  ridgepole: ridgepole,
  room: room,
  decorate: decorate,
  source: source,
  personnel: personnel,
  floorspaceNumber: floorspaceNumber, // 面积
  livingNumber: livingNumber, // 厅数
  bedroomNumber: bedroomNumber, // 房数
  kitchensNumber: kitchensNumber, // 厨房数
  bathroomsNumber: bathroomsNumber, // 卫生间数
  residenInput: residenInput, // 自定义小区名字
  ridgepInput: ridgepInput, // 自定义楼栋名
  roomInput: roomInput // 自定义房号
}

export default verify
