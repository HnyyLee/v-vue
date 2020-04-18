<template>
  <div class="add_design">
    <common-header :value="infoValue"></common-header>

    <div class="add_design_content">
      <div class="design_project_name">
        <h4>方案名称</h4>
        <a-input size="large" v-model="projectName" />
      </div>
      <h4 class="design_project_xg">
        效果图
        <div style="margin-left: 10px;">更新于{{time1}}</div>
      </h4>
      <div class="effect">
        <div class="effect_title effect_header_title">空间</div>
        <div class="effect_content effect_header_content">效果图</div>
      </div>
      <div class="effect" v-for="(item, index) in effectArr" :key="index">
        <div class="effect_title">{{item.title}}</div>
        <div class="effect_content">
          <div class="file-list">
            <div
              class="img-warp"
              v-for="(file,fileIndex) in item.fileList"
              :key="fileIndex"
              v-show="file.isUpFlag !== true"
            >
              <img :src="file.src" :alt="file.name" :title="file.name" />
              <div class="tools">
                <a-button
                  @click="delFile"
                  :data-list-index="index"
                  :data-item-index="fileIndex"
                  :size="'small'"
                  style="margin-right: 5px; margin-top: 5px"
                  type="danger"
                >删除</a-button>
                <a-button
                  @click="downloadFile"
                  :data-list-index="index"
                  :data-item-index="fileIndex"
                  :size="'small'"
                  style="margin-top: 5px"
                  type="primary"
                >下载</a-button>
              </div>
            </div>
          </div>
          <div class="uploader-wrap">
            <label class="custom-upload">
              <a-icon :type="item.loading ? 'loading' : 'plus'" />
              <span>上传{{item.title}}效果图</span>
              <input
                type="file"
                v-on:change="fileUploadChange"
                :data-list-index="index"
                accept
                multiple="multiple"
                style="display: none;"
              />
            </label>
          </div>
        </div>
      </div>
      <!-- 全景图 -->
      <div class="design_constuct_pict">
        <div class="design_constuct_pict_header">
          <h4>全景图</h4>
          <div style="width:90%; margin-left: 15px;">
            <a-input placeholder="请输入或粘贴全景图网址" v-model="myPanoramaWebsite" />
          </div>
        </div>
      </div>
      <!-- 施工图 -->
      <div class="design_constuct_pict">
        <div class="design_constuct_pict_header">
          <h4>施工图</h4>
          <div class="design_constuct_pict_header_val">
            <label>
              <a-icon type="plus" />
              <input
                type="file"
                v-on:change="fileUploadChangeTwo"
                accept
                multiple="multiple"
                style="display: none;"
              />
            </label>
          </div>
          <div style="margin-left: 10px;">更新于{{time2}}</div>
        </div>
        <div class="design_constuct_pict_content">
          <div
            v-for="(item, index) in programList"
            :key="item.id"
            class="design_constuct_pict_content_item"
            v-show="item.isUpFlag !== true"
          >
            <img :src="item.src" alt="图片损坏" title="图片损坏" />
            <div class="tools">
              <a-button
                @click="delFileTwo(index)"
                size="small"
                style="margin-right: 5px; margin-top: 5px"
                type="danger"
              >删除</a-button>
              <a-button
                @click="downloadFileTwo(index)"
                size="small"
                style="margin-top: 5px"
                type="primary"
              >下载</a-button>
            </div>
          </div>
        </div>
      </div>
      <!-- CAD源文件 -->
      <div class="design_constuct_pict">
        <div class="design_constuct_pict_header">
          <h4>CAD源文件</h4>
          <div class="design_constuct_pict_header_val">
            <label>
              <a-icon type="plus" />
              <input
                type="file"
                v-on:change="fileUploadChangeCMD"
                accept
                multiple="multiple"
                style="display: none;"
              />
            </label>
          </div>
          <div style="margin-left: 10px;">更新于{{time3}}</div>
        </div>
        <div class="design_constuct_pict_content">
          <div
            v-for="(item, index) in cmdList"
            :key="item.id"
            class="design_constuct_pict_content_item"
            v-show="item.isUpFlag !== true"
          >
            <!-- {{item}} -->
            <img src="./img/DWG.png" alt="图片损坏" title="图片损坏" />
            <div class="tools">
              <a-button
                @click="delFileCMD(index)"
                size="small"
                style="margin-right: 5px; margin-top: 5px"
                type="danger"
              >删除</a-button>
              <a-button
                @click="downloadFileCMD(index)"
                size="small"
                style="margin-top: 5px"
                type="primary"
              >下载</a-button>
            </div>
          </div>
        </div>
      </div>
      <div class="design_bottom">
        <a-button style="width: 150px; margin-right: 10px" @click="cancel">取消</a-button>
        <a-button
          type="primary"
          style="width: 150px;"
          @click="submit"
          :loading="designImgLoading"
        >提交</a-button>
      </div>
    </div>
    <!-- <a ref="downloadLink" :href="downloadImg" :download="downloadFileName" /> -->
    <!-- <a ref="downloadLink" :href="downloadImg" :download="downloadFileName" /> -->
    <a ref="downloadLink" href="https://geekjc-img.geekjc.com/logo.png" download="logo.png" />
  </div>
</template>
<script>
import CommonHeader from "@/components/CommonHeader/index.vue";

export default {
  data() {
    return {
      infoValue: {
        index: 3
      },
      time1: "",
      time2: "",
      time3: "",
      downloadImg: "",
      downloadFileName: "",
      projectName: "", // 方案名字
      fileList: [],
      effectArr: [
        {
          title: "厨房",
          fileList: []
        },
        {
          title: "卫生间",
          fileList: []
        },
        {
          title: "客厅",
          fileList: []
        },
        {
          title: "餐厅",
          fileList: []
        },
        {
          title: "卧室",
          fileList: []
        },
        {
          title: "阳台",
          fileList: []
        },
        {
          title: "其他",
          fileList: []
        }
      ],
      orderId: "", // 工单Id
      sliceList: [], // 删除的数组;
      programList: [], // 施工
      cmdList: [], // CRM文件
      designImgLoading: false, // 新增图纸的提交按钮的loading
      myPanoramaWebsite: '' // 全景图的URL
    };
  },
  components: {
    CommonHeader
  },
  created() {
    this.orderId = JSON.parse(sessionStorage.getItem("orderValue"));
    if (this.$route.query.id) {
      this.getPictUrlList();
    }
  },
  methods: {
    fileUploadChangeTwo(e) {
      // 施工
      const url = window.URL || window.webkitURL || window.moxURL;
      let arr = [];
      arr.forEach.call(e.target.files, file => {
        let obj = {
          src: url.createObjectURL(file),
          name: file.name,
          isUpFlag: false
        };
        this.programList.push(obj);
        this.upLoadFile(obj, file, 2);
      });
    },
    fileUploadChangeCMD(e) {
      const url = window.URL || window.webkitURL || window.moxURL;
      let arr = [];
      arr.forEach.call(e.target.files, file => {
        let obj = {
          src: url.createObjectURL(file),
          name: file.name,
          isUpFlag: false
        };
        this.cmdList.push(obj)
        this.upLoadFile(obj, file, 3)
      })
    },
    fileUploadChange(e) {
      // 点击上传
      const url = window.URL || window.webkitURL || window.moxURL
      const fileList = this.effectArr[e.target.dataset.listIndex].fileList
      let arr = []
      arr.forEach.call(e.target.files, file => {
        let obj = {
          src: url.createObjectURL(file),
          name: file.name,
          isUpFlag: false
        };
        fileList.push(obj);
        console.log('查看看', obj, file)
        this.upLoadFile(obj, file, 1)
      })
    },
    upLoadFile(val, file, type) {
      // 上传处理
      const form = new FormData()
      form.append("file", file)
      let upLoafileUrl = "/workOrderDesign/uploadDesignPicture/" + type;
      this.$request({
        method: "post",
        url: upLoafileUrl,
        headers: {
          "Content-Type": "multipart/form-data;charset=UFT-8"
        },
        data: form
      })
        .then(res => {
          if (res.code === 0) {
            val.src = res.result
          } else {
            val.isUpFlag = true
          }
        })
        .catch(err => {
          val.isUpFlag = true
        })
    },
    // 删除文件
    delFile(e) {
      const file = this.effectArr[e.target.dataset.listIndex].fileList[
        e.target.dataset.itemIndex
      ]
      if (file.id) {
        this.effectArr[e.target.dataset.listIndex].fileList.splice(
          [e.target.dataset.itemIndex],
          1
        );
        this.sliceList.push(file);
      } else {
        this.effectArr[e.target.dataset.listIndex].fileList.splice(
          [e.target.dataset.itemIndex],
          1
        )
      }
    },
    delFileTwo(i) {
      const file = this.programList[i]
      if (file.id) {
        this.sliceList.push(file)
        this.programList.splice(i, 1)
      } else {
        this.programList.splice(i, 1)
      }
    },
    delFileCMD(i) {
      const file = this.cmdList[i]
      if (file.id) {
        this.sliceList.push(file)
        this.cmdList.splice(i, 1)
      } else {
        this.cmdList.splice(i, 1)
      }
    },
    // 下载文件
    downloadFile(e) {
      const file = this.effectArr[e.target.dataset.listIndex].fileList[
        e.target.dataset.itemIndex
      ]
      this.downXz(file.src)
    },
    downCAD(e) {
      const file = this.effectArr[e.target.dataset.listIndex].fileList[
        e.target.dataset.itemIndex
      ];
      let downloadLink = document.createElement("a")
      downloadLink.href = file.src
      downloadLink.download = file.name
      downloadLink.click()
    },
    downXz(file, name = "pic") {
      let eleLink = document.createElement("a")
      eleLink.download = name
      eleLink.href = file
      eleLink.click()
      eleLink.remove()
    },
    downloadFileTwo(i) {
      const file = this.programList[i]
      this.downXz(file.src)
    },
    downloadFileCMD(i) {
      const file = this.cmdList[i];
      let downloadLink = document.createElement("a");
      downloadLink.href = file.src;
      downloadLink.download = file.name;
      downloadLink.click();
    },
    getPictUrlList() {
      // 编辑获取图片链接
      this.$request.post("/workOrderDesign/findDesignDetailById", { id: this.$route.query.id }).then(res => {
        if (res.code === 0) {
          this.time1 = res.result.type1
          this.time2 = res.result.type2
          this.time3 = res.result.type3
          this.projectName = res.result.designName
          this.myPanoramaWebsite = res.result.panoramaWebsite
          if (res.result.picture1) {
            res.result.picture1.forEach(item => {
              let obj = {
                src: item.url,
                id: item.id
              }
              this.effectArr[0].fileList.push(obj)
            })
          }
          if (res.result.picture2) {
            res.result.picture2.forEach(item => {
              let obj = {
                src: item.url,
                id: item.id
              }
              this.effectArr[1].fileList.push(obj)
            })
          }
          if (res.result.picture3) {
            res.result.picture3.forEach(item => {
              let obj = {
                src: item.url,
                id: item.id
              };
              this.effectArr[2].fileList.push(obj);
            })
          }
          if (res.result.picture4) {
            res.result.picture4.forEach(item => {
              let obj = {
                src: item.url,
                id: item.id
              }
              this.effectArr[3].fileList.push(obj)
            })
          }
          if (res.result.picture5) {
            res.result.picture5.forEach(item => {
              let obj = {
                src: item.url,
                id: item.id
              }
              this.effectArr[4].fileList.push(obj);
            })
          }
          if (res.result.picture6) {
            res.result.picture6.forEach(item => {
              let obj = {
                src: item.url,
                id: item.id
              }
              this.effectArr[5].fileList.push(obj);
            })
          }
          if (res.result.picture7) {
            res.result.picture7.forEach(item => {
              let obj = {
                src: item.url,
                id: item.id
              }
              this.effectArr[6].fileList.push(obj)
            })
          }
          if (res.result.picture8) {
            res.result.picture8.forEach(item => {
              let obj = {
                src: item.url,
                id: item.id
              }
              this.programList.push(obj)
            })
          }
          if (res.result.picture9) {
            res.result.picture9.forEach(item => {
              let obj = {
                src: item.url,
                id: item.id
              }
              this.cmdList.push(obj)
            })
          }
        }
      })
    },
    // 提交
    submit() {
      if (this.projectName === "") {
        return this.$message.error("请输入方案名称");
      }
      let listAddKitchens = []; // 厨房
      let listAddToilets = []; // 卫生间
      let listAddParlours = []; // 客厅
      let listAddRestaurants = []; // 餐厅
      let listAddBedrooms = []; // 卧室
      let listAddBalconys = []; // 阳台
      let listAddOthers = []; // 其他
      let listDeleteIds = []; // 删除的图片
      let listAddWorkingDrawings = []; // 施工图纸集合
      let listAddCADs = []; // CMD

      this.effectArr[0].fileList.forEach((item, index) => {
        if (!item.id && item.isUpFlag === false) {
          listAddKitchens.push(item.src);
        }
      });
      this.effectArr[1].fileList.forEach((item, index) => {
        if (!item.id && item.isUpFlag === false) {
          listAddToilets.push(item.src);
        }
      });
      this.effectArr[2].fileList.forEach((item, index) => {
        if (!item.id && item.isUpFlag === false) {
          listAddParlours.push(item.src);
        }
      });
      this.effectArr[3].fileList.forEach((item, index) => {
        if (!item.id && item.isUpFlag === false) {
          listAddRestaurants.push(item.src);
        }
      });
      this.effectArr[4].fileList.forEach((item, index) => {
        if (!item.id && item.isUpFlag === false) {
          listAddBedrooms.push(item.src);
        }
      });
      this.effectArr[5].fileList.forEach((item, index) => {
        if (!item.id && item.isUpFlag === false) {
          listAddBalconys.push(item.src);
        }
      });
      this.effectArr[6].fileList.forEach((item, index) => {
        if (!item.id && item.isUpFlag === false) {
          listAddOthers.push(item.src);
        }
      });
      this.programList.forEach(item => {
        // 施工图纸
        if (!item.id && item.isUpFlag === false) {
          listAddWorkingDrawings.push(item.src);
        }
      });
      this.sliceList.forEach(item => {
        // 删除的图片
        listDeleteIds.push(item.id);
      });
      this.cmdList.forEach(item => {
        if (!item.id && item.isUpFlag === false) {
          listAddCADs.push(item.src);
        }
      });
      let obj = {
        designName: this.projectName,
        listAddKitchens: listAddKitchens,
        listAddToilets: listAddToilets,
        listAddOthers: listAddOthers,
        listAddBalconys: listAddBalconys,
        listAddBedrooms: listAddBedrooms,
        listAddRestaurants: listAddRestaurants,
        listAddParlours: listAddParlours,
        listDeleteIds: listDeleteIds,
        listAddWorkingDrawings: listAddWorkingDrawings,
        listAddCADs: listAddCADs
      };
      // console.log(obj)
      if (this.$route.query.id) {
        // 看看是否编进进来
        obj.id = this.$route.query.id;
      } else {
        obj.workOrderId = this.orderId.id;
      }
      obj.panoramaWebsite = this.myPanoramaWebsite
      this.designImgLoading = true;
      this.$request.post("/workOrderDesign/addOrUpdateDesign", obj).then(res => {
        this.designImgLoading = false;
        this.$router.push("/drawing");
      });
    },
    cancel() {
      // 取消
      this.$router.push("/drawing");
    }
  }
};
</script>
<style lang="scss">
@import './css/addDesign.scss';
</style>
