<template>
  <button v-if="page.page === 1"
    @click="
      updateUrlWithSectionId(page.sectionIds[6]), page.changeSection(7)
    "
    class="hover-link"
    :class="{active: page.currentSection === 7 && page.page === 1}"
  >
  {{ $t("Kontakt") }}
  </button>
  <button v-else
    @click="
      updateUrlWithSectionId(page.sectionIds[3]),page.changeSection(4)
    "
    class="hover-link"
    :class="{active: page.currentSection === 4 && page.page === 2}"
  >
  {{ $t("Kontakt") }}
  </button>
</template>
<script lang="ts" setup>
const page = usePagesStore();
  const languageRoutes: Record<string, string> = {
    en: "/en/#contact",
    ru: "/ru/#contact",
    de: "/de/#contact",
    it: "/it/#contact",
    tr: "/tr/#contact",
  };
  
  const linkTo = computed(() => languageRoutes[page.currentLanguage] || "/#kontakt");

const observeOnScroll = computed(
  () => page.isScrolled && page.currentScroll >= 250 && page.page === 2
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
const updateUrlWithSectionId = debounce(
    (sectionId: string) => {
      if (
        window.location.hash !== `#${sectionId}` &&
        observeOnScroll.value && page.page === 2
      ) {
        addHashToLocation(sectionId);
      }
    },
    200
  );
</script>
