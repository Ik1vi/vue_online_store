<template>
  <li class="tabs__item">
    <a
      class="tabs__link"
      href="#"
      :class="{ 'tabs__link--current': currentContent === content}"
      @click.prevent="changeContent(content)"
    >
      {{tabTitle}}
    </a>
  </li>
</template>

<script>
export default {
  props: ['content', 'tabTitle', 'contentData'],
  data() {
    return {
      currentContent: 'content',
    };
  },
  methods: {
    changeContent(content) {
      this.$emit('update:contentData', content);
    },
  },
  watch: {
    contentData(value) {
      this.currentContent = value;
    },
  },
};
</script>
