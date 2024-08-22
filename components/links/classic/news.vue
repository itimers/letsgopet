<template>
  <NuxtLink :to="linkTo">{{ $t("Vesti") }}</NuxtLink>
</template>
<script lang="ts" setup>
const page = usePagesStore();
const linkTo = computed(() => {
  switch (page.currentLanguage) {
    case "en":
      return "/en/news";
    case "ru":
      return "/ru/news";
    case "de":
      return "/de/news";
    case "it":
      return "/it/news";
    default:
      return "/vesti";
  }
});
</script>
