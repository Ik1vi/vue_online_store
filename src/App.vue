<template>
  <div>
    <AppHeader />

    <router-view />

    <AppFooter />
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';

import AppFooter from '@/components/AppFooter.vue';
import AppHeader from '@/components/AppHeader.vue';

export default {
  components: {
    AppFooter,
    AppHeader,
  },
  created() {
    const userAccessKey = localStorage.getItem('userAccessKey');
    if (userAccessKey) {
      this.updateUserAccessKey(userAccessKey);
    }
    this.loadCart();
  },
  methods: {
    ...mapActions('cart', {
      loadCart: 'loadCart',
    }),
    ...mapMutations(['updateUserAccessKey']),
  },
};
</script>
