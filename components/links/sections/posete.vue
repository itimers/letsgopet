<template>
  <NuxtLink v-if="page.page === 1" @click="page.changeSection(3)" :to="linkTo">{{ $t("Posete lekara") }}</NuxtLink>
  <NuxtLink v-else :to="linkTo" @click="page.changeSectionDelay(3)">{{ $t("Posete lekara") }}</NuxtLink>
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
