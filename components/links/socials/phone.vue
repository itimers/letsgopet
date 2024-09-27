<template>
  <NuxtLink :to="page.phone" v-if="isClient" target="_blank" :aria-label="$t('phone')">
    <IconsSocialsPhone />
  </NuxtLink>
</template>
<script setup lang="ts">
const page = usePagesStore();
const isClient = ref(false);
onMounted(()=> {
  isClient.value = true;
})
</script>
