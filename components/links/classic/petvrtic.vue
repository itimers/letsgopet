<template>
    <NuxtLink :to="linkTo">{{ $t("Vrtić") }}</NuxtLink>
  </template>
  <script lang="ts" setup>
  const page = usePagesStore();
  const languageRoutes: Record<string, string> = {
    en: "/en/pet-kindergarten",
    ru: "/ru/pet-kindergarten",
    de: "/de/pet-kindergarten",
    it: "/it/pet-kindergarten",
    fr: "/fr/pet-kindergarten",
    tr: "/tr/pet-kindergarten",
    es: "/es/pet-kindergarten",
    cn: "/cn/pet-kindergarten"
  };
  
  const linkTo = computed(() => languageRoutes[page.currentLanguage] || "/vrtic-za-pse");
  </script>
  