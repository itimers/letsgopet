<template>
  <NuxtLink :to="fbLink" v-if="isClient" target="_blank" :aria-label="$t('fbprofile')">
    <IconsSocialsFacebook />
  </NuxtLink>
</template>
<script setup lang="ts">
const fbLinkParts = [
  "htt",
  "ps://ww",
  "w.face",
  "book.co",
  "m/let",
  "s",
  "go",
  "pet.rs",
];
const fbLink = ref(`${fbLinkParts.join("")}`);
const isClient = ref(false);
onMounted(()=> {
  isClient.value = true;
})
</script>
