<template>
  <NuxtLink
    :to="igLink"
    v-if="isClient"
    target="_blank"
    :aria-label="$t('igprofile')"
    ><IconsSocialsInstagram class="ig-icon" /><p>{{ $t("Zakazite ig") }}</p><div class="dm-icon"><IconsDefaultDm/></div>
    <p class="press-here">{{ $t("Klikni ovde") }}</p>

    <div class="touch-container left">
      <IconsDefaultTouch class="touch" />
    </div>
    </NuxtLink>
</template>
<script lang="ts" setup>
const page = usePagesStore();
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
const igLink = ref(`${igLinkParts.join("")}`);
const isClient = ref(false);
onMounted(() => {
  isClient.value = true;
});
</script>