<template>
  <component
    :is="currentPageComponent"
    :page-params="currentPageParams"
    @goToPage="(pageName, pageParams) => goToPage(pageName, pageParams)"
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
  methods: {
    goToPage(pageName, pageParams) {
      this.currentPage = pageName;
      this.currentPageParams = pageParams || {};
    },
  },
  computed: {
    currentPageComponent() {
      return routes[this.currentPage] || 'NotFoundPage';
    },
  },
};
</script>
