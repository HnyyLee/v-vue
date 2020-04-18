<template>
  <div>
    <h3>短信配置</h3>
    <a-table :columns='columns' :dataSource="dataList" :pagination="false" bordered>
      <div slot="perpon" slot-scope="values">
        <div class="add_sms_phone_item">
          <span v-for="item in values" :key='item.id'>{{item}} <a-icon type="close-circle" @click="deleted(item)" class="sms_phone_delelt" /></span>
        </div>
        <a-button type='primary' v-if="addFlag === false && (RouterNameFlag[mythat.$route.name] || RouterNameFlag['SMS_Add'])" @click="addPhone">添加</a-button>
        <div class="Sms_add_sms_phone" v-if="addFlag">
          <a-input type='text' v-model="phone" placeholder='请输入员工手机号' style="width: 200px"></a-input>
          <a-button type='primary' style="margin: 0 10px;" @click="sumbit">提交</a-button>
          <a-button @click="canke">取消</a-button>
        </div>
      </div>
    </a-table>
  </div>
</template>
<script>
import { myPower } from '@/common/utils/power.js'

export default {
  data () {
    return {
      mythat: this,
      dataList: [
        {
          key: 1,
          receivableType: '预约提醒',
          condition: '超过5分钟未领取预约线索',
          content: '你有未领取任务，已超时5分钟。请及时登录系统处理。',
          perpon: []
        }
      ],
      columns: [
        { title: '模块', align: 'center', dataIndex: 'receivableType', width: 100 },
        { title: '前置条件', align: 'center', dataIndex: 'condition', width: 200 },
        { title: '内容', align: 'center', dataIndex: 'content', width: 400 },
        { title: '通知接收人', align: 'center', dataIndex: 'perpon', scopedSlots: { customRender: 'perpon' }, width: 100 }
      ],
      addFlag: false,
      phone: ''
    }
  },
  created () {
    this.getList()
  },
  mixins: [myPower],
  methods: {
    addPhone () { // 新增
      this.addFlag = true
    },
    canke () {
      this.addFlag = false
      this.phone = ''
    },
    sumbit () { // 提交
      if (this.phone.length !== 11) {
        this.$message.error('输入正确的手机号码')
        return
      }
      this.$request.get('message/add/' + this.phone).then(res => {
        if (res.code === 0) {
          this.getList()
          this.addFlag = false
          this.phone = ''
        }
      })
    },
    deleted (i) { // 删除
      this.$request.get('/message/del/' + i).then(res => {
        if (res.code === 0) {
          this.getList()
        }
      })
    },
    getList () { // 查新列表
      this.$request.get('/message/list').then(res => {
        if (res.code === 0) {
          if (res.result) {
            this.dataList[0].perpon = res.result
          } else {
            this.dataList[0].perpon = []
          }
        }
        console.log(res)
      })
    }
  }
}
</script>
<style lang="scss">
.Sms_add_sms_phone {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
.add_sms_phone_item {
  display: flex;
  justify-content: center;
  flex-flow: wrap;
  span {
    padding: 5px;
    border-radius: 5px;
    background-color:#eee;
    margin-left: 10px;
    margin-bottom: 10px;
    position: relative;
    .sms_phone_delelt {
      position: absolute;
      top: -5px;
      right: -5px;
    }
  }
}
</style>
