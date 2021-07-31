<template>
  <li class="cart__item product">
    <h3 class="product__title">
      <router-link
        :to="{name: 'product', params: {id: item.productId}}"
      >
        {{ item.title }}
      </router-link>
    </h3>
    <span class="product__code"> Артикул: {{ item.id }} </span>

    <div class="product__pic">
      <img
        :src="item.image"
        width="120"
        height="120"
        :srcset="item.image"
        :alt="item.title"
      >
    </div>

    <p class="product__info">
      {{item.propTitle}}: <span>{{item.propValue}}</span>
    </p>
    <p class="product__info product__info--color">
      Цвет: <span
        class="color-value"
        :style="{'background-color': item.color}"
      />
      <span>{{item.colorTitle}}</span>
    </p>

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
    ...mapActions('cart', {
      deleteCartProduct: 'deleteCartProduct',
    }),

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
        this.$store.dispatch('cart/updateCartProductAmount', {
          basketItemId: this.item.id,
          quantity: value,
        });
      },
    },
  },
};
</script>
