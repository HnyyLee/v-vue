<template>
  <div class="increase_wrap">
    <h4>查看工程变更明细</h4>
    <h5>主材变更</h5>
    <a-table style="margin-top: 10px;" :columns="columns" :dataSource="dataList" bordered :pagination='false' :locale='locale'></a-table>
    <h5>施工变更</h5>
    <a-table style="margin-top: 10px;" :columns="columns2" :dataSource="dataList2" bordered :pagination='false' :locale='locale'></a-table>
  </div>
</template>
<script>
export default {
  data () {
    return {
      dataList: [], // 主材变更
      dataList2: [], // 施工变更
      locale: { emptyText: '暂无数据' }, // 无数据显示文案
      columns: [
        { title: '序号', dataIndex: 'serial', align: 'center', class: 'column-center' },
        { title: '物料编码', dataIndex: 'code', align: 'center', class: 'column-center' },
        { title: '类别', dataIndex: 'category', align: 'center', class: 'column-center' },
        { title: '产品名称', dataIndex: 'name', align: 'center', class: 'column-center' },
        { title: '品牌', dataIndex: 'brand', align: 'center', class: 'column-center' },
        { title: '型号', dataIndex: 'type', align: 'center', class: 'column-center' },
        { title: '规格', dataIndex: 'size', align: 'center', class: 'column-center' },
        { title: '数量', dataIndex: 'num', align: 'center', class: 'column-center' },
        { title: '单位', dataIndex: 'unit', align: 'center', class: 'column-center' },
        { title: '价格', dataIndex: 'price', align: 'center', class: 'column-center' },
        { title: '备注', dataIndex: 'note', align: 'center', class: 'column-center' }
      ],
      columns2: [
        { title: '序号', dataIndex: 'serial', align: 'center', class: 'column-center' },
        { title: '物料编码', dataIndex: 'code', align: 'center', class: 'column-center' },
        { title: '类别', dataIndex: 'category', align: 'center', class: 'column-center' },
        { title: '工艺名称', dataIndex: 'name', align: 'center', class: 'column-center' },
        { title: '数量', dataIndex: 'num', align: 'center', class: 'column-center' },
        { title: '单位', dataIndex: 'unit', align: 'center', class: 'column-center' },
        { title: '价格', dataIndex: 'price', align: 'center', class: 'column-center' },
        { title: '施工说明', dataIndex: 'introduce', align: 'center', class: 'column-center' }
      ]
    }
  },
  created () {
    this.getDataListPir()
  },
  methods: {
    getDataListPir () { // 获取编辑主材列表
      this.dataList = []
      this.dataList2 = []
      this.$request.post('/workOrderAddDrop/findIODDetailById', { id: this.$route.query.id }).then(res => {
        if (res.code === 0) {
          if (res.result.key1) { // 处理主材
            res.result.key1.forEach((item, index) => {
              let obj = item
              obj.serial = index + 1
              obj.key = index
              this.dataList.push(obj)
            })
          }
          if (res.result.key2) { // 处理施工
            res.result.key2.forEach((item, index) => {
              let obj = item
              obj.serial = index + 1
              obj.key = index
              this.dataList2.push(obj)
            })
          }
        }
      })
    }
  }
}
</script>
<style lang="scss">
.increase_wrap {
  h4 {
    font-size: 20px;
    font-weight: 800;
  }
  h5 {
    font-size: 16px;
    margin-top: 10px;
  }
}
</style>
