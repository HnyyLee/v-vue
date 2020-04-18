<template>
  <div class="siteDiteal">
    <header class="common_header">
      <a-icon type="book" />
      <span>{{detailTableList.constructionTitle}}</span>
    </header>
    <div class="currDom" @click="currorFn">
      <p data-num="1" class="splice">客户详情</p>
      <p data-num="2">施工日志</p>
      <p data-num="3">延期记录</p>
    </div>

    <div class="content">
      <div class="pageDom1" v-if="currVisibale == 1">
        <table class="holdTable" border="20">
          <tr>
            <td class="atd">客户姓名</td>
            <td class="btd">{{detailTableList.customerName}}</td>
          </tr>
          <tr>
            <td class="atd">手机号码</td>
            <td class="btd">{{detailTableList.customerPhone}}</td>
          </tr>
          <tr>
            <td class="atd">省市区</td>
            <td class="btd">{{detailTableList.province}}{{detailTableList.city}}{{detailTableList.district}}</td>
          </tr>
          <tr>
            <td class="atd">地址方式</td>
            <td class="btd">{{detailTableList.categoryType == '1' ? '自定义' : '非自定义'}}</td>
          </tr>
          <tr>
            <td class="atd">小区</td>
            <td class="btd">{{detailTableList.project}}</td>
          </tr>
          <tr>
            <td class="atd">楼栋</td>
            <td class="btd">{{detailTableList.building}}</td>
          </tr>
          <tr>
            <td class="atd">房号</td>
            <td class="btd">{{detailTableList.house}}</td>
          </tr>
          <tr>
            <td class="atd">来源</td>
            <td class="btd">{{detailTableList.sourceStr}}</td>
          </tr>
          <tr>
            <td class="atd">报单人</td>
            <td class="btd">{{detailTableList.submitter}}</td>
          </tr>
          <tr>
            <td class="atd">设计师</td>
            <td class="btd">{{detailTableList.designName}}</td>
          </tr>
          <tr>
            <td class="atd">装修意向</td>
            <td class="btd">{{detailTableList.comboTitle}}</td>
          </tr>
          <tr>
            <td class="atd">面积</td>
            <td class="btd">{{detailTableList.floorspaceNumber}}</td>
          </tr>
          <tr>
            <td class="atd">户型</td>
            <td class="btd">{{huxingFn()}}</td>
          </tr>
        </table>
        <table class="holdTable" border="20">
          <tr>
            <td class="atd">车辆</td>
            <td class="btd">{{detailTableList.car}}</td>
          </tr>
          <tr>
            <td class="atd">宠物</td>
            <td class="btd">{{detailTableList.pet}}</td>
          </tr>
          <tr>
            <td class="atd">家庭情况</td>
            <td class="btd">{{detailTableList.family}}</td>
          </tr>
          <tr>
            <td class="atd">个人兴趣</td>
            <td class="btd">{{detailTableList.interest}}</td>
          </tr>
          <tr>
            <td class="atd">特殊身份</td>
            <td class="btd">{{detailTableList.specialIdentity}}</td>
          </tr>
        </table>
        <div class="remarkDom">
          <p>备注</p>
          <div class="reamrkborder">
            <p v-if="myremark.length == 0" style="color: #D1D1D1;">暂无备注信息</p>
            <p v-for="(item, index) in myremark" :key="index">{{item}}</p>
          </div>
        </div>
      </div>

      <div v-if="currVisibale == 2">
        <div class="septDom">
          <a-steps direction="vertical" :current="3">
            <a-step class="steplist">
              <p type="user" slot="title">
                <span class="setptitle">开工大吉</span>
                <span class="formIcon" @click="editTimeFn" v-if="!inEdeailFlag"><a-icon type="form" /></span>
                <span class="quedingBtn" @click="quedingBtnFn" v-if="inEdeailFlag"><a-button type="primary" size="small">确定</a-button></span>
              </p>
              <div type="user" slot="description">
                <div class="chooseTime" v-show="inEdeailFlag">
                  <a-date-picker showTime format="YYYY-MM-DD HH:mm" :placeholder="startTime" @change="onChange" @ok="onOk" />
                </div>
                <p v-show="!inEdeailFlag">
                  {{startTime}}
                </p>
              </div>
            </a-step>

            <a-step class="steplist" title="施工日志，敬请期待" />

            <a-step class="steplist">
              <p type="user" slot="title">
                <span class="setptitle">圆满竣工</span>
                <span class="formIcon" @click="editendTimeFn" v-if="!inEndTimeFlag"><a-icon type="form" :class="{'hasSetStartTime': !isSetStartTime}" /></span>
                <span class="quedingBtn" @click="quedingEndFn" v-if="inEndTimeFlag"><a-button type="primary" size="small">确定</a-button></span>
              </p>
              <div type="user" slot="description">
                <div class="chooseTime" v-show="inEndTimeFlag">
                  <a-date-picker showTime format="YYYY-MM-DD HH:mm" :placeholder="endTime" @change="onEndChange" @ok="onEndOk" />
                </div>
                <p v-show="!inEndTimeFlag">
                  {{endTime}}
                </p>
              </div>
            </a-step>
          </a-steps>
        </div>
        
      </div>
      
      <div v-if="currVisibale == 3">
        <div class="deferTop">
          延期记录：
          <a-button class="deferredBtnDom" type="primary" @click="deferredBtnFn">延期记录上传</a-button>
        </div>
        <div class="deferredDom">
          <a-table :columns="deferColumns" :dataSource="deferList" bordered :pagination='false' :rowKey='record => record.id' 
            :locale="{ emptyText: '暂无数据' }">
            <template slot="pictures" slot-scope="text, scope" >
              <a class="apicDom" v-for="(pic,index) in scope.pictureName" :key="index" href="javascript:;"  @click="siteOrderGo(pic.purl, text, scope)">{{pic.name}}</a>
            </template>
          </a-table>
        </div>
      </div>
    </div>

    <!-- 上传延期记录弹框 -->
    <a-modal
      title="延期记录上传"
      v-model="deferPoplur"
      :maskClosable='false'
      @cancel="deferCancel"
      @ok="deferSubmit"
      okText="提交"
      width="720px"
      class="deferCreatDom">
      <a-form :form="form">
        <a-row :gutter="24">
          <a-form-item v-bind="formItemLayout" label="延期开始时间">
            <a-date-picker style="width: 75%" showTime format="YYYY-MM-DD HH:mm" placeholder="请选择延期开始时间" v-decorator="aVitery.pickDate" @change="deferOnChange" @ok="deferOnOk" />
          </a-form-item>
          <a-form-item v-bind="formItemLayout" label="预计延期天数">
            <a-input-number style="width: 75%" :min="0" :max="1000" v-decorator="aVitery.planDelayDay" @change="planDayonChange" />
          </a-form-item>
          <a-form-item v-bind="formItemLayout" label="延期原因">
            <a-select v-decorator="aVitery.reason" allowClear @change="reasonChange" style="width: 75%">
              <a-select-option v-for="(irn) in reasonList" :key="irn.delayReasonType">{{irn.delayReason}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item v-bind="formItemLayout" label="上传延期单">
            <a-spin :spinning="spinning">
              <div class="spin-content">
                <a-upload
                  :customRequest="myrequest"
                  listType="picture"
                  :remove="pictureRemove"
                  :defaultFileList="fileList" 
                  :multiple="true"
                  accept=".jpg,.png,.jpeg,.bmp"
                  :beforeUpload="beforeUpload"
                  @change="picturChange">
                  <a-button>
                    <a-icon type="upload" /> 上传图片
                  </a-button>
                </a-upload>
              </div>
            </a-spin>
          </a-form-item>
        </a-row>
      </a-form>
    </a-modal>

  </div>
</template>
<script>

import { deferColumns, aVitery } from './js/index'

export default {
  data () {
    return {
      currVisibale: 1, // 默认显示详情页面
      detailTableList: '', // 表格数据
      inEdeailFlag: false, // 处于编辑状态
      startTime: '', // 开始时间
      inEndTimeFlag: false, // 处于编辑状态
      endTime: '', // 最终时间
      deferColumns,
      deferList: [],
      pageNum: 1,
      pageSize: 10,
      deferPoplur: false, // 延期记录弹框显示影藏
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        }
      },
      aVitery,
      planDelayDay: '', //延期天数值
      reasonList: [], // 延期原因的下拉框数据
      fileList: [],
      spinning: false,
      myremark: [], // 备注的信息
      isSetStartTime: true, // 是否设置了开工时间,默认为设置了
    }
  },
  components: {
    
  },
  created () {
    this.getSiteDetail()
    this.startTime = JSON.parse(sessionStorage.getItem('siteOrderData')).realStartConstructionTime || '未设置开工时间'
    this.endTime = JSON.parse(sessionStorage.getItem('siteOrderData')).realEndConstructionTime || '未设置竣工时间'
    this.getDeferData()
    // 在获取施工竣工时间的为本地时间，重新调用列表接口来获取最新时间
    this.getSiteDataList()
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  methods: {
    // 工地列表接口
    getSiteDataList () {
      let sdata = {
        pageNum: JSON.parse(sessionStorage.getItem('sitePageData')).pageNum,
        pageSize: JSON.parse(sessionStorage.getItem('sitePageData')).pageSize
      }
      this.$request.get('/rbs-constr/construction/list', { params: sdata}).then(res => {
        if (res.code === 0) {
          res.result.list.forEach(res => {
            if (res.id == JSON.parse(sessionStorage.getItem('siteOrderData')).id) {
              this.startTime = res.realStartConstructionTime || '未设置开工时间'
              this.endTime = res.realEndConstructionTime || '未设置竣工时间'
            }
          })
          if (this.startTime.indexOf('20') == -1) {
            this.isSetStartTime = false
          } else {
            this.isSetStartTime = true
          }
        }
      })
    },
    huxingFn() {
      let anum = this.detailTableList.bedroomNumber ? this.detailTableList.bedroomNumber : '0'
      let bnum = this.detailTableList.livingNumber ? this.detailTableList.livingNumber : '0'
      let cnum = this.detailTableList.kitchensNumber ? this.detailTableList.kitchensNumber : '0'
      let dnum = this.detailTableList.bathroomsNumber ? this.detailTableList.bathroomsNumber : '0'
      return anum + '房' + bnum + '厅' + cnum + '厨房' + dnum + '卫'
    },
    // 获取详情数据
    getSiteDetail() {
      let aid = this.$route.query.id
      this.$request.get(`/rbs-constr/construction/site/${aid}`).then(res => {
        if (res.code === 0) {
          this.detailTableList = res.result
          this.myremark = this.detailTableList.remarks || []
        }
      })
    },
    // 切换事件
    currorFn(ev) {
      document.querySelectorAll('.currDom p').forEach(dom => {
        dom.classList.remove('splice')
      })
      ev.target.classList.add('splice')
      if (ev.target.dataset.num == '1') {
        this.currVisibale = 1
      } else if (ev.target.dataset.num == '2') {
        this.currVisibale = 2
      } else if (ev.target.dataset.num == '3') {
        this.currVisibale = 3
        this.getDeferData()
      }
    },
    // 点击编辑时间事件
    editTimeFn() {
      this.inEdeailFlag = true
    },
    editendTimeFn() {
      if (this.startTime.indexOf('20') == -1) {
        this.isSetStartTime = false
        this.$message.info('请先设置开工时间')
      } else {
        this.isSetStartTime = true
        this.inEndTimeFlag = true
      }
    },
    // 时间组件
    onChange(value, dateString) {
      this.startTime = dateString
    },
    onEndChange(value, dateString) {
      this.endTime = dateString
    },
    onOk(value, dateString) {
      this.callbackFn()
    },
    onEndOk(value, dateString) {
      this.endCallbackFn()
    },
    // 开始按钮的确定事件
    quedingBtnFn() {
      this.callbackFn()
    },
    // 结束按钮的确定事件
    quedingEndFn () {
      this.endCallbackFn()
    },
    callbackFn() {
      let sdata = {
        id: JSON.parse(sessionStorage.getItem('siteOrderData')).id,
        dateTime: this.startTime
      }
      this.$request.post('/rbs-constr/construction/site/begun', sdata).then(res => {
        if (res.code === 0) {
          this.$message.success('设置开工日期成功')
          this.isSetStartTime = true
          this.inEdeailFlag = false
        }
      })
    },
    endCallbackFn() {
      let sdata = {
        id: JSON.parse(sessionStorage.getItem('siteOrderData')).id,
        dateTime: this.endTime
      }
      this.$request.post('/rbs-constr/construction/site/completed', sdata).then(res => {
        if (res.code === 0) {
          this.$message.success('设置竣工日期成功')
          this.inEndTimeFlag = false
        }
      })
    },
    // 获取延期记录的数据
    getDeferData() {
      let sdata = {
        pageNum: 1,
        pageSize: 10,
        constructionSiteId: JSON.parse(sessionStorage.getItem('siteOrderData')).id
      }
      this.$request.get('/rbs-constr/construction/delay/list', { params: sdata}).then(res => {
        if (res.code === 0) {
          this.deferList = res.result.list
          let anum = 0
          this.deferList.forEach(item => {
            if (item.pictures) {
              if (item.pictures.length !== 0) {
                let aPicList = []
                anum = 0
                item.pictures.forEach(pic => {
                  anum += 1
                  let pobj = {
                    purl: pic,
                    name: `图${anum}`
                  }
                  aPicList.push(pobj)
                  item.pictureName = aPicList
                })
              }
            }
          })
        }
      })
    },
    // 点击延期记录上传按钮
    deferredBtnFn() {
      this.deferPoplur = true
      this.$forceUpdate()
      this.form.resetFields()
      this.getreseonDate()

      this.fileList = []
      let aPdom = document.querySelector('.ant-upload-list.ant-upload-list-picture')
      if (aPdom) {
        document.querySelector('.ant-upload-list.ant-upload-list-picture').innerHTML = ''
      }
      
    },
    // 获取延期原因下拉款数据
    getreseonDate() {
      this.$request.get('/rbs-constr/construction/delay-reason/list').then(res => {
        if (res.code === 0) {
          if (res.result) {
            this.reasonList = res.result
          }
        }
      })
    },
    // 弹框取消事件
    deferCancel() {
      this.deferPoplur = false
    },
    // 点击提交事件
    deferSubmit(e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          if (this.fileList.length == 0) {
            this.$message.info('请先上传延期单')
            return
          }
          let sendPicturList = []
          this.fileList.forEach(fil => {
            sendPicturList.push(fil.url)
          })
          let anewData = new Date(values.pickDate._d);
          let changeDate = anewData.getFullYear() + '-' + (anewData.getMonth() + 1) + '-' + anewData.getDate() + ' ' + anewData.getHours() + ':' + anewData.getMinutes() + ':' + anewData.getSeconds();
          let sdata = {
            constructionSiteId: JSON.parse(sessionStorage.getItem('siteOrderData')).id,
            delayStartTime: changeDate,
            planDelayDay: values.planDelayDay,
            delayReasonType: values.reason,
            pictures: sendPicturList
          }
          this.$request.post('/rbs-constr/construction/delay/log', sdata).then(res => {
            if (res.code === 0) {
              this.deferPoplur = false
              this.$message.success('延期记录上传成功')
              this.getDeferData()
            }
          })
        }
      })
    },
    // 弹框的时间组件事件
    deferOnChange(data, time) {
      
    },
    deferOnOk(dafd) {
      
    },
    // 延期天数的事件
    planDayonChange() {

    },
    // 延期原因事件
    reasonChange() {
      
    },
    // 移除图片
    pictureRemove(ipen) {
      this.fileList = this.fileList.filter(item => {
        return item.uid !== ipen.uid
      })
      return true
    },
    picturChange(adata, event) {
      
    },
    // 上传图片之前的回调
    beforeUpload(file, filesList) {
      if (file.type.indexOf('jpg') !== -1 || file.type.indexOf('png') !== -1 || file.type.indexOf('jpeg') !== -1 || file.type.indexOf('bmp') !== -1) {
        return true
      }
    },
    myrequest(adata) {
      const sendObj = new FormData()
      sendObj.append("file", adata.file)
      this.spinning = true
      this.$request({
        method: "post",
        url: '/rbs-constr/construction/uploadDesignPicture',
        headers: {
          "Content-Type": "multipart/form-data;charset=UFT-8"
        },
        data: sendObj
      }).then(res => {
        if (res.code === 0) {
          this.spinning = false
          let savePictureObj = {
            uid: adata.file.uid,
            name: 'xxx.png',
            status: 'done',
            url: res.result,
            thumbUrl: res.result,
          }
          this.fileList.push(savePictureObj)
          this.$message.success('上传图片成功')
        } else {
          this.spinning = false
        }
      }).catch(err => {
        this.spinning = false
        let warpDom = document.querySelectorAll('.ant-upload-list-item.ant-upload-list-item-uploading')
        if (warpDom) {
          document.querySelectorAll('.ant-upload-list-item.ant-upload-list-item-uploading').forEach(idem => {
            let picText = idem.querySelector('.ant-upload-list-item-info span .ant-upload-list-item-name').innerHTML
            if (!(picText.indexOf('jpg') !== -1 || picText.indexOf('png') !== -1 || picText.indexOf('jpeg') !== -1 || picText.indexOf('bmp') !== -1)) {
              idem.remove()
            }
          })
        }
      })
    },
    // 点击展示
    siteOrderGo(purl, scope, data) {
      window.open(purl)
    }
  }
}
</script>
<style lang="scss">
.siteDiteal {
  padding: 0px 10px 0px;
  .content{
    padding: 20px 0px 0px;
    .holdTable{
      border: 1px solid #E6E6E6;
      width: 100%;
      margin-bottom: 15px;
      tr{
        line-height: 48px;
      }
      .atd {
        width: 25%;
        text-align: right;
        padding-right: 20px;
        background: #F7F7F7;
      }
      .btd{
        padding-left: 20px
      }
    }
    .septDom{
      margin-top: 30px;
      .steplist{
        height: 200px;
        position: relative;
      }
      .setptitle{
        font-weight: bold;
        font-size: 20px;
      }
      .hasSetStartTime{
        color: #CBCBCB;
      }
      .formIcon{
        font-size: 35px;
        color: #0099CC;
        position: absolute;
        left: 100px;
      }
      .quedingBtn{
        margin-left: 25px;
      }
    }
    .deferTop{
      margin-bottom: 20px;
      .deferredBtnDom{
        float: right;
      }
    }
  }
  .currDom{
    margin-top: 35px;
    p{
      display: inline-block;
      width: 150px;
      line-height: 50px;
      background: #76BFFF;
      color: #fff;
      margin-right: 25px;
      text-align: center;
    }
    .splice{
      background: #1590FF;
    }
    p:hover{
      background: #1590FF;
      cursor: pointer;
    }
  }
  .remarkDom{
    .reamrkborder{
      border: 1px solid #E3E3E3;
      border-radius: 4px;
      p{
        margin: 0px;
        line-height: 46px;
        text-indent: 10px;
      }
    }
  }
  .apicDom{
    margin-right: 15px;
  }
}
.ant-progress-outer{
  display: none!important;
}
.ant-upload-list-picture .ant-upload-list-item-uploading .ant-upload-list-item-name{
  margin-top: 10px;
}
.ant-upload-list-item.ant-upload-list-item-uploading{
  display: inline-block;
  margin-right: 5px;
}
</style>
