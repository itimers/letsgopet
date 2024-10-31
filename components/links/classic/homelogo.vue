<template>
  <NuxtLink
    :to="`/${page.currentLanguage === 'sr' ? '' : page.currentLanguage + '/'}`"
    ><p>Let's Go Pet</p></NuxtLink>
</template>
<script lang="ts" setup>
const page = usePagesStore();
</script>
<style scoped>
a {
  p {
    color: white;
  }
}
</style>