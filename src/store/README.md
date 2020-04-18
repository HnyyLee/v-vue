# 状态管理

console.log('这个数据', response.result)
let mylist = response.result
let oneList = mylist.filter(one => {
  return one.level == 1
})
let twoList = mylist.filter(two => {
  return two.level == 2
})
let threeList = mylist.filter(three => {
  return three.level == 3
})

oneList.forEach((one,index) => {
  one.children = []
  one.type = one.svr_type
})
twoList.forEach((two,index) => {
  two.children = []
  two.type = two.svr_type
})
threeList.forEach((three,index) => {
  three.children = []
  three.type = three.svr_type
})

twoList.forEach((two, twoNum) => {
  threeList.forEach((three, threeNum) => {
    if (three.parent_id == two.id) {
      twoList[twoNum].children.push(threeList[threeNum])
    }
  })
})

oneList.forEach((one,oneNum) => {
  twoList.forEach((two, twoNum) => {
    if (two.parent_id == one.id) {
      oneList[oneNum].children.push(twoList[twoNum])
    }
  })
})
let overList = oneList
console.log('得到的结果', overList)
