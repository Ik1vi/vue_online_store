import Vue from 'vue';
import Vuex from 'vuex';

import order from './modules/order';
import cart from './modules/cart';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    order,
    cart,
  },
  state: {
    userAccessKey: null,
    localCategoryId: 0,
  },
  mutations: {
    updateUserAccessKey(state, accessKey) {
      state.userAccessKey = accessKey;
    },
    updateLocalCategoryId(state, categoryId) {
      state.localCategoryId = categoryId;
    },
  },
});

export default store;
