<template>
  <div
    class="card-carousel card"
  >
    <button class="carousel-arrow prev" @click="prevSlide">
      <IconsControlsNext />
    </button>
    <div class="carousel-wrapper">
      <div class="carousel-slides card">
        <transition-group name="slide" tag="div" class="carousel-slide-group">
          <div
            v-for="(slide, index) in visibleCarouselSlides"
            :key="slide.id"
            :class="['card', { active: index === currentSlide }]"
            @click="$emit('go-to-slide', index)"
          >
            <div class="card-wrapper">
              <div class="card-container">
                <div class="carousel-content">
                  <h6>{{ slide.carouselTitle }}</h6>
                  <div class="carousel-title">
                    <h6>{{ slide.carouselTitle }}</h6>
                  </div>
                  <ul>
                    <li
                      v-for="item in slide.carouselDescripiton.split('\n')"
                      :key="item"
                    >
                      {{ item }}
                    </li>
                  </ul>
                </div>

                <img class="image-card" :src="slide.image" alt="" />
                <IconsDefaultAnimatedarrows/>
                <div class="boxshadow"></div>
              </div>
              <div class="circle-container">
                <!-- <component :is="slide.cardImg" class="item2" alt="">
                </component> -->
              </div>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
    <button class="carousel-arrow next" @click="nextSlide">
      <IconsControlsNext />
    </button>
    <IconsDefaultTouch class="touch" />
  </div>
</template>

<script setup lang="ts">
const page = usePagesStore();
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
  slideTime: number;
  carouselTitle: string;
  carouselDescripiton: string;
  cardImg: string;
}

const props = defineProps<{
  slides: Slide[];
  currentSlide: number;
}>();

const emit = defineEmits(["change-slide", "go-to-slide"]);

const visibleCarouselCards = 11;


const visibleCarouselSlides = computed(() => {
  const lastIndex = props.slides.length - 1;
  const start = Math.max(props.currentSlide - 2, 0);
  const end = Math.min(
    props.currentSlide + visibleCarouselCards + 2,
    lastIndex
  );
  return props.slides.slice(start, end + 1);
});

const prevSlide = () => {
  emit("change-slide", "prev");
};

const nextSlide = () => {
  emit("change-slide", "next");
};
</script>

<style scoped lang="scss">
@import "/assets/scss/components/cards.scss";
@include carousel();
</style>
