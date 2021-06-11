<template>
  <li class="catalog__item">
    <router-link
      class="catalog__pic"
      :to="{name: 'product', params: {id: product.id}}"
    >
      <img :src="product.image" :alt="product.title" />
    </router-link>

    <h3 class="catalog__title">
      <a href="#">{{ product.title }}</a>
    </h3>

    <span class="catalog__price">{{numberFormat(product.price)}} ₽</span>

    <ul class="colors colors--black">
      <li class="colors__item" v-for="color in colors" :key="color.id">
        <label class="colors__label">
          <input
            class="colors__radio sr-only"
            type="radio"
            value="color.title"
          />
          <span
            class="colors__value"
            :style="{'background-color': color.color, 'box-shadow': color.boxShadow}"
          >
          </span>
        </label>
      </li>
    </ul>
  </li>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';

import colors from '@/data/productColors';

export default {
  props: ['product'],
  data() {
    return {
      publicPath: process.env.BASE_URL,
      color: '#73B6EA',
    };
  },
  methods: {
    numberFormat,
  },
  computed: {
    colors() {
      return colors;
    },
  },
};
</script>
