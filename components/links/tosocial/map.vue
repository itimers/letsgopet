<template>
  <NuxtLink
    :to="igLink"
    v-if="isClient"
    target="_blank"
    :aria-label="$t('igprofile')"
    ><IconsDefaultMaps class="ig-icon" /><p>{{ igName }}</p>
    <p class="press-here">{{ $t("Klikni ovde") }}</p>

    <div class="touch-container">
      <IconsDefaultTouch class="touch" />
    </div>
    </NuxtLink>
</template>
<script lang="ts" setup>
const igLinkParts = [
  "htt",
  "ps://",
  "maps.",
  "app.goo",
  ".gl/mqJz",
  "CEvyc4Z",
  "Yez5f9?g_",
  "st=ac",
];
const igNameParts = [
  "Go",
  "o",
  "g",
  "le ",
  "Ma",
  "p",
  "s",
];
const igLink = ref(`${igLinkParts.join("")}`);
const igName = ref(`${igNameParts.join("")}`);
const isClient = ref(false);
onMounted(() => {
  isClient.value = true;
});
</script>