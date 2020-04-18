<template>
  <a-locale-provider :locale="locale">
    <div id="app">
      <div class="AppContainer">

        <div class="left no-print" v-if="havePageShowFn">
          <lay-out />
        </div>
        <div class="right">
          <div :class="{'mainSplice': this.$store.state.app.inlineCollapsed, 'main': true}" class="content">
            <!-- header头部顶部 -->
            <div :class="{'header': true, 'headerSplice': this.$store.state.app.inlineCollapsed}" class="no-print" v-if="havePageShowFn">
              <p class="loginTitle">自营装修<span>管理后台</span></p>
              <div @click="toggleCollapsed" :class="{'PrimarySplice': this.$store.state.app.inlineCollapsed, 'btnWarp': true}">
                <a-icon :type="myCollFlag ? 'menu-unfold' : 'menu-fold'" class="targater" />
              </div>
              <div class="breadDom no-print" v-if="havePageShowFn">
                <a-breadcrumb separator="/">
                  <!-- <a-breadcrumb-item @click="gotoAdmin">
                    <span @click="gotoAdmin">首页</span>
                  </a-breadcrumb-item> -->
                  <a-breadcrumb-item class="aBreadcrumb" v-for="(menuItem,index) in allMenuNameList" :key="index">{{menuItem}}</a-breadcrumb-item>
                </a-breadcrumb>
                <a-button type="primary" class="gobackBtn" :disabled='backFlag' @click="goBack">返回</a-button>
              </div>

              <div class="tagViewDom">
                <tag-view></tag-view>
              </div>

              <div class="topRightDom">
                <p>{{userInfo.name}}</p>
              </div>
              <!-- 全屏的icon按钮 -->
              <!-- <div class="screenfullDom">
                <screenfull class="right-menu-item hover-effect" />
              </div> -->
              <a-dropdown placement="bottomRight" class="userDom">
                <div class="userInformation">
                  <img @mouseenter="ImgshowPost" @mouseleave='ImglevaNo' :src="getUserPicterUrl ? getUserPicterUrl : defouldUrl" alt="">
                </div>
                <a-menu slot="overlay">
                  <a-menu-item class="deflueSplice">
                    <a @click="setModal1Visible(true)">用户中心</a>
                  </a-menu-item>
                  <a-menu-item class="deflueSplice" @click="screenFn">
                    <a>{{isFullscreen ? '退出全屏' : '全屏展示'}}</a>
                  </a-menu-item>
                  <a-menu-item class="lastListSplice" @click="onLogout">
                    <a-icon type="logout" class="targater" /><a href="javascript:;">退出登录</a>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </div>

            <div class="centerDom">
              <a-spin :spinning="myallSping">
                <router-view :class="{'setAnimation': true, 'spliceAnimation': spliceAniFlag}" />
              </a-spin>
            </div>
          </div>
        </div>

        <!-- 弹框展示用户信息 -->
        <a-modal
          class="poplurDom"
          title="用户信息"
          :width="650"
          :visible="modal1Visible"
          @ok="() => setModal1Visible(false)"
          @cancel="() => setModal1Visible(false)"
          :footer="null" >
          <div class="poplurImg">
            <img :src="getUserPicterUrl ? getUserPicterUrl : defouldUrl" alt="">
          </div>
          <div class="poplur_content">
            <div class="oneList">
              <span class="the_left">用户名称：</span> <span class="the_right">{{userInfo.name}}</span>
            </div>
            <div class="oneList">
              <span class="the_left">用户角色：</span> 
              <div class="the_right">
                <p v-for="item in userInfo.postArr" style="margin: 0px;" :key="item.colo">{{item.postName}}</p>
              </div>
            </div>
            <div class="oneList">
              <span class="the_left">城市公司：</span> <span class="the_right">{{cityCompanyName}}</span>
            </div>
            <div class="tokenDom">
              <p id="tokenText" v-show="false">{{tokenText}}</p>
              <textarea id="mytoken" style="position: absolute; top: -99999px"></textarea>
              <a-button class="token_btn" @click="tokenCoype">复制token</a-button>
            </div>
          </div>
        </a-modal>

      </div>
    </div>
  </a-locale-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import LayOut from '@/components/Layout'
import TagView from '@/components/TagView'
import store from '@/store'
import { loginUrl, callbackURL, clientId } from '@/common/utils/request'
import { bus } from '@/main.js'
import Cookies from 'js-cookie'
import screenfull from 'screenfull'

export default {
  data () {
    return {
      locale: zhCN,
      myCollFlag: store.state.app.inlineCollapsed,
      showFlag: 1, // 1显示单个，2显示多个岗位
      oneMenuRouteName: '',
      twoMenuRouteName: '',
      threeMenuRouteName: '',
      allMenuNameList: ['首页'],
      saveThisRoute: '',
      backFlag: false,
      menuClickArr: '', // 接受点击菜单之后拿到的菜单数组
      havePageShowFn: true,
      modal1Visible: false,
      cityCompanyName: '',
      isFullscreen: false,
      getUserPicterUrl: '', // 获取用户头像地址
      defouldUrl: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80', // 默认的头像地址
      tokenText: '', // token 
      spliceAniFlag: false
    }
  },
  components: {
    LayOut,
    TagView
  },
  computed: {
    userInfo () {
      return store.state.user.userInfo
    },
    myallSping () {
      return this.$store.state.app.allSping
    },
  },
  watch: {
    $route (to, from) {
      if (to.path === '/admin') {
        this.backFlag = true
      } else {
        this.backFlag = false
      }
      if (to.path == '/404' || to.path == '/spacePage') {
        this.havePageShowFn = false
      } else {
        this.havePageShowFn = true
      }
      this.breadLastFn()

      let that = this
      this.spliceAniFlag = true
      let aTimeDom = setTimeout(function() {
        that.spliceAniFlag = false
      }, 300)
    },
    menuClickArr: {
      handler (newVal, val) {
        this.menuClickArr = newVal
        this.changBreadData()
      },
      deep: true
    },
    userInfo: {
      handler (newVal, val) {
        this.getUserPicterUrl = newVal.holdObj.avatar_url
        this.cityCompanyName = newVal.holdObj.cityCompanyName
      },
      deep: true
    }
  },
  created () {
    this.saveThisRoute = this.$route.name
    let that = this
    bus.$on('clickThisMenu', function (data) {
      that.menuClickArr = data.split(',')
    })
    if (Cookies.get('menuArr')) {
      this.menuClickArr = Cookies.get('menuArr').split(',')
    }
    this.tokenText = Cookies.get('access_token')
  },
  mounted() {
    this.init()
  },
  methods: {
    // 点击面包屑事件
    breadLastFn() {
      this.$nextTick(function() {
        let aBreadSpan = document.querySelectorAll('.breadDom .ant-breadcrumb .aBreadcrumb')
        if (aBreadSpan.length !== 0) {
          let lastSpan = aBreadSpan[aBreadSpan.length - 1].querySelector('.ant-breadcrumb-link')
          lastSpan.style = 'cursor: pointer;'
          let that = this
          lastSpan.addEventListener('click', function() {
            if (Cookies.get('menuRouter')) {
              that.$router.push('/' + Cookies.get('menuRouter'))
            } else {
              that.$router.push('/admin')
            }
          })
        }
      })
    },
    setModal1Visible(modal1Visible) {
      this.modal1Visible = modal1Visible;
    },
    ImgshowPost(ev) {
      ev.target.style = 'border: 2px solid #1890FF'
    },
    ImglevaNo(ev) {
      ev.target.style = 'border: none'
    },
    goBack () {
      history.go(-1)
    },
    gotoAdmin () {
      this.$router.push('/admin')
    },
    goToPage (url) {
      this.$router.push(url)
    },
    showPost () {
      this.showFlag = 2
    },
    levaNoShow () {
      this.showFlag = 1
    },
    onLogout () {
      store.dispatch('user/loginOut', '').then(res => {
        this.$message.success('退出成功!')
        this.$mycookies.remove('access_token', '/', '.4009515151.com')
        this.$mycookies.remove('access_token', '/', 'hulk-sit.4009515151.com')
        localStorage.removeItem('userInfo')
        location.href = `${loginUrl}/rocky/login?redirect_uri=${callbackURL}&client_id=${clientId}&login_type=lebang`
      })
    },
    toggleCollapsed () {
      this.myCollFlag = !store.state.app.inlineCollapsed
      bus.$emit('mycollapsed', this.myCollFlag)
      this.$store.dispatch('app/changeCollapsed', !store.state.app.inlineCollapsed)
    },
    changBreadData () {
      if (Cookies.get('menuArr') && Cookies.get('menuArr') !== 'home') {
        let menuList = localStorage.getItem('userInfo')
        if (menuList) {
          this.allMenuNameList = []
          menuList = JSON.parse(menuList)
          if (this.menuClickArr.length == 3) {
            menuList.forEach(one => {
              if (one.id == this.menuClickArr[2]) {
                this.oneMenuRouteName = ''
                this.oneMenuRouteName = one.menu_name
                one.children.forEach(two => {
                  if (two.id == this.menuClickArr[1]) {
                    this.twoMenuRouteName = ''
                    this.twoMenuRouteName = two.menu_name
                    two.children.forEach(three => {
                      if (three.id == this.menuClickArr[0]) {
                        this.threeMenuRouteName = ''
                        this.threeMenuRouteName = three.menu_name
                      }
                    })
                  }
                })
              }
            })
            this.allMenuNameList[0] = this.oneMenuRouteName
            this.allMenuNameList[1] = this.twoMenuRouteName
            this.allMenuNameList[2] = this.threeMenuRouteName
          } else if (this.menuClickArr.length == 2) {
            menuList.forEach(one => {
              if (one.id == this.menuClickArr[1]) {
                this.oneMenuRouteName = ''
                this.oneMenuRouteName = one.menu_name
                one.children.forEach(two => {
                  if (two.id == this.menuClickArr[0]) {
                    this.twoMenuRouteName = ''
                    this.twoMenuRouteName = two.menu_name
                  }
                })
              }
            })
            this.allMenuNameList[0] = this.oneMenuRouteName
            this.allMenuNameList[1] = this.twoMenuRouteName
          } else if (this.menuClickArr.length == 1) {
            menuList.forEach(one => {
              if (one.id == this.menuClickArr[0]) {
                this.oneMenuRouteName = ''
                this.oneMenuRouteName = one.menu_name
              }
            })
            this.allMenuNameList[0] = this.oneMenuRouteName
          }
        }
      } else {
        this.allMenuNameList = []
        this.allMenuNameList[0] = '首页'
        this.menuClickArr[0] = 'home'
        this.$forceUpdate()
      }
    },
    screenFn() {
      if (!screenfull.enabled) {
        this.$message({
          message: '您的浏览器暂时不能支持!',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()
    },
    init() {
      if (screenfull.enabled) {
        screenfull.on('change', () => {
          this.isFullscreen = screenfull.isFullscreen
        })
      }
    },
    // token复制事件
    tokenCoype() {
      var tokenUrl = document.getElementById('mytoken')
      tokenUrl.select()
      try{
        var text = document.getElementById("tokenText").innerText
        var input = document.getElementById("mytoken")
        input.value = text // 修改文本框的内容
        input.select() // 选中文本
        if( document.execCommand("Copy", "false", null) ){
          this.$message.success('token复制成功')
        }else{
          this.$message.info('token复制失败')
        }
      } catch(err){
        alert("复制错误！")
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/common/styles/app.scss';
</style>
