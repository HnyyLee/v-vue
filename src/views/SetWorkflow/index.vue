<template>
  <div class="set_work_wrap">
    <div class="set_work_wrap_top">
      <a-select style="width: 220px" v-model="temId" :disabled='flag' @change="temSelectVal" placeholder="请选择审核模板">
        <a-select-option v-for="item in templateLit" :key="item.configKey" :value='item.configKey'>{{item.configValue}}</a-select-option>
      </a-select>
      <a-select style="width: 220px" v-model="scopeId" :disabled='flag' @change="scopeChange" placeholder="请选择使用范围">
        <a-select-option v-for="scop in scopeList" :key="scop.orgTypeCode" :value='scop.orgCode'>{{scop.orgName}}</a-select-option>
      </a-select>
      <div class="firstRightBtn" v-if="firstBtnFlag">
        <a-button style="margin-left: 20px; width: 60px" @click="add"><a-icon type="plus" style="font-size： 40px"/></a-button>
      </div>
    </div>
    <div class="set_work_wrap_content" v-for="(item, index) in workArr" :key="item.id">
      <a-icon type="arrow-down" style="font-size: 70px;" />
      <div class="set_work_box">
        <span class="set_work_box_title">{{numFun(index + 1)}}</span>
        <div class="set_work_box_select">
          <a-select style="width: 220px" v-model="item.approverDept" placeholder="请选择部门" @change="getDeparPer(item.approverDept, index)">
            <a-select-option v-for="perVal in departmentList" :key="perVal.orgTypeCode" :value='perVal.orgCode'>{{perVal.orgName}}</a-select-option>
          </a-select>
          <a-select style="width: 220px" allowClear v-model="item.approverId"  @change="handleChange(item.approverId, index)" placeholder="请选择审核人员">
            <a-select-option v-for="perVal in item.perList" :key="perVal.a" :value='perVal.eid'>{{perVal.staffName}}</a-select-option>
          </a-select>
        </div>
        <div class="set_work_box_btn">
          <a-button style="margin-left: 20px; width: 60px" @click="add"><a-icon type="plus" style="font-size： 40px"/></a-button>
          <a-button style="margin-left: 10px; width: 60px" @click="delet(index)"><a-icon type="minus" style="font-size： 40px" /></a-button>
        </div>
      </div>
    </div>
    <div style="margin-top: 20px;">
      <a-button style="width: 60px" v-if="flag === true" @click="submit" type="primary">确定</a-button>
      <a-button style="width: 60px" v-if="flag === false" @click="submit2" type="primary">提交</a-button>
      <a-button style="margin-left: 20px; width: 60px" @click="cancel">取消</a-button>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      flag: false,
      temId: undefined, // 模板ID
      scopeId: undefined, // 选择使用范围所绑定的id
      templateLit: [], // 模板筛选
      workArr: [], // 工作流程；最多不能大于5个
      scopeList: [], // 使用范围的列表数据
      scopeChooseName: '', // 适用范围选中的name名称
      departmentList: [], // 部门列表
      personList: [], // 总人员列表
      selectList: [], // 选择部门后的人员列表
      firstBtnFlag: false, // 设置第一个加号
    }
  },
  watch: {
    workArr: {
      handler (newVal, val) {
        console.log('kkk', newVal)
        if (newVal.length == 0) {
          this.firstBtnFlag = true
        } else {
          this.firstBtnFlag = false
        }
      },
      deep: true
    }
  },
  created () {
    this.getSelectList()
    this.getDepartment()
    this.getPerpent('')
  },
  methods: {
    getSelectList () { // 模板下拉接口
      this.$request.get('/system/config/1/list').then(res => {
        if (res.code === 0) {
          this.templateLit = res.result
        }
      })
    },
    getDeparPer (e, index) { // 筛选部门获取人员
      this.getSelctPer(e, index)
    },
    getDepartment () { // 获取部门
      this.$request.get('/organizeDataAccess/findLaborCityCompanyDeptList').then(res => {
        if (res.code === 0) {
          if (res.result) {
            this.departmentList = res.result
            this.scopeList = res.result.concat()
            let scopObj = {
              orgName: '分公司全体',
              orgCode: this.scopeList[0].parentOrgCode,
              orgTypeCode: this.scopeList[0].orgTypeCode
            }
            this.scopeList.unshift(scopObj)
          } else {
            this.departmentList = []
            this.scopeList = []
          }
        }
      })
    },
    getSelctPer (code, i) { // 通过单个部门去筛选人员
      this.$request.get('/staffInfoDataAccess/findStaffInfoList?organizationCode=' + code).then(res => {
        if (res.code === 0) {
          if (res.result) {
            this.workArr[i].perList = res.result
            this.workArr[i].approverId = undefined
            this.$forceUpdate()
          } else {
            this.workArr[i].perList = []
            this.workArr[i].approverId = undefined
          }
        }
      })
    },
    getPerpent (code) { // 获取人员
      this.$request.get('/staffInfoDataAccess/findStaffInfoList?organizationCode=' + code).then(res => {
        if (res.code === 0) {
          if (res.result) {
            this.personList = res.result
            if (this.$route.query.id) { // 看看是否编辑进来的
              this.flag = true
              this.getData()
            } else {
              this.add()
            }
          } else {
            this.personList = []
            if (this.$route.query.id) { // 看看是否编辑进来的
              this.flag = true
              this.getData()
            } else {
              this.add()
            }
          }
        }
      })
    },
    getData () { // 获取模板详情
      this.workArr = []
      this.$request.get('/processTemplate/' + this.$route.query.id).then(res => {
        if (res.code === 0) {
          if (res.result.nodes) {
            this.personList.forEach(person => {
              res.result.nodes.forEach(ires => {
                if (person.eid == ires.approverId) {
                  ires.approverName = person.staffName
                }
              })
            })
            res.result.nodes.forEach(item => {
              let obj = item
              obj.perList = this.personList
              obj.demparList = this.departmentList
              // obj.demId = ''
              this.workArr.push(obj)
            })
          }
          this.temId = res.result.processCode
          this.scopeId = res.result.processRange
        }
      })
    },
    handleChange (id, index) {
      this.personList.forEach(item => {
        if (item.eid === id) {
          this.workArr[index].approverName = item.staffName
        }
      })
    },
    temSelectVal (e) { // 模板筛选的数据
      console.log(e)
    },
    add () { // 新增流程审核节点
      if (this.workArr.length < 5) {
        let obj = {
          approverId: undefined,
          approverName: null,
          description: null
        }
        this.workArr.push(obj)
      } else {
        this.$message.error('最大只能创建五级审核；请先删除再进行新增')
      }
    },
    delet (i) { // 删除流程审核节点
      this.workArr.splice(i, 1)
    },
    // 中文汉字自增方法
    numFun (bb) {
      let chnNumChar = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
      let chnUnitSection = ['', '万', '亿', '万亿', '亿亿']
      let chnUnitChar = ['', '十', '百', '千']
      function SectionToChinese (section) {
        let strIns = ''
        let chnStr = ''
        let unitPos = 0
        let zero = true
        while (section > 0) {
          let v = section % 10
          if (v === 0) {
            if (!zero) {
              zero = true
              chnStr = chnNumChar[v] + chnStr
            }
          } else {
            zero = false
            strIns = chnNumChar[v]
            strIns += chnUnitChar[unitPos]
            chnStr = strIns + chnStr
          }
          unitPos++
          section = Math.floor(section / 10)
        }
        return chnStr
      }
      function NumberToChinese (num) {
        let unitPos = 0
        let strIns = ''
        let chnStr = ''
        let needZero = false
        if (num === 0) {
          return chnNumChar[0]
        }
        while (num > 0) {
          let section = num % 10000
          if (needZero) {
            chnStr = chnNumChar[0] + chnStr
          }
          strIns = SectionToChinese(section)
          strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0]
          chnStr = strIns + chnStr
          needZero = (section < 1000) && (section > 0)
          num = Math.floor(num / 10000)
          unitPos++
        }
        return chnStr
      }
      let value = NumberToChinese(bb)
      return value + '级审核'
    },
    // 选择使用范围的change事件
    scopeChange(adata) {
      this.scopeList.forEach(scop => {
        if (scop.orgCode == adata) {
          this.scopeChooseName = scop.orgName
        }
      })
    },
    submit2 () { // 新增提交
      let myFlag = false
      if (!this.temId) {
        this.$message.info('请选择审核模板')
        myFlag = true
      }
      if (!this.scopeId) {
        this.$message.info('请选择使用范围')
        myFlag = true
      }
      this.workArr.forEach(work => {
        if (!work.approverDept) {
          this.$message.info('请选择部门')
          myFlag = true
        } 
        if (!work.approverId) {
          this.$message.info('请选择审核人员')
          myFlag = true
        }
      })
      if (myFlag == true) return
      let obj = {
        processCode: this.temId,
        nodes: this.workArr,
        processRange: this.scopeId,
        processRangeName: this.scopeChooseName
      }
      this.$request.post('/processTemplate/create', obj).then(res => {
        if (res.code === 0) {
          this.$router.push('/workflow')
        }
      })
    },
    submit () { // 确定
      this.workArr.forEach(item => {
        if (!item.approverId) {
          this.workArr = []
        }
      })
      let obj = {
        processTemplateId: this.$route.query.id,
        nodes: this.workArr
      }
      this.$request.put('/processTemplate/edit', obj).then(res => {
        if (res.code === 0) {
          this.$router.push('/workflow')
        }
      })
    },
    cancel () { // 取消
      this.$router.push('/workflow')
    }
  }
}
</script>
<style lang="scss">
  .set_work_wrap {
    display: flex;
    flex-flow: column;
    // justify-content: center;
    align-items: center;
    &_top {
      width: 300px;
      border: 1px solid #CCC;
      height: 100px;
      line-height: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-flow: wrap;
    }
    &_content {
      display: flex;
      flex-flow: column;
      align-items: center;
      .set_work_box {
        display: flex;
        align-items: center;
        &_title {
          width: 200px;
          line-height: 100px;
          text-align: center;
        }
        &_select {
          width: 300px;
          border: 1px solid #CCC;
          height: 100px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        &_btn {
          width: 200px;
        }
      }
    }
    .set_work_wrap_top{
      position: relative;
      .firstRightBtn{
        position: absolute;
        right: -100px;
      }
    }
  }
  .set_work_box_select {
    display: flex;
    justify-content:center;
    flex-flow: wrap;
    align-items: center;
  }
</style>
