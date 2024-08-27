<template>
  <div class="theme-btn-inside" :class="currentTheme" :aria-label="$t('Choose theme')">
    <button @click.stop="setTheme('light')" class="light">
      <IconsControlsSun class="svg"/><span class="sr-only">{{ $t("Choose theme") }}</span>
    </button>
    <button @click.stop="setTheme('dark')" class="dark" :aria-label="$t('Choose theme')">
      <IconsControlsMoon class="svg"/><span class="sr-only">{{ $t("Choose theme") }}</span>
    </button>
  </div>
</template>
<script lang="ts" setup>
import { usePagesStore } from "@/stores/page";
const currentTheme = computed(() => page.currentTheme);
const page = usePagesStore();

const changeTheme = ref(false);

function setTheme(theme: any) {
page.setTheme(theme);
changeTheme.value = !changeTheme.value
}
</script>
<style lang="scss" scoped>

</style>
