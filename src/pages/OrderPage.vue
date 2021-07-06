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
        Корзина
      </h1>
      <span class="content__info">
        {{ totalProductsCount }}
      </span>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST" @submit.prevent="order">
        <div class="cart__field">
          <div class="cart__data">
            <BaseFormText
              title="ФИО"
              :error="formError.name"
              placeholder="Введите ваше полное имя"
              v-model="formData.name"
            />
            <BaseFormText
              title="Адрес доставки"
              :error="formError.address"
              placeholder="Введите ваш адрес"
              v-model="formData.address"
            />
            <BaseFormText
              title="Телефон"
              :error="formError.phone"
              type="tel"
              placeholder="Введите ваш телефон"
              v-model="formData.phone"
            />

            <BaseFormText
              title="Email"
              :error="formError.email"
              type="email"
              placeholder="Введи ваш Email"
              v-model="formData.email"
            />

            <BaseFormTextarea
              title="Комментарий к заказу"
              :error="formError.comment"
              placeholder="Ваши пожелания"
              v-model="formData.comment"
            />
          </div>

          <div class="cart__options">
            <h3 class="cart__title">Доставка</h3>
            <ul class="cart__options options">
              <li class="options__item">
                <label class="options__label">
                  <input
                    class="options__radio sr-only"
                    type="radio"
                    name="delivery"
                    value="0"
                    checked=""
                  >
                  <span class="options__value">
                    Самовывоз <b>бесплатно</b>
                  </span>
                </label>
              </li>
              <li class="options__item">
                <label class="options__label">
                  <input class="options__radio sr-only" type="radio" name="delivery" value="500">
                  <span class="options__value">
                    Курьером <b>500 ₽</b>
                  </span>
                </label>
              </li>
            </ul>

            <h3 class="cart__title">Оплата</h3>
            <ul class="cart__options options">
              <li class="options__item">
                <label class="options__label">
                  <input class="options__radio sr-only" type="radio" name="pay" value="card">
                  <span class="options__value">
                    Картой при получении
                  </span>
                </label>
              </li>
              <li class="options__item">
                <label class="options__label">
                  <input class="options__radio sr-only" type="radio" name="pay" value="cash">
                  <span class="options__value">
                    Наличными при получении
                  </span>
                </label>
              </li>
            </ul>
          </div>
        </div>

        <OrderCartBlock
          :products="products"
          :totalPrice="totalPrice"
          :totalProductsCount="totalProductsCount"
        >
          <button class="cart__button button button--primery" type="submit">
            Оформить заказ
          </button>
          <div v-show="orderAdded">Заказ оформлен</div>
          <div v-show="orderSending">Оформляем заказ</div>
        </OrderCartBlock>

        <div class="cart__error form__error-block" v-if="formErrorMessage">
          <h4>Заявка не отправлена!</h4>
          <p>
            {{formErrorMessage}}
          </p>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';

import API_BASE_URL from '@/config';
import numberFormat from '@/helpers/numberFormat';

import BaseFormText from '@/components/BaseFormText.vue';
import BaseFormTextarea from '@/components/BaseFormTextarea.vue';
import OrderCartBlock from '@/components/OrderCartBlock.vue';

export default {
  data() {
    return {
      formData: {},
      formError: {},
      formErrorMessage: '',
      orderAdded: false,
      orderSending: false,
    };
  },
  components: { BaseFormText, BaseFormTextarea, OrderCartBlock },
  methods: {
    numberFormat,
    order() {
      this.formError = {};
      this.formErrorMessage = '';
      this.orderAdded = false;
      this.orderSending = true;

      return axios
        .post(`${API_BASE_URL}/api/orders`, {
          ...this.formData,
        },
        {
          params: {
            userAccessKey: this.$store.state.userAccessKey,
          },
        })
        .then((response) => {
          this.orderAdded = true;
          this.orderSending = false;

          this.$store.commit('updateOrderInfo', response.data);
          this.$store.commit('resetCart');
          this.$router.push({ name: 'orderInfo', params: { id: response.data.id } });
        })
        .catch((error) => {
          this.orderAdded = false;
          this.orderSending = false;
          this.formError = error.response.data.error.request || {};
          this.formErrorMessage = error.response.data.error.message || '';
        });
    },
  },
  computed: {
    ...mapGetters({
      products: 'cartDetailProducts',
      totalPrice: 'cartTotalPrice',
      totalProductsCount: 'cartTotalProductText',
    }),
  },
};
</script>
