import router from './index'
import store from '@/store'

import { getToken } from '@/common/utils/auth'
import { loginUrl, callbackURL, clientId } from '@/common/utils/request'

const whiteList = ['/spacePage']

router.beforeEach(async (to, from, next) => {
  // 确定用户是否已登录
  const hasToken = getToken()
  if (location.search) {
    if (location.search.split('?')[1].indexOf('access_token') !== -1) {
      store.dispatch('user/setToken', location.search.split('?')[1].split('=')[1])
    }
    store.dispatch('user/chooseMenuSelectFn', { toRouter: to.path, fromRouter: from.path })
    next()
  } else {
    if (hasToken) {
      let newMyToken = hasToken
      if (store.state.user.isGetToken == false) {
        store.dispatch('user/setToken', newMyToken).then(() => {
          store.dispatch('user/changSetToken', true)
        })
      }
      store.dispatch('user/chooseMenuSelectFn', { toRouter: to.path, fromRouter: from.path })
      next()
    } else {
      if (whiteList.indexOf(to.path) !== -1) {
        next() // 在免登录白名单，直接进入
        location.href = `${loginUrl}/rocky/login?redirect_uri=${callbackURL}&client_id=${clientId}&login_type=lebang`
      } else {
        next(`/spacePage`) // 否则全部重定向到空白页
      }
    }
  }
})
