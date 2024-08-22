<template>
  <button
    @click.stop="page.toggleElementVisibility('linkmenubtn')"
    :class="{
      active: page.states.find(
        (el) => el.menu === 'linkmenudiv' && el.activemenu
      ),
    }"
  >
    {{ $t("Specijaliteti") }}
  </button>
</template>
<script lang="ts" setup>
const page = usePagesStore();
</script>
