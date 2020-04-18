<template>
  <div class="advance_box">
    <common-header :value='infoValue'></common-header>
    <div class="advance_box_header">
      <h3>供应商预付款记录</h3>
      <a-button type="primary" @click="applyFor">申请预付款</a-button>
    </div>
    <a-table :columns="columns" :dataSource="thLsit" bordered class="tab_box"></a-table>
    <a-modal
      title="预付款申请"
      v-model="visible"
      :maskClosable='false'
      @ok="handleOk"
    >
      <div class="advance_box_modal">
        <span>供应商</span>
        <a-select
          mode="multiple"
          :value="selectedItems"
          @change="handleChange"
          style="width: 100%"
        >
          <a-select-option v-for="item in filteredOptions" :key="item" :value="item">
            {{item}}
          </a-select-option>
        </a-select>
      </div>
      <div class="advance_box_modal">
        <span>预付金额</span>
        <a-input placeholder="Basic usage" style="width: 35%"/>&nbsp;&nbsp;金额＜实收金额40000*30%
      </div>
      <div class="advance_box_modal">
        <span>预付原因</span>
        <a-select defaultValue="lucy" style="width: 100%" @change="handleChange2">
          <a-select-option value="jack">Jack</a-select-option>
          <a-select-option value="lucy">Lucy</a-select-option>
          <a-select-option value="disabled" disabled>Disabled</a-select-option>
          <a-select-option value="Yiminghe">yiminghe</a-select-option>
        </a-select>
      </div>
    </a-modal>
  </div>
</template>
<script>
import CommonHeader from '@/components/CommonHeader/index.vue'

const columns = [
  {
    title: '供应商名称',
    dataIndex: 'name',
    align: 'center'
  },
  {
    title: '预付金额',
    dataIndex: 'price',
    align: 'center'
  },
  {
    title: '状态',
    dataIndex: 'status',
    align: 'center'
  },
  {
    title: '申请时间',
    dataIndex: 'time',
    align: 'center'
  }
]
export default {
  data () {
    return {
      infoValue: {
        workNumber: 20156899,
        name: '刘德华',
        fitment: '卧室/墙壁',
        index: 6
      },
      columns,
      visible: false,
      thLsit: [],
      selectedItems: [],
      OPTIONS: ['Apples', 'Nails', 'Bananas', 'Helicopters']
    }
  },
  components: {
    CommonHeader
  },
  methods: {
    applyFor () {
      this.visible = true
    },
    handleOk () {
    },
    handleChange (selectedItems) {
      this.selectedItems = selectedItems
    },
    handleChange2 () {
    }
  },
  computed: {
    filteredOptions () {
      return this.OPTIONS.filter(o => !this.selectedItems.includes(o))
    }
  }
}
</script>
<style lang="scss">
  .advance_box {
    &_header {
      display: flex;
      justify-content: space-between;
      margin: 30px 0 20px 0;
    }
    &_modal {
      display: flex;
      align-items: center;
      padding: 5px;
      span {
        min-width: 80px;
        text-align: right;
        padding-right: 5px;
      }
    }
  }
</style>
