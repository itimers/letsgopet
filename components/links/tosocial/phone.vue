<template>
    <NuxtLink
      :to="igLink"
      v-if="isClient"
      target="_blank"
      :aria-label="$t('igprofile')"
      ><IconsDefaultTelephone class="ig-icon" /><p>{{ $t("Pozovi nas") }}</p><div class="dm-icon"><IconsDefaultDm/></div>
      <p class="press-here">{{ $t("Pročitaj više") }}</p>
  
      <div class="touch-container left">
        <IconsDefaultTouch class="touch" />
      </div>
      </NuxtLink>
  </template>
  <script lang="ts" setup>
  const igLinkParts = [
    "htt",
    "ps://ww",
    "w.insta",
    "gram.co",
    "m/lets",
    "go",
    "pe",
    "t.rs",
  ];
  const igNameParts = [
    "@",
    "le",
    "ts",
    "go",
    "pe",
    "t",
    ".rs",
  ];
  const igLink = ref(`${igLinkParts.join("")}`);
  const igName = ref(`${igNameParts.join("")}`);
  const isClient = ref(false);
  onMounted(() => {
    isClient.value = true;
  });
  </script>