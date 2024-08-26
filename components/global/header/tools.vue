<template>
  <div class="tools">
    <ModalsCloudLocales v-if="cookie.isCookieActive('langs')" />
    <ModalsCloudThemes v-if="isThemesOrPrefersActive" />
    <ModalsCloudSettings />
    <ModalsCloudBurger />
  </div>
</template>
<script lang="ts" setup>
const cookie = useCookieStore();
const isThemesOrPrefersActive = computed(() => {
  return (
    cookie.isCookieActive("themes") ||
    (cookie.isCookieActive("themes") && cookie.isCookieActive("prefers"))
  );
});
</script>
<style lang="scss">
$tools: (
  "light": (
    toolsfill: $tools-svg-primary,
    toolsfillactive: $tools-svg-primaryactive,
  ),

  "dark": (
    toolsfill: $tools-svg-primary,
    toolsfillactive: $tools-svg-primaryactive,
  ),
);

.tools {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
}
.tools {
  @include setColors($tools);
}
.locales {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  &.sr .locale-btn {
    background-image: url("@/assets/img/lang/sr.svg");
  }
  &.ru .locale-btn {
    background-image: url("@/assets/img/lang/ru.svg");
  }
  &.en .locale-btn {
    background-image: url("@/assets/img/lang/en.svg");
  }
  &.de .locale-btn {
    background-image: url("@/assets/img/lang/de.svg");
  }
  &.it .locale-btn {
    background-image: url("@/assets/img/lang/it.svg");
  }
  &.tr .locale-btn {
    background-image: url("@/assets/img/lang/tr.svg");
  }
  &.fr .locale-btn {
    background-image: url("@/assets/img/lang/fr.svg");
  }
  &.cn .locale-btn {
    background-image: url("@/assets/img/lang/cn.svg");
  }
  &.es .locale-btn {
    background-image: url("@/assets/img/lang/es.svg");
  }
}
.locale-btn {
  background-repeat: no-repeat;
  background-position: center;
}
.locales-cloud-modal {
  @include cloud-modal(150px);
  background: red;
  padding: 10px;
}
.locales.active .locales-cloud-modal {
  @include active-cloud-modal($nav-height + 3px);
}



.themes {
  position: relative;
  width: 100%;
  height: calc(#{$base-width} - #{$decrement});
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.themes-cloud-modal {
  @include cloud-modal(150px);
  background: red;
  padding: 10px;
}

.themes.active .themes-cloud-modal {
  @include active-cloud-modal($nav-height + 3px);
}



.settings {
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.settings-cloud-modal {
  @include cloud-modal(150px);
  background: red;
  padding: 10px;
}
.settings.active .settings-cloud-modal {
  @include active-cloud-modal($nav-height + 3px);
}

.settings svg,
.locale-btn,
.themes svg {
  width: calc(20px + $tools-increment - $tools-decrement);
  height: calc(20px + $tools-increment - $tools-decrement);
  min-width: $tools-minw;
  max-width: $tools-maxw;
  min-height: $tools-minw;
  max-height: $tools-maxw;
  transition: all ease 0.3s;
}
.settings svg,
.themes svg {
  fill: clr(toolsfill);
}
.settings.active svg,
.themes.active svg {
  fill: clr(toolsfillactive);
}
</style>
