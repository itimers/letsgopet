<template>
  <div
    class="slider"
    ref="sliderRef"
    aria-hidden="true"
    role="presentation"
    tabindex="-1"
  >
    <div class="slider-wrapper">
      <div class="slider-header">
        <div class="play-pause" :class="{ pc: !slider.isMobile }">
          <button
            class="pause"
            @click.stop="slider.pauseSlide"
            v-if="!slider.isPaused"
          >
            <IconsControlsPause />
            <span class="sr-only">{{ $t("Pauziraj") }}</span>
          </button>
          <button class="play" @click.stop="slider.unpause" v-else>
            <IconsControlsPlay />
            <span class="sr-only">{{ $t("Pusti") }}</span>
          </button>
        </div>

        <div class="slider-pagination" v-if="!slider.isMobile" @click.stop>
          <div class="slider-pagination-wrapper" ref="paginationDotsContainer" @click.stop>
            <div
              v-for="(dot, index) in slider.dots"
              :key="dot.id"
              :id="dot.id"
              @click.stop="slider.handleDotClick(dot.id)"
              class="dot"
              :class="{ active: dot.id === slider.currentActiveSlide }"
            ></div>
          </div>
        </div>
        <div class="card-container-dots" v-else @click.stop>
          <transition-group tag="div" name="dots" class="sliding-wrapper-dots" @click.stop>
            <div
              v-for="(dot, index) in slider.mdots"
              @click.stop="slider.goToSlideDots(index)"
              :key="dot.id"
              :class="[
                'm-dot',
                { active: dot.active },
                { hide: !dot.visibility && slider.visibleDots },
                `m-dot-${dot.id}`,
              ]"
            >
              <div v-if="dot.visibility"></div>
            </div>
          </transition-group>
        </div>
        <div
          class="slider-options"
          :class="{
            active: page.states.find(
              (el) => el.btn === 'slider' && el.activemenu
            ),
          }"
        >
          <IconsControlsSettings
            @click.stop="page.toggleElementVisibility('slider')"
          />
          <div
            class="slider-cloud-modal"
            @click.stop
            v-if="page.states.find((el) => el.btn === 'slider' && el.activebtn)"
            :style="{
              zIndex: page.states.find((el) => el.menu === 'sliderdiv')?.zIndex,
            }"
            :class="{
              active: page.states.find(
                (el) => el.menu === 'sliderdiv' && el.activemenu
              ),
            }"
          >
            <button
              v-if="slider.isSynced"
              @click.stop="
                page.toggleElementVisibility('syncslides'),
                  slider.syncSlidesCards()
              "
              :class="{
                active: page.states.find(
                  (el) => el.btn === 'syncslides' && el.activebtn
                ),
              }"
            >
              {{ $t("Desinhronizuj slajder") }}
            </button>
            <button
              v-else
              @click.stop="
                page.toggleElementVisibility('syncslides'),
                  slider.syncSlidesCards()
              "
              :class="{
                active: page.states.find(
                  (el) => el.btn === 'syncslides' && el.activebtn
                ),
              }"
            >
              {{ $t("Sinhronizuj slajder") }}
            </button>
            <button
              @click.stop="
                page.toggleElementVisibility('closedslides'),
                  slider.closeSlides()
              "
              :class="{
                active: page.states.find(
                  (el) => el.btn === 'closedslides' && el.activebtn
                ),
              }"
            >
              {{ $t("Zatvori slajder") }}
            </button>
            <button
              @click.stop="
                page.toggleElementVisibility('closedcards'), slider.closeCards()
              "
              :class="{
                active: page.states.find(
                  (el) => el.btn === 'closedcards' && el.activebtn
                ),
              }"
            >
              {{ $t("Zatvori kartice") }}
            </button>
          </div>
        </div>
      </div>

      <div class="slider-container">
        <div class="slider-progress" v-if="slider.isProgressBarUsing">
          <div
            class="progress-bar"
            ref="progressBar"
            :style="{
              width: slider.progressBarWidth,
              transition: `width ${slider.progressBarTime}s linear`,
              left: 0,
            }"
            v-if="!slider.isPaused"
          ></div>
        </div>
        <div class="clock-timer" v-else>
          <svg id="clock">
            <circle id="circle1" cx="30" cy="30" r="6" />
            <circle id="circle2" cx="30" cy="30" r="6" :style="circleStyle" />
            //*stroke-linecap="round"*//
          </svg>
        </div>
        <button class="prev-slide" @click.stop="slider.prevSlide()">
          Prev slide
        </button>
        <button class="next-slide" @click.stop="slider.nextSlide()">
          Next slide
        </button>
        <transition-group
          tag="div"
          name="slide"
          class="sliding-wrapper"
          :style="wrapperSlideStyle"
        >
          <div
            v-for="(slide, index) in slider.slides"
            @click.stop="slider.goToSlide(index)"
            :key="slide.id"
            :class="[
              'slide',
              { active: slide.active },
              { hide: !slide.visibility && slider.visibleSlides },
              `slide-${slide.id}`,
            ]"
            @touchstart.stop="slider.onTouchStart"
            @touchmove.stop="slider.onTouchMove"
            @touchend.stop="slider.onTouchEnd"
            @mousedown.stop="slider.onMouseDown"
            @mousemove.stop="slider.onMouseMove"
            @mouseup.stop="slider.onMouseUp"
            @mouseleave.stop="slider.onMouseUp"
          >
            <div v-if="slide.visibility" class="slide-design">
              <div class="slide-design-wrapper">
                <div class="slide-heading">
                  <h2>{{ slide.title }}</h2>
                  <h3>{{ slide.subtitle }}</h3>
                </div>
                <div class="slide-text">
                  <p
                    v-for="description in slide.description.split('\n')"
                    :key="description"
                  >
                    {{ description }}
                  </p>
                </div>

                <div class="slides-links-wrapper">
                  <p>{{ $t("Odaberi stranicu koja vas zanima") }}</p>
                  <SlidesSlidelinks :slideId="slide.id" />
                </div>
              </div>

              <div class="slide-circle"></div>
              <div class="slide-circle-2"></div>
              <div class="slide-shadow"></div>
            </div>
          </div>
        </transition-group>
      </div>
      <div class="card-container">
        <button
          class="prev-card"
          @click.stop="slider.prevSlide()"
          v-if="slider.isSynced"
          >
          Prev card
        </button>
        <button class="prev-card" @click.stop="slider.prevCard()" v-else>
          Prev card
        </button>
        <button
          class="next-card"
          @click.stop="slider.nextSlide()"
          v-if="slider.isSynced"
          >
          Next card
        </button>
        <button class="next-card" @click.stop="slider.nextCard()" v-else>
          Next card
        </button>
        <transition-group
          tag="div"
          name="card"
          class="sliding-wrapper-cards"
          :class="{ dragging: slider.isDraggingCards }"
          :style="wrapperStyle"
        >
          <div
            v-for="(card, index) in slider.cards"
            @click.stop="slider.goToSlide(index)"
            :key="card.id"
            :class="[
              'card',
              { active: card.active },
              { hide: !card.visibility && slider.visibleCards },
              `card-${card.id}`,
            ]"
            ref="cardWidths"
            :style="cardStyle"
            @mousedown.stop="slider.onMouseDownCard"
            @mousemove.stop="slider.onMouseMoveCard"
            @mouseup.stop="slider.onMouseUpCard"
            @mouseleave.stop="slider.onMouseUpCard"
            @touchstart.stop="slider.onTouchStartCard"
            @touchmove.stop="slider.onTouchMoveCard"
            @touchend.stop="slider.onTouchEndCard"
          >
            <!-- :style="{
              flex: `calc(100% / ${slider.maxCards})`,
              minWidth: `calc(100% / ${slider.maxCards})`,
            }" -->
            <!-- :style="{flex: calc(100%/slider.maxCards)}" -->
            <div v-if="card.visibility" class="card-design">
              <div class="card-design-wrapper">
                <div class="card-overflow">
                  <div class="card-heading">
                    <h2>{{ card.title }}</h2>
                    <h3>{{ card.subtitle }}</h3>
                  </div>
                  <div class="card-text">
                    <p
                      v-for="description in card.description.split('\n')"
                      :key="description"
                    >
                      {{ description }}
                    </p>
                  </div>
  
                  <div class="cards-links-wrapper">
                    <p>{{ $t("Idi na stranicu") }}</p>
                    <SlidesCardlinks :cardId="card.id" />
                  </div>
                </div>
              </div>

              <div class="card-circle"></div>
              <div class="card-circle-2"></div>
              <div class="card-shadow"></div>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const slider = useSlidesStore();
const cookie = useCookieStore();
const page = usePagesStore();
const paginationDotsContainer = ref<HTMLElement | null>(null);
const progressBar = ref<HTMLElement | null>(null);
const sliderRef = ref<HTMLElement | null>(null);
const cardWidths = ref<HTMLElement | null>(null);
const isDargging = ref(false);

const activeId = computed(() => {
  // Assuming you want to use active card id, change to `slider.activeSlideOn` if needed
  return slider.cards.find((card) => card.active)?.id || 0;
});

const circleStyle = computed(() => {
  const radius = 6;
  const circumference = 2 * Math.PI * radius;
  const offset = (
    (-slider.remainingTime / slider.currentSlideTime) *
    circumference
  ).toFixed(2);

  return {
    strokeDasharray: `${circumference} ${circumference}`,
    strokeDashoffset: circumference - parseFloat(offset),
  };
});
const wrapperSlideStyle = computed(() => {
  const dragTranslate = slider.dragOffset;
  const baseTranslate = -slider.activeSlideOn * 100;
  return {
    transform: `translateX(calc(${baseTranslate}% + ${dragTranslate}%))`,
  };
});
/* const wrapperSlideStyle = computed(() => ({
  transform: `translateX(${slider.closedSlider ? "-100%" : "-100%"})`,
})); */
const slideStyle = computed(() => ({
  flex: `calc(100% / ${slider.maxCards})`,
  minWidth: `calc(100% / ${slider.maxCards})`,
  transform: `scale(0.95)`,
}));

const wrapperStyle = computed(() => {
  const isSingleCardClosed =
    slider.closedCards && slider.minCards === 5 && slider.maxCards === 6;
  const isSingleCardOpen =
    !slider.closedCards && slider.minCards === 5 && slider.maxCards === 5;
  const isExactlyOneCardClosed =
    slider.closedCards && slider.minCards === 5 && slider.maxCards === 5;

  const dragTranslate = slider.dragOffsetCards; // Koristimo drag offset za kartice

  let baseTranslate: string;
  let maxCardsValue: number;

  if (isSingleCardClosed) {
    baseTranslate = slider.closedCards ? `-250%` : `-450%`;
    maxCardsValue = slider.maxCards - slider.minCards;
    //console.log("isSingleCardClosed", isSingleCardClosed);
  } else if (isSingleCardOpen) {
    baseTranslate = `-2500%`;
    maxCardsValue = slider.maxCards;
  } else if (isExactlyOneCardClosed) {
    baseTranslate = `-500%`;
    maxCardsValue = slider.maxCards - slider.minCards + 1;
  } else {
    baseTranslate = slider.closedCards ? `-400%` : `-450%`;
    maxCardsValue = slider.closedCards
      ? slider.maxCards - slider.minCards + 1
      : slider.maxCards - slider.minCards;
  }

  return {
    transform: `translateX(calc(${baseTranslate} / ${maxCardsValue} + ${dragTranslate}%))`,
    transition: slider.isDraggingCards ? "" : "transform 0.3s ease",
  };
});

const cardStyle = computed(() => {
  const isSingleCardClosed =
    slider.closedCards && slider.minCards === 5 && slider.maxCards === 6;
  const isSingleCardOpen =
    !slider.closedCards && slider.minCards === 5 && slider.maxCards === 5;
  const isExactlyOneCardClosed =
    slider.closedCards && slider.minCards === 5 && slider.maxCards === 5;

  //console.log("isSingleCardClosed", isSingleCardClosed);

  let maxCardsValue: number;

  if (isSingleCardClosed) {
    maxCardsValue = slider.closedCards
      ? slider.maxCards - 4
      : slider.maxCards - 4;
  } else if (isSingleCardOpen) {
    maxCardsValue = slider.closedCards
      ? slider.maxCards - 0
      : slider.maxCards - 4;
  } else if (isExactlyOneCardClosed) {
    maxCardsValue = slider.closedCards
      ? slider.maxCards - 4
      : slider.maxCards - 4;
  } else {
    maxCardsValue = slider.closedCards
      ? slider.maxCards - 3
      : slider.maxCards - 4;
  }
  return {
    flex: `calc(100% / ${maxCardsValue})`,
    minWidth: `calc(100% / ${maxCardsValue})`,
  };
});

onMounted(() => {
  slider.initializeCards();
  slider.initializeSlides();
  slider.updateMaxCardsSlides();
  /* if (!slider.closedCards && !slider.closedSlider) {
  } */
  slider.updateDots();
  slider.goToSlide(0);
  if (sliderRef.value) {
    if (page.page === 1) {
      page.setWidthOfCardWrapper();
      page.setWidthOfSliderWrapper();
      /* slider.pauseSlide(); */
      /* if(cardWidths.value) {
          slider.calculateWidthsCards();
      } */
    }
  }
  /* setTimeout(()=> {
      slider.isPaused = false;
      slider.firstProgress();
    },2000) */
  /* if(page.widthofHtml < 1366) {
    slider.closeCards();
    slider.closeSlides();
  } */
  /* slider.updateCards();
  slider.updateSlides();
  slider.updateCurrentSlide(); */

  slider.progressBar = progressBar.value;
  /* slider.firstProgress(); */
  window.addEventListener("resize", slider.updateMaxCardsSlides);
  window.addEventListener("resize", slider.calculateWidthsCards);

  window.addEventListener("mousemove", slider.onMouseMove);
  window.addEventListener("mouseup", slider.onMouseUp);
  if (cookie.isCookieActive("listeners") && slider.isMobile) {
    if (sliderRef.value) {
      sliderRef.value.addEventListener("mousedown", slider.onMouseDown);

      sliderRef.value.addEventListener("touchstart", slider.onTouchStart, {
        passive: true,
      });
      sliderRef.value.addEventListener("touchmove", slider.onTouchMove, {
        passive: true,
      });
      sliderRef.value.addEventListener("touchend", slider.onTouchEnd, {
        passive: true,
      });
    }
  }
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", slider.updateMaxCardsSlides);
  window.removeEventListener("touchend", slider.onTouchEnd);
  window.removeEventListener("touchmove", slider.onTouchMove);
  window.removeEventListener("touchstart", slider.onTouchStart);
  if (sliderRef.value) {
    sliderRef.value.removeEventListener("mousedown", slider.onMouseDown);
  }
  window.removeEventListener("mousemove", slider.onMouseMove);
  window.removeEventListener("mouseup", slider.onMouseUp);
});
</script>

<style scoped lang="scss">
$pag-increment: 32px;
$pag-decrement: 2.5vw;
$pag-minw: 24px;
$pag-maxw: 26px;

@mixin slide-design() {
}
@mixin slide-img() {
}
@mixin slide-human() {
}
@mixin slide-icon() {
}
@mixin slide-rectangle() {
}
@mixin slide-shadow() {
}
@mixin slide-circle() {
}
@mixin slide-heading() {
}
@mixin slide-sub-heading() {
}
@mixin slide-text() {
}

.slider {
  position: relative;
  width: 100%;
  margin-inline: auto;
  height: 100%;
  user-select: none;
  transition: all ease 0.3s;
  transition-delay: 0.3s;
}
//! CLOSED
.slider-header {
  @include flex-center();
}
.play-pause {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  margin-right: 10px;
  &.pc {
    margin-right: 10px;
  }
}
.play,
.pause {
  @include flex-center();
}
.slider-pagination-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.dot {
  width: calc(20px + $pag-increment - $pag-decrement);
  height: calc(20px + $pag-increment - $pag-decrement);
  min-width: $pag-minw - 5;
  max-width: $pag-maxw - 5;
  min-height: $pag-minw - 5;
  max-height: $pag-maxw - 5;
  border-radius: 50%;
  background: gray;
  display: grid;
  place-content: center;
  font-size: 70%;
}
.dot.active {
  background: black;
}

.card-container-dots {
  white-space: nowrap;
}
.sliding-wrapper-dots {
  position: relative;
  margin-inline: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
.m-dot {
  position: relative;
  width: 22px;
  max-width: 22px;
  height: 22px;
  background: #77b6ff;
  border-radius: 50%;
  transform: translateX(0%) scale(1);
  //*OVO JE ZA PREV
  /*transition: background ease 0.3s, transform ease 0.3s, flex ease 0.3s,
    width ease 0.3s, height ease 0.3s, visibility ease 0.3s, opacity ease 0.2s;
  transition-delay: 0.1s, 0s, 0s, 0s, 0s, 0s, 0s;*/

  &.hide {
    width: 0;
    min-width: 0;
    max-width: 0;
    min-height: 0;
    max-height: 0;
    height: 0;
    opacity: 0;
    visibility: hidden;
    transform: translateX(0%) scale(0);
    transition: all ease 0.3s;
  }
  &:nth-child(1) {
    transform: translateX(0%) scale(0);
    margin: 0px;
    transition: all ease .3s;
  }
  &:nth-child(2) {
    transform: translateX(0%) scale(0.75);
    margin-right: 2px;
    transition: all ease .3s;
  }
  &:nth-child(3) {
    transform: translateX(0%) scale(0.85);
    margin-right: 2px;
    transition: all ease .3s;
  }
  &:nth-child(4) {
    transform: translateX(0%) scale(1);
    margin: 0px 2px;
    transition: all ease .3s;
  }
  &:nth-child(5) {
    margin-left: 2px;
    transform: translateX(0%) scale(0.85);
    transition: all ease .3s;
  }
  &:nth-child(6) {
    margin-left: 2px;
    transform: translateX(0%) scale(0.75);
    transition: all ease .3s;
  }
  &:nth-child(n + 7)  {
    transform: translateX(0%) scale(0);
    margin: 0px;
    transition: all ease .3s;
  }
}
.m-dot.active {
  background: #238aff;
}
/*.m-dot.hide {
  opacity: 0;
  transition: all ease 0.3s;
}*/

.slider-container,
.card-container,
.card-container-dots {
  position: relative;
}
.sliding-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  /*transform: translateX(-200%);*/
  user-select: none;
}
.sliding-wrapper-cards {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  /*transform: translate(calc(-100% / 6));*/
  user-select: none;
}

.prev-card,
.next-card,
.prev-slide,
.next-slide {
  position: absolute;
  z-index: 1;
  top: 50%;
  height: 100%;
  background: rgba($color: #ffffff, $alpha: 0.2);
  transform: translateY(-50%);
}
.prev-card,
.prev-slide {
  left: 0;
}
.next-card,
.next-slide {
  right: 0;
}
.slide {
  position: relative;
  flex: 0 0 calc(100% / 1);
  min-width: calc(100% / 1);
  height: 300px;
  background: #77b6ff;
  border-radius: 3px;
  transform: translateX(0%) scale(0.991);
  //*OVO JE ZA PREV
  transition: background ease 0.3s, transform ease 0.3s, flex ease 0.3s,
    opacity ease 0.2s;
  transition-delay: 0.2s, 0s, 0s, 0s;
  user-select: none;
}
.slide.active {
  background: #238aff;
}
.slide.hide {
  opacity: 0;
  background: #77b6ff;
}

.card {
  position: relative;
  //flex: calc(100% / 6);
  //min-width: calc(100% / 6);
  border-radius: 7px;
  transform: translate(auto);
  padding: 5px;
  transform: translateX(0%);
  //*OVO JE ZA PREV
  transition: background ease 0.3s, transform ease 0.3s, flex ease 0.3s,
    opacity ease 0.2s;
  transition-delay: 0.2s, 0s, 0s, 0s;
  user-select: none;
  

}
.card-design-wrapper {
  border-radius: 5px;
  width: 100%;
  margin-inline: auto;
  transition: background ease 0.3s, transform ease 0.3s, flex ease 0.3s,
  opacity ease 0.2s;
  transition-delay: 0.2s, 0s, 0s, 0s;
  overflow: hidden;
  background: #77b6ff;
  height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.card-overflow {
  width: 98%;
  overflow-y: auto;
  height: 98%;
  scrollbar-gutter: stable;

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 33px;
    background: white;
  }
  &::-webkit-scrollbar-thumb:hover {
    opacity: .3;
  }
}
.card.active {
  //background: #81bcff;
  .card-design-wrapper {
    background: #238aff;
  }
}
.card.hide {
  opacity: 0;
  .card-design-wrapper {
    background: #77b6ff;
  }
}

.slider-options {
  position: relative;
  height: calc(#{$base-width} - #{$decrement});
  @include flex-custom(flex-end, center);
  margin-left: 10px;
}
.slider-cloud-modal {
  @include cloud-modal(150px);
  background: red;
  padding: 10px;
  white-space: nowrap;
  @include flex-full(flex-start, flex-start, column);
}
.slider-options svg {
  width: calc(20px + $tools-increment - $tools-decrement);
  height: calc(20px + $tools-increment - $tools-decrement);
  min-width: $tools-minw - 4;
  max-width: $tools-maxw - 4;
  min-height: $tools-minw - 4;
  max-height: $tools-maxw - 4;
  transition: all ease 0.3s;
}
.slider-options.active .slider-cloud-modal {
  @include active-cloud-modal($pag-minw + 4px);
}
.settings.active svg {
  fill: clr(toolsfillactive);
}

.slider-wrapper {
}
.play-btn {
}
.pause-btn {
}
.slider-pagination {
}
.slider-progress {
  position: absolute;
  z-index: 2;
  left: 0px;
  height: 5px;
  width: 100%;
  margin-inline: auto;
  transform: scale(0.99);
  overflow: hidden;

  .progress-bar {
    height: 100%;
    width: 0%;
    //box-shadow: 10px -11px 25px 6px rgba(255, 255, 255, 0.7);
    background-color: black;
    /* transition: all 1s linear; */
  }
}
.clock-timer {
  position: absolute;
  top: -5px;
  left: 0px;
  z-index: 5000;
  transform: rotate(-90deg);
  &.gap {
    left: -5px;
  }
  @include px(420) {
    left: -15px;
    top: -15px;
  }
  svg {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
    width: 60px;
    @include px(420) {
      transform: scale(0.6);
    }
    #circle1 {
      position: relative;
      fill: none;
      stroke: none;
      stroke-width: 11;
    }

    #circle2 {
      position: relative;
      fill: none;
      stroke: #ffe6af;
      stroke-width: 11;
    }
  }
}
.card-progress {
}
</style>
