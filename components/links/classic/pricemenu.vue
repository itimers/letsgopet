<template>
  <NuxtLink :to="linkTo">{{ $t("Cenovnik") }}</NuxtLink>
</template>
<script lang="ts" setup>
const page = usePagesStore();
const linkTo = computed(() => {
  switch (page.currentLanguage) {
    case "en":
      return "/en/pricemenu";
    case "ru":
      return "/ru/pricemenu";
    case "de":
      return "/de/pricemenu";
    case "it":
      return "/it/pricemenu";
    default:
      return "/cenovnik";
  }
});
</script>
