<template>
  <NuxtLink
  v-if="isClient"
    :to="page.igLink"
    target="_blank"
    :aria-label="$t('igprofile')"
    ><IconsDefaultTelephone class="ig-icon" />
    <p>{{ $t("Pozovi nas") }}</p>
    <div class="dm-icon"><IconsDefaultDm /></div>
    <p class="press-here">{{ $t("Pročitaj više") }}</p>

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
