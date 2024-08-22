<template>
  <NuxtLink :to="telLinkVib" v-if="isClient" target="_blank" :aria-label="$t('vibphone')">
    <IconsSocialsViber />
  </NuxtLink>
</template>
<script setup lang="ts">
const phoneNumberParts = ["381", "64", "960", "6474"];
const telLinkVib = ref(`viber://add?number=${phoneNumberParts.join("")}`);
const isClient = ref(false);
onMounted(()=> {
  isClient.value = true;
})
</script>
