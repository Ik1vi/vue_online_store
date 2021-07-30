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

    <fieldset class="catalog__block">
      <label class="catalog__label catalog__label--select">
        <select
          class="catalog__select"
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

    <div class="catalog__items">
      <span class="catalog__price">{{numberFormat(currentPrice)}} ₽</span>

      <svg
        class="catalog__cart-icon"
        width="30"
        height="21"
        fill="black"
        @click="addToCart"
      >
        <use xlink:href="#icon-cart"></use>
      </svg>
    </div>

    <div class="catalog__cart-info" v-show="productAddSending">Добавляем товар</div>
    <div class="catalog__cart-info" v-show="isProductInCart">
      Товар с выбранными свойствами уже в корзине ({{productInCartQuantity}})
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
    ...mapActions('cart', {
      addProductToCart: 'addProductToCart',
    }),
    numberFormat,

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
    ...mapGetters('cart', {
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
