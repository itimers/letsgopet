<script lang="ts" setup>
const page = usePagesStore();
const updateZindex = () => {
  page.bringToFront(page.states.find((el) => el.menu === "themesdiv"));
};
</script>
<template>
  <div
    class="themes"
    :class="{
      active: page.states.find((el) => el.btn === 'themes' && el.activemenu),
    }"
  >
    <svg
      @click.stop="page.toggleElementVisibility('themes')"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 30.9 35"
    >
      <path
        d="M2.3.1c-.6.2-1.1.4-1.6 1-.7.7-.7 1-.7 4.1C0 8.3 0 8 .2 8.4c.3.7.7 1.1 1.4 1.4.5.3.7.3 1.6.4h.9v.8c0 1 .2 1.7.8 2.3.9 1 2.3 1.2 3.5.7 1.1-.5 1.7-1.5 1.8-3v-.9h2.2l.2.4c.3.5.8 1 1.4 1.3.3.2.6.2 1.3.2s1 0 1.3-.2c.6-.3 1.1-.8 1.4-1.3l.2-.4h6.2l.6-.3c.6-.3 1.1-.8 1.4-1.4.2-.3.2-.6.3-1.4V6h.6c.7 0 1.2.2 1.4.6.1.2.2.6.2 1.7s0 1.7-.4 2c-.2.1-2 .6-7.1 1.9-3.8.9-7.1 1.8-7.3 1.9-.6.3-1.1.8-1.4 1.5-.2.4-.2.7-.3 1.6v1.1h-.9c-1.4 0-2.4.5-2.7 1-.3.4-.4.9-.4.9V25.6c0 3.6 0 4.9.1 5.3.9 3.2 4.4 4.8 7.4 3.3.8-.4 1.8-1.4 2.2-2.2.6-1.1.6-1.4.6-6.6 0-4.7 0-4.7-.3-5.2-.6-1.2-1.7-1.9-3.3-1.9h-.6v-.8c0-.8.1-1.3.5-1.5.1 0 3.2-.9 7-1.8 8.1-2 8-2 8.7-3.4.3-.5.3-.5.3-2.6V6.1l-.3-.6c-.6-1.1-1.4-1.6-2.8-1.6H27v-.8c0-1.4-.6-2.5-1.8-3l-.6-.3H13.7C5.2 0 2.7 0 2.3.1zm1.8 5.1v3.1h-.6c-.7 0-1.2-.2-1.4-.6-.1-.3-.2-.7-.2-2.5 0-2.9 0-3.1 1.4-3.1h.8v3.1zm16.4-2.5c0 1-.3 1.3-1.3 1.4-1.1.1-2 .7-2.5 1.7-.2.4-.2.6-.3 2.1 0 1.8-.1 2-.6 2.2-.4.2-.6.2-1 0-.5-.2-.5-.5-.6-2.2 0-1.5 0-1.7-.3-2.1-.3-.6-.8-1.1-1.4-1.4-.7-.4-1.8-.4-2.6 0-.9.4-1.6 1.3-1.8 2.2 0 .3-.1 1.5-.1 2.8v2.3l-.3.3c-.5.5-1.3.4-1.6-.2-.1-.2-.2-.8-.2-5V2.1h14.6v.6zm3.7-.5c.1 0 .1.1.2.2.6.6.3 1.3.3 2.7 0 2.4 0 2.3-.2 2.6-.3.5-.5.6-3.4.6h-2.6v-.6c0-.7.2-1.1.5-1.3.1 0 .5-.1.8-.2 1.7-.2 2.7-1.4 2.8-3.2v-.9h1.2c.1 0 .2 0 .4.1zM11.7 6.3c.4.2.6.6.6 1.4v.6h-2v-.7c0-.8.1-1.1.6-1.3.4-.2.4-.2.8 0zM16 20.8c.4.3.5.6.4 5.3v4.3l-.3.6c-.4.8-.8 1.2-1.5 1.6-.5.3-.7.3-1.3.3-1.3 0-2.4-.8-2.8-1.9-.2-.5-.2-.7-.2-5.2v-4.6c0-.1.1-.2.1-.2.1-.2.3-.3.4-.3h2.6c2.3 0 2.5 0 2.7.2l-.1-.1z"
      />
    </svg>
    <div
      class="themes-cloud-modal"
      @click.stop="updateZindex"
      v-if="page.states.find((el) => el.btn === 'themes' && el.activebtn)"
      :style="{
        zIndex: page.states.find((el) => el.menu === 'themesdiv')?.zIndex,
      }"
      :class="{
        active: page.states.find(
          (el) => el.menu === 'themesdiv' && el.activemenu
        ),
      }"
    >
      <button
        v-for="theme in page.availableThemes"
        :key="theme"
        @click.stop="page.setTheme(theme), updateZindex()"
        :class="{ active: page.currentTheme === theme }"
      >
        <div>{{ theme }}</div>
        <span class="dot"></span>
      </button>
    </div>
  </div>
</template>
