<template>
  <NuxtLink :to="page.ytLink" v-if="isClient" target="_blank" :aria-label="$t('ytprofile')">
    <IconsSocialsYoutube />
  </NuxtLink>
</template>
<script setup lang="ts">
const page = usePagesStore();
const isClient = ref(false);
onMounted(()=> {
  isClient.value = true;
})
</script>
