<script setup lang="ts">
const page = usePagesStore();
</script>

<template>
  <div
    class="loader"
    v-if="page.states.find((el) => el.btn === 'firstloader' && el.activebtn)"
    :style="{
      zIndex: page.states.find((el) => el.menu === 'firstloaderdiv')?.zIndex,
    }"
    :class="{
      active: page.states.find(
        (el) => el.menu === 'firstloaderdiv' && el.activemenu
      ),
    }"
  >
    <!-- <button @click.stop="page.toggleElementVisibility('firstloader')">
      Otvori pageloader
    </button> -->
    <article>
      <span class="spinner"></span>
    </article>
  </div>
</template>

<style lang="scss" scoped>
$loader-size: 40px;
$loader-border: 6px;
$loader-position: -100%;
$loader-position-active: 0px;
$loader-bg: clr(loaderbg);
$loader-border-bg: clr(spinnercolor);
$loader-border-bg2: clr(spinnercolor2);
$loader-border-bg3: clr(spinnercolor3);

$laoder: (
  "light": (
    loaderbg: $primary,
    spinnercolor: #d0f7ff,
    spinnercolor2: #68c3ff,
    spinnercolor3: #d0f7ff,
  ),

  "dark": (
    loaderbg: $secondary,
    spinnercolor: #d0f7ff,
    spinnercolor2: #68c3ff,
    spinnercolor3: #d0f7ff,
  ),
);

.loader {
  transform: all ease 0.3s;
  position: fixed;
  z-index: -1;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  @include fadeInUpBig(0.3s, ease, none);
  @include setColors($laoder);
}
article {
  width: $loader-size;
  height: $loader-size;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: $loader-position;
  transition: all ease 0.3s;
}
.spinner {
  position: relative;
  z-index: 9999;
  border: $loader-border solid $loader-border-bg;
  border-top: $loader-border solid $loader-border-bg2;
  border-right: $loader-border solid $loader-border-bg3;
  border-radius: 50%;
  width: $loader-size;
  height: $loader-size;
  animation: spin 1.3s linear infinite;
}
.loader.active {
  background: $loader-bg;
  opacity: 1;
  z-index: 9999;
}
.loader.active article {
  margin-bottom: $loader-position-active;
}
.page-loading {
  position: fixed;
  top: 0;
  left: 0;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
