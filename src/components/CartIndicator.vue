<template>
  <router-link class="header__cart" :to="{name: 'cart'}" aria-label="Корзина с товарами">
    <svg width="30" height="21" fill="currentColor">
      <use xlink:href="#icon-cart"></use>
    </svg>
    <img
      class="header__icon-loading"
      src="/img/svg/icon-loading.svg"
      alt="Иконка загрузки"
      width="20"
      height="20"
      v-if="$store.state.cartDataLoading"
    />
    <span
      class="header__count"
      aria-label="Количество товаров"
      v-else
    >
      {{totalProductsCount}}
    </span>
  </router-link>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('cart', {
      totalProductsCount: 'cartTotalProductsCount',
    }),
  },
};
</script>
