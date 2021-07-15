<template>
  <aside class="filter">
    <h2 class="filter__title">
      Фильтры
    </h2>

    <form
      class="filter__form form"
      action="#"
      method="get"
      @submit.prevent="submit"
    >
      <fieldset class="form__block">
        <legend class="form__legend">
          Цена
        </legend>
        <label class="form__label form__label--price">
          <input
            v-model.number="currentPriceFrom"
            class="form__input"
            type="text"
            name="min-price"
          >
          <span class="form__value">От</span>
        </label>
        <label class="form__label form__label--price">
          <input
            v-model.number="currentPriceTo"
            class="form__input"
            type="text"
            name="max-price"
          >
          <span class="form__value">До</span>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">
          Категория
        </legend>
        <label class="form__label form__label--select">
          <select
            v-model.number="currentCategoryId"
            class="form__select"
            type="text"
            name="category"
          >
            <option value="0">Все категории</option>
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.title }}
            </option>
          </select>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">
          Цвет
        </legend>
        <ul class="colors">
          <li
            v-for="color in colors"
            :key="color.id"
            class="colors__item"
          >
            <label class="colors__label">
              <input
                v-model.number="currentColorId"
                class="colors__radio sr-only"
                type="radio"
                name="color"
                :value="color.id"
              >
              <span
                class="colors__value"
                :style="{'background-color': color.code}"
              />
            </label>
          </li>
        </ul>
      </fieldset>

      <ul v-show="currentCategoryId>0">
        <li v-for="prop in productProps" :key="prop.id">
          <fieldset class="form__block">
            <legend class="form__legend">
              {{prop.title}}
            </legend>
            <ul class="check-list">
              <li class="check-list__item" v-for="value in prop.availableValues" :key="value.value">
                <label class="check-list__label">
                  <input
                    class="check-list__check sr-only"
                    type="checkbox"
                    :name="prop.title"
                    :value="`${prop.title}: ${value.value}`"
                    v-model="checkedProps"
                  >
                  <span class="check-list__desc">
                    {{value.value}}
                    <span>( {{value.productsCount}} )</span>
                  </span>
                </label>
              </li>
            </ul>
          </fieldset>
        </li>
      </ul>

      <button
        class="filter__submit button button--primery"
        type="submit"
      >
        Применить
      </button>
      <button
        class="filter__reset button button--second"
        type="button"
        @click.prevent="reset"
      >
        Сбросить
      </button>
    </form>
  </aside>
</template>

<script>
import axios from 'axios';

import API_BASE_URL from '@/config';
import numberFormat from '@/helpers/numberFormat';

export default {
  props: ['priceFrom', 'priceTo', 'categoryId', 'colorId', 'maxPrice'],
  data() {
    return {
      currentPriceFrom: 1,
      currentPriceTo: this.maxPrice,
      currentCategoryId: 0,
      currentColorId: 0,
      checkedProps: [],

      categoriesData: null,
      currentCategoryData: null,
      colorsData: null,
    };
  },
  computed: {
    categories() {
      return this.categoriesData ? this.categoriesData.items : [];
    },
    colors() {
      return this.colorsData ? this.colorsData.items : [];
    },
    productProps() {
      return this.currentCategoryData ? this.currentCategoryData.productProps : [];
    },
  },
  watch: {
    priceFrom(value) {
      this.currentPriceFrom = value;
    },
    priceTo(value) {
      this.currentPriceTo = value;
    },
    categoryId(value) {
      this.currentCategoryId = value;
      this.loadCategory(value);
    },
    currentCategoryId(value) {
      this.loadCategory(value);
      this.checkedProps = [];
    },
    colorId(value) {
      this.currentColorId = value;
    },
    maxPrice(value) {
      this.currentPriceTo = value;
    },
  },
  methods: {
    numberFormat,
    submit() {
      this.$emit('update:priceFrom', this.currentPriceFrom);
      this.$emit('update:priceTo', this.currentPriceTo);
      this.$emit('update:categoryId', this.currentCategoryId);
      this.$emit('update:colorId', this.currentColorId);
    },
    reset() {
      this.$emit('update:priceFrom', 0);
      this.$emit('update:priceTo', this.maxPrice);
      this.$emit('update:categoryId', 0);
      this.$emit('update:colorId', 0);
    },
    loadCategories() {
      return axios
        .get(`${API_BASE_URL}/api/productCategories`)
        .then((response) => {
          this.categoriesData = response.data;
        });
    },
    loadCategory(id) {
      return axios
        .get(`${API_BASE_URL}/api/productCategories/${id}`)
        .then((response) => {
          this.currentCategoryData = response.data;
        });
    },
    loadColors() {
      return axios.get(`${API_BASE_URL}/api/colors`)
        .then((response) => {
          this.colorsData = response.data;
        });
    },
  },
  created() {
    this.loadCategories();
    this.loadColors();
  },
};
</script>
