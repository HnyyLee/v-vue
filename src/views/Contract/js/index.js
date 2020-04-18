
let priceId = [ 'priceId', { rules: [ { required: true, message: '请选择报价方案' } ] } ]

let designId = [ 'designId', { rules: [ { required: true, message: '请选择设计方案' } ] } ]

let contractTemp = [ 'contractTemp', { rules: [ { required: true, message: '请选择合同范本' } ] } ]

let starTime = [ 'starTime', { rules: [ { required: true, message: '请选择施工结束时间' } ] } ]

let endTime = [ 'endTime', { rules: [ { required: true, message: '请选择施工开始时间' } ] } ]

let myapproval = [ 'myapproval', { rules: [ { required: true, message: '请选择审批模板' } ] } ]

let infoNumber = [ 'infoNumber', { rules: [ { required: true, message: '请输入合同编号' } ] } ]

let infoPhone = [ 'infoPhone', { rules: [ { validator: PhoneTest } ] } ]

let infoParty = [ 'infoParty', { rules: [ { required: true, message: '请输入甲方' } ] } ]

let infoHome = [ 'infoHome', { rules: [ { required: true, message: '请输入房屋地址' } ] } ]

let IDcard = [ 'IDcard', { rules: [ { validator: IDcardTest } ] } ]
// 身份证校验——完整校验
function IDcardTest(rule, val, callback) {
  // let aFlag = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  // let bFlag = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  let cFlag = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/
  if (!cFlag.test(val)) {
    let str = '请输入正确的身份证号码!'
    callback(str)
  } else {
    callback()
  }
}
function PhoneTest(rule, val, callback) {
  let aFlag = /^1[0-9]\d{9}$/
  if (!aFlag.test(val)) {
    let str = '请输入正确的手机号码!'
    callback(str)
  } else {
    callback()
  }
}


let infoArea = [ 'infoArea', { rules: [ { required: true, message: '请输入实测面积' }, { pattern: /^\d{1,10}$|^\d{1,10}[.]\d{1,2}$/, message: '最大只能输入10位整数，小数点后保留2位小数' } ] } ]

let infoDate = [ 'infoDate', { rules: [ { required: true, message: '请输入合同拟定日期' } ] } ]

let room = [ 'room', { rules: [ { required: true, message: '请输室数量' }, { max: 2, message: '长度不可超过2位' }, { pattern: /^(0|[1-9][0-9]*)$/, message: '只能输入正数' } ] } ]

let office = [ 'office', { rules: [ { required: true, message: '请输厅数量' }, { max: 2, message: '长度不可超过2位' }, { pattern: /^(0|[1-9][0-9]*)$/, message: '只能输入正数' } ] } ]

let kitchen = [ 'kitchen', { rules: [ { required: true, message: '请输厨数量' }, { max: 2, message: '长度不可超过2位' }, { pattern: /^(0|[1-9][0-9]*)$/, message: '只能输入正数' } ] } ]

let wei = [ 'wei', { rules: [ { required: true, message: '请输卫数量' }, { max: 2, message: '长度不可超过2位' }, { pattern: /^(0|[1-9][0-9]*)$/, message: '只能输入正数' } ] } ]

let balcony = [ 'balcony', { rules: [ { required: true, message: '请输阳台数量' }, { max: 2, message: '长度不可超过2位' }, { pattern: /^(0|[1-9][0-9]*)$/, message: '只能输入正数' } ] } ]

let other = [ 'other', { rules: [ { required: false } ] } ]

let duration = [ 'duration', { rules: [ { required: true, message: '请输合同工期' }, { pattern: /^\d{1,10}$|^\d{1,10}[.]\d{1,1}$/, message: '最大只能输入10位整数，小数点后保留1位小数' } ] } ]

let disclosure = [ 'disclosure', { rules: [ { required: true, message: '请选择打拆交底日期' } ] } ]

let dismantling = [ 'dismantling', { rules: [ { required: true, message: '请选择打拆完成日期' } ] } ]

let commencementDate = [ 'commencementDate', { rules: [ { required: true, message: '请选择开工日期' } ] } ]

let completionDate = [ 'completionDate', { rules: [ { required: true, message: '请选择竣工日期' } ] } ]

let authorized = [ 'authorized', { rules: [ { required: false } ] } ]

let contact = [ 'contact', { rules: [ { required: false } ] } ]

let province = [ 'province', { rules: [ { required: true, message: '请选择省份' } ] } ]

let city = [ 'city', { rules: [ { required: true, message: '请选择城市' } ] } ]

let area = [ 'area', { rules: [ { required: false, message: '请选择区' } ] } ]

let residential = [ 'residential', { rules: [ { required: false, message: '请选择小区' } ] } ]

let ridgepole = [ 'ridgepole', { rules: [ { required: false, message: '请选择楼栋' } ] } ]

let addroom = [ 'addroom', { rules: [ { required: false, message: '请选择房号' } ] } ]

let residenInput = [
  'residenInput',
  { rules: [{ max: 50, message: '小区名字不得大于50个字符' }] }
  // { pattern: /^[\u0391-\uFFE5A-Za-z]+$/, message: '请输入正确小区名' }
]
let ridgepInput = [
  'ridgepInput',
  { rules: [{ max: 50, message: '楼栋名字不得大于50个字符' }] }
  // { pattern: /^[\u0391-\uFFE5A-Za-z]+$/, message: '请输入正确楼栋名' },
]
let roomInput = [
  'roomInput',
  { rules: [{ max: 50, message: '房号名字不得大于50个字符' }] }
  // { pattern: /^[\u0391-\uFFE5A-Za-z]+$/, message: '请输入正确房号' },
]


let contTableData = {
  priceId,
  designId,
  contractTemp,
  starTime,
  endTime,
  myapproval,
  infoNumber,
  infoPhone,
  infoParty,
  infoHome,
  IDcard,
  infoArea,
  infoDate,
  room,
  office,
  kitchen,
  wei,
  balcony,
  other,
  duration,
  disclosure,
  dismantling,
  commencementDate,
  completionDate,
  authorized,
  contact,
  province,
  city,
  area,
  residential,
  ridgepole,
  addroom,
  residenInput: residenInput, // 自定义的小区
  ridgepInput: ridgepInput, // 自定义楼栋
  roomInput: roomInput // 自定义房号
}

export default contTableData
