<template>
  <NuxtLink v-if="isClient"
    :to="page.tiktokLink"
    target="_blank"
    :aria-label="$t('tiktok')"
    ><IconsSocialsTikt class="ig-icon" /><p>{{ page.tiktokName }}</p><div class="dm-icon"><IconsDefaultDm/></div>
    <p class="press-here">{{ $t("Klikni ovde") }}</p>

    <div class="touch-container left">
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