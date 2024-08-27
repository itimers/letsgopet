<template>
  <div class="tools">
    <ModalsCloudLocales v-if="cookie.isCookieActive('langs')" />
    <ModalsCloudThemes v-if="isThemesOrPrefersActive" />
    <ModalsCloudSettings />
    <ModalsCloudBurger />
  </div>
</template>
<script lang="ts" setup>
const cookie = useCookieStore();
const isThemesOrPrefersActive = computed(() => {
  return (
    cookie.isCookieActive("themes") ||
    (cookie.isCookieActive("themes") && cookie.isCookieActive("prefers"))
  );
});
</script>
<style lang="scss">

</style>
