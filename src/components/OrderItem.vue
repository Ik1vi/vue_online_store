<template>
  <li class="cart__order">
    <h3>{{item.product.title}}</h3>
    <b class="cart__order-price">
      {{ numberFormat(item.amount * item.product.price) }} ₽
      <span>{{numberFormat(item.product.price)}} ₽ * {{item.amount}}</span>
    </b>
    <span>Артикул: {{item.product.id}}</span>
  </li>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';

export default {
  props: ['item'],
  methods: {
    numberFormat,
  },
  computed: {

  },
};
</script>
