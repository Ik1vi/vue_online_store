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
import Cookies from 'js-cookie';

export default {
  props: ['isCookieBlock'],

  methods: {
    ...mapMutations(['updateUserAccessKey']),
    ...mapActions('cart', {
      loadCart: 'loadCart',
    }),

    cookieAgree() {
      this.$emit('update:isCookieBlock', false);
      localStorage.removeItem('rejectData');
      Cookies.set('userAccessKey', this.$store.state.userAccessKey, { expires: 1 });
    },
    cookieReject() {
      this.$emit('update:isCookieBlock', false);
      localStorage.setItem('rejectData', new Date().toLocaleDateString());
      this.deleteAllCookies();
    },
    getAllCookies() {
      return Cookies.get();
    },
    deleteAllCookies() {
      const cookies = this.getAllCookies();
      // eslint-disable-next-line no-restricted-syntax
      for (const cookie in cookies) {
        if (cookies) {
          Cookies.remove(cookie);
        }
      }
    },
  },
};
</script>
