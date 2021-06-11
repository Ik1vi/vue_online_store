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
        v-model:max-price="maxPrice"
      />

      <section class="catalog">
        <ProductList
          :products="products"
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
import axios from 'axios';

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
      maxPrice: 0,

      productsData: null,
      productsDataAll: 0,
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
      return this.productsDataAll ? this.productsDataAll : [];
    },
    products() {
      return (this.productsData
        ? this.productsData.items.map((product) => ({
          ...product,
          image: product.image.file.url,
        }))
        : []);
    },
    countProducts() {
      return this.productsData ? this.productsData.pagination.total : 0;
    },
  },
  methods: {
    loadProducts() {
      axios.get('https://vue-study.skillbox.cc/api/products', {
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
        });
    },
    loadProductsAll() {
      axios.get('https://vue-study.skillbox.cc/api/products')
        .then((response) => {
          this.productsDataAll = response.data.items;
        });
    },
    findMaxPrice() {
      // eslint-disable-next-line max-len
      const maxDataPrice = this.productsDataAll.reduce((max, cur) => (max < cur.price ? cur.price : max), 0);
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
    filterColor() {
      this.loadProducts();
    },
  },
  created() {
    this.loadProducts();
    this.loadProductsAll();
  },
};
</script>
