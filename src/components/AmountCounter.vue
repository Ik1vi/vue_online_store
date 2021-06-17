<template>
  <div>
    <button
      type="button"
      aria-label="Убрать один товар"
      @click="decrement"
    >
      <svg width="12" height="12" fill="currentColor">
        <use xlink:href="#icon-minus"></use>
      </svg>
    </button>

    <input type="text" readonly="readonly" v-model.number="currentproductAmount"/>

    <button
      type="button"
      aria-label="Добавить один товар"
      @click="increment"
    >
      <svg width="12" height="12" fill="currentColor">
        <use xlink:href="#icon-plus"></use>
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  props: ['productAmount'],
  emits: ['update:productAmount'],
  data() {
    return {
      currentproductAmount: this.productAmount,
    };
  },
  watch: {
    productAmount(value) {
      this.currentproductAmount = value;
    },
  },
  methods: {
    amount(productAmount) {
      this.$emit('update:productAmount', productAmount);
    },
    increment() {
      this.$emit('update:productAmount', this.productAmount + 1);
    },
    decrement() {
      if (this.productAmount === 1) {
        this.$emit('update:productAmount', 1);
      } else {
        this.$emit('update:productAmount', this.productAmount - 1);
      }
    },
  },
};
</script>
