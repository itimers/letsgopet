<template>
  <NuxtLink :to="phone" v-if="isClient" target="_blank" :aria-label="$t('phone')">
    <IconsSocialsPhone />
  </NuxtLink>
</template>
<script setup lang="ts">
const phoneNumberParts = ["381", "64", "960", "6474"];
const phone = ref(`tel:${phoneNumberParts.join("")}`);
const isClient = ref(false);
onMounted(()=> {
  isClient.value = true;
})
</script>
