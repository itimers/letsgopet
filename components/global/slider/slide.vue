<script setup lang="ts">
import { usePagesStore } from "@/stores/page";
import { useSliderStore } from "@/stores/slider";
const page = usePagesStore();
const slider = useSliderStore();
const phoneNumberParts = ["+381", "64", "960", "6474"];
const telLink = ref(`tel:${phoneNumberParts.join("")}`);

interface Slide {
  id: number;
  titletext: string;
  title: string;
  title2: string;
  description: string;
  description2: string;
  description3: string;
  description4: string;
  image: string;
}
const props = defineProps<{
  slides: Slide[];
  currentSlide: number;
}>();

const emit = defineEmits(["change-slide", "go-to-slide"]);

const visibleCards = 5;

const visibleSlides = computed(() => {
  const lastIndex = props.slides.length - 1;
  const start = Math.max(props.currentSlide - 2, 0);
  const end = Math.min(props.currentSlide + visibleCards, lastIndex);
  return props.slides.slice(start, end + 2);
});


const prevSlide = () => {
  emit("change-slide", "prev");
};

const nextSlide = () => {
  emit("change-slide", "next");
};


</script>

<template>
  <div
    class="card-carousel slider"
    v-if="!page.isLoadingAnimation && page.isLoaded && !page.isLoading"
  >
    <button class="carousel-arrow prev" @click.stop="prevSlide">
      <IconsControlsNext />
      <span class="sr-only">{{ $t("Prethodni slajd") }}</span>
    </button>
    <div class="carousel-wrapper">
      <div class="carousel-slides">
        <transition-group tag="div" name="slide" class="carousel-slide-group">
          <!-- :style="{ maxHeight: slider.heightofSlider + 'px' }" -->
          <div
            v-for="(slide, index) in visibleSlides"
            :key="slide.id"
            :class="[
              'slide',
              { active: index === currentSlide },
              `slide-${slide.id}`,
            ]"
            @click="$emit('go-to-slide', index)"
            aria-hidden="true"
            role="presentation"
            tabindex="-1"
          >
            <div class="card-wrapper">
              <div class="card-container">
                <div class="carousel-content">
                  <div class="carousel-title">
                    <span>{{ slide.title }}</span>
                    <h5>{{ slide.title2 }}</h5>
                  </div>
                </div>

                <div class="carousel-show">
                  <div class="boxshadow"></div>
                  <div class="boxshadow2"></div>
                </div>
              </div>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
    <button class="carousel-arrow next" @click.stop="nextSlide">
      <IconsControlsNext />
      <span class="sr-only">{{ $t("Sledeci slajd") }}</span>
    </button>
  </div>
</template>

<style scoped lang="scss">
@import "/assets/scss/components/cards.scss";
@include carousel-slider();

</style>
