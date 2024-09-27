<template>
  <NuxtLink :to="page.mapLink" target="_blank" v-if="isClient" :aria-label="$t('googlemaps')">
    <IconsDefaultMaps />
  </NuxtLink>
</template>
<script setup lang="ts">
const page = usePagesStore();
const isClient = ref(false);
onMounted(()=> {
  isClient.value = true;
})
</script>
