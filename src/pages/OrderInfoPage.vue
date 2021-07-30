<template>
<div>
  <main class="content container" v-if="orderInfo">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'main'}">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'cart'}">
            Корзина
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Оформление заказа
          </a>
        </li>
      </ul>

      <h1 class="content__title">
        Заказ оформлен <span>№ {{ orderInfo.id }}</span>
      </h1>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <p class="cart__message">
            Благодарим за&nbsp;выбор нашего магазина.
            На&nbsp;Вашу почту придет письмо с&nbsp;деталями заказа.
            Наши менеджеры свяжутся с&nbsp;Вами в&nbsp;течение
            часа для уточнения деталей доставки.
          </p>

          <ul class="dictionary">
            <li class="dictionary__item">
              <span class="dictionary__key">
                Получатель
              </span>
              <span class="dictionary__value">
                {{ orderInfo.name }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Адрес доставки
              </span>
              <span class="dictionary__value">
                {{ orderInfo.address }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Телефон
              </span>
              <span class="dictionary__value">
                {{ orderInfo.phone }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Email
              </span>
              <span class="dictionary__value">
                {{ orderInfo.email }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Способ оплаты
              </span>
              <span class="dictionary__value">
                {{orderInfo.paymentType}}
              </span>
            </li>
          </ul>
        </div>

        <OrderCartBlock
          :products="products"
          :total-price="orderInfo.totalPrice"
          :total-products-count="totalProductsCount"
          :current-delivery-price="orderInfo.deliveryType.price"
        />
      </form>
    </section>
  </main>
  <main class="preloader-wrapper" v-else>
    <ContentPreloader/>
  </main>
</div>
</template>

<script>
import { mapGetters } from 'vuex';
import OrderCartBlock from '@/components/OrderCartBlock.vue';
import ContentPreloader from '@/components/ContentPreloader.vue';

export default {
  components: { OrderCartBlock, ContentPreloader },
  beforeCreate() {
    if (this.orderInfo && this.orderInfo.id === this.$route.params.id) {
      return;
    }
    this.$store.dispatch('order/loadOrderInfo', this.$route.params.id);
  },
  computed: {
    orderInfo() {
      return this.$store.state.order.orderInfo;
    },
    ...mapGetters('order', {
      products: 'orderDetailProducts',
      totalPrice: 'orderTotalPrice',
      totalProductsCount: 'orderTotalProductText',
    }),
  },
};
</script>
