<template>
<BaseFormField :title="title" :error="error">
  <input
    class="form__input"
    type="text"
    name="name"
    :placeholder="placeholder"
    v-model="dataValue"
  >
</BaseFormField>
</template>

<script>
import BaseFormField from '@/components/BaseFormField.vue';

export default {
  components: { BaseFormField },
  props: ['title', 'error', 'placeholder', 'value'],
  computed: {
    dataValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
};
</script>
