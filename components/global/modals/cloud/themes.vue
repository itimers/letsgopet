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
$theme: (
  "light": (
    themefill: $themefill-svg-primary,
    themefillactive: $themefill-svg-primaryactive,
  ),

  "dark": (
    themefill: $themefill-svg-primary,
    themefillactive: $themefill-svg-primaryactive,
  ),
);

@mixin thememenu-btn {
  .theme-btn-inside {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    @include setColors($theme);
    &.maxtheme {
      margin-right: 0;
      button {
        svg {
          fill: clr(themefill);
        }
      }
    }
    &.light {
      button {
        transform: translate(-50%, -50%) scale(1);

        &.light {
          transform: translate(-50%, -20%) scale(0.7);
          opacity: 0;
          visibility: hidden;
        }

        &.dark {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
          visibility: visible;

          svg {
            height: 21px;
            width: 21px;
          }
        }
      }
    }

    &.dark {
      button {
        transform: translate(-50%, -50%) scale(1);

        &.dark {
          opacity: 0;
          visibility: hidden;
          transform: translate(-50%, -20%) scale(0.7);
        }

        &.light {
          opacity: 1;
          visibility: visible;
          transform: translate(-50%, -50%) scale(1);
        }
      }
    }

    button {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.6);
      opacity: 0;
      visibility: hidden;
      transition: all ease 0.2s;
      p {
        opacity: 0;
        width: 0;
        height: 0;
        visibility: hidden;
      }
      svg {
        display: flex;
        align-items: center;
        justify-content: center;
        fill: clr(themefillactive);
        width: 25px;
        height: 25px;
      }
    }
  }
}
@include thememenu-btn();
</style>
