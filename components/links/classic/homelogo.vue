<template>
  <NuxtLink
    :to="`/${page.currentLanguage === 'sr' ? '' : page.currentLanguage + '/'}`"
    ><p class="sr-only">Let's Go Pet</p></NuxtLink>
</template>
<script lang="ts" setup>
const page = usePagesStore();
</script>
