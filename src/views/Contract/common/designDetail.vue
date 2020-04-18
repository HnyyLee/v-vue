<template>
  <div >
    <a-modal title="设计方案详情" v-model="designVisible" width="48%" :footer="null" class="designDetail">
      <table border="1" class="comm">
        <tr class="myTr">
          <th class="myTh">方案名称</th>
          <td class="myTd">{{projectName}}</td>
        </tr>
        <tr class="myTr">
          <th class="myTh">效果图</th>
          <td class="myTd">

            <table border="1" class="smallcomm">
              <tr class="smallTitle">
                <th>空间</th>
                <td class="small_splice">效果图</td>
              </tr>
              <tr v-for="(item, index) in effectArr" :key="index" >
                <th>{{item.title}}</th>
                <td>
                  <div class="img_warp" v-for="(file,fileIndex) in item.fileList" :key="fileIndex">
                    <img :src="file.src" :alt="file.name" :title="file.name" class="img_Dom">
                  </div>
                </td>
              </tr>
            </table>

          </td>
        </tr>
        <tr class="myTr">
          <th class="myTh">施工图</th>
          <td class="myTd">
            <div class="img_warp" v-for="(item) in programList" :key="item.id">
              <img :src="item.src" alt="图片损坏" title="图片损坏"  class="img_Dom">
            </div>
          </td>
        </tr>
        <tr class="myTr">
          <th class="myTh">CAD文件</th>
          <td class="myTd">
            <div class="img_warp" v-for="(item) in cmdList" :key="item.id">
              <img :src="item.src" alt="图片损坏" title="图片损坏" class="img_Dom">
            </div>
          </td>
        </tr>
      </table>
    </a-modal>
  </div>
</template>
<script>

export default {
  data () {
    return {
      designVisible: false,
      projectName: '', // 方案名字
      fileList: [],
      effectArr: [{
        title: '厨房',
        fileList: []
      },
      {
        title: '卫生间',
        fileList: []
      },
      {
        title: '客厅',
        fileList: []
      },
      {
        title: '餐厅',
        fileList: []
      },
      {
        title: '卧室',
        fileList: []
      },
      {
        title: '阳台',
        fileList: []
      },
      {
        title: '其他',
        fileList: []
      }
      ],
      orderId: '', // 工单Id
      sliceList: [], // 删除的数组;
      programList: [], // 施工
      cmdList: [] // CRM文件
    }
  },
  props: {
    designId: {
      default: ''
    },
  },
  watch: {
    designId: {
      handler (newVal, val) {
        console.log('改变', newVal)
      },
      deep: true
    },
  },
  created () {
    this.orderId = JSON.parse(sessionStorage.getItem('orderValue'))
    if (this.designId) {
      this.getPictUrlList(this.designId)
    }
  },
  methods: {
    // 编辑获取图片链接
    getPictUrlList (designId) {
      this.$request.post('/workOrderDesign/findDesignDetailById', { id: designId }).then(res => {
        if (res.code === 0) {
          this.projectName = res.result.designName
          if (res.result.picture1) {
            this.effectArr[0].fileList = []
            res.result.picture1.forEach(item => {
              let obj = {
                src: item.url,
                id: item.id
              }
              this.effectArr[0].fileList.push(obj)
            })
          } else {
            this.effectArr[0].fileList = []
          }
          if (res.result.picture2) {
            this.effectArr[1].fileList = []
            res.result.picture2.forEach(item => {
              let obj = {
                src: item.url,
                id: item.id
              }
              this.effectArr[1].fileList.push(obj)
            })
          } else {
            this.effectArr[1].fileList = []
          }
          if (res.result.picture3) {
            this.effectArr[2].fileList = []
            res.result.picture3.forEach(item => {
              let obj = {
                src: item.url,
                id: item.id
              }
              this.effectArr[2].fileList.push(obj)
            })
          } else {
            this.effectArr[2].fileList = []
          }
          if (res.result.picture4) {
            this.effectArr[3].fileList = []
            res.result.picture4.forEach(item => {
              let obj = {
                src: item.url,
                id: item.id
              }
              this.effectArr[3].fileList.push(obj)
            })
          } else {
            this.effectArr[3].fileList = []
          }
          if (res.result.picture5) {
            this.effectArr[4].fileList = []
            res.result.picture5.forEach(item => {
              let obj = {
                src: item.url,
                id: item.id
              }
              this.effectArr[4].fileList.push(obj)
            })
          } else {
            this.effectArr[4].fileList = []
          }
          if (res.result.picture6) {
            this.effectArr[5].fileList = []
            res.result.picture6.forEach(item => {
              let obj = {
                src: item.url,
                id: item.id
              }
              this.effectArr[5].fileList.push(obj)
            })
          } else {
            this.effectArr[5].fileList = []
          }
          if (res.result.picture7) {
            this.effectArr[6].fileList = []
            res.result.picture7.forEach(item => {
              let obj = {
                src: item.url,
                id: item.id
              }
              this.effectArr[6].fileList.push(obj)
            })
          } else {
            this.effectArr[6].fileList = []
          }
          if (res.result.picture8) {
            this.programList = []
            res.result.picture8.forEach(item => {
              let obj = {
                src: item.url,
                id: item.id
              }
              this.programList.push(obj)
            })
          } else {
            this.programList = []
          }
          if (res.result.picture9) {
            this.cmdList = []
            res.result.picture9.forEach(item => {
              let obj = {
                src: item.url,
                id: item.id
              }
              this.cmdList.push(obj)
            })
          } else {
            this.cmdList = []
          }
        }
      })
    }
  }
}
</script>
<style lang="scss">
.designDetail{
  p{
    margin: 0px;
  }
  .comm {
    margin: 0px auto 0px;
    width: 100%;
    .myTr {
      height: 50px;
      .myTh, .myTd {
        padding: 10px;
        border: 1px solid #E8E8E8;
      }
      .myTh {
        text-align: center;
        width: 15%;
      }
      .myTd{
        text-align: left;
      }
    }
    .smallcomm {
      margin: 0px auto 0px;
      width: 100%;
      .smallTitle{
        height: 60px;
      }
      tr {
        th, td {
          height: 90px;
          text-align: center;
          padding: 2px 10px;
          border: 1px solid #E8E8E8;
        }
        th {
          width: 15%;
        }
        td {
          text-align: left;
        }
        .small_splice{
          text-align: center;
          background: #FAFAFA;
        }
      }
    }
    .img_warp{
      width: 90px;
      padding: 5px 0px;
      display: inline-block;
      margin-right: 10px;
      .img_Dom{
        width: 90px;
        height: 90px;
      }
    }
  }
  
}
</style>
