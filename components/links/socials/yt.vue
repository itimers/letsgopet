<template>
  <NuxtLink :to="ytLink" v-if="isClient" target="_blank" :aria-label="$t('ytprofile')">
    <IconsSocialsYoutube />
  </NuxtLink>
</template>
<script setup lang="ts">
const ytLinkParts = [
  "htt",
  "ps://ww",
  "w.youtu",
  "be.co",
  "m/@Medic",
  "alTime",
  "_r",
  "s",
];
const ytLink = ref(`href:${ytLinkParts.join("")}`);
const isClient = ref(false);
onMounted(()=> {
  isClient.value = true;
})
</script>
