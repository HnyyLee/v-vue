import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import app from './modules/app'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    user,
    app
  },
  getters: {
    getToken: (state, getters, rootState) => {
      return state.user.token
    },
    getWiFiMenuList: state => {
      return state.user.commonMenuList
    }
  },
  strict: debug
})
