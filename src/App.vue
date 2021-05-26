<template>
  <section class="catalog">
    <ul class="catalog__list">
      <li class="catalog__item" v-for="(product, i) in products" :key="i">
        <a class="catalog__pic" href="#">
          <img :src="`${publicPath}${product.image}`" :alt="product.title" />
        </a>

        <h3 class="catalog__title">
          <a href="#">{{ product.title }}</a>
        </h3>

        <span class="catalog__price">{{ product.price }} р</span>

        <ul class="colors colors--black">
          <li class="colors__item">
            <label class="colors__label">
              <input
                class="colors__radio sr-only"
                type="radio"
                name="color-1"
                value="#73B6EA"
                checked=""
              />
              <span class="colors__value" style="background-color: #73b6ea"> </span>
            </label>
          </li>
          <li class="colors__item">
            <label class="colors__label">
              <input class="colors__radio sr-only" type="radio" name="color-1" value="#8BE000" />
              <span class="colors__value" style="background-color: #8be000"> </span>
            </label>
          </li>
          <li class="colors__item">
            <label class="colors__label">
              <input class="colors__radio sr-only" type="radio" name="color-1" value="#222" />
              <span class="colors__value" style="background-color: #222"> </span>
            </label>
          </li>
        </ul>
      </li>
    </ul>
  </section>

  <BasePagination
    v-model:page="page"
    :count="countProducts"
    :per-page="productsPerPage"
  >
  </BasePagination>
</template>

<script>
import products from './data/products';
import BasePagination from './components/BasePagination.vue';

export default {
  name: 'App',
  components: { BasePagination },
  data() {
    return {
      publicPath: process.env.BASE_URL,
      page: 1,
      productsPerPage: 3,
    };
  },

  computed: {
    products() {
      const offset = (this.page - 1) * this.productsPerPage;
      return products.slice(offset, offset + this.productsPerPage);
    },
    countProducts() {
      return products.length;
    },
  },
};
</script>
