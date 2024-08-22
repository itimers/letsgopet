<template>
  <button
    @click.stop="page.toggleElementVisibility('surgery')"
    :class="{ active: page.states.find(el => el.btn === 'surgery' && el.activemenu) }"
  >
    {{ $t("Hirurgija") }}
  </button>
</template>
<script lang="ts" setup>
const page = usePagesStore();
</script>
