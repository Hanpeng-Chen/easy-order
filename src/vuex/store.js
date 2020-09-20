import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import mutations from './mutations'
import constants from '../common/constants'

Vue.use(Vuex)

const state = {
  selectedMenus: sessionStorage.getItem(constants.SELECTED_MENUS) ? JSON.parse(sessionStorage.getItem(constants.SELECTED_MENUS)) : []
}

export default new Vuex.Store({
  getters,
  state,
  mutations
})
