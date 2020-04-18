<template>
  <div class="Reduciton">
    
    <!-- <div class="btn_Dom">
      <a-button @click="deleteFun">删除所选主材类别</a-button>
    </div> -->
    <!-- 表格 -->
    <div class="content">
      <a-table :columns="reductionColumns" :dataSource="reductionData" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" bordered :locale="{emptyText: '暂无数据'}" :pagination="true">
        <template slot="action" slot-scope="text, rend">
          <p>{{rend.price}}</p>
          <!-- <a-input style="width:140px; text-align: center;" type="number" @change="oninputChange(rend, $event)" min="0.01" max="9999999" step="0.01" v-model="rend.price" @blur="onBlurFn(rend, $event)" /> -->
        </template>
      </a-table>
    </div>

    <div class="material_selection_footer">
      <a-button type="primary" @click="stepBack" style="margin-right: 10px;">上一步</a-button>
      <a-button type="primary" @click="nextThink">下一步</a-button>
    </div>

  </div>
</template>
<script>

const columns = [{
  title: 'Name',
  dataIndex: 'name'
}, {
  title: 'Age',
  dataIndex: 'age'
}, {
  title: 'Address',
  dataIndex: 'address'
}]
import { reductionColumns } from '@/common/mymock'
import { bus } from '@/main.js'

export default {
  props: {
    
  },
  data () {
    return {
      reductionColumns,
      reductionData: [],
      selectedRowKeys: [],
      saveProductId: '',
      chooseDeleList: [],
      doneDeleFlag: false, // 第一次进来这个页面点击下一步到第四步之后，这个值置为true，表示之后都会调用查看详情/product/queryProductDiscountsById接口
    }
  },
  components: {
    
  },
  created () {
    
  },
  computed: {
  },
  methods: {
    // 获取列表事件
    showReductionData(adata, myRangeIdList) {
      this.saveProductId = adata
      this.reductionData = []
      if (this.doneDeleFlag == false) {
        let sendObj = {
          pageSize: 100000,
          productId: adata
          // rangeIdList: myRangeIdList
        }
        this.$request.post('/product/queryProductDiscountsById', sendObj).then(response => {
          if (response.code == 0) {
            if (response.result.list && response.result.list.length !== 0) {
              this.reductionData = response.result.list
              this.reductionData.forEach((item, index) => {
                item.key = index
                item.code = Number(index) + 1
                if (!item.price) item.price = ''
              })
            }
          }
        })
      } else {
        let sendObj = {
          productId: adata,
          pageSize: 10000
        }
        this.$request.post('/product/queryProductDiscountsById', sendObj).then(response => {
          if (response.code == 0) {
            if (response.result.list && response.result.list.length !== 0) {
              this.reductionData = response.result.list
              this.reductionData.forEach((item, index) => {
                item.key = index
                item.code = Number(index) + 1
                if (!item.price) item.price = ''
              })
            }
          }
        })
      }
    },
    // 删除事件
    deleteFun() {
      if (this.chooseDeleList.length == 0) {
        this.$message.info('暂无选择任何数据')
        return
      }
      let that = this
      this.$confirm({
        title: '是否确定删除所选数据？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          let aArr = []
          that.reductionData = that.reductionData.filter(item=> {
            return !that.chooseDeleList.some(function(ele) {
              return ele.code == item.code
            })
          })
          that.chooseDeleList = []
          that.selectedRowKeys = []
          that.reductionData.forEach((item, index) => {
            item.key = index
            item.code = Number(index) + 1
          })
        }
      })
    },
    // 数字输入框改变事件
    oninputChange(adata, event) {
      let asaveNum = ''
      if (String(event.target.value).split('.')[1]) {
        asaveNum = String(event.target.value).split('.')[0] + '.' + String(event.target.value).split('.')[1].substring(0, 2)
      } else {
        if (event.data == '.') {
          asaveNum = event.target.value + '.'
        } else {
          asaveNum = event.target.value
        }
      }
      if (asaveNum.indexOf('.') !== -1 && String(event.target.value).split('.')[1] == undefined) {
        asaveNum = event.target.value
      }
      if (asaveNum) {
        if (asaveNum < 0) {
          this.$message.info('当前数量不可录入负数和零')
          return
        }
      }
      this.reductionData.forEach(item => {
        if (item.code == adata.code) {
          item.price = asaveNum
        }
      })
      this.$forceUpdate()
    },
    // 失去焦点事件
    onBlurFn(adata, ev) {
      if (adata.price == '' || adata.price == 0 || adata.price < 0) {
        this.reductionData.forEach(item => {
          if (item.code == adata.code) {
            this.$message.info('当前数量不可录入零和空值')
            item.price = ''
          }
        })
      }
      this.$forceUpdate()
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.chooseDeleList = selectedRows
    },
    // 上一步
    stepBack () {
      this.$emit('goReductionLast')
    },
    // 下一步
    nextThink () {
      let obj = {}
      let saveArr = this.reductionData.reduce((cur, next) => {
        obj[next.name] ? "" : obj[next.name] = true && cur.push(next)
        return cur
      }, [])
      if (this.reductionData.length !== saveArr.length) {
        this.$message.warning('产品系列折减价格配置错误(不允许同名不同价)')
        return
      }

      let sendObj = {
        id: this.saveProductId,
        productDiscountVoList: []
      }
      this.reductionData.forEach(item => {
        let aobj = {}
        aobj.category = item.category
        aobj.unit = item.unit
        aobj.price = item.price
        aobj.name = item.name
        sendObj.productDiscountVoList.push(aobj)
      })
      let aflag = true
      this.reductionData.forEach(item => {
        if (!item.price) {
          aflag = false
        }
      })
      if (aflag == false) {
        this.$message.info('请输入完整的折减价')
        return
      }
      this.$emit('goFour', this.reductionData)
      this.doneDeleFlag = true
      // this.$request.post('/product/updateProductDiscounts', sendObj).then(response => {
      //   if (response.code == 0) {
      //     this.$message.success('保存成功!')
      //     this.$emit('goFour', this.reductionData)
      //     this.doneDeleFlag = true
      //   }
      // })
    }
  }
}
</script>
<style lang="scss">
.Reduciton{
  .btn_Dom{
    margin-top: 45px;
  }
  .content{
    margin-top: 15px;
  }
  .material_selection_footer {
    display: flex;
    justify-content: center;
    margin: 80px 0px 10px 0px;
  }
  .reductNumber{
    width: 30%;
    input.ant-input-number-input{
      text-align: center;
    }
  }
}
</style>
