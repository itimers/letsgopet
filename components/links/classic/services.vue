<template>
  <NuxtLink
    @click="
      updateUrlWithSectionId(page.sectionIds[1])
    "
    :disabled="page.isButtonDisabled(2)"
    :class="{active: page.currentSection === 2 && page.page === 1}"
    class="hover-link"
  >
  {{ $t("Usluge") }}
  </NuxtLink>
</template>
<script lang="ts" setup>
const page = usePagesStore();


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
        observeOnScroll.value && page.page === 1
      ) {
        addHashToLocation(sectionId);
      }
    },
    200
  );
</script>
