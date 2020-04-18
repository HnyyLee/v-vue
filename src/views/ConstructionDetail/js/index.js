let titleList1 = [
  {
    title: '款项',
    align: 'center',
    dataIndex: 'receivableType'
  },
  {
    title: '应收金额',
    align: 'center',
    dataIndex: 'totalAmount',
    scopedSlots: { customRender: 'totalAmount' }
  },
  {
    title: '实收金额',
    align: 'center',
    dataIndex: 'receivedAmount'
  },
  {
    title: '收款方式',
    align: 'center',
    dataIndex: 'paymentName'
  },
  {
    title: '日期',
    align: 'center',
    dataIndex: 'paymentTime'
  }
]

let obj = {
  titleList1
}

export default obj

export const myapproval = [ 'myapproval', { rules: [ { required: true, message: '请选择审批模板' } ] } ]
