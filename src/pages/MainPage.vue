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
        :max-price.sync="maxPrice"
        :filter-props.sync="filterProps"
        :colors-list.sync="filterColorsList"
        :page.sync="page"
      />

      <section class="catalog">
        <ContentPreloader v-if="productsLoading" />

        <div v-if="productsLoadingFailed">
          Произошла ошибка при загрузке товаров
          <button @click.prevent="loadProducts">
            Попробовать снова
          </button>
        </div>

        <div v-show="!products || products.length == 0">
          К сожалению, нет ни одного товара по заданным фильтрам
        </div>

        <ProductList :products="products" />

        <BasePagination
          v-model="page"
          :count="countProducts"
          :per-page="productsPerPage"
          v-show="products && products.length > 0"
        />
        <fieldset
          class="form__block"
          v-show="products && products.length > 0"
        >
          <legend class="form__legend">
            Товаров на странице:
          </legend>
          <label class="form__label form__label--select">
            <select
              v-model.number="productsPerPage"
              class="form__select"
              type="text"
              name="productsPerPage"
            >
              <option>9</option>
              <option>18</option>
              <option>27</option>
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
      filterProps: '',

      filterColorsList: [],
      checkedProps: [],
      maxPrice: 0,

      page: 1,
      productsPerPage: 9,

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
  },
  watch: {
    page() {
      this.loadProducts();
    },
    productsPerPage() {
      this.loadProducts();
      this.page = 1;
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
    filterProps() {
      this.loadProducts();
    },
    filterColorsList() {
      this.loadProducts();
    },
  },
  created() {
    this.loadProducts();
    this.loadProductsAll();
  },
};
</script>
