<template>
  <NuxtLink :to="linkTo">{{ $t("Galerija") }}</NuxtLink>
</template>
<script lang="ts" setup>
const page = usePagesStore();
const linkTo = computed(() => {
  switch (page.currentLanguage) {
    case "en":
      return "/en/gallery";
    case "ru":
      return "/ru/gallery";
    case "de":
      return "/de/gallery";
    case "it":
      return "/it/gallery";
    default:
      return "/galerija";
  }
});
</script>
