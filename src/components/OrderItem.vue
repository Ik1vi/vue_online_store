<template>
  <li class="cart__order">
    <h3>{{item.title}}</h3>
    <b class="cart__order-price">
      {{ numberFormat(item.quantity * item.price) }} ₽
      <span>{{numberFormat(item.price)}} ₽ * {{item.quantity}}</span>
    </b>
    <span>Артикул: {{item.productId}}</span>
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
