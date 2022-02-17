import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // Chosen Item (Pop-Up)
    selectedItem: null,
    // Items from the actual site
    searchedItems: null,
    // ItemLightUpColor in Shelf
    itemSearchColor: null,
    // Flag if Search was successfully
    itemAvailable: false,
    // The actually chosen items
    currentSelectedLabels: [],
    // Saves if drawer is Opened
    drawerOpened: false
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
