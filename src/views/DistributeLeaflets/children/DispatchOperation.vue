<!---->
<template>
  <div class="DispatchOperation">
    <common-header :value='infoValue' v-if="this.$route.query.budgetPageFlag" :routerList="routerList"></common-header>
    <common-header :value='infoValue' v-else></common-header>

    <!-- 第一个form验证：客户信息 -->
    <div class="btn_box" v-if="this.pageSouce === 'gdxq'">
      <a-button type="primary" @click="boundUser" v-if="(boundFlag && orderStatis != 0) && (RouterNameFlag[mythat.$route.name] || RouterNameFlag['order_binding_userId'])">绑定userId</a-button>
      <!-- 关闭工单现在先隐藏掉，后面接口的权限管理接口完善之后再统一配置按钮权限,暂时增加display:none -->
      <a-button type="primary" @click="closOrderFun" v-if="(closFlag && orderStatis != 0) && (RouterNameFlag[mythat.$route.name] || RouterNameFlag['order_workorder_close'])" style="margin-left: 20px;">关闭工单</a-button>
    </div>
    <div class="dispat_box_tabble">
      <div class="dispat_box_tabble_header">
        <span>客户信息</span>
        <a-button class="editBtnDom" type="primary" @click="editThink" v-if="(eidtFlag === 2 && orderStatis != 0) && (RouterNameFlag[mythat.$route.name] || RouterNameFlag['order_customer_edit'])">编辑</a-button>
        <a-button class="editBtnDom" type="primary" @click="saveFun" v-if="(eidtFlag === 1) && (RouterNameFlag[mythat.$route.name] || RouterNameFlag['order_customer_edit'])">保存</a-button>
      </div>
      <a-form :form="formTab">
        <div class="dispat_table_box">
          <div class="dispat_table_content">
            <div class="dispat_table_content_left">客户姓名</div>
            <div class="dispat_table_content_right">
              <span v-if="eidtFlag === 2">{{client.customerName ? client.customerName : ''}}</span>
              <a-form-item has-feedback v-if="eidtFlag === 1" style="margin-bottom: 0">
                <a-input v-decorator="verify.peopleName" placeholder='输入客户姓名'></a-input>
              </a-form-item>
            </div>
          </div>
          <div class="dispat_table_content">
            <div class="dispat_table_content_left">手机号码</div>
            <div class="dispat_table_content_right">
              <span v-if="eidtFlag === 2 || (eidtFlag === 1 && myGetOrderStatus >= 210)">{{client.customerPhone ? client.customerPhone : ''}}</span>
              <a-form-item has-feedback v-if="eidtFlag === 1 && myGetOrderStatus < 210" style="margin-bottom: 0">
                <a-input v-decorator="verify.phoneNumber" :disabled='true' placeholder='输入手机号码'></a-input>
              </a-form-item>
            </div>
          </div>
          <div class="dispat_table_content">
            <div class="dispat_table_content_left">省市区</div>
            <div class="dispat_table_content_right">
              <span v-if="eidtFlag === 2 || (eidtFlag === 1 && myGetOrderStatus >= 210)">{{client.province ? client.province : ''}}{{client.city ? client.city : ''}}{{client.district ? client.district : ''}}</span>
              <a-row :gutter="24">
                <a-col span='7'>
                  <a-form-item has-feedback v-if="eidtFlag === 1 && myGetOrderStatus < 210" style="margin-bottom: 0">
                    <a-select v-decorator="verify.province" showSearch optionFilterProp='children'
                    placeholder="请选择省份" :notFoundContent='notFoundObj.provinceNot' @change="getCityList" style="width: 100%" >
                      <a-select-option v-for="(opt) in provinceList" :key="opt.name" :value="opt.code">{{opt.name}} </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col span='7'>
                  <a-form-item has-feedback v-if="eidtFlag === 1 && myGetOrderStatus < 210" style="margin-bottom: 0">
                    <a-select v-decorator="verify.city" placeholder="请选择城市" showSearch optionFilterProp='children'
                    :notFoundContent='notFoundObj.cityNot' @change="getDistru" style="width: 100%" >
                      <a-select-option v-for="(opt) in cityList" :key="opt.name" :value="opt.code">{{opt.name}}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col span='7'>
                  <a-form-item has-feedback v-if="eidtFlag === 1 && myGetOrderStatus < 210" style="margin-bottom: 0">
                    <a-select v-decorator="verify.area" placeholder="请选择区域" showSearch allowClear optionFilterProp='children'
                    :notFoundContent='notFoundObj.areaNot' @change="getAreaFun" style="width: 100%" >
                      <a-select-option v-for="(opt) in areaList" :key="opt.name" :value="opt.code">{{opt.name}}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
          </div>
          <div class="dispat_table_content">
            <div class="dispat_table_content_left">地址方式</div>
            <div class="dispat_table_content_right">
              <a-radio-group v-model="address" @change="aRadioChangFn">
                <a-radio :value='1' :disabled='isRadioShowAbleFn()'>自定义地址</a-radio>
                <a-radio :value='2' :disabled='isRadioShowAbleFn()'>非自定地址</a-radio>
              </a-radio-group>
            </div>
          </div>
          <div class="dispat_table_content">
            <div class="dispat_table_content_left">小区</div>
            <div class="dispat_table_content_right">
              <span v-if="eidtFlag === 2 || (eidtFlag === 1 && myGetOrderStatus >= 210)">{{client.project ? client.project : ''}}</span>
              <a-spin :spinning="mySpingFlagOne">
                <a-form-item has-feedback v-if="eidtFlag === 1 && address === 2 && myGetOrderStatus < 210" style="margin-bottom: 0">
                  <a-select v-decorator="verify.residential" placeholder="请选择小区" showSearch optionFilterProp='children'
                  :notFoundContent='notFoundObj.residentialNot' @change="getBuildingList" @select="buildlistSearchFn" style="width: 100%" >
                    <a-select-option v-for="(opt) in projectList" :key="opt.name" :value="opt.code">{{opt.name}}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-spin>
              <a-form-item has-feedback v-if="eidtFlag === 1 && address === 1 && myGetOrderStatus < 210" style="margin-bottom: 0">
                <a-input v-decorator="verify.residenInput"></a-input>
              </a-form-item>
            </div>
          </div>
          <div class="dispat_table_content">
            <div class="dispat_table_content_left">楼栋</div>
            <div class="dispat_table_content_right">
              <span v-if="eidtFlag === 2 || (eidtFlag === 1 && myGetOrderStatus >= 210)">{{client.building ? client.building : ''}}</span>
              <a-spin :spinning="mySpingFlagTwo">
                <a-form-item has-feedback v-if="eidtFlag === 1 && address === 2 && myGetOrderStatus < 210" style="margin-bottom: 0">
                  <a-select v-decorator="verify.ridgepole" placeholder="请选择楼栋" showSearch optionFilterProp='children'
                  :notFoundContent='notFoundObj.buildinhNot' @change="getHouseList" @select="houselistSearchFn" style="width: 100%" >
                    <a-select-option v-for="(opt) in buildingList" :key="opt.name" :value="opt.code">{{opt.name}}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-spin>
              <a-form-item has-feedback v-if="eidtFlag === 1 && address === 1 && myGetOrderStatus < 210" style="margin-bottom: 0">
                <a-input v-decorator="verify.ridgepInput"></a-input>
              </a-form-item>
            </div>
          </div>
          <div class="dispat_table_content">
            <div class="dispat_table_content_left">房号</div>
            <div class="dispat_table_content_right">
              <span v-if="eidtFlag === 2 || (eidtFlag === 1 && myGetOrderStatus >= 210)">{{client.house ? client.house : ''}}</span>
              <a-spin :spinning="mySpingFlagThree">
                <a-form-item has-feedback v-if="eidtFlag === 1 && address === 2 && myGetOrderStatus < 210" style="margin-bottom: 0">
                  <a-select v-decorator="verify.room" placeholder="请选择房号" showSearch optionFilterProp='children'
                  @change="getHouseValue" :notFoundContent='notFoundObj.roomNot' style="width: 100%" >
                    <a-select-option v-for="(opt) in houseList" :key="opt.name" :value="opt.code">{{opt.name}}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-spin>
              <a-form-item has-feedback v-if="eidtFlag === 1 && address === 1 && myGetOrderStatus < 210" style="margin-bottom: 0">
                <a-input v-decorator="verify.roomInput"></a-input>
              </a-form-item>
            </div>
          </div>
          <div class="dispat_table_content">
            <div class="dispat_table_content_left">来源</div>
            <div class="dispat_table_content_right">
              <span v-if="eidtFlag === 2 || (eidtFlag === 1 && myGetOrderStatus >= 210)">{{client.sourceStr ? client.sourceStr : ''}}</span>
              <a-form-item has-feedback v-if="eidtFlag === 1 && myGetOrderStatus < 210" style="margin-bottom: 0">
                <a-select v-decorator="verify.source" placeholder="请选择来源" :notFoundContent='notFoundObj.sourceNot' @change="getSouceFun" style="width: 100%" >
                  <a-select-option v-for="(opt) in souceList" :key="opt.name" :value="opt.id">{{opt.title}}</a-select-option>
                </a-select>
              </a-form-item>
            </div>
          </div>
          <div class="dispat_table_content">
            <div class="dispat_table_content_left">报单人</div>
            <div class="dispat_table_content_right">
              <span v-if="eidtFlag === 2 || (eidtFlag === 1 && myGetOrderStatus >= 210)">{{client.submitter ? client.submitter : ''}}</span>
              <a-form-item v-if="eidtFlag === 1 && myGetOrderStatus < 210" style="margin-bottom: 0">
                <a-input v-decorator="verify.personnel" placeholder="请输入报单人" />
                <!-- <a-input v-decorator="verify.personnel" placeholder="请输入报单人手机号码" style="width: 80%;margin-right: 10px;" />
                <a-button @click="searching" type='primary'>检索</a-button>
                <div v-if="selectSubmit">
                  <span v-if="submitterFlag">已选择报单人：{{submitterInfo.name}}</span>
                  <span v-if="submitterFlag === false">暂无任何报单人</span>
                </div> -->
              </a-form-item>
            </div>
          </div>
          <div class="dispat_table_content" v-if="pageSouceFlag">
            <div class="dispat_table_content_left">设计师</div>
            <div class="dispat_table_content_right">
              <span class="showSpan">{{client.designName ? client.designName : ''}}</span>
              <!-- <a-button type="primary" v-if="this.pageSouce === 'sjsypd'">修改</a-button> -->
            </div>
          </div>
          <div class="dispat_table_content">
            <div class="dispat_table_content_left">装修意向</div>
            <div class="dispat_table_content_right">
              <span v-if="eidtFlag === 2 || (eidtFlag === 1 && myGetOrderStatus >= 210)">{{client.comboTitle ? client.comboTitle : ''}}</span>
              <a-form-item v-if="eidtFlag === 1 && myGetOrderStatus < 210" style="margin-bottom: 0">
                <a-select v-decorator="verify.decorate" mode="multiple" placeholder="请选择装修意向" :notFoundContent='notFoundObj.decorateNot' @focus='getDeoMess' @change="getDecoValue" style="width: 100%" >
                  <a-select-option v-for="(opt) in decorateList" :key="opt.title" :value="opt.id">{{opt.title}}</a-select-option>
                </a-select>
              </a-form-item>
            </div>
          </div>
          <div class="dispat_table_content">
            <div class="dispat_table_content_left">面积</div>
            <div class="dispat_table_content_right">
              <span v-if="eidtFlag === 2">{{client.floorspaceNumber}}㎡</span>
              <a-form-item v-if="eidtFlag === 1" style="margin-bottom: 0">
                <a-input v-decorator="verify.floorspaceNumber" placeholder="请输入面积" style="width: 80%;margin-right: 10px;" />
              </a-form-item>
            </div>
          </div>
          <div class="dispat_table_content" style="border-bottom: none">
            <div class="dispat_table_content_left">户型</div>
            <div class="dispat_table_content_right">
              <span v-if="eidtFlag === 2">
                {{client.bedroomNumber ? client.bedroomNumber : 0}}房&nbsp;{{client.livingNumber ? client.livingNumber : 0}}厅
                {{client.kitchensNumber ? client.kitchensNumber : 0}}厨&nbsp;{{client.bathroomsNumber ? client.bathroomsNumber : 0}}卫
              </span>
              <a-row :gutter="24">
                <a-col span='6'>
                  <a-form-item v-if="eidtFlag === 1" style="margin-bottom: 0">
                    <a-select v-decorator="verify.bedroomNumber" placeholder="请选择房间数量" style="width: 80%" >
                      <a-select-option v-for="(opt) in numberList" :key="opt" :value="opt">{{opt}} </a-select-option>
                    </a-select>房
                  </a-form-item>
                </a-col>
                <a-col span='6'>
                  <a-form-item v-if="eidtFlag === 1" style="margin-bottom: 0">
                    <a-select v-decorator="verify.livingNumber" placeholder="请选择客厅数量" style="width: 80%" >
                      <a-select-option v-for="(opt) in numberList" :key="opt" :value="opt">{{opt}}</a-select-option>
                    </a-select>厅
                  </a-form-item>
                </a-col>
                <a-col span='6'>
                  <a-form-item v-if="eidtFlag === 1" style="margin-bottom: 0">
                    <a-select v-decorator="verify.kitchensNumber" placeholder="请选择厨房数量" style="width: 80%" >
                      <a-select-option v-for="(opt) in numberList" :key="opt" :value="opt">{{opt}}</a-select-option>
                    </a-select>厨
                  </a-form-item>
                </a-col>
                <a-col span='6'>
                  <a-form-item v-if="eidtFlag === 1" style="margin-bottom: 0">
                    <a-select v-decorator="verify.bathroomsNumber" placeholder="请选择卫生间数量" style="width: 80%" >
                      <a-select-option v-for="(opt) in numberList" :key="opt" :value="opt">{{opt}}</a-select-option>
                    </a-select>卫
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
          </div>
        </div>
      </a-form>
    </div>
    <!-- 第二个form表单验证 -->
    <div class="dispat_box_tabble" style="margin-top: 40px;">
      <div class="dispat_box_tabble_header">
        <span>拓展信息(来自物业主数据)</span>
        <a-button class="editBtnDom" type="primary" @click="editTwoFun" v-if="(eidtTwoFlag === 2 && orderStatis != 0) && (RouterNameFlag[mythat.$route.name] || RouterNameFlag['order_ExpandInformation_edit'])">编辑</a-button>
        <a-button class="editBtnDom" type="primary" @click="saveTwoFun" v-if="(eidtTwoFlag === 1) && (RouterNameFlag[mythat.$route.name] || RouterNameFlag['order_ExpandInformation_edit'])">保存</a-button>
      </div>
      <a-form :form="formTwoTab">
        <div class="dispat_table_box">
          <div class="dispat_table_content">
            <div class="dispat_table_content_left">车辆</div>
            <div class="dispat_table_content_right">
              <span v-if="eidtTwoFlag === 2">{{client.car}}</span>
              <a-form-item has-feedback v-if="eidtTwoFlag === 1" style="margin-bottom: 0">
                <a-input v-decorator="verify.car" placeholder='请输入车辆'></a-input>
              </a-form-item>
            </div>
          </div>
          <div class="dispat_table_content">
            <div class="dispat_table_content_left">宠物</div>
            <div class="dispat_table_content_right">
              <span v-if="eidtTwoFlag === 2">{{client.pet}}</span>
              <a-form-item has-feedback v-if="eidtTwoFlag === 1" style="margin-bottom: 0">
                <a-input v-decorator="verify.pet" placeholder='请输入宠物'></a-input>
              </a-form-item>
            </div>
          </div>
          <div class="dispat_table_content">
            <div class="dispat_table_content_left">家庭情况</div>
            <div class="dispat_table_content_right">
              <span v-if="eidtTwoFlag === 2">{{client.family}}</span>
              <a-form-item has-feedback v-if="eidtTwoFlag === 1" style="margin-bottom: 0">
                <a-input v-decorator="verify.family" placeholder='请输入家庭情况'></a-input>
              </a-form-item>
            </div>
          </div>
          <div class="dispat_table_content">
            <div class="dispat_table_content_left">个人兴趣</div>
            <div class="dispat_table_content_right">
              <span v-if="eidtTwoFlag === 2">{{client.interest}}</span>
              <a-form-item has-feedback v-if="eidtTwoFlag === 1" style="margin-bottom: 0">
                <a-input v-decorator="verify.interest" placeholder='请输入个人兴趣'></a-input>
              </a-form-item>
            </div>
          </div>
          <div class="dispat_table_content" style="border-bottom: none">
            <div class="dispat_table_content_left">特殊身份</div>
            <div class="dispat_table_content_right">
              <span v-if="eidtTwoFlag === 2">{{client.specialIdentity}}</span>
              <a-form-item has-feedback v-if="eidtTwoFlag === 1" style="margin-bottom: 0">
                <a-input v-decorator="verify.specialIdentity" placeholder='请输入特殊身份'></a-input>
              </a-form-item>
            </div>
          </div>
        </div>
      </a-form>
    </div>
    <div class="dispat_box_tabble margin-top">
      <div class="dispat_box_tabble_header">
        <span>备注</span>
      </div>
      <!-- <a-textarea style="margin-top:10px;" placeholder="备注" v-model='crmRemark' :disabled='true' :rows="4"  /> -->
      <div class="dispat_box_tabble_remke" >
        <div v-if="crmRemarkList.length !== 0">
          <div v-for="item in crmRemarkList" :key="item.id">
            {{item}}
          </div>
        </div>
        <div v-if="crmRemarkList.length == 0">
          <p class="noneRemark">暂无备注信息</p>
        </div>
      </div>
    </div>
    <!-- CRM派单 -->
    <div class="TabDom" v-if="this.pageSouce === 'crmdpd' || this.pageSouce === 'crmypd'">
      <a-tabs :activeKey='orderStatus' @change="callback" type="card" border>
        <a-tab-pane tab="派单" key="2">
          <a-form :form="formOne">
            <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" class="leftLabelDom" label="派单对象">
              <a-select style="width: 200px" @change="selectChang" v-decorator="verify.design" placeholder="请选择设计负责人" :disabled='this.pageSouce === "crmypd"'>
                <a-select-option v-for="item in designList" :key="item.id" :value='item.id'>{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" class="leftLabelDom" label="备注">
              <a-textarea :disabled='this.pageSouce === "crmypd" || orderStatis == 0' v-decorator="verify.areaInput" :autosize="{ minRows: 4, maxRows: 8 }" maxlength="200" />
            </a-form-item>
            <a-form-item :label-col="formTailLayout.labelCol" :wrapper-col="formTailLayout.wrapperCol" v-if='this.pageSouce === "crmdpd"'>
              <a-button type="primary" @click="oneSubmitThink" style="width: 80px" size="large">
                提交
              </a-button>
              <a-button @click="cannalThink" style="margin-left: 25px;width: 80px" size="large">
                取消
              </a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane tab="定时再联系" key="4">
          <a-form :form="formTow">
            <a-form-item :label-col="formTailLayout.labelCol" class="centerLabelDom" label="下次联系时间">
              <a-date-picker
                v-decorator="verify.dateTime"
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="选择联系时间"
                @change="onChange"
                :disabled='this.pageSouce === "crmypd"' />
            </a-form-item>
            <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" class="leftLabelDom" label="备注">
              <a-textarea :disabled='this.pageSouce === "crmypd" || orderStatis == 0' v-decorator="verify.areaInput" :autosize="{ minRows: 4, maxRows: 8 }" maxlength="200" />
            </a-form-item>
            <a-form-item :label-col="formTailLayout.labelCol" :wrapper-col="formTailLayout.wrapperCol" v-if='this.pageSouce === "crmdpd"'>
              <a-button type="primary" @click="towSubmitThink" style="width: 80px" size="large">
                提交
              </a-button>
              <a-button @click="cannalThink" style="margin-left: 25px;width: 80px" size="large">
                取消
              </a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane tab="放弃" key="5">
          <a-form :form="formThree">
            <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" class="leftLabelDom" label="放弃原因">
              <a-select style="width: 200px" @change="selectChangGive" v-decorator="verify.giveUp" placeholder="请选择放弃原因" :disabled='this.pageSouce === "crmypd"'>
                <a-select-option v-for="item in giveList" :key="item.id" :value='item.id'>{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" class="leftLabelDom" label="备注">
              <a-textarea :disabled='this.pageSouce === "crmypd" || orderStatis == 0' v-decorator="verify.areaInput" :autosize="{ minRows: 4, maxRows: 8 }" maxlength="200" />
            </a-form-item>
            <a-form-item :label-col="formTailLayout.labelCol" :wrapper-col="formTailLayout.wrapperCol" v-if='this.pageSouce === "crmdpd"'>
              <a-button type="primary" @click="threeSubmitThink" style="width: 80px" size="large">提交</a-button>
              <a-button @click="cannalThink" style="margin-left: 25px;width: 80px" size="large">取消</a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>
    </div>
    <div v-if="this.pageSouce === 'sjsypd' || this.pageSouce === 'sjsdpd'">派单操作</div>
    <!-- 设计师派单 -->
    <div class="TabDom" v-if="this.pageSouce === 'sjsypd' || this.pageSouce === 'sjsdpd'">
      <a-tabs :accesskey='designStatus' @change="callback" type="card" border>
        <a-tab-pane tab="派单" key="10">
          <a-form :form="formDesign">
            <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" class="leftLabelDom" label="派单对象">
              <a-select style="width: 200px" @change="selectDesChang" v-decorator="verify.designPerson" placeholder="请选择设计师" :disabled='orderStatis == 0'>
                <a-select-option v-for="item in designList2" :key="item.id" :value='item.id'>{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" class="leftLabelDom" label="备注">
              <a-textarea :disabled='orderStatis == 0' v-decorator="verify.designRemak" :autosize="{ minRows: 4, maxRows: 8 }" maxlength="200" />
            </a-form-item>
            <a-form-item :label-col="formTailLayout.labelCol" :wrapper-col="formTailLayout.wrapperCol">
              <a-button type="primary" v-if="orderStatis != 0" @click="oneSubmitFrou" style="width: 80px" size="large">
                提交
              </a-button>
              <a-button @click="cannalThink" v-if="orderStatis != 0" style="margin-left: 25px;width: 80px" size="large">
                取消
              </a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>
    </div>

    <a-modal
      title="关闭工单"
      :visible="visible"
      @ok="closOrderOk"
      @cancel="colsOrderCandel"
      okText='确定'
      cancelText='取消'
      :maskClosable='false'
    >
      <a-checkbox-group :options="plainOptions" v-model="closOrderReason" />
    </a-modal>
  </div>
</template>

<script>
import verify from './js/index.js'
import Api from '@/common/api/api.js'
import CommonHeader from '@/components/CommonHeader/index.vue'
import moment from 'moment'
import { myPower } from '@/common/utils/power.js'

const formItemLayout = {
  labelCol: { span: 1 },
  wrapperCol: { span: 8 }
}
const formTailLayout = {
  labelCol: { span: 12 },
  wrapperCol: { span: 6, offset: 2 }
}
export default {
  data () {
    return {
      mythat: this,
      routerList: [
        {
          name: '详情',
          url: '/DispatchOperation',
          flag: 'workOrderDetail',
          budgetPageFlag: true
        },
        {
          name: '合同',
          url: '/contract',
          flag: 'workOrderContract',
          budgetPageFlag: true
        },
        {
          name: '主材选品',
          url: '/mainMaterials',
          flag: 'SelectionOfMain',
          budgetPageFlag: true
        },
        {
          name: '施工预算拆单',
          url: '/budgetSplit_child',
          flag: 'budgetSplit',
          budgetPageFlag: true
        },
        {
          name: '工程变更',
          url: '/add-decrease',
          flag: 'workOrderChange',
          budgetPageFlag: true
        },
      ],
      infoValue: {
        index: 0,
        orderId: '' // 工单Id
      },
      myGetOrderStatus: '', // 判断当前工单状态是否大于等于210，如果大于等于210就只能编辑“客户姓名”“面积”“户型”这三个
      pageSouceFlag: true, // 是否显示设计师
      closOrderReason: [], // 已经关闭的工单原因
      plainOptions: [],
      numberList: ['0', '1', '2', '3', '4', '5', '6'],
      visible: false, // 工单关闭弹窗
      // 页面参数-客户信息编辑参数
      topBtnTextOne: '编辑', // 按钮文字
      eidtFlag: 2, // 是否显示编辑模式；1为显示；2位不显示 (客户信息)
      eidtTwoFlag: 2, // 是否显示编辑模式；1为显示；2位不显示 （扩展信息）
      client: {}, // 客户信息对象信息（临时）
      verify: {}, // 验证对象信息
      provinceList: [], // 省份列表数据
      cityList: [], // 城市列表
      areaList: [], // 城市区域列表
      projectList: [], // 小区列表
      buildingList: [], // 楼栋列表
      houseList: [], // 房号列表
      souceList: [], // 来源
      decorateList: [], // 装修意向
      pageOne: { provn: 1, city: 1, pro: 1, buil: 1 }, // 点开编辑是否第一次获取接口
      // 派单tab的数据参数
      orderStatus: '2', // 选择派单模式 1,2位派单； 4会重新约定时间； 5.6.7位放弃
      designList: [], // 设计师负责人列表数据
      designList2: [], // 设计师列表数据
      giveList: [], // 放弃原因列表数据
      appointTime: '', // 重新预约时间
      designPersonId: '', // 设计负责人ID
      designPersonName: '', // 设计负责人Name
      giveUpReasonId: '', // 放弃原因
      // 设计资源派单；详情时；设置资源需要从上一个页面带过来；
      designId: '', // 设计师负id
      desigName: '', // 设计师名称
      designName: '', // 选择完之后（派单时候用）
      crmRemark: '', // CRM 备注
      crmRemarkList: [], // 备注列表
      gdId: '', // 工单ID
      designStatus: '2',
      closFlag: true, // 关闭工单按钮是否展示
      boundFlag: true, // 绑定按钮是否展示
      // 表单控制格式数据
      pageSouce: 'crmdpd', // 页面来源; 根据不同的页面；做页面操作控制；
      submitterFlag: false, // 看看是否存在报单人 false 为不存在
      selectSubmit: false, // 看看是否去触发报单检索； false为不没触发
      submitterInfo: {}, // 信息
      notFoundObj: {
        provinceNot: '暂无数据', // 省份
        cityNot: '暂无数据', // 城市
        areaNot: '暂无数据', // 区
        residentialNot: '暂无数据', // 小区
        buildinhNot: '暂无数据', // 楼栋
        roomNot: '暂无数据', // 房号
        decorateNot: '暂无数据', // 装修意向
        sourceNot: '暂无数据' // 来源
      },
      formItemLayout,
      formTailLayout,
      formTab: this.$form.createForm(this), // 客户信息表单
      formTwoTab: this.$form.createForm(this), // 扩展信息表单
      formOne: this.$form.createForm(this), // 设计师负责人
      formTow: this.$form.createForm(this), // 在预约时间
      formThree: this.$form.createForm(this), // 放弃原因
      formDesign: this.$form.createForm(this), // 是设计师派单
      orderStatis: 999, // 工单状态
      btnFlag: false, // 重复提交
      orderId: {}, // 工单信息
      address: 2, // 判断地址是自定义还是非自定义；1为自定义，2为非自定义
      mySpingFlagOne: false,
      mySpingFlagTwo: false,
      mySpingFlagThree: false,
      firstEditFlagOne: true, // 编辑客户第一次编辑的时候的标识
      firstEditFlagTwo: true, // 编辑客户第一次编辑的时候的标识
      firstEditFlagThree: true // 编辑客户第一次编辑的时候的标识
    }
  },
  mixins: [myPower],
  components: {
    CommonHeader
  },
  created () {
    this.orderId = JSON.parse(sessionStorage.getItem('orderValue'))
    this.pageSouce = this.$route.query.pageSouce
    this.verify = verify
    this.getgetInitializationData()
    if (this.$route.query.pageSouce === 'sjsypd') { // 设计师已派单
      this.getOrderStatus()
      this.designId = this.$route.query.desiId
      this.desigName = this.$route.query.desiName
      this.gdId = this.$route.query.gdId
      this.verify.designRemak[1].initialValue = this.$route.query.desRemake
      this.verify.designPerson[1].initialValue = this.$route.query.desiId
    } else if (this.pageSouce === 'sjsdpd') { // 组件BUG；手动设置initialValue；需要在手动清空；自动清空不了； 设计师待派单
      this.getOrderStatus()
      this.verify.designRemak[1].initialValue = undefined
      this.verify.designPerson[1].initialValue = undefined
    } else if (this.pageSouce === 'crmdpd') { // 组件BUG；手动设置initialValue；需要在手动清空；自动清空不了；CRM 待派单
      this.pageSouceFlag = false
      this.verify.giveUp[1].initialValue = undefined
      this.verify.design[1].initialValue = undefined
      this.verify.areaInput[1].initialValue = undefined
      this.verify.dateTime[1].initialValue = undefined
    } else if (this.pageSouce === 'crmypd') {
      this.pageSouceFlag = false
    } else if (this.pageSouce === 'gdxq') { // 工单详情
      this.getOrderStatus()
      // this.infoV
      if (this.$route.query.userId) { // 判断工单是否绑定过userID
        this.boundFlag = false
      } else {
        this.boundFlag = true
      }
      if (this.$route.query.status !== '已关闭') {
        this.closFlag = true
      } else {
        this.closFlag = false
      }
    }
    // this.designList = Api.getDesignList() // 设计师负责人
    if (this.designList.length === 0) {
      this.$request.get('/crm/user/design-manager').then(res => {
        if (res.code === 0) {
          this.designList = res.result
        }
      })
    }
    if (this.designList2.length === 0) {
      this.$request.get('/crm/user/design').then(res => {
        if (res.code === 0) {
          this.designList2 = res.result
        }
      })
    }
    this.giveList = Api.getGiveUpReason() // 离职原因
  },
  methods: {
    // 地址方式，点击编辑时候是否可以修改，大于等于210的时候不可修改
    isRadioShowAbleFn() {
      if (this.eidtFlag == 2) {
        return true
      } else if (this.eidtFlag == 1 && this.myGetOrderStatus >= 210) {
        return true
      } else if (this.eidtFlag == 1 && this.myGetOrderStatus < 210) {
        return false
      }
    },
    // 小区楼栋房号改变时候事件
    buildlistSearchFn (ev) {
      this.client.building = '' // 楼栋
      this.client.buildingCode = '' // 楼栋ID
      this.client.house = '' // 房号
      this.client.houseCode = '' // 房号ID
    },
    houselistSearchFn () {
      this.client.house = '' // 房号
      this.client.houseCode = '' // 房号ID
    },
    // 弹框单选按钮——自定义和非自定义选择改变事件
    aRadioChangFn (ev) {
      if (this.client.categoryType == 1) {
        this.client.projectCode = '' // 小区ID
        this.client.buildingCode = '' // 楼栋ID
        this.client.houseCode = '' // 房号ID
        this.verify.residential[1].initialValue = undefined // 小区
        this.verify.ridgepole[1].initialValue = undefined // 栋
        this.verify.room[1].initialValue = undefined // 房号
      } else {
        this.verify.residenInput[1].initialValue = undefined // 自定义小区
        this.verify.ridgepInput[1].initialValue = undefined // 自定义楼栋
        this.verify.roomInput[1].initialValue = undefined // 自定义房号
        this.verify.residential[1].initialValue = this.client.projectCode ? this.client.projectCode : undefined // 小区
        this.verify.ridgepole[1].initialValue = this.client.buildingCode ? this.client.buildingCode : undefined // 栋
        this.verify.room[1].initialValue = this.client.houseCode ? this.client.houseCode : undefined // 房号
      }
    },
    getOrderStatus () {
      this.$request.get('/projectWorkOrder/getWorkOrderBasicInfoByCode?workOrderNumber=' + this.orderId.code).then(res => {
        if (res.code === 0) {
          this.orderStatis = res.result.status
        }
      })
    },
    getDeoMess () {
      let col = this.formTab.getFieldValue('city')
      if (!col) {
        this.$message.warning('请先选择城市')
        return
      }
      if (this.decorateList.length === 0) {
        this.$message.warning('暂无数据,需在小程序管理后台配置装修意向的类型')
      }
    },
    goback () { // 返回
      this.$router.go(-1)
    },
    closOrderOk () { // 确认关闭工单
      let obj = {
        id: this.$route.query.gdId,
        listCloseReasonStr: this.closOrderReason
      }
      if (this.closOrderReason.length === 0) {
        this.$message.error('请选择关闭原因')
        return
      }
      if (this.btnFlag === false) {
        this.btnFlag = true
        this.$request.post('/projectWorkOrder/closeWorkOrder', obj).then(res => {
          if (res.code === 0) {
            this.btnFlag = false
            this.closFlag = false
            this.visible = false
          }
        }).catch(err => {
          this.btnFlag = false
        })
      }
    },
    colsOrderCandel () {
      this.closOrderReason = []
      this.visible = false
    },
    // searching () { // 检索
    //   let phone = this.formTab.getFieldsValue(['personnel'])
    //   if (phone.personnel.length !== 11) {
    //     this.$message.error('输入正确手机号码')
    //     return
    //   }
    //   this.selectSubmit = true
    //   if (this.btnFlag === false) {
    //     this.btnFlag = true
    //     this.$request.get('crm/user/submitter/' + phone.personnel).then(res => {
    //       if (res.code === 0) {
    //         this.btnFlag = false
    //         if (res.result.length !== 0) {
    //           this.submitterFlag = true
    //           this.$message.success('报单人检验成功')
    //           this.submitterInfo = res.result[0]
    //         } else {
    //           this.submitterFlag = false
    //           this.$message.error('报单人检索不到任何相关人员')
    //         }
    //       }
    //     }).catch(err => {
    //       this.btnFlag = false
    //     })
    //   }
    // },
    getgetInitializationData () { // 获取工单信息
      this.$request.get('crm/distribute-order/' + this.$route.query.id).then(res => {
        if (res.code === 0) {
          if (res.result.orderStatus) this.myGetOrderStatus = Number(res.result.orderStatus)
          this.client = res.result
          this.address = res.result.categoryType
          this.crmRemark = this.client.workRemarkNotDate
          this.crmRemarkList = this.client.remarks
          this.designName = res.result.designManagerName
          if (this.$route.query.pageSouce === 'crmypd') { // 判断页面来源；显示不同
            if (res.result.status === 5 || res.result.status === 6 || res.result.status === 7) { // 判断派单的状态， 状态为5.6.7时显示放弃
              this.orderStatus = 5 + ''
              this.verify.giveUp[1].initialValue = res.result.status
              this.verify.areaInput[1].initialValue = res.result.remark
            } else if (res.result.status === 2) { // 状态为2时显示派单
              this.orderStatus = 2 + ''
              this.verify.design[1].initialValue = res.result.designManagerId // 设计师
              this.verify.areaInput[1].initialValue = res.result.remark
            } else if (res.result.status === 4) { // 状态为4时显示预约
              this.orderStatus = 4 + ''
              this.appointTime = res.result.nextTime
              this.verify.dateTime[1].initialValue = moment(this.appointTime)
              this.verify.areaInput[1].initialValue = res.result.remark
            }
            this.$forceUpdate()
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    callback (key) { // 查看选择派单类型// 2为 派单, 4位定时在联系； 5为放弃
      this.orderStatus = key
    },
    oneSubmitThink (e) {
      if (this.eidtFlag === 1 || this.eidtTwoFlag === 1) {
        this.$message.error('请先保存基础信息')
        return
      }
      e.preventDefault()
      this.formOne.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let obj = {
            designManagerName: this.designPersonName, // 设计师姓名
            status: 2, // 派单状态
            designManagerId: this.designPersonId, // 设计师ID
            id: this.$route.query.id,
            remark: values.areaInput
          }
          if (this.btnFlag === false) {
            this.btnFlag = true
            this.$request.post('crm/order/work-distribute', obj).then(res => {
              if (res.code === 0) {
                this.btnFlag = false
                this.$router.push('/Leaflets')
              }
            }).catch(err => {
              this.btnFlag = false
            })
          }
        }
      })
    },
    towSubmitThink (e) { // 重新预约的提交
      if (this.eidtFlag === 1 || this.eidtTwoFlag === 1) {
        this.$message.error('请先保存基础信息')
        return
      }
      e.preventDefault()
      this.formTow.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let obj = {
            nextTime: this.appointTime, // 重新预约时间
            status: 4, // 派单状态
            id: this.$route.query.id,
            remark: values.areaInput
          }
          if (this.btnFlag === false) {
            this.btnFlag = true
            this.$request.post('crm/order/work-distribute', obj).then(res => {
              if (res.code === 0) {
                this.btnFlag = false
                this.$router.push('/Leaflets')
              }
            }).catch(err => {
              this.btnFlag = false
            })
          }
        }
      })
    },
    threeSubmitThink (e) { // 放弃的提交
      if (this.eidtFlag === 1 || this.eidtTwoFlag === 1) {
        this.$message.error('请先保存基础信息')
        return
      }
      e.preventDefault()
      this.formThree.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let obj = {
            status: this.giveUpReasonId, // 放弃原因
            id: this.$route.query.id,
            remark: values.areaInput
          }
          if (this.btnFlag === false) {
            this.btnFlag = true
            this.$request.post('crm/order/work-distribute', obj).then(res => {
              if (res.code === 0) {
                this.btnFlag = false
                this.$router.push('/Leaflets')
              }
            }).catch(err => {
              this.btnFlag = false
            })
          }
        }
      })
    },
    oneSubmitFrou (e) { // 设计师派单 or 重新派单
      if (this.eidtFlag === 1 || this.eidtTwoFlag === 1) {
        this.$message.error('请先保存基础信息')
        return
      }
      e.preventDefault()
      this.formDesign.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let obj = {
            designerId: values.designPerson,
            designerName: this.designName,
            remark: values.designRemak,
            id: this.$route.query.gdId
          }
          let url = '/crm/task/work-distribute'
          if (this.pageSouce === 'sjsypd') {
            url = '/crm/task/again-distribute'
          } else if (this.pageSouce === 'sjsdpd') {
            url = '/crm/task/work-distribute'
          }
          if (this.btnFlag === false) {
            this.btnFlag = true
            this.$request.post(url, obj).then(res => {
              if (res.code === 0) {
                this.btnFlag = false
                if (this.pageSouce === 'sjsdpd') {
                  this.$router.push('/design-allot')
                } else if (this.pageSouce === 'sjsypd') {
                  this.$router.push('/allot-already')
                }
              }
            }).catch(err => {
              this.btnFlag = false
            })
          }
        }
      })
    },
    cannalThink () { // 返回上一层
      this.$router.go(-1)
    },
    selectChang (value) { // 设计负责人选择
      this.designPersonId = value
      let obj = Api.forListObj(value, this.designList)
      this.designPersonName = obj.name
    },
    selectChangGive (e) { // 放弃原因选择
      this.giveUpReasonId = e
    },
    onChange (value, dateString) { // 选择时间操作
      this.appointTime = dateString
    },
    editThink () { // 编辑客户信息
      this.selectSubmit = true
      this.submitterFlag = true
      this.verify.peopleName[1].initialValue = this.client.customerName // 姓名
      this.verify.phoneNumber[1].initialValue = this.client.customerPhone // 手机号码
      this.verify.province[1].initialValue = this.client.provinceCode ? this.client.provinceCode : undefined // 省份
      this.verify.city[1].initialValue = this.client.cityCode ? this.client.cityCode : undefined // 城市
      this.verify.area[1].initialValue = this.client.districtCode ? this.client.districtCode : undefined // 区
      this.verify.source[1].initialValue = this.client.source ? this.client.source : undefined // 报单来源
      this.verify.personnel[1].initialValue = this.client.submitter // 报单人

      if (this.client.categoryType === 1) {
        this.verify.residenInput[1].initialValue = this.client.project // 自定义小区
        this.verify.ridgepInput[1].initialValue = this.client.building // 自定义楼栋
        this.verify.roomInput[1].initialValue = this.client.house // 自定义房号
        this.client.projectCode = ''
        this.client.buildingCode = ''
        this.client.houseCode = ''
      } else {
        this.firstEditFlagOne = true // 编辑客户信息第一次点击进来编辑时候
        this.firstEditFlagTwo = true // 编辑客户信息第一次点击进来编辑时候
        this.firstEditFlagThree = true // 编辑客户信息第一次点击进来编辑时候
        this.mySpingFlagOne = true
        this.mySpingFlagTwo = true
        this.mySpingFlagThree = true
        // this.verify.residential[1].initialValue = this.client.projectCode ? this.client.projectCode : '' // 小区
        // this.verify.ridgepole[1].initialValue = this.client.buildingCode ? this.client.buildingCode : '' // 栋
        // this.verify.room[1].initialValue = this.client.houseCode ? this.client.houseCode : '' // 房号
      }
      this.verify.livingNumber[1].initialValue = this.client.livingNumber // 厅
      this.verify.bedroomNumber[1].initialValue = this.client.bedroomNumber // 房间
      this.verify.kitchensNumber[1].initialValue = this.client.kitchensNumber // 厨房
      this.verify.bathroomsNumber[1].initialValue = this.client.bathroomsNumber // 卫生间数量
      this.verify.floorspaceNumber[1].initialValue = this.client.floorspaceNumber // 面积
      
      this.submitterInfo.name = this.client.submitter
      this.submitterInfo.id = this.client.submitterId
      this.verify.decorate[1].initialValue = this.client.comboArr ? this.client.comboArr : [] // 装修意向
      this.eidtFlag = 1
      this.getProvinList() // 获取省份
      this.getCityList(this.client.provinceCode, 1) // 获取城市
      this.getDistru(this.client.cityCode, 1) // 城市change改变事件，获取区域
      this.getBuildingList(this.client.projectCode) // 获取楼栋
      if (this.souceList.length === 0) { // 来源
        // this.souceList =
        Api.getSouceList().then(res => {
          if (res.code === 0) {
            this.souceList = res.result
          }
        })
      }
      this.getHouseList(this.client.buildingCode) // 获取房号
    },
    saveFun () { // 编辑客户保存
      this.formTab.validateFieldsAndScroll((err, values) => {
        if (!err) {
          // if (!values.livingNumber && !values.bedroomNumber && !values.kitchensNumber && !values.bathroomsNumber) {
          //   this.$message.error('请先选择户型')
          //   return
          // }
          let obj = {
            categoryType: this.address, // 地址类型
            id: this.$route.query.id, // 派单ID
            customerName: values.peopleName, // 姓名
            customerPhone: values.phoneNumber, // 电话号码
            province: this.client.province, // 省份
            provinceCode: this.client.provinceCode, // 省份ID
            city: this.client.city, // 城市
            cityCode: this.client.cityCode, // 城市ID
            district: this.client.district, // 区域
            districtCode: this.client.districtCode, // 区域ID
            source: this.client.source, // 来源类型
            sourceStr: this.client.sourceStr, // 来源
            submitter: values.personnel || this.client.submitter, // 报单人
            // submitter: this.submitterFlag === true ? this.submitterInfo.name : null, // 报单人
            // submitterId: this.submitterFlag === true ? this.submitterInfo.id : null, // 报单人ID
            comboArr: values.decorate, // 装修意向
            floorspaceNumber: values.floorspaceNumber, // 面积
            livingNumber: values.livingNumber, // 厅数
            bedroomNumber: values.bedroomNumber, // 房数
            kitchensNumber: values.kitchensNumber, // 厨房数
            bathroomsNumber: values.bathroomsNumber // 卫生间数
          }
          if (this.address === 1) { // 小区房号楼栋信息处理；判断自定义还是为非自定义
            obj.building = values.ridgepInput || '' // 楼栋
            obj.project = values.residenInput || '' // 小区
            obj.house = values.roomInput || '' // 房号
          } else {
            if (this.client.projectCode == '') {
              obj.project = ''
              obj.projectCode = ''
            } else {
              obj.project = this.client.project // 小区
              obj.projectCode = this.client.projectCode // 小区ID
            }
            if (this.client.buildingCode == '') {
              obj.building = ''
              obj.buildingCode = ''
            } else {
              obj.building = this.client.building // 楼栋
              obj.buildingCode = this.client.buildingCode // 楼栋ID
            }
            if (this.client.houseCode == '') {
              obj.house = ''
              obj.houseCode = ''
            } else {
              obj.house = this.client.house // 房号
              obj.houseCode = this.client.houseCode // 房号ID
            }
          }
          if (this.btnFlag === false) {
            this.btnFlag = true
            this.$request.post('crm/order/customer', obj).then(res => {
              if (res.code === 0) {
                this.btnFlag = false
                this.eidtFlag = 2
                this.$message.success('保存成功')
                // 重新将编辑时候的选择框的值去掉
                if (this.client.categoryType == 2) {
                  this.verify.residential[1].initialValue = undefined // 小区
                  this.verify.ridgepole[1].initialValue = undefined // 栋
                  this.verify.room[1].initialValue =  undefined // 房号
                }

                this.getgetInitializationData()
                for (let cc in this.pageOne) {
                  this.pageOne[cc] = 1
                }
              }
            }).catch(err => {
              this.btnFlag = false
            })
          }
        } else {
          this.btnDisleble = true
        }
      })
    },
    getProvinList () { // 获取省份接口
      this.notFoundObj.provinceNot = '加载中'
      Api.getProvinceList().then(res => {
        if (res.code === 0) {
          this.provinceList = res.result
          this.notFoundObj.provinceNot = '暂无任何数据'
        }
      }).catch(err => {
        this.notFoundObj.provinceNot = '暂无任何数据'
      })
    },
    getCityList (id, num) { // 选中省份获取城市
      // 重置数据
      this.cityList = []
      this.areaList = []
      this.projectList = []
      this.buildingList = []
      this.houseList = []
      this.notFoundObj.cityNot = '加载中...'
      if (typeof(num) == 'object') {
        // 重置区域的值和id
        this.client.district = '' // 区域
        this.client.districtCode = '' // 区域ID
      }
      
      Api.getCityList(id).then(res => {
        if (res.code === 0) {
          this.cityList = res.result
          this.notFoundObj.cityNot = '暂无任何数据'
        }
      }).catch(err => {
        this.notFoundObj.cityNot = '暂无任何数据'
      })
      if (this.pageOne.provn === 1) { // 是否第一次进入编辑；判断是否清除数据；
        this.pageOne.provn = 2
      } else {
        let obj = Api.forListObj(id, this.provinceList) // 取出想要的数据；留作备用数据
        this.client.province = obj.name
        this.client.provinceCode = obj.code
        // 选择值的清空
        this.formTab.resetFields(['city', 'area', 'residential', 'ridgepole', 'room']) // 设置值 和 选择值需要不同的方法来清空
        // 设置值的清空
        this.verify.city[1].initialValue = undefined
        this.verify.area[1].initialValue = undefined
        this.verify.residential[1].initialValue = undefined
        this.verify.ridgepole[1].initialValue = undefined
        this.verify.room[1].initialValue = undefined
      }
    },
    getDistru (id, num) { // 选中城市获取区信息
      this.areaList = []
      this.projectList = []
      this.buildingList = []
      this.houseList = []
      if (typeof(num) == 'object') {
        // 重置区域的值和id
        this.client.district = '' // 区域
        this.client.districtCode = '' // 区域ID
      }

      Api.getAreaList(id).then(res => {
        if (res.code === 0) {
          this.areaList = res.result
        }
      })
      this.getProjecList(id) // 城市改变；再次获取小区信息
      this.getDecorateList(id) // 城市改变；装修意向改变
      if (this.pageOne.city === 1) { // 是否第一次进入编辑；判断是否清除数据；
        this.pageOne.city = 2
      } else {
        let obj = Api.forListObj(id, this.cityList)
        this.client.city = obj.name
        this.client.cityCode = obj.code
        this.formTab.resetFields(['area', 'residential', 'ridgepole', 'room', 'decorate']) // 设置值 和 选择值需要不同的方法来清空
        this.verify.area[1].initialValue = undefined
        this.verify.residential[1].initialValue = undefined
        this.verify.ridgepole[1].initialValue = undefined
        this.verify.room[1].initialValue = undefined
        this.verify.decorate[1].initialValue = undefined
      }
    },
    getAreaFun (id) { // 选中区域改变数据
      if (id) {
        let obj = Api.forListObj(id, this.areaList)
        this.client.district = obj.name
        this.client.districtCode = obj.code
      } else {
        this.client.district = ''
        this.client.districtCode = ''
      } 
    },
    getProjecList (id) { // 获取小区
      this.buildingList = []
      this.houseList = []
      this.notFoundObj.residentialNot = '加载中'
      Api.getResidentialList(id).then(res => {
        if (res.code === 0) {
          this.mySpingFlagOne = false
          if (this.firstEditFlagOne) {
            this.verify.residential[1].initialValue = this.client.projectCode ? this.client.projectCode : undefined // 第一次编辑时候赋值小区
            this.firstEditFlagOne = false
          }
          this.projectList = res.result
          this.notFoundObj.residentialNot = '暂无任何数据'
        }
      }).catch(err => {
        this.notFoundObj.residentialNot = '暂无任何数据'
      })
    },
    getBuildingList (id) { // 选中小区获取楼栋信息
      this.houseList = []
      this.notFoundObj.buildinhNot = '加载中...'
      Api.getBuildingList(id).then(res => {
        if (res.code === 0) {
          this.mySpingFlagTwo = false
          if (this.firstEditFlagTwo) {
            this.verify.ridgepole[1].initialValue = this.client.buildingCode ? this.client.buildingCode : undefined // 第一次编辑时候赋值楼栋
            this.firstEditFlagTwo = false
          }
          this.buildingList = res.result
          this.notFoundObj.buildinhNot = '暂无任何数据'
        }
      }).catch(err => {
        this.notFoundObj.buildinhNot = '暂无任何数据'
      })
      if (this.pageOne.pro === 1) { // 是否第一次进入编辑；判断是否清除数据；
        this.pageOne.pro = 2
      } else {
        let obj = Api.forListObj(id, this.projectList)
        this.client.project = obj.name
        this.client.projectCode = obj.code
        this.formTab.resetFields(['ridgepole', 'room']) // 设置值 和 选择值需要不同的方法来清空
        this.verify.ridgepole[1].initialValue = undefined
        this.verify.room[1].initialValue = undefined
      }
    },
    getHouseList (id) { // 选中楼栋获取房号信息
      this.notFoundObj.roomNot = '暂无任何数据'
      Api.getRoomNumber(id).then(res => {
        if (res.code === 0) {
          this.mySpingFlagThree = false
          if (this.firstEditFlagThree) {
            this.verify.room[1].initialValue = this.client.houseCode ? this.client.houseCode : undefined // 第一次编辑时候赋值房号
            this.firstEditFlagThree = false
          }
          this.houseList = res.result
          this.notFoundObj.roomNot = '暂无任何数据'
        }
      }).catch(err => {
        this.notFoundObj.roomNot = '暂无任何数据'
      })
      if (this.pageOne.buil === 1) { // 是否第一次进入编辑；判断是否清除数据；
        this.pageOne.buil = 2
      } else {
        let obj = Api.forListObj(id, this.buildingList)
        this.client.building = obj.name
        this.client.buildingCode = obj.code
        this.formTab.resetFields(['room']) // 设置值 和 选择值需要不同的方法来清空
        this.verify.room[1].initialValue = undefined
      }
    },
    getDecorateList (id) { // 选中城市获取装修意向
      this.notFoundObj.decorateNot = '加载中...'
      this.decorateList = []
      Api.getDecorate(id).then(res => {
        if (res.code === 0) {
          this.decorateList = res.result
          this.notFoundObj.decorateNot = '暂无任何数据'
        }
      }).catch(err => {
        this.notFoundObj.decorateNot = '暂无任何数据'
      })
    },
    getHouseValue (id) { // 房号改变了
      let obj = Api.forListObj(id, this.houseList)
      this.client.house = obj.name
      this.client.houseCode = obj.code
    },
    getSouceFun (id) { // 来源改变
      let obj = Api.forListObj(id, this.souceList)
      this.client.sourceStr = obj.name
      this.client.source = obj.id
    },
    getDecoValue (id) { // 装修意向改变
      this.client.comboArr = id
      // 特殊处理数组模式的ID
      // let name = ''
      // let sou = 1
      // this.client.comboArr.map(item => {
      //   this.decorateList.map(decitem => {
      //     if (item === decitem.id) {
      //       if (sou === 1) {
      //         name = decitem.title
      //         sou = 2
      //       } else {
      //         name = name + ',' + decitem.title
      //       }
      //     }
      //   })
      // })
    },
    editTwoFun () { // 扩展信息的编辑
      this.eidtTwoFlag = 1 // tab2的编辑
      this.verify.car[1].initialValue = this.client.car
      this.verify.pet[1].initialValue = this.client.pet
      this.verify.family[1].initialValue = this.client.family
      this.verify.interest[1].initialValue = this.client.interest
      this.verify.specialIdentity[1].initialValue = this.client.specialIdentity
    },
    saveTwoFun () { // 扩展信息的保存
      this.formTwoTab.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let obj = {
            id: this.$route.query.id, // 派单ID
            car: values.car, // 车辆
            pet: values.pet, // 宠物
            family: values.family, // 省家庭情况
            interest: values.interest, // 个人兴趣爱好
            specialIdentity: values.specialIdentity // 特殊省份
          }
          if (this.btnFlag === false) {
            this.btnFlag = true
            this.$request.post('crm/order/expand', obj).then(res => {
              if (res.code === 0) {
                this.btnFlag = false
                this.$message.success('保存成功')
                this.getgetInitializationData()
              }
            }).catch(err => {
              this.btnFlag = false
            })
          }
          // 重置是否第一次进入编辑接口
          this.eidtTwoFlag = 2
        }
      })
    },
    // subSaveFun () { // 修改备注的提交方法
    //   this.$request.post('crm/order/customer', { remark: this.crmRemark, id: this.$route.query.id }).then(res => {
    //     if (res.code === 0) {
    //       this.$message.success('保存成功')
    //       this.getgetInitializationData()
    //     }
    //   })
    // },
    selectDesChang (e) { // 选择设计师后回调
      let obj = Api.forListObj(e, this.designList2)
      this.designName = obj.name
    },
    closOrderFun () { // 关闭工单
      this.visible = true
      if (this.plainOptions.length === 0) {
        this.$request.get('projectWorkOrder/getWorkOrderCloseReasonList').then(res => {
          if (res.code === 0) {
            res.result.forEach(item => {
              let obj = {
                label: item,
                value: item
              }
              this.plainOptions.push(obj)
            })
          }
        })
      }
    },
    boundUser () { // 绑定userID
      let obj = {
        customerPhone: this.client.customerPhone,
        id: this.$route.query.gdId
      }
      if (this.btnFlag === false) {
        this.btnFlag = true
        this.$request.post('/projectWorkOrder/bindCustomerUserId', obj).then(res => {
          if (res.code === 0) {
            this.btnFlag = false
            this.boundFlag = false
          }
        }).catch(err => {
          this.btnFlag = false
        })
      }
    }
  }
}
</script>

<style lang="scss">
@import './css/index.scss';
</style>
