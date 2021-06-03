<template>
  <component
    :is="currentPageComponent"
    :page-params="currentPageParams"

  />
</template>

<script>
import MainPage from '@/pages/MainPage.vue';
import ProductPage from '@/pages/ProductPage.vue';
import NotFoundPage from '@/pages/NotFoundPage.vue';

const routes = {
  main: 'MainPage',
  product: 'ProductPage',
};

export default {
  data() {
    return {
      currentPage: 'main',
      currentPageParams: {},
    };
  },
  components: {
    MainPage,
    ProductPage,
    NotFoundPage,
  },
  computed: {
    currentPageComponent() {
      return routes[this.currentPage] || 'NotFoundPage';
    },
  },
  mounted() {
    this.emitter.on('pageName', (pageName) => {
      this.currentPage = pageName;
    });
    this.emitter.on('pageParams', (pageParams) => {
      this.currentPageParams = pageParams || {};
    });
  },
};
</script>
