<template>
  <button
    @click="updateUrlWithSectionId(page.sectionIds[4])"
    class="hover-link"
    :class="{active: page.currentSection === 5 && page.page === 1}"
  >
    {{ $t("Pet transport") }}
  </button>
</template>
<script lang="ts" setup>
const page = usePagesStore();
const i18n = useI18n();
const languageRoutes: Record<string, string> = {
  en: `/en/#${i18n.t("pet-transport")}`,
  ru: `/ru/#${i18n.t("pet-transport")}`,
  de: `/de/#${i18n.t("pet-transport")}`,
  it: `/it/#${i18n.t("pet-transport")}`,
  tr: `/tr/#${i18n.t("pet-transport")}`,
};

const linkTo = computed(() => languageRoutes[page.currentLanguage] || "/#pet-transport");
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
  if (window.location.hash !== `#${sectionId}` && observeOnScroll.value && page.page === 2) {
    addHashToLocation(sectionId);
  }
}, 200);
</script>
