<template>
  <NuxtLink
  v-if="isClient"
    :to="page.mapLink"
    target="_blank"
    :aria-label="$t('igprofile')"
    ><IconsDefaultMaps class="ig-icon" /><p>{{ page.mapName }}</p>
    <p class="press-here">{{ $t("Klikni ovde") }}</p>

    <div class="touch-container">
      <IconsDefaultTouch class="touch" />
    </div>
    </NuxtLink>
</template>
<script lang="ts" setup>
const page = usePagesStore();
const isClient = ref(false);
onMounted(()=> {
  isClient.value = true;
})
</script>