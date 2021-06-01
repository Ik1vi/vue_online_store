<template>
  <main class="content container">
    <div class="content__top content__top--catalog">
      <h1 class="content__title">Каталог</h1>
      <span class="content__info"> 152 товара </span>
    </div>

    <div class="content__catalog">
      <ProductFilter
        v-model:price-from="filterPriceFrom"
        v-model:price-to="filterPriceTo"
        v-model:category-id="filterCategoryId"
        v-model:colorId="filterColorId"
        :max-price="findMaxPrice"
      />

      <section class="catalog">
        <ProductList
          :products="products"
          @goToPage="(pageName, pageParams) => $emit('goToPage', pageName, pageParams)"
        />
        <BasePagination v-model:page="page" :count="countProducts" :per-page="productsPerPage" />
      </section>
    </div>
  </main>
</template>

<script>
import products from '@/data/products';
import BasePagination from '@/components/BasePagination.vue';
import ProductList from '@/components/ProductList.vue';
import ProductFilter from '@/components/ProductFilter.vue';

export default {
  components: {
    BasePagination,
    ProductList,
    ProductFilter,
  },
  data() {
    return {
      filterPriceFrom: 0,
      filterPriceTo: 0,
      filterCategoryId: 0,
      filterColorId: 0,
      page: 1,
      productsPerPage: 3,
    };
  },

  computed: {
    filteredProducts() {
      let filteredProducts = products;

      if (this.filterPriceFrom > 0) {
        filteredProducts = filteredProducts.filter((prod) => prod.price > this.filterPriceFrom);
      }
      if (this.filterPriceTo > 0) {
        filteredProducts = filteredProducts.filter((prod) => prod.price <= this.filterPriceTo);
      }
      if (this.filterCategoryId) {
        filteredProducts = filteredProducts.filter(
          (prod) => prod.categoryId === this.filterCategoryId,
        );
      }
      if (this.filterColorId) {
        filteredProducts = filteredProducts.filter(
          (prod) => prod.colorId === this.filterColorId,
        );
      }
      return filteredProducts;
    },
    productsAll() {
      return products;
    },
    products() {
      const offset = (this.page - 1) * this.productsPerPage;
      return this.filteredProducts.slice(offset, offset + this.productsPerPage);
    },
    countProducts() {
      return this.filteredProducts.length;
    },
    findMaxPrice() {
      return this.productsAll.reduce((max, cur) => (max < cur.price ? cur.price : max), 0);
    },
  },
};
</script>
