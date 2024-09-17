<template>
  <NuxtLink :to="igLink" v-if="isClient" target="_blank" :aria-label="$t('igprofile')">
    <IconsSocialsInstagram />
  </NuxtLink>
</template>
<script setup lang="ts">
const igLinkParts = [
  "htt",
  "ps://ww",
  "w.insta",
  "gram.co",
  "m/lets",
  "go",
  "pe",
  "t.rs",
];
const igLink = ref(`${igLinkParts.join("")}`);
const isClient = ref(false);
onMounted(()=> {
  isClient.value = true;
})
</script>
