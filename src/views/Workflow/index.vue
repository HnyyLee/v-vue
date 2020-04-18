<template>
  <div class="work_wrap">
    <div class="work_header">
      <h3>工作流配置</h3>
      <a-button type="primary" class="btn_add" @click="addFun" v-if="RouterNameFlag[mythat.$route.name] || RouterNameFlag['workflow_create']">新增流程</a-button>
    </div>
    <a-table :columns="columns" :dataSource="dataArr" bordered :pagination='false'>
      <template slot="id" slot-scope="text, values">
        <a href="javascript:;" @click="go(values)" v-if="RouterNameFlag[mythat.$route.name] || RouterNameFlag['workflow_detail']">设置</a>
      </template>
    </a-table>

    <div class="PageDom">
      <a-pagination showSizeChanger :pageSize.sync="pageSize" @showSizeChange="onShowSizeChange" @change="mypagechange" :total="total" v-model="pageNum" />
    </div>

  </div>
</template>
<script>
import { myPower } from '@/common/utils/power.js'

const columns = [
  {
    title: '序号',
    dataIndex: 'serli',
    align: 'center'
  },
  {
    title: '工作流',
    dataIndex: 'myprocessName',
    align: 'center'
  },
  {
    title: '使用范围',
    dataIndex: 'cityCompanyName',
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'id',
    align: 'center',
    scopedSlots: { customRender: 'id' }
  }
]
export default {
  data () {
    return {
      mythat: this,
      columns,
      pageNum: 1, // 页数
      pageSize: 10, // 条数
      total: 0, // 总数
      dataArr: []
    }
  },
  created () {
    this.getWorkList()
  },
  mixins: [myPower],
  methods: {
    getWorkList () { // 获取工作流列表数据
      let obj = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      this.$request.post('/processTemplate/list', obj).then(res => {
        if (res.code === 0) {
          this.total = res.result.total
          this.pageNum = res.result.pageNum
          if (res.result.list && res.result.list.length !== 0) {
            this.dataArr = []
            res.result.list.forEach((item, index) => {
              let obj = item
              obj.serli = index + 1
              obj.key = index
              if (obj.processRangeName) {
                obj.myprocessName = obj.processRangeName + '——' + obj.processName
              } else {
                obj.myprocessName = obj.processName
              }
              this.dataArr.push(obj)
            })
          }
        }
      })
    },
    go (e) {
      this.$router.push({ path: '/setworkflow', query: { id: e.id } })
    },
    onShowSizeChange (pageNum, pageSize) {
      this.pageNum = 1
      this.pageSize = pageSize
      this.getWorkList()
    },
    addFun () {
      this.$router.push('/setworkflow')
    },
    // 页码改变事件
    mypagechange(ev) {
      this.pageNum = ev
      this.getWorkList()
    }
  }
}
</script>

<style lang="scss">
.work_wrap {
  .work_wrap_pagination {
    display: flex;
    justify-content: flex-end;
  }
  .work_header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .btn_add{
    background: #85CE61;
    border: 1px solid #85CE61;
  }
  .PageDom{
    margin-top: 20px;
    text-align: right
  }
}
</style>
