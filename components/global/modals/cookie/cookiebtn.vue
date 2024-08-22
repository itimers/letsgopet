<template>
  <button
    class="cookie-btn"
    @click.stop="page.toggleElementVisibility('cookie')"
    :class="{ active: page.states.find(el => el.btn === 'cookie' && el.activebtn) }"
  >
  Cookies
  </button>
</template>
<script lang="ts" setup>
const page = usePagesStore();
</script>