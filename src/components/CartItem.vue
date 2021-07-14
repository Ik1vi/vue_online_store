<template>
  <li class="cart__item product">
    <div class="product__pic">
      <img
        :src="item.image"
        width="120"
        height="120"
        :srcset="item.image"
        :alt="item.title"
      >
    </div>
    <h3 class="product__title">
      <router-link
        :to="{name: 'product', params: {id: item.productId}}"
      >
        {{ item.title }}
      </router-link>
    </h3>
    <p class="product__info">
      {{item.propTitle}}: <span>{{item.propValue}}</span>
    </p>
    <p class="product__info--color">
      Цвет: <span>{{item.colorTitle}}</span>
    </p>
    <span class="product__code"> Артикул: {{ item.id }} </span>

    <AmountCounter
      :product-amount.sync="amount"
      class="product__counter form__counter"
    />

    <b class="product__price">
      {{ numberFormat(item.quantity * item.price) }} ₽
    </b>

    <button
      class="product__del button-del"
      type="button"
      aria-label="Удалить товар из корзины"
      @click.prevent="deleteProduct"
    >
      <svg
        width="20"
        height="20"
        fill="currentColor"
      >
        <use xlink:href="#icon-close" />
      </svg>
    </button>
  </li>
</template>

<script>
import { mapActions } from 'vuex';

import numberFormat from '@/helpers/numberFormat';
import AmountCounter from '@/components/AmountCounter.vue';

export default {
  props: ['item'],
  components: { AmountCounter },
  methods: {
    ...mapActions(['deleteCartProduct']),

    deleteProduct() {
      this.deleteCartProduct({ basketItemId: this.item.id });
    },
    numberFormat,
  },
  computed: {
    amount: {
      get() {
        return this.item.quantity;
      },
      set(value) {
        this.$store.dispatch('updateCartProductAmount', { productId: this.item.id, amount: value });
      },
    },
  },
};
</script>
