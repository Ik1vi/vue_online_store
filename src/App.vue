<template>
  <div>
    <CookieInfo />
    <AppHeader />

    <router-view />

    <AppFooter />
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';

import AppFooter from '@/components/AppFooter.vue';
import AppHeader from '@/components/AppHeader.vue';
import CookieInfo from '@/components/CookieInfo.vue';

export default {
  components: {
    AppFooter,
    AppHeader,
    CookieInfo,
  },
  created() {
    const userAccessKey = this.getCookie('userAccessKey');
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
    getCookie(name) {
      const cookie = {};
      document.cookie.split(';').forEach((el) => {
        const [k, v] = el.split('=');
        cookie[k.trim()] = v;
      });
      return cookie[name];
    },
  },
};
</script>
