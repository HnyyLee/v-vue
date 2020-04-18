<template>
  <div class="bias_meal_box">
    <div class="content_default">
      <span class="title">产品命名</span>
      <div class="data_box">
        <input type="text" style="width:30%" v-model='productName' class='name_put' maxlength="50" @blur="productViold">
        <p class="vilodproduct" v-if="vilodproduct">请输入产品名称</p>
      </div>
    </div>
    <!-- <div class="content_default">
      <span class="title">适用城市公司</span>
      <div class="data_box">
        <a-select placeholder="请选择适用城市公司"  style="width: 250px" allowClear v-model="chooseCity">
          <a-select-option value="深圳">深圳</a-select-option>
        </a-select>
      </div>
    </div> -->
    <!-- <div class="content_default">
      <span class="title">装修类型</span>
      <div class="data_box">
        <a-radio-group @change="decorMethodChang" v-model="mealType">
          <a-radio :value="1">局装</a-radio>
          <a-radio :value="2">整装</a-radio>
        </a-radio-group>
      </div>
    </div> -->
    <div class="content_default">
      <span class="title">产品系列</span>
      <div class="data_box data_box2">
        <div style="width: 100%">
          <a-checkbox-group style="width: 100%" :defaultValue="saveWorkIdList">
            <a-row :gutter="24">
              <a-col :span="4" v-for="(rag, index) in plainOptions" :key="index"><a-checkbox :value="rag.id" @change="onlyCheckChange(rag, $event)">{{rag.name}}</a-checkbox></a-col>
              <p v-if="hasRangDom" class="RangDomTiT">暂无产品系列</p>
            </a-row>
          </a-checkbox-group>
        </div>
        <!-- <a-button @click="addrange"><a-icon type="plus" /></a-button> -->
      </div>
    </div>
    <div class="content_default" style="border-bottom: 1px solid #e1e1e1;">
      <span class="title">分期设置</span>
      <div class="data_box">
        <div class="data_box_content">
          <div class="sm_table">
            <div>
              <span class="aging_title">一期款比例(%)</span>
              <span>
                <a-input-number :min="0" :max="100" style="width: 140px;" v-model="firstNumber" @change="myIputFnTest(1, $event)" @blur="stagesBlurThink"/>
                <!-- <input type="number" class="name_put" v-model="firstNumber" @blur="stagesBlurThink"> -->
              </span>
            </div>
            <div>
              <span class="aging_title">二期款比例(%)</span>
              <span>
                <a-input-number :min="0" :max="100" style="width: 140px;" v-model="sendonNumber" @change="myIputFnTest(2, $event)" @blur="stagesBlurThink"/>
                <!-- <input type="number" class="name_put" v-model="sendonNumber" @blur="stagesBlurThink"> -->
              </span>
            </div>
            <div>
              <span class="aging_title">三期款比例(%)</span>
              <span>
                <a-input-number :min="0" :max="100" style="width: 140px;" v-model="threeNumber" @change="myIputFnTest(3, $event)" @blur="stagesBlurThink"/>
                <!-- <input type="number" class="name_put" v-model="threeNumber" @blur="stagesBlurThink"> -->
              </span>
            </div>
          </div>
          <p class="titText" v-if="showTitText">{{titText}}</p>
        </div>
      </div>
    </div>
    <div class="content_default default_two">
      <span class="title default_two_title">
        <span>产品系列</span>
        <span>(自动显示上方勾选内容)</span>
      </span>
      <div class="default_two_box_one">计价方式</div>
      <div class="flex_center data_box">规则设置</div>
    </div>
    <div class="content_default onlyList" v-for="(item, index) in workSpaceList" :key="index">
      <span class="title">{{item.name}}</span>
      <div class="default_two_box_one">
        <a-radio-group @change="amountMethodChang(item.id, $event)" :value="item.priceType" >
          <a-radio :value="1">一口价</a-radio>
          <a-radio :value="2">按平米计价</a-radio>
        </a-radio-group>
      </div>
      <div class="default_two_box_two">
        <div v-show="item.priceType == 1">
          面积<input type="number" :min="1" v-model="item.oneNum" @input="myNumberTestFn(item, $event, 1)">m&sup2;价格<input type="number" v-model="item.twoNum" @input="myNumberTestFn(item, $event, 2)">元;每超出<input type="number" v-model="item.threeNum" @input="myNumberTestFn(item, $event, 3)">m&sup2;,加收<input type="number" v-model="item.fourNum" @input="myNumberTestFn(item, $event, 4)">元
        </div>
        <div v-show="item.priceType == 2">
          <input type="text" v-model="item.fiveNum" @input="myNumberTestFn(item, $event, 5)">元/m&sup2;,起步面积<input type="text" v-model="item.sixNum" @input="myNumberTestFn(item, $event, 6)">m&sup2;
        </div>
        <div class="table_titTxt" v-if="item.violdText">
          <p>{{item.violdContext}}</p>
        </div>
      </div>
    </div>
    <div class="noneDataDom" v-if="workSpaceList.length == 0">
      <p>暂无选择数据</p>
    </div>
    <div style="border-bottom: 1px solid #e1e1e1;"></div>
    <!-- 点击添加产品系列按钮 -->
    <a-modal title="新增" v-model="visible" :maskClosable='false'>
      <div class="modal_box"><span>产品系列</span><a-input v-model="rangOnlyOne" /></div>
      <template slot="footer">
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" @click="handleSubmit">确定</a-button>
      </template>
    </a-modal>
    <div class="bias_meal_box_footer">
      <a-button style="margin-right: 20px;" @click="targeGoList">返回列表</a-button>
      <a-button type="primary" @click="nextThink">下一步</a-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    oneValue: {
      type: Object
    }
  },
  data () {
    return {
      productName: '',
      chooseCity: '深圳',
      vilodproduct: false,
      mealType: 1,
      rangeStr: [],
      plainOptions: [],
      fixturesType: 1,
      visible: false,
      rangOnlyOne: '',
      firstNumber: '',
      sendonNumber: '',
      threeNumber: '',
      showTitText: false,
      titText: '',
      isFirstNewFlag: true, // 创建产品第一步标识是否是第一次创建，从第二部回到第一步则变为更新,默认true
      workSpaceList: [], // 产品系列表格数据
      oneSpaceList: [], // 产品系列局装表格数据
      twoSpaceList: [], // 产品系列整装表格数据
      saveWorkIdList: [], // 保存产品系列选中的id数组
      hasRangDom: false, // 是否显示“暂时没有产品系列”
      rangTypeFlag: 1, // 当前产品系列的value，1还是2
      saveFirstProdcutId: '', // 保存创建产品之后返回的id
      myRangeIdList: [], // 保存第一步产品系列id数组
    }
  },
  created () {
    // 获取产品系列内选择框数据
    this.constructionFn(1)
  },
  methods: {
    // 获取产品系列内选择框数据
    constructionFn (num) {
      var adata = {
        status: 1
      }
      this.$request.post('/range/queryRangeList', adata).then(response => {
        if (response.code == 0) {
          if (response.result.list) {
            this.plainOptions = response.result.list
            this.hasRangDom = false
          } else {
            this.plainOptions = []
            this.hasRangDom = true
          }
        }
      })
    },
    // 校验产品名称是否为空
    productViold () {
      if (this.productName == '') {
        this.vilodproduct = true
      } else {
        this.vilodproduct = false
      }
    },
    // 产品系列复选框选择改变事件
    onlyCheckChange (obj, ev) {
      this.saveWorkIdList = []
      if (ev.target.checked) {
        obj.priceType = 1
        obj.oneNum = ''
        obj.twoNum = ''
        obj.threeNum = ''
        obj.fourNum = ''
        obj.fiveNum = ''
        obj.sixNum = ''
        this.workSpaceList.push(obj)
      } else {
        this.workSpaceList = this.workSpaceList.filter(refs => {
          return refs.id !== obj.id
        })
      }
      this.workSpaceList.forEach(wor => {
        this.saveWorkIdList.push(wor.id)
      })
      if (this.rangTypeFlag == 1) {
        this.oneSpaceList = this.workSpaceList.concat()
      } else if (this.rangTypeFlag == 2) {
        this.twoSpaceList = this.workSpaceList.concat()
      }
      let arr = []
      this.workSpaceList.forEach(item => {
        arr.push(item.id)
      })
      this.rangeStr = arr.join(',')
    },
    // 装修方式更改事件
    decorMethodChang (ev) {
      this.rangTypeFlag = ev.target.value
      this.workSpaceList = []
      if (ev.target.value == 1) {
        this.constructionFn(1)
        this.workSpaceList = this.oneSpaceList.concat()
      } else if (ev.target.value == 2) {
        this.constructionFn(2)
        this.workSpaceList = this.twoSpaceList.concat()
      }
      let arr = []
      this.workSpaceList.forEach(item => {
        arr.push(item.id)
      })
      this.rangeStr = arr.join(',')
    },
    // 计价方式更改事件
    amountMethodChang (data, ev) {
      this.workSpaceList.forEach(ref => {
        if (ref.id == data) {
          ref.priceType = ev.target.value
        }
      })
      this.$forceUpdate()
    },
    // 点击添加产品系列+按钮事件
    addrange () {
      this.visible = true
      this.rangOnlyOne = ''
    },
    // 新增产品系列弹框时候点击确定事件
    handleSubmit () {
      var adata = { 
        name: this.rangOnlyOne
      }
      adata.type = this.rangTypeFlag
      this.$request.post('/range/insertRange', adata).then(response => {
        if (response.code == 0) {
          this.constructionFn(this.rangTypeFlag)
          this.visible = false
          this.$message.success('添加成功!')
        }
      })
    },
    // 新增产品系列弹框时候点击取消事件
    handleCancel () {
      this.visible = false
    },
    // 填写分期设置每期的比例失去焦点事件
    stagesBlurThink (ev) {
      var allNum = Number(this.firstNumber) + Number(this.sendonNumber) + Number(this.threeNumber)
      if (this.firstNumber === '' || this.firstNumber == undefined) {
        this.showTitText = true
        this.titText = '一期款的比例不能为空'
      } else if (this.sendonNumber === '' || this.sendonNumber == undefined) {
        this.showTitText = true
        this.titText = '二期款的比例不能为空'
      } else if (this.threeNumber === '' || this.threeNumber == undefined) {
        this.showTitText = true
        this.titText = '三期款的比例不能为空'
      } else if (allNum !== 100) {
        this.showTitText = true
        this.titText = '三期比例总和必须为100%,请重新设置'
      } else {
        this.showTitText = false
      }
    },
    // 点击下一步事件
    nextThink () {
      this.stagesBlurThink()
      this.productViold()
      this.workSpaceList.forEach(item => {
        if (item.priceType == 1) {
          if (item.oneNum == '') {
            item.violdContext = '请输入面积值'
            item.violdText = true
          } else if (item.twoNum == '') {
            item.violdContext = '请输入价格值'
            item.violdText = true
          } else if (item.threeNum == '') {
            item.violdContext = '请输入每超出的平米数'
            item.violdText = true
          } else if (item.fourNum == '') {
            item.violdContext = '请输入加收的价格值'
            item.violdText = true
          } else {
            item.violdContext = ''
            item.violdText = false
          }
        } else if (item.priceType == 2) {
          if (item.fiveNum == '') {
            item.violdContext = '请输入元/m值'
            item.violdText = true
          } else if (item.sixNum == '') {
            item.violdContext = '请输入起步面积值'
            item.violdText = true
          } else {
            item.violdContext = ''
            item.violdText = false
          }
        }
      })
      let anum = true
      this.workSpaceList.forEach(idon => {
        if (idon.violdText) anum = false
      })
      if (this.workSpaceList.length == 0) {
        this.$message.info('请选择产品系列!')
        return
      }
      if (anum && !this.showTitText && this.productName) {
        var sendArr = []
        this.workSpaceList.forEach(idom => {
          let sobj = {}
          sobj.rangeId = idom.id
          sobj.priceType = idom.priceType
          if (idom.priceType == 1) {
            sobj.startArea = idom.oneNum
            sobj.startPrice = idom.twoNum
            sobj.perSquare = idom.threeNum
            sobj.perSquarePrice = idom.fourNum
          } else if (idom.priceType == 2) {
            sobj.perSquarePrice = idom.fiveNum
            sobj.startArea = idom.sixNum
            sobj.startPrice = ''
            sobj.perSquare = ''
          }
          sendArr.push(sobj)
        })
        var bigObject = {
          name: this.productName,
          city: this.chooseCity,
          type: this.$route.query.num,
          decorateType: this.mealType,
          rangeStr: this.rangeStr,
          paymentMethod: 2,
          firstPayment: this.firstNumber,
          secondPayment: this.sendonNumber,
          threePayment: this.threeNumber,
          productRangeVoList: sendArr
        }
        let baseUrl = ''
        if (this.isFirstNewFlag == true) {
          baseUrl = '/product/insertProduct'
        } else {
          baseUrl = '/product/updateProduct'
          bigObject.id = this.saveFirstProdcutId
        }
        this.$request.post(baseUrl, bigObject).then(response => {
          if (response.code == 0) {
            this.$message.success('保存成功!')
            if (this.isFirstNewFlag == true) {
              this.saveFirstProdcutId = response.result
            }
            this.isFirstNewFlag = false
            this.workSpaceList.forEach(work => {
              this.myRangeIdList.push(work.id)
            })
            this.$emit('getStepOneDate', bigObject, this.workSpaceList, response.result, this.myRangeIdList)
          } else {
            this.$message.error(response.message)
          }
        })
      }
      this.$forceUpdate()
    },
    // 返回列表事件
    targeGoList () {
      this.$router.push('/meal')
    },
    // 验证小数点
    myIputFnTest (num, data) {
      if (data) {
        if (num == 1) {
          this.firstNumber = String(data).replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
        } else if (num == 2) {
          this.sendonNumber = String(data).replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
        } else if (num == 3) {
          this.threeNumber = String(data).replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
        }
      }
    },
    // 验证
    myNumberTestFn (adata, ev, num) {
      // let myValue = String(ev.target.value).replace(!/^([\+]?([1-9]\d{0,7})|(0))([.]\d{0,2})?$/)
      let myValue = String(ev.target.value).replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
      const newData = [...this.workSpaceList]
      const target = newData.filter(item => adata.id === item.id)[0]
      if (target) {
        if (num == 1) {
          target.oneNum = myValue
        } else if (num == 2) {
          target.twoNum = myValue
        } else if (num == 3) {
          target.threeNum = myValue
        } else if (num == 4) {
          target.fourNum = myValue
        } else if (num == 5) {
          target.fiveNum = myValue
        } else if (num == 6) {
          target.sixNum = myValue
        }
        this.workSpaceList = newData
      }
    }
  }
}
</script>
<style lang="scss">
.bias_meal_box {
  padding: 10px;
  .onlyList{
    .table_titTxt{
      p{
        margin: 0px;
      }
    }
  }
  .content_default {
    display: flex;
    .title {
      display: flex;
      min-width: 200px;
      min-height: 40px;
      justify-content: center;
      align-items: center;
      background-color: #e1e1e1;
      border: 1px solid #CCC;
      border-bottom: none;
    }
    .default_two_title {
      flex-flow: column;
    }
    .data_box {
      display: flex;
      width: 100%;
      align-items: center;
      border: 1px solid #e1e1e1;
      border-left: none;
      border-bottom: none;
      padding-left: 10px;
      .vilodproduct{
        margin: 0px;
        color: #FF363B;
        font-size: 11px;
      }
      .name_put {
        border: none;
        outline: none;
      }
      // 新增的组件数字框
      .ant-input-number{
        padding: 0px!important;
        .ant-input-number-handler-wrap{
          padding: 0px;
        }
        .ant-input-number-input-wrap{
          padding: 0px;
        }
      }
      .data_box_content {
        position: relative;
        .sm_table{
          display: flex;
        }
        .titText{
          position: absolute;
          bottom: 0px;
          margin: 0px;
          font-size: 11px;
          color: #FF363B;
        }
        div {
          padding: 10px 0;
          span {
            display: block;
            border: 1px solid #e1e1e1;
            padding: 5px;
          }
          .aging_title {
            text-align: center;
            line-height: 24px;
            border-bottom: none;
          }
          input{
            text-align: center;
          }
        }
      }
    }
    .data_box2 {
      justify-content: space-between;
      padding: 0 10px;
    }
    .table_titTxt{
      margin-left: 30px;
      p{
        color: #FF363B;
        font-size: 11px;
      }
    }
    .RangDomTiT{
      margin: 0px 0px 0px 15px;
      color: #ccc;
      font-size: 11px;
    }
  }
  .noneDataDom{
    border: 1px solid #e1e1e1;
    border-bottom: none;
    p{
      margin: 0px;
      line-height: 50px;
      text-align: center;
      color: #D6D6D6;
      font-size: 12px;
    }
  }
  .default_two {
    margin-top: 30px;
    &_box_one{
      display: flex;
      min-width: 200px;
      justify-content: center;
      align-items: center;
      border: 1px solid #e1e1e1;
      border-left: none;
      border-bottom: none;
    }
    &_box_two{
      display: flex;
      width: 100%;
      justify-content: flex-start;
      align-items: center;
      border: 1px solid #e1e1e1;
      border-left: none;
      border-bottom: none;
      padding-left: 20px;
      input {
        outline: none;
        width: 80px;
        border: 1px solid #e1e1e1;
        padding: 5px;
        margin-left: 5px;
      }
    }
    .flex_center {
      justify-content: center;
    }
  }
  &_footer {
    display: flex;
    justify-content: center;
    margin-top: 40px;
  }
}
.modal_box {
  display: flex;
  align-items: center;
  span {
    min-width: 65px;
  }
}
</style>
