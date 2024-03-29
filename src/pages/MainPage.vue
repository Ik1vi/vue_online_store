<template>
  <main class="content container">
    <div class="content__top content__top--catalog">
      <h1 class="content__title">
        Каталог
      </h1>
      <span class="content__info"> {{productCountText}}</span>
    </div>

    <div class="content__catalog">
      <ProductFilter
        :price-from.sync="filterPriceFrom"
        :price-to.sync="filterPriceTo"
        :category-id.sync="filterCategoryId"
        :max-price.sync="maxPrice"
        :filter-props.sync="filterProps"
        :colors-list.sync="filterColorsList"
        :page.sync="page"
        :is-filters.sync="isFilters"
      />

      <section class="catalog">
        <ContentPreloader v-if="productsLoading" />

        <div v-if="productsLoadingFailed">
          Произошла ошибка при загрузке товаров
          <button @click.prevent="loadProducts">
            Попробовать снова
          </button>
        </div>

        <NoContentAnimate
          v-show="!products || products.length == 0"
          :no-content-text="'К сожалению, нет ни одного товара по заданным фильтрам'"
        />

        <ProductList
          :class="productsPerPageClass"
          :products="products"
        />

        <BasePagination
          v-model="page"
          :count="countProducts"
          :per-page="productsPerPage"
          v-show="products && products.length > 0"
        />
        <fieldset
          class="catalog__block catalog__block--per-page"
          v-show="products && products.length > 0"
        >
          <legend class="catalog__legend catalog__legend--per-page">
            Товаров на странице
          </legend>
          <label class="catalog__label catalog__label--select">
            <select
              v-model.number="productsPerPage"
              class="catalog__select"
              type="text"
              name="productsPerPage"
            >
              <option>12</option>
              <option>24</option>
              <option>32</option>
            </select>
          </label>
        </fieldset>
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
import NoContentAnimate from '@/components/NoContentAnimate.vue';

export default {
  components: {
    BasePagination,
    ProductList,
    ProductFilter,
    ContentPreloader,
    NoContentAnimate,
  },
  data() {
    return {
      filterPriceFrom: 1,
      filterPriceTo: 500000,
      filterCategoryId: 0,
      filterProps: '',

      filterColorsList: [],
      checkedProps: [],
      maxPrice: 1,
      isFilters: false,
      productCountText: '',

      page: 1,
      productsPerPage: 12,
      productsPerPageClass: '',

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
    categoryData() {
      return this.$store.state.localCategoryId;
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
            const responseData = response.data;
            const productsFiltered = [];

            if (this.filterColorsList.length > 0) {
              responseData.items.map((item) => item.colors.map((color) => {
                if (this.filterColorsList.includes(color.color.id)) {
                  productsFiltered.push(item);
                }
                return productsFiltered;
              }));

              const seen = new Set();
              const productItems = productsFiltered.filter((product) => {
                const key = product.id;
                return seen.has(key) ? false : seen.add(key);
              });

              responseData.items = productItems;
              responseData.pagination.total = productItems.length;
              if (productItems.length > this.productsPerPage) {
                responseData.pagination.pages = Math.floor(productItems.length / this.limit);
              } else responseData.pagination.pages = 1;

              this.productsData = responseData;
            } else {
              this.productsData = response.data;
            }
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
    filterCheck() {
      if (
        this.filterPriceFrom > 1
        || this.filterPriceTo < this.maxPrice
        || this.filterCategoryId > 0
      ) {
        this.isFilters = true;
      } else {
        this.isFilters = false;
      }
    },
    totalProductText() {
      const endings = ['товар', 'товара', 'товаров'];
      function productEnding(number) {
        return endings[
          (number % 100 > 4 && number % 100 < 20) ? 2
            : [2, 0, 1, 1, 1, 2][(number % 10 < 5) ? number % 10 : 5]];
      }
      this.productCountText = `${this.productsData.pagination.total} ${productEnding(this.productsData.pagination.total)}`;
    },
    checkProductsPerPage() {
      if (this.productsPerPage === 32) {
        this.productsPerPageClass = 'per-page--large';
      } else if (this.productsPerPage === 24) {
        this.productsPerPageClass = 'per-page--average';
      } else this.productsPerPageClass = '';
    },
  },
  watch: {
    page() {
      this.loadProducts();
    },
    productsPerPage() {
      this.loadProducts();
      this.page = 1;
      this.checkProductsPerPage();
    },
    productsData() {
      this.totalProductText();
    },
    productsDataAll() {
      this.findMaxPrice();
    },
    filterPriceFrom() {
      this.loadProducts();
      this.filterCheck();
    },
    filterPriceTo() {
      this.loadProducts();
      this.filterCheck();
    },
    filterCategoryId() {
      this.loadProducts();
      this.filterCheck();
    },
    filterProps() {
      this.loadProducts();
    },
    filterColorsList() {
      this.loadProducts();
    },
    maxPrice(value) {
      this.filterPriceTo = value;
    },
    categoryData(value) {
      this.filterCategoryId = value;
    },
  },
  created() {
    this.filterCategoryId = this.$store.state.localCategoryId;
    this.loadProducts();
    this.loadProductsAll();
  },
};
</script>
