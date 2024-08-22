<template>
  <NuxtLink
    :to="`/${page.currentLanguage === 'sr' ? '' : page.currentLanguage + '/'}`"
    >{{ $t("Pocetna") }}</NuxtLink>
</template>
<script lang="ts" setup>
const page = usePagesStore();
</script>
