<template>
  <div class="no-content">
    <p>
      {{noContentText}}
    </p>
    <img
        class="dino-pic"
        src="img/svg/logo-dino.svg"
        alt="Динозавр Технозавррр"
        width="43"
        height="50"
    >
  </div>
</template>

<script>
export default {
  props: ['noContentText'],
};
</script>
