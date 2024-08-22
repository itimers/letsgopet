<template>
  <NuxtLink :to="linkTo">{{ $t("Kontakt") }}</NuxtLink>
</template>
<script lang="ts" setup>
const page = usePagesStore();
const linkTo = computed(() => {
  switch (page.currentLanguage) {
    case "en":
      return "/en/contact";
    case "ru":
      return "/ru/contact";
    case "de":
      return "/de/contact";
    case "it":
      return "/it/contact";
    default:
      return "/kontakt";
  }
});
</script>
