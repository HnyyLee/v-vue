<template>
  <div class="government">
    <h3>管辖范围配置</h3>
    <div class="government_header">
      <a-button type='primary' class="btn_add" @click="add" v-if="RouterNameFlag[mythat.$route.name] || RouterNameFlag['government_create']">新增配置</a-button>
    </div>
    <a-table :columns="columns" :dataSource="dataArr" bordered :rowKey='record => record.id' :pagination='false' :locale='locale'>
      <div slot="listCitys" slot-scope="text, item">
        <div class="government_deploy_box">
          <span v-for="val in text" :key='val.id'>
            {{val.orgName}}
            <a-icon type="close-circle" @click="deleteFun(item.id, val)" class="sms_phone_delelt" />
          </span>
        </div>
        <a-button type='primary' @click="addCity(item.id)">添加管辖城市</a-button>
      </div>
    </a-table>
    <div class="government_header">
      <a-pagination showSizeChanger :pageSize.sync="pageSize" @showSizeChange="onShowSizeChange" :total="total" v-model="current" style="margin-top: 30px;"/>
    </div>
    <a-modal
      title="新增配置"
      :visible="visible"
      :maskClosable='false'
      @ok="handleOk"
      @cancel="handleCancel"
      okText='确定'
      cancelText='取消'
      :okButtonProps="{ props: { loading: goverBtnLoading } }">
      <div>
        <span style="margin-right: 10px">组织名称：</span>
        <a-select style="width: 80%;" v-model="componyId" placehoder='请选择组织名称'>
          <a-select-option v-for="item in componyList" :key="item.orgCode" :value='item.orgCode'>{{item.orgName}}</a-select-option>
        </a-select>
      </div>
      <div style="margin-top: 20px;">
        <span style='width: 15%; margin-right: 10px'>所属省份：</span>
        <a-select style="width: 80%" placeholder="请选择省份" @change="getCityListOne">
          <a-select-option v-for="item in provinList" :key="item.code" :value='item.code'>{{item.name}}</a-select-option>
        </a-select>
      </div>
      <div style="margin-top: 20px;">
        <span style='width: 15%; margin-right: 10px'>所辖城市：</span>
        <a-select  v-model="cityName" mode="multiple" style="width: 80%" placeholder="请选择所辖城市">
          <a-select-option v-for="item in cityListAdd" :key="item.code" :value='item.name'>{{item.name}}</a-select-option>
        </a-select>
      </div>
    </a-modal>
    <a-modal
      title="删除所辖城市"
      :visible="visible2"
      :maskClosable='false'
      @ok="deleteFunOk"
      @cancel="handleCancel"
      okText='确定'
      cancelText='取消'
      :okButtonProps="{ props: { loading: goverDelLoading } }">
      <div>
        是否删除当前所辖城市
      </div>
    </a-modal>
    <a-modal
      title="添加所辖城市"
      :visible="visible3"
      :maskClosable='false'
      @ok="addCityOk"
      @cancel="handleCancel"
      okText='确定'
      cancelText='取消'
      :okButtonProps="{ props: { loading: goverAddLoading } }">
      <div style="margin-top: 20px;">
        <span style='width: 15%; margin-right: 10px'>所属省份：</span>
        <a-select style="width: 80%" placeholder="请选择省份" @change="getCityListOne">
          <a-select-option v-for="item in provinList" :key="item.code" :value='item.code'>{{item.name}}</a-select-option>
        </a-select>
      </div>
      <div style="margin-top: 20px;">
        <span style='width: 15%; margin-right: 10px'>所辖城市：</span>
        <a-select  v-model="cityName2" mode="multiple" style="width: 80%" placeholder="请选择所辖城市">
          <a-select-option v-for="item in cityListAdd" :key="item.code" :value='item.code'>{{item.name}}</a-select-option>
        </a-select>
      </div>
    </a-modal>
  </div>
</template>
<script>
import Api from '@/common/api/api.js'
import { myPower } from '@/common/utils/power.js'

export default {
  data () {
    return {
      mythat: this,
      current: 1,
      pageSize: 10,
      locale: { emptyText: '暂无数据' },
      componyId: '', // 选择了组织权限Id
      cityName: [],
      cityName2: [],
      visible: false, // 是否显示新增弹窗
      visible2: false, // 是否显示删除弹窗
      visible3: false, // 是否显示添加城市弹窗
      total: 0, // 总数
      // provinId: '', // 省份Id
      provinList: [], // 省份数组
      dataArr: [], // 列表数据
      cityListAdd: [], // 选择城市列表
      cityListEidt: [],
      componyList: [], // 城市公司组织列表
      columns: [
        {
          title: '组织名称',
          align: 'center',
          dataIndex: 'companyName'
        },
        {
          title: '所辖城市站',
          align: 'center',
          dataIndex: 'listCitys',
          scopedSlots: { customRender: 'listCitys' }
        }
      ],
      cityNameFlag: '', // 直辖市名字
      // 删除临时存储信息
      deleteId: '', // 删除Id
      deleteInfo: [], // 删除的数据
      // 新增
      addcityListId: '', // 添加的列表
      goverBtnLoading: false, // 新增配置弹框提交按钮的loading
      goverDelLoading: false, // 删除所辖城市弹框提交按钮的loading
      goverAddLoading: false, // 添加所辖城市提交按钮的loading
    }
  },
  created () {
    this.getList()
    // this.getCityList()
    this.getCompanyCity()
    this.getProvin()
  },
  mixins: [myPower],
  watch: {
    current (val) {
      this.current = val
      this.getList()
    }
  },
  methods: {
    getProvin () { // 获取省份
      Api.getProvinceList().then(res => {
        if (res.code === 0) {
          this.provinList = res.result
        }
      })
    },
    getCityListOne (e) {
      e = e - 0
      if (e === 110000000000 || e === 310000000000 || e === 310000000000 || e === 500000000000) {
        this.provinList.forEach(item => {
          if (item.code - 0 === e) {
            this.cityNameFlag = item.name
          }
        })
      }
      console.log(this.cityNameFlag)
      Api.getCityList(e).then(res => { // 城市列表
        if (res.code === 0) {
          this.cityListAdd = res.result
        }
      })
    },
    getList () { // 列表数据
      let obj = {
        pageNum: this.current,
        pageSize: this.pageSize
      }
      this.$request.post('/companyCityManager/getPageCompanyCity', obj).then(res => {
        if (res.code === 0) {
          // this.dataArr = []
          if (res.result.list) {
            this.dataArr = res.result.list
            // res.result.list.forEach(item => {
            //   let obj = item
            //   obj.isFlag = false
            //   this.dataArr.push(obj)
            // })
          } else {
            this.dataArr = []
          }
          this.total = res.result.total
        }
      })
    },
    getCityList () { // 城市列表数据
      this.$request.get('/battleChartDataAccess/findAllCityChoiceList').then(res => {
        if (res.code === 0) {
          this.cityList = res.result
        }
      })
    },
    getCompanyCity () {
      this.$request.get('/organizeDataAccess/findLaborCityCompanyList').then(res => {
        if (res.code === 0) {
          this.componyList = res.result
        }
      })
    },
    add () { // 新增权限公司范围配置
      this.visible = true
      this.cityListAdd = []
    },
    handleCancel () { // 取消按钮
      this.goverBtnLoading = false
      this.goverDelLoading = false
      this.goverAddLoading = false
      this.visible = false
      this.visible2 = false
      this.visible3 = false
    },
    handleOk () { // 确认添加
      let componObj = {}
      let cityArr = []
      this.componyList.forEach(item => {
        if (item.orgCode === this.componyId) {
          componObj = item
        }
      })
      this.cityName.forEach(item => {
        this.cityListAdd.forEach(citem => {
          if (item === citem.name) {
            let obj = {
              orgName: citem.name,
              orgCode: citem.code
            }
            cityArr.push(obj)
          }
        })
      })
      console.log(this.cityNameFlag)
      if (cityArr[0].orgName === '直辖市') { // 直辖市特殊处理
        cityArr[0].orgName = this.cityNameFlag
      }
      if (this.componyId === '') {
        this.$message.error('请选择组织名称')
        return
      }
      if (this.cityName.length === 0) {
        this.$message.error('请先选择所辖城市')
        return
      }
      let obj = {
        companyCode: componObj.orgCode,
        companyName: componObj.orgName,
        listCitys: cityArr
      }
      this.goverBtnLoading = true
      this.$request.post('/companyCityManager/addOrUpdateCompanyCity', obj).then(res => {
        if (res.code === 0) {
          this.goverBtnLoading = false
          this.visible = false
          // 重置信息
          this.cityName = []
          this.componyId = ''
          this.getList()
        }
      })
    },
    deleteFun (id, val) { // 删除
      // 重置在赋值
      this.deleteId = ''
      this.deleteInfo = []
      this.visible2 = true
      this.deleteId = id
      this.deleteInfo.push(val)
    },
    deleteFunOk () { // 确认删除
      let obj = {
        id: this.deleteId,
        listCitys: this.deleteInfo
      }
      this.goverDelLoading = true
      this.$request.post('/companyCityManager/deleteOneCityById', obj).then(res => {
        if (res.code === 0) {
          this.goverDelLoading = false
          this.$message.success('删除成功')
          this.visible2 = false
          this.getList()
        }
      })
    },
    addCity (id) { // 单个添加管辖城市
      this.visible3 = true
      this.addcityListId = id
      this.cityName2 = []
      this.cityListAdd = []
    },
    addCityOk () { // 确定添加城市
      let arr = []
      this.cityName2.forEach(item => {
        this.cityListAdd.forEach(citem => {
          if (item === citem.code) {
            let obj = {
              orgName: citem.name,
              orgCode: citem.code
            }
            arr.push(obj)
          }
        })
      })
      if (arr.length === 0) {
        this.$message.error('请先添加城市')
        return
      }
      if (arr[0].orgName === '市辖区') { // 直辖市特殊处理
        arr[0].orgName = this.cityNameFlag
      } else if (arr.length === 2) {
        if (arr[1].orgName === '市辖区') {
          arr[1].orgName = this.cityNameFlag
        }
      }
      let obj = {
        id: this.addcityListId,
        listCitys: arr
      }
      this.$request.post('/companyCityManager/addOneCityById', obj).then(res => {
        if (res.code === 0) {
          this.$message.success('添加成功')
          this.visible3 = false
          this.getList()
        }
      })
    },
    onShowSizeChange (current, pageSize) {
      this.pageSize = pageSize
      this.getList()
    }
  }
}
</script>
<style lang="scss">
.government{
  .government_deploy_box {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
    span {
      padding: 10px;
      margin-left: 10px;
      margin-top: 10px;
      background-color: aquamarine;
      border-radius: 8px;
      position: relative;
      .sms_phone_delelt {
        position: absolute;
        font-size: 20px;
        top: -5px;
        right: -5px;
      }
    }
  }
  .btn_add{
    background: #85CE61;
    border: 1px solid #85CE61;
  }
  .government_header {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
  }
}

</style>
