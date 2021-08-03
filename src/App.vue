<template>
  <div>
    <CookieInfo
      v-show="isCookieBlock"
      :is-cookie-block.sync="isCookieBlock"
      :user-access-key="userAccessKey"
    />
    <AppHeader />

    <router-view />

    <AppFooter />
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';

import AppFooter from '@/components/AppFooter.vue';
import AppHeader from '@/components/AppHeader.vue';
import CookieInfo from '@/components/CookieInfo.vue';

export default {
  data() {
    return {
      isCookieBlock: true,
      userAccessKey: '',
    };
  },
  components: {
    AppFooter,
    AppHeader,
    CookieInfo,
  },
  created() {
    const accessKey = this.getCookie('userAccessKey');
    const rejectData = localStorage.getItem('rejectData');

    if (accessKey) {
      this.updateUserAccessKey(accessKey);
      this.isCookieBlock = false;
    } else if (rejectData) {
      this.getAccessKey();
      if (rejectData !== new Date().toLocaleDateString()) {
        this.isCookieBlock = true;
      } else if (rejectData === new Date().toLocaleDateString()) {
        this.isCookieBlock = false;
      }
    } else {
      this.getAccessKey();
    }
    this.loadCart();
  },
  methods: {
    ...mapMutations(['updateUserAccessKey']),
    ...mapActions('cart', {
      loadCart: 'loadCart',
      getAccessKey: 'getAccessKey',
    }),
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
