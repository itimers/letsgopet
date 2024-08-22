<template>
  <NuxtLink :to="linkTo">{{ $t("Digitalni rendgen") }}</NuxtLink>
</template>
<script lang="ts" setup>
const page = usePagesStore();
const linkTo = computed(() => {
  switch (page.currentLanguage) {
    case "en":
      return "/en/services";
    case "ru":
      return "/ru/services";
    case "de":
      return "/de/services";
    case "it":
      return "/it/services";
    default:
      return "/usluge";
  }
});
</script>
