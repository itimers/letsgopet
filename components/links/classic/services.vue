<template>
  <button v-if="page.page === 1"
    @click="
      updateUrlWithSectionId(page.sectionIds[1])
    "
    :class="{active: page.currentSection === 2 && page.page === 1}"
    class="hover-link"
  >
  {{ $t("Usluge") }}
  </button>
  <button v-else
    @click="
      updateUrlWithSectionId(page.sectionIds[1])
    "
    :class="{active: page.currentSection === 2 && page.page === 2}"
    class="hover-link"
  >
  {{ $t("Usluge") }}
  </button>
</template>
<script lang="ts" setup>
const page = usePagesStore();
const i18n = useI18n();
const languageRoutes: Record<string, string> = {
  en: `/en/#${i18n.t("usluge")}`,
  ru: `/ru/#${i18n.t("usluge")}`,
  de: `/de/#${i18n.t("usluge")}`,
  it: `/it/#${i18n.t("usluge")}`,
  tr: `/tr/#${i18n.t("usluge")}`,
};

const linkTo = computed(() => languageRoutes[page.currentLanguage] || "/#usluge");

const observeOnScroll = computed(
  () => page.isScrolled && page.currentScroll >= 250
);
function addHashToLocation(sectionId: string) {
  if (window.location.hash !== `#${sectionId}` && page.page === 1) {
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
