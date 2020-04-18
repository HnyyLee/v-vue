<template>
  <div class="fund_box">
    <common-header :value='infoValue'></common-header>
    <!-- 原来的收退款页面 -->
    <div class="oldPage" v-if="!oldnewFlag">
      <div class="fund_box_menu">
        <span :class="{active: defaltNum === 1}" style="cursor: pointer;" @click="selectFun(1)">收款记录</span>
        <span :class="{active: defaltNum === 2}" style="border-left: none;cursor: pointer" @click="selectFun(2)">退款记录</span>
      </div>
      <div class="fund_box_content">
        <span>{{defaltNum === 1 ? '应收款明细:' : '退款记录'}}</span>
        <div style='display: flex;'>
          <div v-show="defaltNum === 1" class="fund_box_content_right">
            <a-icon type="warning" style="margin-right: 5px;" />
            定金局装1千元整装2千元，签约后方显示合同款分期情况
          </div>
          <!-- 原来的退款按钮（勿删） -->
          <!-- <a-button type="primary" v-show="orderStatis != 0" style='margin-left: 15px' @click="refundFun">发起退款</a-button> -->
        </div>
      </div>
      <a-table :columns="columns" :dataSource="dataArr" v-show="defaltNum === 1" bordered :rowKey='record => record.id'>
        <span slot="status" slot-scope="status">{{disposeStatus(status)}}</span>
        <div slot="id" slot-scope="id, record">
          <a-button type="primary" v-if="btnShowFun(record)" @click="collection(record)">收款</a-button>
          <a-button type="primary" v-if="record.totalAmount < 0 && record.status == 1 && orderStatis != 0" @click="paymentFun(record)">付款</a-button>
        </div>
      </a-table>
      <a-table :columns="columns2" :dataSource="dataArr2" v-show="defaltNum === 2" bordered :rowKey='record => record.id'>
        <span slot="status" slot-scope="status">{{disposeStatusRefund(status)}}</span>
        <!-- <a-button type="primary" slot="id" slot-scope="id" @click="refundPriceFun(id)">收款</a-button> -->
      </a-table>
      <!-- 原来的发起退款弹窗 -->
      <a-modal
        title="发起退款"
        :visible="refunedFlag"
        :maskClosable='false'
        @ok="handleOk"
        @cancel="handleCancel"
        okText="提交"
        cancelText="取消"
        width='750px'
        :okButtonProps="{ props: { loading: refunedBtnLoading } }">
        <a-form :form='refundForm'>
          <div class="fund_box_modal_box">
            <span class="fund_box_modal_title">退款金额</span>
            <a-form-item style="margin-bottom: 0;">
              <a-input v-decorator="verify.refundAmount" style="width: 350px;" />
            </a-form-item>
          </div>
          <div class="fund_box_modal_box">
            <span class="fund_box_modal_title">退款原因</span>
            <a-form-item style="margin-bottom: 0;">
              <a-checkbox-group v-decorator="verify.refundReason">
                <a-row>
                  <a-col :span='8' v-for="item in refunedCauseList" :key="item.id">
                    <a-checkbox :value="item.configKey">{{item.configValue}}</a-checkbox>
                  </a-col>
                </a-row>
              </a-checkbox-group>
            </a-form-item>
          </div>
          <div class="fund_box_modal_box fund_box_modal_box_start">
            <span class="fund_box_modal_title">原因描述</span>
            <a-form-item style="margin-bottom: 0;">
              <a-textarea v-decorator="verify.reasonDesc" style="width:350px;" placeholder="请输入原因描述" :rows="6"/>
            </a-form-item>
          </div>
          <div class="fund_box_modal_box">
            <span class="fund_box_modal_title">合作是否继续</span>
            <a-form-item style="margin-bottom: 0;">
              <a-radio-group v-decorator="verify.continueCooperate">
                <a-radio :value="1">继续合作</a-radio>
                <!-- <a-radio :value="0">关闭工单</a-radio> -->
              </a-radio-group>
            </a-form-item>
          </div>
          <div>收款账户信息：</div>
          <div class="fund_box_modal_box">
            <span class="fund_box_modal_title">收款账户</span>
            <a-form-item style="margin-bottom: 0;">
              <a-input v-decorator="verify.accountName" style="width:350px;" />
            </a-form-item>
          </div>
          <div class="fund_box_modal_box">
            <span class="fund_box_modal_title">收款账号</span>
            <a-form-item style="margin-bottom: 0;">
              <a-input v-decorator="verify.accountNumber" placeholder='银行卡号' style="width:350px;" />
            </a-form-item>
          </div>
          <div class="fund_box_modal_box">
            <span class="fund_box_modal_title">开户行信息</span>
            <div>
              <div>
                <a-form-item style="margin-bottom: 0;">
                  <a-select style='width: 350px;' v-decorator="verify.bankPrivon" showSearch optionFilterProp='children' @change="getCityCode" placeholder='请选择省份'>
                    <a-select-option v-for="item in privonList" :key="item.name" :value='item.code'>{{item.name}}</a-select-option>
                  </a-select>
                </a-form-item>
              </div>
              <div>
                <a-form-item style="margin-bottom: 0;">
                  <a-select style='width: 350px;' v-decorator="verify.bankCity" showSearch optionFilterProp='children' @change="getBanCode" placeholder='请选择城市'>
                    <a-select-option v-for="item in cityList" :key="item.name" :value='item.code'>{{item.name}}</a-select-option>
                  </a-select>
                </a-form-item>
              </div>
              <div>
                <a-form-item style="margin-bottom: 0;">
                  <a-select style='width: 350px;' v-decorator="verify.bankTypeCode" showSearch optionFilterProp='children' placeholder='请选择银行类型' @change="getBranCode">
                    <a-select-option v-for="item in branchTypeList" :key="item.name" :value='item.code'>{{item.name}}</a-select-option>
                  </a-select>
                </a-form-item>
              </div>
              <div>
                <a-form-item style="margin-bottom: 0;">
                  <a-select style='width: 350px;' v-decorator="verify.bankBranch" showSearch optionFilterProp='children' placeholder='请选择分行' >
                    <a-select-option v-for="item in bankList" :key="item.name" :value='item.lineNum'>{{item.branchName}}</a-select-option>
                  </a-select>
                </a-form-item>
              </div>
            </div>
          </div>
          <div class="fund_box_modal_box">
            <span class="fund_box_modal_title">账户类型</span>
            <a-form-item style="margin-bottom: 0;">
              <a-radio-group v-decorator="verify.infoType">
                <a-radio :value="1">对公</a-radio>
                <a-radio :value="0">对私</a-radio>
              </a-radio-group>
            </a-form-item>
          </div>
          <div class="fund_box_modal_box">
            <span class="fund_box_modal_title">开户证件</span>
            <a-form-item style="margin-bottom: 0;">
              <a-select style='width: 350px;' v-decorator="verify.certificate" placeholder='选择证件类型'>
                <a-select-option v-for="item in certificateList" :key="item.name" :value='item.code'>{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <div class="fund_box_modal_box">
            <span class="fund_box_modal_title">证件号码</span>
            <a-form-item style="margin-bottom: 0;">
              <a-input v-decorator="verify.certificateId" placeholder='输入证件号码' style="width: 350px;" />
            </a-form-item>
          </div>
        </a-form>
      </a-modal>
      <!-- 原来的收款弹窗 -->
      <a-modal
        title="收款设置"
        v-model="visible2"
        :maskClosable='false'
        @cancel="myCancelFn"
        footer=""
        width="610px">
        <div class="fund_box_modal_box fund_box_modal_box2">
          <span class="fund_box_modal_title">款项</span>
          <a-input v-model="receipPirceValue.receivableType" disabled />
        </div>
        <div class="fund_box_modal_box fund_box_modal_box2">
          <span class="fund_box_modal_title">金额</span>
          <a-input disabled v-model="receipPirceValue.totalAmount" v-if="receipPirceValue.receivableCode != 'Earnest'" />
          <a-select v-model="receipPirceValue.totalAmount" :disabled='receipPirceValue.status == 2' style="width: 100%" v-if="receipPirceValue.receivableCode == 'Earnest'">
            <a-select-option v-for="item in EarnestList" :key="item" :value='item'>{{item}}</a-select-option>
          </a-select>
        </div>
        <!-- <div class="annotation" v-show="chooseFirstType">
          注：POS机刷卡方式，额度设置后24小时内不可修改。
        </div> -->
        <div class="fund_box_modal_box fund_box_modal_box2">
          <span class="fund_box_modal_title">收款方式</span>
          <a-radio-group v-model="receipPirceValue.paymentType" :disabled='receipPirceValue.status == 2 || statusFlag == 2' @change="receipTypeChange">
            <a-radio value="hundsun_nfxpos_act">POS机刷卡</a-radio>
            <a-radio value="hundsun_wechatlet">微信自助支付</a-radio>
            <a-radio value="under_line">线下支付</a-radio>
          </a-radio-group>
        </div>
        <div class="fund_box_modal_box fund_box_modal_box2 fund_box_modal_box_cloum" v-show="receipPirceValue.paymentType === 'hundsun_nfxpos_act'">
          <p>当前选择使用POS收款</p>
          <p>请确认是否具备与客户面对面刷卡的条件</p>
          <a-icon type="loading" style='margin-bottom: 20px;font-size: 100px' v-if="imgFlag == 2" />
          <img v-if="imgFlag == 3" :src="pircUrl" style='width: 250px; height: 250px;' alt="暂无图片">
          <a-button type="primary" @click="sure">确认使用POS机收款</a-button>
          <div class="posPayTypeDom">
            <span class="title" style="font-size: 12px">确认后24h内不可更改</span>
          </div>
          
        </div>
        <div class="fund_box_modal_box fund_box_modal_box2 fund_box_modal_box_cloum" v-show="receipPirceValue.paymentType === 'hundsun_wechatlet'">
          <p>①微信有2万元的支付限制，请注意本次支付是否匹配。</p>
          <p>②确认提交后，请通知用户在小程序进行付款。</p>
          <a-button type="primary" @click="sure2" :disabled='receipPirceValue.status == 2'>确认使用微信支付</a-button>
          <div class="posPayTypeDom">
            <span class="title" style="font-size: 12px">确认后可随时更改为POS或线下支付</span>
          </div>
        </div>
        <div class="fund_box_modal_box fund_box_modal_box2 fund_box_modal_box_cloum" v-show="receipPirceValue.paymentType === 'under_line'">
          <!-- 原来的老页面收款单也加入审批模板-->
          <div class="shenpiTeample" style="width: 100%">
            <a-form :form='oldReceFormData'>
              <a-form-item v-bind="formItemLayout" label="审批模板">
                <a-select v-decorator="oldReceivabVerify.myapproval" style="width: 100%" :disabled="receipPirceValue.status == 2 || receipPirceValue.status == 3" placeholder="请选择审批模板">
                  <a-select-option v-for="(item, index) in oldApprovalList" :key="index" :value="item.id">{{item.processRangeName}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-form>
          </div>
          <p>该笔订单金额已通过线下的方式收取，系统不做记录。提交后默认为全额已支付。</p>
          <a-button type="primary" @click="sure3">确认线下支付</a-button>
        </div>
      </a-modal>
      <!-- 原来的付款弹窗paymentFlag -->
      <a-modal
        :title="payFullTitle"
        :visible="paymentFlag"
        :maskClosable='false'
        @ok="paymentOk"
        @cancel="paymentCancel"
        okText="提交"
        cancelText="取消">
        <a-form :form='paymentForm'>
          <!-- <div class="fund_box_modal_box">
            <span class="fund_box_modal_title">付款金额</span>
            <a-form-item style="margin-bottom: 0;">
              <a-input v-decorator="verify.refundAmount" style="width: 350px;" />
            </a-form-item>
          </div> -->
          <div class="fund_box_modal_box">
            <span class="fund_box_modal_title">收款账户</span>
            <a-form-item style="margin-bottom: 0;">
              <a-input v-decorator="verify.accountName" style="width:350px;" />
            </a-form-item>
          </div>
          <div class="fund_box_modal_box">
            <span class="fund_box_modal_title">收款账号</span>
            <a-form-item style="margin-bottom: 0;">
              <a-input v-decorator="verify.accountNumber" style="width:350px;" />
            </a-form-item>
          </div>
          <div class="fund_box_modal_box">
            <span class="fund_box_modal_title">开户行信息</span>
            <div>
              <div>
                <a-form-item style="margin-bottom: 0;">
                  <a-select style='width: 350px;' v-decorator="verify.bankPrivon" showSearch optionFilterProp='children' @change="getCityCode" placeholder='请选择省份'>
                    <a-select-option v-for="item in privonList" :key="item.name" :value='item.code'>{{item.name}}</a-select-option>
                  </a-select>
                </a-form-item>
              </div>
              <div>
                <a-form-item style="margin-bottom: 0;">
                  <a-select style='width: 350px;' v-decorator="verify.bankCity" showSearch optionFilterProp='children' @change="getBanCode" placeholder='请选择城市'>
                    <a-select-option v-for="item in cityList" :key="item.name" :value='item.code'>{{item.name}}</a-select-option>
                  </a-select>
                </a-form-item>
              </div>
              <div>
                <a-form-item style="margin-bottom: 0;">
                  <a-select style='width: 350px;' v-decorator="verify.bankTypeCode" showSearch optionFilterProp='children' placeholder='请选择银行类型' @change="getBranCode">
                    <a-select-option v-for="item in branchTypeList" :key="item.name" :value='item.code'>{{item.name}}</a-select-option>
                  </a-select>
                </a-form-item>
              </div>
              <div>
                <a-form-item style="margin-bottom: 0;">
                  <a-select style='width: 350px;' v-decorator="verify.bankBranch" showSearch optionFilterProp='children' placeholder='请选择分行' >
                    <a-select-option v-for="item in bankList" :key="item.name" :value='item.lineNum'>{{item.branchName}}</a-select-option>
                  </a-select>
                </a-form-item>
              </div>
            </div>
          </div>
          <div class="fund_box_modal_box">
            <span class="fund_box_modal_title">账户类型</span>
            <a-form-item style="margin-bottom: 0;">
              <a-radio-group v-decorator="verify.infoType">
                <a-radio :value="1">对公</a-radio>
                <a-radio :value="0">对私</a-radio>
              </a-radio-group>
            </a-form-item>
          </div>
          <div class="fund_box_modal_box">
            <span class="fund_box_modal_title">开户证件</span>
            <a-form-item style="margin-bottom: 0;">
              <a-select style='width: 350px;' v-decorator="verify.certificate" placeholder='选择证件类型'>
                <a-select-option v-for="item in certificateList" :key="item.name" :value='item.code'>{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <div class="fund_box_modal_box">
            <span class="fund_box_modal_title">证件号码</span>
            <a-form-item style="margin-bottom: 0;">
              <a-input v-decorator="verify.certificateId" placeholder='输入证件号码' style="width: 350px;" />
            </a-form-item>
          </div>
          <div class="foot_tit">
            <p v-if="!titShowFlag">注：尾款为负数时，请在线下完成付款后，将付款信息录入系统</p>
            <p v-if="titShowFlag">注：提交后将自动完成转账给客户，可提现额度会扣除该部分资金，请操作前与财务确认！</p>
          </div>
        </a-form>
      </a-modal>
    </div>

    <!-- *********************************************************************************************************************** -->

    <!-- 新的收款页面 -->
    <div class="newPage" v-if="oldnewFlag">
      <!-- 第一个表格 -->
      <div class="fund_box_content">
        <span>合同款收款明细：</span>
        <div style='display: flex;'>
          <a-button type="primary" class="mybuttonDom" @click="depositFn" :disabled="depositFlag || depositData.length == 0" v-if="RouterNameFlag[mythat.$route.name] || RouterNameFlag['order_CollectionRefund_btn']">收取定金</a-button>
        </div>
      </div>
      <a-table :columns="depositColumns" :dataSource="depositData" bordered :rowKey='record => record.id' :pagination="false"></a-table>
      <!-- 第二个表格 -->
      <div class="fund_box_content">
        <span>收款单列表：</span>
        <div style='display: flex;'>
          <a-button type="primary" class="mybuttonDom" @click="createOrder" :disabled="createOrderPower()" v-if="RouterNameFlag[mythat.$route.name] || RouterNameFlag['order_collectionDoc_btn']">创建收款单</a-button>
        </div>
      </div>
      <a-table :columns="orderColumns" :dataSource="orderData" bordered :rowKey='record => record.id'>
        <span slot="action" slot-scope="record">
          <a-button type="primary" size="small" @click="receivablesFn(record)" v-if="record.orderAmount > 0" :disabled="record.status == 3" style="margin-right: 20px;">收款</a-button>
          <a-button type="primary" size="small" @click="payMoneyFn(record)" v-if="record.orderAmount < 0" style="margin-right: 20px;" :disabled="record.status == 3">付款</a-button>
          <a-button size="small" @click="receivaDeleteFn(record)" v-if="record.orderAmount > 0" :disabled="receiveDeleteFlag(record)">删除</a-button>
        </span>
      </a-table>
      <!-- 创建收款单弹框 -->
      <a-modal
        title="创建收款单"
        v-model="receiptPoplur"
        :maskClosable='false'
        @cancel="depositCancel"
        @ok="receiptSubmit"
        okText="提交"
        width="720px"
        class="receiptCreatDom">
        <div class="fund_box_modal_box fund_box_modal_box2 myspliceBox">
          <span class="fund_box_modal_title">金额</span>
          <a-form :form='receipForm' class="receiptFormDom">
            <a-form-item>
              <a-input-number style="width: 100%" :min="0.01" :max="99999999" v-decorator="receipFormVitiy.createReceiptAmount" placeholder="请输入本次收款金额"  @change="receAmountNumChange" />
            </a-form-item>
          </a-form>
        </div>
        <p class="biaoshi" v-if="showTitle">金额必须＞0，且总收款额必须≤应收合计</p>
        <div class="receiptRecord">
          <span class="left">收款记录</span>
          <div class="right">
            <a-table :columns="receiptColumns" :dataSource="receiptData" bordered :rowKey='record => record.id'></a-table>
          </div>
        </div>
      </a-modal>
      <!-- 新页面的收取定金的弹框 -->
      <a-modal
        title="收款设置"
        v-model="depositPoplur"
        :maskClosable='false'
        @cancel="depositCancel"
        footer=""
        width="610px">
        <div class="fund_box_modal_box fund_box_modal_box2">
          <span class="fund_box_modal_title">款项</span>
          <a-input v-model="moneyProject.receivableType" disabled />
        </div>
        <div class="fund_box_modal_box fund_box_modal_box2">
          <span class="fund_box_modal_title">金额</span>
          <a-select v-model="moneyProject.totalAmount" :disabled='moneyProject.status == 2' style="width: 100%">
            <a-select-option v-for="item in EarnestList" :key="item" :value='item'>{{item}}</a-select-option>
          </a-select>
        </div>
        <div class="fund_box_modal_box fund_box_modal_box2">
          <span class="fund_box_modal_title">收款方式</span>
          <a-radio-group v-model="moneyProject.paymentType" :disabled='moneyProject.status == 2 || depositStatusFlag == 2' @change="receipTypeChange">
            <a-radio value="hundsun_nfxpos_act">智能POS</a-radio>
            <a-radio value="hundsun_wechatlet">微信小程序</a-radio>
            <a-radio value="under_line">转账/现金/普通POS收款</a-radio>
          </a-radio-group>
        </div>
        <div class="fund_box_modal_box fund_box_modal_box2 fund_box_modal_box_cloum" v-show="moneyProject.paymentType === 'hundsun_nfxpos_act'">
          <p>当前选择使用智能POS</p>
          <p>请确认是否具备与客户面对面刷卡的条件</p>
          <a-icon type="loading" style='margin-bottom: 20px;font-size: 100px' v-if="depositImgFlag == 2" />
          <img v-if="depositImgFlag == 3" :src="depositPircUrl" style='width: 250px; height: 250px;' alt="暂无图片">
          <a-button type="primary" @click="depositSure1" :loading="posIsLoadingFlag">确认使用智能POS收款</a-button>
          <div class="posPayTypeDom">
            <span class="title" style="font-size: 12px">确认后24h内不可更改</span>
          </div>
          
        </div>
        <div class="fund_box_modal_box fund_box_modal_box2 fund_box_modal_box_cloum" v-show="moneyProject.paymentType === 'hundsun_wechatlet'">
          <p>①微信有2万元的支付限制，请注意本次支付是否匹配。</p>
          <p>②确认提交后，请通知用户在小程序进行付款。</p>
          <a-button type="primary" @click="depositSure2" :disabled='moneyProject.status == 2 || moneyProject.status == 3'>确认使用微信支付</a-button>
          <div class="posPayTypeDom">
            <span class="title" style="font-size: 12px">确认后可随时更改为POS或线下支付</span>
          </div>
        </div>
        <div class="fund_box_modal_box fund_box_modal_box2 fund_box_modal_box_cloum" v-show="moneyProject.paymentType === 'under_line'">
          <!-- 加入审批模板-->
          <div class="shenpiTeample" style="width: 100%">
            <a-form :form='formData'>
              <a-form-item v-bind="formItemLayout" label="审批模板">
                <a-select v-decorator="approvalVerify.myapproval" style="width: 100%" :disabled="moneyProject.status == 2 || moneyProject.status == 3" placeholder="请选择审批模板">
                  <a-select-option v-for="(item, index) in approvalList" :key="index" :value="item.id">{{item.processRangeName}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-form>
          </div>
          <p>该笔订单金额已通过线下的方式收取，系统不做记录。提交后默认为全额已支付。</p>
          <a-button type="primary" @click="depositSure3" :disabled="moneyProject.status == 2 || moneyProject.status == 3">{{depositName}}</a-button>
        </div>
      </a-modal>
      <!-- 新页面的收款单弹框 -->
      <a-modal
        title="收款"
        v-model="receivablePoplur"
        :maskClosable='false'
        @cancel="receivableCancel"
        footer=""
        width="610px">
        <div class="fund_box_modal_box fund_box_modal_box2">
          <span class="fund_box_modal_title">金额</span>
          <a-input v-model="receivableData.orderAmount" disabled />
        </div>
        <div class="fund_box_modal_box fund_box_modal_box2">
          <span class="fund_box_modal_title">收款方式</span>
          <a-radio-group v-model="receivableData.paymentType" :disabled='receivableData.status == 2 || receivleStatusFlag == 2' @change="receipTypeChange">
            <a-radio value="hundsun_nfxpos_act" :disabled="paymentFlagOne">智能POS</a-radio>
            <a-radio value="hundsun_wechatlet" :disabled="paymentFlagTwo">微信小程序</a-radio>
            <a-radio value="under_line" :disabled="paymentFlagThree">转账/现金/普通POS收款</a-radio>
          </a-radio-group>
        </div>
        <div class="fund_box_modal_box fund_box_modal_box2 fund_box_modal_box_cloum" v-show="receivableData.paymentType === 'hundsun_nfxpos_act'">
          <p>当前选择使用智能POS</p>
          <p>请确认是否具备与客户面对面刷卡的条件</p>
          <a-icon type="loading" style='margin-bottom: 20px;font-size: 100px' v-if="receivleImgFlag == 2" />
          <img v-if="receivleImgFlag == 3" :src="receivlePircUrl" style='width: 250px; height: 250px;' alt="暂无图片">
          <a-button type="primary" @click="receivableSure(1, $event)" :loading="isPosLoadingFlag">确认使用智能POS收款</a-button>
          <div class="posPayTypeDom">
            <span class="title" style="font-size: 12px">确认后24h内不可更改</span>
          </div>
        </div>
        <div class="fund_box_modal_box fund_box_modal_box2 fund_box_modal_box_cloum" v-show="receivableData.paymentType === 'hundsun_wechatlet'">
          <p>①微信有2万元的支付限制，请注意本次支付是否匹配。</p>
          <p>②确认提交后，请通知用户在小程序进行付款。</p>
          <a-button type="primary" @click="receivableSure(2, $event)" :disabled='receivableData.status == 2'>确认使用微信支付</a-button>
          <div class="posPayTypeDom">
            <span class="title" style="font-size: 12px">确认后可随时更改为POS或线下支付</span>
          </div>
        </div>
        <div class="fund_box_modal_box fund_box_modal_box2 fund_box_modal_box_cloum" v-show="receivableData.paymentType === 'under_line'">
          <!-- 收款单加入审批模板-->
          <div class="shenpiTeample" style="width: 100%">
            <a-form :form='receFormData'>
              <a-form-item v-bind="formItemLayout" label="审批模板">
                <a-select v-decorator="receivabVerify.myapproval" style="width: 100%" :disabled="receivableData.status == 2 || receivableData.status == 3" placeholder="请选择审批模板">
                  <a-select-option v-for="(item, index) in approvalList" :key="index" :value="item.id">{{item.processRangeName}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-form>
          </div>
          <p>该笔订单金额已通过线下的方式收取，系统不做记录。提交后默认为全额已支付。</p>
          <a-button type="primary" @click="receivableSure(3, $event)" :disabled="undentLineFlag">{{receivableName}}</a-button>
        </div>
      </a-modal>
      <!-- 新页面的付款弹框myPaymantVisible -->
      <a-modal
        :title="payFullTitle"
        :visible="myPaymantVisible"
        :maskClosable='false'
        @ok="myPaymentOk"
        @cancel="myPaymentCancel"
        okText="提交"
        cancelText="取消">
        <a-form :form='myPaymentForm'>
          <div class="fund_box_modal_box">
            <span class="fund_box_modal_title">收款账户</span>
            <a-form-item style="margin-bottom: 0;">
              <a-input v-decorator="payVerify.accountName" style="width:350px;" />
            </a-form-item>
          </div>
          <div class="fund_box_modal_box">
            <span class="fund_box_modal_title">收款账号</span>
            <a-form-item style="margin-bottom: 0;">
              <a-input v-decorator="payVerify.accountNumber" style="width:350px;" />
            </a-form-item>
          </div>
          <div class="fund_box_modal_box">
            <span class="fund_box_modal_title">开户行信息</span>
            <div>
              <div>
                <a-form-item style="margin-bottom: 0;">
                  <a-select style='width: 350px;' v-decorator="payVerify.bankPrivon" showSearch optionFilterProp='children' @change="getCityCode" placeholder='请选择省份'>
                    <a-select-option v-for="item in privonList" :key="item.name" :value='item.code'>{{item.name}}</a-select-option>
                  </a-select>
                </a-form-item>
              </div>
              <div>
                <a-form-item style="margin-bottom: 0;">
                  <a-select style='width: 350px;' v-decorator="payVerify.bankCity" showSearch optionFilterProp='children' @change="getBanCode" placeholder='请选择城市'>
                    <a-select-option v-for="item in cityList" :key="item.name" :value='item.code'>{{item.name}}</a-select-option>
                  </a-select>
                </a-form-item>
              </div>
              <div>
                <a-form-item style="margin-bottom: 0;">
                  <a-select style='width: 350px;' v-decorator="payVerify.bankTypeCode" showSearch optionFilterProp='children' placeholder='请选择银行类型' @change="getBranCode">
                    <a-select-option v-for="item in branchTypeList" :key="item.name" :value='item.code'>{{item.name}}</a-select-option>
                  </a-select>
                </a-form-item>
              </div>
              <div>
                <a-form-item style="margin-bottom: 0;">
                  <a-select style='width: 350px;' v-decorator="payVerify.bankBranch" showSearch optionFilterProp='children' placeholder='请选择分行' >
                    <a-select-option v-for="item in bankList" :key="item.name" :value='item.lineNum'>{{item.branchName}}</a-select-option>
                  </a-select>
                </a-form-item>
              </div>
            </div>
          </div>
          <div class="fund_box_modal_box">
            <span class="fund_box_modal_title">账户类型</span>
            <a-form-item style="margin-bottom: 0;">
              <a-radio-group v-decorator="payVerify.infoType">
                <a-radio :value="1">对公</a-radio>
                <a-radio :value="0">对私</a-radio>
              </a-radio-group>
            </a-form-item>
          </div>
          <div class="fund_box_modal_box">
            <span class="fund_box_modal_title">开户证件</span>
            <a-form-item style="margin-bottom: 0;">
              <a-select style='width: 350px;' v-decorator="payVerify.certificate" placeholder='选择证件类型'>
                <a-select-option v-for="item in certificateList" :key="item.name" :value='item.code'>{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <div class="fund_box_modal_box">
            <span class="fund_box_modal_title">证件号码</span>
            <a-form-item style="margin-bottom: 0;">
              <a-input v-decorator="payVerify.certificateId" placeholder='输入证件号码' style="width: 350px;" />
            </a-form-item>
          </div>
          <div class="foot_tit">
            <p v-if="!titShowFlag">注：尾款为负数时，请在线下完成付款后，将付款信息录入系统</p>
            <p v-if="titShowFlag">注：提交后将自动完成转账给客户，可提现额度会扣除该部分资金，请操作前与财务确认！</p>
          </div>
        </a-form>
      </a-modal>
    </div>

  </div>
</template>
<script>
import CommonHeader from '@/components/CommonHeader/index.vue'

import { fundMixinOld } from './js/FundMixinOld'
import { fundMixinNew } from './js/FundMixinNew'
import { myPower } from '@/common/utils/power.js'

export default {
  data () {
    return {
      mythat: this,
      oldnewFlag: true, // 新老页面的显示隐藏标识
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        }
      },
      titShowFlag: false
    }
  },
  components: {
    CommonHeader
  },
  computed: {
    
  },
  created () {
    let orderVersion = JSON.parse(sessionStorage.orderValue).version
    if (orderVersion == '1' || orderVersion == null) {
      this.oldnewFlag = false
    } else if (orderVersion == '2' || orderVersion == '3'){
      this.oldnewFlag = true
    }
    if (orderVersion == '1' || orderVersion == '2') {
      this.titShowFlag = true
    } else if (orderVersion == '3') {
      this.titShowFlag = false
    }
  },
  mixins: [ fundMixinOld, fundMixinNew, myPower ],
  methods: {
    payFullTitle() {
      if (JSON.parse(sessionStorage.orderValue).version == '3') {
        return <p style="margin: 0px;"><span style="margin: 0px;font-size: 20px; font-weight: bold;">退款数据补录</span><span style="color: #A6A6A6;font-size: 12px; margin-left: 15px;">线下退款后补录退款记录</span></p>
      } else if (JSON.parse(sessionStorage.orderValue).version == '1' || JSON.parse(sessionStorage.orderValue).version == '2') {
        return <p style="margin: 0px;"><span style="margin: 0px;font-size: 20px; font-weight: bold;">在线退款</span><span style="color: #A6A6A6;font-size: 12px; margin-left: 15px;">提交后系统将自动完成退款至客户账户</span></p>
      }
    }
  }
}
</script>
<style lang="scss">
  .fund_box {
    &_menu {
      display: flex;
      justify-content: center;
      margin: 20px 0;
      span {
        text-align: center;
        padding: 20px;
        color: #fff;
        border: 1px solid #e8e8e8;
        background-color: #6cf;
      }
      .active {
        background-color: #08f
      }
    }
    &_content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 50px 0 20px 0;
      &_right {
        display: flex;
        align-items: center;
      }
    }
    .mybuttonDom{
      margin-left: 15px; 
    }
  }
  .foot_tit{
    p{
      text-align: center;
      margin: 10px 0px 0px 0px;
      color: #FA2429;
    }
  }
  .fund_box_modal_box {
    display: flex;
    margin-top: 10px;
    .fund_box_modal_title {
      min-width: 100px;
      text-align: right;
      margin-right: 5px;
      line-height: 40px;
    }
  }
  .fund_box_modal_box2 {
    align-items: center;
  }
  .fund_box_modal_box_start {
    align-items: flex-start;
  }
  .fund_box_modal_box_cloum {
    flex-flow: column;
    margin-top: 20px;
    p {
      width: 80%;
      text-align: left;
    }
  }
  .annotation {
    text-align: right;
    color: red;
  }
  .posPayTypeDom{
    position: relative;
    width: 100%;
    .title{
      position: absolute;
      right: 0px;
      top: -25px;
      color: #FA2429;
    }
  }
  .receiptCreatDom{
    .biaoshi{
      margin-right: 40px;
      color: #FA2429;
      font-size: 12px;
      text-indent: 105px;
    }
  }
  .receiptRecord{
    display: flex!important;
    margin-top: 20px;
    .left{
      flex: 0.17;
      text-align: right;
      padding-right: 10px;
    }
    .right{
      flex: 1
    }
  }
  .myspliceBox{
    height: 40px;
  }
  .receiptFormDom{
    width: 100%;
    .ant-row.ant-form-item{
      margin: 0px 0px 0px 0px;
    }
    .ant-form-explain{
      margin-bottom: 16px;
    }
  } 
  
</style>
