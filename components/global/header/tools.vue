<template>
  <div class="tools">
    <ModalsCloudLocales v-if="cookie.isCookieActive('langs')" />
   <!--  <ModalsCloudThemes v-if="isThemesOrPrefersActive" /> -->
    <!-- <ModalsCloudSettings /> -->
    <ModalsCloudBurger />
  </div>
</template>
<script lang="ts" setup>
const cookie = useCookieStore();
</script>
