<template>
  <NuxtLink
    @click="
    page.changeSection(1)
    "
    class="hover-link"
  >
  {{ $t("Pocetna") }}
  </NuxtLink>
</template>
<script lang="ts" setup>
const page = usePagesStore();
</script>


<!-- <template>
  <NuxtLink
    @click="
      updateUrlWithSectionId(page.sectionIds[1])
    "
    class="hover-link"
  >
  {{ $t("Pocetna") }}
  </NuxtLink>
</template>
<script lang="ts" setup>
const page = usePagesStore();


const observeOnScroll = computed(
  () => page.isScrolled && page.currentScroll >= 250
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
        page.scrollTop();
        observeOnScroll.value
    },
    200
  );
</script>
 -->