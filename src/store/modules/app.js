
import { getCollFlag, setCollFlag } from '@/common/utils/auth'

let aNum = ''
if (getCollFlag() == '1') {
  aNum = true
} else {
  aNum = false
}
const state = {
  inlineCollapsed: aNum,
  myRouterPower: '',
  allSping: false
}

const mutations = {
  COLLAPSEDFLAG: (state, flag) => {
    state.inlineCollapsed = flag
  },
  SETROUTERPOWER: (state, adata) => {
    state.myRouterPower = adata
  },
  CHANGESPINGFN: (state, flag) => {
    state.allSping = flag
  }
}

const actions = {
  changeCollapsed ({ commit, state }, data) {
    commit('COLLAPSEDFLAG', data)
    setCollFlag(data)
  },
  setRouterPower ({ commit, state }, adata) {
    commit('SETROUTERPOWER', adata)
  },
  changeSpingFn ({ commit, state }, adata) {
    commit('CHANGESPINGFN', adata)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
