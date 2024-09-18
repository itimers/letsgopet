<script setup lang="ts">
const phoneNumberParts = ["+381", "69", "1507", "212"];
const telLink = ref(`tel:${phoneNumberParts.join("")}`);
</script>

<template>
  <NuxtLink class="calluswrap" :to="telLink" :aria-label="$t('Pozovite nas')">
    <span class="sr-only">{{ $t("Pozovite nas") }}</span>
    <IconsSocialsPhone/>
  </NuxtLink>
</template>
<style lang="scss" scoped>
.calluswrap {
  position: fixed;
  z-index: 7000;
  right: 20px;
  bottom: 25px;
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all ease .4s;
  border-radius: 50%;
  box-shadow: 0px 0px 20px 0px rgba($color: #000000, $alpha: 0.3);

  &:hover {
    transform: scale(1.1) !important;
  }
  svg {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    fill: #4adcbf;
  }

  @include px(550) {
    right: 10px;
    bottom: 15px;
    width: 80px;
    height: 80px;
    &:hover {
      transform: scale(.9) !important;
    }
  }
}
</style>
