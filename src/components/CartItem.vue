<template>
  <li class="cart__item product">
    <div class="product__pic">
      <img
        :src="item.product.image"
        width="120"
        height="120"
        :srcset="item.product.image2x"
        alt="item.product.title"
      />
    </div>
    <h3 class="product__title">{{ item.product.title }}</h3>
    <p class="product__info">Объем: <span>128GB</span></p>
    <span class="product__code"> Артикул: {{ item.product.id }} </span>

    <AmountCounter class="product__counter form__counter" v-model:productAmount="amount"/>

    <b class="product__price"> {{ numberFormat(item.amount * item.product.price) }} ₽ </b>

    <button
      class="product__del button-del"
      type="button"
      aria-label="Удалить товар из корзины"
      @click.prevent="deleteProduct(item.productId)"
    >
      <svg width="20" height="20" fill="currentColor">
        <use xlink:href="#icon-close"></use>
      </svg>
    </button>
  </li>
</template>

<script>
import { mapMutations } from 'vuex';
import numberFormat from '@/helpers/numberFormat';
import AmountCounter from '@/components/AmountCounter.vue';

export default {
  props: ['item'],
  components: { AmountCounter },
  methods: {
    ...mapMutations({ deleteProduct: 'deleteCartProduct' }),
    numberFormat,
  },
  computed: {
    amount: {
      get() {
        return this.item.amount;
      },
      set(value) {
        this.$store.commit('updateCartProductAmount', { productId: this.item.productId, amount: value });
      },
    },
  },
};
</script>
