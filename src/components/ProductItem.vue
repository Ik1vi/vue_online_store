<template>
  <li class="catalog__item">
    <router-link
      class="catalog__pic"
      :to="{name: 'product', params: {id: product.id}}"
    >
      <img
        :src="product.image"
        :alt="product.title"
      >
    </router-link>

    <h3 class="catalog__title">
      <router-link
        :to="{name: 'product', params: {id: product.id}}"
      >
        {{currentTitle}}
      </router-link>
    </h3>

    <span class="catalog__price">{{numberFormat(currentPrice)}} ₽</span>

    <fieldset class="form__block">
        <label class="form__label form__label--select">
          <select
            class="form__select"
            type="text"
            name="prop"
            v-model="currentOfferPropId"
          >
            <option
              v-for="offer in product.offers"
              :key="offer.id"
              :value="offer.id"
            >
              {{ offer.propValues[0].value }}
            </option>
          </select>
        </label>
      </fieldset>

    <ul class="colors colors--black">
      <li
        v-for="color in colors"
        :key="color.color.id"
        class="colors__item"
      >
        <label class="colors__label">
          <input
            class="colors__radio sr-only"
            type="radio"
            :value="color.color.title"
            :checked="isColorChecked(color.color.id)"
            @click="chooseColor(color.color.id)"
          >
          <span
            class="colors__value"
            :style="{'background-color': color.color.code}"
          />
        </label>
      </li>
    </ul>
    <svg
      width="30"
      height="21"
      fill="black"
      @click="addToCart"
    >
      <use xlink:href="#icon-cart"></use>
    </svg>
    <div v-show="productAddSending">Добавляем товар</div>
    <div v-show="isProductInCart">
      Товар с такими характеристиками уже в корзине({{productInCartQuantity}})
    </div>
  </li>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import numberFormat from '@/helpers/numberFormat';

export default {
  props: ['product'],
  data() {
    return {
      productAdded: false,
      productAddSending: false,

      currentColorId: this.product.colors[0].color.id,
      currentOfferPropId: this.product.offers[0].id,
      currentTitle: this.product.offers[0].title,
      currentPrice: this.product.offers[0].price,

      isProductInCart: false,
      productInCartQuantity: 0,
    };
  },
  methods: {
    ...mapActions(['addProductToCart']),
    numberFormat,

    checkCartProduct() {
      // eslint-disable-next-line max-len
      const cartProduct = this.products.find((p) => p.colorId === this.currentColorId && p.productOfferId === this.currentOfferPropId);
      if (cartProduct) {
        this.isProductInCart = true;
        this.productInCartQuantity = cartProduct.quantity;
      } else this.isProductInCart = false;
    },

    addToCart() {
      this.productAdded = false;
      this.productAddSending = true;

      this.addProductToCart({
        productOfferId: this.currentOfferPropId,
        colorId: this.currentColorId,
        quantity: 1,
      })
        .then(() => {
          this.productAdded = true;
          this.productAddSending = false;
          this.checkCartProduct();
        });
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
      const offer = this.product.offers.find((p) => p.id === id);
      this.currentOfferPropId = id;
      this.currentTitle = offer.title;
      this.currentPrice = offer.price;
    },
    chooseColor(id) {
      this.currentColorId = id;
    },
  },
  computed: {
    colors() {
      return this.product.colors;
    },
    ...mapGetters({
      products: 'cartDetailProducts',
    }),
  },
  watch: {
    currentOfferPropId(value) {
      this.chooseOffer(value);
      this.checkCartProduct();
    },
    currentColorId() {
      this.checkCartProduct();
    },
  },
  created() {
    this.checkCartProduct();
  },
};
</script>
