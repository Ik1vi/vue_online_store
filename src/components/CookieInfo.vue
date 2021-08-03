<template>
  <div class="cookie">
    <p class="cookie__text">
      Мы используем cookie.
      Это позволяет нам анализировать взаимодействие посетителей с сайтом и делать его лучше.
      Продолжая пользоваться сайтом, вы соглашаетесь с использованием файлов cookie.
    </p>
    <ul class="cookie__button-list">
      <li class="cookie__button-item">
        <button
          class="cookie__button button button--second"
          @click="cookieAgree"
        >
          Подтвердить
        </button>
      </li>
      <li class="cookie__button-item">
        <button
          class="cookie__button cookie__button--reject button button--second"
          @click="cookieReject"
        >
          Отказаться
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';

export default {
  props: ['isCookieBlock', 'userAccessKey'],

  methods: {
    ...mapMutations(['updateUserAccessKey']),
    ...mapActions('cart', {
      loadCart: 'loadCart',
    }),

    cookieAgree() {
      this.$emit('update:isCookieBlock', false);
      localStorage.removeItem('rejectData');
      this.setCookie('userAccessKey', this.$store.state.userAccessKey);
    },
    cookieReject() {
      this.$emit('update:isCookieBlock', false);
      localStorage.setItem('rejectData', new Date().toLocaleDateString());
      this.getAllCookies();
    },
    getAllCookies() {
      const pairs = document.cookie.split(';');
      const cookies = {};
      for (let i = 0; i < pairs.length; i + 1) {
        const pair = pairs[i].trim().split('=');
        cookies[pair[0]] = pair[1];
      }
      return cookies;
    },
    deleteCookie(name) {
      document.cookie = `${name}=; Max-Age=0`;
    },
    deleteAllCookies() {
      const cookies = this.getAllCookies();
      // for (const [cookie, _] of Object.entries(object1)) {
      //   this.deleteCookie(cookie);
      // }
      console.log(cookies);
      // Object.keys(cookies).map((cookie) => this.deleteCookie(cookie));
    },
    setCookie(name, value, expires = (new Date(Date.now() + 86400e3)).toUTCString()) {
      document.cookie = `${name}=${value}; expires=${expires}`;
    },
  },
};
</script>
