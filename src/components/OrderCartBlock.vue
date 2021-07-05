<template>
          <div class="cart__block">
          <ul class="cart__orders">
            <OrderItem v-for="item in products" :key="item.productId" :item="item" />
          </ul>

          <div class="cart__total">
            <p>Доставка: <b>500 ₽</b></p>
            <p>Итого: {{ totalProductsCount }} на сумму <b>{{ numberFormat(totalPrice) }} ₽</b></p>
          </div>

          <slot />
        </div>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';
import OrderItem from '@/components/OrderItem.vue';

export default {
  props: ['products', 'totalPrice', 'totalProductsCount'],
  components: { OrderItem },
  methods: {
    numberFormat,
  },
};
</script>
