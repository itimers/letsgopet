<template>
  <NuxtLink :to="linkTo">{{ $t("Bolnicki smestaj") }}</NuxtLink>
</template>
<script lang="ts" setup>
const page = usePagesStore();
const linkTo = computed(() => {
  switch (page.currentLanguage) {
    case "en":
      return "/en/accommodation";
    case "ru":
      return "/ru/accommodation";
    case "de":
      return "/de/accommodation";
    case "it":
      return "/it/accommodation";
    default:
      return "/bolnicki-smestaj";
  }
});
</script>
