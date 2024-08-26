<template>
  <NuxtLink
    :to="igLink"
    v-if="isClient"
    target="_blank"
    :aria-label="$t('igprofile')"
    ><IconsSocialsInstagram /><p>{{ $t("Zakazite ig") }}</p></NuxtLink
  >
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
<style lang="scss" scoped>
a {
  gap: 10px;
  @include flex-center();
    svg {
        fill: white;
        height: 25px;
        width: 25px;
    }
    /*p {

    }*/
}
</style>