
import { getToken, setToken, removeToken, getUserInfo, addPermissions, setMenuKey, setMenuRouter, removeMenuRouter, getMenuKey, setMenuOpenArr, getMenuOpenArr, getCurruserInfo, removeCollFlag, removeMenuKey, removeMenuOpenArr, myloginOut } from '@/common/utils/auth'
import { Modal } from 'ant-design-vue'
import { loginUrl, callbackURL, clientId } from '@/common/utils/request'

import router from '@/router/index'

import { listToTree } from '@/common/utils/myfilter'

import { mapGetters } from 'vuex'

import VueCookies from 'vue-cookies'

import Cookies from 'js-cookie'

import { bus } from '@/main.js'

const SET_TOKEN = 'SET_TOKEN'
const REMOVE_TOKEN = 'REMOVE_TOKEN'
const CHANGESETTOKEN = 'CHANGESETTOKEN'
const SETMENULIST = 'SETMENULIST'
const SETMENUKEY = 'SETMENUKEY'
const SETMENUOPENARR = 'SETMENUOPENARR'
const SETUSERINFO = 'SETUSERINFO'
const SETMENUROUTER = 'SETMENUROUTER'
const SETCHOOSEMENUROUTER = 'SETCHOOSEMENUROUTER'

const user = {
  namespaced: true,
  state: {
    token: '没登录',
    isGetToken: false, // 判断token是否是第一次进入系统时候设置token，如果为true的话，后面再路由拦截处不在设置token
    commonMenuList: [], // 贮存菜单list
    commonMenuKey: 'home', // 贮存菜单key
    commonMenuRouter: 'admin', // 贮存菜单的router
    commonMenuArr: '', // 贮存展开的菜单栏数组(字符串类型)
    userInfo: {},
    chooesMenuRouter: '', // 贮存路由跳转的时候最新的router值
  },
  computed: {
    ...mapGetters([
      'getWiFiMenuList'
    ])
  },
  mutations: {
    [SET_TOKEN]: (state, token) => {
      state.token = token
    },
    [REMOVE_TOKEN]: (state, token) => {
      state.token = token
    },
    [CHANGESETTOKEN]: (state, flag) => {
      state.isGetToken = flag
    },
    [SETMENULIST]: (state, menuData) => {
      state.commonMenuList = menuData
    },
    [SETMENUKEY]: (state, menuKey) => {
      state.commonMenuKey = menuKey
    },
    [SETMENUROUTER]: (state, menuRouter) => {
      state.commonMenuRouter = menuRouter
    },
    [SETMENUOPENARR]: (state, menuArr) => {
      state.commonMenuArr = menuArr
    },
    [SETUSERINFO]: (state, userinfo) => {
      state.userInfo = userinfo
    },
    [SETCHOOSEMENUROUTER]: (state, choose) => {
      state.chooesMenuRouter = choose
    },
  },
  actions: {
    // 设置token
    setToken ({ commit }, token) {
      commit(SET_TOKEN, token)
      return new Promise((resolve, reject) => {
        setToken(token)
        addPermissions().then(function (iren) {
          if (iren.code == 0) {
            getUserInfo().then(function (response) {
              if (response.code == 200) {
                // 必须要重组这个数据了
                if (response.result.length !== 0) {
                  let overList = listToTree(response.result)
                  commit(SETMENULIST, overList)
                  localStorage.setItem('userInfo', JSON.stringify(overList))
                }
                // 获取cookie中的menukey
                if (getMenuKey()) {
                  commit(SETMENUKEY, getMenuKey())
                } else {
                  commit(SETMENUKEY, 'home')
                }
                // 获取cookie中的menuArr
                if (getMenuOpenArr()) {
                  commit(SETMENUOPENARR, getMenuOpenArr())
                } else {
                  commit(SETMENUOPENARR, 'home')
                }
                // 获取用户信息，/curruser接口
                getCurruserInfo().then(info => {
                  let obj = {
                    name: info.result.empName,
                    postArr: info.result.posts,
                    holdObj: info.result
                  }
                  commit(SETUSERINFO, obj)
                })
              }
            }).catch(function (error) {
              reject(error)
            })
          }
        })
        resolve()
      })
    },
    // 退出登录
    loginOut ({ commit, state }, data) {
      let adata = {
        access_token: state.token
      }
      return new Promise((resolve, reject) => {
        myloginOut(adata).then(out => {
          if (out.code == 0) {
            commit(REMOVE_TOKEN, data)
            removeToken()
            removeCollFlag()
            removeMenuKey()
            removeMenuOpenArr()
            removeMenuRouter()
            resolve()
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    changSetToken ({ commit }, data) {
      commit(CHANGESETTOKEN, data)
    },
    setMenuKey ({ commit }, data) {
      commit(SETMENUKEY, data)
      setMenuKey(data)
    },
    setMenuRouter ({ commit }, data) {
      commit(SETMENUROUTER, data)
      setMenuRouter(data)
    },
    setMenuOpenArr ({ commit }, aArr) {
      commit(SETMENUOPENARR, aArr)
      setMenuOpenArr(aArr)
    },
    // 没有权限事件
    noPowerFn ({ commit }, message) {
      let secondsToGo = 4
      const modal = Modal.warning({
        title: message,
        content: `将在 ${secondsToGo} 秒之后退出到登录页面`,
        okText: '确认',
        onOk: function () {
          VueCookies.remove('access_token', '/', '.4009515151.com')
          VueCookies.remove('access_token', '/', 'hulk-sit.4009515151.com')
          localStorage.removeItem('userInfo')
          location.href = `${loginUrl}/rocky/login?redirect_uri=${callbackURL}&client_id=${clientId}&login_type=lebang`
        }
      })
      const interval = setInterval(() => {
        secondsToGo -= 1
        modal.update({
          content: `将在 ${secondsToGo} 秒之后退出到登录页面`
        })
      }, 1000)
      commit(REMOVE_TOKEN, '')
      removeToken()
      removeCollFlag()
      removeMenuKey()
      removeMenuRouter()
      removeMenuOpenArr()
      setTimeout(() => {
        clearInterval(interval)
        modal.destroy()
        VueCookies.remove('access_token', '/', '.4009515151.com')
        VueCookies.remove('access_token', '/', 'hulk-sit.4009515151.com')
        localStorage.removeItem('userInfo')
        location.href = `${loginUrl}/rocky/login?redirect_uri=${callbackURL}&client_id=${clientId}&login_type=lebang`
      }, secondsToGo * 1000)
    },
    // 路由跳转的时候都将会触发这个事件，这个事件是改变左侧菜单选中的高亮,加上tagview标签的选中
    chooseMenuSelectFn ({ commit, state }, { toRouter, fromRouter }) {
      let aSessionMenu = JSON.parse(localStorage.getItem('userInfo'))
      if (aSessionMenu) {
        aSessionMenu.push({
          router: '/admin',
          id: 'home',
          parent_id: 0,
          name: '首页',
          remark: '',
          show: true,
          svr_type: 'svrTypeMenu',
          children: []
        })

        let chooesMenuKey = []
        let chooesMenuName = ''
        let chooesMenuRouter = ''
        let chooesMenuArr = []
        aSessionMenu.forEach(one => {
          if (one.router == toRouter) {
            chooesMenuKey.push(one.id)
            chooesMenuName = one.menu_name
            chooesMenuRouter = one.router
            chooesMenuArr = one
          } else {
            one.children.forEach(two => {
              if (two.router == toRouter) {
                chooesMenuKey.push(two.id)
                chooesMenuName = two.menu_name
                chooesMenuRouter = two.router
                chooesMenuArr = two
              } else {
                two.children.forEach(three => {
                  if (three.router == toRouter) {
                    chooesMenuKey.push(three.id)
                    chooesMenuName = three.menu_name
                    chooesMenuRouter = three.router
                    chooesMenuArr = three
                  }
                })
              }
            })
          }
        })

        let mynewMenuArr = []
        aSessionMenu.forEach(one => {
          if (one.id == chooesMenuKey[0]) {
            mynewMenuArr = []
            mynewMenuArr.push(one.id)
          } else {
            one.children.forEach(two => {
              if (two.id == chooesMenuKey[0]) {
                mynewMenuArr = []
                mynewMenuArr.push(two.id, two.parent_id)
              } else {
                two.children.forEach(three => {
                  if (three.id == chooesMenuKey[0]) {
                    mynewMenuArr = []
                    mynewMenuArr.push(three.id, three.parent_id, two.parent_id)
                  }
                })
              }
            })
          }
        })

        if (chooesMenuKey.length !== 0) {
          // 设置路由跳转的当前高亮的菜单
          commit(SETMENUKEY, chooesMenuKey[0])
          setMenuKey(chooesMenuKey[0])
          // 设置路由跳转的展开菜单数组
          commit(SETMENUOPENARR, mynewMenuArr.join(','))
          setMenuOpenArr(mynewMenuArr.join(','))
        } else if (fromRouter == '/') {
          // router.push('/admin')
        }
        
        this.dispatch('user/setMenuOpenArr', Cookies.get('menuArr'))
        this.dispatch('user/setMenuKey', Cookies.get('menuKey'))
        bus.$emit('clickThisMenu', Cookies.get('menuArr'))

        if (chooesMenuArr.length !== 0) {
          this.dispatch('app/setRouterPower', chooesMenuArr)
          sessionStorage.setItem('firstPower', JSON.stringify(chooesMenuArr))
        }

        commit(SETCHOOSEMENUROUTER, chooesMenuRouter)
        if (chooesMenuName) {
          sessionStorage.setItem('chooesMenuName', chooesMenuName)
        }
      }
    }
  }
}

export default user
