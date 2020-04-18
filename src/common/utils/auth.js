import Cookies from 'js-cookie'
/*eslint-disable*/
import request from '@/common/utils/request'
import { menuRequestUrl, loginUrl } from '@/common/utils/request'

const TokenKey = 'access_token'
const menuCollapse = 'menuCollapse'
const menuKey = 'menuKey'
const menuArr = 'menuArr'
const menuRouter = 'menuRouter'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken () {
  Cookies.remove(TokenKey)
  return Cookies.remove(TokenKey, '/', '.4009515151.com')
}
// 获取左侧菜单展示关闭
export function getCollFlag () {
  return Cookies.get(menuCollapse)
}
export function setCollFlag (adata) {
  let num = ''
  adata == true ? num = '1' : num = '2'
  return Cookies.set(menuCollapse, num)
}
export function removeCollFlag () {
  return Cookies.remove(menuCollapse)
}
// 在获取用户信息接口之前（优先级最高）先调用这个接口
export function addPermissions () {
  return request.get('/user/addPermissions')
}
// 获取系统菜单接口，包括用户信息
export function getUserInfo () {
  // 原来的接口方案（拿到的是所有的系统菜单）
  // return request.get(menuRequestUrl + '/themis/admin/v2/menu', {
  //   params: {
  //     short_name: 'PY'
  //   }
  // })
  return request.get(menuRequestUrl + '/themis/admin/v2/my_service', {
    params: {
      short_name: 'PY'
    }
  })
}
// 获取用户信息接口
export function getCurruserInfo () {
  return request.get('/user/current')
}
// 保存当前所在的菜单key值
export function setMenuKey (amenukey) {
  return Cookies.set(menuKey, amenukey)
}
export function getMenuKey () {
  return Cookies.get(menuKey)
}
export function removeMenuKey () {
  return Cookies.remove(menuKey)
}
// 保存当前所在的菜单router值
export function setMenuRouter (amenukey) {
  return Cookies.set(menuRouter, amenukey)
}
export function removeMenuRouter () {
  return Cookies.remove(menuRouter)
}

export function setMenuOpenArr (myMenuArr) {
  return Cookies.set(menuArr, myMenuArr)
}
export function getMenuOpenArr () {
  return Cookies.get(menuArr)
}
export function removeMenuOpenArr () {
  return Cookies.remove(menuArr)
}
// 退出登录接口
export function myloginOut (adata) {
  return request.post(loginUrl + '/api/v1/logout', adata)
}
