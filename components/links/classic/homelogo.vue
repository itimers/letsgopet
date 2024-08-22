<template>
  <NuxtLink
    :to="`/${page.currentLanguage === 'sr' ? '' : page.currentLanguage + '/'}`"
    >{{ $t("Let's Go Pet") }}</NuxtLink>
</template>
<script lang="ts" setup>
const page = usePagesStore();
</script>
