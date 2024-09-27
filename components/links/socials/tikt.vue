<template>
    <NuxtLink :to="page.tiktokLink" v-if="isClient" target="_blank" :aria-label="$t('tiktok')">
      <IconsSocialsTikt />
    </NuxtLink>
  </template>
  <script setup lang="ts">
  const page = usePagesStore();
  const isClient = ref(false);
onMounted(()=> {
  isClient.value = true;
})
  </script>
  