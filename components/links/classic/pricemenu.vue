<template>
  <button
    @click="updateUrlWithSectionId(page.sectionIds[3])"
    :class="{ active: page.currentSection === 4 && page.page === 1 }"
    class="hover-link"
  >
    {{ $t("Cenovnik") }}
  </button>
</template>
<script lang="ts" setup>
const page = usePagesStore();
const i18n = useI18n();

const languageRoutes: Record<string, string> = {
  en: `/en/#${i18n.t("cenovnik")}`,
  ru: `/ru/#${i18n.t("cenovnik")}`,
  de: `/de/#${i18n.t("cenovnik")}`,
  it: `/it/#${i18n.t("cenovnik")}`,
  fr: `/fr/#${i18n.t("cenovnik")}`,
  tr: `/tr/#${i18n.t("cenovnik")}`,
  es: `/es/#${i18n.t("cenovnik")}`,
  cn: `/cn/#${i18n.t("cenovnik")}`,
};

const linkTo = computed(
  () => languageRoutes[page.currentLanguage] || `/#${i18n.t("cenovnik")}`,
);
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
  if (
    window.location.hash !== `#${sectionId}` &&
    observeOnScroll.value &&
    page.page === 2
  ) {
    addHashToLocation(sectionId);
  }
}, 200);
</script>
