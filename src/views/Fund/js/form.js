let accountName = [ 'accountName',
  {
    rules: [
      { required: true, message: '请输入收款账户' },
      { max: 32, message: '请输入正确收款账户' },
      { min: 2, message: '请输入正确收款账户' },
      { pattern: /^[\u4E00-\u9FFFA-Za-z]+$/, message: '请输入正确收款账户' }
    ]
  }
]

let accountNumber = [ 'accountNumber',
  {
    rules: [
      { required: true, message: '请输入收款账号' },
      { max: 19, message: '请输入正确银行卡号' },
      { min: 16, message: '请输入正确银行卡号' },
      { pattern: /^\+?[1-9][0-9]*$/, message: '请输入正确银行卡号' }
    ]
  }
]

let bankCode = [ 'bankCode', { rules: [ { required: true, message: '请选择银行' } ] } ]

let bankPrivon = [ 'bankPrivon', { rules: [ { required: true, message: '请选择开户银行省份' } ] } ]

let bankCity = [ 'bankCity', { rules: [ { required: true, message: '请选择开户银行城市' } ] } ]

let bankTypeCode = [ 'bankTypeCode', { rules: [ { required: true, message: '请选择开户银行类型' } ] } ]

let infoType = [ 'infoType', { rules: [ { required: true, message: '请选择开户类型' } ] } ]

let bankBranch = [ 'bankBranch', { rules: [ { required: true, message: '请选择开户银行' } ] } ]

let certificate = [ 'certificate', { rules: [ { required: true, message: '请选择证件类型' } ] } ]

let certificateId = [
  'certificateId',
  {
    rules: [
      { required: true, message: '请输入证件号码' },
      { pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '请输入正确的身份证号' }
    ]
  }
]
// /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
// /\(|\)|\*|\+|-|[1-9]|[A-H]/g
let continueCooperate = [ 'continueCooperate', { rules: [ { required: true, message: '请选择是否继续合作' } ] } ]

let reasonDesc = [ 'reasonDesc', { rules: [ { required: true, message: '请输入退款描叙' }, { max: 100, message: '不能超过100个字' } ] } ]

let refundAmount = [ 'refundAmount', { rules: [ { required: true, message: '请输入退款金额' }, { pattern: /^(([+]?\d*$)|(^[+]?\d+(\.\d+)?$))/, message: '请输入正确退款金额' } ] } ]

let refundReason = [ 'refundReason', { rules: [ { required: true, message: '请选择退款原因' } ] } ]

let obj = {
  accountName,
  accountNumber,
  bankCode,
  bankCity,
  bankPrivon,
  bankTypeCode,
  infoType,
  bankBranch,
  certificate,
  certificateId,
  continueCooperate,
  reasonDesc,
  refundAmount,
  refundReason
}

export default obj
