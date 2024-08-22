<template>
  <NuxtLink :to="telLinkWa" v-if="isClient" target="_blank" :aria-label="$t('waphone')">
    <IconsSocialsWa />
  </NuxtLink>
</template>
<script setup lang="ts">
const phoneNumberParts = ['+381', '64', '960', '6474'];
const telLinkWa = ref(`https://wa.me/${phoneNumberParts.join('')}`);
const isClient = ref(false);
onMounted(()=> {
  isClient.value = true;
})
</script>
