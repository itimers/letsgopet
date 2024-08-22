<template>
  <button
    @click.stop="page.toggleElementVisibility('infusions')"
    :class="{ active: page.states.find(el => el.btn === 'infusions' && el.activemenu) }"
  >
    {{ $t("Infuzije") }}
  </button>
</template>
<script lang="ts" setup>
const page = usePagesStore();
</script>
