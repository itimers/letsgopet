<template>
  <button
    @click.stop="updateUrlWithSectionId(page.sectionIds[5]), page.changeSection(6)"
    :disabled="page.isButtonDisabled(6)"
    class="hover-link"
    :class="{ active: page.currentSection === 6 && page.page === 1 }"
  >
    {{ $t("O nama") }}
  </button>
</template>

<script lang="ts" setup>
const page = usePagesStore();
const i18n = useI18n();
// Language routes with hash for the "O nama" section.
const languageRoutes: Record<string, string> = {
  en: `/en/#${i18n.t("o-nama")}`,
  ru: `/ru/#${i18n.t("o-nama")}`,
  de: `/de/#${i18n.t("o-nama")}`,
  it: `/it/#${i18n.t("o-nama")}`,
  fr: `/fr/#${i18n.t("o-nama")}`,
  tr: `/tr/#${i18n.t("o-nama")}`,
  es: `/es/#${i18n.t("o-nama")}`,
  cn: `/cn/#${i18n.t("o-nama")}`,
};

// Update linkTo to include the hash
const linkTo = computed(() => languageRoutes[page.currentLanguage] || "/#o-nama");

const observeOnScroll = computed(
  () => page.isScrolled && page.currentScroll >= 250 && page.page === 1
);

// Function to update the URL with section hash
function addHashToLocation(sectionId: string) {
  if (window.location.hash !== `#${sectionId}` && page.page === 2) {
    history.pushState(
      {},
      "",
      `${window.location.pathname}#${encodeURIComponent(sectionId)}`
    );
  }
}

// Debounce function to delay the URL update
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

// Update the URL with the section hash
const updateUrlWithSectionId = debounce((sectionId: string) => {
  if (window.location.hash !== `#${sectionId}` && observeOnScroll.value &&
      page.page === 2) {
    addHashToLocation(sectionId);
  }
}, 200);
</script>
