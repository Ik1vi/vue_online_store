/* eslint-disable no-shadow */

import axios from 'axios';
import API_BASE_URL from '@/config';

const state = () => ({
  orderInfo: null,
});
const mutations = {
  updateOrderInfo(state, orderInfo) {
    state.orderInfo = orderInfo;
  },
};
const getters = {
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
        color: item.color.color.value,
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
};
const actions = {
  loadOrderInfo({ commit, rootState }, orderId) {
    return axios
      .get(`${API_BASE_URL}/api/orders/${orderId}`, {
        params: {
          userAccessKey: rootState.userAccessKey,
        },
      })
      .then((response) => {
        commit('updateOrderInfo', response.data);
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
