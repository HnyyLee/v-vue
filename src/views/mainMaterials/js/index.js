
let infoNumber = [ 'infoNumber', { rules: [ { required: true, message: '请输入合同编号' } ] } ]

let infoPurchase = [ 'infoPurchase', { rules: [ { required: true, message: '请选择材料选购日期' } ] } ]

let infoAddress = [ 'infoAddress', { rules: [ { required: false, message: '请输入送货地址' } ] } ]

let infoCustomer = [ 'infoCustomer', { rules: [ { required: false, message: '请输入客户姓名' } ] } ]

let infoPhone = [ 'infoPhone', { rules: [ { required: false, message: '请输入联系电话' } ] } ]

let infoMerchandiser = [ 'infoMerchandiser', { rules: [ { required: false, message: '请输入主材跟单员' } ] } ]

let infoMerchanphone = [ 'infoMerchanphone', { rules: [ { required: false, message: '请输入联系电话' } ] } ]

let infoDesigner = [ 'infoDesigner', { rules: [ { required: false, message: '请输入设计师' } ] } ]

let infoDesignphone = [ 'infoDesignphone', { rules: [ { required: false, message: '请输入联系电话' } ] } ]

let infoHousekeeper = [ 'infoHousekeeper', { rules: [ { required: false, message: '请输入装修管家' } ] } ]

let infoHousephone = [ 'infoHousephone', { rules: [ { required: false, message: '请输入联系电话' } ] } ]

let infoStairs = [ 'infoStairs', { rules: [ { required: false, message: '请选择楼梯房/电梯房' } ] } ]

let infoStartData = [ 'infoStartData', { rules: [ { required: false, message: '请选择开工日期' } ] } ]

let infoEndData = [ 'infoEndData', { rules: [ { required: false, message: '请选择竣工日期' } ] } ]



let contTableData = {
  infoNumber,
  infoPurchase,
  infoAddress,
  infoCustomer,
  infoPhone,
  infoMerchandiser,
  infoMerchanphone,
  infoDesigner,
  infoDesignphone,
  infoHousekeeper,
  infoHousephone,
  infoStairs,
  infoStartData,
  infoEndData
}

export default contTableData
