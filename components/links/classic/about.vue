<template>
  <NuxtLink
    :to="linkTo"
    @click="updateUrlWithSectionId(page.sectionIds[5])"
    :disabled="page.isButtonDisabled(6)"
    class="hover-link"
    :class="{ active: page.currentSection === 6 && page.page === 1}"
  >
    {{ $t("O nama") }}
  </NuxtLink>
</template>
<script lang="ts" setup>
const page = usePagesStore();
const languageRoutes: Record<string, string> = {
  en: "/en/",
  ru: "/ru/",
  de: "/de/",
  it: "/it/",
  fr: "/fr/",
  tr: "/tr/",
  es: "/es/",
  cn: "/cn/",
};

const linkTo = computed(() => languageRoutes[page.currentLanguage] || "/");

const observeOnScroll = computed(
  () => page.isScrolled && page.currentScroll >= 250 && page.page === 1
);
function addHashToLocation(sectionId: string) {
  if (window.location.hash !== `#${sectionId}`) {
    history.pushState(
      {},
      "",
      `${window.location.pathname}#${encodeURIComponent(sectionId)}`
    );
    //^console.log(`URL updated to section: ${sectionId}`);
  }
}
function debounce<T extends any[]>(func: (...args: T) => void, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return function (...args: T) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
const updateUrlWithSectionId = debounce((sectionId: string) => {
  if (window.location.hash !== `#${sectionId}` && observeOnScroll.value && page.page === 1) {
    addHashToLocation(sectionId);
  }
}, 200);
</script>
