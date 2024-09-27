<template>
  <NuxtLink :to="page.igLink" v-if="isClient" target="_blank" :aria-label="$t('igprofile')">
    <IconsSocialsInstagram />
  </NuxtLink>
</template>
<script setup lang="ts">
const page = usePagesStore();
const isClient = ref(false);
onMounted(()=> {
  isClient.value = true;
})
</script>
