<template>
  <NuxtLink :to="page.linkVib" v-if="isClient" target="_blank" :aria-label="$t('vibphone')">
    <IconsSocialsViber />
  </NuxtLink>
</template>
<script setup lang="ts">
const page = usePagesStore();
const isClient = ref(false);
onMounted(()=> {
  isClient.value = true;
})
</script>
