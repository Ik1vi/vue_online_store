<template>
  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'main'}">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link"> Корзина </a>
        </li>
      </ul>

      <h1 class="content__title">
        Корзина
      </h1>
      <span class="content__info"> {{ totalProductsCount }} </span>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <NoContentAnimate
            v-show="products.length == 0"
            :no-content-text="'Корзина пуста...все еще...'"
          />
          <ContentPreloader v-if="!products" />
          <ul class="cart__list">
            <CartItem v-for="item in products" :key="item.id" :item="item" />
          </ul>
        </div>

        <div class="cart__block">
          <p class="cart__desc">
            Мы&nbsp;посчитаем стоимость доставки на&nbsp;следующем этапе
          </p>
          <p class="cart__price">
            Итого:
            <span>{{ numberFormat(totalPrice) }}₽</span>
          </p>

          <router-link
            :disabled="products.length == 0"
            class="cart__button button button--primery"
            tag="button"
            type="submit"
            :to="{name: 'order'}"
          >
            Оформить заказ
          </router-link>
          <button
            v-show="products.length > 0"
            class="cart__reset button button--second"
            @click.prevent="resetCart"
          >
            Очистить корзину
          </button>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import numberFormat from '@/helpers/numberFormat';
import CartItem from '@/components/CartItem.vue';
import ContentPreloader from '@/components/ContentPreloader.vue';
import NoContentAnimate from '@/components/NoContentAnimate.vue';

export default {
  components: { CartItem, ContentPreloader, NoContentAnimate },
  methods: {
    numberFormat,
    ...mapActions('cart', {
      deleteCartProductsAll: 'deleteCartProductsAll',
    }),

    resetCart() {
      this.deleteCartProductsAll({ products: this.products });
    },
  },
  computed: {
    ...mapGetters('cart', {
      products: 'cartDetailProducts',
      totalPrice: 'cartTotalPrice',
      totalProductsCount: 'cartTotalProductText',
    }),
  },
};
</script>
