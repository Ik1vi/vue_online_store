<template>
  <li class="catalog__item">
    <a class="catalog__pic" href="#">
      <img :src="`${publicPath}${product.image}`" :alt="product.title" />
    </a>

    <h3 class="catalog__title">
      <a href="#">{{ product.title }}</a>
    </h3>

    <span class="catalog__price">{{ product.price }} р</span>

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
import colors from '../data/productColors';

export default {
  props: ['product'],
  data() {
    return {
      publicPath: process.env.BASE_URL,
      color: '#73B6EA',
    };
  },
  computed: {
    colors() {
      return colors;
    },
  },
};
</script>
