<template>
  <NuxtLink :to="linkTo">{{ $t("Patronaza") }}</NuxtLink>
</template>
<script lang="ts" setup>
const page = usePagesStore();
const linkTo = computed(() => {
  switch (page.currentLanguage) {
    case "en":
      return "/en/patronage";
    case "ru":
      return "/ru/patronage";
    case "de":
      return "/de/patronage";
    case "it":
      return "/it/patronage";
    default:
      return "/kucne-posete-lekara";
  }
});
</script>
