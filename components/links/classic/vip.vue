<template>
  <button
    @click="
      updateUrlWithSectionId(page.sectionIds[2])
    "
    :class="{active: page.currentSection === 3 && page.page === 1}"
    class="hover-link"
  >
  {{ $t("Vip") }}
  </button>
</template>
<script lang="ts" setup>
const page = usePagesStore();
const i18n = useI18n();
const languageRoutes: Record<string, string> = {
  en: `/en/#${i18n.t("vip")}`,
  ru: `/ru/#${i18n.t("vip")}`,
  de: `/de/#${i18n.t("vip")}`,
  it: `/it/#${i18n.t("vip")}`,
  tr: `/tr/#${i18n.t("vip")}`,
};

const linkTo = computed(() => languageRoutes[page.currentLanguage] || "/#vip");

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
