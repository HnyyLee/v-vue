// 所有检验;修改了检验的格式；用对象赋值方法
let peopleName = [
  'peopleName',
  { rules: [{ max: 50, message: '请输入正确的姓名!' }, { pattern: /^[\u0391-\uFFE5A-Za-z]+$/, message: '请输入正确用户名' }, { required: true, message: '请输入客户姓名!' }] }
]

let phoneNumber = [
  'phoneNumber',
  { rules:
    [
      { len: 11, message: '请输入正确的手机号码!' },
      { pattern: /^1[0-9]\d{9}$/, message: '请输入正确的手机号码' },
      { required: true, message: '请输入手机号码!' }
    ]
  }
]

let buildingNum = [ 'buildingNum', { rules: [ { required: true, message: '请选择' } ] } ]

let province = [ 'province', { rules: [ { required: true, message: '请选择省份' } ] } ]

let city = [ 'city', { rules: [ { required: true, message: '请选择城市' } ] } ]

let area = [ 'area', { rules: [ { required: false, message: '请选择区' } ] } ]

let residential = [ 'residential', { rules: [ { required: false, message: '请选择小区' } ] } ]

let ridgepole = [ 'ridgepole', { rules: [ { required: false, message: '请选择楼栋' } ] } ]

let room = [ 'room', { rules: [ { required: false, message: '请选择房号' } ] } ]

let decorate = [ 'decorate', { rules: [ { required: true, message: '请选择装修意向' } ] } ]

let source = [ 'source', { rules: [ { required: true, message: '请选择报单来源' } ] } ]

let personnel = [ 'personnel', { rules: [{ required: false, message: '请输入报单人' }] } ]

let family = [ 'family', { rules: [ { required: false, message: '请输入家庭情况' } ] } ]

let car = [ 'car', { rules: [ { required: false, message: '请输入车辆' } ] } ]

let interest = [ 'interest', { rules: [ { required: false, message: '请输入个人兴趣' } ] } ]

let specialIdentity = [ 'specialIdentity', { rules: [ { required: false, message: '请输入特殊身份' } ] } ]

let pet = [ 'pet', { rules: [ { required: false, message: '请输入宠物' } ] } ]

let design = [ 'design', { rules: [ { required: true, message: '请选择设计负责人' } ] } ]

let designPerson = [ 'designPerson', { rules: [ { required: true, message: '请选择设计负责人' } ] } ]

let giveUp = [ 'giveUp', { rules: [ { required: true, message: '请选择放弃原因' } ] } ]

let dateTime = [ 'dateTime', { rules: [ { required: true, message: '请选择预约时间' } ] } ]

let areaInput = [ 'areaInput', { rules: [ { required: false, message: '' } ] } ] // crm 备注

let designRemak = [ 'designRemak', { rules: [ { required: false, message: '' } ] } ] // 设计派单备注

function myRegTestFn(rule, value, callback) {
  const aTest = /^(\d|([1-9]\d+))(\.\d{1,2})?$/
  const bTest = /^-?((([1-9]+(\d+)?)(\.\d+)?)|(0\.\d+))$/
  if (value.length > 10 ) {
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
  family: family,
  car: car,
  interest: interest,
  specialIdentity: specialIdentity,
  pet: pet,
  design: design,
  giveUp: giveUp,
  dateTime: dateTime,
  areaInput: areaInput,
  designPerson: designPerson,
  designRemak: designRemak,
  floorspaceNumber: floorspaceNumber,
  livingNumber: livingNumber,
  bedroomNumber: bedroomNumber,
  kitchensNumber: kitchensNumber,
  bathroomsNumber: bathroomsNumber,
  residenInput: residenInput, // 自定义的小区
  ridgepInput: ridgepInput, // 自定义楼栋
  roomInput: roomInput // 自定义房号
}

export default verify
