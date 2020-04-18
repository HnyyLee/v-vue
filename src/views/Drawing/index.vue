<template>
  <div class="drawing">
    <common-header :value='infoValue'></common-header>
    <div class="drawing_content">
      <div class="drawing_content_header">
        <span>设计方案</span>
        <a-button class="btn_add" type="primary" v-if="(orderStatis != 0) && (RouterNameFlag[mythat.$route.name] || RouterNameFlag['order_add_designScheme'])" @click="addDesign">新增设计方案</a-button>
      </div>
      <a-table :columns="columns" :dataSource="dataArr" bordered :pagination='false'>
        <span slot="id" slot-scope="text, record">
          <a href="javascript:;" v-if="(orderStatis != 0) && (RouterNameFlag[mythat.$route.name] || RouterNameFlag['order_edit_designScheme'])" @click="go(text, record)">编辑</a>
        </span>
      </a-table>
    </div>
    <div class="drawing_wrap_pagnin">
      <a-pagination showSizeChanger :pageSize.sync="pageSize" @showSizeChange="onShowSizeChange" :total="total" v-model="current" style="margin-top: 30px;"/>
    </div>
  </div>
</template>
<script>
import CommonHeader from '@/components/CommonHeader/index.vue'
import { myPower } from '@/common/utils/power.js'

export default {
  data () {
    return {
      mythat: this,
      infoValue: {
        index: 3
      },
      orderId: '', // 工单信息
      current: 1,
      pageSize: 10,
      dataArr: [],
      total: 0, // 总数
      columns: [
        {
          title: '序号',
          dataIndex: 'key',
          align: 'center',
          width: 50
        },
        {
          title: '方案名',
          dataIndex: 'designName',
          align: 'center',
          width: 200
        },
        {
          title: '服务类型',
          dataIndex: 'serviceType',
          align: 'center',
          width: 150
        },
        {
          title: '创建时间',
          dataIndex: 'createTimeStr',
          align: 'center',
          width: 200
        },
        {
          title: '状态',
          dataIndex: 'status',
          align: 'center',
          width: 150
        },
        {
          title: '操作',
          dataIndex: 'id',
          align: 'center',
          width: 150,
          scopedSlots: { customRender: 'id' }
        }
      ],
      orderStatis: '' // 工单ID
    }
  },
  components: {
    CommonHeader
  },
  mixins: [myPower],
  beforeCreate () {
    this.dataArr = []
    this.columns = []
  },
  watch: {
    current (val) {
      this.current = val
      this.getDataFun()
    }
  },
  created () {
    this.orderId = JSON.parse(sessionStorage.getItem('orderValue'))
    this.getData()
    this.getOrderStatus()
  },
  methods: {
    getOrderStatus () {
      this.$request.get('/projectWorkOrder/getWorkOrderBasicInfoByCode?workOrderNumber=' + this.orderId.code).then(res => {
        if (res.code === 0) {
          this.orderStatis = res.result.status
        }
      })
    },
    // 新增设计方案
    addDesign () {
      this.$router.push('/add-design')
    },
    // 获取初始化数据
    getData () {
      let obj = {
        pageNum: this.current,
        pageSize: this.pageSize,
        workOrderId: this.orderId.id
      }
      this.$request.post('/workOrderDesign/getPageDesign', obj).then(res => {
        if (res.code === 0) {
          if (res.result.list) {
            this.dataArr = []
            res.result.list.forEach((item, index) => {
              let obj = item
              obj.key = index + 1
              this.dataArr.push(obj)
            })
          } else {
            this.dataArr = []
          }
          this.total = res.result.total
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 转跳去编辑
    go (e, event) {
      this.$router.push({ path: '/add-design', query: { id: event.id } })
    },
    onShowSizeChange (current, pageSize) {
      this.pageSize = pageSize
      this.getDataFun()
    }
  }
}
</script>
<style lang="scss">
  .drawing {
    &_content {
      margin-top: 20px;
      .drawing_content_header {
        margin: 20px 0px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
    &_wrap_pagnin {
      display: flex;
      justify-content: flex-end;
    }
    .btn_add{
      background: #85CE61;
      border: 1px solid #85CE61;
    }
  }
</style>
