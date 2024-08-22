<script lang="ts" setup>
interface Props {
  slideId: number;
}

const props = defineProps<Props>();

</script>
<template>
  <div class="slide-page-links">
    <div class="slide-links" v-if="props.slideId === 1">
      <LinksClassicInfusions />
      <LinksClassicSurgery />
      <LinksClassicPatronage />
      <LinksClassicAccommodation />
      <LinksClassicAccommodation />
    </div>
    <div class="slide-links" v-if="props.slideId === 2">
      <LinksClassicInfusions />
    </div>
    <div class="slide-links" v-if="props.slideId === 3">
      <LinksClassicSurgery />
    </div>
    <div class="slide-links" v-if="props.slideId === 4">
      <LinksClassicPatronage />
    </div>
    <div class="slide-links" v-if="props.slideId === 5">
      <LinksClassicAccommodation />
    </div>
    <div class="slide-links" v-if="props.slideId === 6">
      <LinksClassicInfusions />
    </div>
    <div class="slide-links" v-if="props.slideId === 7">
      <LinksClassicInfusions />
    </div>
    <div class="slide-links" v-if="props.slideId === 8">
      <LinksClassicInfusions />
    </div>
    <div class="slide-links" v-if="props.slideId === 9">
      <LinksClassicInfusions />
    </div>
    <div class="slide-links" v-if="props.slideId === 10">
      <LinksClassicInfusions />
    </div>
  </div>
</template>
