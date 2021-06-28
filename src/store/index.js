import { createStore } from 'vuex';
import axios from 'axios';
import API_BASE_URL from '@/config';

const store = createStore({
  state: {
    cartProducts: [],
    userAccessKey: null,
    cartProductsData: [],
    cartDataLoading: false,
  },
  mutations: {
    updateUserAccessKey(state, accessKey) {
      state.userAccessKey = accessKey;
    },
    updateCartProductsData(state, items) {
      state.cartProductsData = items;
    },
    syncCartProducts(state) {
      state.cartProducts = state.cartProductsData.map((item) => ({
        productId: item.product.id,
        amount: item.quantity,
      }));
    },
    updateCartDataLoading(state, loadingState) {
      state.cartDataLoading = loadingState;
    },
  },
  getters: {
    cartDetailProducts(state) {
      return state.cartProducts.map((item) => {
        const { product } = state.cartProductsData.find((p) => p.product.id === item.productId);
        return {
          ...item,
          product: {
            ...product,
            image: product.image.file.url,
          },
        };
      });
    },
    cartTotalPrice(state, getters) {
      return getters.cartDetailProducts.reduce(
        (acc, item) => acc + (item.product.price * item.amount), 0,
      );
    },
    cartTotalProductsCount(state) {
      return state.cartProducts.reduce(
        (acc, item) => acc + item.amount, 0,
      );
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
    addProductToCart(context, { productId, amount }) {
      context.commit('updateCartDataLoading', true);
      return axios
        .post(`${API_BASE_URL}/api/baskets/products`, {
          productId,
          quantity: amount,
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
    updateCartProductAmount(context, { productId, amount }) {
      return axios
        .put(`${API_BASE_URL}/api/baskets/products`, {
          productId,
          quantity: amount,
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
    deleteCartProduct(context, { productId }) {
      context.commit('updateCartDataLoading', true);
      return axios
        .delete(`${API_BASE_URL}/api/baskets/products`, {
          data: {
            productId,
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
  },
});

export default store;
