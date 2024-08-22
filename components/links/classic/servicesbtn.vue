<template>
  <button
    @click.stop="page.toggleElementVisibility('services')"
    :class="{ active: page.states.find(el => el.btn === 'services' && el.activemenu) }"
  >
    {{ $t("Usluge") }}
  </button>
</template>
<script lang="ts" setup>
const page = usePagesStore();
</script>
