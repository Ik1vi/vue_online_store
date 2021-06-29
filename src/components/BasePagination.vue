<template>
  <ul class="catalog__pagination pagination">
    <li class="pagination__item">
      <a
        class="pagination__link pagination__link--arrow"
        href="#"
        aria-label="Предыдущая страница"
        :class="{'pagination__link--disabled': page === 1}"
        :disabled="prevBtnIsDisabled"
        @click.prevent="previousPage()"
      >
        <svg width="8" height="14" fill="currentColor">
          <use xlink:href="#icon-arrow-left"></use>
        </svg>
      </a>
    </li>
    <li class="pagination__item" v-for="pageNum of pages" :key="pageNum">
      <a
        class="pagination__link"
        href="#"
        :class="{'pagination__link--current': pageNum === page}"
        @click.prevent="paginate(pageNum)"
      >
        {{pageNum}}
      </a>
    </li>
    <li class="pagination__item">
      <a
        class="pagination__link pagination__link--arrow"
        href="#"
        aria-label="Следующая страница"
        :class="{'pagination__link--disabled': page === pages}"
        :disabled="nextBtnIsDisabled"
        @click.prevent="nextPage()"
      >
        <svg width="8" height="14" fill="currentColor">
          <use xlink:href="#icon-arrow-right"></use>
        </svg>
      </a>
    </li>
  </ul>
</template>

<script>
export default {
  props: ['page', 'count', 'perPage'],
  model: {
    prop: 'page',
    event: 'paginate',
  },
  data() {
    return {
      prevBtnIsDisabled: false,
      nextBtnIsDisabled: false,
    };
  },
  computed: {
    pages() {
      return Math.ceil(this.count / this.perPage);
    },
  },
  methods: {
    paginate(page) {
      this.$emit('paginate', page);
    },
    nextPage() {
      if (this.page === this.pages) {
        this.nextBtnIsDisabled = true;
      } else {
        this.nextBtnIsDisabled = false;
        this.$emit('paginate', this.page + 1);
      }
    },
    previousPage() {
      if (this.page === 1) {
        this.prevBtnIsDisabled = true;
      } else {
        this.prevBtnIsDisabled = false;
        this.$emit('paginate', this.page - 1);
      }
    },
  },
};
</script>
