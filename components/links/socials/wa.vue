<template>
  <NuxtLink :to="page.waLink" v-if="isClient" target="_blank" :aria-label="$t('waphone')">
    <IconsSocialsWa />
  </NuxtLink>
</template>
<script setup lang="ts">
const page = usePagesStore();
const isClient = ref(false);
onMounted(()=> {
  isClient.value = true;
})
</script>
