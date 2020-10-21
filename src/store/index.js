import Vue from 'vue'
import Vuex from 'vuex'
import constants from '../common/constants'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedMenus: sessionStorage.getItem(constants.SELECTED_MENUS) ? JSON.parse(sessionStorage.getItem(constants.SELECTED_MENUS)) : []
  },
  getters: {
    selectedMenus: state => state.selectedMenus
  },
  mutations: {
    ADD_MEMUS (state, data) {
      state.selectedMenus.push(data)
      sessionStorage.setItem(constants.SELECTED_MENUS, JSON.stringify(state.selectedMenus))
    },
    UPDATE_SELECTED_MENUS (state, val) {
      state.selectedMenus = val
      sessionStorage.setItem(constants.SELECTED_MENUS, JSON.stringify(state.selectedMenus))
    }
  },
  actions: {
  },
  modules: {
  }
})
