<template>
  <NuxtLink
    :to="igLink"
    v-if="isClient"
    target="_blank"
    :aria-label="$t('igprofile')"
    ><IconsSocialsInstagram class="ig-icon" /><p>{{ igName }}</p><div class="dm-icon"><IconsDefaultDm/></div>
    <p class="press-here">{{ $t("Klikni ovde") }}</p>

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
  "m/kup",
  "anj",
  "epa",
  "sa",
];
const igNameParts = [
  "@",
  "ku",
  "pan",
  "je",
  "pa",
  "s",
  "a",
];
const igLink = ref(`${igLinkParts.join("")}`);
const igName = ref(`${igNameParts.join("")}`);
const isClient = ref(false);
onMounted(() => {
  isClient.value = true;
});
</script>