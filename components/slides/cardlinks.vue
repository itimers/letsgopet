<script lang="ts" setup>
interface Props {
  cardId: number;
}
const props = defineProps<Props>();
</script>

<template>
  <div class="cards-page-links">
    <div v-if="props.cardId === 1" class="cards-links">
      <LinksClassicServices />
    </div>
    <div v-if="props.cardId === 2" class="cards-links">
      <LinksClassicInfusions />
    </div>
    <div v-if="props.cardId === 3" class="cards-links">
      <LinksClassicSurgery />
    </div>
    <div v-if="props.cardId === 4" class="cards-links">
      <LinksClassicPatronage />
    </div>
    <div v-if="props.cardId === 5" class="cards-links">
      <LinksClassicAccommodation />
    </div>
    <div v-if="props.cardId >= 6 && props.cardId <= 10" class="cards-links">
      <LinksClassicInfusions />
    </div>
  </div>
</template>
