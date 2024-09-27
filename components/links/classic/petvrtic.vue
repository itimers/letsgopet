<template>
  <NuxtLink v-if="isClient" :to="linkTo">{{ $t("Vrtić") }}</NuxtLink>
</template>
<script lang="ts" setup>
const page = usePagesStore();
const i18n = useI18n();
const languageRoutes: Record<string, string> = {
  en: "/en/pet-kindergarten",
  ru: "/ru/pet-kindergarten",
  de: "/de/pet-kindergarten",
  it: "/it/pet-kindergarten",
  tr: "/tr/pet-kindergarten",
};

const linkTo = computed(
  () => languageRoutes[page.currentLanguage] || "/vrtic-za-pse"
);
const isClient = ref(false);
onMounted(()=> {
  isClient.value = true;
})
</script>
