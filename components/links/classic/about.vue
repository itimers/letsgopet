<template>
  <NuxtLink :to="linkTo">{{ $t("O nama") }}</NuxtLink>
</template>
<script lang="ts" setup>
const page = usePagesStore();
const linkTo = computed(() => {
  switch (page.currentLanguage) {
    case "en":
      return "/en/about";
    case "ru":
      return "/ru/about";
    case "de":
      return "/de/about";
    case "it":
      return "/it/about";
    default:
      return "/o-nama";
  }
});
</script>
