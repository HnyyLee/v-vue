<!---->
<template>
    <div class="LayoutIndex">

      <div :class="{'warpDom': true, 'warpDomSplice': this.$store.state.app.inlineCollapsed}">
        <a-menu :openKeys.sync="menuOpenKeys" :selectedKeys="defaultSelMenu"  mode="inline" theme="dark" :inlineCollapsed="myCollFlag" @click="allMenuThink">
          <a-menu-item key="home" @click="routerThink(homeList)">
            <a-icon type="home" />
            <span>首页</span>
            <router-link to="/"></router-link>
          </a-menu-item>

          <template v-for="parent in menuList" >

            <a-menu-item v-if="parent.show == true && parent.isBtnFlag == false" :key="parent.id" @click="routerThink(parent)">
              <a-icon :type="parent.icon" />
              <span>{{changeNameShow(parent.menu_name)}}</span>
              <router-link :to="parent.router"></router-link>
            </a-menu-item>

            <a-sub-menu v-if="parent.children.length !== 0 && parent.show == true && parent.isBtnFlag == true" :key="parent.id">
              <span slot="title"><a-icon :type="parent.icon" /><span>{{changeNameShow(parent.menu_name)}}</span></span>

              <template v-for="sendChild in parent.children" >
                <a-menu-item v-if="sendChild.mySendFlag == true && sendChild.show == true" :key="sendChild.id" @click="routerThink(sendChild)"><router-link :to="sendChild.router"></router-link>{{changeNameShow(sendChild.menu_name)}}</a-menu-item>
              </template>

              <template v-for="sendChild in parent.children">
                <a-sub-menu v-if="sendChild.mySendFlag == false && sendChild.show == true" :key="sendChild.id" :title="changeNameShow(sendChild.menu_name)">
                  <template v-if="sendChild.children.length !== 0 && sendChild.show == true">
                    <template v-for="threeChild in sendChild.children">
                      <a-menu-item v-if="threeChild.myThreeFlag == false && threeChild.show == true" :key="threeChild.id" @click="routerThink(threeChild)">
                        <router-link :to="threeChild.router"></router-link>{{changeNameShow(threeChild.menu_name)}}
                      </a-menu-item>
                    </template>
                  </template>
                </a-sub-menu>
              </template>

            </a-sub-menu>
          </template>
        </a-menu>
      </div>

    </div>
</template>

<script>
import { bus } from '@/main.js'
import Cookies from 'js-cookie'

export default {
  data () {
    return {
      myCollFlag: this.$store.state.app.inlineCollapsed,
      defaultSelMenu: [],
      menuOpenKeys: [],
      menuList: [],
      homeList: {
        router: '/admin',
        id: 'home',
        parent_id: 0,
        name: '首页',
        remark: '',
        show: true,
        svr_type: 'svrTypeMenu',
        children: []
      },
      menuRouterFlag: false, // 设置贮存路由名称的开关
    }
  },
  props: {},
  components: {},
  created () {
    let that = this
    bus.$on('mycollapsed', function (data) {
      that.myCollFlag = data
    })

    if (Cookies.get('menuKey') !== 'home' && Cookies.get('menuKey') !== undefined) {
      this.defaultSelMenu.push(Number(Cookies.get('menuKey')))
    } else {
      this.defaultSelMenu.push('home')
    }

    if (Cookies.get('menuArr') && Cookies.get('menuArr') !== 'home') {
      let newMenuArr = []
      Cookies.get('menuArr').split(',').forEach(item => {
        newMenuArr.push(Number(item))
      })
      this.menuOpenKeys = newMenuArr
    } else {
      this.menuOpenKeys = [ 'home' ]
    }
  },
  computed: {
    myMenuList () {
      return this.$store.state.user.commonMenuList
    },
    routerChooesMenuKey () {
      return this.$store.state.user.commonMenuKey
    },
    routerOpenMenuArr () {
      return this.$store.state.user.commonMenuArr
    }
  },
  mounted () {
    if (localStorage.getItem('userInfo')) {
      this.menuList = JSON.parse(localStorage.getItem('userInfo'))
      this.showFnList()
    }
  },
  methods: {
    allMenuThink (ev) {
      this.$store.dispatch('user/setMenuOpenArr', ev.keyPath.join(','))
      this.$store.dispatch('user/setMenuKey', ev.key)
      this.menuRouterFlag = true
      bus.$emit('clickThisMenu', ev.keyPath.join(','))
    },
    changeNameShow (aName) {
      return aName
    },
    showFnList () {
      this.menuList = this.menuList.filter(refs => {
        return refs.svr_type == 'svrTypeMenu'
      })
      // 循环菜单，isBtnFlag表示只有一级菜单，里面的child的type类型为svrTypeButton，那么这个值为false
      // mySendFlag表示有二级菜单或者三级菜单，有三级菜单为false，只到二级菜单为true
      this.menuList.forEach(one => {
        one.isBtnFlag = true
        if (one.svr_type == 'svrTypeMenu' && one.children.length !== 0) {
          one.children.forEach(two => {
            two.mySendFlag = false
            if (two.svr_type == 'svrTypeMenu' && two.children.length == 0) {
              two.mySendFlag = true
            } else if (two.svr_type == 'svrTypeMenu' && two.children.length !== 0) {
              two.children.forEach(three => {
                if (three.svr_type == 'svrTypeButton' || three.svr_type == 'svrTypeOther') {
                  two.mySendFlag = true
                  three.myThreeFlag = true
                } else if (three.svr_type == 'svrTypeMenu') {
                  two.mySendFlag = false
                  three.myThreeFlag = false
                }
              })
            } else if (two.svr_type == 'svrTypeButton') {
              one.isBtnFlag = false
            }
          })
        } else if (one.svr_type == 'svrTypeMenu' && one.children.length == 0) {
          one.isBtnFlag = false
        }
      })
    },
    routerThink (adata) {
      this.$store.dispatch('app/setRouterPower', adata)
      sessionStorage.setItem('firstPower', JSON.stringify(adata))
    },
    // 当本地sessionStoreg没有保存当前菜单对应的对象的时候，用cookie里面的菜单值来遍历获取没点击事件时候的对象
    getLoaclMenuArrFn () {
      let saveLocalObject = ''
      let anewArr = []
      Cookies.get('menuArr').split(',').forEach(num => {
        anewArr.push(Number(num))
      })
      if (anewArr.length == 3) {
        this.menuList.forEach(one => {
          if (one.id == anewArr[2]) {
            one.children.forEach(two => {
              if (two.id == anewArr[1]) {
                two.children.forEach(three => {
                  if (three.id == anewArr[0]) {
                    saveLocalObject = three
                  }
                })
              }
            })
          }
        })
      } else if (anewArr.length == 2) {
        this.menuList.forEach(one => {
          if (one.id == anewArr[1]) {
            one.children.forEach(two => {
              if (two.id == anewArr[0]) {
                saveLocalObject = two
              }
            })
          }
        })
      } else if (anewArr.length == 1) {
        this.menuList.forEach(one => {
          if (one.id == anewArr[0]) {
            saveLocalObject = one
          }
        })
      }
      this.$store.dispatch('app/setRouterPower', saveLocalObject)
      sessionStorage.setItem('firstPower', JSON.stringify(saveLocalObject))
    },
  },
  watch: {
    $route (to, from) {
      if (this.menuRouterFlag) {
        this.menuRouterFlag = false
        this.$store.dispatch('user/setMenuRouter', to.name)
      }
    },
    myMenuList: {
      handler (newVal, val) {
        this.menuList = newVal
        this.showFnList()
        if (Cookies.get('menuArr')) {
          this.getLoaclMenuArrFn()
        }
      },
      deep: true
    },
    routerChooesMenuKey: {
      handler (newVal, val) {
        this.defaultSelMenu = []
        this.defaultSelMenu.push(Number(newVal) || 'home')
        this.$store.dispatch('user/setMenuKey', Number(newVal) || 'home')
      },
      deep: true
    },
    routerOpenMenuArr: {
      handler (newVal, val) {
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
.LayoutIndex{
  .warpDom{
    width: 250px;
    height: 100vh;
    background: #001529;
    transition: width .28s;
    overflow: auto;
  }
  .warpDom::-webkit-scrollbar {/*滚动条整体样式*/
    width: 5px;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 5px;
  }
  .warpDom:hover::-webkit-scrollbar-thumb{
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(144, 201, 255, 0.4);
  }
  .warpDom:hover::-webkit-scrollbar-track {/*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 0;
    background: rgba(0, 132, 255, 0.4);
  }

  .warpDomSplice{
    width: 80px;
  }
  .btnWarp{
    position: absolute;
    right: -52px;
    top: 20px;
    z-index: 99;
    transition: right .28s;
    font-size: 25px;
    cursor: pointer;
  }
  .PrimarySplice{
    right: 110px!important;
  }
}
</style>
