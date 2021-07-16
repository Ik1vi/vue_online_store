<template>
  <main class="content container">
    <div class="content__top content__top--catalog">
      <h1 class="content__title">
        Каталог
      </h1>
      <span class="content__info"> 152 товара </span>
    </div>

    <div class="content__catalog">
      <ProductFilter
        :price-from.sync="filterPriceFrom"
        :price-to.sync="filterPriceTo"
        :category-id.sync="filterCategoryId"
        :color-id.sync="filterColorId"
        :max-price.sync="maxPrice"
        :filter-props.sync="filterProps"
      />

      <section class="catalog">
        <ContentPreloader v-if="productsLoading" />

        <div v-if="productsLoadingFailed">
          Произошла ошибка при загрузке товаров
          <button @click.prevent="loadProducts">
            Попробовать снова
          </button>
        </div>

        <ProductList :products="products" />

        <BasePagination
          v-model="page"
          :count="countProducts"
          :per-page="productsPerPage"
        />
      </section>
    </div>
  </main>
</template>

<script>
import axios from 'axios';
import API_BASE_URL from '@/config';

import BasePagination from '@/components/BasePagination.vue';
import ProductList from '@/components/ProductList.vue';
import ProductFilter from '@/components/ProductFilter.vue';
import ContentPreloader from '@/components/ContentPreloader.vue';

export default {
  components: {
    BasePagination,
    ProductList,
    ProductFilter,
    ContentPreloader,
  },
  data() {
    return {
      filterPriceFrom: 1,
      filterPriceTo: 100000,
      filterCategoryId: 0,
      filterColorId: 0,
      filterProps: '',

      checkedProps: [],
      maxPrice: 0,

      page: 1,
      productsPerPage: 3,

      productsData: null,
      productsDataAll: 0,

      productsLoading: false,
      productsLoadingFailed: false,
    };
  },

  computed: {
    productsAll() {
      return this.productsDataAll ? this.productsDataAll : [];
    },
    products() {
      return (this.productsData
        ? this.productsData.items.map((product) => ({
          ...product,
          image: product.preview.file.url,
        }))
        : []);
    },
    countProducts() {
      return this.productsData ? this.productsData.pagination.total : 0;
    },
  },
  methods: {
    loadProducts() {
      this.productsLoading = true;
      this.productsLoadingFailed = false;
      clearTimeout(this.loadProductsTimer);

      this.loadProductsTimer = setTimeout(() => {
        axios
          .get(`${API_BASE_URL}/api/products?${this.filterProps}`, {
            params: {
              page: this.page,
              limit: this.productsPerPage,
              categoryId: this.filterCategoryId,
              minPrice: this.filterPriceFrom,
              maxPrice: this.filterPriceTo,
            },
          })
          .then((response) => {
            this.productsData = response.data;
            this.productsLoading = false;
          })
          .catch(() => {
            this.productsLoadingFailed = false;
          });
      }, 0);
    },
    loadProductsAll() {
      return axios.get(`${API_BASE_URL}/api/products`)
        .then((response) => {
          this.productsDataAll = response.data.items;
        });
    },
    findMaxPrice() {
      const maxDataPrice = this.productsDataAll.reduce((max, cur) => (
        max < cur.price ? cur.price : max), 0);
      this.maxPrice = maxDataPrice;
      return maxDataPrice;
    },
  },
  watch: {
    page() {
      this.loadProducts();
    },
    productsDataAll() {
      this.findMaxPrice();
    },
    filterPriceFrom() {
      this.loadProducts();
    },
    filterPriceTo() {
      this.loadProducts();
    },
    filterCategoryId() {
      this.loadProducts();
    },
    filterColorId() {
      this.loadProducts();
    },
    filterProps() {
      this.loadProducts();
    },
  },
  created() {
    this.loadProducts();
    this.loadProductsAll();
  },
};
</script>
