import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios';
import API_BASE_URL from '@/config';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    userAccessKey: null,

    cartProducts: [],
    cartProductsData: [],
    orderInfo: null,

    cartDataLoading: false,
    localCategoryId: 0,
  },
  mutations: {
    updateUserAccessKey(state, accessKey) {
      state.userAccessKey = accessKey;
    },
    updateLocalCategoryId(state, categoryId) {
      state.localCategoryId = categoryId;
    },
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
    updateOrderInfo(state, orderInfo) {
      state.orderInfo = orderInfo;
    },
  },
  getters: {
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
    orderDetailProducts(state) {
      if (state.orderInfo) {
        return state.orderInfo.basket.items.map((item) => ({
          id: item.id,
          productId: item.productOffer.product.id,
          productOfferId: item.productOffer.id,
          price: item.price,
          quantity: item.quantity,
          title: item.productOffer.title,
          colorTitle: item.color.color.title,
          colorId: item.color.color.id,
          propValue: item.productOffer.propValues[0].value,
          propTitle: item.productOffer.product.mainProp.title,
          image: item.productOffer.product.preview.file.url,
        }));
      } return [];
    },
    orderTotalProductsCount(state) {
      if (state.orderInfo) {
        return state.orderInfo.basket.items.reduce(
          (acc, item) => acc + item.quantity, 0,
        );
      } return 0;
    },
    orderTotalProductText(state, getters) {
      const endings = ['товар', 'товара', 'товаров'];
      function productEnding(number) {
        return endings[
          (number % 100 > 4 && number % 100 < 20) ? 2
            : [2, 0, 1, 1, 1, 2][(number % 10 < 5) ? number % 10 : 5]];
      }
      if (state.orderInfo) {
        return `${getters.orderTotalProductsCount} ${productEnding(getters.orderTotalProductsCount)}`;
      } return '';
    },
  },
  actions: {
    loadCart(context) {
      context.commit('updateCartDataLoading', true);
      return axios
        .get(`${API_BASE_URL}/api/baskets`, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          if (!context.state.userAccessKey) {
            localStorage.setItem('userAccessKey', response.data.user.accessKey);
            context.commit('updateUserAccessKey', response.data.user.accessKey);
          }
          context.commit('updateCartProductsData', response.data.items);
          context.commit('syncCartProducts');
        })
        .then(() => {
          context.commit('updateCartDataLoading', false);
        });
    },
    addProductToCart(context, { productOfferId, colorId, quantity }) {
      context.commit('updateCartDataLoading', true);
      return axios
        .post(`${API_BASE_URL}/api/baskets/products`, {
          productOfferId,
          colorId,
          quantity,
        }, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          context.commit('updateCartProductsData', response.data.items);
          context.commit('syncCartProducts');
        })
        .then(() => {
          context.commit('updateCartDataLoading', false);
        });
    },
    updateCartProductAmount(context, { basketItemId, quantity }) {
      return axios
        .put(`${API_BASE_URL}/api/baskets/products`, {
          basketItemId,
          quantity,
        }, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          context.commit('updateCartProductsData', response.data.items);
          context.commit('syncCartProducts');
        });
    },
    deleteCartProduct(context, { basketItemId }) {
      context.commit('updateCartDataLoading', true);
      return axios
        .delete(`${API_BASE_URL}/api/baskets/products`, {
          data: {
            basketItemId,
          },
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          context.commit('updateCartProductsData', response.data.items);
          context.commit('syncCartProducts');
        })
        .then(() => {
          context.commit('updateCartDataLoading', false);
        });
    },
    loadOrderInfo(context, orderId) {
      return axios
        .get(`${API_BASE_URL}/api/orders/${orderId}`, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          context.commit('updateOrderInfo', response.data);
        });
    },
  },
});

export default store;
