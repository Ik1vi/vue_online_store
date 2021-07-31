/* eslint-disable no-shadow */
import axios from 'axios';
import API_BASE_URL from '@/config';

const state = () => ({
  cartProducts: [],
  cartProductsData: [],

  cartDataLoading: false,
});
const mutations = {
  updateCartProductsData(state, items) {
    state.cartProductsData = items;
  },
  syncCartProducts(state) {
    state.cartProducts = state.cartProductsData.map((item) => ({
      productId: item.id,
      amount: item.quantity,
    }));
  },
  updateCartDataLoading(state, loadingState) {
    state.cartDataLoading = loadingState;
  },
  resetCart(state) {
    state.cartProducts = [];
    state.cartProductsData = [];
  },
};
const getters = {
  cartDetailProducts(state) {
    return state.cartProductsData.map((item) => ({
      id: item.id,
      productId: item.productOffer.product.id,
      productOfferId: item.productOffer.id,
      price: item.price,
      quantity: item.quantity,
      title: item.productOffer.title,
      colorTitle: item.color.color.title,
      colorId: item.color.color.id,
      color: item.color.color.code,
      propValue: item.productOffer.propValues[0].value,
      propTitle: item.productOffer.product.mainProp.title,
      image: item.productOffer.product.preview.file.url,
    }));
  },
  cartTotalPrice(state, getters) {
    return getters.cartDetailProducts.reduce(
      (acc, item) => acc + (item.price * item.quantity), 0,
    );
  },
  cartTotalProductsCount(state, getters) {
    return getters.cartDetailProducts.reduce(
      (acc, item) => acc + item.quantity, 0,
    );
  },
  cartTotalProductText(state, getters) {
    const endings = ['товар', 'товара', 'товаров'];
    function productEnding(number) {
      return endings[
        (number % 100 > 4 && number % 100 < 20) ? 2
          : [2, 0, 1, 1, 1, 2][(number % 10 < 5) ? number % 10 : 5]];
    }
    return `${getters.cartTotalProductsCount} ${productEnding(getters.cartTotalProductsCount)}`;
  },
};
const actions = {
  loadCart({ commit, rootState }) {
    commit('updateCartDataLoading', true);
    return axios
      .get(`${API_BASE_URL}/api/baskets`, {
        params: {
          userAccessKey: rootState.userAccessKey,
        },
      })
      .then((response) => {
        if (!rootState.userAccessKey) {
          const date = (new Date(Date.now() + 86400e3)).toUTCString();
          document.cookie = `userAccessKey=${response.data.user.accessKey}; expires=${date}`;

          localStorage.setItem('userAccessKey', response.data.user.accessKey);
          commit('updateUserAccessKey', response.data.user.accessKey, { root: true });
        }
        commit('updateCartProductsData', response.data.items);
        commit('syncCartProducts');
      })
      .then(() => {
        commit('updateCartDataLoading', false);
      });
  },
  addProductToCart({ commit, rootState }, { productOfferId, colorId, quantity }) {
    commit('updateCartDataLoading', true);
    return axios
      .post(`${API_BASE_URL}/api/baskets/products`, {
        productOfferId,
        colorId,
        quantity,
      }, {
        params: {
          userAccessKey: rootState.userAccessKey,
        },
      })
      .then((response) => {
        commit('updateCartProductsData', response.data.items);
        commit('syncCartProducts');
      })
      .then(() => {
        commit('updateCartDataLoading', false);
      });
  },
  updateCartProductAmount({ commit, rootState }, { basketItemId, quantity }) {
    return axios
      .put(`${API_BASE_URL}/api/baskets/products`, {
        basketItemId,
        quantity,
      }, {
        params: {
          userAccessKey: rootState.userAccessKey,
        },
      })
      .then((response) => {
        commit('updateCartProductsData', response.data.items);
        commit('syncCartProducts');
      });
  },
  deleteCartProductsAll({ commit, rootState }, { products }) {
    commit('updateCartDataLoading', true);
    return Promise.all(products.map((p) => axios
      .delete(`${API_BASE_URL}/api/baskets/products`, {
        data: {
          basketItemId: p.id,
        },
        params: {
          userAccessKey: rootState.userAccessKey,
        },
      })))
      .then(() => {
        commit('resetCart');
      })
      .then(() => {
        commit('updateCartDataLoading', false);
      });
  },
  deleteCartProduct({ commit, rootState }, { basketItemId }) {
    commit('updateCartDataLoading', true);
    return axios
      .delete(`${API_BASE_URL}/api/baskets/products`, {
        data: {
          basketItemId,
        },
        params: {
          userAccessKey: rootState.userAccessKey,
        },
      })
      .then((response) => {
        commit('updateCartProductsData', response.data.items);
        commit('syncCartProducts');
      })
      .then(() => {
        commit('updateCartDataLoading', false);
      });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
