<template>
  <div class="cards-container cards" id="slider" ref="slider" aria-hidden="true" role="presentation" tabindex="-1">
    <div class="progress-bar-container" v-if="isProgressBarUsing">
      <div
        class="progress-bar"
        ref="progressBar"
        :style="{ width: progressBarWidth }"
        v-if="!isStopped"
      ></div>
    </div>
    <div class="cards-wrapper">
      <div class="cards-component">
        <div
          class="pagination"
          ref="paginationDotsContainer"
          :class="{
            dark: 1 === parseInt(currentActiveSlide.replace('slide-', ''), 10),
          }"
        >
          <!-- <p>{{ (currentSlideTime / 1000).toFixed(1) }} &nbsp;</p> -->
          <!-- <p>{{ (remainingTime / 1000).toFixed(1) }} &nbsp;</p> -->

          <!-- <p>{{ (remainingTime / 1000).toFixed(1) }}</p> -->
          <div class="card-options">
            <button
              class="fullstop-slider"
              @click.stop="stopSlide"
              v-if="!isStopped"
            >
              <IconsControlsPause />
              <span class="sr-only">{{ $t("Pauziraj") }}</span>
            </button>
            <button class="play" @click.stop="unpause" v-else>
              <IconsControlsPlay />
              <span class="sr-only">{{ $t("Pusti") }}</span>
            </button>
          </div>
          <div
            v-for="(dot, index) in dots"
            :key="dot.id"
            :id="dot.id"
            @click.stop="handleDotClick(dot.id)"
            class="dots"
          >
            <span
              class="pagination-dot"
              :class="{ active: dot.id === currentActiveSlide }"
            ></span>
          </div>

          <div class="slider-menu" @click.stop>
            <button
              class="slider-modal-btn"
              @click.stop="sliderStore.toggleElementVisibility('slidermodalbtn')"
              :class="{ active: sliderStore.sliderOptions['slidermodalbtn'] }"
            >
              <IconsControlsSettings/>
            </button>
            <div
              @click.stop
              v-if="isSliderMenuOpen"
              class="slider-modal-menu"
              :class="{ active: sliderStore.sliderOptions['slidermodaldiv'] }"
            >
              <button
                @click.stop="sliderStore.toggleElementVisibility('carouselgap')"
                :class="{
                  gap: sliderStore.sliderOptions['carouselgap'],
                }"
              >
                Gap
              </button>
              <button
                @click.stop="sliderStore.toggleElementVisibility('carouselclosed')"
                :class="{
                  closed: sliderStore.sliderOptions['carouselclosed'],
                }"
              >
                Closed
              </button>
              <button
                @click.stop="sliderStore.toggleElementVisibility('slidergap')"
                :class="{
                  active: sliderStore.sliderOptions['slidergap'],
                }"
              >
                SGap
              </button>
              <button
                @click.stop="sliderStore.toggleElementVisibility('sliderclosed')"
                :class="{
                  active: sliderStore.sliderOptions['sliderclosed'],
                }"
              >
                SClosed
              </button>
            </div>
          </div>
          <!-- <button
            v-if="!sliderMaxStore.elementActiveClassAdded['maxopengallerydiv']"
            @click.stop="toggleMaxButtonState('maxopengallery')"
            :class="{
              active: sliderStore.sliderOptions['maxopengallery'],
            }"
            class="open-gallery"
          >
            Otvori galeriju
          </button> -->
        </div>
        <div class="cards">
          <div class="clock-timer" v-if="!isProgressBarUsing">
            <svg id="clock">
              <circle id="circle1" cx="30" cy="30" r="6" />
              <circle id="circle2" cx="30" cy="30" r="6" :style="circleStyle" />
              //*stroke-linecap="round"*//
            </svg>
          </div>
          <SliderSlide aria-hidden="true" role="presentation" tabindex="-1"
            ref="cardCarousel"
            :class="{
              progressBar: isProgressBarUsing,
              gap: sliderStore.sliderOptions['slidergapdiv'],
              closed: sliderStore.sliderOptions['slidercloseddiv'],
            }"
            :slides="slides"
            :current-slide="currentSlide"
            @go-to-slide="goToSlide"
            @change-slide="handleChangeSlide"
            @touchstart.passive="onTouchStart"
            @touchmove.passive="onTouchMove"
            @touchend.passive="onTouchEnd"
          ></SliderSlide>
        </div>
      </div>
      <div class="cards-component">
        <div class="cards">
          <SliderCard  aria-hidden="true" role="presentation" tabindex="-1"
            :class="{
              gap: sliderStore.sliderOptions['carouselgapdivgallery'],
              closed: sliderStore.sliderOptions['carouselcloseddivgallery'],
            }"
            ref="carouselSlides"
            :slides="slides"
            :current-slide="currentSlide"
            @go-to-slide="goToSlide"
            @change-slide="handleChangeSlide"
            @touchstart.passive="onTouchStart"
            @touchmove.passive="onTouchMove"
            @touchend.passive="onTouchEnd"
          ></SliderCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
/* import logo from "@/assets/img/sweets/logoslide.png"; */



const i18n = useI18n();
const page = usePagesStore();
const cookie = useCookieStore();

const sliderStore = useSliderStore();
const isStopped = ref(false);
const isPaused = ref(false);
const isAnimating = ref(false);
type IntervalID = number;
type IntervalID2 = number | NodeJS.Timeout;
const slideInterval = ref<IntervalID2 | null>(null);

const countdownTimer = ref<number | null>(null);
const progressBar = ref<HTMLElement | null>(null);
const isProgressBarUsing = ref(false);
const currentSlide = ref(2);
const moveCurrentSlideBy = ref(2);
const progressBarWidth = ref("0%");
const paginationDotsContainer = ref<HTMLElement | null>(null);
const slider = ref<HTMLElement | null>(null);
const carouselSlides = ref<HTMLElement | null>(null);

  const isSliderMenuOpen = computed(
  () => sliderStore.sliderOptions["slidermodalbtn"]
);

const resetActiveStates = () => {
  sliderStore.resetActiveElements();
};

interface SlideData {
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
const slides = ref<SlideData[]>([
  {
    id: 1,
    titletext: i18n.t("Slide1TitleText"),
    title: i18n.t("Slide1Title"),
    title2: i18n.t("Slide1Title2"),
    description: i18n.t("Slide1Description"),
    description2: i18n.t("Slide1Description2"),
    description3: i18n.t("Slide1Description3"),
    description4: i18n.t("Slide1Description4"),
    image: '',
    carouselDescripiton: "",
    cardImg: "",
    carouselTitle: "",
    slideTime: 15000,
  },
  {
    id: 2,
    titletext: i18n.t("Slide2TitleText"),
    title: i18n.t("Slide2Title"),
    title2: i18n.t("Slide2Title2"),
    description: i18n.t("Slide2Description"),
    description2: i18n.t("Slide2Description2"),
    description3: i18n.t("Slide2Description3"),
    description4: i18n.t("Slide2Description4"),
    image: '',
    carouselDescripiton: "",
    cardImg: "",
    carouselTitle: "",
    slideTime: 15000,
  },
  {
    id: 3,
    titletext: i18n.t("Slide3TitleText"),
    title: i18n.t("Slide3Title"),
    title2: i18n.t("Slide3Title2"),
    description: i18n.t("Slide3Description"),
    description2: i18n.t("Slide3Description2"),
    description3: i18n.t("Slide3Description3"),
    description4: i18n.t("Slide3Description4"),
    image: '',
    carouselDescripiton: "",
    cardImg: "",
    carouselTitle: "",
    slideTime: 16000,
  },
  {
    id: 4,
    titletext: i18n.t("Slide4TitleText"),
    title: i18n.t("Slide4Title"),
    title2: i18n.t("Slide4Title2"),
    description: i18n.t("Slide4Description"),
    description2: i18n.t("Slide4Description2"),
    description3: i18n.t("Slide4Description3"),
    description4: i18n.t("Slide4Description4"),
    image: '',
    carouselDescripiton: "",
    cardImg: "",
    carouselTitle: "",
    slideTime: 15000,
  },
  {
    id: 5,
    titletext: i18n.t("Slide5TitleText"),
    title: i18n.t("Slide5Title"),
    title2: i18n.t("Slide5Title2"),
    description: i18n.t("Slide5Description"),
    description2: i18n.t("Slide5Description2"),
    description3: i18n.t("Slide5Description3"),
    description4: i18n.t("Slide5Description4"),
    image: '',
    carouselDescripiton: "",
    cardImg: "",
    carouselTitle: "",
    slideTime: 16000,
  },
  {
    id: 6,
    titletext: i18n.t("Slide6TitleText"),
    title: i18n.t("Slide6Title"),
    title2: i18n.t("Slide6Title2"),
    description: i18n.t("Slide6Description"),
    description2: i18n.t("Slide6Description2"),
    description3: i18n.t("Slide6Description3"),
    description4: i18n.t("Slide6Description4"),
    image: '',
    carouselDescripiton: "",
    cardImg: "",
    carouselTitle: "",
    slideTime: 15000,
  },
  {
    id: 7,
    titletext: i18n.t("Slide7TitleText"),
    title: i18n.t("Slide7Title"),
    title2: i18n.t("Slide7Title2"),
    description: i18n.t("Slide7Description"),
    description2: i18n.t("Slide7Description2"),
    description3: i18n.t("Slide7Description3"),
    description4: i18n.t("Slide7Description4"),
    image: '',
    carouselDescripiton: "",
    cardImg: "",
    carouselTitle: "",
    slideTime: 16000,
  },
  {
    id: 8,
    titletext: i18n.t("Slide8TitleText"),
    title: i18n.t("Slide8Title"),
    title2: i18n.t("Slide8Title2"),
    description: i18n.t("Slide8Description"),
    description2: i18n.t("Slide8Description2"),
    description3: i18n.t("Slide8Description3"),
    description4: i18n.t("Slide8Description4"),
    image: '',
    carouselDescripiton: "",
    cardImg: "",
    carouselTitle: "",
    slideTime: 16000,
  },
  {
    id: 9,
    titletext: i18n.t("Slide9TitleText"),
    title: i18n.t("Slide9Title"),
    title2: i18n.t("Slide9Title2"),
    description: i18n.t("Slide9Description"),
    description2: i18n.t("Slide9Description2"),
    description3: i18n.t("Slide9Description3"),
    description4: i18n.t("Slide9Description4"),
    image: '',
    carouselDescripiton: "",
    cardImg: "",
    carouselTitle: "",
    slideTime: 15000,
  },
]);

const dots = ref();
dots.value = slides.value.map((slide: { id: any }, index: any) => ({
  id: `slide-${slide.id}`,
  stopped: false,
}));

/* console.log(currentSlideTime); */
const currentActiveSlide = computed(() => {
  const activeSlide = slides.value[currentSlide.value];
  //console.log(activeSlide.id);
  return activeSlide ? `slide-${activeSlide.id}` : "";
});

const currentSlideTime = computed(() => {
  return slides.value[currentSlide.value]?.slideTime ?? 5000;
});
const remainingTime = ref<number>(currentSlideTime.value);
const circleStyle = computed(() => {
  const radius = 6;
  const circumference = 2 * Math.PI * radius;
  const offset = (
    (-remainingTime.value / currentSlideTime.value) *
    circumference
  ).toFixed(2);

  return {
    strokeDasharray: `${circumference} ${circumference}`,
    strokeDashoffset: circumference - parseFloat(offset),
  };
});

const resetCountdown = () => {
  if (isStopped.value) {
    return;
  }
  if (countdownTimer.value !== null) {
    clearInterval(countdownTimer.value);
  }
  remainingTime.value = currentSlideTime.value;
  /* slider.remainingTime = currentSlideTime.value; */
  if (import.meta.client && typeof window !== 'undefined') {
    countdownTimer.value = setInterval(() => {
      remainingTime.value -= 100;
      if (remainingTime.value <= 0) {
        clearInterval(countdownTimer.value as IntervalID);
        nextSlide();
      }
    }, 100) as unknown as number;
  }
};
const slideCount = ref(0);
const updateInterval = () => {
  if (!isStopped.value && !isAnimating.value) {
    resetProgress();

    if (slideInterval.value !== null) {
      clearInterval(slideInterval.value);
    }
    if (import.meta.client && typeof window !== 'undefined') {
      slideInterval.value = setInterval(() => {
        nextSlide();
      }, currentSlideTime.value as unknown as number);
    }
  }
};

const nextSlide = () => {
  if (!isAnimating.value && !isPaused.value && !isStopped.value) {
     /* console.log("next - IF"); */
    isAnimating.value = true;
    clearInterval(slideInterval.value as IntervalID);
    slideInterval.value = null;

    const firstSlide = slides.value.shift();
    if (firstSlide) {
      slides.value.push(firstSlide);
    }
    resetCountdown();

    slideCount.value++;

    updatePagination();

    updateInterval();

    requestAnimationFrame(() => {
      isAnimating.value = false;
      if (isProgressBarUsing.value) {
        startProgress();
      }
      startSlide();
      updateDarkClass();
      sliderStore.updateSliderHeight();
    });
  } else {
    if (!isAnimating.value) {
      isAnimating.value = true;
      resetCountdown();

      clearInterval(slideInterval.value as IntervalID);
      slideInterval.value = null;

      const firstSlide = slides.value.shift();
      if (firstSlide) {
        slides.value.push(firstSlide);
      }

      updatePagination();
      updateInterval();

      requestAnimationFrame(() => {
        isAnimating.value = false;
        updateDarkClass();
        sliderStore.updateSliderHeight();
      });

    }
  }
};


const prevSlide = () => {
  if (!isAnimating.value && !isPaused.value) {
    //^console.log("prev - IF");
    isAnimating.value = true;
    clearInterval(slideInterval.value as unknown as number);
    slideInterval.value = null;
    resetCountdown();

    const lastSlide = slides.value.pop();
    if (lastSlide) {
      slides.value.unshift(lastSlide);
    }

    updateInterval();
    updatePagination();

    requestAnimationFrame(() => {
      isAnimating.value = false;
      updateDarkClass();
      startSlide();
      sliderStore.updateSliderHeight();
    });
  } else {
    //^console.log("prev - ELSE");
    isAnimating.value = true;
    resetCountdown();

    const lastSlide = slides.value.pop();
    if (lastSlide) {
      slides.value.unshift(lastSlide);
    }
    clearInterval(slideInterval.value as unknown as number);
    slideInterval.value = null;

    updateInterval();
    updatePagination();
    requestAnimationFrame(() => {
      isAnimating.value = false;

      //^console.log(slides.value[currentSlide.value]);
      updateDarkClass();
      startSlide();
      sliderStore.updateSliderHeight();
    });
  }
};
const startSlide = () => {
  if (slideInterval.value === null && !isStopped.value && !isPaused.value) {
    updateInterval();
    resetCountdown();
  }
};
const goToSlide = (index: number) => {
  if (index === currentSlide.value || isAnimating.value) {
    return;
  }
  if (!isAnimating.value && isStopped.value && isPaused.value) {
    //^console.log("STOP IF");
    updateInterval();
    isAnimating.value = true;
    const direction = index < currentSlide.value ? -1 : 1;
    const numSlides = Math.abs(currentSlide.value - index);
    currentSlide.value = moveCurrentSlideBy.value;
    for (let i = 0; i < numSlides; i++) {
      if (direction === 1) {
        const firstSlide = slides.value.shift();
        if (firstSlide) {
          slides.value.push(firstSlide);
        }
      } else {
        const lastSlide = slides.value.pop();
        if (lastSlide) {
          slides.value.unshift(lastSlide);
        }
      }
    }
    isAnimating.value = false;

    updatePagination();
    requestAnimationFrame(() => {
      updateDarkClass();
      startSlide();
      sliderStore.updateSliderHeight();
    });
  } else if (!isAnimating.value) {
    //^console.log("STOP ELSE IF");
    isAnimating.value = true;
    const direction = index < currentSlide.value ? -1 : 1;
    const numSlides = Math.abs(currentSlide.value - index);
    currentSlide.value = moveCurrentSlideBy.value;
    for (let i = 0; i < numSlides; i++) {
      if (direction === 1) {
        const firstSlide = slides.value.shift();
        if (firstSlide) {
          slides.value.push(firstSlide);
        }
      } else {
        const lastSlide = slides.value.pop();
        if (lastSlide) {
          slides.value.unshift(lastSlide);
        }
      }
    }

    updatePagination();
    requestAnimationFrame(() => {
      updateInterval();

      updateDarkClass();
      startSlide();
      resetCountdown();
      sliderStore.updateSliderHeight();
    });
    isAnimating.value = false;
  }
};
const handleDotClick = (dotId: string) => {
  const dot = dots.value.find((dot: { id: string }) => dot.id === dotId);
  if (dot) {
    const slideIndex = slides.value.findIndex(
      (slide: { id: { toString: () => string } }) =>
        slide.id.toString() === dotId.replace("slide-", "")
    );

    if (slideIndex !== -1) {
      /* stopSlide(); */
      goToSlide(slideIndex);
      /*  startProgress();
      resetCountdown();
      setTimeout(()=> {
        unpause();
      },currentSlideTime.value) */
    }
  }

  dots.value = dots.value.map((d: { id: string; stopped: any }) => ({
    ...d,
    stopped: d.id === dotId ? false : d.stopped,
  }));
  console.log(dot);
  console.log(currentActiveSlide.value);
};
const updatePagination = () => {
  if (isAnimating.value) {
    return;
  }

  if (paginationDotsContainer.value) {
    const dotElements = Array.from(
      paginationDotsContainer.value.getElementsByClassName("pagination-dot")
    );

    dotElements.forEach((dot) => {
      dot.classList.remove("active");
    });

    const activeDotIndex = dots.value.findIndex(
      (dot: { id: string }) => dot.id === currentActiveSlide.value
    );
    if (activeDotIndex !== -1) {
      dotElements[activeDotIndex]?.classList.add("active");
    }

    const activeSlideNumber = parseInt(
      currentActiveSlide.value.replace("slide-", ""),
      10
    );

    if (
      activeSlideNumber === 1 ||
      activeSlideNumber === 2 ||
      activeSlideNumber === 4
    ) {
      paginationDotsContainer.value.classList.add("dark");
    } else {
      paginationDotsContainer.value.classList.remove("dark");
    }
  }
};
const updateDarkClass = () => {
  const activeSlideNumber = parseInt(
    currentActiveSlide.value.replace("slide-", ""),
    10
  );

  if (paginationDotsContainer.value) {
    if (
      activeSlideNumber === 1 ||
      activeSlideNumber === 2 ||
      activeSlideNumber === 4
    ) {
      paginationDotsContainer.value.classList.add("dark");
    } else {
      paginationDotsContainer.value.classList.remove("dark");
    }
  }
};
const stopSlide = () => {
  if (countdownTimer.value !== null) {
    clearInterval(countdownTimer.value);
    countdownTimer.value = null;
  }
  if (slideInterval.value !== null) {
    clearInterval(slideInterval.value);
    slideInterval.value = null;
  }
  remainingTime.value = 0;
  isStopped.value = true;
  clearInterval(slideInterval.value as unknown as number);
  slideInterval.value = null;
  isStopped.value = true;
  isPaused.value = true;
  resetProgress();
};
const unpause = () => {
  isStopped.value = false;
  isPaused.value = false;
  nextSlide();
};
const startProgress = () => {
  if (progressBar.value && isProgressBarUsing.value) {
    sliderStore.setRemainingTime(currentSlideTime.value);
    const seconds = (currentSlideTime.value / 1000 / 2).toFixed(2);
    progressBar.value.style.transition = `width ${seconds}s linear`;
    progressBar.value.style.width = "100%";
    progressBarWidth.value = "100%";
  }
};
const resetProgress = () => {
  //^console.log("RESET PROGRESS");
  if (isStopped.value === false) {
    if (progressBar.value && isProgressBarUsing.value) {
      progressBar.value.style.transition = "none";
      progressBarWidth.value = "0%";
      progressBar.value.style.width = "0%";
      progressBar.value.style.left = "0";
    }
  }
};
const initializeProgress = () => {
  if (isStopped.value === false && isProgressBarUsing.value) {
    if (progressBar.value) {
      progressBar.value.style.transition = "none";
      /* progressBar.value.style.width = "0%"; */
      progressBar.value.style.left = "0";
      /* setTimeout(() => {
        startProgress(currentSlideTime);
      }, 20); */
    }
  }
};
const handleChangeSlide = (direction: string) => {
  if (direction === "next") {
    nextSlide();
  } else if (direction === "prev") {
    prevSlide();
  }
};
const touchStartX = ref<null | number>(null);
const touchEndX = ref<null | number>(null);

const onTouchStart = (event: TouchEvent) => {
  touchStartX.value = event.touches[0].clientX;
};

const onTouchMove = (event: TouchEvent) => {
  if (touchStartX.value === null) {
    return;
  }
  touchEndX.value = event.touches[0].clientX;
};

const onTouchEnd = () => {
  if (touchStartX.value === null || touchEndX.value === null) {
    return;
  }

  const touchDiffX = touchStartX.value - touchEndX.value;

  if (touchDiffX > 50) {
    nextSlide();
  } else if (touchDiffX < -50) {
    prevSlide();
  }

  // Reset touch positions
  touchStartX.value = null;
  touchEndX.value = null;
};

onMounted(() => {
  page.isSlider = true;
  sliderStore.isGallery = false;
  const initialSlideTime =
    slides.value[currentSlide.value - moveCurrentSlideBy.value]?.slideTime ??
    5000;
  if (import.meta.client && typeof window !== 'undefined') {
    setInterval(() => {
      if (remainingTime.value > 0) {
        remainingTime.value -= 100;
      }
    }, 100);
    setTimeout(async () => {
      const cards = document.querySelector(".cards");
      if (cards) {
        setTimeout(() => {
          /* sliderStore.updateSliderHeight(); */
          goToSlide(0);
          updateDarkClass();
          /* stopSlide(); */
          /* initializeProgress();
          startSlide(currentSlideTime); */
          sliderStore.refreshFromLocalStorage();
          sliderStore.initializeActiveElements();
        }, 500);
      }
    }, page.loadingTime + 220);
  }

  /* startSlide(currentSlideTime); */
  //initializeProgress(initialSlideTime);
  /* Object.keys(sliderStore.sliderOptions).forEach(key => {
    const isActive = sliderStore.sliderOptions[key];
    sliderStore.updateActiveElement(key, isActive);
  }); */

  if (cookie.isCookieActive('listeners')) {
    if (slider.value) {
      slider.value.addEventListener("touchstart", onTouchStart, {
        passive: true,
      });
      slider.value.addEventListener("touchmove", onTouchMove, {
        passive: true,
      });
      slider.value.addEventListener("touchend", onTouchEnd, { passive: true });
    }
  }
  currentSlide.value = slides.value.findIndex(
    (slide: { id: { toString: () => any } }) =>
      slide.id.toString() ===
      slides.value[moveCurrentSlideBy.value].id.toString()
  );
  if (cookie.isCookieActive('listeners')) {
    document.addEventListener("click", resetActiveStates, { passive: true });
    return () => {
      document.removeEventListener("click", resetActiveStates);
    };
  }
});

onBeforeUnmount(() => {
  page.isSlider = false;
  const initialSlideTime =
    slides.value[currentSlide.value - moveCurrentSlideBy.value]?.slideTime ??
    5000;

  if (cookie.isCookieActive('listeners')) {
    if (slider.value) {
      slider.value.removeEventListener("touchstart", onTouchStart);
      slider.value.removeEventListener("touchmove", onTouchMove);
      slider.value.removeEventListener("touchend", onTouchEnd);
    }
  }
  if (countdownTimer.value !== null) {
    clearInterval(countdownTimer.value as IntervalID);
  }
  stopSlide();
  initializeProgress();
});

watch(
  currentSlide,
  () => {
    resetCountdown();
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
@import "../../../assets/scss/components/cards.scss";
@include cards-container();
</style>
