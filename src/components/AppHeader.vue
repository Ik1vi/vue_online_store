<template>
    <header class="header">
      <div class="header__wrapper container">
        <router-link
          class="header__info"
          :to="{name: 'main'}"
        >
          Каталог
        </router-link>

        <router-link
          class="header__logo"
          href="#"
          :to="{name: 'main'}"
        >
          <img
            src="img/svg/logo-tech.svg"
            alt="Логотип интернет магазина Технозавррр"
            width="190"
            height="33"
            @click="updateCategoryId(0)"
          >
        </router-link>

        <a
          class="header__tel"
          href="tel:8 800 600 90 09"
        >
          8 800 600 90 09
        </a>

        <CartIndicator />
      </div>
    </header>
</template>

<script>
import CartIndicator from '@/components/CartIndicator.vue';

export default {
  components: {
    CartIndicator,
  },
  methods: {
    updateCategoryId(id) {
      this.$store.commit('updateLocalCategoryId', id);
    },
  },
};
</script>
