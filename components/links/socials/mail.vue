<template>
    <NuxtLink :to="mailLink" v-if="isClient" target="_blank" :aria-label="$t('mail')">
      <IconsSocialsMail />
    </NuxtLink>
  </template>
  <script setup lang="ts">
  const mailParts = ["in", "fo", "@", "medical", "time", ".", "rs"];
  const mailLink = ref(`mailto:${mailParts.join("")}`);
  const isClient = ref(false);
onMounted(()=> {
  isClient.value = true;
})
  </script>
  