<template>
  <div>
    <main class="preloader-wrapper" v-if="productLoading">
      <ContentPreloader/>
    </main>
    <main v-if="productLoadingFailed">Не удалось загрузить товар
      <button @click.prevent="loadProducts">Попробовать снова</button>
    </main>

    <main class="content container" v-if="productData">
      <div class="content__top">
        <ul class="breadcrumbs">
          <li
            class="breadcrumbs__item"
            @click.prevent="updateCategoryId(0)"
          >
            <router-link
              class="breadcrumbs__link"
              :to="{name: 'main'}"
            >
              Каталог
            </router-link>
          </li>
          <li
            class="breadcrumbs__item"
            @click.prevent="updateCategoryId(category.id)"
          >
            <router-link
              class="breadcrumbs__link"
              :to="{name: 'main'}"
            >
              {{category.title}}
            </router-link>
          </li>
          <li class="breadcrumbs__item">
            <a
              class="breadcrumbs__link"
            >
              {{currentTitle}}
            </a>
          </li>
        </ul>
      </div>

      <section class="item">
        <div class="item__pics pics">
          <div class="pics__wrapper">
            <img
              width="570"
              height="570"
              :src="product.preview.file.url"
              :srcset="product.preview.file.url"
              :alt="product.title"
            />
          </div>
        </div>

        <div class="item__info">
          <span class="item__code">Артикул: {{product.id}}</span>
          <h2 class="item__title">{{currentTitle}}</h2>
          <div class="item__form">
            <form class="form" action="#" method="POST" @submit.prevent="addToCart">
              <b class="item__price"> {{numberFormat(currentPrice)}} ₽ </b>

              <fieldset class="form__block">
                <legend class="form__legend">Цвет:</legend>
                <ul class="colors">
                  <li class="colors__item" v-for="color in product.colors" :key="color.color.id">
                    <label class="colors__label">
                      <input
                        class="colors__radio sr-only"
                        type="radio"
                        name="color"
                        :value="color.color.id"
                        :checked="isColorChecked(color.color.id)"
                        @click="chooseColor(color.color.id)"
                      />
                      <span
                        class="colors__value"
                        :style="{'background-color': color.color.code}"
                      >
                      </span>
                    </label>
                  </li>
                </ul>
              </fieldset>

              <fieldset class="form__block">
                <legend class="form__legend">{{product.mainProp.title}}</legend>

                <ul class="sizes sizes--primery">
                  <li
                    class="sizes__item"
                    v-for="offer in product.offers"
                    :key="offer.id"
                  >
                    <label class="sizes__label">
                      <input
                        class="sizes__radio sr-only"
                        type="radio"
                        name="sizes-item"
                        :checked="isOfferChecked(offer.id)"
                        @click="chooseOffer(offer.id)"
                      />
                      <span class="sizes__value"> {{offer.propValues[0].value}} </span>
                    </label>
                  </li>
                </ul>
              </fieldset>

              <div class="item__row">
                <AmountCounter :product-amount.sync="productAmount" class="form__counter" />

                <button
                  class="button button--primery"
                  type="submit"
                  :disabled="productAddSending">
                    {{currentBtnText}}
                </button>
              </div>
              <div class="item__cart-info" v-show="isProductInCart">
                Товар с такими характеристиками уже в корзине({{productInCartQuantity}})
              </div>
              <div class="item__cart-info" v-show="productAddSending">Добавляем товар</div>
            </form>
          </div>
        </div>

        <div class="item__desc">
          <ul class="tabs">
            <ProductItemTabItem
              :content="'content'"
              :tab-title="'Описание'"
              :content-data.sync='currentContent'
            />
            <ProductItemTabItem
              :content="'specifications'"
              :tab-title="'Характеристики'"
              :content-data.sync='currentContent'
            />
            <ProductItemTabItem
              :content="'delivery'"
              :tab-title="'Оплата и доставка'"
              :content-data.sync='currentContent'
            />
          </ul>

          <div class="item__content" v-show="currentContent === 'content'">
            <h3>Описание товара:</h3>
            <p>
              {{product.content}}
            </p>
          </div>
          <div class="item__content" v-show="currentContent === 'specifications'">
            <h3>Характеристики товара:</h3>
            <ul>
              <li v-for="specification in product.specifications" :key="specification.id">
                <h4>
                  {{specification.title}}:
                </h4>
                <p>
                  {{specification.value}}
                </p>
              </li>
            </ul>
          </div>
          <div class="item__content" v-show="currentContent === 'delivery'">
            <h3>Доставка и оплата:</h3>
            <p>
              Возможные варианты доставки: курьером и самовывоз.
              От выбранного варианта доставки будет зависеть способ оплаты.
              Способ доставки и оплаты можно выбрать при оформлении заказа.
              Для уточнения деталей вы всегда можете обратиться к нашему менеджеру по телефону
              <a
                class="header__tel"
                href="tel:8 800 600 90 09"
              >
                8 800 600 90 09
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import axios from 'axios';

import API_BASE_URL from '@/config';
import numberFormat from '@/helpers/numberFormat';

import AmountCounter from '@/components/AmountCounter.vue';
import ContentPreloader from '@/components/ContentPreloader.vue';
import ProductItemTabItem from '@/components/ProductItemTabItem.vue';

export default {
  components: { AmountCounter, ContentPreloader, ProductItemTabItem },
  data() {
    return {
      productAmount: 1,

      productData: null,
      productLoading: false,
      productLoadingFailed: false,

      productAdded: false,
      productAddSending: false,
      isProductInCart: false,
      productInCartQuantity: 0,

      currentColorId: 0,
      currentOfferPropId: 0,
      currentTitle: '',
      currentPrice: 0,
      currentBtnText: 'В корзину',

      currentContent: 'content',
    };
  },
  computed: {
    productId() {
      return this.$route.params.id;
    },
    product() {
      return this.productData ? this.productData : null;
    },
    category() {
      return this.productData.category;
    },
    colors() {
      return this.productData.colors;
    },
    ...mapGetters({
      products: 'cartDetailProducts',
    }),
  },
  methods: {
    ...mapActions(['addProductToCart']),
    numberFormat,

    changeContent(content) {
      this.currentContent = content;
    },

    addToCart() {
      this.productAdded = false;
      this.productAddSending = true;

      this.addProductToCart({
        productOfferId: this.currentOfferPropId,
        colorId: this.currentColorId,
        quantity: this.productAmount,
      })
        .then(() => {
          this.productAdded = true;
          this.productAddSending = false;
          this.productAmount = 1;
          this.checkCartProduct();
        });
    },
    loadProduct() {
      this.productLoading = true;
      this.productLoadingFailed = false;

      return axios
        .get(`${API_BASE_URL}/api/products/${this.productId}`)
        .then((response) => {
          this.productData = response.data;
          this.currentColorId = response.data.colors[0].color.id;
          this.currentOfferPropId = response.data.offers[0].id;
          this.currentTitle = response.data.title;
          this.currentPrice = response.data.price;
        })
        .catch(() => {
          this.productLoadingFailed = false;
        })
        .then(() => {
          this.productLoading = false;
        });
    },

    checkCartProduct() {
      const cartProduct = this.products.find(
        (p) => p.colorId === this.currentColorId
        && p.productOfferId === this.currentOfferPropId,
      );
      if (cartProduct) {
        this.isProductInCart = true;
        this.productInCartQuantity = cartProduct.quantity;
      } else this.isProductInCart = false;
    },

    isColorChecked(id) {
      if (id === this.currentColorId) {
        return true;
      }
      return false;
    },
    isOfferChecked(id) {
      if (id === this.currentOfferPropId) {
        return true;
      }
      return false;
    },
    chooseOffer(id) {
      const offer = this.productData.offers.find((p) => p.id === id);
      this.currentOfferPropId = id;
      this.currentTitle = offer.title;
      this.currentPrice = offer.price;
    },
    chooseColor(id) {
      this.currentColorId = id;
    },
    updateCategoryId(id) {
      this.$store.commit('updateLocalCategoryId', id);
    },
  },
  watch: {
    productId: {
      handler() {
        this.loadProduct();
      },
      immediate: true,
    },
    productAdded() {
      this.currentBtnText = 'Товар добавлен';
      this.checkCartProduct();
    },
    currentColorId() {
      this.checkCartProduct();
    },
    currentOfferPropId() {
      this.checkCartProduct();
    },
  },
  created() {
    this.checkCartProduct();
  },
};
</script>
