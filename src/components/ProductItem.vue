<template>
  <li class="catalog__item">
    <router-link
      class="catalog__pic"
      :to="{name: 'product', params: {id: product.id}}"
    >
      <img
        :src="product.image"
        :alt="product.title"
      >
    </router-link>

    <h3 class="catalog__title">
      <router-link
        :to="{name: 'product', params: {id: product.id}}"
      >
        {{ product.title }}
      </router-link>
    </h3>

    <span class="catalog__price">{{ numberFormat(product.price) }} ₽</span>

    <ul class="colors colors--black">
      <li
        v-for="color in colors"
        :key="color.id"
        class="colors__item"
      >
        <label class="colors__label">
          <input
            class="colors__radio sr-only"
            type="radio"
            :value="color.title"
          >
          <span
            class="colors__value"
            :style="{'background-color': color.code}"
          />
        </label>
      </li>
    </ul>
  </li>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';

export default {
  props: ['product'],
  methods: {
    numberFormat,
  },
  computed: {
    colors() {
      return this.product.colors;
    },
  },
};
</script>
