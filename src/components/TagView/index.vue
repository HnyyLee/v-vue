<!---->
<template>
  <div class="TagView">
    <el-scrollbar ref="scrollContainer" :vertical="false" class="scroll-container" @wheel.native.prevent="handleScroll">
      <p v-for="item in tagList" :class="{'tagOnly': true, 'spliceTag': item.haveSplice, 'isHome': item.tagId == 'home'}" :key="item.tagId" @click="tagGOFn(item, $event)">{{item.menu_name}}
        <span class="iconTag"></span>
        <span class="tagCloseIcon" @click="closeThisFn(item)" data-num="close" v-if="item.tagId !== 'home'">x</span>
      </p>
    </el-scrollbar>
  </div>
</template>

<script>

export default {
  name: 'ScrollPane',
  data () {
    return {
      tagList: [{
        tagId: 'home',
        router: '/admin',
        menu_name: '首页',
        haveSplice: 'true'
      }]
    }
  },
  props: {},
  components: {},
  created () {
    
  },
  computed: {
    myRouterPower () {
      return this.$store.state.app.myRouterPower
    },
    myMenuRouter() {
      return this.$store.state.user.chooesMenuRouter
    },
    scrollWrapper() {
      return this.$refs.scrollContainer.$refs.wrap
    }
  },
  mounted () {
    
  },
  methods: {
    tagGOFn(adata, ev) {
      if (ev.target.dataset.num == 'close') {

      } else {
        this.$router.push(adata.router)
      }
    },
    handleScroll(e) {
      const eventDelta = e.wheelDelta || -e.deltaY * 40
      const $scrollWrapper = this.scrollWrapper
      $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4
    },
    closeThisFn(adata) {
      this.tagList = this.tagList.filter(item => {
        return item.tagId !== adata.tagId
      })
      if (adata.tagId == JSON.parse(sessionStorage.getItem('firstPower')).id) {
        this.$router.push(this.tagList[this.tagList.length - 1].router)
      }
      // this.$router.push(this.tagList[this.tagList.length - 1].router)
    }
  },
  watch: {
    $route (to, from) {
      
    },
    myMenuRouter: {
      handler (newVal, val) {
        this.tagList.forEach(item => {
          item.haveSplice = false
          if (newVal == item.router) {
            item.haveSplice = true
          }
        })
      },
      deep: true
    },
    myRouterPower: {
      handler (newVal, val) {
        let aFlag = true
        if (this.tagList.length !== 0) {
          this.tagList.forEach(tan => {
            tan.haveSplice = false
            if (tan.tagId == newVal.id) {
              aFlag = false
            }
            if (tan.tagId == JSON.parse(sessionStorage.getItem('firstPower')).id) {
              tan.haveSplice = true
            }
          })
        }
        if (!aFlag) return
        if (newVal.id == 'home') return
        let aobj = {}
        aobj.tagId = newVal.id
        aobj.router = newVal.router
        aobj.menu_name = newVal.menu_name
        if (newVal.id == JSON.parse(sessionStorage.getItem('firstPower')).id) {
          aobj.haveSplice = true
        }
        if (!aobj.tagId) {
          this.tagList[0].haveSplice = true
        } else {
          this.tagList.push(aobj)
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
.TagView{
  white-space: nowrap;
  .tagOnly{
    display: inline-block;
    padding: 0px 8px 0px 15px;
    line-height: 24px;
    border: 1px solid #D8DCE5;
    margin: 0px 12px 0px 0px;
    font-size: 12px;
    cursor: pointer;
    .tagCloseIcon{
      display: inline-block;
      color: #898989;
      font-size: 14px;
      transform: scale(0.8, 0.7);
      width: 20px;
      height: 24px;
      border-radius: 50%;
      line-height: 22px;
      text-align: center;
      background: rgba(180, 188, 204, 0);
      transition: background 0.4s;
      -moz-transition: background 0.4s;
      -webkit-transition: background 0.4s;
      -o-transition: background 0.4s;
    }
    .tagCloseIcon:hover{
      color: #fff;
      background: rgba(180, 188, 204, 1);
    }
  }
  .isHome{
    padding-right: 15px!important;
  }
  .spliceTag{
    position: relative;
    background: #42B983;
    color: #fff;
    border: 1px solid #42B983;
    padding: 0px 8px 0px 23px!important;
    .iconTag{
      background: #fff;
      width: 8px;
      height: 8px;
      display: inline-block;
      border-radius: 50%;
      position: absolute;
      left: 10px;
      top: 8px;
    }
    .tagCloseIcon{
      color: #fff!important;
    }
  }
}
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
  /deep/ {
    .el-scrollbar__bar {
      bottom: 0px;
    }
    .el-scrollbar__wrap {
      height: 49px;
    }
  }
}
</style>
